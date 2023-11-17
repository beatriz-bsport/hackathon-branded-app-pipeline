import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ModalDialogStorybook } from '.';
import { fakerEN as faker } from '@faker-js/faker';
import { ModalDialogColorEnum, ModalDialogSizeEnum } from './constants';
import { Star06 } from '#components/untitledui';

const ModalDialogStorybookTemplate: ComponentStory<
  typeof ModalDialogStorybook
> = (args) => <ModalDialogStorybook {...args} />;

ModalDialogStorybook.displayName = 'ModalDialog';

const DialogChildren: React.FC = () => {
  return (
    <>
      {faker.helpers.multiple(
        () => (
          <p>{faker.lorem.sentences(5)}</p>
        ),
        {
          count: 5,
        },
      )}
    </>
  );
};

const defaultArgs = {
  isFullWidth: false,
  title: faker.lorem.words(4),
  subtitle: faker.lorem.words(6),
  leftIcon: <Star06 stroke="currentColor" />,
  children: <DialogChildren />,
};

export const Modaldialognocontent = ModalDialogStorybookTemplate.bind({});
Modaldialognocontent.args = {
  ...defaultArgs,
  children: null,
  color: ModalDialogColorEnum.PRIMARY,
};

export const Modaldialogprimary = ModalDialogStorybookTemplate.bind({});
Modaldialogprimary.args = {
  ...defaultArgs,
  color: ModalDialogColorEnum.PRIMARY,
};

export const Modaldialoginfo = ModalDialogStorybookTemplate.bind({});
Modaldialoginfo.args = {
  ...defaultArgs,
  leftIcon: null,
  color: ModalDialogColorEnum.INFO,
};

export const Modaldialogsuccess = ModalDialogStorybookTemplate.bind({});
Modaldialogsuccess.args = {
  ...defaultArgs,
  leftIcon: null,
  color: ModalDialogColorEnum.SUCCESS,
};

export const Modaldialogwarning = ModalDialogStorybookTemplate.bind({});
Modaldialogwarning.args = {
  ...defaultArgs,
  leftIcon: null,
  color: ModalDialogColorEnum.WARNING,
};

export const Modaldialogerror = ModalDialogStorybookTemplate.bind({});
Modaldialogerror.args = {
  ...defaultArgs,
  leftIcon: null,
  color: ModalDialogColorEnum.ERROR,
};

export const Modaldialogxs = ModalDialogStorybookTemplate.bind({});
Modaldialogxs.args = {
  ...defaultArgs,
  size: ModalDialogSizeEnum.XS,
};

export const Modaldialogmd = ModalDialogStorybookTemplate.bind({});
Modaldialogmd.args = {
  ...defaultArgs,
  size: ModalDialogSizeEnum.MD,
};

export const Modaldialoglg = ModalDialogStorybookTemplate.bind({});
Modaldialoglg.args = {
  ...defaultArgs,
  size: ModalDialogSizeEnum.LG,
};

export const Modaldialogxl = ModalDialogStorybookTemplate.bind({});
Modaldialogxl.args = {
  ...defaultArgs,
  size: ModalDialogSizeEnum.XL,
};

export const Modaldialogfullwidth = ModalDialogStorybookTemplate.bind({});
Modaldialogfullwidth.args = { ...defaultArgs, isFullWidth: true };

export default {
  title: 'Fabrique/ModalDialog/Stories',
  component: ModalDialogStorybook,
  argTypes: {
    children: {
      description:
        'Present at the top of the sheet, providing context to the user about the content of the sheet',
    },
    leftIcon: {
      description: 'The icon displayed next to the text block in the header',
    },
    title: {
      description:
        'Present at the top of the sheet, providing context to the user about the content of the sheet',
      control: { type: 'text' },
    },
    subtitle: {
      description:
        'Present at the top of the sheet, providing context to the user about the content of the sheet',
      control: { type: 'text' },
    },
    isFullWidth: {
      description: 'Whether the dialog takes 100% of the parent element or not',
    },
    color: {
      description: 'The dialog color theme',
      control: { type: 'inline-radio' },
      options: [
        ModalDialogColorEnum.PRIMARY,
        ModalDialogColorEnum.INFO,
        ModalDialogColorEnum.SUCCESS,
        ModalDialogColorEnum.WARNING,
        ModalDialogColorEnum.ERROR,
      ],
      defaultValue: ModalDialogColorEnum.PRIMARY,
    },
    size: {
      description: 'The dialog size variant',
      control: { type: 'inline-radio' },
      options: [
        ModalDialogSizeEnum.XS,
        ModalDialogSizeEnum.MD,
        ModalDialogSizeEnum.LG,
        ModalDialogSizeEnum.XL,
      ],
      defaultValue: ModalDialogSizeEnum.LG,
    },
    onClose: {
      description: 'Action to perform when the close button is clicked',
    },
    onCancel: {
      description: 'Action to perform when the cancel button is clicked',
    },
    onConfirm: {
      description: 'Action to perform when the confirm button is clicked',
    },
  },
} as ComponentMeta<typeof ModalDialogStorybook>;
