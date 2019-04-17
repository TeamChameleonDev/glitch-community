import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import { ProfileItem } from 'Components/profile/profile-list';

import CollectionAvatar from '../../presenters/includes/collection-avatar';

import styles from './collection-item.styl';

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
});

const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />;

const CollectionLink = ({ collection, children, ...props }) => (
  <a href={`/@${collection.fullUrl}`} {...props}>
    {children}
  </a>
);

const SmallCollectionItem = ({ collection }) => (
  <div className={styles.smallContainer}>
    <div className={styles.curator}>
      <ProfileItem user={collection.user} team={collection.team} />
    </div>
    <CollectionLink collection={collection} style={collectionColorStyles(collection)}>
      <div className={styles.smallNameDescriptionArea}>
        <div className={styles.nameArea}>
          <div className={styles.collectionAvatarContainer}>
            <CollectionAvatar color={collection.coverColor} collectionId={collection.id} />
          </div>
          <div className={styles.collectionNameWrap}>
            <Button decorative>
              {collection.private && <PrivateIcon />}
              <div className={styles.collectionName}>{collection.name}</div>
            </Button>
          </div>
        </div>
        <div className={styles.description}>
          <Markdown>{collection.description || ' '}</Markdown>
        </div>
      </div>
    </CollectionLink>
    <ProjectsPreview collection={collection} />
    <CollectionLink collection={collection}>
      {collection.projects.length}
      <Pluralize count={collection.projects.length} singular="project" /> →
    </CollectionLink>
  </div>
);

SmallCollectionItem.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    userId: PropTypes.number,
    teamId: PropTypes.number,
  }).isRequired,
};

export default SmallCollectionItem;
