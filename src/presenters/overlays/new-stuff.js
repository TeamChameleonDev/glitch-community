import React from 'react';
import PropTypes from 'prop-types';

import { Overlay, OverlaySection, OverlayTitle } from 'Components/overlays';
import NewStuffArticle from 'Components/new-stuff/new-stuff-article';
import NewStuffPrompt from 'Components/new-stuff/new-stuff-prompt';
import NewStuffPup from 'Components/new-stuff/new-stuff-pup';
import CheckboxButton from 'Components/buttons/checkbox-button';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import useUserPref from 'State/user-prefs';
import PopoverContainer from '../pop-overs/popover-container';

import newStuffLog from '../../curated/new-stuff-log';

const latestId = Math.max(...newStuffLog.map(({ id }) => id));

//update so you can't tab? or maybe tab closes overlay
const NewStuffOverlay = ({ setShowNewStuff, showNewStuff, newStuff, setVisible,  }) => {
  React.useEffect(() => {
    const keyHandler = (event) => {
      var Dialog = this;
      var KEY_TAB = 9;

      function handleBackwardTab() {
        if ( document.activeElement === Dialog.firstFocusableEl ) {
          event.preventDefault();
          Dialog.lastFocusableEl.focus();
        }
      }
      function handleForwardTab() {
        if ( document.activeElement === Dialog.lastFocusableEl ) {
          event.preventDefault();
          Dialog.firstFocusableEl.focus();
        }
      }

      switch(event.keyCode) {
        case KEY_TAB:
          if ( Dialog.focusableEls.length === 1 ) {
            event.preventDefault();
            break;
          } 

          if (event.shiftKey) {
            handleBackwardTab();
          } else {
            handleForwardTab();
          }

          break;
        default:
          break;
      } // end switch

    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, []);
  
  return (
    <Overlay className="new-stuff-overlay" >
      <OverlaySection type="info">
        <div className="new-stuff-avatar"><NewStuffPup /></div>
        <OverlayTitle>New Stuff</OverlayTitle>
        <div className="new-stuff-toggle">
          <CheckboxButton value={showNewStuff} onChange={setShowNewStuff}>Keep showing me these</CheckboxButton>
        </div>
      </OverlaySection>
      <OverlaySection type="actions">
        {newStuff.map(({ id, ...props }) => <NewStuffArticle key={id} {...props} />)}
      </OverlaySection>
    </Overlay>
  );
};
NewStuffOverlay.propTypes = {
  setShowNewStuff: PropTypes.func.isRequired,
  showNewStuff: PropTypes.bool.isRequired,
  newStuff: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      link: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

const NewStuff = ({ children }) => {
  const { currentUser } = useCurrentUser();
  const isSignedIn = !!currentUser && !!currentUser.login;
  const [showNewStuff, setShowNewStuff] = useUserPref('showNewStuff', true);
  const [newStuffReadId, setNewStuffReadId] = useUserPref('newStuffReadId', 0);
  const [log, setLog] = React.useState(newStuffLog);
  const track = useTracker('Pupdate');

  const renderOuter = ({ visible, setVisible }) => {
    // const pupVisible = isSignedIn && showNewStuff && newStuffReadId < latestId;
    const pupVisible = true
    const show = ({ preventDefault }) => {
      track();
      setVisible(true);
      const unreadStuff = newStuffLog.filter(({ id }) => id > newStuffReadId);
      setLog(unreadStuff.length ? unreadStuff : newStuffLog);
      setNewStuffReadId(latestId);
    };

    return (
      <>
        {children(show)}
        {pupVisible && <NewStuffPrompt onClick={show} />}
        {visible && <div className="overlay-background" role="presentation" tabIndex="-1"/>}
      </>
    );
  };

  return (
    <PopoverContainer outer={renderOuter}>
      {({ visible, setVisible, focusFirstElement }) => (visible ? <NewStuffOverlay showNewStuff={showNewStuff} setShowNewStuff={setShowNewStuff} newStuff={log} setVisible={setVisible} /> : null)}
    </PopoverContainer>
  );
};
NewStuff.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NewStuff;
