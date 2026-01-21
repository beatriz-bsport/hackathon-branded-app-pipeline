import React, { Component } from 'react';

import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { push, replace as replaceRouter, goBack } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { BUYABLE_ITEM_PASS } from '@bsport/common/lib/master-data/buyable-items.js';
import InfoIcon from '@material-ui/icons/Info';
import { WithStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { Basket } from '#src/libs/checkout/types';
import { getCheckoutUrl } from '#src/libs/marketplace/routing-utils';
import { WithHandlerType } from '../../../utils/types';
import { RootState } from '../../../reducers';
import { parseQueryString } from '../../../http';
// @ts-expect-error
import withQueryParams from '../../../hocs/with-query-params.hoc';
import { urlToMarketplace } from '../../../libs/marketplace/utils';

import themeSelectors from '../../../libs/theme/selectors';
// @ts-expect-error
import { getTheme } from '../../../theme';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';
import {
  fetchOne,
  retrievePaymentPackTemplate,
} from '../../../libs/payment-packs/actions';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import analyticsUtils from '#src/components/analytics/analytics';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

type OwnProps = {
  location: Object;
  paymentPackTemplateId: number;

  companyId: number;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  error?: boolean;
  processing: boolean;
};

export class PaymentPackTemplatePreCheckoutPage extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      processing: false,
    };
  }

  addItemToBasket = (basket: Basket, paymentPack: PaymentPack) => {
    if (!this.state.processing) {
      this.setState({ processing: true });
      // @ts-expect-error
      const { nextOffer } = parseQueryString(this.props.location.search);
      // @ts-expect-error
      const { force } = parseQueryString(this.props.location.search);
      analyticsUtils.addItemToCart(paymentPack);
      this.props.addItemToBasket(
        basket.id,
        {
          buyable_item_identifier: BUYABLE_ITEM_PASS,
          quantity: 1,
          buyable_item_id: paymentPack.id,
          extra_data: { offer_next: nextOffer, force },
        },
        {
          onError: () => this.setState({ error: true }),
          onSuccess: () => {
            this.props.goToCheckout(
              // @ts-expect-error
              paymentPack.company_id || paymentPack.company,
            );
          },
        },
      );
    }
  };

  componentDidMount() {
    this.props.retrievePaymentPackTemplate(this.props.paymentPackTemplateId, {
      onSuccess: (ppt) => {
        const packId = ppt.payment_pack_template_instances.find(
          (ppti) => ppti.company === this.props.companyId,
        ).payment_pack;

        this.props.fetchPaymentPack(packId, {
          onSuccess: (paymentPack) => {
            this.props.fetchCurrentBasket(
              // @ts-expect-error
              paymentPack.company_id || paymentPack.company,
              {
                onSuccess: (basket) => {
                  this.addItemToBasket(basket, paymentPack);
                },
              },
            );
          },
        });
      },
    });
  }

  goToPassMarketplace = () => {
    if (WidgetUtils.isWidget() && this.props.theme) {
      this.props.push(`/checkout-s/${this.props.theme.company}?context=widget`);
      return;
    }
    if (this.props.theme && this.props.theme.scheduleURL) {
      let url = this.props.theme.scheduleURL;
      if (!url.startsWith('https://')) {
        url = this.props.theme.scheduleURL.replace(/^http/, 'https');
        if (!url.match(/^https/)) url = `https://${url}`;
      }
      window.location.href = url;
    } else if (this.props.theme) {
      this.props.push(
        urlToMarketplace(
          this.props.theme.company_name,
          this.props.theme.company.toString(),
        ),
      );
    } else {
      this.props.goBack();
    }
  };

  render() {
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <div className={this.props.classes.container}>
          {this.state.error ? (
            <div className={this.props.classes.errorContainer}>
              <InfoIcon className={this.props.classes.errorIcon} />
              <Typography>
                {this.props.t('checkout:autoAdd.paymentPack.locked')}
              </Typography>
              <Button
                className={this.props.classes.button}
                color="secondary"
                onClick={this.goToPassMarketplace}
                variant="contained"
              >
                {this.props.t('payment:goBack')}
              </Button>
            </div>
          ) : (
            <>
              <CircularProgress />
            </>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}
const mapWithHandlers = {
  goToCheckout:
    // @ts-expect-error


      ({ replace, queryParams }: OwnProps & ConnectedProps<typeof connector>) =>
      (companyId: number) => {
        replace(
          getCheckoutUrl(companyId, {
            ...(queryParams?.context ? { context: queryParams.context } : {}),
            ...(queryParams?.onValidation
              ? { onValidation: queryParams.onValidation }
              : {}),
          }),
        );
      },
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      paddingTop: theme.spacing(4),
      width: '100vw',
    },
    errorContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    errorIcon: {
      height: 64,
      width: 64,
      marginBottom: theme.spacing(2),
    },
    button: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
  });

const connector = connect(
  (state: RootState) => ({
    theme: themeSelectors.getTheme(state),
  }),
  {
    addItemToBasket,
    removeItemFromBasket,
    fetchCurrentBasket,
    fetchPaymentPack: fetchOne,
    goBack,
    replace: replaceRouter,
    push,
    retrievePaymentPackTemplate,
  },
);

export default compose<any, OwnProps>(
  withTranslation(['checkout', 'payment']),
  withStyles(styles),
  routerParamsToProps({
    id: 'paymentPackTemplateId:number',
    companyId: 'companyId:number',
  }),

  withQueryParams([
    ['context', 'onValidation'],
    'queryParams',
    'setQueryParams',
  ]),
  connector,
  withHandlers(mapWithHandlers),
)(PaymentPackTemplatePreCheckoutPage);
