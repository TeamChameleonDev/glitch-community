import React from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import Button from 'Components/buttons/button';
import Image from 'Components/images/image';
import { PopoverMenu, MultiPopover, PopoverDialog, PopoverActions, PopoverMenuButton, PopoverTitle, ActionDescription } from 'Components/popover';
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';

import { AddProjectToCollectionBase } from './add-project-to-collection-pop';

const isTeamProject = ({ currentUser, project }) => currentUser.teams.some((team) => project.teamIds.includes(team.id));

/* eslint-disable react/no-array-index-key */
const PopoverMenuItems = ({ children }) =>
  children.map(
    (group, i) =>
      group.some((item) => item.visible || item.onClick) && (
        <PopoverActions key={i} type={group.some((item) => item.dangerZone) ? 'dangerZone' : undefined}>
          {group.map((item, j) => item.onClick && <PopoverMenuButton key={j} onClick={item.onClick} label={item.label} emoji={item.emoji} />)}
        </PopoverActions>
      ),
  );

const LeaveProjectPopover = ({ project, leaveProject, togglePopover }) => {
  const { currentUser } = useCurrentUser();
  const illustration = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fwave.png?v=1502123444938';
  const trackLeaveProject = useTrackedFunc(leaveProject, 'Leave Project clicked');
  if (isTeamProject({ currentUser, project })) {
    trackLeaveProject(project);
    return null;
  }

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
        <Button type="dangerZone" onClick={() => { trackLeaveProject(project); togglePopover(); }}>
          Leave Project
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
};

const ProjectOptionsContent = ({ projectOptions, addToCollectionPopover, leaveProjectPopover }) => {
  const onClickDeleteProject = useTrackedFunc(projectOptions.deleteProject, 'Delete Project clicked');

  return (
    <PopoverDialog align="right">
      <PopoverMenuItems>
        {[
          [
            { visible: projectOptions.featureProject, onClick: projectOptions.featureProject, label: 'Feature', emoji: 'clapper' },
            { visible: projectOptions.addPin, onClick: projectOptions.addPin, label: 'Pin', emoji: 'pushpin' },
            { visible: projectOptions.removePin, onClick: projectOptions.removePin, label: 'Un-Pin', emoji: 'pushpin' },
          ],
          [{ onClick: projectOptions.displayNewNote, label: 'Add Note', emoji: 'spiralNotePad' }],
          [{ onClick: addToCollectionPopover, label: 'Add to Collection', emoji: 'framedPicture' }],
          [{ onClick: projectOptions.joinTeamProject, label: 'Join Project', emoji: 'rainbow' }],
          [
            { visible: projectOptions.leaveProject, onClick: leaveProjectPopover, label: 'Leave Project', emoji: 'wave' },
          ],
          [
            { onClick: projectOptions.removeProjectFromTeam, label: 'Remove Project', emoji: 'thumbsDown', dangerZone: true },
            { onClick: onClickDeleteProject, label: 'Delete Project', emoji: 'bomb', dangerZone: true },
            { onClick: projectOptions.removeProjectFromCollection, label: 'Remove from Collection', emoji: 'thumbsDown', dangerZone: true },
          ],
        ]}
      </PopoverMenuItems>
    </PopoverDialog>
  );
};

export default function ProjectOptionsPop({ project, projectOptions }) {
  const noProjectOptions = Object.values(projectOptions).every((option) => !option);
  // const showLeaveButton = !!projectOptions.leaveProject;

  if (noProjectOptions) return null;

  const toggleBeforeAction = (togglePopover) =>
    mapValues(
      projectOptions,
      (action) =>
        action &&
        ((...args) => {
          togglePopover();
          action(...args);
        }),
    );

  return (
    <PopoverMenu>
      {({ togglePopover }) => (
        <MultiPopover
          views={{
            addToCollection: ({ createCollection }) => (
              <AddProjectToCollectionBase
                fromProject
                project={project}
                togglePopover={togglePopover}
                addProjectToCollection={projectOptions.addProjectToCollection}
                createCollectionPopover={createCollection}
              />
            ),
            createCollection: () => <CreateCollectionWithProject project={project} addProjectToCollection={projectOptions.addProjectToCollection} />,
            leaveProject: () => <LeaveProjectPopover project={project} leaveProject={projectOptions.leaveProject} togglePopover={togglePopover} />,
          }}
        >
          {({ addToCollection, leaveProject }) => (
            <ProjectOptionsContent
              projectOptions={toggleBeforeAction(togglePopover)}
              addToCollectionPopover={addToCollection}
              leaveProjectPopover={leaveProject}
            />
          )}
        </MultiPopover>
      )}
    </PopoverMenu>
  );
}

ProjectOptionsPop.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    permissions: PropTypes.array.isRequired,
    teamIds: PropTypes.array.isRequired,
    private: PropTypes.bool,
    note: PropTypes.any,
    isAddingNewNote: PropTypes.bool,
  }).isRequired,
  projectOptions: PropTypes.object,
};

ProjectOptionsPop.defaultProps = {
  projectOptions: {},
};
