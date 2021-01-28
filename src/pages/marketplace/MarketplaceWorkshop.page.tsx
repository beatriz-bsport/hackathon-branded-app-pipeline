import React from 'react';

import { compose, withProps } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { push, replace as replaceRouter } from 'connected-react-router';
import Moment from 'moment-timezone';
import { WithTranslation, withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withRouter } from 'react-router';
import { Theme } from '@material-ui/core';
import {
  snackbarSuccess as snackbarSuccessAction,
  snackbarError as snackbarErrorAction,
} from '../../actions/snackbar.actions';
import { consumerPayWithConsumerPaymentPack as payWithConsumerPaymentPackAPI } from '../../api/payment';
import { fetchAssociatedCoachBulkFromCoachIds as fetchAssociatedCoachBulkFromCoachIdsAction } from '../../libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import * as paymentActions from '../../actions/payment.actions';
import MarketplaceWorkshop from '../../libs/marketplace/components/MarketplaceWorkshop.component';

import {
  getListCalendarOfferFromNow,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '../../libs/offer/selectors';
import { DATE_FORMAT } from '../../utils/datetime';
import withTitle from '../../hocs/with-title.hoc';
import { fetchMarketplaceOfferList as fetchOfferListAction } from '../../libs/offer/actions';

import { getPaymentComboListAvailableOnline } from '../../libs/payment-combo/selectors';
import Analytics from '../../components/analytics/Analytics.component';
import withReplaceQueryParams from '../../hocs/with-replace-query-params.hoc';
import withQueryParams from '../../hocs/with-query-params.hoc';
import MarketplaceFilterComponent from '../../libs/marketplace/components/MarketplaceFilter.component';
import { getCoaches } from '../../libs/associated-coach/selectors';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import { getWorkshops } from '../../libs/meta-activity/selectors';
import { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';

type OwnProps = {
  companyId: number;
  filters: {
    coaches: number[];
    establishments: number[];
    activity__in: number[];
    levels: number[];
  };
  setFilters: (key: string) => (value: any) => void;
  onCompletePurchase?: (packId: number, offerId: number) => void;
  goToPaymentComboPayment?: (
    comboId: number,
    offerId: number,
    companyId: number,
  ) => void;
  goToPackPayment?: (
    packId: number,
    offerId: number,
    companyId: number,
  ) => void;
  goToBook?: (id: number, companyId: number) => void;
  store?: any; // for the widget only
  mapContainerClassName?: string;
};

type ConnectProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type FinalProps = OwnProps &
  ConnectProps &
  ReturnType<typeof mapWithProps> &
  MaterialStyleType<ReturnType<typeof styles>>;

export class MarketplaceWorkshopPage extends React.Component<FinalProps> {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: FinalProps) {
    if (prevProps.filters !== this.props.filters) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const min_date = Moment().startOf('month').format(DATE_FORMAT);
    const max_date = Moment()
      .startOf('month')
      .add('years', 1)
      .format(DATE_FORMAT);

    this.props.fetchMetaActivityBulk(this.props.filters.activity__in || []);

    this.props.fetchOfferList({
      company: this.props.companyId,
      min_date,
      max_date,
      is_workshop: true,
      ...this.props.filters,
    });
  };

  goToBook = (offer: any) => {
    Analytics.workshopClick(offer);
    this.props.goToBook(offer.id, this.props.companyId);
  };

  render() {
    const { classes, offers, loading } = this.props;

    if (loading) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <div className={classes.column}>
          <MarketplaceFilterComponent
            coaches={this.props.coaches}
            establishments={this.props.establishments}
            metaActivities={this.props.metaActivities}
            filters={this.props.filters}
            setFilters={this.props.setFilters}
            variant="workshop"
          />

          <MarketplaceWorkshop
            offers={offers}
            activityLoading={this.props.activityLoading}
            establishmentLoading={this.props.establishmentLoading}
            fetchPaymentPacks={this.props.fetchPaymentPacks}
            fetchCompatiblePass={this.props.fetchCompatiblePass}
            compatibleConsumerPacks={this.props.compatibleConsumerPacks}
            compatiblePaymentPacks={this.props.compatiblePaymentPacks}
            paymentComboList={this.props.paymentComboList}
            onBook={this.goToBook}
            onBookOfferFromPack={this.props.onBookOfferFromPack}
            goToPackPayment={(packId: number, offerId: number) =>
              this.props.goToPackPayment(packId, offerId, this.props.companyId)
            }
            goToPaymentComboPayment={(comboId: number, offerId: number) =>
              this.props.goToPaymentComboPayment(
                comboId,
                offerId,
                this.props.companyId,
              )
            }
            mapContainerClassName={this.props.mapContainerClassName}
          />
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 800,
  },
});

const mapStateToProps = (state: RootState) => ({
  offers: withMetaActivity(
    withCoach(withEstablishment(getListCalendarOfferFromNow)),
  )(state),
  loading: state.offer.marketplace.loading,
  compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
  compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
  paymentComboList: getPaymentComboListAvailableOnline(state),
  coachLoading: state.coach.loading,
  establishmentLoading: state.establishment.bulkRetrieve.loading,
  activityLoading: state.metaActivity.loading,
  coaches: getCoaches(state),
  establishments: getAllEstablishments(state),
  metaActivities: getWorkshops(state),
});

const mapDispatchToProps = {
  fetchOfferList: fetchOfferListAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchAssociatedCoachBulkFromCoachIds: fetchAssociatedCoachBulkFromCoachIdsAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
  fetchCompatiblePass: paymentActions.fetchCompatiblePass,
  snackbarSuccess: snackbarSuccessAction,
  snackbarError: snackbarErrorAction,
  pushRouter: push,
};

const mapWithProps = (props: OwnProps & ConnectProps & WithTranslation) => ({
  fetchOfferList: (params: any) =>
    props.fetchOfferList(params, {
      onSuccess: (offerList: any) => {
        props.fetchEstablishmentBulk(
          offerList.map((o: any) => o.establishment),
        );
        props.fetchAssociatedCoachBulkFromCoachIds(
          offerList.map((o: any) => o.coach),
          props.companyId,
        );
        props.fetchMetaActivityBulk(offerList.map((o: any) => o.meta_activity));
      },
    }),
  onBookOfferFromPack: (offerId: number, packId: number) => {
    payWithConsumerPaymentPackAPI(packId, offerId, {})
      .then(() => {
        if (props.onCompletePurchase) {
          props.onCompletePurchase(packId, offerId);
          return;
        }
        props.pushRouter('/');
        props.snackbarSuccess('booking.register.success');
      })
      .catch((err: any) => {
        console.error(err);
        if (err && err.response && err.response.status === 423) {
          switch (err.response.data) {
            case 'unavailable for female':
              props.snackbarError(
                props.t('booking:bookingModule.messages.femaleUnavailable'),
              );
              break;
            case 'unavailable for male':
              props.snackbarError(
                props.t('booking:bookingModule.messages.maleUnavailable'),
              );
              break;
            default:
              props.snackbarError(
                props.t('booking:bookingModule.messages.offerLocked'),
              );
              break;
          }
        }
      });
  },
  goToPackPayment: (packId: number, offerId: number, companyId: number) => {
    if (props.goToPackPayment) {
      props.goToPackPayment(packId, offerId, companyId);
      return;
    }
    props.pushRouter(
      `/customer/payment/pass/${packId}?nextOffer=${offerId}&membership=${companyId}`,
    );
  },
  goToPaymentComboPayment: (
    comboId: number,
    offerId: number,
    companyId: number,
  ) => {
    if (props.goToPaymentComboPayment) {
      props.goToPaymentComboPayment(comboId, offerId, companyId);
      return;
    }
    props.pushRouter(
      `/customer/payment/combo/${comboId}?nextOffer=${offerId}&membership=${companyId}`,
    );
  },
  goToBook: (id: number, companyId: number) => {
    if (props.goToBook) {
      props.goToBook(id, companyId);
    }
    props.pushRouter(`/customer/payment/offer/${id}?membership=${companyId}`);
  },
});

// Used in the widget
export const MarketplaceWorkshopBase = compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withProps(mapWithProps),
  withTranslation(['booking', 'titles']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceWorkshop'),
  ),
)(MarketplaceWorkshopPage);

// Used in marketplace
export default compose(
  withRouter,
  connect(null, { replace: replaceRouter }),
  withReplaceQueryParams(
    ['f_coaches', 'f_metaActivities', 'f_levels', 'f_establishments'],
    ['coaches', 'activity__in', 'levels', 'establishments'],
  ),
  withQueryParams([
    ['coaches', 'establishments', 'activity__in', 'levels'],
    'filters',
    'setFilters',
    'arrayNumber',
  ]),
  withQueryParams([
    ['filtersOpen', 'date', 'onlyDay'],
    'otherParams',
    'setOtherParams',
  ]),
)(MarketplaceWorkshopBase);
