import React from 'react';
import PropTypes from 'prop-types';

import {reject} from 'lodash';

export default class EntityEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.state.initial;
  }
  
  updateFields(changes) {
    return this.props.api.patch(`${this.props.type}/${this.state.id}`, changes).then(() => {
      this.setState(changes);
    });
  }
  
  addItem(remoteField, remoteId, localField, localModel) {
    return this.props.api.post(`${this.props.type}/${this.state.id}/${remoteField}/${remoteId}`).then(() => {
      this.setState(prev => ({[localField]: [...prev[localField], localModel]}));
    });
  }
  
  removeItem(remoteField, remoteId, localField, localModel) {
    return this.props.api.delete(`teams/${this.state.id}/${remoteField}/${remoteId}`).then(() => {
      this.setState(prev => ({[localField]: reject(prev[localField], localModel)}));
    });
  }
  
  render() {
    return this.children({
      entity: this.state,
      updateFields: this.updateFields.bind(this),
      addItem: this.addItem.bind(this),
      removeItem: this.removeItem.bind(this),
    });
  }
}

EntityEditor.propTypes = {
  api: PropTypes.any.isRequired,
  initial: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};