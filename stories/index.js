import React from 'react';
import { Router } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

import Button from '../src/components/buttons/button';
import TooltipContainer from '../src/components/tooltips/tooltip-container';
import TextInput from '../src/components/fields/text-input';
import TextArea from '../src/components/fields/text-area';
import Note from '../src/components/fields/note';
import Markdown from '../src/components/text/markdown';

storiesOf('Button', module)
  .add('regular', () => <Button>Hello Button</Button>)
  .add('cta', () => <Button type="cta">CTA Button</Button>)
  .add('small', () => <Button size="small">Small Button</Button>)
  .add('tertiary', () => (
    <Button type="tertiary" size="small">
      Tertiary (Small) Button
    </Button>
  ))
  .add('danger zone', () => (
    <Button type="dangerZone" size="small">
      Destructive Action
    </Button>
  ));

storiesOf('TooltipContainer', module)
  .add('action', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm an action tooltip" />
    </div>
  ))
  .add('info', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm an info tooltip"
      />
    </div>
  ))
  .add('persistent', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer
        type="info"
        id="a-unique-id"
        target={<img width="32" height="32" src="https://favicon-fetcher.glitch.me/img/glitch.com" />}
        tooltip="I'm a persistent tooltip"
        persistent
      />
    </div>
  ))
  .add('left and top aligned', () => (
    <div style={{ margin: '70px' }}>
      <TooltipContainer type="action" id="a-unique-id" target={<Button>Hover or focus me</Button>} tooltip="I'm a tooltip" align={['top', 'left']} />
    </div>
  ));

storiesOf('Text Input', module)
  .add('regular', () => <TextInput placeholder="type something!" />)
  .add('login', () => <TextInput placeholder="type something!" prefix="@" />)
  .add('search', () => <TextInput type="search" opaque={true} search={true} placeholder="bots, apps, users" />)
  .add('with error', () => <TextInput placeholder="glitch" error="That team already exists" />)
  .add('text area', () => <TextArea placeholder="[Something here] doesn't seem appropriate for Glitch because..." error="Reason is required" />);

storiesOf('Markdown', module)
  .add('regular', () => <Markdown>Some __Markdown__</Markdown>)
  .add('truncated', () => <Markdown length={35}>35 characters of rendered __Markdown__ (and a little **more**)</Markdown>);
  .add('regular', () => (
    <TextInput placeholder="type something!"/>
  ))
  .add('login', () => (
    <TextInput placeholder="type something!" prefix="@"/>
  ))
  .add('search', () => (
    <TextInput type="search" opaque={true} search={true} placeholder="bots, apps, users"/>
  ))
  .add('with error', () => (
    <TextInput placeholder="glitch" error="That team already exists"/>
  ))
  .add('text area', () => (
    <TextArea placeholder="[Something here] doesn't seem appropriate for Glitch because..." error="Reason is required"/>
  ));

storiesOf('Note', module)
  .addDecorator(StoryRouter())
  .add('(coming soon) a new note with placeholder text', () => ( //Note the placeholder text does not show up until we import global styles here or move everything into components
    <div style={{ margin: '70px', width: '300px' }}>
      <Note
        currentUser={{
          color: '#9cf989',
          id: 123,
          login: 'glitch',
          name: 'Glitch',
        }}
        update={yourUpdatedNote => console.log("This is your updated note:",yourUpdatedNote)}
        project={{ isAddingANewNote: true }}
        collectionCoverColor="#ddc4fc"
      />
    </div>
  ))
  .add('a saved note', () => (
      <div style={{ margin: '70px', width: '300px' }}>
      <Note
        currentUser={{
          color: '#9cf989',
          id: 123,
          login: 'glitch',
          name: 'Glitch',
        }}
        update={yourUpdatedNote => console.log("This is your updated note:",yourUpdatedNote)}
        project={{ note: "This is a *GREAT* note that supports markdown" }}
        collectionCoverColor="#ddc4fc"
      />
    </div>
  ))
  .add('a saved note on dark text', () => (
      <div style={{ margin: '70px', width: '300px' }}>
      <Note
        currentUser={{
          color: '#9cf989',
          id: 123,
          login: 'glitch',
          name: 'Glitch',
        }}
        update={yourUpdatedNote => console.log("This is your updated note:",yourUpdatedNote)}
        project={{ note: "This is a *GREAT* note that supports markdown" }}
        collectionCoverColor="#000000"
      />
    </div>
  ));
