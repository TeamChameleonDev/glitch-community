import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectsList from 'Components/containers/projects-list';
import Loader from 'Components/loader';
import CoverContainer from 'Components/containers/cover-container';
import { UserLink } from 'Components/link';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import { getAvatarStyle } from 'Models/user';

import { useCurrentUser } from '../../state/current-user';
import ProjectsLoader from '../../presenters/projects-loader';
import SignInPop from '../../presenters/pop-overs/sign-in-pop';
import styles from './styles.styl';

const SignInNotice = () => (
  <div className={styles.anonUserSignUp}>
    <span>
      <SignInPop /> to keep your projects.
    </span>
  </div>
);

const ClearSession = ({ clearUser }) => {
  function clickClearSession() {
    if (
      // eslint-disable-next-line
      !window.confirm(`All activity from this anonymous account will be cleared.  Are you sure you want to continue?`)
    ) {
      return;
    }
    clearUser();
  }

  return (
    <div className={styles.clearSession}>
      <Button onClick={clickClearSession} size="small" type="tertiary" matchBackground>
        Clear Session <Emoji name="balloon" />
      </Button>
    </div>
  );
};

const RecentProjects = () => {
  const { currentUser, fetched, clear } = useCurrentUser();
  const isAnonymousUser = !currentUser.login;

  return (
    <section className="profile recent-projects">
      <Heading tagName="h2">
        <UserLink user={currentUser}>Your Projects →</UserLink>
      </Heading>
      {isAnonymousUser && <SignInNotice />}
      <CoverContainer type="user" item={currentUser}>
        <div className="profile-avatar">
          <div className="user-avatar-container">
            <UserLink user={currentUser}>
              <div className={`user-avatar ${isAnonymousUser ? 'anon-user-avatar' : ''}`} style={getAvatarStyle(currentUser)} alt="" />
            </UserLink>
          </div>
        </div>
        <article className={styles.projectsWrap}>
          {fetched ? (
            <ProjectsLoader projects={currentUser.projects.slice(0, 3)}>
              {(projects) => <ProjectsList layout="row" projects={projects} />}
            </ProjectsLoader>
          ) : (
            <Loader />
          )}
        </article>
        {isAnonymousUser && <ClearSession clearUser={clear} />}
      </CoverContainer>
    </section>
  );
};

export default RecentProjects;
