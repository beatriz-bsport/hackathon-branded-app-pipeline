// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  TAG_FILTER_IDENTIFIER,
  EXPENSES_FILTER_IDENTIFIER,
  MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  BASKET_ABANDONMENT_FILTER_IDENTIFIER,
  BOOKINGS_NUMBER_FILTER_IDENTIFIER,
  BOOKINGS_FILTER_IDENTIFIER,
  USER_HAS_PASSWORD_FILTER,
  FIRST_BOOKING_FILTER_IDENTIFIER,
  EXPENSES_COMPLETE_FILTER_IDENTIFIER,
  FILTER_BOOKING_LAST,
  PRIVATE_BOOKINGS_FILTER_IDENTIFIER,
  PRIVATE_PASS_FILTER_IDENTIFIER,
} from '@bsport/common/lib/master-data/smart-list';

import CreditAccountFilter from './filters/CreditAccountFilter.component';
import LastPreviousBookingFilter from './filters/LastPreviousBookingFilter.component';
import GenderFilter from './filters/GenderFilter.component';
import BookingsNumberFilter from './filters/BookingsNumberFilter.component';
import TagFilter from './filters/TagFilter.component';
import MemberDateJoinedFilter from './filters/MemberDateJoinedFilter.component';
import PaymentPackFilter from './filters/PaymentPackFilter.component';
import BasketAbandonmentFilter from './filters/BasketAbandonmentFilter.component';
import BookingsFilter from './filters/BookingsFilter.component';
import FirstBookingFilter from './filters/FirstBookingFilter.component';
import UserHasPasswordFilter from './filters/UserHasPasswordFilter.component';
import ExpensesCompleteFilter from './filters/ExpensesCompleteFilter.component';
import PrivatePassFilter from './filters/PrivatePassFilter.component';
import PrivateBookingsFilter from './filters/PrivateBookingsFilter.component';

import type { PaymentPack } from '../../payment-packs/types';
import type { Establishment } from '../../establishment/types';
import type { Coach } from '../../associated-coach/types';
import type { PrivatePass } from '../../private-service/types';

type Props = {
  payment_packs: Array<PaymentPack>,
  private_passes: Array<PrivatePass>,
  meta_activities: Array<any>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  classes: Object,
  tag_groups: Array<any>,
  tags: Array<any>,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  onClickCreate: (filter_identifier: number, data: any) => void,
  filter: any,
  fetchItems: any,

  fetchBulkItems: any,

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
      not_nullable_data: [],
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
    if (
      !this.props.new &&
      this.state.not_nullable_data
        .map((item) => dataDict[item])
        .every((item) => item !== null)
    ) {
      this.props.onClickEdit(
        this.props.filter.filter_identifier,
        this.props.filter.id,
        {
          ...this.state.not_nullable_data.reduce((map, obj) => {
            const newMap = map;
            newMap[obj] = dataDict[obj];
            return newMap;
          }, {}),
          ...dict,
        },
      );
    }
  };

  setNotNullableData = (data) => {
    this.setState({ not_nullable_data: data });
  };

  renderSelectorWarning = (text, active, items) => {
    if (active && (!items || items.length === 0)) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon
            color="error"
            size={15}
            className={this.props.classes.warningIcon}
          />
          <Typography variant="body1">{text}</Typography>
        </div>
      );
    }
    return null;
  };

  renderAttendanceSelectorWarning = (
    active: boolean,
    value: boolean | null,
  ) => {
    if (active && value === null) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon
            color="error"
            size={15}
            className={this.props.classes.warningIcon}
          />
          <Typography variant="body1">
            {this.props.t('filters.attendanceWarning')}
          </Typography>
        </div>
      );
    }
    return null;
  };

  filterTypeSelector = () => {
    switch (this.state.filter_data.filter_identifier) {
      case CREDIT_ACCOUNT_FILTER_IDENTIFIER:
        return (
          <CreditAccountFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case MEMBER_DATE_JOINED_FILTER_IDENTIFIER:
        return (
          <MemberDateJoinedFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case GENDER_FILTER_IDENTIFIER:
        return (
          <GenderFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case BASKET_ABANDONMENT_FILTER_IDENTIFIER:
        return (
          <BasketAbandonmentFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case FILTER_BOOKING_LAST:
        return (
          <LastPreviousBookingFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
            setNotNullableData={this.setNotNullableData}
          />
        );

      case PAYMENT_PACK_FILTER_IDENTIFIER:
        return (
          <PaymentPackFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            fetchItems={this.props.fetchItems}
            fetchBulkItems={this.props.fetchBulkItems}
            new={this.props.new}
            setNotNullableData={this.setNotNullableData}
            renderSelectorWarning={this.renderSelectorWarning}
          />
        );
      case PRIVATE_PASS_FILTER_IDENTIFIER:
        return (
          <PrivatePassFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            private_passes={this.props.private_passes}
            fetchItems={this.props.fetchItems}
            fetchBulkItems={this.props.fetchBulkItems}
            new={this.props.new}
            setNotNullableData={this.setNotNullableData}
            renderSelectorWarning={this.renderSelectorWarning}
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
            setNotNullableData={this.setNotNullableData}
          />
        );
      case BOOKINGS_NUMBER_FILTER_IDENTIFIER:
        return (
          <BookingsNumberFilter
            filter_data={this.state.filter_data}
            establishments={this.props.establishments}
            onChange={this.handleChange}
            meta_activities={this.props.meta_activities}
            new={this.props.new}
            fetchItems={this.props.fetchItems}
            payment_packs={this.props.payment_packs}
            coaches={this.props.coaches}
            fetchBulkItems={this.props.fetchBulkItems}
            setNotNullableData={this.setNotNullableData}
            renderSelectorWarning={this.renderSelectorWarning}
            renderAttendanceSelectorWarning={
              this.renderAttendanceSelectorWarning
            }
          />
        );
      case FIRST_BOOKING_FILTER_IDENTIFIER:
        return (
          <FirstBookingFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: BOOKINGS_NUMBER_FILTER_IDENTIFIER,
            }}
            establishments={this.props.establishments}
            onChange={this.handleChange}
            meta_activities={this.props.meta_activities}
            new={this.props.new}
            fetchItems={this.props.fetchItems}
            payment_packs={this.props.payment_packs}
            coaches={this.props.coaches}
            fetchBulkItems={this.props.fetchBulkItems}
            setNotNullableData={this.setNotNullableData}
            renderSelectorWarning={this.renderSelectorWarning}
            renderAttendanceSelectorWarning={
              this.renderAttendanceSelectorWarning
            }
          />
        );
      case USER_HAS_PASSWORD_FILTER:
        return (
          <UserHasPasswordFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: USER_HAS_PASSWORD_FILTER,
            }}
            onChange={this.handleChange}
            new={this.props.new}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case BOOKINGS_FILTER_IDENTIFIER:
        return (
          <BookingsFilter
            filter_data={this.state.filter_data}
            establishments={this.props.establishments}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            meta_activities={this.props.meta_activities}
            new={this.props.new}
            coaches={this.props.coaches}
            fetchItems={this.props.fetchItems}
            fetchBulkItems={this.props.fetchBulkItems}
            setNotNullableData={this.setNotNullableData}
            renderSelectorWarning={this.renderSelectorWarning}
            renderAttendanceSelectorWarning={
              this.renderAttendanceSelectorWarning
            }
          />
        );
      case PRIVATE_BOOKINGS_FILTER_IDENTIFIER:
        return (
          <PrivateBookingsFilter
            filter_data={this.state.filter_data}
            establishments={this.props.establishments}
            onChange={this.handleChange}
            private_passes={this.props.private_passes}
            new={this.props.new}
            coaches={this.props.coaches}
            fetchItems={this.props.fetchItems}
            fetchBulkItems={this.props.fetchBulkItems}
            setNotNullableData={this.setNotNullableData}
            renderSelectorWarning={this.renderSelectorWarning}
          />
        );
      case EXPENSES_COMPLETE_FILTER_IDENTIFIER:
        return (
          <ExpensesCompleteFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
            setNotNullableData={this.setNotNullableData}
            buyable_identifiers={[
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.shop`,
                ),
                id: SHOP_ITEM_IDENTIFIER,
              },
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.pack`,
                ),
                id: PAYMENT_PACK_ITEM_IDENTIFIER,
              },
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.workshop`,
                ),
                id: WORKSHOP_ITEM_IDENTIFIER,
              },
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.private_pass`,
                ),
                id: PRIVATE_PASS_ITEM_IDENTIFIER,
              },
              {
                label: this.props.t(
                  `filters.${EXPENSES_FILTER_IDENTIFIER}.combo`,
                ),
                id: COMBO_ITEM_IDENTIFIER,
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
            variant="body2"
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
                  let { filter_identifier } = filter;
                  if (filter_identifier === FIRST_BOOKING_FILTER_IDENTIFIER) {
                    filter_identifier = BOOKINGS_NUMBER_FILTER_IDENTIFIER;
                  }
                  this.props.onClickCreate(
                    filter_identifier,
                    this.state.filter_data,
                  );
                }}
                color="secondary"
                disabled={this.state.not_nullable_data
                  .map((item) => this.state.filter_data[item] || null)
                  .includes(null)}
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
  warningIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  rowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  filterContainer: {
    padding: theme.spacing(2),
    justifyContent: 'space-between',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
    maxHeigth: '50px',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['smartList']),
)(FilterCard);
