import React from 'react';
import PropTypes from 'prop-types';

import * as assets from '../utils/assets';
import ProjectModel from '../models/project';
import UserModel from '../models/user';

import Notifications from './notifications.jsx';
import Uploader from './includes/uploader.jsx';

class TeamEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialTeam,
      _cacheAvatar: Date.now(),
      _cacheCover: Date.now(),
    };
  }
  
  handleError(error) {
    console.error(error);
    this.props.createErrorNotification();
    return Promise.reject(error);
  }
  
  async updateFields(changes) {
    const {data} = await this.props.api.patch(`teams/${this.state.id}`, changes);
    this.setState(data);
  }
  
  async uploadAvatar(blob) {
    const {data: policy} = await assets.getTeamAvatarImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasAvatarImage: true,
      backgroundColor: color,
    });
    this.setState({_cacheAvatar: Date.now()});
  }
  
  async uploadCover(blob) {
    const {data: policy} = await assets.getTeamCoverImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);

    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasCoverImage: true,
      coverColor: color,
    });
    this.setState({_cacheCover: Date.now()});
  }
  
  async addUser(id) {
    await this.props.api.post(`teams/${this.state.id}/users/${id}`);
    this.setState(({users}) => ({
      users: [...users, UserModel({id}).asProps()],
    }));
  }
  
  async removeUser(id) {
    await this.props.api.delete(`teams/${this.state.id}/users/${id}`);
    this.setState(({users}) => ({
      users: users.filter(u => u.id !== id),
    }));
    if (id === this.props.currentUserModel.id()) {
      const model = this.props.currentUserModel;
      model.teams(model.teams().filter(({id}) => id() !== this.props.team.id));
    }
  }
  
  async addProject(id) {
    await this.props.api.post(`teams/${this.state.id}/projects/${id}`);
    this.setState(({projects}) => ({
      projects: [...projects, ProjectModel({id}).asProps()],
    }));
  }
  
  async removeProject(id) {
    await this.props.api.delete(`teams/${this.state.id}/projects/${id}`);
    this.setState(({projects}) => ({
      projects: projects.filter(p => p.id !== id),
    }));
  }
  
  async addPin(id) {
    await this.props.api.post(`teams/${this.state.id}/pinned-projects/${id}`);
    this.setState(({teamPins}) => ({
      teamPins: [...teamPins, {projectId: id}],
    }));
  }
  
  async removePin(id) {
    await this.props.api.delete(`teams/${this.state.id}/pinned-projects/${id}`);
    this.setState(({teamPins}) => ({
      teamPins: teamPins.filter(p => p.projectId !== id),
    }));
  }
  
  render() {
    const handleError = this.handleError.bind(this);
    const funcs = {
      updateDescription: description => this.updateFields({description}).catch(handleError),
      addUser: id => this.addUser(id).catch(handleError),
      removeUser: id => this.removeUser(id).catch(handleError),
      uploadAvatar: () => assets.requestFile(blob => this.uploadAvatar(blob).catch(handleError)),
      uploadCover: () => assets.requestFile(blob => this.uploadCover(blob).catch(handleError)),
      clearCover: () => this.updateFields({hasCoverImage: false}).catch(handleError),
      addProject: id => this.addProject(id).catch(handleError),
      removeProject: id => this.removeProject(id).catch(handleError),
      addPin: id => this.addPin(id).catch(handleError),
      removePin: id => this.removePin(id).catch(handleError),
    };
    const currentUserId = this.props.currentUserModel.id();
    const currentUserIsOnTeam = this.state.users.some(({id}) => currentUserId === id);
    return this.props.children(this.state, funcs, currentUserIsOnTeam);
  }
}
TeamEditor.propTypes = {
  children: PropTypes.func.isRequired,
  createErrorNotification: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialTeam: PropTypes.object.isRequired,
  uploadAssetSizes: PropTypes.func.isRequired,
};

const TeamEditorContainer = ({api, children, currentUserModel, initialTeam}) => (
  <Notifications>
    {notifyFuncs => (
      <Uploader>
        {uploadFuncs => (
          <TeamEditor {...{api, currentUserModel, initialTeam}} {...uploadFuncs} {...notifyFuncs}>
            {children}
          </TeamEditor>
        )}
      </Uploader>
    )}
  </Notifications>
);
TeamEditorContainer.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUserModel: PropTypes.object.isRequired,
  initialTeam: PropTypes.object.isRequired,
};

export default TeamEditorContainer;