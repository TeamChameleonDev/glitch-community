import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from  '../../models/project';
import {StaticUsersList} from '../users-list.jsx';

const ProjectResultItem = ({id, domain, description, users, action, isActive, isPrivate, cdnUrl}) => {
  const activeClass = isActive ? "active" : "";
  const privateClass = isPrivate ? "private" : "";
  const resultClass = `button-unstyled result result-project ${activeClass} ${privateClass}`;

  return (
    <div>
      <button className={resultClass} onClick={action} data-project-id={id}>
        <img className="avatar" src={getAvatarUrl(id, cdnUrl)} alt={`Project avatar for ${domain}`} onError={(e) => {e.target.src = 'https://cdn.glitch.com/4d5adefc-986d-4406-8b38-898e95610bc7%2Fnpm.png?1538079784799'}}/>
        <div className="results-info">
          <div className="result-name" title={domain}>{domain}</div>
          { description.length > 0 && <div className="result-description">{description}</div> }
          { users.length > 0 && <StaticUsersList users={users} /> }
        </div>
      </button>
      <a href={`/~${domain}`} className="view-result-link" target="_blank" rel="noopener noreferrer">
        <button className="view-project button-small button-docs">
          View →
        </button>
      </a>
    </div>
  );
};

ProjectResultItem.propTypes = {
  action: PropTypes.func.isRequired,
  domain: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  isActive: PropTypes.bool,
  isPrivate: PropTypes.bool,
};

export default ProjectResultItem;

