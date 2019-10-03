import React from 'react';

import Image from 'Components/images/image';
import Button from 'Components/buttons/button';
import { PopoverDialog, PopoverActions, PopoverTitle, ActionDescription } from 'Components/popover';
import { useTrackedFunc } from 'State/segment-analytics';

const LeaveProjectPopover = ({ project, leaveProject, togglePopover, align }) => {
  const illustration = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fwave.png?v=1502123444938';
  const useTrackedLeaveProject = (leaveProject) => useTrackedFunc(leaveProject, 'Leave Project clicked');
  const trackLeaveProject = useTrackedLeaveProject(leaveProject);

  return (
    <PopoverDialog wide focusOnDialog align="right">
      <PopoverTitle>Leave {project.domain}</PopoverTitle>
      <PopoverActions>
        <Image height="50px" width="auto" src={illustration} alt="" />
        <ActionDescription>
          Are you sure you want to leave? You'll lose access to this project unless someone else invites you back.
        </ActionDescription>
      </PopoverActions>
      <PopoverActions type="dangerZone">
        <Button
          variant="warning"
          onClick={() => {
            trackLeaveProject(project);
            togglePopover();
          }}
        >
          Leave Project
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
};

export default LeaveProjectPopover;

