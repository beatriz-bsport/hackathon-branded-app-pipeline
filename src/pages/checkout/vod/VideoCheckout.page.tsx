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
} from '@bsport/common/lib/master-data/buyable-items';
import CircularProgress from '@material-ui/core/CircularProgress';
import WidgetUtils from '../../../libs/widget/WidgetUtils';
import ConsumerAppBarContainer from '../ConsumerAppBar.container';
import CollapsibleSection from '../../../components/CollapsibleSection';
import { RadioItem } from '../../../components/radio/RadioItem';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

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
import { getPaymentComboList } from '../../../libs/payment-combo/selectors';

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
    this.props.fetchPrivatePassList({ video: this.props.id });
    this.props.fetchPaymentPackList({
      as_consumer: true,
      video: this.props.id,
      manager_only: false,
      available: true,
      company: this.props.companyId,
    });
    this.props.fetchPaymentComboList({
      as_consumer: true,
      video: this.props.id,
      company: this.props.companyId,
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
              onSuccess: () =>
                this.props.push(`/checkout/${this.props.companyId}`),
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
              title={`${t(
                'bookerMethod.section.consumerPass',
              )} (${consumerPassLength})`}
              in
            >
              {this.props.consumerPaymentPackList.map((cpp) => (
                <div className={classes.item} key={cpp.id}>
                  <RadioItem
                    disabled={this.state.processing}
                    selected={
                      cpp.id === this.state.selectedPass.id &&
                      this.state.selectedPass.buyable_item_identifier ===
                        BOOKER_ITEM_PASS
                    }
                    onClick={() =>
                      this.selectBookerMethod(cpp.id, BOOKER_ITEM_PASS)
                    }
                    renderItem={() => (
                      <ConsumerPaymentPackBookableItem
                        consumerPaymentPack={cpp}
                      />
                    )}
                  />
                </div>
              ))}
              {this.props.privateConsumerPassList.map((pp) => (
                <div className={classes.item} key={pp.id}>
                  <RadioItem
                    disabled={this.state.processing}
                    selected={
                      pp.id === this.state.selectedPass.id &&
                      this.state.selectedPass.buyable_item_identifier ===
                        BOOKER_ITEM_PRIVATE_PASS
                    }
                    onClick={() =>
                      this.selectBookerMethod(pp.id, BOOKER_ITEM_PRIVATE_PASS)
                    }
                    renderItem={() => (
                      <PrivateConsumerPassBookableItem
                        privateConsumerPass={pp}
                      />
                    )}
                  />
                </div>
              ))}
            </CollapsibleSection>
          )}
          {passLength > 0 && (
            <CollapsibleSection
              title={`${t('bookerMethod.section.pass')} (${passLength})`}
              in
            >
              {this.props.paymentPackList.map((pp) => (
                <div className={classes.item} key={pp.id}>
                  <RadioItem
                    disabled={this.state.processing}
                    selected={
                      pp.id === this.state.selectedPass.id &&
                      this.state.selectedPass.buyable_item_identifier ===
                        BUYABLE_ITEM_PASS
                    }
                    onClick={() =>
                      this.selectBookerMethod(pp.id, BUYABLE_ITEM_PASS)
                    }
                    renderItem={() => (
                      <PaymentPackBookableItem paymentPack={pp} />
                    )}
                  />
                </div>
              ))}
              {this.props.privatePassList.map((pp) => (
                <div className={classes.item} key={pp.id}>
                  <RadioItem
                    disabled={this.state.processing}
                    selected={
                      pp.id === this.state.selectedPass.id &&
                      this.state.selectedPass.buyable_item_identifier ===
                        BUYABLE_ITEM_PRIVATE_PASS
                    }
                    onClick={() =>
                      this.selectBookerMethod(pp.id, BUYABLE_ITEM_PRIVATE_PASS)
                    }
                    renderItem={() => (
                      <PrivatePassBookableItem privatePass={pp} />
                    )}
                  />
                </div>
              ))}
            </CollapsibleSection>
          )}
          {this.props.paymentComboList.length > 0 && (
            <CollapsibleSection
              title={`${t('bookerMethod.section.combo')} (${
                this.props.paymentComboList.length
              })`}
              in
            >
              {this.props.paymentComboList.map((pc) => (
                <div className={classes.item} key={pc.id}>
                  <RadioItem
                    selected={
                      pc.id === this.state.selectedPass.id &&
                      this.state.selectedPass.buyable_item_identifier ===
                        BUYABLE_ITEM_COMBO_ITEM
                    }
                    disabled={this.state.processing}
                    onClick={() =>
                      this.selectBookerMethod(pc.id, BUYABLE_ITEM_COMBO_ITEM)
                    }
                    renderItem={() => (
                      <PaymentComboBookableItem paymentCombo={pc} />
                    )}
                  />
                </div>
              ))}
            </CollapsibleSection>
          )}
        </div>
        <Button
          color="primary"
          style={{ position: 'sticky', bottom: 0, width: '100%' }}
          variant="contained"
          disabled={
            !this.state.selectedPass.id ||
            this.state.processing ||
            this.props.loading
          }
          onClick={this.onClickBookVideo}
        >
          <div className={classes.innerButton}>
            {this.props.loading || this.state.processing ? (
              <CircularProgress size={22} color="inherit" />
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
    paymentComboList: getPaymentComboList(state),
    loading:
      state.paymentPack.loading ||
      state.paymentCombo.loading ||
      state.privateService.privatePass.loading ||
      state.consumerPaymentPack.loading ||
      state.privateService.privateConsumerPass.loading,
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

export const VideoCheckoutComponent = compose(
  withStyles(styles),
  withTranslation(['checkout']),
  connector,
)(VideoCheckoutBase);

export default compose(
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
