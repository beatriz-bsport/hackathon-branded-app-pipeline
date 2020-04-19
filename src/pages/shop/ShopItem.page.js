// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import BarCode from 'react-barcode';
import Grid from '@material-ui/core/Grid';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push } from 'react-router-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';

import ShopItemCard from '../../libs/shop/components/ShopItemCard.component';
import ShopItemForm from '../../libs/shop/components/ShopItemForm.component';
import ShopItemDeleteDialog from '../../libs/shop/components/ShopItemDeleteDialog.component';
import ProvisionTable from '../../libs/shop/components/ProvisionTable.component';
import ProvisionSummary from '../../libs/shop/components/ProvisionSummary.component';
import ProvisionForm from '../../libs/shop/components/ProvisionForm.component';
import {
  fetchShopItem,
  createOrUpdateShopItem,
  deleteItem as deleteShopItem,
} from '../../libs/shop/actions/shopitem';
import { snackbarSuccess } from '../../actions/snackbar.actions';

import {
  fetchProvisions,
  createOrUpdateProvision,
} from '../../libs/shop/actions/provision';
import shopSelectors from '../../libs/shop/selectors';
import type { ShopItem, Provision } from '../../libs/shop/types';

type Props = {
  id: number,
  snackbarSuccess: (string) => void,
  fetchShopItem: (id: number) => void,
  fullScreen: boolean,
  fetchProvisions: (
    shopitemId: number,
    page: number,
    page_size: number,
  ) => void,
  createOrUpdateShopItem: (data: ShopItemData, id: ?string) => void,
  createOrUpdateProvision: (data: *) => void,
  shopitem: ?ShopItem,
  provision: {
    items: Array<Provision>,
    count: number,
    page: number,
    loading: boolean,
  },
  deleteShopItem: (number, () => void) => void,
  goToShopList: () => void,

  t: TFunction,
  classes: Object,
};

type State = { editOpen: boolean, provisionFormOpen: boolean };

export class ShopItemDetail extends Component<Props, State> {
  state = {
    editOpen: false,
    provisionFormOpen: false,
    deleteModalOpen: false,
  };

  componentDidMount() {
    this.props.fetchShopItem(this.props.id);
    this.props.fetchProvisions(this.props.id, 1, 10);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id && this.props.id) {
      this.props.fetchShopItem(this.props.id);
    }
  }

  closeEditForm = () => {
    this.setState({ editOpen: false });
  };

  openEditForm = () => {
    this.setState({ editOpen: true });
  };

  closeProvisionForm = () => {
    this.setState({ provisionFormOpen: false });
  };

  createOrUpdateShopItem = (data: *) => {
    this.closeEditForm();
    this.props.createOrUpdateShopItem(data, this.props.id);
  };

  createProvisionUpdate = (data: *) => {
    this.closeProvisionForm();
    this.props.createOrUpdateProvision(
      { ...data, shop_item: this.props.id },
      () => this.props.fetchShopItem(this.props.id),
    );
  };

  requestDelete = () => {
    this.setState({ deleteModalOpen: true });
  };

  closeDeleteModal = () => {
    this.setState({ deleteModalOpen: false });
  };

  deleteShopItem = () => {
    this.props.deleteShopItem(this.props.id, () => {
      this.closeDeleteModal();
      this.props.goToShopList();
    });
  };

  render() {
    return (
      <Grid container spacing={16} className={this.props.classes.container}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" component="h2">
            {this.props.t('shopitem.detail.title')}
          </Typography>
          <Divider className={this.props.classes.sectionDivider} />
          <ShopItemCard
            shopitem={this.props.shopitem}
            snackbarSuccess={this.props.snackbarSuccess}
            showPaymentLink
          />
          {this.props.shopitem.barcode ? (
            <div>
              <div className={this.props.classes.barcode}>
                <BarCode
                  value={this.props.shopitem.barcode}
                  background="#fafafa"
                />
              </div>
            </div>
          ) : null}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" component="h2">
            {this.props.t('shopitem.detail.parameters')}
          </Typography>
          <Divider className={this.props.classes.sectionDivider} />
          <div>
            <ProvisionSummary
              shopitem={this.props.shopitem}
              onProvisionUpdate={() =>
                this.setState({ provisionFormOpen: true })
              }
            />
          </div>
          <Typography variant="h5" component="h2">
            {this.props.t('shopitem.detail.provisionHistory')}
          </Typography>
          <Divider className={this.props.classes.sectionDivider} />
          <Paper>
            <ProvisionTable
              provisions={this.props.provision.items}
              loading={this.props.provision.loading}
              nbItems={this.props.provision.count}
              page={this.props.provision.page}
              itemPerPage={10}
              onPageRequested={(page) =>
                this.props.fetchProvisions(this.props.id, page, 10)
              }
            />
          </Paper>
        </Grid>
        <BottomActionsButton
          onEdit={this.openEditForm}
          onDelete={this.requestDelete}
        />
        <Dialog open={this.state.editOpen} fullScreen={this.props.fullScreen}>
          <DialogContent>
            <ShopItemForm
              initial={this.props.shopitem}
              onCancel={this.closeEditForm}
              createOrUpdate={this.createOrUpdateShopItem}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={this.state.provisionFormOpen}>
          <ProvisionForm
            onCancel={this.closeProvisionForm}
            onSubmit={this.createProvisionUpdate}
          />
        </Dialog>
        <Dialog open={this.state.deleteModalOpen}>
          <ShopItemDeleteDialog
            shopitem={this.props.shopitem}
            onCancel={this.closeDeleteModal}
            onSubmit={this.deleteShopItem}
          />
        </Dialog>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing.unit * 4,
  },
  sectionDivider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit,
  },
  barcode: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withStyles(styles),
  withNamespaces(['shop']),
  connect(
    (state, { id }) => ({
      shopitem: shopSelectors.getShopitem(state, id),
      provision: state.shop.provision,
    }),
    {
      fetchShopItem,
      snackbarSuccess,
      fetchProvisions,
      createOrUpdateShopItem,
      createOrUpdateProvision,
      deleteShopItem,
      goToShopList: () => push('/shop'),
    },
  ),
  withTitle(({ shopitem }) => (shopitem ? shopitem.name : '')),
  withMobileDialog(),
)(ShopItemDetail);
