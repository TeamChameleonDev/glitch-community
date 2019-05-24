import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Markdown from 'Components/text/markdown';
import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';
import { ProfileItem } from 'Components/profile-list';

import CollectionAvatar from '../../presenters/includes/collection-avatar';
import styles from './collection-result-item.styl';

const CollectionResultItemBase = ({ onClick, collection, active }) => (
  <div className={classnames(styles.collectionResult, active && styles.active)}>
    <TransparentButton onClick={onClick}>
      <div className={styles.resultWrap}>
        <div className={styles.avatarWrap}>
          <CollectionAvatar color={collection.coverColor} />
        </div>
        <div className={styles.resultInfo}>
          <div className={styles.resultName}>{collection.name}</div>
          {collection.description.length > 0 && (
            <div className={styles.resultDescription}>
              <Markdown renderAsPlaintext>{collection.description}</Markdown>
            </div>
          )}
          <div className={styles.profileListWrap}>
            <ProfileItem team={collection.team} user={collection.user} size="small" />
          </div>
        </div>
      </div>
    </TransparentButton>
    <div className={styles.linkButtonWrap}>
      <Button size="small" href={`/@${collection.fullUrl}`} newTab>
        View →
      </Button>
    </div>
  </div>
);

const useMembers = createAPIHook(async (api, collection) => {
  if (collection.userIDs.length) {
    const id = collection.userIDs[0]
    const user = await getSingleItem(api, `/v1/users/by/id?id=${id}`, id)
    return { ...collection, user }
  }
  if (collection.teamIDs.length) {
    const id = collection.teamIDs[0] 
    const team = await getSingleItem(api, `/v1/teams/by/id?id=${id}`, id)
    return { ...collection, team }
  }
  return {}
});

const CollectionResultWithData = (props) => {
  const { value: collectionWithMembers } = useMembers(props.project);
  return <CollectionResultItemBase {...props} colleciton={} />;
};

const CollectionResultItem = (props) => {
  // IntersectionObserver behaves strangely with element.scrollIntoView, so we'll assume if something is active it is also visible.
  const [wasEverActive, setWasEverActive] = useState(false);
  useEffect(() => {
    if (props.active) setWasEverActive(true);
  }, [props.active]);
  return (
    <VisibilityContainer>
      {({ wasEverVisible }) => (wasEverVisible || wasEverActive ? <ProjectResultWithData {...props} /> : <CollectionResultItemBase {...props} />)}
    </VisibilityContainer>
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
