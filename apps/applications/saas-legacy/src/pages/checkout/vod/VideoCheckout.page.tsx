import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import { withTranslation, WithTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import { push } from 'connected-react-router';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import themeSelectors from '#src/libs/theme/selectors';
import { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { getCheckoutUrl } from '#src/libs/marketplace/routing-utils';
import WidgetUtils from '../../../libs/widget/WidgetUtils';
import ConsumerAppBarContainer from '../ConsumerAppBar.container';
import CollapsibleSection from '../../../components/CollapsibleSection';
import { RadioItem } from '../../../components/radio/RadioItem';

import PaymentComboBookableItem from '../../../libs/booker-module/components/PaymentComboBookableItem.component';
import PaymentPackBookableItem from '../../../libs/booker-module/components/PaymentPackBookableItem.component';
import ConsumerPaymentPackBookableItem from '../../../libs/booker-module/components/ConsumerPaymentPackBookableItem.component';

import { getPrivatePassListCompatibleWithVideo } from '../../../libs/private-service/selectors/private-pass';
import {
  fetchCurrentBasket,
  addItemToBasket,
} from '../../../libs/checkout/actions';
import { registerVideo } from '../../../libs/video/actions';
import { getPrivateConsumerPassCompatibleList } from '../../../libs/private-service/selectors/private-consumer-pass';
import { getPaymentPackListCompatibleWithVideo } from '../../../libs/payment-packs/selectors';
import {
  withPaymentPack,
  getConsumerPaymentPackCompatibleList,
} from '../../../libs/consumer-payment-pack/selectors';
import { getAvailablePaymentComboList } from '#src/libs/payment-combo/selectors';

import {
  fetchPrivatePassList,
  fetchPrivateConsumerPassCompatibleList,
} from '../../../libs/private-service/actions';
import {
  fetchPaymentPackList,
  fetchPaymentPackBulk,
} from '../../../libs/payment-packs/actions';
import { fetchConsumerPaymentPackCompatibleList } from '../../../libs/consumer-payment-pack/actions';
import { fetchPaymentComboList } from '../../../libs/payment-combo/actions';

import { RootState } from '../../../reducers';

import PrivatePassBookableItem from '../../../libs/booker-module/components/PrivatePassBookableItem.component';
import PrivateConsumerPassBookableItem from '../../../libs/booker-module/components/PrivateConsumerPassBookableItem.component';
import analyticsUtils from '#src/components/analytics/analytics';

const BOOKER_ITEM_PASS = -1;
const BOOKER_ITEM_PRIVATE_PASS = -2;

// const PrivatePassBookableItem = () => <div />;
// const PrivateConsumerPassBookableItem = () => <div />;

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
    },
    innerContainer: {
      width: '100%',
      maxWidth: 900,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'strecth',
    },
    innerButton: {
      width: '100%',
      padding: theme.spacing(2),
    },
    emptyContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: theme.spacing(6),
      width: '100%',
    },
    icon: {
      height: 64,
      width: 64,
      marginBottom: theme.spacing(4),
    },
    item: {
      paddingLeft: theme.spacing(2),
    },
  });

type OwnProps = { id: number; companyId: number; onSuccess?: () => void };

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

type State = {
  processing: boolean;
  selectedPass: {
    id: null | number;
    buyable_item_identifier: number | null;
  };
};

export class VideoCheckoutBase extends Component<Props, State> {
  state: State = {
    selectedPass: {
      id: null,
      buyable_item_identifier: null,
    },
    processing: false,
  };

  componentDidMount() {
    // this.props.retrieveVideo(this.props.id);
    this.props.fetchPrivatePassList({
      video: this.props.id,
      manager_only: false,
    });
    this.props.fetchPaymentPackList({
      as_consumer: true,
      video: this.props.id,
      manager_only: false,
      disabled: false,
      company: this.props.companyId,
    });
    this.props.fetchPaymentComboList({
      as_consumer: true,
      video: this.props.id,
      company: this.props.companyId,
      manager_only: false,
    });
    this.props.fetchPrivateConsumerPassCompatibleList({
      as_consumer: true,
      video: this.props.id,
    });
    this.props.fetchConsumerPaymentPackCompatibleList(
      {
        video: this.props.id,
      },
      {
        onSuccess: (cppList: any) => {
          this.props.fetchPaymentPackBulk(
            cppList.map((cpp: any) => cpp.payment_pack),
          );
        },
      },
    );
  }

  selectBookerMethod = (id: number, buyable_item_identifier: number) => {
    this.setState({
      selectedPass: {
        id,
        buyable_item_identifier,
      },
    });
  };

  onClickBookVideo = () => {
    this.setState({ processing: true });

    const { id, buyable_item_identifier } = this.state.selectedPass;

    if (buyable_item_identifier === BOOKER_ITEM_PASS) {
      this.props.registerVideo(
        this.props.id,
        {
          consumer_payment_pack: id,
        },
        {
          onSuccess: this.props.onSuccess,
          onError: () => this.setState({ processing: false }),
        },
      );
    } else if (buyable_item_identifier === BOOKER_ITEM_PRIVATE_PASS) {
      this.props.registerVideo(
        this.props.id,
        {
          private_consumer_pass: id,
        },
        {
          onSuccess: this.props.onSuccess,
          onError: () => this.setState({ processing: false }),
        },
      );
    } else if (
      [
        BUYABLE_ITEM_PASS,
        BUYABLE_ITEM_COMBO_ITEM,
        BUYABLE_ITEM_PRIVATE_PASS,
      ].includes(buyable_item_identifier)
    ) {
      this.props.fetchCurrentBasket(this.props.companyId, {
        onError: () => this.setState({ processing: false }),
        onSuccess: (basket) => {
          this.props.addItemToBasket(
            basket.id,
            {
              buyable_item_identifier,
              quantity: 1,
              buyable_item_id: id,
              extra_data: { video: this.props.id },
            },
            {
              onError: () => this.setState({ processing: false }),
              onSuccess: (addedItemBasket) => {
                const addedItem = addedItemBasket.checkout_items.find(
                  (checkoutItem) => checkoutItem.buyable_item_id === id,
                );
                analyticsUtils.addItemToCart(addedItem);
                this.props.push(
                  getCheckoutUrl(
                    this.props.companyId,
                    this.props.theme?.display_new_checkout_flow,
                  ),
                );
              },
            },
          );
        },
      });
    }
  };

  render() {
    const { t, classes } = this.props;

    const consumerPassLength =
      this.props.consumerPaymentPackList.length ||
      0 + this.props.privateConsumerPassList.length ||
      0;

    const passLength =
      this.props.paymentPackList.length ||
      0 + this.props.privatePassList.length ||
      0;
    return (
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          {consumerPassLength === 0 &&
            passLength === 0 &&
            this.props.paymentComboList.length === 0 &&
            !this.props.loading && (
              <div className={classes.emptyContainer}>
                <WarningIcon className={classes.icon} />
                <Typography align="center">
                  {t('bookerMethod.emptyMethod')}
                </Typography>
              </div>
            )}
          {consumerPassLength !== 0 && (
            <CollapsibleSection
              in
              title={`${t(
                'bookerMethod.section.consumerPass',
              )} (${consumerPassLength})`}
            >
              {this.props.consumerPaymentPackList.map(
                (consumerPaymentPack: ConsumerPaymentPack<PaymentPack>) => (
                  <div key={consumerPaymentPack.id} className={classes.item}>
                    <RadioItem
                      disabled={this.state.processing}
                      onClick={() =>
                        this.selectBookerMethod(
                          consumerPaymentPack.id,
                          BOOKER_ITEM_PASS,
                        )
                      }
                      renderItem={() => (
                        <ConsumerPaymentPackBookableItem
                          consumerPaymentPack={consumerPaymentPack}
                        />
                      )}
                      selected={
                        consumerPaymentPack.id === this.state.selectedPass.id &&
                        this.state.selectedPass.buyable_item_identifier ===
                          BOOKER_ITEM_PASS
                      }
                    />
                  </div>
                ),
              )}
              {this.props.privateConsumerPassList.map((privateConsumerPass) => (
                <div key={privateConsumerPass.id} className={classes.item}>
                  <RadioItem
                    disabled={this.state.processing}
                    onClick={() =>
                      this.selectBookerMethod(
                        privateConsumerPass.id,
                        BOOKER_ITEM_PRIVATE_PASS,
                      )
                    }
                    renderItem={() => (
                      <PrivateConsumerPassBookableItem
                        privateConsumerPass={privateConsumerPass}
                      />
                    )}
                    selected={
                      privateConsumerPass.id === this.state.selectedPass.id &&
                      this.state.selectedPass.buyable_item_identifier ===
                        BOOKER_ITEM_PRIVATE_PASS
                    }
                  />
                </div>
              ))}
            </CollapsibleSection>
          )}
          {passLength > 0 && (
            <CollapsibleSection
              in
              title={`${t('bookerMethod.section.pass')} (${passLength})`}
            >
              {this.props.paymentPackList.map((paymentPack: PaymentPack) => (
                <div key={paymentPack.id} className={classes.item}>
                  <RadioItem
                    disabled={this.state.processing}
                    onClick={() =>
                      this.selectBookerMethod(paymentPack.id, BUYABLE_ITEM_PASS)
                    }
                    renderItem={() => (
                      <PaymentPackBookableItem
                        hideCredits={
                          this.props.theme.hide_credits_for_customers
                        }
                        paymentPack={paymentPack}
                      />
                    )}
                    selected={
                      paymentPack.id === this.state.selectedPass.id &&
                      this.state.selectedPass.buyable_item_identifier ===
                        BUYABLE_ITEM_PASS
                    }
                  />
                </div>
              ))}
              {this.props.privatePassList.map((privatePass) => (
                <div key={privatePass.id} className={classes.item}>
                  <RadioItem
                    disabled={this.state.processing}
                    onClick={() =>
                      this.selectBookerMethod(
                        privatePass.id,
                        BUYABLE_ITEM_PRIVATE_PASS,
                      )
                    }
                    renderItem={() => (
                      <PrivatePassBookableItem
                        hideCredits={
                          this.props.theme.hide_credits_for_customers
                        }
                        privatePass={privatePass}
                      />
                    )}
                    selected={
                      privatePass.id === this.state.selectedPass.id &&
                      this.state.selectedPass.buyable_item_identifier ===
                        BUYABLE_ITEM_PRIVATE_PASS
                    }
                  />
                </div>
              ))}
            </CollapsibleSection>
          )}
          {this.props.paymentComboList.length > 0 && (
            <CollapsibleSection
              in
              title={`${t('bookerMethod.section.combo')} (${
                this.props.paymentComboList.length
              })`}
            >
              {this.props.paymentComboList.map((pc) => (
                <div key={pc.id} className={classes.item}>
                  <RadioItem
                    disabled={this.state.processing}
                    onClick={() =>
                      this.selectBookerMethod(pc.id, BUYABLE_ITEM_COMBO_ITEM)
                    }
                    renderItem={() => (
                      <PaymentComboBookableItem paymentCombo={pc} />
                    )}
                    selected={
                      pc.id === this.state.selectedPass.id &&
                      this.state.selectedPass.buyable_item_identifier ===
                        BUYABLE_ITEM_COMBO_ITEM
                    }
                  />
                </div>
              ))}
            </CollapsibleSection>
          )}
        </div>
        <Button
          color="primary"
          disabled={
            !this.state.selectedPass.id ||
            this.state.processing ||
            this.props.loading
          }
          onClick={this.onClickBookVideo}
          style={{ position: 'sticky', bottom: 0, width: '100%' }}
          variant="contained"
        >
          <div className={classes.innerButton}>
            {this.props.loading || this.state.processing ? (
              <CircularProgress color="inherit" size={22} />
            ) : (
              t('bookerMethod.actions.bookVod')
            )}
          </div>
        </Button>
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    privatePassList: getPrivatePassListCompatibleWithVideo(state),
    paymentPackList: getPaymentPackListCompatibleWithVideo(state),
    consumerPaymentPackList: withPaymentPack(
      getConsumerPaymentPackCompatibleList,
    )(state),
    privateConsumerPassList: getPrivateConsumerPassCompatibleList(state),
    paymentComboList: getAvailablePaymentComboList(state),
    loading:
      state.paymentPack.loading ||
      state.paymentCombo.loading ||
      state.privateService.privatePass.loading ||
      state.consumerPaymentPack.loading ||
      state.privateService.privateConsumerPass.loading,
    theme: themeSelectors.getTheme(state),
  }),
  {
    fetchPrivatePassList,
    push,
    fetchPaymentPackList,
    fetchPaymentComboList,
    fetchPaymentPackBulk,
    fetchPrivateConsumerPassCompatibleList,
    fetchConsumerPaymentPackCompatibleList,
    fetchCurrentBasket,
    addItemToBasket,
    registerVideo,
  },
);

export const VideoCheckoutComponent = compose<Props, OwnProps>(
  withStyles(styles),
  withTranslation(['checkout']),
  connector,
)(VideoCheckoutBase);

export default compose<Props, OwnProps>(
  routerParamsToProps({ id: 'id:number', companyId: 'companyId:number' }),
)((props) => (
  <ConsumerAppBarContainer>
    <VideoCheckoutComponent
      {...props}
      onSuccess={() => {
        if (WidgetUtils.isWidget()) {
          WidgetUtils.videoRegistered(props.id);
          window.close();
        }
      }}
    />
  </ConsumerAppBarContainer>
));
