// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DURATION_COMPARATORS_DICT_BETWEEN,
  BETWEEN_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';
import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import CalendarPicker from '../CalendarPicker.component';
import Selector from '../MultiSelector.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  buyable_identifiers: any,
  new: boolean,
  setNotNullableData: (Array<string>) => void,
};

export class ExpensesPerCategoryFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData(['comparator', 'value']);

    if (this.props.new) {
      this.props.onChange({
        buyable_identifiers: [],
        comparator: 2,
        value: 20,
        value_second: 40,
        date: moment().format('YYYY-MM-DD'),
        date_second: moment().format('YYYY-MM-DD'),
        duration: 0,
        duration_second: 0,
        date_filter_type: 2,
        date_filter_active: false,
      });
    }
  }

  render() {
    const {
      filter_data,
      t,
      classes,
      onChange,
      buyable_identifiers,
    } = this.props;
    return (
      <div>
        <div className={classes.wrapper}>
          {t(`filters.${filter_data.filter_identifier}.first`)}
          <Select
            className={classes.input}
            required
            value={filter_data.comparator}
            onChange={(ev) => onChange({ comparator: ev.target.value })}
          >
            {DURATION_COMPARATORS_DICT_BETWEEN.map((item) => (
              <MenuItem key={item.key} value={item.value}>
                {t(`filters.durations_comparators.${item.value}`)}
              </MenuItem>
            ))}
          </Select>
          <DelayedNumericInput
            value={filter_data.value}
            classes={classes}
            onChange={(ev) =>
              onChange({
                value: ev.target.value === '' ? null : ev.target.value,
              })
            }
          />
          {filter_data.comparator === BETWEEN_COMPARATOR
            ? t(`filters.${filter_data.filter_identifier}.between`)
            : null}
          {filter_data.comparator === BETWEEN_COMPARATOR ? (
            <DelayedNumericInput
              classes={classes}
              value={filter_data.value_second}
              onChange={(ev) =>
                onChange({
                  value_second: ev.target.value === '' ? null : ev.target.value,
                })
              }
            />
          ) : null}
          {t(`filters.${filter_data.filter_identifier}.second`)}
          <Selector
            helperText={t('multiSelector.buyables.helperText')}
            helperSelectedText={t('multiSelector.buyables.helperSelectedText')}
            helperAllSelectedText={t(
              'multiSelector.buyables.helperAllSelectedText',
            )}
            textFieldPlaceholder={t(
              'multiSelector.buyables.textFieldPlaceholder',
            )}
            renderItem={(item) => {
              return <Typography> {item.label}</Typography>;
            }}
            selectAll={
              filter_data.buyable_identifiers &&
              buyable_identifiers.length ===
                filter_data.buyable_identifiers.length
            }
            nameIdentifier="label"
            items={buyable_identifiers}
            selectedItems={filter_data.buyable_identifiers}
            onChange={(items, selectAll) => {
              if (selectAll) {
                onChange({
                  buyable_identifiers: buyable_identifiers.map(
                    (item) => item.id,
                  ),
                });
              } else if (
                filter_data.buyable_identifiers &&
                !(
                  items.length === filter_data.buyable_identifiers.length &&
                  [...items].sort().every((value, index) => {
                    return (
                      value ===
                      [...filter_data.buyable_identifiers].sort()[index]
                    );
                  })
                )
              ) {
                onChange({
                  buyable_identifiers: items,
                });
              } else if (!filter_data.buyable_identifiers && items.length > 0) {
                onChange({
                  buyable_identifiers: items,
                });
              }
            }}
          />
        </div>
        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.date_filter_active}
            onChange={() =>
              onChange({
                date_filter_active: !filter_data.date_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />{' '}
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
            <CalendarPicker filter_data={filter_data} onChange={onChange} />
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  input: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },

  datePicker: {
    width: '160px',
  },
  textInput: {
    width: '50px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  disabled: {
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    background: '#f1f1f1',
    borderRadius: '7px',
    paddingLeft: theme.spacing.unit,
  },
  inlineContainer: { display: 'flex', alignItems: 'center' },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textMargin: {
    marginRight: theme.spacing.unit * 2,
  },
  selector: {
    minWidth: '275px',
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(ExpensesPerCategoryFilter);
