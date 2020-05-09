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
import Switch from '@material-ui/core/Switch';
import moment from 'moment';

import {
  DURATION_COMPARATORS_DICT_BETWEEN,
  BETWEEN_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';
import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import type { PaymentPack } from '../../../payment-packs/types';
import Selector from '../MultiSelector.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';
import CalendarPicker from '../CalendarPicker.component';

const DATE_BETWEEN = 2;
const DURATION_AFTER = 4;

type Props = {
  filter_data: any,
  t: TFunction,
  payment_packs: Array<PaymentPack>,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  fetchItems: (any) => void,
  fetchBulkItems: (any) => void,
  renderSelectorWarning: (string, boolean) => void,

  setNotNullableData: (Array<string>) => void,
};

export class PaymentPackFilter extends Component<Props, state> {
  componentDidMount() {
    if (this.props.new) {
      if (
        this.props.filter_data.payment_packs &&
        this.props.filter_data.payment_packs.length === 1
      ) {
        this.props.fetchBulkItems.payment_packs(
          this.props.filter_data.payment_packs,
        );
      }
      this.props.setNotNullableData(['payment_packs']);

      this.props.onChange({
        payment_packs: null,
        has_pack: true,
        credit_comparator: 2,
        credit_value: 1,
        credit_value_second: 4,
        expiration_date: moment().format('YYYY-MM-DD'),
        expiration_date_second: moment().format('YYYY-MM-DD'),
        expiration_duration: 0,
        expiration_duration_second: 6,
        expiration_date_filter_type: DURATION_AFTER,
        date_bought: moment().format('YYYY-MM-DD'),
        date_bought_second: moment().format('YYYY-MM-DD'),
        duration_bought: 0,
        duration_bought_second: 0,
        date_filter_type: DATE_BETWEEN,
        date_filter_active: false,
        credit_filter_active: false,
        expiration_date_filter_active: false,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange, payment_packs } = this.props;
    return (
      <div>
        <div className={classes.wrapper}>
          <Select
            className={classes.input}
            required
            value={filter_data.has_pack}
            onChange={(ev) => onChange({ has_pack: ev.target.value })}
          >
            <MenuItem key={true} value={true}>
              {t(`filters.${filter_data.filter_identifier}.has`)}
            </MenuItem>
            <MenuItem key={false} value={false}>
              {t(`filters.${filter_data.filter_identifier}.has_not`)}
            </MenuItem>
          </Select>
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
            selectAll={this.props.filter_data.select_all_payment_packs}
            items={payment_packs}
            selectedItems={filter_data.payment_packs}
            onChange={(items, selectAll) => {
              if (
                filter_data.payment_packs &&
                !(
                  items.length === filter_data.payment_packs.length &&
                  [...items].sort().every((value, index) => {
                    return (
                      value === [...filter_data.payment_packs].sort()[index]
                    );
                  })
                )
              ) {
                onChange({
                  payment_packs: items,
                  select_all_payment_packs: selectAll,
                });
              }
              if (!filter_data.payment_packs && items.length > 0) {
                onChange({
                  payment_packs: items,
                  select_all_payment_packs: selectAll,
                });
              }
            }}
          />
          {this.props.renderSelectorWarning(
            t('multiSelector.paymentPacks.warning'),
            true,
            filter_data.payment_packs,
          )}
        </div>
        <div className={classes.dateBoughtContainer}>
          <Switch
            checked={filter_data.date_filter_active}
            onChange={() =>
              onChange({
                date_filter_active: !filter_data.date_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <div
            className={
              filter_data.date_filter_active
                ? classes.dateBoughtContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.date_bought.first`,
            )}
            <CalendarPicker
              filter_data={{
                date_filter_type: filter_data.date_filter_type,
                duration_second: filter_data.duration_bought_second,
                duration: filter_data.duration_bought,
                date_second: filter_data.date_bought_second,
                date: filter_data.date_bought,
              }}
              onChange={(data) =>
                onChange({
                  date_filter_type: data.date_filter_type,
                  duration_bought_second: data.duration_second,
                  duration_bought: data.duration,
                  date_bought_second: data.date_second,
                  date_bought: data.date,
                })
              }
            />
          </div>
        </div>
        <div className={classes.dateBoughtContainer}>
          <Switch
            checked={filter_data.expiration_date_filter_active}
            onChange={() =>
              onChange({
                expiration_date_filter_active: !filter_data.expiration_date_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <div
            className={
              filter_data.expiration_date_filter_active
                ? classes.dateBoughtContainer
                : classes.disabled
            }
          >
            {filter_data.expiration_duration < 0 ||
            filter_data.expiration_duration_second < 0
              ? this.props.t(
                  `filters.${filter_data.filter_identifier}.expiration.first_has_expire`,
                )
              : this.props.t(
                  `filters.${filter_data.filter_identifier}.expiration.first_will_expire`,
                )}
            <CalendarPicker
              filter_data={{
                date_filter_type: filter_data.expiration_date_filter_type,
                duration_second: filter_data.expiration_duration_second,
                duration: filter_data.expiration_duration,
                date_second: filter_data.expiration_date_second,
                date: filter_data.expiration_date,
              }}
              onChange={(data) =>
                onChange({
                  expiration_date_filter_type: data.date_filter_type,
                  expiration_duration_second: data.duration_second,
                  expiration_duration: data.duration,
                  expiration_date_second: data.date_second,
                  expiration_date: data.date,
                })
              }
            />
          </div>
        </div>
        <div className={classes.dateBoughtContainer}>
          <Switch
            checked={filter_data.credit_filter_active}
            onChange={() =>
              onChange({
                credit_filter_active: !filter_data.credit_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <div
            className={
              filter_data.credit_filter_active
                ? classes.dateBoughtContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.credits.first`,
            )}

            <Select
              className={classes.input}
              required
              value={filter_data.credit_comparator}
              onChange={(ev) =>
                onChange({ credit_comparator: ev.target.value })
              }
            >
              {DURATION_COMPARATORS_DICT_BETWEEN.map((item) => (
                <MenuItem key={item.key} value={item.value}>
                  {t(`filters.durations_comparators.${item.value}`)}
                </MenuItem>
              ))}
            </Select>
            <DelayedNumericInput
              classes={classes}
              value={filter_data.credit_value}
              onChange={(ev) =>
                onChange({
                  credit_value: ev.target.value === '' ? null : ev.target.value,
                })
              }
            />
            {filter_data.credit_comparator === BETWEEN_COMPARATOR
              ? this.props.t(
                  `filters.${filter_data.filter_identifier}.credits.second`,
                )
              : null}

            {filter_data.credit_comparator === BETWEEN_COMPARATOR ? (
              <DelayedNumericInput
                classes={classes}
                value={filter_data.credit_value_second}
                onChange={(ev) =>
                  onChange({
                    credit_value_second:
                      ev.target.value === '' ? null : ev.target.value,
                  })
                }
              />
            ) : null}
          </div>
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
      </div>
    );
  }
}

const styles = (theme) => ({
  dateBoughtContainer: { display: 'flex', alignItems: 'center' },
  disabled: {
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    background: '#f1f1f1',
    borderRadius: '7px',
    paddingLeft: theme.spacing(1),
  },
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
  withNamespaces(['smartList']),
  withStyles(styles),
)(PaymentPackFilter);
