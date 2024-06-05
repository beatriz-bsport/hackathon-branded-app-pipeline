import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { DateTime } from 'luxon';
import {
  COMPARATORS_DICT_BETWEEN,
  GTE_COMPARATOR,
  BETWEEN_COMPARATOR,
  NO_FORM,
  ALL_FORMS,
  AT_LEAST_ONE_FORM,
} from '@bsport/common/lib/master-data/smart-list';
import DelayedNumericInput from '#components/DelayedNumericInput.component';

// @ts-expect-error
import CustomFormListItem from '#libs/custom-form/components/CustomFormListItem.component';
import type { CustomForm } from '#libs/custom-form/types';
import type {
  FetchBulkItemsType,
  FetchItemsType,
} from '#libs/smart-list/types';
import Selector from '../MultiSelector.component';

import CalendarPicker from '../CalendarPicker.component';
import { DATE_EXACT } from '../constants';

type FilterData = {
  filter_identifier: number;
  custom_forms: CustomForm[];
  select_all_custom_forms: boolean;
  all_selected_must_fulfill_condition_v2: number;
  is_v2: boolean;
  date_filter_active: boolean;
  date: string;
  date_second: string;
  duration: number;
  duration_second: number;
  date_filter_type: number;
  completion_percentage_filter_active: boolean;
  completion_percentage_value: string | number;
  completion_percentage_value_interval_end: string | number;
  completion_percentage_comparator: number;
};

type OwnProps = {
  filter_data: FilterData;
  custom_forms: CustomForm[];
  onChange: (dict: Partial<FilterData>) => void;
  isNew: boolean;
  fetchItems: FetchItemsType;
  fetchBulkItems: FetchBulkItemsType;
  renderSelectorWarning: (text: string, active: boolean) => void;
  setNotNullableData: (data: string[]) => void;
};

const CustomFormsFilterV2: React.FC<OwnProps> = ({
  filter_data,
  custom_forms,
  isNew,
  onChange,
  fetchItems,
  fetchBulkItems,
  renderSelectorWarning,
  setNotNullableData,
}) => {
  const { t } = useTranslation('smartList');
  const classes = useStyles();

  React.useEffect(() => {
    if (filter_data.custom_forms && filter_data.custom_forms.length === 1) {
      fetchBulkItems.custom_forms({
        id__in: filter_data.custom_forms.map((customForm) => customForm.id),
      });
    }
  }, [fetchBulkItems, filter_data.custom_forms]);

  React.useEffect(() => {
    setNotNullableData(['custom_forms']);
  }, [setNotNullableData]);

  React.useEffect(() => {
    if (isNew) {
      onChange({
        custom_forms: null,
        all_selected_must_fulfill_condition_v2: NO_FORM,
        date_filter_active: false,
        date: DateTime.now().toISODate(),
        date_second: DateTime.now().toISODate(),
        duration: -5,
        duration_second: -10,
        date_filter_type: DATE_EXACT,
        completion_percentage_filter_active: false,
        completion_percentage_value: 0,
        completion_percentage_value_interval_end: 100,
        completion_percentage_comparator: GTE_COMPARATOR,
      });
    }
  }, [isNew, onChange]);

  const sortName = (a: CustomForm, b: CustomForm) =>
    a?.name < b?.name ? -1 : 1;

  const sortedCustomForms = [...(custom_forms || [])].sort(sortName);

  const sortedFilterDataCustomForms = [
    ...(filter_data?.custom_forms || []),
  ].sort(sortName);

  const handleConditionV2Change = React.useCallback(
    (event: ChangeEvent<{ value: number }>) =>
      onChange({
        all_selected_must_fulfill_condition_v2: event.target.value,
      }),
    [onChange],
  );

  const handleCustomFormsChange = React.useCallback(
    (items: CustomForm[], selectAll: boolean) => {
      if (
        (sortedFilterDataCustomForms &&
          !(
            items?.length === sortedFilterDataCustomForms.length &&
            [...(items || [])].sort(sortName).every((value, index) => {
              return value === sortedFilterDataCustomForms[index];
            })
          )) ||
        (!sortedFilterDataCustomForms && items?.length > 0)
      ) {
        onChange({
          custom_forms: items?.length > 0 && items,
          select_all_custom_forms: selectAll,
        });
      }
    },
    [onChange, sortedFilterDataCustomForms],
  );

  const handleCompletionFilterChange = React.useCallback(
    () =>
      onChange({
        completion_percentage_filter_active:
          !filter_data.completion_percentage_filter_active,
      }),
    [filter_data.completion_percentage_filter_active, onChange],
  );

  const handleCompletionComparatorChange = React.useCallback(
    (event: ChangeEvent<{ value: number }>) =>
      onChange({ completion_percentage_comparator: event.target.value }),
    [onChange],
  );

  const handleCompletionValueChange = React.useCallback(
    (event: ChangeEvent<{ value: string | number }>) =>
      onChange({
        completion_percentage_value:
          event.target.value !== '' && event.target.value,
      }),
    [onChange],
  );

  const handleCompletionEndValueChange = React.useCallback(
    (event: ChangeEvent<{ value: string | number }>) =>
      onChange({
        completion_percentage_value_interval_end:
          event.target.value !== '' && event.target.value,
      }),
    [onChange],
  );

  const handleDateFilterChange = React.useCallback(
    () =>
      onChange({
        date_filter_active: !filter_data.date_filter_active,
      }),
    [filter_data.date_filter_active, onChange],
  );

  return (
    <div>
      <div className={classes.wrapper}>
        <Typography variant="body1">
          {t(`filters.${filter_data?.filter_identifier}.first`)}
        </Typography>
        <Select
          required
          className={classes.input}
          defaultValue={NO_FORM}
          onChange={handleConditionV2Change}
          value={filter_data.all_selected_must_fulfill_condition_v2}
        >
          <MenuItem key="none" value={NO_FORM}>
            {t(`filters.${filter_data?.filter_identifier}.none`)}
          </MenuItem>
          <MenuItem key="all" value={ALL_FORMS}>
            {t(`filters.${filter_data?.filter_identifier}.all`)}
          </MenuItem>
          <MenuItem key="atLeastOne" value={AT_LEAST_ONE_FORM}>
            {t(`filters.${filter_data?.filter_identifier}.atLeastOne`)}
          </MenuItem>
        </Select>

        {t(`filters.${filter_data?.filter_identifier}.second`)}
        <Selector
          fetchItems={fetchItems.custom_forms}
          helperAllSelectedText={t(
            'multiSelector.customForms.helperAllSelectedText',
          )}
          helperSelectedText={t('multiSelector.customForms.helperSelectedText')}
          helperText={t('multiSelector.customForms.helperText')}
          items={sortedCustomForms}
          nameIdentifier="name"
          onChange={handleCustomFormsChange}
          renderItem={(item: CustomForm) => (
            <CustomFormListItem
              key={item.id}
              customform={item}
              gridItemXs={6}
            />
          )}
          selectAll={filter_data?.select_all_custom_forms}
          selectedItems={sortedFilterDataCustomForms}
          textFieldPlaceholder={t(
            'multiSelector.customForms.textFieldPlaceholder',
          )}
        />
        {renderSelectorWarning(
          t('multiSelector.customForms.warning'),
          !(sortedFilterDataCustomForms?.length > 0),
        )}
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.completion_percentage_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleCompletionFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.completion_percentage_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          {t(`filters.${filter_data?.filter_identifier}.third`)}
          <Select
            required
            className={classes.input}
            defaultValue={GTE_COMPARATOR}
            onChange={handleCompletionComparatorChange}
            value={filter_data?.completion_percentage_comparator}
          >
            {COMPARATORS_DICT_BETWEEN.map((item) => (
              <MenuItem key={item.key} value={item.value}>
                {t(`filters.comparators.${item.value}`)}
              </MenuItem>
            ))}
          </Select>
          {filter_data?.completion_percentage_comparator !==
            BETWEEN_COMPARATOR &&
            t(`filters.${filter_data?.filter_identifier}.to`)}
          <DelayedNumericInput
            InputProps={{ InputProps: { min: 0, max: 100 } }}
            onChange={handleCompletionValueChange}
            value={filter_data?.completion_percentage_value}
          />
        </div>
        {filter_data?.completion_percentage_comparator === BETWEEN_COMPARATOR &&
          t(`filters.${filter_data?.filter_identifier}.between`)}
        {filter_data?.completion_percentage_comparator ===
          BETWEEN_COMPARATOR && (
          <DelayedNumericInput
            InputProps={{ InputProps: { min: 0, max: 100 } }}
            onChange={handleCompletionEndValueChange}
            value={filter_data?.completion_percentage_value_interval_end}
          />
        )}
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.date_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleDateFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.date_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          {t(`filters.${filter_data.filter_identifier}.date.first`)}
          <CalendarPicker
            // @ts-expect-error
            blockValidateOnClickAway
            filter_data={filter_data}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textInput: {
    width: '50px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  inlineContainer: { display: 'flex', alignItems: 'center' },
  datePicker: {
    width: '160px',
  },
  disabled: {
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    background: '#f1f1f1',
    borderRadius: '7px',
    paddingLeft: theme.spacing(1),
  },
}));

export default React.memo(CustomFormsFilterV2);
