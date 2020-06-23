// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import InlineDatePicker from 'material-ui-pickers/DatePicker/DatePickerInline';

import { COMPARATORS_DICT } from '@bsport/common/lib/master-data/smart-list';
import { Moment } from '../../../../i18n';
import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import type { PaymentPack } from '../../../payment-packs/types';
import Selector from '../MultiSelector.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';

type Props = {
  filter_data: any,
  t: TFunction,
  payment_pack: Array<PaymentPack>,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  fetchItems: any,
  fetchBulkItems: any,
  setNotNullableData: (Array<string>) => void,
};

export class PaymentPackDateCreditFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData([
      'comparator',
      'value',
      'payment_pack',
      'date_end',
      'date_start',
    ]);

    const { payment_pack } = this.props.filter_data;
    if (payment_pack && payment_pack.length === 1) {
      this.props.fetchBulkItems.payment_packs(payment_pack);
    }
    this.props.setNotNullableData([
      'payment_pack',
      'comparator',
      'value',
      'date_end',
      'date_start',
    ]);

    if (this.props.new) {
      this.props.onChange({
        payment_pack: null,
        comparator: null,
        value: null,
        date_start: null,
        date_end: null,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange, payment_pack } = this.props;
    return (
      <div className={classes.wrapper}>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <Selector
          helperText={t('multiSelector.paymentPacks.helperText')}
          helperSelectedText={t(
            'multiSelector.paymentPacks.helperSelectedText',
          )}
          textFieldPlaceholder={t(
            'multiSelector.paymentPacks.textFieldPlaceholder',
          )}
          renderItem={(item) => {
            return <PaymentPackListItem pack={item} />;
          }}
          helperAllSelectedText={t(
            'multiSelector.paymentPacks.helperAllSelectedText',
          )}
          fetchItems={this.props.fetchItems.payment_packs}
          nameIdentifier="name"
          selectAll={this.props.filter_data.select_all_payment_pack}
          items={payment_pack}
          selectedItems={filter_data.payment_pack}
          onChange={(items, selectAll) => {
            if (
              filter_data.payment_pack &&
              !(
                items.length === filter_data.payment_pack.length &&
                [...items].sort().every((value, index) => {
                  return value === [...filter_data.payment_pack].sort()[index];
                })
              )
            ) {
              onChange({
                payment_pack: items,
                select_all_payment_packs: selectAll,
              });
            }
            if (!filter_data.payment_pack && items.length > 0) {
              onChange({
                payment_pack: items,
                select_all_payment_packs: selectAll,
              });
            }
          }}
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
              keyboard
              ampm={false}
              value={filter_data.date_end}
              onChange={(ev) => onChange({ date_end: ev.format('YYYY-MM-DD') })}
              onError={console.error}
              format="YYYY/MM/DD"
            />
          </div>
        </MuiPickersUtilsProvider>
        {t(`filters.${filter_data.filter_identifier}.fourth`)}
        <Select
          className={classes.input}
          required
          value={filter_data.comparator}
          onChange={(ev) => onChange({ comparator: ev.target.value })}
        >
          {COMPARATORS_DICT.map((item) => (
            <MenuItem key={item.key} value={item.value}>
              {t(`filters.classic_comparators.${item.value}`)}
            </MenuItem>
          ))}
        </Select>
        <DelayedNumericInput
          classes={classes}
          value={filter_data.value}
          onChange={(ev) =>
            onChange({ value: ev.target.value === '' ? null : ev.target.value })
          }
        />
        {this.props.t(`filters.${filter_data.filter_identifier}.fifth`)}

        <Tooltip
          classes={classes}
          title={
            <Typography variant="subtitle2">
              {this.props.t(
                `filters.${filter_data.filter_identifier}.infoIcon`,
              )}
            </Typography>
          }
          aria-label="info"
        >
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

const styles = (theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,

    fontSize: 11,
  },
  selectorGrow: {
    flexGrow: 0,
  },
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
  selector: {
    minWidth: '300px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(PaymentPackDateCreditFilter);
