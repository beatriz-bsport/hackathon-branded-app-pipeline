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
import { Alert } from '@material-ui/lab';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import { REPORT_CATEGORIES_WITHOUT_ARCHIVED_MEMBERS } from '#src/libs/reporting/common/constants';

type Props = {
  chipsRenderer: (itemProps: ItemProps) => React.ReactNode;
  className: string;
  inScrollBar: boolean;
  invalidAdvancedFilterItemsUUID: string[];
  itemRenderer: (itemProps: ItemProps) => React.ReactNode;
  memberDomElement: HTMLDivElement;
  name: string;
  openMenuOnClear: boolean;
  openMenuOnFocus: boolean;
  reportCategory: ReportCategoryEnum;
  uuid: string;
  withoutConfirmButton: boolean;
};

const MaterialUISelectorConsumers: React.FC<Props> = ({
  chipsRenderer,
  className,
  inScrollBar,
  invalidAdvancedFilterItemsUUID,
  itemRenderer,
  memberDomElement,
  name,
  openMenuOnClear,
  openMenuOnFocus,
  reportCategory,
  uuid,
  withoutConfirmButton,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['search', 'reporting']);
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

  const isMemberFilteringInvalid = React.useMemo(() => {
    if (
      invalidAdvancedFilterItemsUUID &&
      invalidAdvancedFilterItemsUUID.length
    ) {
      return invalidAdvancedFilterItemsUUID.includes(uuid);
    }
    return false;
  }, [invalidAdvancedFilterItemsUUID, uuid]);

  const isDisabled = React.useMemo(
    () =>
      consumerIdsSelected?.length >= MAX_SELECTABLE_MEMBER ||
      isMemberFilteringInvalid,
    [consumerIdsSelected, isMemberFilteringInvalid],
  );

  const isOptionDisabled = React.useCallback(
    (option) => !consumerIdsSelected.includes(option.value) && isDisabled,
    [consumerIdsSelected, isDisabled],
  );

  const memberSearchParams = React.useMemo(
    () =>
      REPORT_CATEGORIES_WITHOUT_ARCHIVED_MEMBERS.includes(reportCategory)
        ? {
            hide_archived: true,
          }
        : {},
    [reportCategory],
  );

  const { handleInputChange, isSearchLoading, membersSelected, options } =
    useMemberSearch(
      consumerIdsSelected,
      defaultConsumerIdsSelected.current,
      memberSearchParams,
    );

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
        alreadySelectedCount={consumerIdsSelected?.length || 0}
        blurOnSelect={consumerIdsSelected?.length === MAX_SELECTABLE_MEMBER - 1}
        chipsRenderer={!!chipsRenderer && chipsRenderer}
        className={className}
        filterOption={filterOption}
        inScrollBar={inScrollBar}
        isDisabled={isDisabled}
        isLoading={isSearchLoading}
        isOptionDisabled={isOptionDisabled}
        itemRenderer={!!itemRenderer && itemRenderer}
        maxSelectedItems={MAX_SELECTABLE_MEMBER}
        name={name}
        onChange={handleOnChange}
        onInputChange={handleInputChange}
        openMenuOnClear={openMenuOnClear}
        openMenuOnFocus={openMenuOnFocus}
        options={options}
        placeholder={t('search:input')}
        withoutConfirmButton={withoutConfirmButton}
      />
      {memberDomElement &&
        ReactDOM.createPortal(
          <>
            {!!membersSelected?.length && !isMemberFilteringInvalid && (
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
            )}
            {isMemberFilteringInvalid && (
              <Alert className={classes.memberAlert} severity="error">
                {t('reporting:invalidFilter.user')}
              </Alert>
            )}
          </>,
          memberDomElement,
        )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  userSelector: { minWidth: '300px' },
  memberAlert: { marginTop: theme.spacing(1) },
}));

export default MaterialUISelectorConsumers;
