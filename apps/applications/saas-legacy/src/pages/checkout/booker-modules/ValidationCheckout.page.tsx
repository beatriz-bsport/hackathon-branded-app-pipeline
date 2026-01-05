import React from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { connect, ConnectedProps } from 'react-redux';

import { replace as replaceRouter, goBack } from 'connected-react-router';
import flatten from 'lodash/flatten';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose, withHandlers, withProps } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import BUYABLE_ITEM_CAN_NOT_BE_BOUGHT_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import { Clear, HourglassFull, ShoppingBasket, Star } from '@material-ui/icons';
import { WAITING_LIST_DYNAMIC_ORDERED } from '@bsport/common/lib/master-data/waiting-list-dynamic.js';
import { buildMemberReferralLink } from '@bsport/common/lib/referrals/utils.js';
import themeSelectors from '#src/libs/theme/selectors';
import { fetchBasket } from '#src/libs/checkout/actions';
import { getBasket } from '#src/libs/checkout/selectors';
// @ts-expect-error
import CheckoutItemListItem from '#src/libs/checkout/components/CheckoutItemListItem.component';
import { Offer_FULL } from '#src/libs/offer/types';
import { withExtraDataFromQueryParams } from '#src/libs/booker-module/utils';
import withTheme from '#src/hocs/company-themifier.hoc';
import {
  getOfferFromList,
  withMetaActivity,
  withCoach,
  withEstablishment,
  getOfferStatusWaitingListPositionById,
} from '#src/libs/offer/selectors';
import {
  fetchOfferBulk,
  fetchOfferWaitingListPositionList as fetchOfferWaitingListPositionListAction,
} from '#src/libs/offer/actions';
import { fetchMetaActivityBulk } from '#src/libs/meta-activity/actions';
import { fetchCoachBulk } from '#src/libs/associated-coach/actions';
import { fetchEstablishmentBulk } from '#src/libs/establishment/actions';
import { getWaitingListConfigurationData } from '#src/libs/waiting-list/selectors';

import OfferBookableItem from '#src/libs/booker-module/components/OfferBookableItem.component';
import { urlToMarketplace } from '#src/libs/marketplace/utils';

import WidgetUtils from '#src/libs/widget/WidgetUtils';
import ValidationIcon from '#src/components/icons/ValidationIcon.component';
import ErrorIcon from '#src/components/icons/ErrorIcon.component';
import { getBookingErrorMessage } from '#src/libs/checkout/utils';
import { fetchCompanyConfiguration as fetchCompanyWaitlistConfigurationAction } from '#src/libs/waiting-list/actions';
import {
  retrieveReferralProgramForCompany as retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAction,
} from '#src/libs/referral/actions';
import {
  getTheReferralProgram,
  getReferralMemberStatusThroughMembership,
} from '#src/libs/referral/selectors';
import ReferralLinkIncentive from '#src/libs/referral/components/ReferralLinkIncentive.component';
import Config from '../../../config';
import { sortByDate } from '../../../utils/datetime';
import { MaterialStyleType, WithHandlerType } from '../../../utils/types';
import ConsumerAppBarContainer from '../ConsumerAppBar.container';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
// @ts-expect-error
import withQueryParams from '../../../hocs/with-query-params.hoc';
import { RootState } from '../../../reducers';
import {
  getMemberDetailData,
  getMemberThroughMembership,
} from '../../../libs/member/selectors';
import { fetchMember as fetchMemberAction } from '../../../libs/member/actions';
import { fetchMembershipByCompany } from '../../../libs/membership/actions';
import { getMembership } from '../../../libs/membership/selectors';
import { getUserSpaceUrl } from '#src/libs/marketplace/routing-utils';

type OwnProps = {
  queryParams: any;
  offerBookedIdList: number[];
  offerPreBookedIdList: number[];
  offerNotBookableIdWithErrorCodeList: Array<number[]>;
  offerBookedList: Offer_FULL[];
  offerPreBookedList: Offer_FULL[];
  offerNotBookableList: Array<Offer_FULL>;
  isBasketLoading: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithHandlerType<typeof mapWithHandlers> &
  ConnectedProps<typeof connector>;

export class ValidationCheckout extends React.Component<Props> {
  componentDidMount() {
    // @ts-expect-error
    this.props.fetchMembershipByCompany(this.props.companyId);

    if (WidgetUtils.isWidget()) {
      WidgetUtils.paymentSuccess();
    }

    if (
      this.props.queryParams?.basket &&
      this.props.queryParams.basket !== 'null'
    ) {
      // @ts-expect-error
      this.props.fetchBasket(this.props.queryParams.basket, {
        onSuccess: this.fetchOfferData,
      });
    }
    this.fetchOfferData();

    // @ts-expect-error
    if (this.props.membership) {
      this.fetchMemberData();
    }
  }

  componentDidUpdate(prevProps: Props) {
    // @ts-expect-error
    if (!prevProps.membership && this.props.membership) {
      this.fetchMemberData();
    }
  }

  fetchMemberData = () => {
    // @ts-expect-error
    this.props.fetchMember(this.props.membership.id);

    // @ts-expect-error
    if (this.props.theme.is_referral_program_activated) {
      // @ts-expect-error
      this.props.retrieveReferralProgramForCompany(
        // @ts-expect-error
        this.props.membership.company,
      );
      // @ts-expect-error
      this.props.retrieveReferralMemberStatus(this.props.membership.id);
    }
  };

  trackBookings = () => {
    // Add nooking success analytics
    // this.props.offerBookedList.forEach((offerBooked) =>
    //   Analytics.bookingSuccess(offerBooked),
    // );
  };

  fetchOfferData = () => {
    this.props.fetchOfferBulk(
      [
        ...this.props.offerBookedIdList,
        ...this.props.offerPreBookedIdList,
        ...this.props.offerNotBookableIdWithErrorCodeList.map((ie) => ie[0]),
      ],
      {
        onSuccess: (offerList) => {
          Promise.all([
            this.props.fetchEstablishmentBulk(
              offerList.map((o) => o.establishment),
            ),
            this.props.fetchCoachBulk([
              ...offerList.map((o) => o.coach),
              ...offerList.map((o) => o.coach_override),
            ]),
            this.props.fetchMetaActivityBulk(
              offerList.map((o) => o.meta_activity),
            ),
          ]).then(() => {
            // setTimeout to make sure properties were injected by the
            // withCoach / withMetaActivity / withEstablishment selectors
            setTimeout(this.trackBookings, 500);
          });

          // @ts-expect-error
          this.props.fetchCompanyWaitlistConfiguration(this.props.companyId);
          this.props.fetchOfferWaitingListPositionList(
            this.props.offerPreBookedIdList,
          );
        },
        onCacheUsed: () => {
          // setTimeout to make sure properties were injected by the
          // withCoach / withMetaActivity / withEstablishment selectors
          setTimeout(this.trackBookings, 500);
        },
      },
      true,
    );
  };

  isError = () => {
    return (
      !this.props.offerBookedIdList.length &&
      !this.props.offerPreBookedIdList.length &&
      this.props.offerNotBookableIdWithErrorCodeList.length &&
      (!this.props.queryParams?.basket ||
        this.props.queryParams?.basket === 'null')
    );
  };

  renderHeader = () => {
    const { classes } = this.props;
    if (this.isError()) {
      return (
        <div className={classes.header}>
          <ErrorIcon />
          <Typography className={classes.confirmation} variant="h4">
            {this.props.t('validation.sections.error')}
          </Typography>
          <Typography className={classes.confirmation}>
            {getBookingErrorMessage(
              this.props.t,
              // @ts-expect-error
              this.props.offerNotBookableIdWithErrorCodeList[0],
            )}
          </Typography>
        </div>
      );
    }
    return (
      <div className={classes.header}>
        <ValidationIcon />

        <Typography className={classes.confirmation} variant="h4">
          {this.props.t('validation.sections.title')}
        </Typography>
        <Typography className={classes.confirmation}>
          {this.props.t('validation.sections.explain')}
        </Typography>
      </div>
    );
  };

  renderActionButton = () => {
    if (this.isError()) {
      return (
        <div className={this.props.classes.actions}>
          <Button
            color="primary"
            onClick={this.props.goBack}
            variant="outlined"
          >
            {this.props.t('validation.actions.back')}
          </Button>
        </div>
      );
    }
    return (
      <div className={this.props.classes.actions}>
        {!WidgetUtils.isWidget() && (
          <Button
            className={this.props.classes.validationButton}
            color="primary"
            onClick={this.props.goToMarketplace}
          >
            {this.props.t('validation.actions.continue')}
          </Button>
        )}
        <Button
          className={this.props.classes.validationButton}
          color="primary"
          onClick={this.props.onContinue}
          variant="contained"
        >
          {WidgetUtils.isWidget()
            ? this.props.t('validation.actions.widgetContinue')
            : this.props.t('validation.actions.member')}
        </Button>
      </div>
    );
  };

  render() {
    const { classes } = this.props;

    // @ts-expect-error
    const referralLink = this.props.theme.is_referral_program_activated
      ? `${Config.PUBLIC_URL}${buildMemberReferralLink(
          // @ts-expect-error
          this.props.companyId,
          // @ts-expect-error
          this.props?.member?.referral_uuid,
        )}`
      : '';

    const hasToDisplayReferralink =
      // @ts-expect-error
      this.props.theme.is_referral_program_activated &&
      // @ts-expect-error
      this.props.referralProgram &&
      // @ts-expect-error
      this.props.referralMemberStatus?.nb_remaining_referral_uses;

    return (
      <ConsumerAppBarContainer>
        <div className={classes.container}>
          <Paper className={classes.paperContainer}>
            <div className={classes.paperSection}>
              {this.renderHeader()}
              {this.renderActionButton()}
            </div>
            {this.props.isBasketLoading && (
              <div className={classes.loadingContainer}>
                <CircularProgress />
              </div>
            )}
            {!this.props.isBasketLoading && !this.isError() && (
              <>
                <Typography className={classes.paperSection} variant="h5">
                  {this.props.t('validation.sections.recap')}
                </Typography>
                <div className={classes.divider} />
                <div className={classes.paperSection}>
                  <div className={classes.recapContainer}>
                    {!!this.props.offerBookedList.length && (
                      <div className={classes.section}>
                        <div className={classes.iconAndText}>
                          <Star />
                          <Typography variant="h5">
                            {this.props.t('validation.sections.offerBooked')}
                          </Typography>
                        </div>

                        <div className={classes.paper}>
                          {sortByDate(
                            this.props.offerBookedList,
                            'date_start',
                          ).map((o) => (
                            <OfferBookableItem
                              key={o.id}
                              // @ts-expect-error
                              coachDisplay={this.props.theme.coach_display}
                              hideCoach={this.props.hideCoach}
                              // @ts-expect-error
                              offer={o}
                              offerSpot={o.spot_id}
                              offerSpotInformation={o.spot_information}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {/* @ts-expect-error */}
                    {this.props.basket && (
                      <div className={classes.section}>
                        <div className={classes.iconAndText}>
                          <ShoppingBasket />
                          <Typography variant="h5">
                            {this.props.t('validation.sections.basket')}
                          </Typography>
                        </div>
                        <div className={classes.paper}>
                          {/* @ts-expect-error */}
                          {this.props.basket.checkout_items.map((ci) => (
                            <CheckoutItemListItem
                              key={ci.id}
                              hideExtraData
                              checkout_item={ci}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {!!this.props.offerPreBookedList.length && (
                      <div className={classes.section}>
                        <div className={classes.iconAndText}>
                          <HourglassFull />
                          <Typography variant="h5">
                            {this.props.t('validation.sections.offerPreBooked')}
                          </Typography>
                        </div>
                        <div className={classes.paper}>
                          {sortByDate(
                            this.props.offerPreBookedList,
                            'date_start',
                          ).map((o) => (
                            <OfferBookableItem
                              key={o.id}
                              // @ts-expect-error
                              coachDisplay={this.props.theme.coach_display}
                              displayPositionInWaitingList={
                                // @ts-expect-error
                                this.props.waitingListConfiguration
                                  ?.display_member_position &&
                                // @ts-expect-error
                                this.props.waitingListConfiguration?.dynamic ===
                                  WAITING_LIST_DYNAMIC_ORDERED
                              }
                              hideCoach={this.props.hideCoach}
                              // @ts-expect-error
                              offer={o}
                              offerSpotInformation={o.spot_information}
                              waitingListPosition={
                                // @ts-expect-error
                                this.props.offerStatusWaitinListPositionById[
                                  o.id
                                ]?.waiting_list_position
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {!!this.props.offerNotBookableList.length && (
                      <div className={classes.section}>
                        <div className={classes.iconAndText}>
                          <Clear />
                          <Typography variant="h5">
                            {this.props.t(
                              'validation.sections.offerNotBookable',
                            )}
                          </Typography>
                        </div>
                        <div className={classes.paper}>
                          {sortByDate(
                            this.props.offerNotBookableList,
                            'date_start',
                          ).map((o, idx) => {
                            const error_code =
                              this.props.offerNotBookableIdWithErrorCodeList[
                                idx
                              ][1];
                            return (
                              <div key={o.id} className={classes.paper}>
                                <OfferBookableItem
                                  // @ts-expect-error
                                  coachDisplay={this.props.theme.coach_display}
                                  hideCoach={this.props.hideCoach}
                                  // @ts-expect-error
                                  offer={o}
                                  offerSpotInformation={o.spot_information}
                                />
                                <div className={classes.row}>
                                  <WarningIcon
                                    className={classes.smallIcon}
                                    color="error"
                                  />
                                  <Typography color="error" variant="caption">
                                    {BUYABLE_ITEM_CAN_NOT_BE_BOUGHT_ERROR_CODES.includes(
                                      error_code,
                                    )
                                      ? this.props.t(
                                          `snackbar:canNotBuyErrorCode.${error_code}`,
                                        )
                                      : this.props.t(
                                          'snackbar:canNotBuyErrorCode.generic',
                                        )}
                                  </Typography>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  {hasToDisplayReferralink && (
                    <div className={classes.referralLinkContainer}>
                      <ReferralLinkIncentive
                        referralLink={referralLink}
                        // @ts-expect-error
                        referralProgram={this.props.referralProgram}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </Paper>
        </div>
      </ConsumerAppBarContainer>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    paperSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      padding: theme.spacing(3),
      gap: theme.spacing(6),
    },
    recapContainer: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
    paperContainer: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '35%',
    },
    iconAndText: {
      display: 'flex',
      gap: theme.spacing(1),
      alignItems: 'center',
      marginBottom: theme.spacing(2),
    },
    validation: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      gap: theme.spacing(5),
      padding: theme.spacing(3),
    },

    section: {
      padding: theme.spacing(1),
      display: 'flex',
      gap: theme.spacing(1),
      flexDirection: 'column',
      width: '50%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    smallIcon: {
      height: 24,
      width: 24,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginLeft: theme.spacing(1),
      '&>*': {
        paddingRight: theme.spacing(1),
      },
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(2),
      flex: '1',
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      minWidth: '50%',
      '&>*': {
        width: '100%',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        padding: '8px 16px',
        minHeight: theme.spacing(11),
      },
      '& #itemContent': {
        alignItems: 'center',
      },
    },
    iconHeader: {
      height: 160,
      width: 160,
    },
    confirmation: {
      textAlign: 'center',
    },
    actions: {
      display: 'flex',
      gap: theme.spacing(2),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    divider: {
      height: '2px',
      margin: '-8px 0px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    },
    validationButton: {
      [theme.breakpoints.down('xs')]: {
        flex: 1,
        height: '100%',
      },
    },
    referralLinkContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingContainer: {
      textAlign: 'center',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  });

const mapWithHandlers = {
  onContinue:
    // @ts-expect-error


      ({ replace, companyId, queryParams }) =>
      () => {
        if (WidgetUtils.isWidget()) {
          WidgetUtils.closeModal();
          if (queryParams && queryParams.onValidation === 'close') {
            window.close();
          }
          return;
        }
        replace(getUserSpaceUrl(companyId));
      },
  goToMarketplace:
    // @ts-expect-error


      ({ replace, companyId, queryParams, theme }) =>
      () => {
        if (WidgetUtils.isWidget()) {
          WidgetUtils.closeModal();
          if (queryParams && queryParams.onValidation === 'close') {
            window.close();
          }
          return;
        }
        replace(urlToMarketplace(theme.company_name, companyId));
      },
};

const connector = connect(
  (
    state,
    {
      // @ts-expect-error
      offerBookedIdList,
      // @ts-expect-error
      offerPreBookedIdList,
      // @ts-expect-error
      offerNotBookableIdWithErrorCodeList,
      // @ts-expect-error
      offerExtraDataList,
    },
  ) => ({
    // @ts-expect-error
    hideCoach: themeSelectors.getTheme(state).hideCoach,
    offerBookedList: withExtraDataFromQueryParams(
      withCoach(withMetaActivity(withEstablishment(getOfferFromList)))(
        // @ts-expect-error
        state,
        offerBookedIdList,
      ),
      offerExtraDataList,
    ),
    offerPreBookedList: withExtraDataFromQueryParams(
      withCoach(withMetaActivity(withEstablishment(getOfferFromList)))(
        // @ts-expect-error
        state,
        offerPreBookedIdList,
      ),
      offerExtraDataList,
    ),
    offerNotBookableList: withExtraDataFromQueryParams(
      withCoach(withMetaActivity(withEstablishment(getOfferFromList)))(
        // @ts-expect-error
        state,
        // @ts-expect-error
        offerNotBookableIdWithErrorCodeList.map((ie) => ie[0]),
      ),
      offerExtraDataList,
    ),
  }),
  {
    fetchEstablishmentBulk,
    fetchCoachBulk,
    fetchMetaActivityBulk,
    fetchOfferBulk,
    replace: replaceRouter,
    goBack,
    fetchOfferWaitingListPositionList: fetchOfferWaitingListPositionListAction,
  },
);

export default compose<any, OwnProps>(
  routerParamsToProps({ companyId: 'companyId:number' }),
  withQueryParams([
    ['user_registration_response', 'basket', 'dialogMode', 'onValidation'],
    'queryParams',
    'setQueryParams',
  ]),
  withTranslation(['checkout', 'snackbar']),

  connect(
    // @ts-expect-error
    (state: RootState, { companyId, queryParams }) => ({
      theme: themeSelectors.getTheme(state),
      basket:
        queryParams?.basket && queryParams.basket !== 'null'
          ? getBasket(state, queryParams.basket)
          : null,
      member: getMemberThroughMembership(getMemberDetailData)(state, companyId),
      membership: getMembership(state, companyId),
      referralProgram: getTheReferralProgram(state),
      referralMemberStatus: getReferralMemberStatusThroughMembership(
        state,
        companyId,
      ),
      waitingListConfiguration: getWaitingListConfigurationData(state),
      offerStatusWaitinListPositionById:
        getOfferStatusWaitingListPositionById(state),
      isBasketLoading: state.checkout.basket.loading,
    }),
    {
      fetchMembershipByCompany,
      fetchBasket,
      fetchMember: fetchMemberAction,
      fetchCompanyWaitlistConfiguration:
        fetchCompanyWaitlistConfigurationAction,
      retrieveReferralProgramForCompany:
        retrieveReferralProgramForCompanyAction,
      retrieveReferralMemberStatus: retrieveReferralMemberStatusAction,
    },
  ),
  withProps(({ queryParams }) => {
    return {
      user_registration_response:
        queryParams?.user_registration_response &&
        JSON.parse(decodeURIComponent(queryParams.user_registration_response)),
    };
  }),
  withProps(({ user_registration_response, basket }) => ({
    offerBookedIdList: [
      ...((user_registration_response || {}).offers_booked ?? []),
      ...flatten(
        // @ts-expect-error
        ((basket || {}).checkout_items ?? []).map((ci) =>
          // @ts-expect-error
          ci?.extra_data?.offers_data?.map((d) => d.offer_id),
        ),
      ),
    ],
    offerPreBookedIdList:
      (user_registration_response || {}).offer_on_waiting_list || [],
    offerNotBookableIdWithErrorCodeList:
      (user_registration_response || {}).error_codes || [],
    offerExtraDataList: (user_registration_response || {}).extra_data || [],
  })),
  connector,
  withHandlers(mapWithHandlers),
  withTheme,
  withStyles(styles),
)(ValidationCheckout);
