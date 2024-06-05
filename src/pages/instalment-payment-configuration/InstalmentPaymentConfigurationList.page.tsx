import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';

import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Info from '@material-ui/icons/Info';

import { fetchGiftcardList as fetchGiftcardListAction } from '#libs/giftcard/actions';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#libs/payment-combo/actions';
import { fetchPaymentPackList as fetchPaymentPackListAction } from '#libs/payment-packs/actions';
import { fetchPrivatePassList as fetchPrivatePassListAction } from '#libs/private-service/actions';
import {
  fetchShopItemBaseList as fetchShopItemBaseListAction,
  fetchShopItemStandaloneList as fetchShopItemStandaloneListAction,
} from '#libs/shop/actions/shopItemReworked';
import {
  createOrUpdateInstalmentPayment as createOrUpdateInstalmentPaymentAction,
  disableInstalmentPayment as disableInstalmentPaymentAction,
  fetchInstalmentPayment as fetchInstalmentPaymentAction,
} from '#libs/instalment-payment-configuration/actions';

import { getEnabledPaymentPacks } from '#libs/payment-packs/selectors';
import { getGiftcardListActive } from '#libs/giftcard/selectors';
import { getPaymentComboList } from '#libs/payment-combo/selectors';
import { getPrivatePassAvailable } from '#libs/private-service/selectors/private-pass';
import { getShopItemBaseAndStandaloneList } from '#libs/shop/selectors';
import {
  composeWithAllItems,
  getInstalmentPaymentList,
  retrieveInstalmentPayment,
} from '#libs/instalment-payment-configuration/selectors';

import InstalmentPaymentConfiguration from '#libs/instalment-payment-configuration/components/InstalmentPaymentConfiguration.form';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import InstalmentPaymentListComponent from '#libs/instalment-payment-configuration/components/InstalmentPaymentConfigurationList.component';
import BottomActionButtons from '#components/button/BottomActionsButton.component';
import InstalmentPaymentConfigurationDetail from '#libs/instalment-payment-configuration/components/InstalmentPaymentConfigurationDetail.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

import withTitle from '#hocs/with-title.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

import type { WithHandlerType } from '#utils/types';
import type {
  InstalmentPayment,
  InstalmentPaymentApi,
} from '#libs/instalment-payment-configuration/types';
import type { RootState } from '../../reducers';

const { trackFormCancel } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.InstalmentPayment,
);

type OwnProps = {
  title: string;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type RouterProps = { instalmentPaymentId: number };

type Props = OwnProps &
  RouterProps &
  StateHandlerType &
  ConnectedProps<typeof connector> &
  WithHandlerType<typeof mapWhithHandlers> &
  WithStyles<typeof styles> &
  WithTranslation;

export class InstalmentPaymentConfigurationList extends Component<Props> {
  componentDidMount() {
    this.props.fetchShopItemBaseList();
    this.props.fetchShopItemStandaloneList();
    this.props.fetchInstalmentPayment(
      {},
      {
        onSuccess: () => {
          this.props.instalmentPaymentId &&
            this.props.fetchInstalmentPaymentItemInfo(
              this.props.instalmentPaymentId,
            );
        },
      },
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.instalmentPaymentId !== this.props.instalmentPaymentId) {
      this.props.instalmentPaymentId &&
        this.props.fetchInstalmentPaymentItemInfo(
          this.props.instalmentPaymentId,
        );
    }
  }

  render() {
    const {
      classes,
      t,
      instalmentPaymentList,
      isCreationFormOpen,
      paymentPackList,
      comboList,
      privatePassList,
      shopItemList,
      giftcardList,
      instalmentPaymentLoading,
      instalmentPaymentId,
      instalmentPaymentToEdit,
      instalmentPaymentToEditId,
      instalmentPaymentDetailed,
      fetckAllItemInfo,
      setIsCreationFormOpen,
      createOrUpdateInstalmentPayment,
      pushSelectedInstalmentPayment,
      setInstalmentPaymentToEditId,
      disableInstalmentPayment,
      pushInstalmentPaymentHome,
    } = this.props;

    return (
      <>
        <div className={classes.container}>
          {!instalmentPaymentList?.length && !instalmentPaymentLoading ? (
            <div className={classes.noInstalmentPayment}>
              <div className={classes.end}>
                <div className={classes.infoAndText}>
                  <Info />
                  <Typography className={classes.typo}>
                    {t('list.infoNoInstalmentPayment')}
                  </Typography>
                </div>
                <div>
                  <Button
                    color="primary"
                    onClick={() => {
                      setIsCreationFormOpen(true);
                      fetckAllItemInfo();
                    }}
                    variant="outlined"
                  >
                    {t('list.addInstalmentPayment')}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <InstalmentPaymentListComponent
                  instalmentPaymentList={instalmentPaymentList}
                  loading={instalmentPaymentLoading}
                  onClickOnItem={(id) => {
                    pushSelectedInstalmentPayment(id);
                  }}
                  onDelete={(id) => {
                    disableInstalmentPayment(id);
                    if (id === instalmentPaymentId) {
                      pushInstalmentPaymentHome();
                    }
                  }}
                  onEdit={(id) => {
                    fetckAllItemInfo();
                    setInstalmentPaymentToEditId(id);
                  }}
                  selectedInstalmentPaymentId={instalmentPaymentId}
                />
              </Grid>
              <Grid item xs={6}>
                <div className={classes.detailContainer}>
                  <div>
                    <Typography className={classes.title} variant="h5">
                      {t('detail.title')}
                    </Typography>
                    <Divider />
                  </div>
                  <InstalmentPaymentConfigurationDetail
                    comboList={comboList}
                    giftcardList={giftcardList}
                    instalmentPayment={instalmentPaymentDetailed}
                    instalmentPaymentId={instalmentPaymentId}
                    loading={instalmentPaymentLoading}
                    onDelete={(id) => {
                      disableInstalmentPayment(id);
                      pushInstalmentPaymentHome();
                    }}
                    onEdit={(id) => {
                      fetckAllItemInfo();
                      setInstalmentPaymentToEditId(id);
                    }}
                    paymentPackList={paymentPackList}
                    privatePassList={privatePassList}
                    shopItemList={shopItemList}
                  />
                </div>
              </Grid>
            </Grid>
          )}
        </div>
        <GenericResponsiveDrawer
          onClose={() => {
            trackFormCancel(instalmentPaymentToEdit?.id);
            setIsCreationFormOpen(false);
            setInstalmentPaymentToEditId(null);
          }}
          open={isCreationFormOpen || !!instalmentPaymentToEditId}
          title={t('form.create')}
          width="45%"
        >
          <InstalmentPaymentConfiguration
            isInDrawer
            closeDialog={() => {
              setIsCreationFormOpen(false);
              setInstalmentPaymentToEditId(null);
            }}
            comboList={comboList}
            giftcardList={giftcardList}
            initial={instalmentPaymentToEdit}
            paymentPackList={paymentPackList}
            privatePassList={privatePassList}
            shopItemList={shopItemList}
            submit={(instalmentPayment, options) => {
              createOrUpdateInstalmentPayment(instalmentPayment, options);
            }}
          />
        </GenericResponsiveDrawer>
        <BottomActionButtons
          onCreate={() => {
            setIsCreationFormOpen(true);
            fetckAllItemInfo();
          }}
          onCreateLabel={t('form.add')}
        />
      </>
    );
  }
}
const styles = (theme: Theme) =>
  createStyles({
    typo: { maxWidth: theme.spacing(100) },
    detailContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
      paddingBottom: theme.spacing(10),
    },
    title: {
      marginBottom: theme.spacing(1),
    },
    container: {},
    noInstalmentPayment: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: theme.spacing(10),
      gap: theme.spacing(2),
    },
    infoAndText: {
      display: 'flex',
      gap: theme.spacing(2),
      alignItems: 'center',
    },
    end: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: theme.spacing(2),
    },
  });

const withStateHandlersInit: {
  isCreationFormOpen: boolean;
  instalmentPaymentToEditId: number;
} = { isCreationFormOpen: false, instalmentPaymentToEditId: null };

const withStateHandlersSetter = {
  setInstalmentPaymentToEditId: () => (instalmentPaymentToEditId: number) => {
    return { instalmentPaymentToEditId };
  },
  setIsCreationFormOpen: () => (isCreationFormOpen: boolean) => {
    return { isCreationFormOpen };
  },
};

const connector = connect(
  (state: RootState, props: StateHandlerType & RouterProps) => ({
    instalmentPaymentLoading: state.instalmentPayment.loading,
    paymentPackList: getEnabledPaymentPacks(state),
    comboList: getPaymentComboList(state),
    privatePassList: getPrivatePassAvailable(state),
    shopItemList: getShopItemBaseAndStandaloneList(state),
    giftcardList: getGiftcardListActive(state),
    instalmentPaymentList: getInstalmentPaymentList(
      state,
    ) as Array<InstalmentPaymentApi>,
    instalmentPaymentDetailed: composeWithAllItems(retrieveInstalmentPayment)(
      state,
      props.instalmentPaymentId,
    ) as InstalmentPayment,
    instalmentPaymentToEdit: retrieveInstalmentPayment(
      state,
      props.instalmentPaymentToEditId,
    ),
  }),
  {
    fetchPaymentPackList: fetchPaymentPackListAction,
    fetchPaymentComboList: fetchPaymentComboListAction,
    fetchGiftcardList: fetchGiftcardListAction,
    fetchShopItemBaseList: fetchShopItemBaseListAction,
    fetchShopItemStandaloneList: fetchShopItemStandaloneListAction,
    fetchPrivatePassList: fetchPrivatePassListAction,
    createOrUpdateInstalmentPayment: createOrUpdateInstalmentPaymentAction,
    fetchInstalmentPayment: fetchInstalmentPaymentAction,
    push: pushRouter,
    disableInstalmentPayment: disableInstalmentPaymentAction,
  },
);

export const mapWhithHandlers = {
  pushSelectedInstalmentPayment:
    (props: RouterProps & ConnectedProps<typeof connector>) => (id: number) => {
      props.push(`${id}`);
    },
  pushInstalmentPaymentHome:
    (props: RouterProps & ConnectedProps<typeof connector>) => () => {
      props.push('/instalment-payment/');
    },
  fetckAllItemInfo:
    (props: RouterProps & ConnectedProps<typeof connector>) => () => {
      props.fetchPaymentPackList({ disabled: false, page_size: 1000 });
      props.fetchPaymentComboList();
      props.fetchGiftcardList();
      props.fetchPrivatePassList();
    },
  fetchInstalmentPaymentItemInfo:
    (props: RouterProps & ConnectedProps<typeof connector>) =>
    (instalmentPaymentId: number) => {
      const instalmentPaymentDetailed = props.instalmentPaymentList?.find(
        (instalmentPayment) => instalmentPaymentId === instalmentPayment.id,
      );
      if (instalmentPaymentDetailed) {
        instalmentPaymentDetailed.payment_pack_list?.length &&
          props.fetchPaymentPackList({
            disabled: false,
            id__in: instalmentPaymentDetailed.payment_pack_list,
          });
        instalmentPaymentDetailed.payment_combo_list?.length &&
          props.fetchPaymentComboList({
            id__in: instalmentPaymentDetailed.payment_combo_list,
          });
        instalmentPaymentDetailed.giftcard_list?.length &&
          props.fetchGiftcardList({
            id__in: instalmentPaymentDetailed.giftcard_list,
          });

        instalmentPaymentDetailed.private_pass_list?.length &&
          props.fetchPrivatePassList({
            id__in: instalmentPaymentDetailed.private_pass_list,
          });
      }
    },
};

export default compose(
  withTranslation('instalmentPayment'),
  withTitle(({ t }: WithTranslation) => t('instalmentPayment:title')),
  withStyles(styles),
  routerParamsToProps({ instalmentPaymentId: 'instalmentPaymentId:number' }),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connector,
  withHandlers(mapWhithHandlers),
)(InstalmentPaymentConfigurationList);
