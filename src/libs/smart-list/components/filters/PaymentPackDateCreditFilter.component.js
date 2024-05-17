// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InlineDatePicker } from 'material-ui-pickers';

import { COMPARATORS_DICT } from '@bsport/common/lib/master-data/smart-list';
import Tooltip from '../../../../components/Tooltip.component';
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
          fetchItems={this.props.fetchItems.payment_packs}
          helperAllSelectedText={t(
            'multiSelector.paymentPacks.helperAllSelectedText',
          )}
          helperSelectedText={t(
            'multiSelector.paymentPacks.helperSelectedText',
          )}
          helperText={t('multiSelector.paymentPacks.helperText')}
          items={payment_pack}
          nameIdentifier="name"
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
          renderItem={(item) => {
            return <PaymentPackListItem pack={item} />;
          }}
          selectAll={this.props.filter_data.select_all_payment_pack}
          selectedItems={filter_data.payment_pack}
          textFieldPlaceholder={t(
            'multiSelector.paymentPacks.textFieldPlaceholder',
          )}
        />
        {t(`filters.${filter_data.filter_identifier}.second`)}
        <div className={classes.datePicker}>
          <InlineDatePicker
            keyboard
            ampm={false}
            className={classes.input}
            format="yyyy/MM/dd"
            onChange={(ev) => onChange({ date_start: ev.toISODate() })}
            onError={console.error}
            value={filter_data.date_start}
          />
        </div>
        {t(`filters.${filter_data.filter_identifier}.third`)}
        <div className={classes.datePicker}>
          <InlineDatePicker
            keyboard
            ampm={false}
            className={classes.input}
            format="yyyy/MM/dd"
            onChange={(ev) => onChange({ date_end: ev.toISODate() })}
            onError={console.error}
            value={filter_data.date_end}
          />
        </div>
        {t(`filters.${filter_data.filter_identifier}.fourth`)}
        <Select
          required
          className={classes.input}
          onChange={(ev) => onChange({ comparator: ev.target.value })}
          value={filter_data.comparator}
        >
          {COMPARATORS_DICT.map((item) => (
            <MenuItem key={item.key} value={item.value}>
              {t(`filters.classic_comparators.${item.value}`)}
            </MenuItem>
          ))}
        </Select>
        <DelayedNumericInput
          classes={classes}
          onChange={(ev) =>
            onChange({ value: ev.target.value === '' ? null : ev.target.value })
          }
          value={filter_data.value}
        />
        {this.props.t(`filters.${filter_data.filter_identifier}.fifth`)}

        <Tooltip
          aria-label="info"
          classes={classes}
          title={
            <Typography variant="subtitle2">
              {this.props.t(
                `filters.${filter_data.filter_identifier}.infoIcon`,
              )}
            </Typography>
          }
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
