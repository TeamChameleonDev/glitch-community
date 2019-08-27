import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { createSlice, createAction } from 'redux-starter-kit';
import { useSelector, useDispatch } from 'react-redux';

import { getSingleItem, getAllPages, allByKeys } from 'Shared/api';
import { sortProjectsByLastAccess } from 'Models/project';
import { configureScope, captureException, captureMessage, addBreadcrumb } from 'Utils/sentry';
import useLocalStorage from './local-storage';
import { getAPIForToken } from './api'; // eslint-disable-line import/no-cycle

// sharedUser syncs with the editor and is authoritative on id and persistentToken
const sharedUserKey = 'cachedUser';
// cachedUser mirrors GET /users/{id} and is what we actually display
const cachedUserKey = 'community-cachedUser';

// takes a generator that yields promises, 
// returns an async function that restarts from the beginning every time it is called.
function runLatest (fn) {
  const state = {
    currentGenerator: null,
  };
  return async (...args) => {
    const isAlreadyRunning = state.currentGenerator;
    state.currentGenerator = fn(...args);
    if (isAlreadyRunning) return;
    
    let promiseResult = null;
    while (true) {
      const { value, done } = state.currentGenerator.next(promiseResult);
      if (done) {
        state.currentGenerator = null;
        return;
      }
      promiseResult = await value;
    }
  }
}

// Default values for all of the user fields we need you to have
// We always generate a 'real' anon user, but use this until we do
const defaultUser = {
  id: 0,
  login: null,
  name: null,
  description: '',
  color: '#aaa',
  avatarUrl: null,
  avatarThumbnailUrl: null,
  hasCoverImage: false,
  coverColor: null,
  emails: [],
  features: [],
  projects: [],
  teams: [],
  collections: [],
}

const pageMounted = createAction('app/pageMounted')
// TODO: from local storage
const currentUserChangedInAnotherWindow = createAction('currentUser/changedInAnotherWindow')


export const { reducer, actions } = createSlice({
  slice: 'currentUser',
  initialState: {
    ...defaultUser,
    status: 'loading',
  },
  reducers: {
    loadedFromCache: (_, { payload }) => ({
      ...payload,
      status: 'loading',
    }),
    loadedFresh: (_, { payload }) => ({
      ...payload,
      status: 'ready',
    }),
    // 'loading' because we're now fetching a new anonymous user
    loggedOut: (_) => ({
      ...defaultUser,
      status: 'loading',
    }),
    requestedReload: (state) => ({
      ...state,
      status: 'loading',
    }),
    // TODO: more granular actions for managing user's teams, collections etc
    updated: (state, { payload }) => ({ ...state, ...payload }),
  }
})

const load = runLatest(function * (action, store) {
  let sharedOrAnonUser = yield getFromStorage(sharedUserKey);
  
  // If we're signed out create a new anon user
  if (!sharedOrAnonUser) {
    sharedOrAnonUser = yield getAnonUser();
  }

  let newCachedUser = yield getCachedUser(sharedOrAnonUser);

  while (newCachedUser === 'error') {
    // Looks like our sharedUser is bad
    // Anon users get their token and id deleted when they're merged into a user on sign in
    const prevSharedUser = sharedOrAnonUser
    sharedOrAnonUser = yield getSharedUser(sharedOrAnonUser.persistentToken);
    setSharedUser(sharedOrAnonUser)
    logSharedUserError(prevSharedUser, sharedOrAnonUser);
    
    newCachedUser = yield getCachedUser(sharedOrAnonUser);
  } 
    
  // The shared user is good, store it
  setCachedUser(newCachedUser);
  store.dispatch(actions.loadedFresh(newCachedUser));
})


export const handlers = {
  [pageMounted]: async (action, store) => {
    const cachedUser = await getCachedUserFromStorage();
    store.dispatch(actions.loadedFromCache(cachedUser));
    await load(action, store);
  },
  [currentUserChangedInAnotherWindow]: load,
  [actions.requestedReload]: load,
  [actions.updated]: (_, store) => {
    setCachedUser(store.getState().currentUser);
  },
  [actions.loggedIn]: async (action, store) => {
    setSharedUser(action.payload);
    setCachedUser(undefined);
    await load(action, store);
  },
  [actions.loggedOut]: async (_, store) => {
    // TODO: clear localStorage
    setSharedUser(undefined);
    setCachedUser(undefined);
    const anonUser = await getAnonUser();
    store.dispatch(actions.loaded(anonUser));
  },
}


function identifyUser(user) {
  document.cookie = `hasLogin=; expires=${new Date()}`;
  if (user) {
    addBreadcrumb({
      level: 'info',
      message: `Current user is ${JSON.stringify(user)}`,
    });
    if (user.login) {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `hasLogin=true; expires=${expires}`;
    }
  } else {
    addBreadcrumb({
      level: 'info',
      message: 'logged out',
    });
  }
  try {
    if (window.analytics && user && user.login) {
      const emailObj = Array.isArray(user.emails) && user.emails.find((email) => email.primary);
      const email = emailObj && emailObj.email;
      window.analytics.identify(
        user.id,
        {
          name: user.name,
          login: user.login,
          email,
          created_at: user.createdAt,
        },
        { groupId: '0' },
      );
    }
    if (user) {
      configureScope((scope) => {
        scope.setUser({
          id: user.id,
          login: user.login,
        });
      });
    } else {
      configureScope((scope) => {
        scope.setUser({
          id: null,
          login: null,
        });
      });
    }
  } catch (error) {
    console.error(error);
    captureException(error);
  }
}

// Test if two user objects reference the same person
function usersMatch(a, b) {
  if (!a && !b) return true;
  return a && b && a.id === b.id && a.persistentToken === b.persistentToken;
}

async function getAnonUser() {
  const api = getAPIForToken();
  const { data } = await api.post('users/anon');
  return data;
}

async function getSharedUser(persistentToken) {
  if (!persistentToken) return undefined;
  const api = getAPIForToken(persistentToken);

  try {
    return await getSingleItem(api, `v1/users/by/persistentToken?persistentToken=${persistentToken}`, persistentToken);
  } catch (error) {
    if (error.response && error.response.status === 401) return undefined;
    throw error;
  }
}

async function getCachedUser(sharedUser) {
  if (!sharedUser) return undefined;
  if (!sharedUser.id || !sharedUser.persistentToken) return 'error';
  const api = getAPIForToken(sharedUser.persistentToken);
  try {
    const makeUrl = (type) => `v1/users/by/id/${type}?id=${sharedUser.id}&limit=100`;
    const makeOrderedUrl = (type, order, direction) => `${makeUrl(type)}&orderKey=${order}&orderDirection=${direction}`;
    const { baseUser, emails, projects, teams, collections } = await allByKeys({
      baseUser: getSingleItem(api, `v1/users/by/id?id=${sharedUser.id}&cache=${Date.now()}`, sharedUser.id),
      emails: getAllPages(api, makeUrl('emails')),
      projects: getAllPages(api, makeOrderedUrl('projects', 'domain', 'ASC')),
      teams: getAllPages(api, makeOrderedUrl('teams', 'url', 'ASC')),
      collections: getAllPages(api, makeUrl('collections')),
    });
    const user = { ...baseUser, emails, projects: sortProjectsByLastAccess(projects), teams, collections };
    if (!usersMatch(sharedUser, user)) return 'error';
    return user;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      // 401 means our token is bad, 404 means the user doesn't exist
      return 'error';
    }
    throw error;
  }
}
const logSharedUserError = (sharedUser, newSharedUser) => {
  console.log(`Fixed shared cachedUser from ${sharedUser.id} to ${newSharedUser && newSharedUser.id}`);
  addBreadcrumb({
    level: 'info',
    message: `Fixed shared cachedUser. Was ${JSON.stringify(sharedUser)}`,
  });
  addBreadcrumb({
    level: 'info',
    message: `New shared cachedUser: ${JSON.stringify(newSharedUser)}`,
  });
  captureMessage('Invalid cachedUser');
};


export const CurrentUserProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  return children;
};
CurrentUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCurrentUser = () => {
  const currentUser = useSelector((state) => state.currentUser)
  const dispatch = useDispatch()
  return {
    currentUser,
    fetched: currentUser.status === 'ready',
    persistentToken: currentUser.persistentToken,
    reload: () => dispatch(actions.requestedReload()),
    login: (data) => dispatch(actions.loggedIn(data)),
    update: (data) => dispatch(actions.updated(data)),
    clear: () => dispatch(actions.loggedOut()),
  }
}

export const useSuperUserHelpers = () => {
  const { currentUser: cachedUser } = useCurrentUser();
  const superUserFeature = cachedUser && cachedUser.features && cachedUser.features.find((feature) => feature.name === 'super_user');

  return {
    toggleSuperUser: async () => {
      if (!cachedUser) return;
      const api = getAPIForToken(cachedUser.persistentToken);
      await api.post(`https://support-toggle.glitch.me/support/${superUserFeature ? 'disable' : 'enable'}`);
      window.scrollTo(0, 0);
      window.location.reload();
    },
    canBecomeSuperUser:
      cachedUser && cachedUser.projects && cachedUser.projects.filter((p) => p.id === 'b9f7fbdd-ac07-45f9-84ea-d484533635ff').length > 0,
    superUserFeature,
  };
};
