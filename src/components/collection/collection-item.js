import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { AnimationContainer, slideDown, Button, Icon, Loader } from '@fogcreek/shared-components';

import Markdown from 'Components/text/markdown';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import { ProfileItem } from 'Components/profile-list';
import { CollectionLink } from 'Components/link';
import Row from 'Components/containers/row';
import ProjectItemSmall from 'Components/project/project-item-small';
import { BookmarkAvatar } from 'Components/images/avatar';
import VisibilityContainer from 'Components/visibility-container';
import { PrivateBadge } from 'Components/private-badge';

import { isDarkColor } from 'Utils/color';
import { CDN_URL } from 'Utils/constants';

import { useAPI } from 'State/api';
import { useCollectionProjects, useCollectionCurator } from 'State/collection';
import { useNotifications } from 'State/notifications';
import { useCurrentUser } from 'State/current-user';

import { createCollection } from 'Models/collection';

import CollectionOptions from './collection-options-pop';

import styles from './collection-item.styl';
import { emoji } from '../global.styl';

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
});

const ProjectsLoading = () => (
  <div className={classNames(styles.projectsContainer, styles.empty)}>
    <Loader style={{ width: '25px' }} />
  </div>
);

const MY_STUFF_PLACEHOLDER = `${CDN_URL}/ee609ed3-ee18-495d-825a-06fc588a4d4c%2Fplaceholder.svg?v=1564432183051`;

const CollectionProjects = ({ collection, isAuthorized }) => {
  const { value: projects } = useCollectionProjects(collection);
  if (!projects) return <ProjectsLoading />;

  // show placeholder text/image to encourage people to add projects to my stuff
  if (projects.length === 0 && isAuthorized && collection.isMyStuff) {
    return (
      <div className={classNames(styles.projectsContainer, styles.empty)}>
        <Image src={MY_STUFF_PLACEHOLDER} alt="" className={styles.placeholder} />
        <Text className={styles.placeholderText}>Quickly add any app on Glitch to your My Stuff collection</Text>
      </div>
    );
  }

  if (projects.length === 0 && isAuthorized) {
    return (
      <div className={classNames(styles.projectsContainer, styles.empty)}>
        <Text className={styles.emptyCollectionText}>
          This collection is empty – add some projects <Icon className={emoji} icon="index" />
        </Text>
      </div>
    );
  }
  if (projects.length === 0 && !isAuthorized) {
    return (
      <div className={classNames(styles.projectsContainer, styles.empty)}>
        <Text className={styles.emptyCollectionText}>No projects to see in this collection just yet.</Text>
      </div>
    );
  }
  const footerLabel = `View ${projects.length >= 3 ? 'all' : ''} ${projects.length} ${projects.length > 1 ? 'projects' : 'project'}`;
  return (
    <>
      <div className={styles.projectsContainer}>
        <Row className={styles.projectsList} items={projects} count={3}>
          {(project) => <ProjectItemSmall project={project} />}
        </Row>
      </div>
      <CollectionLink collection={collection} className={styles.footerLink} label={footerLabel}>
        {footerLabel} <Icon className={styles.arrow} icon="arrowRight" />
      </CollectionLink>
    </>
  );
};

const CollectionProjectsLoader = ({ collection, isAuthorized, showLoader }) => (
  <VisibilityContainer>
    {({ wasEverVisible }) =>
      showLoader && !wasEverVisible ? <ProjectsLoading /> : <CollectionProjects collection={collection} isAuthorized={isAuthorized} />
    }
  </VisibilityContainer>
);

const CollectionCurator = ({ collection }) => {
  const { value: curator } = useCollectionCurator(collection);
  return <ProfileItem {...curator} />;
};

export const CollectionCuratorLoader = ({ collection }) => (
  <VisibilityContainer>
    {({ wasEverVisible }) => (wasEverVisible ? <CollectionCurator collection={collection} /> : <ProfileItem />)}
  </VisibilityContainer>
);

// when users don't have a my stuff collection yet, we mimic it on their user page and create it once they click on it
const CreateMyStuffOnClickComponent = ({ children, className, style }) => {
  const history = useHistory();
  const api = useAPI();
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();

  const createMyStuffCollection = async () => {
    const myStuff = await createCollection({ api, name: 'My Stuff', createNotification });
    if (myStuff) {
      history.push(`@${currentUser.login}/${myStuff.url}`);
    }
  };

  return (
    <button type="submit" onClick={createMyStuffCollection} className={styles.onClickMyStuffButton} style={style}>
      <div className={className}>{children}</div>
    </button>
  );
};

export const MyStuffItem = ({ collection, isAuthorized, showLoader }) => {
  const CollectionLinkComponent = collection.fullUrl ? CollectionLink : CreateMyStuffOnClickComponent;

  return (
    <div>
      <div className={styles.collectionItem}>
        {isAuthorized && <div className={styles.header} />}
        <div className={styles.collectionItemBody} style={{ '--border-color': collection.coverColor }}>
          <CollectionLinkComponent
            collection={collection}
            className={styles.linkBody}
            style={collectionColorStyles(collection)}
            label={`${collection.private ? 'private ' : ''}${collection.name}`}
          >
            <div className={styles.avatarContainer}>
              <BookmarkAvatar />
            </div>
            <div className={styles.nameDescriptionContainer}>
              <div className={styles.itemButtonWrap}>
                <Button textWrap as="span">
                  {collection.private && <PrivateBadge type="userCollection" />}
                  {collection.name}
                </Button>
              </div>
              <div className={classNames(styles.description, { [styles.dark]: isDarkColor(collection.coverColor) })}>
                <Markdown length={100}>{collection.description || ' '}</Markdown>
              </div>
            </div>
          </CollectionLinkComponent>
          <CollectionProjectsLoader collection={collection} isAuthorized={isAuthorized} showLoader={showLoader} />
        </div>
      </div>
    </div>
  );
};

const CollectionItem = ({ collection, deleteCollection, isAuthorized, showCurator, showLoader }) => (
  <AnimationContainer animation={slideDown} onAnimationEnd={deleteCollection}>
    {(animateAndDeleteCollection) => (
      <div className={styles.collectionItem}>
        {(showCurator || isAuthorized) && (
          <div className={styles.header}>
            <div className={styles.curator}>{showCurator && <CollectionCuratorLoader collection={collection} />}</div>
            {isAuthorized && <CollectionOptions collection={collection} deleteCollection={animateAndDeleteCollection} />}
          </div>
        )}

        <div className={styles.collectionItemBody} style={{ '--border-color': collection.coverColor }}>
          <CollectionLink
            collection={collection}
            className={classNames(styles.linkBody, { [styles.showCurator]: showCurator })}
            style={collectionColorStyles(collection)}
            label={`${collection.private ? 'private ' : ''}${collection.name}`}
          >
            <div className={styles.nameDescriptionContainer}>
              <div className={styles.itemButtonWrap}>
                <Button textWrap as="span">
                  {collection.private && <PrivateBadge type={collection.teamId === -1 ? 'userCollection' : 'teamCollection'} />}
                  {collection.name}
                </Button>
              </div>
              <div className={classNames(styles.description, { [styles.dark]: isDarkColor(collection.coverColor) })}>
                <Markdown length={100}>{collection.description || ' '}</Markdown>
              </div>
            </div>
          </CollectionLink>
          <CollectionProjectsLoader collection={collection} isAuthorized={isAuthorized} showLoader={showLoader} />
        </div>
      </div>
    )}
  </AnimationContainer>
);

CollectionItem.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
  }).isRequired,
  deleteCollection: PropTypes.func,
  isAuthorized: PropTypes.bool,
  showCurator: PropTypes.bool,
  showLoader: PropTypes.bool,
};

CollectionItem.defaultProps = {
  deleteCollection: () => {},
  isAuthorized: false,
  showCurator: false,
  showLoader: true,
};

export default CollectionItem;
