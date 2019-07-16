import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import ReactKonami from 'react-konami';

import Header from 'Components/header';
import Footer from 'Components/footer';
import AccountSettingsContainer from 'Components/account-settings-overlay';
import NewStuffContainer from 'Components/new-stuff';
import ErrorBoundary from 'Components/error-boundary';

import styles from './styles.styl';

const Layout = withRouter(({ children, searchQuery, history }) => {
  const focusFirst = useEffect(() => {
    const [url, hash] = window.location.href.split('#');
    if (hash) {
      const firstHeading  = document.querySelectorAll(`#${hash} > h1:first-of-type, #${hash} > h2:first-of-type`)[0];
      
      firstHeading.setAttribute('tabIndex', -1);
      firstHeading.focus();
    }
  }, []);
  
  return (
  <div className={styles.content}>
    <Helmet title="Glitch" />
    <NewStuffContainer>
      {(showNewStuffOverlay) => (
        <AccountSettingsContainer>
          {(showAccountSettingsOverlay) => (
            <div className={styles.headerWrap}>
              <Header searchQuery={searchQuery} showAccountSettingsOverlay={showAccountSettingsOverlay} showNewStuffOverlay={showNewStuffOverlay} />
            </div>
          )}
        </AccountSettingsContainer>
      )}
    </NewStuffContainer>
    <ErrorBoundary>{children}</ErrorBoundary>
    <Footer />
    <ErrorBoundary fallback={null}>
      <ReactKonami easterEgg={() => history.push('/secret')} />
    </ErrorBoundary>
  </div>
);
});
                          
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};
Layout.defaultProps = {
  searchQuery: '',
};

export default Layout;
