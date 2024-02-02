import React from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import Selector, { SelectorProps } from '#Fabrique/Selector';
import MenuItem, { MenuItemType } from '#Fabrique/MenuItem';
import MenuItemList from '#Fabrique/MenuItemList';

type Suggestion = {
  label: string;
  value: string | number;
};

type Props = {
  suggestions: Suggestion[];
  type?: MenuItemType;
} & Omit<
  SelectorProps,
  | 'onClear'
  | 'getSelectedItemLabel'
  | 'errorMessage'
  | 'getSelectedItemLabel'
  | 'getSelectedItemValue'
  | 'isError'
  | 'selectedItems'
  | 'closeOnSelect'
  | 'setCloseOnSelect'
>;

const SelectField: React.FC<Props> = (props: Props) => {
  const { name, suggestions, type } = props;
  const { t } = useTranslation('marketing');
  const [field, meta, form] = useField(name);
  const { setValue } = form;
  const [itemSelected, setItemSelected] = React.useState<Suggestion>(null);

  const [closeOnSelect, setCloseOnSelect] = React.useState(false);

  const handleClick = React.useCallback(
    (value: string | number) => () => {
      const selectedItem = suggestions?.find(
        (menuItem: Suggestion) => menuItem.value === value,
      );
      setValue(value);
      setItemSelected(selectedItem);
      setCloseOnSelect(true);
    },
    [suggestions, setValue],
  );

  const handleClear = React.useCallback(() => {
    setValue(null);
    setItemSelected(null);
  }, [setValue]);

  const getSelectedItemLabel = React.useCallback((item: Suggestion) => {
    return item?.label;
  }, []);

  const getSelectedItemValue = React.useCallback((item: Suggestion) => {
    return item?.value;
  }, []);

  return (
    <Selector
      {...field}
      {...props}
      closeOnSelect={closeOnSelect}
      errorMessage={meta.error && t(meta.error)}
      getSelectedItemLabel={getSelectedItemLabel}
      getSelectedItemValue={getSelectedItemValue}
      isError={!!(meta.touched && meta.error)}
      onClear={handleClear}
      selectedItems={itemSelected}
      setCloseOnSelect={setCloseOnSelect}
      size="sm"
    >
      <MenuItemList>
        {Array.isArray(suggestions) &&
          suggestions?.map((suggestion) => (
            <MenuItem
              key={suggestion?.value}
              label={suggestion?.label}
              onClick={handleClick(suggestion?.value)}
              selected={itemSelected?.value === suggestion?.value}
              type={type}
            />
          ))}
      </MenuItemList>
    </Selector>
  );
};

export default React.memo(SelectField);
