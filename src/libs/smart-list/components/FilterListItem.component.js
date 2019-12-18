// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_PURCHASED_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
  WENT_TO_ACTIVITY_FILTER_IDENTIFIER,
  TAG_FILTER_IDENTIFIER,
  PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER,
  EXPENSES_FILTER_IDENTIFIER,
  PAYMENT_PACK_EXPIRATION_IDENTIFIER,
} from '@bsport/common/lib/master-data/smart-list';

import CreditAccountFilter from './filters/CreditAccountFilter.component';
import LastPreviousBookingFilter from './filters/LastPreviousBookingFilter.component';
import DateJoinedFilter from './filters/DateJoinedFilter.component';
import GenderFilter from './filters/GenderFilter.component';
import PaymentPackPurchasedFilter from './filters/PaymentPackPurchasedFilter.component';
import PaymentPackCreditFilter from './filters/PaymentPackCreditFilter.component';
import HasValidPackFilter from './filters/HasValidPackFilter.component';
import PaymentPackExpirationFilter from './filters/PaymentPackExpirationFilter.component';

import SeniorityFilter from './filters/SeniorityFilter.component';
import MetaActivityFilter from './filters/MetaActivityFilter.component';
import BookingAttendanceFilter from './filters/BookingAttendanceFilter.component';
import TagFilter from './filters/TagFilter.component';
import PaymentPackDateCreditFilter from './filters/PaymentPackDateCreditFilter.component';
import ExpensesPerCategoryFilter from './filters/ExpensesPerCategoryFilter.component';

import type { PaymentPack } from '../../payment-packs/types';

type Props = {
  payment_packs: Array<PaymentPack>,
  meta_activities: Array<any>,
  classes: Object,
  tag_groups: Array<any>,
  tags: Array<any>,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  onClickCreate: (filter_identifier: number, data: any) => void,
  filter: any,
  new: boolean,
  t: TFunction,
};

const WORKSHOP_ITEM_IDENTIFIER = 50;
const SHOP_ITEM_IDENTIFIER = 2;
const PAYMENT_PACK_ITEM_IDENTIFIER = 1;
const PRIVATE_PASS_ITEM_IDENTIFIER = 9;
const COMBO_ITEM_IDENTIFIER = 10;

export class FilterCard extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      filter_data: props.filter,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      this.setState({
        filter_data: this.props.filter,
      });
    }
  }

  handleChange = (dict) => {
    const dataDict = { ...this.state.filter_data, ...dict };
    this.setState((prevState) => ({
      filter_data: { ...prevState.filter_data, ...dict },
    }));
    if (!this.props.new) {
      this.props.onClickEdit(
        this.props.filter.filter_identifier,
        this.props.filter.id,
        dataDict,
      );
    }
  };

  filterTypeSelector = () => {
    switch (this.state.filter_data.filter_identifier) {
      case CREDIT_ACCOUNT_FILTER_IDENTIFIER:
        return (
          <CreditAccountFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
          />
        );
      case LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER:
        return (
          <LastPreviousBookingFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
          />
        );

      case DATE_JOINED_FILTER_IDENTIFIER:
        return (
          <DateJoinedFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
          />
        );
      case PAYMENT_PACK_PURCHASED_FILTER_IDENTIFIER:
        return (
          <PaymentPackPurchasedFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            new={this.props.new}
          />
        );
      case GENDER_FILTER_IDENTIFIER:
        return (
          <GenderFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
          />
        );
      case PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER:
        return (
          <PaymentPackCreditFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            new={this.props.new}
          />
        );
      case PAYMENT_PACK_EXPIRATION_IDENTIFIER:
        return (
          <PaymentPackExpirationFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            new={this.props.new}
          />
        );
      case PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER:
        return (
          <PaymentPackDateCreditFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            new={this.props.new}
          />
        );
      case SENIORITY_FILTER_IDENTIFIER:
        return (
          <SeniorityFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
          />
        );
      case HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER:
        return (
          <HasValidPackFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            new={this.props.new}
          />
        );
      case WENT_TO_ACTIVITY_FILTER_IDENTIFIER:
        return (
          <MetaActivityFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            meta_activities={this.props.meta_activities}
            new={this.props.new}
          />
        );
      case BOOKING_ATTENDANCE_FILTER_IDENTIFIER:
        return (
          <BookingAttendanceFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
          />
        );
      case TAG_FILTER_IDENTIFIER:
        return (
          <TagFilter
            filter_data={this.state.filter_data}
            tag_groups={this.props.tag_groups}
            tags={this.props.tags}
            onChange={this.handleChange}
            new={this.props.new}
          />
        );
      case EXPENSES_FILTER_IDENTIFIER:
        return (
          <ExpensesPerCategoryFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
            buyable_identifiers={[
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.shop`,
                ),
                value: SHOP_ITEM_IDENTIFIER,
              },
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.pack`,
                ),
                value: PAYMENT_PACK_ITEM_IDENTIFIER,
              },
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.workshop`,
                ),
                value: WORKSHOP_ITEM_IDENTIFIER,
              },
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.private_pass`,
                ),
                value: PRIVATE_PASS_ITEM_IDENTIFIER,
              },
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.combo`,
                ),
                value: COMBO_ITEM_IDENTIFIER,
              },
            ]}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { t, filter } = this.props;
    return (
      <div>
        <div className={this.props.classes.rowContainer}>
          <Typography
            variant="body1"
            className={this.props.classes.filterContainer}
          >
            {this.filterTypeSelector()}
          </Typography>
          <div className={this.props.classes.buttonContainer}>
            {this.props.onClickCreate ? (
              <Button
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  this.props.onClickCreate(
                    filter.filter_identifier,
                    this.state.filter_data,
                  );
                }}
                color="secondary"
                disabled={Object.values(this.state.filter_data).includes(null)}
              >
                <SaveIcon className={this.props.classes.leftIcon} />
                {t('filters.add')}
              </Button>
            ) : null}
            {this.props.onClickDelete ? (
              <IconButton
                className={this.props.classes.leftIcon}
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  this.props.onClickDelete(filter.filter_identifier, filter.id);
                }}
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
            ) : null}
          </div>
        </div>
        <Divider />
      </div>
    );
  }
}

const styles = (theme) => ({
  rowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  filterContainer: {
    padding: theme.spacing.unit * 2,
    justifyContent: 'space-between',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
    maxHeigth: '50px',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['smartList']),
)(FilterCard);
