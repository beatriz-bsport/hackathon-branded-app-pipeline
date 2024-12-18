import React, { useState } from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BlanketStorybook } from '.';
import { ButtonStorybook } from '#Fabrique/ButtonV2';

const BlanketStorybookTemplate: ComponentStory<typeof BlanketStorybook> = (
  args,
) => {
  const [showBlanket, setShowBlanket] = useState(false);
  const handleShowBlanket = () => setShowBlanket((state) => !state);
  return (
    <div>
      <ButtonStorybook
        color="primary"
        variant="contained"
        size="md"
        onClick={handleShowBlanket}
      >
        Show blanket
      </ButtonStorybook>
      <BlanketStorybook
        {...args}
        isOpen={showBlanket}
        onClick={handleShowBlanket}
      />
    </div>
  );
};

BlanketStorybook.displayName = 'Blanket';

export const Blanketfullcontainer = BlanketStorybookTemplate.bind({});

export default {
  title: 'Fabrique/Blanket/Stories',
  component: BlanketStorybook,
  argTypes: {
    isOpen: {
      description:
        'Whether the blanket is shown or not, with its children elements',
      control: { type: 'boolean' },
    },
    children: {
      description: 'Element to show inside the blanket',
    },
    className: {
      description: 'Optional class name to extend element styles',
      control: 'text',
    },
    onClick: {
      description: 'Action to perform once blanket has been clicked',
    },
  },
} as ComponentMeta<typeof BlanketStorybook>;
