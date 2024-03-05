import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Menu, {
  MenuStorybook,
  HorizontalEnum,
  VerticalEnum,
  type MenuProps,
} from '.';
import { generateRandomNames } from '#utils/factories';
import { MenuItemListStorybook } from '#Fabrique/MenuItemList';
import { MenuItemStorybook } from '#Fabrique/MenuItem';
import { ButtonBaseStorybook } from '#Fabrique/ButtonBaseV2';
import Typography from '../Typography';

MenuStorybook.displayName = 'Menu';

const menuItemLabels = generateRandomNames(faker, { count: 5 });

const menuItemData = menuItemLabels.map((label) => ({
  id: faker.number.int(),
  label,
}));

export default {
  title: 'Fabrique/Menu/Stories',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    anchorEl: {
      description: 'An HTML Element used to set the position of the menu.',
    },
    anchorOriginHorizontal: {
      description:
        'Refers to the x coordinate on the anchor where the menu will attach to.',
      control: { type: 'inline-radio' },
      options: [
        HorizontalEnum.CENTER,
        HorizontalEnum.LEFT,
        HorizontalEnum.RIGHT,
      ],
    },
    anchorOriginVertical: {
      description:
        'Refers to the y coordinate on the anchor where the menu will attach to.',
      control: { type: 'inline-radio' },
      options: [VerticalEnum.CENTER, VerticalEnum.BOTTOM, VerticalEnum.TOP],
    },
    children: {
      description: 'The menu content',
    },
    className: {
      description: 'Extend the styles applied to the component.',
    },
    id: {
      description: 'The id of the menu.',
    },
    isMenuWidthControlledByRef: {
      description:
        'If true, the menu will fit the width of the element used as ref.',
      options: [true, false],
    },
    targetElementId: {
      description:
        'The id used to identify the DOM element where the Menu will be rendered.',
    },
    transformOriginHorizontal: {
      description:
        "Refers to the x coordinate of the menu that will attach to the anchor's origin.",
      control: { type: 'inline-radio' },
      options: [
        HorizontalEnum.CENTER,
        HorizontalEnum.LEFT,
        HorizontalEnum.RIGHT,
      ],
    },
    transformOriginVertical: {
      description:
        "Refers to the y coordinate of the menu that will attach to the anchor's origin.",
      control: { type: 'inline-radio' },
      options: [VerticalEnum.CENTER, VerticalEnum.BOTTOM, VerticalEnum.TOP],
    },
    wrapperClass: {
      description:
        'An optional string to set the class of the div element wrapping the menu.',
    },
    wrapperId: {
      description: 'The id used to identify the div element wrapping the menu.',
    },
  },
} as ComponentMeta<typeof MenuStorybook>;

const Template: ComponentStory<typeof Menu> = (args: MenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = event.currentTarget;
    const id = currentTarget.getAttribute('id');
    setAnchorEl(currentTarget);
    setIsOpen(true);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const [itemsSelected, setItemsSelected] = React.useState<number[]>([]);

  const handleClick = (id: number) => () => {
    setItemsSelected((prevState) => {
      const isSelected = prevState.includes(id);
      return isSelected
        ? prevState.filter((selected) => selected !== id)
        : [...prevState, id];
    });
  };

  return (
    <div>
      <ButtonBaseStorybook
        aria-haspopup="true"
        aria-controls={isOpen ? 'basic-menu' : undefined}
        onClick={handleOnClick}
        isDisabled={isOpen}
        style={{ border: '2px solid black', padding: '16px' }}
      >
        <Typography variant="body-lg">Open Menu</Typography>
      </ButtonBaseStorybook>
      <MenuStorybook
        isOpen={isOpen}
        anchorEl={anchorEl}
        id="basic-menu"
        onClose={handleOnClose}
        {...args}
      >
        <MenuItemListStorybook>
          {menuItemData.map((menuItem) => (
            <MenuItemStorybook
              key={menuItem.id}
              onClick={handleClick(menuItem.id)}
              label={menuItem.label}
              type="checkbox"
              selected={itemsSelected.includes(menuItem.id)}
            />
          ))}
        </MenuItemListStorybook>
      </MenuStorybook>
    </div>
  );
};

export const Defaultplacement = Template.bind({});
Defaultplacement.args = {};

export const Bottomright = Template.bind({});
Bottomright.args = {
  anchorOriginHorizontal: HorizontalEnum.RIGHT,
  anchorOriginVertical: VerticalEnum.BOTTOM,
  transformOriginHorizontal: HorizontalEnum.RIGHT,
  transformOriginVertical: VerticalEnum.TOP,
};

export const Bottomcentered = Template.bind({});
Bottomcentered.args = {
  anchorOriginHorizontal: HorizontalEnum.CENTER,
  anchorOriginVertical: VerticalEnum.BOTTOM,
  transformOriginHorizontal: HorizontalEnum.CENTER,
  transformOriginVertical: VerticalEnum.TOP,
};

export const Topleft = Template.bind({});
Topleft.args = {
  anchorOriginHorizontal: HorizontalEnum.LEFT,
  anchorOriginVertical: VerticalEnum.TOP,
  transformOriginHorizontal: HorizontalEnum.LEFT,
  transformOriginVertical: VerticalEnum.BOTTOM,
};

export const Topright = Template.bind({});
Topright.args = {
  anchorOriginHorizontal: HorizontalEnum.RIGHT,
  anchorOriginVertical: VerticalEnum.TOP,
  transformOriginHorizontal: HorizontalEnum.RIGHT,
  transformOriginVertical: VerticalEnum.BOTTOM,
};

export const Topcentered = Template.bind({});
Topcentered.args = {
  anchorOriginHorizontal: HorizontalEnum.CENTER,
  anchorOriginVertical: VerticalEnum.TOP,
  transformOriginHorizontal: HorizontalEnum.CENTER,
  transformOriginVertical: VerticalEnum.BOTTOM,
};

export const WidthControlledByRef = Template.bind({});
WidthControlledByRef.args = {
  isMenuWidthControlledByRef: true,
};
