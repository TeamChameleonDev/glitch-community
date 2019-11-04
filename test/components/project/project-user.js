import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Popover, UnstyledButton, Button } from '@fogcreek/shared-components';
import ProjectUser, { PermissionsPopover } from 'Components/project/project-user';
import MockContext from '../../helpers/mockContext';
import styles from '../../../src/components/project/project-user.styl';

describe('ProjectUser', function() {
  it('renders a popover button for each user', () => {
    const props = {
      users: [{ id: 1 }, { id: 2 }],
      project: {},
      reassignAdmin: () => {},
    };
    const wrapper = shallow(<ProjectUser {...props} />);
    expect(wrapper.find(Popover)).to.have.lengthOf(2);
  });

  context('when the popover button is clicked', () => {
    it('renders a permissions popover', () => {
      const props = {
        users: [{ id: 1 }],
        project: { permissions: [] },
        reassignAdmin: () => {},
      };
      const wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <ProjectUser {...props} />
        </MockContext>,
      );
      wrapper.find(UnstyledButton).simulate('click');
      expect(wrapper.find(PermissionsPopover)).to.have.lengthOf(1);
    });
  });
});

describe('PermissionsPopover', function() {
  context('when the user in the popover is anonymous', () => {
    beforeEach(() => {
      const props = {
        user: { id: 1 },
        project: { permissions: [] },
        reassignAdmin: () => {},
      };
      this.wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <PermissionsPopover {...props} />
        </MockContext>,
      );
    });
    it('does not render a login', () => {
      expect(this.wrapper.find(`.${styles.userLogin}`)).to.have.lengthOf(0);
    });
    it('renders the word anonymous', () => {
      expect(this.wrapper.find(`.${styles.userName}`).text()).to.equal('Anonymous');
    });
  });
  context('when the user in the popover has a login and name', () => {
    beforeEach(() => {
      const props = {
        user: { id: 1, login: 'glitchWitch', name: 'Glinda the Witch' },
        project: { permissions: [] },
        reassignAdmin: () => {},
      };
      this.wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <PermissionsPopover {...props} />
        </MockContext>,
      );
    });
    it('renders the @login', () => {
      expect(this.wrapper.find(`.${styles.userLogin}`).text()).to.equal('@glitchWitch');
    });
    it('renders the name of the user', () => {
      expect(this.wrapper.find(`.${styles.userName}`).text()).to.equal('Glinda the Witch');
    });
  });
  context('when the user in the popover is the admin', () => {
    it('renders an admin badge', () => {
      const props = {
        user: { id: 1, login: 'glitchWitch', name: 'Glinda the Witch' },
        project: {
          permissions: [
            {
              userId: 1,
              accessLevel: 30,
            },
          ],
        },
        reassignAdmin: () => {},
      };
      const wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <PermissionsPopover {...props} />
        </MockContext>,
      );

      expect(wrapper.find(`.${styles.projectOwner}`)).to.have.lengthOf(1);
    });
  });
  context('when the current user is an admin and the user in the popover is not', () => {
    beforeEach(() => {
      this.props = {
        user: { id: 2, login: 'glitchWitch', name: 'Glinda the Witch' },
        project: {
          permissions: [
            {
              userId: 1,
              accessLevel: 30,
            },
          ],
        },
        reassignAdmin: sinon.spy(),
      };
      this.wrapper = mount(
        <MockContext currentUser={{ id: 1 }} location={'~projectPage'}>
          <PermissionsPopover {...this.props} />
        </MockContext>,
      );
    });

    it('renders a button to make the user in the popover the admin', () => {
      expect(this.wrapper.find(Button)).to.have.lengthOf(1);
    });

    context('and when the logged in user clicks that button', () => {
      it('calls reassign admin', () => {
        this.wrapper.find(Button).simulate('click');
        expect(this.props.reassignAdmin.called);
      });
    });
  });
});
