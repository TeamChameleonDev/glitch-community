/* globals CDN_URL */

let User;

import Model from './model';
const cache = {};
const cacheBuster = Math.floor(Math.random() * 1000);

export const ANON_AVATAR_URL = "https://cdn.glitch.com/f6949da2-781d-4fd5-81e6-1fdd56350165%2Fanon-user-on-project-avatar.svg?1488556279399";

export default User = function(I, self) {

  if (I == null) { I = {}; }
  if (self == null) { self = Model(I); }
  if (cache[I.id]) {
    return cache[I.id];
  }
  
  self.defaults(I, {
    id: undefined,
    avatarUrl: undefined,
    avatarThumbnailUrl: undefined,
    color: undefined,
    hasCoverImage: false,
    coverColor: "#1F33D9",
    login: null,
    name: null,
    description: "",
    projects: undefined,
    teams: [],
    thanksCount: 0,
    fetched: false,
    persistentToken: null,
    pins: [],
  });

  self.attrObservable(...Array.from(Object.keys(I) || []));
  self.attrModels('projects', Project);

  self.extend({
    asProps() {
      return {
        get teams() { return self.teams.filter(({asProps}) => !!asProps).map(({asProps}) => asProps()); },
        get projects() { return self.projects.filter(({asProps}) => !!asProps).map(({asProps}) => asProps()); },
        get pins() { return self.pins(); },

        avatarUrl: self.avatarUrl(),
        avatarThumbnailUrl: self.avatarThumbnailUrl(),
        color: self.color(),
        coverColor: self.coverColor(),
        description: self.description(),
        hasCoverImage: self.hasCoverImage(),
        id: self.id(),
        login: self.login(),
        name: self.name(),
        thanksCount: self.thanksCount(),
      };
    },
  });


  if (I.id) {
    cache[I.id] = self;
  }
  // console.log '☎️ user cache', cache

  return self;
};

User.getUserById = function(application, id) {
  const userPath = `users/${id}`;
  const promise = new Promise((resolve, reject) => {
    return application.api().get(userPath)
      .then(({data}) => resolve(data)).catch(function(error) {
        console.error(`getUserById GET ${userPath}`, error);
        return reject();
      });
  });
  return promise;
};


User._cache = cache;

export function getDisplayName({login, name}) {
  if (name) {
    return name;
  } else if (login) {
    return `@${login}`;
  }
  return 'Anonymous User';
}

export function getLink({id, login}) {
  if (login) {
    return `/@${login}`;
  }
  return `/user/${id}`;
}

export function getAvatarUrl({login, avatarUrl}) {
  if (login && avatarUrl) {
    return avatarUrl;
  }
  return ANON_AVATAR_URL;
}

export function getAvatarThumbnailUrl({login, avatarThumbnailUrl}) {
  if (login && avatarThumbnailUrl) {
    return avatarThumbnailUrl;
  }
  return ANON_AVATAR_URL;
}

export function getAvatarStyle({avatarUrl, color}) {
  return {
    backgroundColor: color,
    backgroundImage: `url('${avatarUrl || ANON_AVATAR_URL}')`,
  };
}

export function getProfileStyle({id, hasCoverImage, coverColor, cache=cacheBuster, size='large'}) {
  const customImage = `${CDN_URL}/user-cover/${id}/${size}?${cache}`;
  const defaultImage = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${hasCoverImage ? customImage : defaultImage}')`,
  };
}

// Circular dependencies must go below module.exports
import Project from './project';
