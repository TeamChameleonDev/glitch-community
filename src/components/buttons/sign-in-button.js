import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Button from 'Components/buttons/button';

import useLocalStorage from 'State/local-storage';

/* global FACEBOOK_CLIENT_ID, GITHUB_CLIENT_ID, APP_URL, API_URL */

function facebookAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', FACEBOOK_CLIENT_ID);
  params.append('scope', 'email');
  params.append('redirect_uri', `${APP_URL}/login/facebook`);
  return `https://www.facebook.com/v2.9/dialog/oauth?${params}`;
}

function githubAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', GITHUB_CLIENT_ID);
  params.append('scope', 'user:email');
  params.append('redirect_uri', `${APP_URL}/login/github`);
  return `https://github.com/login/oauth/authorize?${params}`;
}

function googleAuthLink() {
  const params = new URLSearchParams();
  const callbackURL = `${APP_URL}/login/google`;
  params.append('callbackURL', callbackURL);
  return `${API_URL}/auth/google?${params}`;
}

function slackAuthLink() {
  const params = new URLSearchParams();
  const callbackURL = `${APP_URL}/login/slack`;
  params.append('callbackURL', callbackURL);
  return `${API_URL}/auth/slack?${params}`;
}

const companies = {
  facebook: {
    name: 'Facebook',
    emoji: 'facebook',
    href: facebookAuthLink(),
  },
  github: {
    name: 'GitHub',
    emoji: 'octocat',
    href: githubAuthLink(),
  },
  google: {
    name: 'Google',
    emoji: 'google',
    href: googleAuthLink(),
  },
  slack: {
    name: 'Slack',
    emoji: 'slack',
    href: slackAuthLink(),
  },
};

export const companyNames = Object.keys(companies);

const SignInButton = ({ companyName, onClick, short }) => {
  const { name, emoji, href } = companies[companyName];

  const [, setDestination] = useLocalStorage('destinationAfterAuth');

  const setDestinationAnd = (then) =>
    setDestination({
      expires: dayjs()
        .add(10, 'minutes')
        .toISOString(),
      to: {
        pathname: location.pathname,
        search: location.search,
      },
    });

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button href={href} onClick={onClick} size="small" emoji={emoji}>
        {short ? name : `Sign in with ${name}`}
      </Button>
    </div>
  );
};

SignInButton.propTypes = {
  companyName: PropTypes.oneOf(companyNames).isRequired,
  short: PropTypes.bool,
};

SignInButton.defaultProps = {
  short: false,
};

export default SignInButton;
