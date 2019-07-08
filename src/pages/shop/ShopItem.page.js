// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withDrawer from '../../hocs/with-drawer.hoc';

import ShopItemCard from '../../libs/shop/components/ShopItemCard.component';
import ShopItemForm from '../../libs/shop/components/ShopItemForm.component';
import ProvisionTable from '../../libs/shop/components/ProvisionTable.component';
import ProvisionSummary from '../../libs/shop/components/ProvisionSummary.component';
import ProvisionForm from '../../libs/shop/components/ProvisionForm.component';
import {
  fetchShopItem,
  createOrUpdateShopItem,
} from '../../libs/shop/actions/shopitem';
import {
  fetchProvisions,
  createOrUpdateProvision,
} from '../../libs/shop/actions/provision';
import shopSelectors from '../../libs/shop/selectors';
import type { ShopItem, Provision } from '../../libs/shop/types';

type Props = {
  id: number,
  fetchShopItem: (id: number) => void,
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

  t: TFunction,
  classes: Object,
};

type State = { editOpen: boolean, provisionFormOpen: boolean };

export class ShopItemDetail extends Component<Props, State> {
  state = {
    editOpen: false,
    provisionFormOpen: false,
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
            onEdit={this.openEditForm}
          />
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
        <Dialog open={this.state.editOpen}>
          <ShopItemForm
            initial={this.props.shopitem}
            onCancel={this.closeEditForm}
            createOrUpdate={this.createOrUpdateShopItem}
          />
        </Dialog>
        <Dialog open={this.state.provisionFormOpen}>
          <ProvisionForm
            onCancel={this.closeProvisionForm}
            onSubmit={this.createProvisionUpdate}
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
      fetchProvisions,
      createOrUpdateShopItem,
      createOrUpdateProvision,
    },
  ),
  withDrawer(({ shopitem }) => (shopitem ? shopitem.name : '')),
)(ShopItemDetail);
