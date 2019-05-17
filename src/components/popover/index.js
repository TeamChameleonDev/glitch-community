import React, { useState, useEffect, useLayoutEffect, useRef, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { debounce } from 'lodash';
import onClickOutside from 'react-onclickoutside';
import { isFragment } from 'react-is';

import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';
import styles from './styles.styl';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/

// statuses: 'closed' | 'openedFromKeyboard' | 'openedFromClick'
const PopoverToggleContext = createContext('closed');

const usePopoverToggle = ({ startOpen, onOpen }) => {
  const [visible, setStatus] = useState(startOpen ? 'openedFromKeyboard' : 'closed');
  const [openedFromKeyboard, setOpenedFromKeyboard] = useState(false);
  
  
  
  const setVisible = (newVisible) => {
    if (!visible && newVisible && onOpen) {
      onOpen();
    }
    setVisibleState(newVisible);
  };

  const togglePopover = (event) => {
    setVisible(!visible);
    if (event && event.detail === 0) {
      // opened from keyboard
      setOpenedFromKeyboard(true);
    } else {
      // opened from mouseclick
      setOpenedFromKeyboard(false);
    }
  };

  useEffect(() => {
    if (!visible) return undefined;
    const keyHandler = (event) => {
      if (['Escape', 'Esc'].includes(event.key)) {
        event.preventDefault();
        setVisible(false);
      }
    };
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
  }, [visible]);
}




const OpenedFromKeyboardContext = createContext(false);

const useOpenedFromKeyboardFocus = (focusOnDialog) => {
  const ref = useRef();
  const openedFromKeyboard = useContext(OpenedFromKeyboardContext);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !openedFromKeyboard) return;
    // focus on the dialog if there is only a destructible item in the popover that shouldn't automatically be focused on
    if (focusOnDialog) {
      dialog.focus();
    } else {
      const focusableElements =
        'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled])';
      const focusableDialogElements = dialog.querySelectorAll(focusableElements);
      if (focusableDialogElements) {
        focusableDialogElements[0].focus();
      }
    }
  }, [openedFromKeyboard]);
  return ref;
};

const usePositionAdjustment = ({ margin }) => {
  const [offset, setOffset] = useState({ top: 0, left: 0 });
  const ref = useRef();
  useLayoutEffect(() => {
    const setPosition = () => {
      const rect = ref.current.getBoundingClientRect();
      if (rect.left < margin) {
        setOffset((prevOffset) => ({ ...prevOffset, left: margin - rect.left }));
      } else if (rect.right > window.innerWidth - margin) {
        setOffset((prevOffset) => ({ ...prevOffset, left: window.innerWidth - margin - rect.right }));
      } else {
        setOffset((prevOffset) => ({ ...prevOffset, left: 0 }));
      }
    };
    const debounced = debounce(setPosition, 300);
    window.addEventListener('resize', debounced);
    setPosition();
    return () => window.removeEventListener('resize', debounced);
  }, [margin]);
  return { ref, offset };
};

const mergeRefs = (...refs) => (element) => {
  refs.forEach((ref) => {
    ref.current = element;
  });
};

const alignTypes = ['left', 'right'];
export const PopoverDialog = ({ children, align, wide, className, focusOnDialog }) => {
  const { ref: positionRef, offset } = usePositionAdjustment({ margin: 12 });
  const focusRef = useOpenedFromKeyboardFocus(focusOnDialog);
  return (
    <div className={classnames(styles.popoverWrap, wide && styles.wide, styles[align], className)}>
      <dialog ref={mergeRefs(positionRef, focusRef)} className={styles.popover} style={offset}>
        {children}
      </dialog>
    </div>
  );
};

PopoverDialog.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(alignTypes).isRequired,
  wide: PropTypes.bool,
  className: PropTypes.string,
  focusOnDialog: PropTypes.bool,
};
PopoverDialog.defaultProps = {
  wide: false,
  className: '',
  focusOnDialog: false,
};

const sectionTypes = ['primary', 'secondary', 'dangerZone'];
export const PopoverSection = ({ className, children, type }) => (
  <section className={classnames(styles.popoverSection, styles[type], className)}>{children}</section>
);

PopoverSection.propTypes = {
  type: PropTypes.oneOf(sectionTypes),
  children: PropTypes.node.isRequired,
};

PopoverSection.defaultProps = {
  type: 'primary',
};

export const PopoverActions = ({ ...props }) => <PopoverSection {...props} className={styles.popoverActions} />;

const styled = (Component, baseClassName) => ({ className, ...props }) => <Component className={classnames(className, baseClassName)} {...props} />;
export const PopoverTitle = styled('div', styles.popoverTitle);
export const InfoDescription = styled('p', styles.infoDescription);

class UnmonitoredComponent extends React.Component {
  handleClickOutside() {
    this.props.onClickOutside();
  }

  render() {
    return this.props.children;
  }
}

const MonitoredComponent = onClickOutside(UnmonitoredComponent);



export const PopoverContainer = ({ children, onOpen, outer, startOpen }) => {
  const [visible, setVisibleState] = useState(startOpen);
  const [openedFromKeyboard, setOpenedFromKeyboard] = useState(false);
  const setVisible = (newVisible) => {
    if (!visible && newVisible && onOpen) onOpen();
    setVisibleState(newVisible);
  };

  const togglePopover = (event) => {
    setVisible(!visible);
    if (event && event.detail === 0) {
      // opened from keyboard
      setOpenedFromKeyboard(true);
    } else {
      // opened from mouseclick
      setOpenedFromKeyboard(false);
    }
  };

  useEffect(() => {
    if (!visible) return undefined;
    const keyHandler = (event) => {
      if (['Escape', 'Esc'].includes(event.key)) {
        event.preventDefault();
        setVisible(false);
      }
    };
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
  }, [visible]);

  const props = { visible, setVisible, togglePopover };

  const inner = children(props);
  if (isFragment(inner)) {
    console.error('PopoverContainer does not support Fragment as the top level item. Please use a different element.');
  }
  const before = outer ? outer(props) : null;

  return (
    <OpenedFromKeyboardContext.Provider value={openedFromKeyboard}>
      {before}
      <MonitoredComponent excludeScrollbar onClickOutside={() => setVisible(false)}>
        {inner}
      </MonitoredComponent>
    </OpenedFromKeyboardContext.Provider>
  );
};
PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  outer: PropTypes.func,
  startOpen: PropTypes.bool,
};
PopoverContainer.defaultProps = {
  onOpen: null,
  outer: null,
  startOpen: false,
};

const NestedPopoverContext = createContext();

export function NestedPopover({ startAlternateVisible, alternateContent, children }) {
  const [altVisible, setAltVisible] = useState(startAlternateVisible);
  const toggle = () => setAltVisible((isVisible) => !isVisible);
  // Only use the provider on the sub menu
  // Nested consumers want the back button, not the open menu
  if (altVisible) {
    return <NestedPopoverContext.Provider value={toggle}>{alternateContent(toggle)}</NestedPopoverContext.Provider>;
  }
  return children(toggle);
}

NestedPopover.propTypes = {
  children: PropTypes.func.isRequired,
  alternateContent: PropTypes.func.isRequired,
  startAlternateVisible: PropTypes.bool,
};
NestedPopover.defaultProps = {
  startAlternateVisible: false,
};

export const NestedPopoverTitle = ({ children }) => {
  const toggle = useContext(NestedPopoverContext);
  return (
    <TransparentButton onClick={toggle} aria-label="go back">
      <PopoverSection type="secondary">
        <div className="left-arrow icon" />
        &nbsp;
        <PopoverTitle>{children}</PopoverTitle>
      </PopoverSection>
    </TransparentButton>
  );
};
NestedPopoverTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export const PopoverWithButton = ({ buttonProps, buttonText, children: renderChildren, onOpen }) => (
  <div className={styles.popoverWithButtonWrap}>
    <PopoverContainer onOpen={onOpen}>
      {({ visible, togglePopover }) => (
        <div>
          <div className={styles.buttonWrap}>
            <Button {...buttonProps} onClick={togglePopover}>
              {buttonText}
            </Button>
          </div>
          {visible && renderChildren({ togglePopover })}
        </div>
      )}
    </PopoverContainer>
  </div>
);

PopoverWithButton.propTypes = {
  buttonProps: PropTypes.object,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
};

PopoverWithButton.defaultProps = {
  buttonProps: {},
  onOpen: null,
};
