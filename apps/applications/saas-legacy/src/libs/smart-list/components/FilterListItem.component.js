import React, { Component } from 'react';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

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
  WAIVER_FILTER_IDENTIFIER,
  PAYMENT_METHOD_FILTER_IDENTIFIER,
  ACTIVE_PASSES_FILTER_IDENTIFIER,
  AGE_FILTER_IDENTIFIER,
  CUSTOM_FORMS_FILTER_IDENTIFIER,
  USER_MARKETING_NOTIFICATIONS_FILTER,
  NOTES_FILTER_IDENTIFIER,
  RELATIONS_FILTER_IDENTIFIER,
  USER_HAS_PHONE_FILTER_IDENTIFIER,
  TERMS_AND_CONDITIONS_FILTER_IDENTIFIER,
  FIRST_PURCHASE_FILTER_IDENTIFIER,
  REFERRER_FILTER_IDENTIFIER,
  REFERRED_MEMBERS_FILTER_IDENTIFIER,
} from '@bsport/common/master-data/smart-list.js';

import CreditAccountFilter from './filters/CreditAccountFilter.component';
import LastPreviousBookingFilter from './filters/LastPreviousBookingFilter.component';
import GenderFilter from './filters/GenderFilter.component';
import BookingsNumberFilter from './filters/BookingsNumberFilter.component';
import BookingsNumberFilterV2 from './filters/BookingsNumberFilterV2.component';
import TagFilter from './filters/TagFilter.component';
import MemberDateJoinedFilter from './filters/MemberDateJoinedFilter.component';
import PaymentPackFilter from './filters/PaymentPackFilter.component';
import BasketAbandonmentFilter from './filters/BasketAbandonmentFilter.component';
import BookingsFilter from './filters/BookingsFilter.component';
import FirstBookingFilter from './filters/FirstBookingFilter.component';
import UserHasPasswordFilter from './filters/UserHasPasswordFilter.component';
import ExpensesPerCategoryFilter from './filters/ExpensesPerCategoryFilter.component';
import PrivatePassFilter from './filters/PrivatePassFilter.component';
import PrivateBookingsFilter from './filters/PrivateBookingsFilter.component';
import ActivePassesFilter from './filters/ActivePassesFilter.component';
import WaiverFilter from './filters/WaiverFilter.component';
import PaymentMethodFilter from './filters/PaymentMethodFilter.component';
import AgeFilter from './filters/AgeFilter.component';
import CustomFormsFilter from './filters/CustomFormsFilter.component';
import CustomFormsFilterV2 from './filters/CustomFormsFilterV2.component';
import UserMarketingNotificationsFilter from './filters/UserMarketingNotificationsFilter.component';
import UserMarketingNotificationsFilterV2 from './filters/UserMarketingNotificationsFilterV2.component';
import NotesFilter from './filters/NotesFilter.component';
import RelationsFilter from './filters/RelationsFilter.component';
import UserHasPhoneFilter from './filters/UserHasPhoneFilter.component';
import TermsAndConditionsFilter from './filters/TermsAndConditionsFilter.component';
import FirstPaymentFilter from './filters/FirstPaymentFilter.component';
import ReferrerFilter from './filters/ReferrerFilter.component';
import ReferredMembersFilter from './filters/ReferredMembersFilter.component';

import type { PaymentPack } from '../../payment-packs/types';
import type { Establishment } from '../../establishment/types';
import type { Coach } from '../../associated-coach/types';
import type { PrivatePass, PrivateService } from '../../private-service/types';

type Props = {
  payment_packs: Array<PaymentPack>,
  private_passes: Array<PrivatePass>,
  meta_activities: Array<any>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  private_services: Array<PrivateService>,
  classes: Object,
  tags: Array<any>,
  onClickEdit: (
    smartListId: number,
    filterNameId: number,
    data: any,
    filterId: number,
    callback: (id: number) => void,
  ) => void,
  onClickDelete: (id: number) => void,
  onClickCreate: (filter_identifier: number, data: any) => void,
  filter: any,
  fetchItems: any,

  fetchBulkItems: any,
  customLevels: Level[],
  customForms: CustomForm[],

  isNew: boolean,
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
      not_all_falsy_data: [], // each item is a list of filter's fields that can't be all falsy at once
    };
  }

  componentDidUpdate(prevProps: Props) {
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
      !this.props.isNew &&
      this.state.not_nullable_data
        .map((item) => dataDict[item])
        .every((item) => item !== null) &&
      this.state.not_all_falsy_data.every((itemList) =>
        itemList.map((item) => dataDict[item]).some((item) => !!item),
      )
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

  setNotAllFalsyData = (data: Array<Array<string>>) => {
    this.setState({ not_all_falsy_data: data });
  };

  renderSelectorWarning = (text, active, items) => {
    if (active && (!items || items.length === 0)) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon
            className={this.props.classes.warningIcon}
            color="error"
            size={15}
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
            className={this.props.classes.warningIcon}
            color="error"
            size={15}
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
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case MEMBER_DATE_JOINED_FILTER_IDENTIFIER:
        return (
          <MemberDateJoinedFilter
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case GENDER_FILTER_IDENTIFIER:
        return (
          <GenderFilter
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case BASKET_ABANDONMENT_FILTER_IDENTIFIER:
        return (
          <BasketAbandonmentFilter
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case FILTER_BOOKING_LAST:
        return (
          <LastPreviousBookingFilter
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
          />
        );

      case PAYMENT_PACK_FILTER_IDENTIFIER:
        return (
          <PaymentPackFilter
            fetchBulkItems={this.props.fetchBulkItems}
            fetchItems={this.props.fetchItems}
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            renderSelectorWarning={this.renderSelectorWarning}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case PRIVATE_PASS_FILTER_IDENTIFIER:
        return (
          <PrivatePassFilter
            fetchBulkItems={this.props.fetchBulkItems}
            fetchItems={this.props.fetchItems}
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            private_passes={this.props.private_passes}
            renderSelectorWarning={this.renderSelectorWarning}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case TAG_FILTER_IDENTIFIER:
        return (
          <TagFilter
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
            tags={this.props.tags}
          />
        );
      case BOOKINGS_NUMBER_FILTER_IDENTIFIER: {
        if (this.props.isNew || this.state.filter_data.is_v2) {
          return (
            <BookingsNumberFilterV2
              coaches={this.props.coaches}
              customLevels={this.props.customLevels}
              establishments={this.props.establishments}
              fetchBulkItems={this.props.fetchBulkItems}
              fetchItems={this.props.fetchItems}
              filter_data={this.state.filter_data}
              isNew={this.props.isNew}
              meta_activities={this.props.meta_activities}
              onChange={this.handleChange}
              payment_packs={this.props.payment_packs}
              renderAttendanceSelectorWarning={
                this.renderAttendanceSelectorWarning
              }
              renderSelectorWarning={this.renderSelectorWarning}
              setNotNullableData={this.setNotNullableData}
            />
          );
        }
        return (
          <BookingsNumberFilter
            coaches={this.props.coaches}
            customLevels={this.props.customLevels}
            establishments={this.props.establishments}
            fetchBulkItems={this.props.fetchBulkItems}
            fetchItems={this.props.fetchItems}
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            meta_activities={this.props.meta_activities}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            renderAttendanceSelectorWarning={
              this.renderAttendanceSelectorWarning
            }
            renderSelectorWarning={this.renderSelectorWarning}
            setNotNullableData={this.setNotNullableData}
          />
        );
      }
      case FIRST_BOOKING_FILTER_IDENTIFIER:
        return (
          <FirstBookingFilter
            coaches={this.props.coaches}
            customLevels={this.props.customLevels}
            establishments={this.props.establishments}
            fetchBulkItems={this.props.fetchBulkItems}
            fetchItems={this.props.fetchItems}
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: BOOKINGS_NUMBER_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            meta_activities={this.props.meta_activities}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            renderAttendanceSelectorWarning={
              this.renderAttendanceSelectorWarning
            }
            renderSelectorWarning={this.renderSelectorWarning}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case BOOKINGS_FILTER_IDENTIFIER:
        return (
          <BookingsFilter
            coaches={this.props.coaches}
            customLevels={this.props.customLevels}
            establishments={this.props.establishments}
            fetchBulkItems={this.props.fetchBulkItems}
            fetchItems={this.props.fetchItems}
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            meta_activities={this.props.meta_activities}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            renderAttendanceSelectorWarning={
              this.renderAttendanceSelectorWarning
            }
            renderSelectorWarning={this.renderSelectorWarning}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case PRIVATE_BOOKINGS_FILTER_IDENTIFIER:
        return (
          <PrivateBookingsFilter
            coaches={this.props.coaches}
            establishments={this.props.establishments}
            fetchBulkItems={this.props.fetchBulkItems}
            fetchItems={this.props.fetchItems}
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            private_passes={this.props.private_passes}
            private_services={this.props.private_services}
            renderSelectorWarning={this.renderSelectorWarning}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case ACTIVE_PASSES_FILTER_IDENTIFIER:
        return (
          <ActivePassesFilter
            fetchBulkItems={this.props.fetchBulkItems}
            fetchItems={this.props.fetchItems}
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            payment_packs={this.props.payment_packs}
            private_passes={this.props.private_passes}
            renderSelectorWarning={this.renderSelectorWarning}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case USER_HAS_PASSWORD_FILTER:
        return (
          <UserHasPasswordFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: USER_HAS_PASSWORD_FILTER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case WAIVER_FILTER_IDENTIFIER:
        return (
          <WaiverFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: WAIVER_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
          />
        );
      case PAYMENT_METHOD_FILTER_IDENTIFIER:
        return (
          <PaymentMethodFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: PAYMENT_METHOD_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
          />
        );
      case EXPENSES_COMPLETE_FILTER_IDENTIFIER:
        return (
          <ExpensesPerCategoryFilter
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
            filter_data={this.state.filter_data}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case AGE_FILTER_IDENTIFIER:
        return (
          <AgeFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: AGE_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case CUSTOM_FORMS_FILTER_IDENTIFIER: {
        if (this.props.isNew || this.state.filter_data.is_v2) {
          return (
            <CustomFormsFilterV2
              custom_forms={this.props.customForms}
              fetchBulkItems={this.props.fetchBulkItems}
              fetchItems={this.props.fetchItems}
              filter_data={{
                ...this.state.filter_data,
                filter_identifier: CUSTOM_FORMS_FILTER_IDENTIFIER,
              }}
              isNew={this.props.isNew}
              onChange={this.handleChange}
              renderSelectorWarning={this.renderSelectorWarning}
              setNotNullableData={this.setNotNullableData}
            />
          );
        }
        return (
          <CustomFormsFilter
            custom_forms={this.props.customForms}
            fetchBulkItems={this.props.fetchBulkItems}
            fetchItems={this.props.fetchItems}
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: CUSTOM_FORMS_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            renderSelectorWarning={this.renderSelectorWarning}
            setNotNullableData={this.setNotNullableData}
          />
        );
      }
      case USER_MARKETING_NOTIFICATIONS_FILTER: {
        if (this.props.isNew || this.state.filter_data.is_v2) {
          return (
            <UserMarketingNotificationsFilterV2
              filter_data={{
                ...this.state.filter_data,
                filter_identifier: USER_MARKETING_NOTIFICATIONS_FILTER,
              }}
              isNew={this.props.isNew}
              onChange={this.handleChange}
              renderSelectorWarning={this.renderSelectorWarning}
              setNotAllFalsyData={this.setNotAllFalsyData}
              setNotNullableData={this.setNotNullableData}
            />
          );
        }
        return (
          <UserMarketingNotificationsFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: USER_MARKETING_NOTIFICATIONS_FILTER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            renderSelectorWarning={this.renderSelectorWarning}
            setNotAllFalsyData={this.setNotAllFalsyData}
            setNotNullableData={this.setNotNullableData}
          />
        );
      }
      case NOTES_FILTER_IDENTIFIER:
        return (
          <NotesFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: NOTES_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
            setNotNullableData={this.setNotNullableData}
          />
        );
      case RELATIONS_FILTER_IDENTIFIER:
        return (
          <RelationsFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: RELATIONS_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
          />
        );
      case USER_HAS_PHONE_FILTER_IDENTIFIER:
        return (
          <UserHasPhoneFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: USER_HAS_PHONE_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
          />
        );
      case TERMS_AND_CONDITIONS_FILTER_IDENTIFIER:
        return (
          <TermsAndConditionsFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: TERMS_AND_CONDITIONS_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
          />
        );

      case FIRST_PURCHASE_FILTER_IDENTIFIER:
        return (
          <FirstPaymentFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: FIRST_PURCHASE_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
          />
        );

      case REFERRER_FILTER_IDENTIFIER:
        return (
          <ReferrerFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: REFERRER_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
          />
        );

      case REFERRED_MEMBERS_FILTER_IDENTIFIER:
        return (
          <ReferredMembersFilter
            filter_data={{
              ...this.state.filter_data,
              filter_identifier: REFERRED_MEMBERS_FILTER_IDENTIFIER,
            }}
            isNew={this.props.isNew}
            onChange={this.handleChange}
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
            className={this.props.classes.filterContainer}
            variant="body2"
          >
            {this.filterTypeSelector()}
          </Typography>
          <div className={this.props.classes.buttonContainer}>
            {this.props.onClickCreate ? (
              <Button
                color="secondary"
                disabled={
                  this.state.not_nullable_data
                    .map((item) => this.state.filter_data[item] ?? null)
                    .includes(null) ||
                  this.state.not_all_falsy_data.some((itemList) =>
                    itemList
                      .map((item) => this.state.filter_data[item])
                      .every((item) => !item),
                  )
                }
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
              >
                <SaveIcon className={this.props.classes.leftIcon} />
                {t('filters.add')}
              </Button>
            ) : null}
            {this.props.onClickDelete ? (
              <IconButton
                className={this.props.classes.leftIcon}
                color="secondary"
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  this.props.onClickDelete(filter.filter_identifier, filter.id);
                }}
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
