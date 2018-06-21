import React from 'react';
import PropTypes from 'prop-types';

import {debounce} from 'lodash';
import assets from '../../utils/assets';

import Team from '../../models/team';
import LayoutPresenter from '../layout';

import Reactlet from "../reactlet";
import {TeamEntityPageProjects} from "../entity-page-projects.jsx";
import AddTeamProject from "../includes/add-team-project.jsx";
import {ProfileContainer, ImageButtons} from "../includes/profile.jsx";
import TeamAnalytics from "../includes/team-analytics.jsx";
import TeamMarketing from "../includes/team-marketing.jsx";
import NotFound from '../includes/not-found.jsx';
import {DataLoader} from '../includes/loader.jsx';
import Thanks from '../includes/thanks.jsx';
import AddTeamUser from '../includes/add-team-user.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import UserInfoPop from '../pop-overs/user-info-pop.jsx';
import {UserPopoversList} from '../users-list.jsx';

/*
export default function(application) {
  const assetUtils = assets(application);
  
  var self = {

    application,
    team: application.team,

    TeamProfile() {
      const propsObservable = Observable(() => {
        const team = self.team().asProps();
        const props = {
          team,
          fetched: self.team().fetched(),
          userFetched: application.currentUser().fetched(),
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
          addUserToTeam: (id) => { self.team().addUser(application, UserModel({id})); },
          removeUserFromTeam: ({id}) => { self.team().removeUser(application, UserModel({id})); },
          search: (query) => UserModel.getSearchResultsJSON(application, query).then(users => users.map(user => UserModel(user).asProps())),
          updateDescription: self.updateDescription,
          uploadAvatar: self.uploadAvatar,
          uploadCover: self.uploadCover,
          clearCover: self.clearCover,
        };
        return props;
      });

      return Reactlet(Observed, {propsObservable, component:TeamProfile}, 'team-profile');
    },

    TeamProjects() {
      const propsObservable = Observable(() => {
        const projects = self.team().projects().map(function (project) {
          let {...projectProps} = project.asProps();
          return projectProps;
        });

        return {
          closeAllPopOvers: application.closeAllPopOvers,
          isAuthorizedUser: self.currentUserIsOnTeam(),
          projects: projects,
          pins: application.team().pins(),
          projectOptions: self.projectOptions(),
        };
      });

      return Reactlet(Observed, {propsObservable, component:TeamEntityPageProjects});
    },

    projectOptions() {
      if(!self.currentUserIsOnTeam()) {
        return {};
      }

      return {
        removeProjectFromTeam: self.removeProjectFromTeam,
        togglePinnedState: self.togglePinnedState,
      };
    },

    teamAnalytics() {
      const propsObservable = Observable(() => {
        const projects = self.team().projects().map(function (project) {
          let {...projectProps} = project.asProps();
          projectProps.description = "";
          projectProps.users = [];
          return projectProps;
        });
        const id = self.team().id();

        return {
          id: id,
          api: application.api,
          projects: projects,
          currentUserOnTeam: self.currentUserIsOnTeam(),
        };
      });
      return Reactlet(Observed, {propsObservable, component:TeamAnalytics});
    },

    teamMarketing() {
      const propsObservable = Observable(() => {
        return {
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
        };
      });
      return Reactlet(Observed, {propsObservable, component:TeamMarketing});
    },

    addTeamProjectButton() {
      const propsObservable = Observable(() => {
        return {
          api: application.api,
          teamUsers: application.team().users(),
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
          addProject: (id) => {
            application.team().addProject(application, id);
          },
        };
      });
      return Reactlet(Observed, {propsObservable, component:AddTeamProject});
    },

    currentUserIsOnTeam() {
      return application.team().currentUserIsOnTeam(application);
    },

    updateDescription(text) {
      application.team().description(text);
      return self.updateTeam({description: text});
    },

    updateTeam: debounce(data => application.team().updateTeam(application, data)
      , 250),

    clearCover: () => assetUtils.updateHasCoverImage(false),

    uploadCover: assetUtils.uploadCoverFile,
    uploadAvatar: assetUtils.uploadAvatarFile,

    togglePinnedState(projectId) {
      const action = ProjectModel.isPinnedByTeam(application.team(), projectId) ? "removePin" : "addPin";
      return application.team()[action](application, projectId);
    },

    removeProjectFromTeam(projectId) {
      application.team().removeProject(application, projectId);
    },
  };

  const content = TeamTemplate(self);

  return LayoutPresenter(application, content);
}
*/

const TeamUsers = ({users, currentUserIsOnTeam, removeUserFromTeam}) => (
  <UserPopoversList users={users}>
    {(user, togglePopover) => <UserInfoPop togglePopover={togglePopover} user={user} currentUserIsOnTeam={currentUserIsOnTeam} removeUserFromTeam={() => removeUserFromTeam(user)} />}
  </UserPopoversList>
);
TeamUsers.propTypes = {
  users: PropTypes.array.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
};

const VerifiedBadge = ({image, tooltip}) => (
  <span data-tooltip={tooltip}>
    <img className="verified" src={image} alt={tooltip}/>
  </span>
);
VerifiedBadge.propTypes = {
  image: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};

const TeamPage = ({
  team: {
    id, name, thanksCount, description, users,
    isVerified, verifiedImage, verifiedTooltip,
    teamAvatarStyle, teamProfileStyle,
  },
  currentUserIsOnTeam, updateDescription,
  uploadAvatar, uploadCover, hasCoverImage, clearCover,
  addUserToTeam, removeUserFromTeam, search,
}) => (
  <main className="profile-page team-page">
    <section>
      <ProfileContainer
        avatarStyle={teamAvatarStyle} coverStyle={teamProfileStyle}
        avatarButtons={currentUserIsOnTeam ? <ImageButtons name="Avatar" uploadImage={uploadAvatar}/> : null}
        coverButtons={currentUserIsOnTeam ? <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/> : null}
      >
        <h1 className="username">
          {name}
          {isVerified && <VerifiedBadge image={verifiedImage} tooltip={verifiedTooltip}/>}
        </h1>
        <div className="users-information">
          <TeamUsers {...{users, currentUserIsOnTeam, removeUserFromTeam}}/>
          {currentUserIsOnTeam && <AddTeamUser {...{search, add: addUserToTeam, members: users.map(({id}) => id)}}/>}
        </div>
        <Thanks count={thanksCount}/>
        <AuthDescription authorized={currentUserIsOnTeam} description={description} update={updateDescription} placeholder="Tell us about your team"/>
      </ProfileContainer>
    </section>
  </main>
);

class TeamPageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.initialTeam;
  }
  
  render() {
    const props = {
      currentUserIsOnTeam: this.state.users
    };
    return <TeamPage team={this.state} {...props}/>;
  }
}

const TeamPageLoader = ({get, name, ...props}) => (
  <DataLoader get={get} renderError={() => <NotFound name={name}/>}>
    {team => team ? <TeamPageEditor initialTeam={team} {...props}/> : <NotFound name={name}/>}
  </DataLoader>
);
TeamPageLoader.propTypes = {
  get: PropTypes.func.isRequired,
  name: PropTypes.node.isRequired,
};

export default function(application, id, name) {
  const props = {
    name,
    api: application.api(),
    get: () => application.api().get(`teams/${id}`).then(({data}) => (data ? Team(data).update(data).asProps() : null)),
  };
  const content = Reactlet(TeamPageLoader, props, 'teampage');
  return LayoutPresenter(application, content);
}