import React, { useState, useEffect, useContext, useRef, useMemo, createContext } from 'react';
import axios from 'axios';
import { memoize, mapValues } from 'lodash';
import { API_URL } from 'Utils/constants';
import { captureException } from 'Utils/sentry';
import { useCurrentUser } from './current-user'; // eslint-disable-line import/no-cycle

export const ApiContext = createContext();

export const getAPIForToken = memoize((persistentToken) => {
  const cache = {};
  const maxAge = 60 * 1000;
  let api;
  if (persistentToken) {
    api = axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: persistentToken,
      },
    });
  } else {
    api = axios.create({
      baseURL: API_URL,
    });
  }

  return {
    ...api,
    persistentToken,
    get: (url, config) => {
      // TODO: support params
      if (config) return api.get(url, config);
      const now = Date.now();
      if (cache[url] && cache[url].timestamp + maxAge > now) {
        return cache[url].response;
      }
      const response = api.get(url);
      cache[url] = {
        timestamp: now,
        response,
      };
      return response;
    },
  };
});

export function APIContextProvider({ children }) {
  const { persistentToken } = useCurrentUser();
  const api = getAPIForToken(persistentToken);

  const [pendingRequests, setPendingRequests] = useState([]);
  if (!api.persistentToken) {
    // stall requests until we have a persistentToken
    ['get'].forEach((method) => {
      api[method] = async (...args) => {
        const apiWithToken = await new Promise((resolve) => {
          setPendingRequests((latestPendingRequests) => [...latestPendingRequests, resolve]);
        });
        return apiWithToken[method](...args);
      };
    });
  }
  useEffect(() => {
    if (api.persistentToken && pendingRequests.length) {
      // go back and finally make all of those requests
      pendingRequests.forEach((request) => request(api));
      setPendingRequests((latestPendingRequests) => (
        latestPendingRequests.filter((request) => !pendingRequests.includes(request))
      ));
    }
  }, [api, pendingRequests]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useAPI() {
  return useContext(ApiContext);
}

const CacheContext = createContext();

export const APICacheProvider = ({ children, initial }) => {
  const api = useAPI();
  const [cache, setCache] = useState(initial);
  const [cachePending, setCachePending] = useState(new Set());
  const maxAge = 60 * 1000;

  useEffect(() => {
    const expires = Date.now();
    setCache((oldCache) => mapValues(oldCache, (data) => ({ ...data, expires })));
  }, [api.persistentToken]);

  useEffect(() => {
    if (cachePending.size) {
      cachePending.forEach(async (url) => {
        const id = Math.random();
        let result = { id, status: 'loading', expires: Infinity };
        setCache((oldCache) => ({ ...oldCache, [url]: { ...result, value: oldCache[url] && oldCache[url].value } }));
        try {
          const { data } = await api.get(url);
          result = { status: 'ready', value: data, expires: Date.now() + maxAge };
        } catch (error) {
          captureException(error);
          result = { status: 'error', error, expires: Date.now() + maxAge };
        }
        setCache((oldCache) => oldCache[url].id === id ? { ...oldCache, [url]: result } : oldCache);
      });
      setCachePending((latestCachePending) => new Set([...latestCachePending].filter((url) => !cachePending.has(url))));
    }
  }, [api, cachePending]);

  const getCached = (url) => {
    const response = cache[url] || { status: 'loading', expires: -Infinity };
    if (response.expires < Date.now() && !cachePending.has(url)) {
      setCachePending((latestCachePending) => new Set([...latestCachePending, url]));
    }
    return response;
  };

  return <CacheContext.Provider value={getCached}>{children}</CacheContext.Provider>;
};

export const useCached = (url) => {
  const getCached = useContext(CacheContext);
  return getCached(url);
};

export const useCachedItem = (url, key) => {
  const { status, value, error } = useCached(url);
  if (value) {
    if (value[key]) {
      return { status, value: value[key], error };
    }
    const realKey = Object.keys(value).find((dataKey) => dataKey.toLowerCase() === key.toLowerCase());
    if (realKey) {
      return { status, value: value[realKey], error };
    }
  }
  return { status, value, error };
};

export const useCachedPages = (url) => {
  const getCached = useContext(CacheContext);
  let lastStatus = null;
  let hasMore = true;
  const results = [];
  while (hasMore) {
    const { status, value, error } = getCached(url);
    if (status === 'error') {
      return { status, error };
    }
    if (status === 'ready') {
      results.push(...value.items);
      ({ hasMore } = value);
      url = value.nextPage;
    } else {
      hasMore = false;
    }
    lastStatus = status;
  }
  return { status: lastStatus, value: results };
};

/*
Create a hook for working with the API via async functions.
Usage:

const useTeamsAPI = createAPIHook(async (api, teamID) => {
  const team = await api.get(`/team/${teamID}`);
  const { projectIDs } = team;
  team.projects = await Promise.all(projectIDs.map(projectID => api.get(`/project/${projectID})`));
  return team;
});

function TeamWithProjects ({ teamID }) {
  const { status, value } = useTeamsAPI(teamID)

  if (status === 'loading') {
    return <Loading />
  }

  // ... render the team ...
}

*/

// we don't want to set "stale" state, e.g. if the user clicks over to a different team's page
// while the first team's data is still loading, we don't want to show the first team's data when it loads.
// this should also avoid errors from setting state on an unmounted component.
function useAsyncEffectState(initialState, handler, asyncFuncArgs) {
  const [state, setState] = useState(initialState);
  const versionRef = useRef(0);
  useEffect(() => {
    const versionWhenEffectStarted = versionRef.current;
    const setStateIfFresh = (value) => {
      if (versionWhenEffectStarted === versionRef.current) {
        setState(value);
      }
    };
    handler(setStateIfFresh, versionWhenEffectStarted);
    return () => {
      versionRef.current += 1;
    };
  }, asyncFuncArgs);
  return state;
}

export const createAPIHook = (asyncFunction, options = {}) => (...args) => {
  const api = useAPI();
  const loading = { status: 'loading' };
  const result = useAsyncEffectState(
    loading,
    async (setResult, version) => {
      // reset to 'loading' if the args change
      if (version > 0) {
        setResult(loading);
      }
      try {
        const value = await asyncFunction(api, ...args);
        setResult({ status: 'ready', value });
      } catch (error) {
        setResult({ status: 'error', error });
        if (options.captureException) {
          captureException(error);
        }
      }
    },
    args,
  );
  return result;
};

export const entityPath = ({ user, team, project, collection }) => {
  if (user) return `users/${user.id}`;
  if (team) return `teams/${team.id}`;
  if (project) return `projects/${project.id}`;
  if (collection) return `collections/${collection.id}`;
  throw new Error('Missing entity');
};

export const useAPIHandlers = () => {
  const api = useAPI();
  return useMemo(
    () => ({
      // all entities
      updateItem: (entityArgs, changes) => api.patch(`/${entityPath(entityArgs)}`, changes),
      deleteItem: (entityArgs) => api.delete(`/${entityPath(entityArgs)}`),

      // collections
      addProjectToCollection: ({ project, collection }) => api.patch(`/collections/${collection.id}/add/${project.id}`),
      orderProjectInCollection: ({ project, collection }, index) => api.post(`/collections/${collection.id}/project/${project.id}/index/${index}`),
      updateProjectInCollection: ({ project, collection }, data) => api.patch(`/collections/${collection.id}/project/${project.id}`, data),
      removeProjectFromCollection: ({ project, collection }) => api.patch(`/collections/${collection.id}/remove/${project.id}`),

      // projects
      removeUserFromProject: ({ project, user }) => api.delete(`/projects/${project.id}/authorization`, { data: { targetUserId: user.id } }),
      updateProjectDomain: ({ project }) => api.post(`/project/domainChanged?projectId=${project.id}`),
      undeleteProject: ({ project }) => api.post(`/projects/${project.id}/undelete`),

      // teams
      joinTeam: ({ team }) => api.post(`/teams/${team.id}/join`),
      inviteEmailToTeam: ({ team }, emailAddress) => api.post(`/teams/${team.id}/sendJoinTeamEmail`, { emailAddress }),
      inviteUserToTeam: ({ team, user }) => api.post(`/teams/${team.id}/sendJoinTeamEmail`, { userId: user.id }),
      revokeTeamInvite: ({ team, user }) => api.post(`/teams/${team.id}/revokeTeamJoinToken/${user.id}`),
      updateUserAccessLevel: ({ user, team }, accessLevel) => api.patch(`/teams/${team.id}/users/${user.id}`, { access_level: accessLevel }),
      removeUserFromTeam: ({ user, team }) => api.delete(`/teams/${team.id}/users/${user.id}`),
      addProjectToTeam: ({ project, team }) => api.post(`/teams/${team.id}/projects/${project.id}`),
      removeProjectFromTeam: ({ project, team }) => api.delete(`/teams/${team.id}/projects/${project.id}`),
      joinTeamProject: ({ project, team }) => api.post(`/teams/${team.id}/projects/${project.id}/join`),

      // teams / users
      addPinnedProject: ({ project, team, user }) => api.post(`/${entityPath({ team, user })}/pinned-projects/${project.id}`),
      removePinnedProject: ({ project, team, user }) => api.delete(`/${entityPath({ team, user })}/pinned-projects/${project.id}`),
    }),
    [api],
  );
};
