// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { COMPARATORS_DICT } from '@bsport/common/lib/master-data/smart-list';
import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import Selector from '../MultiSelector.component';
import type { PaymentPack } from '../../../payment-packs/types';

type Props = {
  filter_data: any,
  t: TFunction,
  payment_packs: Array<PaymentPack>,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
};

export class PaymentPackCreditFilter extends Component<Props, state> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({
        payment_pack: null,
        comparator: null,
        value: null,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange, payment_packs } = this.props;
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
          primaryTextIdentifier="name"
          items={payment_packs}
          selectedItems={filter_data.payment_pack}
          onChange={(items) => {
            if (
              filter_data.payment_pack &&
              !(
                items.length === filter_data.payment_pack.length &&
                [...items].sort().every((value, index) => {
                  return value === [...filter_data.payment_pack].sort()[index];
                })
              )
            ) {
              onChange({ payment_pack: items });
            }
            if (!filter_data.payment_pack && items.length > 0) {
              onChange({ payment_pack: items });
            }
          }}
        />
        {t(`filters.${filter_data.filter_identifier}.second`)}
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
        {this.props.t(`filters.${filter_data.filter_identifier}.third`)}
        <DelayedNumericInput
          classes={classes}
          value={filter_data.value}
          onChange={(ev) => onChange({ value: ev.target.value })}
        />
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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  textInput: {
    width: '50px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  selector: {
    minWidth: '300px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(PaymentPackCreditFilter);
