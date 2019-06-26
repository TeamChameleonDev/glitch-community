import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames/bind';
import { values, sampleSize } from 'lodash';

import Image from 'Components/images/image';
import { TeamAvatar, ProjectAvatar } from 'Components/images/avatar';
import Text from 'Components/text/text';
import Markdown from 'Components/text/markdown';
import Heading from 'Components/text/heading';
import Button from 'Components/buttons/button';
import Link from 'Components/link';
import Embed from 'Components/project/embed';
import Layout from 'Components/layout';
import Loader from 'Components/loader';
import VisibilityContainer from 'Components/visibility-container';
import { useAPI } from 'State/api';
import { useTracker } from 'State/segment-analytics';
import { getRemixUrl } from 'Models/project';
import { getLink as getTeamLink } from 'Models/team';
import { emojiPattern } from 'Shared/regex';

import styles from './create.styl';

function RemixButton({ app, type, size, emoji, children }) {
  const trackRemix = useTracker('Click Remix', {
    baseProjectId: app.id,
    baseDomain: app.domain,
    origin: '/create',
  });

  return (
    <Button href={getRemixUrl(app.domain)} onClick={() => trackRemix()} type={type} size={size} emoji={emoji}>
      {children}
    </Button>
  );
}

const Mark = ({ color, children }) => (
  <span className={styles.mark} style={{ '--mark-color': color }}>
    <span className={styles.markText}>{children}</span>
  </span>
);

const Unmarked = ({ children }) => <span className={styles.unmarked}>{children}</span>;

function Banner() {
  const illustration = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fillustration.svg?v=1561575405393';
  const shape = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fshape-pattern.svg?v=1561575627767';

  return (
    <section className={classNames(styles.section, styles.banner)}>
      <div className={styles.bannerShape} style={{ backgroundImage: `url(${shape})` }}>
        <div className={styles.bannerText}>
          <Heading className={styles.bannerTagline} tagName="h1">
            <Mark color="#fbf2b8">Create</Mark>
            <Unmarked>the app of your dreams</Unmarked>
          </Heading>
          <Text>Whether you're new to code or an experienced developer, Glitch is the fastest tool for turning your ideas into web apps.</Text>
          <div className={styles.bannerRemixBtn}>
            <RemixButton app={{ id: '929980a8-32fc-4ae7-a66f-dddb3ae4912c', domain: 'hello-webpage' }} type="cta">
              Remix Hello World
            </RemixButton>
          </div>
        </div>
      </div>

      <div className={styles.bannerIllustration}>
        <Image src={illustration} alt="" />
      </div>
    </section>
  );
}

const WhatIsGlitch = () => (
  <section className={classNames(styles.section, styles.whatIsGlitch)}>
    <div>
      <Heading className={styles.h2} tagName="h2">
        <Mark color="#d7a6f9">What is Glitch?</Mark>
      </Heading>
      <div className={classNames(styles.sectionDescription, styles.whatIsGlitchDescription)}>
        <Text size="16px">Glitch is a collaborative programming environment that lives in your browser and deploys your code as you type.</Text>
        <Text size="16px">Use Glitch to build anything from static webpages to fullstack Node apps.</Text>
      </div>
    </div>
    <div className={styles.whatIsGlitchVideo} />
  </section>
);

const FRAMEWORK_STARTERS = [
  {
    name: 'React',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Freact-logo.svg?v=1561557350494',
    color: '#000',
    domain: 'starter-react',
  },
  {
    name: 'Ember',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fember-logo.svg?v=1561557345876',
    color: '#f8d1d5',
    domain: 'ember',
  },
  {
    name: 'Nuxt',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fnuxt-logo.svg?v=1561557346924',
    color: '#ebfef5',
    domain: 'nuxt-hello-world',
  },
  {
    name: 'Vue',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fvue-logo.svg?v=1561557349215',
    color: '#ccfde5',
    domain: 'vue-ssr',
  },
  {
    name: 'Angular',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fangular-logo.svg?v=1561557349215',
    color: '#f9dcd1',
    domain: 'angular-quickstart',
  },
  {
    name: 'Svelte',
    logo: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fsvelte-logo.svg?v=1561557347852',
    color: '#f6c6b4',
    domain: 'sveltejs-template-starter',
  },
];
const PLATFORM_STARTERS = ['slack', 'twitchdev', 'material', 'trello', 'spotify', 'aframe'];
const frameworkBlob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fblob-framework.svg?v=1561575006217';
const platformBlob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fblob-platforms.svg?v=1561575219539';

const FrameworkStarterItem = (app) => (
  <div key={app.domain} style={{ '--color': app.color }} className={styles.frameworkStarter}>
    <span className={styles.frameworkLogo}>
      <Image src={app.logo} alt="" />
    </span>
    <span>
      <Heading tagName="h4">{app.name}</Heading>
      <RemixButton app={app} size="small">
        Remix {app.name} starter
      </RemixButton>
    </span>
  </div>
);

function PlatformStarterItem(team) {
  const bgColors = {
    slack: '#f9d6c6',
    material: '#b8ebe6',
    twitchdev: '#eeecfb',
    trello: '#dde5e9',
    aframe: '#aad6fb',
    spotify: '#d3f3e6',
  };

  return (
    <div className={styles.platformStarter} style={{ backgroundColor: bgColors[team.url] }} key={team.url}>
      <div className={styles.platformLogo}>
        <TeamAvatar team={team} size="large" hideTooltip />
      </div>
      <div>
        <div className={styles.platformLink}>
          <Button href={getTeamLink(team)}>{team.name}</Button>
        </div>
        <Text size="14px">
          <Markdown renderAsPlaintext>{team.description}</Markdown>
        </Text>
      </div>
    </div>
  );
}
function Starters() {
  const [platformStarters, setPlatformStarters] = useState(null);
  const api = useAPI();
  useEffect(() => {
    const fetchTeams = async () => {
      const url = `/v1/teams/by/url?url=${PLATFORM_STARTERS.join('&url=')}`;
      const { data } = await api.get(url);

      let teams = values(data);
      teams = teams.map((team) => Object.assign(team, { description: team.description.replace(emojiPattern, '') }));
      setPlatformStarters(teams);
    };
    fetchTeams();
  }, []);

  return (
    <section className={classNames(styles.section, styles.starters)}>
      <Heading className={styles.h2} tagName="h2">
        <Mark color="#F9DB91">Starters for all developers</Mark>
      </Heading>
      <Text className={classNames(styles.sectionDescription, styles.startersDescription)} size="16px">
        Remixable working apps mean you never have to start from scratch. You can even{' '}
        <Link to="https://glitch.com/help/import-git/">clone a git repo from services like GitHub and GitLab</Link> to make a copy and deploy on
        Glitch.
      </Text>

      <div className={classNames(styles.startersSection, styles.startersGrid)}>
        <div className={styles.startersInfo} style={{ backgroundImage: `url(${frameworkBlob})` }}>
          <Heading className={classNames(styles.startersHeading, styles.h3)} tagName="h3">
            Framework starters
          </Heading>
          <Text size="16px">Build off the most popular JavaScript frameworks</Text>
        </div>
        {FRAMEWORK_STARTERS.map(FrameworkStarterItem)}
      </div>

      <div className={classNames(styles.startersSection, styles.startersGrid)}>
        <div className={styles.startersInfo} style={{ backgroundImage: `url(${platformBlob})` }}>
          <Heading className={classNames(styles.startersHeading, styles.h3)} tagName="h3">
            Platform starters
          </Heading>
          <Text size="16px">Your favorite companies use Glitch to share quickstart apps for getting up and running with their APIs.</Text>
        </div>
        {platformStarters ? platformStarters.map(PlatformStarterItem) : <Loader />}
      </div>
    </section>
  );
}

function Collaborate() {
  const title = 'Build collaboratively';
  const description =
    'Invite friends to work alongside you, right in the same project. Anyone with a browser can jump in and pick up where you left off.';
  const highlights = [
    'Work on public or private projects',
    'Secrets like API keys are stored in a private .env file only accessible to your collaborators',
  ];
  const smallVideo = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fmedium-collaborate.mp4?v=1561489721760';
  const video = 'https://cdn.glitch.com/170fbc25-c897-4ada-867b-7253ece0859a%2Fcollaboration-large.mp4?v=1560968406269';
  const blob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbean.svg?v=1561575068069';
  const pyramid = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fpyramid.svg?v=1561575628218';

  return (
    <ScreencapSection
      title={title}
      description={description}
      highlights={highlights}
      video={video}
      smallVideos={[smallVideo]}
      blob={blob}
      image={pyramid}
      imageName="pyramid"
      markColor="#c9c4fa"
    />
  );
}

function YourAppIsLive() {
  const title = 'Your app is live, instantly';
  const description =
    "There's no deployment setup—as soon as you create a new project, your Glitch app is live with its own URL. Share or embed your app anywhere, and invite others to check out your code or remix it.";
  const highlights = ['Supports custom domains'];
  const smallVideo1 = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fmedium-live.mp4?v=1561489723907';
  const smallVideo2 = 'https://cdn.glitch.com/170fbc25-c897-4ada-867b-7253ece0859a%2Flive-small-app.mp4?v=1560959054771';
  const video = 'https://cdn.glitch.com/170fbc25-c897-4ada-867b-7253ece0859a%2Flive-large.mp4?v=1560957595266';
  const blob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fwhale.svg?v=1561575626899';
  const mic = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flive.svg?v=1561575404922';

  return (
    <ScreencapSection
      title={title}
      description={description}
      highlights={highlights}
      video={video}
      smallVideos={[smallVideo1, smallVideo2]}
      blob={blob}
      image={mic}
      imageName="mic"
      markColor="#9fe9ff"
    />
  );
}

function ScreencapSection({ title, description, video, smallVideos, highlights, blob, image, imageName, markColor }) {
  return (
    <section className={styles.section}>
      <Heading className={styles.h2} tagName="h2">
        <Mark color={markColor}>{title}</Mark>
      </Heading>

      <Text className={classNames(styles.sectionDescription, styles.screencapDescription)} size="16px">
        {description}
      </Text>

      <VisibilityContainer>
        {({ wasEverVisible }) =>
          wasEverVisible ? (
            <>
          
      const Videos = ({ bigVideo, smallVideos }) (
        <div className={styles.screencapContainer}>
          {smallVideos.map((v) => (
            <video
              key={v}
              className={classNames(styles.screencap, styles.smallScreencap, styles[smallVideos.length])}
              autoPlay
              playsInline
              loop
              muted
            >
              <source src={v} />
            </video>
          ))}

          <video className={classNames(styles.screencap, styles.bigScreencap)} autoPlay playsInline loop muted>
            <source src={video} />
          </video>

          <div className={classNames(styles.screencapBlob, styles.blobContainer)}>
            <div className={styles.blob}>
              <Image src={blob} alt="" />
            </div>
            <div className={classNames(styles[imageName], styles.blobImage)}>
              <Image src={image} alt="" />
            </div>
          </div>
        </div>

        <div className={styles.screencapHighlights}>
          {highlights.map((highlight) => (
            <div key={highlight} className={styles.screencapHighlight}>
              <hr className={styles.screencapSquiggle} style={{ '--color': markColor }} />
              <Text className={styles.screencapHighlight} key={Date.now()}>
                {highlight}
              </Text>
            </div>
          ))}
        </div>
      );
            </>
          ) : <div aria-hidden="true" style={{ height: '500px'}}></div>
        }
      </VisibilityContainer>
    </section>
  );
}

function Help() {
  const blob = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fboomerang.svg?v=1561575218038';
  const ambulance = 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Ffiretruck.svg?v=1561575219950';

  return (
    <section className={classNames(styles.section, styles.help)}>
      <Heading className={styles.h2} tagName="h2">
        <Mark color="#f8d3c9">Help whenever you need it</Mark>
      </Heading>
      <Text className={styles.sectionDescription}>Still have questions about Glitch? We're here to lend a hand.</Text>

      <div className={styles.helpLinks}>
        <div className={styles.helpLinkSection}>
          <Heading tagName="h3">Help Center</Heading>
          <Text>The best place to find answers to FAQs.</Text>
          <Text>
            <Button href="https://glitch.com/help">
              Help Center <span aria-hidden="true">&rarr;</span>
            </Button>
          </Text>
        </div>

        <hr />

        <div aria-hidden="true" className={classNames(styles.helpImage, styles.blobContainer)}>
          <div className={styles.blob}>
            <Image src={blob} alt="" />
          </div>
          <div className={classNames(styles.ambulance, styles.blobImage)}>
            <Image src={ambulance} alt="" />
          </div>
        </div>

        <div className={styles.helpLinkSection}>
          <Heading tagName="h3">Support Forum</Heading>
          <Text>Personalized support for your app-specific questions.</Text>
          <Text>
            <Button href="https://support.glitch.com">
              Forums <span aria-hidden="true">&rarr;</span>
            </Button>
          </Text>
        </div>
      </div>
    </section>
  );
}

function Remix() {
  const allApps = [
    'starter-chartjs',
    'starter-leaflet',
    'starter-react',
    'data-dashboard',
    'hello-tensorflow',
    'airtable-example',
    'float-layout',
    'hello-magenta',
  ];
  const api = useAPI();
  const [apps, setApps] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchApps = async (domains) => {
      const url = `/v1/projects/by/domain?domain=${domains.join('&domain=')}`;
      const { data } = await api.get(url);
      setApps(values(data));
    };
    fetchApps(sampleSize(allApps, 5));
  }, []);

  return (
    <section className={classNames(styles.section, styles.remix)}>
      <Heading className={styles.h2} tagName="h2">
        <Mark color="#FBF2B8">Remix any app to get started</Mark>
      </Heading>

      <VisibilityContainer>
        {({ wasEverVisible }) => {
          wasEverVisible ? (
            <Tabs selectedIndex={currentTab} onSelect={(tabIndex) => setCurrentTab(tabIndex)}>
              <TabList className={styles.remixAppTabs}>
                {apps.map((app) => (
                  <Tab className={styles.remixAppTab} key={app.domain}>
                    <ProjectAvatar project={app} hideTooltip />
                    <Text size="14px">{app.domain}</Text>
                  </Tab>
                ))}
              </TabList>

              {apps.map((app) => (
                <TabPanel key={app.domain}>
                  <div className={styles.embedContainer}>
                    <Embed domain={app.domain} />
                  </div>
                  <div className={styles.embedRemixBtn}>
                    <RemixButton type="cta" emoji="microphone" app={app}>
                      Remix your own
                    </RemixButton>
                  </div>
                </TabPanel>
              ))}
            </Tabs>
          ) : <div aria-hidden="true" style={{ height: '500px'}}></div>;
        }}
      </VisibilityContainer>
    </section>
  );
}

function Categories() {
  const categories = [
    {
      name: 'Games',
      color: '#fae3d1',
      url: '/games',
      icon: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Ftetris.svg?v=1561575626455',
    },
    {
      name: 'Bots',
      color: '#c7bff0',
      url: '/handy-bots',
      icon: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbot.svg?v=1561575218667',
    },
    {
      name: 'Music',
      color: '#a9c4f7',
      url: '/music',
      icon: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fmusic.svg?v=1561575625725',
    },
    {
      name: 'Art',
      color: '#f2a7bb',
      url: '/art',
      icon: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fart.svg?v=1561575091996',
    },
    {
      name: 'Productivity',
      color: '#7aa4d3',
      url: '/tools-for-work',
      icon: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fwork.svg?v=1561575627331',
    },
    {
      name: 'Hardware',
      color: '#6cd8a9',
      url: '/hardware',
      icon: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fhardware.svg?v=1561575405808',
    },
    {
      name: 'Building Blocks',
      color: '#65cad2',
      url: '/building-blocks',
      icon: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbuilding-blocks.svg?v=1561575219123',
    },
    {
      name: 'Learn to Code',
      color: '#f8d3c8',
      url: '/learn-to-code',
      icon: 'https://cdn.glitch.com/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flearn.svg?v=1561575404279',
    },
  ];
  return (
    <section className={classNames(styles.categories, styles.section)}>
      <Text>...or browse starter apps for inspiration</Text>

      <ul className={styles.categoriesGrid}>
        {categories.map((category) => (
          <li key={category.url} className={styles.categoriesGridItem} style={{ '--bgColor': category.color }}>
            <Link to={category.url}>
              <Image src={category.icon} alt="" />
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const CreatePage = () => (
  <div style={{ background: '#f5f5f5' }}>
    <Layout>
      <main className={styles.main}>
        <Banner />
        <WhatIsGlitch />
        <Starters />
        <Collaborate />
        <YourAppIsLive />
        <Help />
        <Remix />
        <Categories />
      </main>
    </Layout>
  </div>
);

export default CreatePage;
