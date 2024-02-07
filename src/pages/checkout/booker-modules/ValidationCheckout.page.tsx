// @ts-nocheck
import React from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { connect, ConnectedProps } from 'react-redux';

import { replace as replaceRouter, goBack } from 'connected-react-router';
import flatten from 'lodash/flatten';
import { compose, withHandlers, withProps } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import BUYABLE_ITEM_CAN_NOT_BE_BOUGHT_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import { Clear, HourglassFull, ShoppingBasket, Star } from '@material-ui/icons';
import { WAITING_LIST_DYNAMIC_ORDERED } from '@bsport/common/lib/master-data/waiting-list-dynamic';
import { RootState } from '../../../reducers';
import withQueryParams from '../../../hocs/with-query-params.hoc';
import themeSelectors from '#libs/theme/selectors';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { fetchBasket } from '#libs/checkout/actions';
import { getBasket } from '#libs/checkout/selectors';
import CheckoutItemListItem from '#libs/checkout/components/CheckoutItemListItem.component';
import { Offer_FULL } from '#libs/offer/types';
import { withExtraDataFromQueryParams } from '#libs/booker-module/utils';
import withTheme from '#hocs/company-themifier.hoc';
import {
  getOfferFromList,
  withMetaActivity,
  withCoach,
  withEstablishment,
  getOfferStatusWaitingListPositionById,
} from '#libs/offer/selectors';
import {
  fetchOfferBulk,
  fetchOfferWaitingListPositionList as fetchOfferWaitingListPositionListAction,
} from '#libs/offer/actions';
import Analytics from '#components/analytics/Analytics.component';
import { fetchMetaActivityBulk } from '#libs/meta-activity/actions';
import { fetchCoachBulk } from '#libs/associated-coach/actions';
import { fetchEstablishmentBulk } from '#libs/establishment/actions';
import { getWaitingListConfigurationData } from '#libs/waiting-list/selectors';

import OfferBookableItem from '#libs/booker-module/components/OfferBookableItem.component';
import { urlToMarketplace } from '#libs/marketplace/utils';

import ConsumerAppBarContainer from '../ConsumerAppBar.container';
import WidgetUtils from '#libs/widget/WidgetUtils';
import { MaterialStyleType, WithHandlerType } from '../../../utils/types';
import ValidationIcon from '#components/icons/ValidationIcon.component';
import ErrorIcon from '#components/icons/ErrorIcon.component';
import { sortByDate } from '../../../utils/datetime';
import { getBookingErrorMessage } from '#libs/checkout/utils';
import { fetchCompanyConfiguration as fetchCompanyWaitlistConfigurationAction } from '#libs/waiting-list/actions';
import {
  retrieveReferralProgramForCompany as retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAction,
} from '#libs/referral/actions';
import {
  getTheReferralProgram,
  getReferralMemberStatusThroughMembership,
} from '#libs/referral/selectors';
import Config from '../../../config';
import { buildMemberReferralLink } from '#libs/referral/utils';
import ReferralLinkIncentive from '#libs/referral/components/ReferralLinkIncentive.component';
import {
  getMemberDetailData,
  getMemberThroughMembership,
} from '../../../libs/member/selectors';
import { fetchMember as fetchMemberAction } from '../../../libs/member/actions';
import { fetchMembershipByCompany } from '../../../libs/membership/actions';
import { getMembership } from '../../../libs/membership/selectors';

type OwnProps = {
  queryParams: any;
  offerBookedIdList: number[];
  offerPreBookedIdList: number[];
  offerNotBookableIdWithErrorCodeList: Array<number[]>;
  offerBookedList: Offer_FULL[];
  offerPreBookedList: Offer_FULL[];
  offerNotBookableList: Array<Offer_FULL>;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithHandlerType<typeof mapWithHandlers> &
  ConnectedProps<typeof connector>;

export class ValidationCheckout extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchMembershipByCompany(this.props.companyId);

    if (
      this.props.queryParams?.basket &&
      this.props.queryParams.basket !== 'null'
    ) {
      this.props.fetchBasket(this.props.queryParams.basket, {
        onSuccess: this.fetchOfferData,
      });
    }
    this.fetchOfferData();

    if (this.props.membership) {
      this.fetchMemberData();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.membership && this.props.membership) {
      this.fetchMemberData();
    }
  }

  fetchMemberData = () => {
    this.props.fetchMember(this.props.membership.id);

    if (this.props.theme.is_referral_program_activated) {
      this.props.retrieveReferralProgramForCompany(
        this.props.membership.company,
      );
      this.props.retrieveReferralMemberStatus(this.props.membership.id);
    }
  };

  trackBookings = () => {
    this.props.offerBookedList.forEach((offerBooked) =>
      Analytics.bookingSuccess(offerBooked),
    );
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

    const referralLink = this.props.theme.is_referral_program_activated
      ? `${Config.PUBLIC_URL}${buildMemberReferralLink(
          this.props.companyId,
          this.props?.member?.referral_uuid,
        )}`
      : '';

    const hasToDisplayReferralink =
      this.props.theme.is_referral_program_activated &&
      this.props.referralProgram &&
      this.props.referralMemberStatus?.nb_remaining_referral_uses;

    return (
      <ConsumerAppBarContainer>
        <div className={classes.container}>
          <Paper className={classes.paperContainer}>
            <div className={classes.paperSection}>
              {this.renderHeader()}
              {this.renderActionButton()}
            </div>
            {!this.isError() && (
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
                              hideCoach={this.props.hideCoach}
                              offer={o}
                              offerSpot={o.spot_id}
                              offerSpotInformation={o.spot_information}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {this.props.basket && (
                      <div className={classes.section}>
                        <div className={classes.iconAndText}>
                          <ShoppingBasket />
                          <Typography variant="h5">
                            {this.props.t('validation.sections.basket')}
                          </Typography>
                        </div>
                        <div className={classes.paper}>
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
                              displayPositionInWaitingList={
                                this.props.waitingListConfiguration
                                  ?.display_member_position &&
                                this.props.waitingListConfiguration?.dynamic ===
                                  WAITING_LIST_DYNAMIC_ORDERED
                              }
                              hideCoach={this.props.hideCoach}
                              offer={o}
                              offerSpotInformation={o.spot_information}
                              waitingListPosition={
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
                                  hideCoach={this.props.hideCoach}
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
  });

const mapWithHandlers = {
  onContinue:
    ({ replace, companyId, queryParams }) =>
    () => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.paymentSuccess();
        if (queryParams && queryParams.onValidation === 'close') {
          window.close();
        }
        return;
      }
      replace(`/c/${companyId}`);
    },
  goToMarketplace:
    ({ replace, companyId, queryParams, theme }) =>
    () => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.paymentSuccess();
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
      offerBookedIdList,
      offerPreBookedIdList,
      offerNotBookableIdWithErrorCodeList,
      offerExtraDataList,
    },
  ) => ({
    hideCoach: themeSelectors.getTheme(state).hideCoach,
    offerBookedList: withExtraDataFromQueryParams(
      withCoach(withMetaActivity(withEstablishment(getOfferFromList)))(
        state,
        offerBookedIdList,
      ),
      offerExtraDataList,
    ),
    offerPreBookedList: withExtraDataFromQueryParams(
      withCoach(withMetaActivity(withEstablishment(getOfferFromList)))(
        state,
        offerPreBookedIdList,
      ),
      offerExtraDataList,
    ),
    offerNotBookableList: withExtraDataFromQueryParams(
      withCoach(withMetaActivity(withEstablishment(getOfferFromList)))(
        state,
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
      ...((user_registration_response || {}).offers_booked || []),
      ...flatten(
        ((basket || {}).checkout_items || []).map((ci) =>
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
