import React from 'react';
import PropTypes from 'prop-types';
import useUniqueId from 'Hooks/use-unique-id';
import styles from './hidden-checkbox.styl';

const HiddenCheckbox = ({ value, onChange, onFocus, onBlur, children }) => {
  const id = useUniqueId();
  return (
    <label className={styles.label} htmlFor={id}>
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        onFocus={onFocus}
        onBlur={onBlur}
        id={id}
      />
      {children}
    </label>
  );
};

HiddenCheckbox.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default HiddenCheckbox;
