import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import Overlay from './overlay';
import OverlaySection from './overlay-section';
import OverlayTitle from './overlay-title';

const story = storiesOf('Overlays', module);

story.add('generic', () => (
  <Overlay>
    <OverlaySection type="info">
      <OverlayTitle>
        Title
      </OverlayTitle>
    </OverlaySection>
    <OverlaySection type="actions">
      Content Section 1
    </OverlaySection>
    <OverlaySection type="actions">
      Content Section 2
    </OverlaySection>
  </Overlay>
));