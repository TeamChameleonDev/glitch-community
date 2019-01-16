import React from 'react';
import PropTypes from 'prop-types';

import {DEFAULT_TEAM_AVATAR, getAvatarUrl as getTeamAvatarUrl} from '../../models/team';
import {ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName} from '../../models/user';

// UserAvatar

export const Avatar = ({name, src, color, srcFallback, type}) => (
  <div data-tooltip={name} data-tooltip-left="true">
    <img width="32px" height="32px" src={src} alt={name}
      style={color ? {backgroundColor: color} : null}
      onError={srcFallback ? (event => event.target.src = srcFallback) : null}
      className={type + "-avatar"}
    />
  </div>
);
Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcFallback: PropTypes.string,
  color: PropTypes.string,
  type: PropTypes.string,
};

export const StaticAvatar = ({name, src, color, srcFallback, type}) => (
  <img width="32px" height="32px" src={src} alt={name}
    style={color ? {backgroundColor: color} : null}
    onError={srcFallback ? (event => event.target.src = srcFallback) : null}
    className={type + "-avatar"}
  />
);

export const TeamAvatar = ({team}) => (
  <Avatar name={team.name} src={getTeamAvatarUrl({...team, size:'small'})} srcFallback={DEFAULT_TEAM_AVATAR} type="team"/>
);
TeamAvatar.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
  }).isRequired,
};

export const UserAvatar = ({user, suffix=''}) => (
  <Avatar name={getDisplayName(user) + suffix} src={getAvatarThumbnailUrl(user)} color={user.color} srcFallback={ANON_AVATAR_URL} type="user"/>
);
UserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    name: PropTypes.string,
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
  }).isRequired,
  suffix: PropTypes.string,
};