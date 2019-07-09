import React, { useState } from 'react';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Button from 'Components/buttons/button';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';
import Image from 'Components/images/image';
import PasswordLogin from 'Components/sign-in/password-login';
import UseMagicCode from 'Components/sign-in/use-magic-code';
import GetMagicCode from 'Components/sign-in/get-magic-code';

import useDevToggle from 'State/dev-toggles';

import styles from './sign-in-layout.styl';

const keyImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

const TermsAndConditions = () => (
  <div className={styles.termsAndConditions}>
    By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and <Link to="/legal/#privacy">Privacy Statement</Link>
  </div>
);

const SignInLayout = () => {
  const userPasswordEnabled = useDevToggle('User Passwords');
  const slackAuthEnabled = useDevToggle('Slack Auth');
  const [page, setPage] = useState('main');
  const showMainPage = () => setPage('main');
  const showMagicPage = () => setPage('magic');

  return (
    <div className={styles.layout}>
      <div className={styles.logo}>
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className={styles.overlay}>
        <section className={styles.title}>
          {page === 'magic' && (
            <span className={styles.backArrow}>
              <span className="left-arrow icon" />
            </span>
          )}
          <h1>Sign In</h1>
        </section>
        <section className={styles.content}>
          {page === 'main' && (
            <>
              <div className={styles.oAuth}>
                <div>
                  <div className={styles.signInButtons}>
                    {companyNames
                      .filter((companyName) => {
                        return companyName !== 'slack' || slackAuthEnabled;
                      })
                      .map((companyName) => (
                        <div key={companyName} className={styles.signInButton}>
                          <SignInButton short companyName={companyName} />
                        </div>
                      ))}
                  </div>
                  <div className={styles.signInButtons}>
                    <Button emoji="loveLetter" onClick={showMagicPage}>
                      Magic Code via Email
                    </Button>
                  </div>
                </div>
                <TermsAndConditions />
              </div>
              <div className={styles.passwordAuth}>
                {userPasswordEnabled ? <PasswordLogin /> : <Image src={keyImageUrl} alt="Door and key illustration" width={200} />}
              </div>
            </>
          )}
          {page === 'magic' && (
            <>
              <div className={styles.getCode}>
                <GetMagicCode />
                <TermsAndConditions />
              </div>
              <div className={styles.useCode}>
                <UseMagicCode />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default SignInLayout;
