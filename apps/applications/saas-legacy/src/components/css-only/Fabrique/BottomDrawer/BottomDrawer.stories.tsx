import React, { useState } from 'react';

import { Story, ComponentMeta } from '@storybook/react';
import { BottomDrawerStorybook, Props } from '.';
import { ButtonStorybook as Button } from '#Fabrique/ButtonV2';
import { fakerEN as faker } from '@faker-js/faker';
import { ModalDialogColorEnum } from '#Fabrique/ModalDialog/constants';

const BottomDrawerStorybookTemplate: Story<
  Props & {
    buttonLabel: string;
  }
> = (args) => {
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);
  const handleOpenBottomDrawer = () => setIsBottomDrawerOpen(true);
  const handleCloseBottomDrawer = () => setIsBottomDrawerOpen(false);
  return (
    <div>
      <Button size="md" onClick={handleOpenBottomDrawer}>
        {args.buttonLabel}
      </Button>
      <BottomDrawerStorybook
        {...args}
        blanketProps={{
          isOpen: isBottomDrawerOpen,
          onClick: handleCloseBottomDrawer,
        }}
        modalDialogProps={{
          ...args.modalDialogProps,
          onClose: handleCloseBottomDrawer,
          onCancel: handleCloseBottomDrawer,
          onConfirm: () => {},
        }}
      />
    </div>
  );
};

BottomDrawerStorybook.displayName = 'BottomDrawer';

const baseArgs = {
  children: faker.lorem.sentences(20),
  modalDialogProps: {
    title: faker.lorem.words(4),
    subtitle: faker.lorem.words(2),
  },
};

export const Bottomdrawerscrollablecontent = BottomDrawerStorybookTemplate.bind(
  {},
);
Bottomdrawerscrollablecontent.args = {
  ...baseArgs,
  buttonLabel: 'Open scrollable drawer',
  children: faker.lorem.sentences(100),
  modalDialogProps: {
    ...baseArgs.modalDialogProps,
  },
};

export const Bottomdrawererror = BottomDrawerStorybookTemplate.bind({});
Bottomdrawererror.args = {
  ...baseArgs,
  buttonLabel: 'Open error drawer',
  children: 'Current bookings are locked for this offer',
  modalDialogProps: {
    ...baseArgs.modalDialogProps,
    title: 'Sorry, you cannot book right now',
    subtitle: 'Yoga beginners - Studio 1 - 14:30',
    color: ModalDialogColorEnum.ERROR,
    confirmLabel: 'OK',
  },
};

export const Bottomdrawerexpanded = BottomDrawerStorybookTemplate.bind({});
Bottomdrawerexpanded.args = {
  ...baseArgs,
  buttonLabel: 'Open expanded drawer',
  isExpanded: true,
  modalDialogProps: {
    ...baseArgs.modalDialogProps,
  },
};

export default {
  title: 'Fabrique/BottomDrawer/Stories',
  component: BottomDrawerStorybook,
  argTypes: {
    isExpanded: {
      description:
        'Whether the modal dialog fills the entire screen space or not',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    children: {
      description: 'The content that will be placed in modal dialog',
    },
    className: {
      description: 'Optional CSS class name passed to the root element',
    },
    blanketProps: {
      description: 'Props passed to the blanket element',
    },
    modalDialogProps: {
      description: 'Props passed to the modal dialog element',
    },
  },
} as ComponentMeta<typeof BottomDrawerStorybook>;
