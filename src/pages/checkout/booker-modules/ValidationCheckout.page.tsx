import React from 'react';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';

import { replace as replaceRouter, goBack } from 'connected-react-router';
import flatten from 'lodash/flatten';
import { compose, withHandlers, withProps } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import BUYABLE_ITEM_CAN_NOT_BE_BOUGHT_ERROR_CODES from '@bsport/common/lib/master-data/buyable-item-can-not-be-bought';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import withQueryParams from '../../../hocs/with-query-params.hoc';
import themeSelectors from '../../../libs/theme/selectors';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

import { fetchBasket } from '../../../libs/checkout/actions';
import { getBasket } from '../../../libs/checkout/selectors';
import CheckoutItemListItem from '../../../libs/checkout/components/CheckoutItemListItem.component';
import { Offer_FULL } from '../../../libs/offer/types';

import {
  getOfferFromList,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '../../../libs/offer/selectors';
import { fetchOfferBulk } from '../../../libs/offer/actions';
import { fetchMetaActivityBulk } from '../../../libs/meta-activity/actions';
import { fetchCoachBulk } from '../../../libs/associated-coach/actions';
import { fetchEstablishmentBulk } from '../../../libs/establishment/actions';
import { OptionCallback } from '../../../state/types';

import OfferBookableItem from '../../../libs/booker-module/components/OfferBookableItem.component';

import ConsumerAppBarContainer from '../ConsumerAppBar.container';
import WidgetUtils from '../../../libs/widget/WidgetUtils';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  queryParams: any;
  offerBookedIdList: number[];
  offerPreBookedIdList: number[];
  offerNotBookableIdWithErrorCodeList: Array<number[]>;
  offerBookedList: Offer_FULL[];
  offerPreBookedList: Offer_FULL[];
  offerNotBookableList: Array<Offer_FULL>;
  fetchBasket: (id: string, options: OptionCallback) => void;
  goBack: () => void;
  onContinue: () => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class ValidationCheckout extends React.Component<Props> {
  componentDidMount() {
    if (
      this.props.queryParams?.basket &&
      this.props.queryParams.basket !== 'null'
    ) {
      this.props.fetchBasket(this.props.queryParams.basket, {
        onSuccess: this.fetchOfferData,
      });
    }
    this.fetchOfferData();
  }

  fetchOfferData = () => {
    this.props.fetchOfferBulk(
      [
        ...this.props.offerBookedIdList,
        ...this.props.offerPreBookedIdList,
        ...this.props.offerNotBookableIdWithErrorCodeList.map((ie) => ie[0]),
      ],
      {
        onSuccess: (offerList) => {
          this.props.fetchEstablishmentBulk(
            offerList.map((o) => o.establishment),
          );
          this.props.fetchCoachBulk([
            ...offerList.map((o) => o.coach),
            ...offerList.map((o) => o.coach_override),
          ]);
          this.props.fetchMetaActivityBulk(
            offerList.map((o) => o.meta_activity),
          );
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
          <HighlightOffIcon color="error" className={classes.iconHeader} />
        </div>
      );
    }
    return (
      <div className={classes.header}>
        <CheckCircleOutlineIcon
          color="primary"
          className={classes.iconHeader}
        />
        <Typography variant="h3" className={classes.sectionTitle}>
          {this.props.t('validation.sections.title')}
        </Typography>
      </div>
    );
  };

  renderActionButton = () => {
    if (this.isError()) {
      return (
        <Button
          className={this.props.classes.button}
          onClick={this.props.goBack}
          variant="outlined"
          color="primary"
        >
          {this.props.t('validation.actions.back')}
        </Button>
      );
    }
    return (
      <Button
        className={this.props.classes.button}
        onClick={this.props.onContinue}
        variant="outlined"
        color="primary"
      >
        {this.props.t('validation.actions.continue')}
      </Button>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <ConsumerAppBarContainer companyId={this.props.companyId}>
        {this.renderHeader()}
        {!!this.props.offerBookedList.length && (
          <div className={classes.section}>
            <Typography variant="h4" className={classes.sectionTitle}>
              {this.props.t('validation.sections.offerBooked')}
            </Typography>
            <Paper className={classes.paper}>
              {this.props.offerBookedList.map((o) => (
                <OfferBookableItem
                  key={o.id}
                  hideCoach={this.props.hideCoach}
                  offer={o}
                />
              ))}
            </Paper>
          </div>
        )}
        {!!this.props.offerPreBookedList.length && (
          <div className={classes.section}>
            <Typography variant="h4" className={classes.sectionTitle}>
              {this.props.t('validation.sections.offerPreBooked')}
            </Typography>
            <Paper className={classes.paper}>
              {this.props.offerPreBookedList.map((o) => (
                <OfferBookableItem
                  key={o.id}
                  hideCoach={this.props.hideCoach}
                  offer={o}
                />
              ))}
            </Paper>
          </div>
        )}
        {!!this.props.offerNotBookableList.length && (
          <div className={classes.section}>
            <Typography variant="h4" className={classes.sectionTitle}>
              {this.props.t('validation.sections.offerNotBookable')}
            </Typography>
            <Paper className={classes.paper}>
              {this.props.offerNotBookableList.map((o, idx) => {
                const error_code = this.props
                  .offerNotBookableIdWithErrorCodeList[idx][1];
                return (
                  <div key={o.id} className={classes.paper}>
                    <OfferBookableItem
                      hideCoach={this.props.hideCoach}
                      offer={o}
                    />
                    <div className={classes.row}>
                      <WarningIcon
                        color="error"
                        className={classes.smallIcon}
                      />
                      <Typography color="error" variant="caption">
                        {BUYABLE_ITEM_CAN_NOT_BE_BOUGHT_ERROR_CODES.includes(
                          error_code,
                        )
                          ? this.props.t(
                              `snackbar:canNotBuyErrorCode.${error_code}`,
                            )
                          : this.props.t('snackbar:canNotBuyErrorCode.generic')}
                      </Typography>
                    </div>
                  </div>
                );
              })}
            </Paper>
          </div>
        )}
        {this.props.basket && (
          <div className={classes.section}>
            <Typography variant="h4" className={classes.sectionTitle}>
              {this.props.t('validation.sections.basket')}
            </Typography>
            <Paper className={classes.paper}>
              {this.props.basket.checkout_items.map((ci) => (
                <CheckoutItemListItem
                  hideExtraData
                  checkout_item={ci}
                  key={ci.id}
                />
              ))}
            </Paper>
          </div>
        )}
        {this.renderActionButton()}
      </ConsumerAppBarContainer>
    );
  }
}

const styles = (theme) => ({
  section: {
    width: '100%',
    maxWidth: 620,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
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
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    '&>*': {
      width: '100%',
    },
  },
  iconHeader: {
    height: 160,
    width: 160,
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(2),
  },
});

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  withQueryParams([['user_registration_response', 'basket'], 'queryParams']),
  withTranslation(['checkout', 'snackbar']),
  withStyles(styles),
  connect(
    (state, { queryParams }) => ({
      basket:
        queryParams?.basket && queryParams.basket !== 'null'
          ? getBasket(state, queryParams.basket)
          : null,
    }),
    {
      fetchBasket,
    },
  ),
  withProps(({ queryParams }) => ({
    user_registration_response:
      queryParams?.user_registration_response &&
      JSON.parse(decodeURIComponent(queryParams.user_registration_response)),
  })),
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
  })),
  connect(
    (
      state,
      {
        offerBookedIdList,
        offerPreBookedIdList,
        offerNotBookableIdWithErrorCodeList,
      },
    ) => ({
      hideCoach: themeSelectors.getTheme(state).hideCoach,
      offerBookedList: withCoach(
        withMetaActivity(withEstablishment(getOfferFromList)),
      )(state, offerBookedIdList),
      offerPreBookedList: withCoach(
        withMetaActivity(withEstablishment(getOfferFromList)),
      )(state, offerPreBookedIdList),
      offerNotBookableList: withCoach(
        withMetaActivity(withEstablishment(getOfferFromList)),
      )(
        state,
        offerNotBookableIdWithErrorCodeList.map((ie) => ie[0]),
      ),
    }),
    {
      fetchEstablishmentBulk,
      fetchCoachBulk,
      fetchMetaActivityBulk,
      fetchOfferBulk,
      replace: replaceRouter,
      goBack,
    },
  ),
  withHandlers({
    onContinue: ({ replace, companyId }) => {
      if (WidgetUtils.isWidget()) {
        WidgetUtils.paymentSuccess();
        return;
      }
      replace(`/c/${companyId}`);
    },
  }),
)(ValidationCheckout);
