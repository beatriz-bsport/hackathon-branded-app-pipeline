// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import withStyles from '@material-ui/core/styles/withStyles';

import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
  WENT_TO_ACTIVITY_FILTER_IDENTIFIER,
  TAG_FILTER_IDENTIFIER,
  CREDIT_FILTER_IDENTIFIER,
} from '@bsport/common/lib/master-data/smart-list';

import CreditFilter from './filters/CreditFilter.component';

import CreditAccountFilter from './filters/CreditAccountFilter.component';
import LastPreviousBookingFilter from './filters/LastPreviousBookingFilter.component';
import DateJoinedFilter from './filters/DateJoinedFilter.component';
import GenderFilter from './filters/GenderFilter.component';
import PaymentPackFilter from './filters/PaymentPackFilter.component';
import PaymentPackCreditFilter from './filters/PaymentPackCreditFilter.component';
import SeniorityFilter from './filters/SeniorityFilter.component';
import MetaActivityFilter from './filters/MetaActivityFilter.component';
import BookingAttendanceFilter from './filters/BookingAttendanceFilter.component';
import TagFilter from './filters/TagFilter.component';

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
      case PAYMENT_PACK_FILTER_IDENTIFIER:
        return (
          <PaymentPackFilter
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
          <PaymentPackFilter
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
      case CREDIT_FILTER_IDENTIFIER:
        return (
          <CreditFilter
            filter_data={this.state.filter_data}
            onChange={this.handleChange}
            new={this.props.new}
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
        <ListItem>
          <ListItemText primary={this.filterTypeSelector()} />
          <ListItemSecondaryAction>
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
                variant="outlined"
                disabled={Object.values(this.state.filter_data).includes(null)}
              >
                <SaveIcon className={this.props.classes.leftIcon} />
                {t('filters.add')}
              </Button>
            ) : null}
            {this.props.onClickDelete ? (
              <IconButton
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
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
      </div>
    );
  }
}

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['smartList']),
)(FilterCard);
