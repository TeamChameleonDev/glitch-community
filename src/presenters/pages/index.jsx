import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../layout.jsx';

import {getEditorUrl} from '../../models/project';
import {CurrentUserConsumer} from '../current-user.jsx';
import Link from '../includes/link.jsx';

import Categories from '../categories.jsx';
import Featured from '../featured.jsx';
import OverlayVideo from '../overlays/overlay-video.jsx';
import Questions from '../questions.jsx';
import RandomCategories from '../random-categories.jsx';
import RecentProjects from '../recent-projects.jsx';

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}
  
class WhatIsGlitch extends React.Component {
  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }
  
  render() {
    const free = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffree.svg?1499350845981";
    const play = "https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg";
    const whatsGlitchWide = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-wide.svg?1499885209761";
    const whatsGlitchNarrow = "https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fwhats-glitch-narrow.svg?1499884900667";
    const whatsGlitchAlt = "Create a node app, or remix one. It updates as you type. Code with Friends!";
    return (
      <section className="what-is-glitch">
        <h2>How It Works</h2>
        <span>
          <Link to="/about">
            <figure title="How Glitch works">
              <img className="wide" src={whatsGlitchWide} alt={whatsGlitchAlt}/>
              <img className="narrow" src={whatsGlitchNarrow} alt={whatsGlitchAlt}/>
            </figure>
          </Link>
          <div>
            And it's <img className="free" src={free} alt="free"/>.{' '}
            <OverlayVideo>
              <div className="button video">
                <img className="play-button" src={play} alt="play"/>
                <span>How it works in 1 minute</span>
              </div>
            </OverlayVideo>
          </div>
        </span>
      </section>
    );
  }
}

const MadeInGlitch = () => (
  <section className="made-in-glitch">
    <p>Of course, this site was made on Glitch too</p>
    <Link to={getEditorUrl('community')} className="button button-link has-emoji">
      View Source <span className="emoji carp_streamer"></span>
    </Link>
  </section>
);

const IndexPage = ({api, user}) => (
  <main>
    <h1 className="headline">
      <Link to="https://glitch.com">Glitch</Link>{' '}
      is the friendly community where everyone can discover & create the best stuff on the web
    </h1>
    {!!user.login && <Questions api={api}/>}
    {!!user.projects.length && <RecentProjects api={api}/>}
    <Featured/>
    <RandomCategories api={api}/>
    <Categories/>
    {!user.login && <WhatIsGlitch/>}
    <MadeInGlitch/>
  </main>
);
IndexPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
  }),
};

const IndexPageContainer = ({api}) => (
  <Layout api={api}>
    <CurrentUserConsumer>
      {user => <IndexPage api={api} user={user}/>}
    </CurrentUserConsumer>
  </Layout>
);

export default IndexPageContainer;
