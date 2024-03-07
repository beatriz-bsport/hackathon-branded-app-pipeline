import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { generateRandomName, generateRandomNames } from '#utils/factories';

import Selector, { SelectorStorybook, type SelectorProps } from '.';
import { MenuItemStorybook } from '#Fabrique/MenuItem';
import { SelectorSizeEnum } from './constants';
import { Star06 } from '#components/untitledui';
import { MenuItemListStorybook } from '../MenuItemList';

MenuItemStorybook.displayName = 'Selector';

const menuItemLabels = generateRandomNames(faker, { count: 5 });

const menuItemData = menuItemLabels.map((label) => ({
  id: faker.number.int(),
  label,
}));

const fakePlaceholder = generateRandomName(faker);

const fakeCaptionText = faker.lorem.sentence();

const fakeErrorMessage = faker.lorem.sentence(1);

const fakeLabel = generateRandomName(faker);

export default {
  title: 'Fabrique/Selector/Stories',
  component: Selector,
  argTypes: {
    label: {
      description: 'Represents the selector label.',
      control: { type: 'text' },
      defaultValue: '',
    },
    size: {
      description: 'The size of the element. Set to small by default.',
      control: { type: 'inline-radio' },
      options: [SelectorSizeEnum.SM, SelectorSizeEnum.LG],
      defaultValue: SelectorSizeEnum.SM,
    },
    leftIcon: {
      description: 'The icon displayed on the left of the selector.',
    },
    placeholder: {
      description: 'Represents a placeholder text value.',
      control: { type: 'text' },
      defaultValue: '',
    },
    captionText: {
      description: 'Represents a caption text value.',
      control: { type: 'text' },
      defaultValue: '',
    },
    errorMessage: {
      description: 'Represents an error message.',
      control: { type: 'text' },
      defaultValue: '',
    },
    isError: {
      description: 'If true, the element will indicate an error.',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    isSelectorWidthControlledByRef: {
      description:
        'If true, the selector will fit the width of the element used as ref.',
      options: [true, false],
    },
    isRequired: {
      description: 'If true, this field is required.',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    isDisabled: {
      description: 'If true, this element is disabled.',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    className: {
      description: 'Extend the styles applied to the component.',
    },
    id: {
      description: 'The id of the selector.',
    },
  },
} as ComponentMeta<typeof SelectorStorybook>;

const SingleSelectTemplate: ComponentStory<typeof Selector> = (
  args: SelectorProps,
) => {
  const [itemSelected, setItemSelected] = React.useState<{
    id: number;
    label: string;
  }>(null);

  const [closeOnSelect, setCloseOnSelect] = React.useState(false);

  const handleClick = (id: number) => () => {
    const selectedItem = menuItemData.find((menuItem) => menuItem.id === id);
    setItemSelected(selectedItem);
    setCloseOnSelect(true);
  };

  const handleClear = () => {
    setItemSelected(null);
  };

  const getSelectedItemLabel = (item: { label: string; id: number }) => {
    return item?.label;
  };

  const getSelectedItemValue = (item: { label: string; id: number }) => {
    return item?.id;
  };

  return (
    <SelectorStorybook
      id="bs-fabrique-selector-storybook"
      selectedItems={itemSelected}
      onClear={handleClear}
      closeOnSelect={closeOnSelect}
      setCloseOnSelect={setCloseOnSelect}
      getSelectedItemLabel={getSelectedItemLabel}
      getSelectedItemValue={getSelectedItemValue}
      {...args}
    >
      <MenuItemListStorybook>
        {menuItemData.map((menuItem) => (
          <MenuItemStorybook
            key={menuItem.id}
            label={menuItem.label}
            onClick={handleClick(menuItem.id)}
            selected={itemSelected?.id === menuItem.id}
          />
        ))}
      </MenuItemListStorybook>
    </SelectorStorybook>
  );
};

const MultiSelectTemplate: ComponentStory<typeof Selector> = (
  args: SelectorProps,
) => {
  const [itemsSelected, setItemsSelected] = React.useState<typeof menuItemData>(
    [menuItemData[0], menuItemData[1]],
  );

  const handleClick = (id: number) => () => {
    setItemsSelected((prevState) => {
      const isSelected = prevState.some((item) => item.id === id);
      return isSelected
        ? prevState.filter((selected) => selected.id !== id)
        : [...prevState, menuItemData.find((item) => item.id === id)];
    });
  };

  const handleClear = () => {
    setItemsSelected([]);
  };

  const handleRemove = (value: string | number) => {
    setItemsSelected((prevState) =>
      prevState.filter((selected) => selected.id !== value),
    );
  };

  const getSelectedItemLabel = (item: { label: string; id: number }) => {
    return item?.label;
  };

  const getSelectedItemValue = (item: { label: string; id: number }) => {
    return item?.id;
  };

  return (
    <SelectorStorybook
      id="bs-fabrique-selector-storybook"
      selectedItems={itemsSelected}
      onClear={handleClear}
      multiple
      onRemoveItem={handleRemove}
      getSelectedItemLabel={getSelectedItemLabel}
      getSelectedItemValue={getSelectedItemValue}
      {...args}
    >
      <MenuItemListStorybook>
        {menuItemData.map((menuItem) => (
          <MenuItemStorybook
            key={menuItem.id}
            label={menuItem.label}
            onClick={handleClick(menuItem.id)}
            selected={itemsSelected.some((item) => item.id === menuItem.id)}
            type="checkbox"
          />
        ))}
      </MenuItemListStorybook>
    </SelectorStorybook>
  );
};

export const Defaultsingle = SingleSelectTemplate.bind({});
Defaultsingle.args = {};

export const Singlewithlabel = SingleSelectTemplate.bind({});
Singlewithlabel.args = {
  label: fakeLabel,
};

export const Singlewithlabellarge = SingleSelectTemplate.bind({});
Singlewithlabellarge.args = {
  label: fakeLabel,
  size: SelectorSizeEnum.LG,
};

export const Singlewithlabelandicon = SingleSelectTemplate.bind({});
Singlewithlabelandicon.args = {
  label: fakeLabel,
  leftIcon: <Star06 stroke="currentColor" />,
};

export const Singlerequired = SingleSelectTemplate.bind({});
Singlerequired.args = {
  label: fakeLabel,
  isRequired: true,
};

export const Singlewithplaceholder = SingleSelectTemplate.bind({});
Singlewithplaceholder.args = {
  placeholder: fakePlaceholder,
};

export const Singlewitherror = SingleSelectTemplate.bind({});
Singlewitherror.args = {
  isError: true,
  errorMessage: fakeErrorMessage,
};

export const Singledisabled = SingleSelectTemplate.bind({});
Singledisabled.args = {
  isDisabled: true,
};

export const Singlewithplaceholderandcaptiontext = SingleSelectTemplate.bind(
  {},
);
Singlewithplaceholderandcaptiontext.args = {
  placeholder: fakePlaceholder,
  captionText: fakeCaptionText,
};

export const Singlewithplaceholdercaptiontextandlabel =
  SingleSelectTemplate.bind({});
Singlewithplaceholdercaptiontextandlabel.args = {
  placeholder: fakePlaceholder,
  captionText: fakeCaptionText,
  label: fakeLabel,
};

export const SingleWidthControlledByRef = SingleSelectTemplate.bind({});
SingleWidthControlledByRef.args = {
  isSelectorWidthControlledByRef: true,
};

export const Defaultmulti = MultiSelectTemplate.bind({});
Defaultmulti.args = {};

export const Multiwithlabel = MultiSelectTemplate.bind({});
Multiwithlabel.args = {
  label: fakeLabel,
};

export const Multiwithlabelandicon = MultiSelectTemplate.bind({});
Multiwithlabelandicon.args = {
  label: fakeLabel,
  leftIcon: <Star06 stroke="currentColor" />,
};

export const Multiwithlabellarge = MultiSelectTemplate.bind({});
Multiwithlabellarge.args = {
  label: fakeLabel,
  size: SelectorSizeEnum.LG,
};

export const Multirequired = MultiSelectTemplate.bind({});
Multirequired.args = {
  label: fakeLabel,
  isRequired: true,
};

export const Multiwithplaceholder = MultiSelectTemplate.bind({});
Multiwithplaceholder.args = {
  placeholder: fakePlaceholder,
};

export const Multiwithplaceholderandcaptiontext = MultiSelectTemplate.bind({});
Multiwithplaceholderandcaptiontext.args = {
  placeholder: fakePlaceholder,
  captionText: fakeCaptionText,
};

export const Multiwithplaceholdercaptiontextandlabel = MultiSelectTemplate.bind(
  {},
);
Multiwithplaceholdercaptiontextandlabel.args = {
  placeholder: fakePlaceholder,
  captionText: fakeCaptionText,
  label: fakeLabel,
};

export const Multiwitherror = MultiSelectTemplate.bind({});
Multiwitherror.args = {
  isError: true,
  errorMessage: fakeErrorMessage,
};

export const Multidisabled = MultiSelectTemplate.bind({});
Multidisabled.args = {
  isDisabled: true,
};

export const MultiWidthControlledByRef = MultiSelectTemplate.bind({});
MultiWidthControlledByRef.args = {
  isSelectorWidthControlledByRef: true,
};
