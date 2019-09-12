import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'Components/text/markdown';
import { ProfileItem } from 'Components/profile-list';
import { ResultItem, ResultInfo, ResultName, ResultDescription } from 'Components/containers/results-list';
import VisibilityContainer from 'Components/visibility-container';
import VisuallyHidden from 'Components/containers/visually-hidden';
import { useCollectionCurator } from 'State/collection';
import useDevToggle from 'State/dev-toggles';

import styles from './collection-result-item.styl';

const ProfileItemWithData = ({ collection }) => {
  const { value: curator } = useCollectionCurator(collection);
  return (
    <>
      {curator ? <VisuallyHidden>by</VisuallyHidden> : null}
      <ProfileItem {...curator} size="small" />
    </>
  );
};

const ProfileItemWrap = ({ collection }) => (
  <div className={styles.profileItemWrap}>
    <VisibilityContainer>
      {({ wasEverVisible }) => (wasEverVisible ? <ProfileItemWithData collection={collection} /> : <ProfilecItem size="small" />)}
    </VisibilityContainer>
  </div>
);

const CollectionResultItem = ({ onClick, collection, active }) => {
  const collectionIsMyStuff = useDevToggle('My Stuff') && collection.isMyStuff;
  return (
    <ResultItem active={active} onClick={onClick} href={`/@${collection.fullUrl}`}>
      { collectionIsMyStuff && 
        <div className={styles.avatarWrap}>
           <BookmarkAvatar />
          </div>
      }
      <ResultInfo>
        <VisuallyHidden>Add to collection</VisuallyHidden>
        <ResultName>{collection.name}</ResultName>
        {collection.description.length > 0 && (
          <ResultDescription>
            <VisuallyHidden>with description</VisuallyHidden>
            <Markdown renderAsPlaintext>{collection.description}</Markdown>
          </ResultDescription>
        )}
        {collection.teamId && collection.teamId !== -1 && <ProfileItemWrap collection={collection} />}
      </ResultInfo>
    </ResultItem>
  );
};

CollectionResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  active: PropTypes.bool,
};

CollectionResultItem.defaultProps = {
  active: false,
};

export default CollectionResultItem;
