import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, UnstyledButton } from '@fogcreek/shared-components';

import DeleteCollection from 'Components/collection/delete-collection-pop';

import { mediumPopover, popoverMenuButton } from '../global.styl';

export default function CollectionOptions({ collection, deleteCollection }) {
  return (
    <Popover
      align="right"
      className={mediumPopover}
      renderLabel={({ onClick, ref }) => (
        <UnstyledButton className={popoverMenuButton} onClick={onClick} ref={ref} label={`Collection options for ${collection.name}`}>
          <Icon icon="chevronDown" />
        </UnstyledButton>
      )}
    >
      {() => <DeleteCollection collection={collection} deleteCollection={deleteCollection} />}
    </Popover>
  );
}

CollectionOptions.propTypes = {
  collection: PropTypes.object.isRequired,
  deleteCollection: PropTypes.func,
};

CollectionOptions.defaultProps = {
  deleteCollection: null,
};
