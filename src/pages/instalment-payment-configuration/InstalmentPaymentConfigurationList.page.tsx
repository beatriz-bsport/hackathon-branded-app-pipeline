import React, { Component } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';

import { Info } from '@material-ui/icons';
import { Divider, Grid } from '@material-ui/core';
import { WithHandlerType } from '../../utils/types';
import {
  InstalmentPayment,
  InstalmentPaymentApi,
} from '#libs/instalment-payment-configuration/types';
import { RootState } from '../../reducers';
import withTitle from '#hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import InstalmentPaymentForm from '#libs/instalment-payment-configuration/components/InstalmentPaymentConfiguration.form';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { fetchPaymentPackList as fetchPaymentPackListAction } from '../../libs/payment-packs/actions';
import { fetchGiftcardList as fetchGiftcardListAction } from '#libs/giftcard/actions';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '../../libs/payment-combo/actions';
import { fetchShopItemAsManager as fetchShopItemAsManagerAction } from '../../libs/shop/actions/shopitem';
import { fetchPrivatePassList as fetchPrivatePassListAction } from '#libs/private-service/actions';
import { getEnabledPaymentPacks } from '#libs/payment-packs/selectors';
import { getPaymentComboList } from '../../libs/payment-combo/selectors';
import { getPrivatePassAvailable } from '#libs/private-service/selectors/private-pass';
import { getShopItemsAvailable } from '#libs/shop/selectors';
import { getGiftcardListActive } from '#libs/giftcard/selectors';
import {
  createOrUpdateInstalmentPayment as createOrUpdateInstalmentPaymentAction,
  disableInstalmentPayment as disableInstalmentPaymentAction,
  fetchInstalmentPayment as fetchInstalmentPaymentAction,
} from '#libs/instalment-payment-configuration/actions';
import {
  composeWithAllItems,
  getInstalmentPaymentList,
  retrieveInstalmentPayment,
} from '#libs/instalment-payment-configuration/selectors';
import InstalmentPaymentListComponent from '#libs/instalment-payment-configuration/components/InstalmentPaymentConfigurationList.component';
import BottomActionButtons from '#components/button/BottomActionsButton.component';
import InstalmentPaymentDetail from '#libs/instalment-payment-configuration/components/InstalmentPaymentConfigurationDetail.component';

type OwnProps = {
  title: string;
};
type State = {};

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

export class InstalmentPaymentList extends Component<Props, State> {
  componentDidMount() {
    this.props.fetchShopItemAsManager();

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
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setIsCreationFormOpen(true);
                      fetckAllItemInfo();
                    }}
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
                  selectedInstalmentPaymentId={instalmentPaymentId}
                  onClickOnItem={(id) => {
                    pushSelectedInstalmentPayment(id);
                  }}
                  onEdit={(id) => {
                    fetckAllItemInfo();
                    setInstalmentPaymentToEditId(id);
                  }}
                  instalmentPaymentList={instalmentPaymentList}
                  loading={instalmentPaymentLoading}
                  onDelete={(id) => {
                    disableInstalmentPayment(id);
                    if (id === instalmentPaymentId) {
                      pushInstalmentPaymentHome();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <div className={classes.detailContainer}>
                  <div>
                    <Typography variant="h5" className={classes.title}>
                      {t('detail.title')}
                    </Typography>
                    <Divider />
                  </div>
                  <InstalmentPaymentDetail
                    loading={instalmentPaymentLoading}
                    onEdit={(id) => {
                      fetckAllItemInfo();
                      setInstalmentPaymentToEditId(id);
                    }}
                    onDelete={(id) => {
                      disableInstalmentPayment(id);
                      pushInstalmentPaymentHome();
                    }}
                    instalmentPayment={instalmentPaymentDetailed}
                    instalmentPaymentId={instalmentPaymentId}
                    paymentPackList={paymentPackList}
                    comboList={comboList}
                    privatePassList={privatePassList}
                    shopItemList={shopItemList}
                    giftcardList={giftcardList}
                  />
                </div>
              </Grid>
            </Grid>
          )}
        </div>
        <GenericResponsiveDrawer
          open={isCreationFormOpen || !!instalmentPaymentToEditId}
          onClose={() => {
            setIsCreationFormOpen(false);
            setInstalmentPaymentToEditId(null);
          }}
          width="45%"
        >
          <InstalmentPaymentForm
            initial={instalmentPaymentToEdit}
            paymentPackList={paymentPackList}
            comboList={comboList}
            privatePassList={privatePassList}
            shopItemList={shopItemList}
            giftcardList={giftcardList}
            submit={(instalmentPayment, options) => {
              createOrUpdateInstalmentPayment(instalmentPayment, options);
            }}
            closeDialog={() => {
              setIsCreationFormOpen(false);
              setInstalmentPaymentToEditId(null);
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
    shopItemList: getShopItemsAvailable(state),
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
    fetchShopItemAsManager: fetchShopItemAsManagerAction,

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
      props.fetchPaymentPackList({ disabled: false });
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
)(InstalmentPaymentList);
