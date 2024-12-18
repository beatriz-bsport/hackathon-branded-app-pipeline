import React, { useState } from 'react';

import { fakerEN as faker } from '@faker-js/faker';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import type { Props } from '.';
import { TextFormStorybook } from '.';

// displayName must be overriden for preview code to actually work on mdx document.
TextFormStorybook.displayName = 'TextForm';

const TextFormStorybookTemplate: ComponentStory<typeof TextFormStorybook> = (
  args: Props,
) => {
  const [value, setValue] = useState('');
  return (
    <TextFormStorybook
      value={value}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
        setValue(event.target.value)
      }
      {...args}
    />
  );
};

const baseArgs = {
  isDisabled: false,
  isRequired: false,
  isError: false,
  isDraggable: false,
  label: 'Label',
};

export const Textformdefault = TextFormStorybookTemplate.bind({});
Textformdefault.args = {
  ...baseArgs,
  label: 'Default',
  textFormId: 'default',
};

export const Textformrequired = TextFormStorybookTemplate.bind({});
Textformrequired.args = {
  ...baseArgs,
  label: 'Required',
  isRequired: true,
  textFormId: 'required',
};

export const Textformerror = TextFormStorybookTemplate.bind({});
Textformerror.args = {
  ...baseArgs,
  captionText: faker.lorem.sentences(2),
  label: 'Error',
  isError: true,
  textFormId: 'error',
};

export const Textformcaption = TextFormStorybookTemplate.bind({});
Textformcaption.args = {
  ...baseArgs,
  label: 'withCaptionText',
  captionText: faker.lorem.paragraphs(5),
  placeholder: 'Caption text',
  textFormId: 'caption-text',
};

export const Textformdisabled = TextFormStorybookTemplate.bind({});
Textformdisabled.args = {
  ...baseArgs,
  label: 'Disabled',
  placeHolder: 'Disabled',
  isDisabled: true,
  textFormId: 'disabled',
};

export const Textformdraggable = TextFormStorybookTemplate.bind({});
Textformdraggable.args = {
  ...baseArgs,
  label: 'Draggable',
  placeHolder: 'Draggable',
  isDraggable: true,
  textFormId: 'draggable',
};

export const Textformmaxcharacter = TextFormStorybookTemplate.bind({});
Textformmaxcharacter.args = {
  ...baseArgs,
  placeholder: 'Max character',
  textFormId: 'max-character',
  maxCharacters: 1000,
};

export default {
  title: 'Fabrique/TextForm/Stories',
  component: TextFormStorybook,
  argTypes: {
    label: {
      control: 'text',
      description: 'Label of the text form',
    },
    classes: {
      description: 'Override or extend the styles applied to the component.',
    },
    name: { description: 'Name of the input field' },
    value: { description: 'Value of the input field', control: 'text' },
    isDisabled: {
      description: 'If true, the component is disabled',
      control: 'boolean',
    },
    textFormId: {
      description:
        'When clicking on the label, this ID allows us to redirect this click as if we were clicking on the input',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder value',
      control: 'text',
      defaultValue: false,
    },
    isError: {
      description: 'If true, displays input field as if there is an error',
      control: 'boolean',
      defaultValue: false,
    },
    isRequired: {
      description: 'If true, the input field is required',
      control: 'boolean',
      defaultValue: false,
    },
    isDraggable: {
      description: ' If true, the textarea is extendable (by dragging)',
      control: 'boolean',
      defaultValue: false,
    },
    captionText: {
      description: 'Caption below the textfield',
      control: 'text',
    },
    maxCharacters: {
      description: 'Maximum length handled by the text form',
      control: 'number',
      defaultValue: null,
    },
  },
} as ComponentMeta<typeof TextFormStorybook>;
