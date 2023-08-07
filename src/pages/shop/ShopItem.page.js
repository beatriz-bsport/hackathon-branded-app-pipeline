// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import BarCode from 'react-barcode';
import Grid from '@material-ui/core/Grid';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import { push } from 'connected-react-router';

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
  isShopItemUsedInCombo,
} from '../../libs/shop/actions/shopitem';
import { snackbarSuccess } from '../../libs/snackbar/actions';
import { OptionCallback } from '../../state/types';

import {
  fetchProvisions,
  createOrUpdateProvision,
} from '../../libs/shop/actions/provision';
import shopSelectors from '../../libs/shop/selectors';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import { fetchTags } from '#libs/tag/actions';
import type { ShopItem, Provision } from '../../libs/shop/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import themeSelectors from '../../libs/theme/selectors';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { SHOPITEM_PER_PAGE } from '#libs/shop/constants';

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
  deleteShopItem: (number, callback: () => void) => void,
  goToShopList: () => void,
  theme: Theme,
  t: TFunction,
  classes: Object,
  isShopItemUsedInCombo: (id: number) => void,
  archivationWarning: { [id: number]: { used_in_combo: boolean } },
  allTagsWithTagGroup: Array<Tag<TagGroup>>,
  fetchTags: () => void,
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
    this.props.fetchProvisions(this.props.id, 1, SHOPITEM_PER_PAGE);
    this.props.fetchTags();
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

  createOrUpdateShopItem = (data: *, id: number, callback: OptionCallback) => {
    this.closeEditForm();
    this.props.createOrUpdateShopItem(data, this.props.id, callback);
  };

  createProvisionUpdate = (data: *) => {
    this.closeProvisionForm();
    this.props.createOrUpdateProvision(
      { ...data, shop_item: this.props.id },
      () => this.props.fetchShopItem(this.props.id),
    );
  };

  requestDelete = () => {
    this.props.isShopItemUsedInCombo(this.props.shopitem.id);
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

  handleRequestProvisionPage = (page: number) =>
    this.props.fetchProvisions(this.props.id, page, SHOPITEM_PER_PAGE);

  render() {
    return (
      <Grid container className={this.props.classes.container} spacing={2}>
        <Grid item sm={6} xs={12}>
          <Typography component="h2" variant="h5">
            {this.props.t('shopitem.detail.title')}
          </Typography>
          <Divider className={this.props.classes.sectionDivider} />
          <ShopItemCard
            showPaymentLink
            shopitem={this.props.shopitem}
            snackbarSuccess={this.props.snackbarSuccess}
          />
          {this.props.shopitem.barcode ? (
            <div>
              <div className={this.props.classes.barcode}>
                <BarCode
                  background="#fafafa"
                  value={this.props.shopitem.barcode}
                />
              </div>
            </div>
          ) : null}
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography component="h2" variant="h5">
            {this.props.t('shopitem.detail.parameters')}
          </Typography>
          <Divider className={this.props.classes.sectionDivider} />
          <div>
            <ProvisionSummary
              onProvisionUpdate={() =>
                this.setState({ provisionFormOpen: true })
              }
              shopitem={this.props.shopitem}
            />
          </div>
          <Typography component="h2" variant="h5">
            {this.props.t('shopitem.detail.provisionHistory')}
          </Typography>
          <Divider className={this.props.classes.sectionDivider} />
          <Paper>
            <ProvisionTable
              itemPerPage={SHOPITEM_PER_PAGE}
              loading={this.props.provision.loading}
              nbItems={this.props.provision.count}
              onPageRequested={this.handleRequestProvisionPage}
              page={this.props.provision.page}
              provisions={this.props.provision.items}
            />
          </Paper>
        </Grid>
        <BottomActionsButton
          onDelete={this.requestDelete}
          onEdit={this.openEditForm}
        />
        <GenericResponsiveDrawer
          fullScreen={this.props.fullScreen}
          onClose={this.closeEditForm}
          open={this.state.editOpen}
          subtitle={this.props.shopitem?.name}
          title={this.props.t('shop:shopitem.form.title')}
          trackingObjectId={this.props.shopitem?.id}
          trackingObjectIdentifier={
            SegmentAnalyticsFormObjectIdentifier.ShopItem
          }
        >
          <ShopItemForm
            createOrUpdate={this.createOrUpdateShopItem}
            initial={this.props.shopitem}
            onCancel={this.closeEditForm}
            provincialTax={this.props.theme?.provincial_tax_value}
            tagList={this.props.allTagsWithTagGroup}
          />
        </GenericResponsiveDrawer>
        <Dialog open={this.state.provisionFormOpen}>
          <ProvisionForm
            onCancel={this.closeProvisionForm}
            onSubmit={this.createProvisionUpdate}
          />
        </Dialog>
        <Dialog open={this.state.deleteModalOpen}>
          <ShopItemDeleteDialog
            isUsedInCombo={
              this.props.archivationWarning[this.props.shopitem?.id]
                ?.used_in_combo || false
            }
            onCancel={this.closeDeleteModal}
            onSubmit={this.deleteShopItem}
            shopitem={this.props.shopitem}
          />
        </Dialog>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(4),
  },
  sectionDivider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  barcode: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withStyles(styles),
  withTranslation(['shop']),
  withMobileDialog(),
  connect(
    (state, { id }) => ({
      theme: themeSelectors.getTheme(state),
      shopitem: shopSelectors.getShopitem(state, id),
      provision: state.shop.provision,
      archivationWarning: state.shop.shopItem.combo.archivationWarning,
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    }),
    {
      fetchShopItem,
      snackbarSuccess,
      fetchProvisions,
      createOrUpdateShopItem,
      createOrUpdateProvision,
      deleteShopItem,
      goToShopList: () => push('/shop'),
      isShopItemUsedInCombo,
      fetchTags,
    },
  ),
  withTitle(({ shopitem }) => (shopitem ? shopitem.name : '')),
)(ShopItemDetail);
