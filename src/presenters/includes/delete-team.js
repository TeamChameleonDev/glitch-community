import React from 'react';
import PropTypes from 'prop-types';

import DeleteTeamPop from '../pop-overs/delete-team-pop';
import PopoverWithButton from '../pop-overs/popover-with-button';

const DeleteTeam = ({ team }) => (
  <section>
    <PopoverWithButton
      buttonClass="button-small button-tertiary has-emoji danger-zone"
      buttonText={
        <>
          Delete {team.name}
          &nbsp;
          <span className="emoji bomb" role="img" aria-label="" />
        </>
      }
    >
      {({ togglePopover }) => <DeleteTeamPop team={team} togglePopover={togglePopover} />}
    </PopoverWithButton>
  </section>
);

DeleteTeam.propTypes = {
  team: PropTypes.object.isRequired,
};

export default DeleteTeam;
