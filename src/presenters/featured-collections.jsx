import React from 'react';
import PropTypes from 'prop-types';
import {sampleSize} from 'lodash';
import {captureException} from '../utils/sentry';

import {featuredCollections} from '../curated/collections';
import {getContrastTextColor, hexToRgbA} from '../models/collection';

import CollectionAvatar from './includes/collection-avatar';
import {CollectionLink} from './includes/link';
import {ProjectsUL} from './projects-list';
import ProjectsLoader from './projects-loader';

const CollectionWide = ({collection, api}) => {
  const dark = getContrastTextColor(collection.coverColor) === 'white' ? 'dark' : '';
  return (
    <article className={`collection-wide ${dark} projects`} style={{backgroundColor: collection.coverColor}}>
      <header className="collection">
        <CollectionLink className="collection-name" collection={collection}>
          <h2>{collection.name}</h2>
        </CollectionLink>
        <CollectionLink className="collection-image-container" collection={collection}>
          <CollectionAvatar backgroundColor={hexToRgbA(collection.coverColor)}/>
        </CollectionLink>
        <p className="collection-description">{collection.description}</p>
      </header>
      <ProjectsLoader api={api} projects={collection.projects}>
        {projects => <ProjectsUL projects={projects}/>}
      </ProjectsLoader>
      <CollectionLink collection={collection} className="collection-view-all">View all {collection.projectCount} projects →</CollectionLink>
    </article>
  );
};

CollectionWide.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  api: PropTypes.any.isRequired,
};

class FeaturedCollections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: {},
    };
  }
  
  async loadCollection(n, info) {
    try {
      let collections = [];
      if (info.team) {
        const {data: teamId} = await this.props.api.get(`teamid/byUrl/${info.team}`);
        if (teamId !== 'NOT FOUND') {
          const {data} = await this.props.api.get(`collections?teamId=${teamId}`);
          collections = data;
        }
      } else if (info.user) {
        const {data: userId} = await this.props.api.get(`userid/byLogin/${info.user}`);
        if (userId !== 'NOT FOUND') {
          const {data} = await this.props.api.get(`collections?userId=${userId}`);
          collections = data;
        }
      }
      const collection = collections.find(c => c.url === info.url);
      if (collection) {
        const {data} = await this.props.api.get(`collections/${collection.id}`);
        data.projectCount = data.projects.length;
        data.projects = sampleSize(data.projects, 3).map(p => ({...p, users: p.users||[]}));
        this.setState(({collections}) => ({collections: {...collections, [n]: data}}));
      }
    } catch (error) {
      console.log(error);
      captureException(error);
    }
  }
  
  componentDidMount() {
    featuredCollections.forEach((info, n) => {
      this.loadCollection(n, info);
    });
  }
  
  render() {
    const collections = Array.from(featuredCollections.keys()).map(n => this.state.collections[n]);
    return collections.filter(c => !!c).map(collection => (
      <CollectionWide key={collection.id} collection={collection} api={this.props.api}/>
    ));
  }
}

FeaturedCollections.propTypes = {
  api: PropTypes.any.isRequired,
};

export default FeaturedCollections;