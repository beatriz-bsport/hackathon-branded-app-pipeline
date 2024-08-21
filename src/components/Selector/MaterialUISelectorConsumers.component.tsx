import React from 'react';
import ReactDOM from 'react-dom';
import uniq from 'lodash/uniq';
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import get from 'lodash/get';

import { MaterialUiMultiSelectorField } from '#src/libs/custom-form/components/GenericFormik.input';
import useMemberSearch from '#src/libs/datatype-filtering/useMemberSearch';

import { MAX_SELECTABLE_MEMBER } from '#src/libs/datatype-filtering/constants';

import type {
  MemberSearchBarOption,
  MemberSearchBarOptions,
} from '#src/libs/member/types';
import type { ItemProps } from '#src/libs/datatype-filtering/components/DatatypeFilterConfigValueManager.component';

type Props = {
  chipsRenderer: (itemProps: ItemProps) => React.ReactNode;
  className: string;
  inScrollBar: boolean;
  itemRenderer: (itemProps: ItemProps) => React.ReactNode;
  memberDomElement: HTMLDivElement;
  name: string;
  openMenuOnClear: boolean;
  openMenuOnFocus: boolean;
  withoutConfirmButton: boolean;
};

const MaterialUISelectorConsumers: React.FC<Props> = ({
  chipsRenderer,
  className,
  inScrollBar,
  itemRenderer,
  memberDomElement,
  name,
  openMenuOnClear,
  openMenuOnFocus,
  withoutConfirmButton,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('search');
  const { values, setFieldValue } = useFormikContext();
  const consumerIdsSelected = get(values, name);
  /**
   * Storing initial values in a ref
   */
  const defaultConsumerIdsSelected =
    React.useRef<number[]>(consumerIdsSelected);

  /**
   * Forcing the filter on the back-end, and not on the front-end
   * Also hiding options that are selected
   */
  const filterOption = React.useCallback(
    (option: MemberSearchBarOption) => {
      if (consumerIdsSelected.includes(option.value)) {
        return false;
      }
      return true;
    },
    [consumerIdsSelected],
  );

  const isDisabled = React.useMemo(
    () => consumerIdsSelected?.length >= MAX_SELECTABLE_MEMBER,
    [consumerIdsSelected],
  );

  const isOptionDisabled = React.useCallback(
    (option) => !consumerIdsSelected.includes(option.value) && isDisabled,
    [consumerIdsSelected, isDisabled],
  );

  const { handleInputChange, isSearchLoading, membersSelected, options } =
    useMemberSearch(consumerIdsSelected, defaultConsumerIdsSelected.current);

  const handleRemoveMember = React.useCallback(
    (consumerIdToRemove: number) => () => {
      setFieldValue(
        `${name}`,
        consumerIdsSelected.filter(
          (consumerId: number) => consumerId !== consumerIdToRemove,
        ),
      );
    },
    [setFieldValue, consumerIdsSelected, name],
  );

  /**
   * handleOnChange is needed because option selected are filtered out
   * from optionsSelected, so we need to put them back in formik state
   */
  const handleOnChange = React.useCallback(
    (optionsSelected: MemberSearchBarOptions) => {
      setFieldValue(
        `${name}`,
        uniq([
          ...consumerIdsSelected,
          ...optionsSelected.map((option) => option.value),
        ]),
      );
    },
    [setFieldValue, name, consumerIdsSelected],
  );

  return (
    <div className={classes.userSelector}>
      <MaterialUiMultiSelectorField
        forceBlurOnSelect
        forceEmptySelector
        isMenuListVirtualized
        withoutSelectAll
        blurOnSelect={consumerIdsSelected?.length === MAX_SELECTABLE_MEMBER - 1}
        chipsRenderer={!!chipsRenderer && chipsRenderer}
        className={className}
        filterOption={filterOption}
        inScrollBar={inScrollBar}
        isDisabled={isDisabled}
        isLoading={isSearchLoading}
        isOptionDisabled={isOptionDisabled}
        itemRenderer={!!itemRenderer && itemRenderer}
        name={name}
        onChange={handleOnChange}
        onInputChange={handleInputChange}
        openMenuOnClear={openMenuOnClear}
        openMenuOnFocus={openMenuOnFocus}
        options={options}
        placeholder={t('input')}
        withoutConfirmButton={withoutConfirmButton}
      />
      {memberDomElement &&
        ReactDOM.createPortal(
          membersSelected?.length ? (
            <List>
              {membersSelected.map((member) => (
                <ListItem key={member.id}>
                  <ListItemText> {member.name}</ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton
                      color="secondary"
                      onClick={handleRemoveMember(member.consumer)}
                      size="small"
                    >
                      <CancelIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : null,
          memberDomElement,
        )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  userSelector: { minWidth: '300px' },
}));

export default MaterialUISelectorConsumers;
