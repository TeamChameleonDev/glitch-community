import React from 'react';
import { Actions, Button, DangerZone, Title } from '@fogcreek/shared-components';

const LeaveProjectPopover = ({ project, leaveProject, togglePopover }) => (
  <>
    <Title>Leave {project.domain}</Title>
    <Actions>
      <p>Are you sure you want to leave? You'll lose access to this project unless someone invites you back.</p>
    </Actions>
    <DangerZone>
      <Button
        variant="warning"
        size="small"
        onClick={() => {
          leaveProject(project);
          togglePopover();
        }}
      >
        Leave Project
      </Button>
    </DangerZone>
  </>
);

export default LeaveProjectPopover;
