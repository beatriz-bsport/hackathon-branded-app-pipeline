// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import InlineDatePicker from 'material-ui-pickers/DatePicker/DatePickerInline';
import { DURATION_COMPARATORS_DICT } from '@bsport/common/lib/master-data/smart-list';
import { Moment } from '../../../../i18n';
import Selector from '../../../../components/Selector.component';
import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  buyable_identifiers: any,
  new: boolean,
  setNotNullableData: (Array<string>) => void,
};

function renderOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <ListItem
        selected={isSelected}
        isFocused={isFocused}
        primary={data}
        noDivider
        button
      >
        <ListItemText primary={data.label} />
      </ListItem>
    </div>
  );
}

export class ExpensesPerCategoryFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData([
      'comparator',
      'value',
      'date_end',
      'date_start',
    ]);

    if (this.props.new) {
      this.props.onChange({
        buyable_identifiers: [],
        comparator: null,
        value: null,
        date_start: null,
        date_end: null,
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
      <div className={classes.wrapper}>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <Select
          className={classes.input}
          required
          value={filter_data.comparator}
          onChange={(ev) => onChange({ comparator: ev.target.value })}
        >
          {DURATION_COMPARATORS_DICT.map((item) => (
            <MenuItem key={item.key} value={item.value}>
              {t(`filters.classic_comparators.${item.value}`)}
            </MenuItem>
          ))}
        </Select>
        <DelayedNumericInput
          value={filter_data.value}
          classes={classes}
          onChange={(ev) =>
            onChange({ value: ev.target.value === '' ? null : ev.target.value })
          }
        />
        {t(`filters.${filter_data.filter_identifier}.second`)}
        <MuiPickersUtilsProvider
          utils={MomentUtils}
          moment={Moment}
          locale={Moment.locale()}
        >
          <div className={classes.datePicker}>
            <InlineDatePicker
              className={classes.input}
              keyboard
              ampm={false}
              value={filter_data.date_start}
              onChange={(ev) =>
                onChange({ date_start: ev.format('YYYY-MM-DD') })
              }
              onError={console.error}
              format="YYYY/MM/DD"
            />
          </div>
          {t(`filters.${filter_data.filter_identifier}.third`)}
          <div className={classes.datePicker}>
            <InlineDatePicker
              className={classes.input}
              minDate={filter_data.date_start}
              keyboard
              ampm={false}
              value={filter_data.date_end}
              onChange={(ev) => onChange({ date_end: ev.format('YYYY-MM-DD') })}
              onError={console.error}
              format="YYYY/MM/DD"
            />
          </div>
        </MuiPickersUtilsProvider>
        <div className={classes.textMargin}>
          {t(`filters.${filter_data.filter_identifier}.fourth`)}
        </div>
        <div className={classes.selector}>
          <Selector
            defaultValue={buyable_identifiers[1]}
            selected={filter_data.buyable_identifiers}
            nullCurrentValue={null}
            placeholder={t(`filters.${filter_data.filter_identifier}.selector`)}
            suggestions={buyable_identifiers}
            components={{ Option: renderOption }}
            onChange={(ev) => {
              onChange({ buyable_identifiers: ev.map((pp) => pp.value) });
            }}
            isMulti
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={
                filter_data.buyable_identifiers &&
                buyable_identifiers.length > 0
                  ? buyable_identifiers.length ===
                    filter_data.buyable_identifiers.length
                  : false
              }
              onChange={() => {
                if (
                  filter_data.buyable_identifiers &&
                  buyable_identifiers.length ===
                    filter_data.buyable_identifiers.length
                ) {
                  onChange({ buyable_identifiers: [] });
                } else {
                  onChange({
                    buyable_identifiers: buyable_identifiers.map(
                      (item) => item.value,
                    ),
                  });
                }
              }}
              value="checkedG"
            />
          }
          label="All"
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textInput: {
    width: '50px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  datePicker: {
    width: '160px',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textMargin: {
    marginRight: theme.spacing(2),
  },
  selector: {
    minWidth: '275px',
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(ExpensesPerCategoryFilter);
