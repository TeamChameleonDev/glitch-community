import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { orderBy } from 'lodash';
import { TrackClick } from './analytics';
import CollectionItem from './collection-item';
import { getLink, createCollection } from '../models/collection';
import { Loader } from './includes/loader';
import { NotificationConsumer } from './notifications';

import Heading from '../components/text/heading';

function CollectionsList({ collections: rawCollections, title, api, isAuthorized, maybeCurrentUser, maybeTeam }) {
  const [deletedCollectionIds, setDeletedCollectionIds] = useState([]);

  function deleteCollection(id) {
    setDeletedCollectionIds((ids) => [...ids, id]);
    return api.delete(`/collections/${id}`);
  }

  const collections = rawCollections.filter(({ id }) => !deletedCollectionIds.includes(id));
  const hasCollections = !!collections.length;
  const canMakeCollections = isAuthorized && !!maybeCurrentUser;

  if (!hasCollections && !canMakeCollections) {
    return null;
  }
  return (
    <article className="collections">
      <Heading tagName="h2">{title}</Heading>
      {canMakeCollections && (
        <>
          <CreateCollectionButton {...{ api, currentUser: maybeCurrentUser, maybeTeam }} />
          {!hasCollections && <CreateFirstCollection {...{ api, currentUser: maybeCurrentUser }} />}
        </>
      )}
      <CollectionsUL
        {...{
          collections,
          api,
          isAuthorized,
          deleteCollection,
        }}
      />
    </article>
  );
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeCurrentUser: PropTypes.object,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

CollectionsList.defaultProps = {
  maybeCurrentUser: undefined,
  maybeTeam: undefined,
};

const CreateFirstCollection = () => (
  <div className="create-first-collection">
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className="placeholder">Create collections to organize your favorite projects.</p>
    <br />
  </div>
);

function CreateCollectionButtton ({ api, maybeTeam, currentUser }) {
  const [loading, setLoading] = useState(false)
  const [newCollectionUrl, setNewCollectionUrl] = useState('')
  
  async function createCollectionOnClick(createNotification) {
    setLoading(true)

    const collectionResponse = await createCollection(
      api,
      null,
      maybeTeam ? maybeTeam.id : null,
      createNotification,
    );
    if (collectionResponse && collectionResponse.id) {
      const collection = collectionResponse;
      if (maybeTeam) {
        collection.team = maybeTeam;
      } else {
        collection.user = currentUser;
      }
      setNewCollectionUrl(getLink(collection));
    } else {
      // error messaging handled in createCollection
      setLoading(false)
    }
  }
}

export class CreateCollectionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      newCollectionUrl: '',
    };
    this.createCollectionOnClick = this.createCollectionOnClick.bind(this);
  }

  

  render() {
    if (this.state.newCollectionUrl) {
      return <Redirect to={this.state.newCollectionUrl} push />;
    }
    if (this.state.loading) {
      return (
        <div id="create-collection-container">
          <Loader />
        </div>
      );
    }
    return (
      <NotificationConsumer>
        {({ createNotification }) => (
          <div id="create-collection-container">
            <TrackClick name="Create Collection clicked">
              <button className="button" id="create-collection" onClick={() => this.createCollectionOnClick(createNotification)}>
                Create Collection
              </button>
            </TrackClick>
          </div>
        )}
      </NotificationConsumer>
    );
  }
}

CreateCollectionButton.propTypes = {
  api: PropTypes.any.isRequired,
  currentUser: PropTypes.object.isRequired,
  maybeTeam: PropTypes.object,
};

CreateCollectionButton.defaultProps = {
  maybeTeam: undefined,
};

export const CollectionsUL = ({ collections, deleteCollection, api, isAuthorized }) => {
  // order by updatedAt date
  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt).reverse();
  return (
    <ul className="collections-container">
      {/* FAVORITES COLLECTION CARD - note this currently references empty favorites category in categories.js
        <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      */}

      {orderedCollections.map((collection) => (
        <CollectionItem
          key={collection.id}
          {...{
            collection,
            api,
            isAuthorized,
            deleteCollection,
          }}
        />
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionsUL.defaultProps = {
  deleteCollection: () => {},
};

export default CollectionsList;
