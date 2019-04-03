import React, { useEffect, useRef } from 'react';

import { Route, Switch, withRouter } from 'react-router-dom';

import categories from '../../curated/categories';
import rootTeams from '../../curated/teams';

import { useCurrentUser } from '../../state/current-user';
import { useAPI } from '../../state/api';

import IndexPage from './index';
import { FacebookLoginPage, GitHubLoginPage, GoogleLoginPage, EmailTokenLoginPage } from './login';
import JoinTeamPage from './join-team';
import QuestionsPage from './questions';
import ProjectPage from './project';
import { TeamPage, UserPage, TeamOrUserPage } from './team-or-user';
import SearchPage from './search';
import CategoryPage from './category';
import CollectionPage from './collection';
import { NotFoundPage, ProjectNotFoundPage } from './error';
import OauthSignIn from './sign-in';
import SecretPage from './secret';

/* global EXTERNAL_ROUTES */

const parse = (search, name) => {
  const params = new URLSearchParams(search);
  return params.get(name);
};

function ExternalPageReloader() {
  useEffect(() => {
    window.location.reload();
  }, []);
  return null;
}

function track() {
  try {
    const { analytics } = window;
    if (analytics) {
      analytics.page({}, { groupId: '0' });
    }
  } catch (ex) {
    console.error('Error tracking page transition.', ex);
  }
}

const PageChangeHandler = withRouter(({ location }) => {
  const { reload } = useCurrentUser();
  const isUpdate = useRef(false);
  useEffect(() => {
    if (isUpdate.current) {
      window.scrollTo(0, 0);
      reload();
    }
    isUpdate.current = true;
    track();
  }, [location.key]);
  return null;
});

const SuperUserBanner = () => {
  const { currentUser } = useCurrentUser();
  const supportAPI = useAPI('https://support-toggle.glitch.me/support/');
  const superUser = currentUser.features && currentUser.features.find((feature) => feature.name === 'super_user');
  const toggleSuperUser = () => supportAPI.post(superUser ? 'disable' : 'enable');
  const displayText = "SUPER USER MODE " + superUser ? "ENABLED UNTIL: " + new Date(superUser.expiresAt).toUTCString() }` : 'DISABLED'; 
  const { showSupportBanner } = window.localStorage;

  if (superUser || showSupportBanner) {
    return (
      <div style={{ backgroundColor: `${superUser ? 'red' : 'green'`, padding: '10px', textAlign: 'center', fontWeight: 'bold' }} >
        {displayText}
        <button onClick={toggleSuperUser}>Click to {superUser ? 'disable' : 'enable' }</button>
      </div>
    );
  }
  return null;
};

const Router = () => (
  <>
    <SuperUserBanner />
    <PageChangeHandler />
    <Switch>
      <Route path="/" exact render={({ location }) => <IndexPage key={location.key} />} />
      <Route path="/index.html" exact strict render={({ location }) => <IndexPage key={location.key} />} />

      <Route
        path="/login/facebook"
        exact
        render={({ location }) => (
          <FacebookLoginPage key={location.key} code={parse(location.search, 'code')} hash={parse(location.search, 'hash')} />
        )}
      />
      <Route
        path="/login/github"
        exact
        render={({ location }) => <GitHubLoginPage key={location.key} code={parse(location.search, 'code')} hash={parse(location.search, 'hash')} />}
      />
      <Route
        path="/login/google"
        exact
        render={({ location }) => <GoogleLoginPage key={location.key} code={parse(location.search, 'code')} hash={parse(location.search, 'hash')} />}
      />
      <Route
        path="/login/email"
        exact
        render={({ location }) => (
          <EmailTokenLoginPage key={location.key} token={parse(location.search, 'token')} hash={parse(location.search, 'hash')} />
        )}
      />

      <Route
        path="/join/@:teamUrl/:joinToken"
        exact
        render={({ match }) => (
          <JoinTeamPage key={location.key} {...match.params} /> // eslint-disable-line no-restricted-globals
        )}
      />

      <Route path="/questions" exact render={({ location }) => <QuestionsPage key={location.key} />} />

      <Route path="/~:name" exact render={({ location, match }) => <ProjectPage key={location.key} name={match.params.name} />} />
      <Route path="/~:name/404" exact render={({ location, match }) => <ProjectNotFoundPage key={location.key} name={match.params.name} />} />

      <Route path="/@:name" exact render={({ location, match }) => <TeamOrUserPage key={location.key} name={match.params.name} />} />

      <Route
        path="/@:owner/:name"
        exact
        render={({ location, match }) => <CollectionPage key={location.key} ownerName={match.params.owner} name={match.params.name} />}
      />

      <Route
        path="/user/:id(\d+)"
        exact
        render={({ location, match }) => <UserPage key={location.key} id={parseInt(match.params.id, 10)} name={`user ${match.params.id}`} />}
      />

      {Object.keys(rootTeams).map((name) => (
        <Route key={name} path={`/${name}`} exact render={({ location }) => <TeamPage key={location.key} id={rootTeams[name]} name={name} />} />
      ))}

      <Route path="/search" exact render={({ location }) => <SearchPage key={location.key} query={parse(location.search, 'q')} />} />

      {categories.map((category) => (
        <Route
          key={category.url}
          path={`/${category.url}`}
          exact
          render={({ location }) => <CategoryPage key={location.key} category={category} />}
        />
      ))}

      <Route path="/secret" exact render={({ location }) => <SecretPage key={location.key} />} />

      <Route path="/signin" exact render={({ location }) => <OauthSignIn key={location.key} />} />

      {EXTERNAL_ROUTES.map((route) => (
        <Route key={route} path={route} render={({ location }) => <ExternalPageReloader key={location.key} />} />
      ))}

      <Route render={({ location }) => <NotFoundPage key={location.key} />} />
    </Switch>
  </>
);

export default Router;
