import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { createStyles, Switch, Theme, withStyles } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { DateTime } from 'luxon';
import {
  COMPARATORS_DICT_BETWEEN,
  GTE_COMPARATOR,
  BETWEEN_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';
import DelayedNumericInput from '#src/components/DelayedNumericInput.component';

import CustomFormListItem from '#src/libs/custom-form/components/CustomFormListItem.component';
import { CustomForm } from '#src/libs/custom-form/types';
// @ts-expect-error
import Selector from '../MultiSelector.component';
import { MaterialStyleType } from '../../../../utils/types';

import CalendarPicker from '../CalendarPicker.component';
import { DATE_EXACT } from '../constants';

type OwnProps = {
  filter_data: any;
  custom_forms: Array<CustomForm>;
  onChange: (dict: any) => void;
  isNew: boolean;
  fetchItems: any;
  fetchBulkItems: any;
  renderSelectorWarning: (text: string, active: boolean) => void;

  setNotNullableData: (data: Array<string>) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class CustomFormsFilter extends Component<Props> {
  componentDidMount() {
    if (
      this.props.filter_data?.custom_forms &&
      this.props.filter_data?.custom_forms.length === 1
    ) {
      this.props.fetchBulkItems.custom_forms({
        id__in: this.props.filter_data?.custom_forms,
      });
    }
    this.props.setNotNullableData(['custom_forms']);
    if (this.props.isNew) {
      this.props.onChange({
        custom_forms: null,
        has_filled: false,
        all_selected_must_fulfill_condition: false,
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
  }

  render() {
    const { filter_data, t, classes, onChange, custom_forms } = this.props;
    const sortName = (a: CustomForm, b: CustomForm) =>
      a?.name < b?.name ? -1 : 1;
    const sortedCustomForms = [...(custom_forms || [])].sort(sortName);
    const sortedFilterDataCustomForms = [
      ...(filter_data?.custom_forms || []),
    ].sort(sortName);
    return (
      <div>
        <div className={classes.wrapper}>
          <Select
            required
            className={classes.input}
            defaultValue={false}
            onChange={(ev) => onChange({ has_filled: ev.target.value })}
            value={filter_data.has_filled}
          >
            {/* @ts-expect-error  eslint-disable-next-line */}
            <MenuItem key="true" value>
              {t(`filters.${filter_data?.filter_identifier}.hasCompleted`)}
            </MenuItem>
            {/* @ts-expect-error eslint-disable-next-line */}
            <MenuItem key="false" value={false}>
              {filter_data.all_selected_must_fulfill_condition === true
                ? t(
                    `filters.${filter_data?.filter_identifier}.hasCompletedNone`,
                  )
                : t(
                    `filters.${filter_data?.filter_identifier}.hasNotCompleted`,
                  )}
            </MenuItem>
          </Select>
          <Select
            required
            className={classes.input}
            defaultValue={false}
            onChange={(ev) =>
              onChange({ all_selected_must_fulfill_condition: ev.target.value })
            }
            value={filter_data.all_selected_must_fulfill_condition}
          >
            {/* @ts-expect-error eslint-disable-next-line */}
            <MenuItem key="true" value>
              {filter_data.has_filled
                ? t(`filters.${filter_data?.filter_identifier}.all`)
                : t(`filters.${filter_data?.filter_identifier}.none`)}
            </MenuItem>
            {/* @ts-expect-error eslint-disable-next-line */}
            <MenuItem key="false" value={false}>
              {t(`filters.${filter_data?.filter_identifier}.atLeastOne`)}
            </MenuItem>
          </Select>

          {t(`filters.${filter_data?.filter_identifier}.second`)}
          <Selector
            fetchItems={this.props.fetchItems.custom_forms}
            helperAllSelectedText={t(
              'multiSelector.customForms.helperAllSelectedText',
            )}
            helperSelectedText={t(
              'multiSelector.customForms.helperSelectedText',
            )}
            helperText={t('multiSelector.customForms.helperText')}
            items={sortedCustomForms}
            nameIdentifier="name"
            onChange={(items: CustomForm[], selectAll: boolean) => {
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
                  custom_forms: items?.length > 0 ? items : null,
                  select_all_custom_forms: selectAll,
                });
              }
            }}
            renderItem={(item: CustomForm) => {
              return (
                <CustomFormListItem
                  key={item.id}
                  customform={item}
                  gridItemXs={6}
                />
              );
            }}
            selectAll={this.props.filter_data?.select_all_custom_forms}
            selectedItems={sortedFilterDataCustomForms}
            textFieldPlaceholder={t(
              'multiSelector.customForms.textFieldPlaceholder',
            )}
          />
          {this.props.renderSelectorWarning(
            t('multiSelector.customForms.warning'),
            !(sortedFilterDataCustomForms?.length > 0),
          )}
        </div>
        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.completion_percentage_filter_active}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={() =>
              onChange({
                completion_percentage_filter_active:
                  !filter_data.completion_percentage_filter_active,
              })
            }
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
              onChange={(ev) =>
                onChange({ completion_percentage_comparator: ev.target.value })
              }
              value={filter_data?.completion_percentage_comparator}
            >
              {COMPARATORS_DICT_BETWEEN.map((item) => (
                <MenuItem key={item.key} value={item.value}>
                  {t(`filters.comparators.${item.value}`)}
                </MenuItem>
              ))}
            </Select>
            {filter_data?.completion_percentage_comparator !==
            BETWEEN_COMPARATOR
              ? t(`filters.${filter_data?.filter_identifier}.to`)
              : null}
            <DelayedNumericInput
              classes={classes}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              onChange={(ev) =>
                onChange({
                  completion_percentage_value:
                    ev.target.value === '' ? null : ev.target.value,
                })
              }
              value={filter_data?.completion_percentage_value}
            />
          </div>
          {filter_data?.completion_percentage_comparator === BETWEEN_COMPARATOR
            ? t(`filters.${filter_data?.filter_identifier}.between`)
            : null}
          {filter_data?.completion_percentage_comparator ===
          BETWEEN_COMPARATOR ? (
            <DelayedNumericInput
              classes={classes}
              InputProps={{
                inputProps: { min: 0, max: 100 },
              }}
              onChange={(ev) =>
                onChange({
                  completion_percentage_value_interval_end:
                    ev.target.value === '' ? null : ev.target.value,
                })
              }
              value={filter_data?.completion_percentage_value_interval_end}
            />
          ) : null}
        </div>
        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.date_filter_active}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={() =>
              onChange({
                date_filter_active: !filter_data.date_filter_active,
              })
            }
            value="checkedA"
          />
          <div
            className={
              filter_data.date_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.date.first`,
            )}
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
  }
}

const styles = (theme: Theme) =>
  createStyles({
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
  });

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(CustomFormsFilter);
