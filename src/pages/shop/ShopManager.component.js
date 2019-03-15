// @flow

import React, { Component } from 'react';

import {
  Divider,
  TextField,
  IconButton,
  Typography,
  Grid,
  withStyles,
  ButtonBase,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { shop as shopActions } from '../../actions';

import SubShopList from './SubShopList.component';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { mapFormData } from '../form.utils';

import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  t: TFunction,
  classes: Object,
  shopItems: Array<ShopItem>,
  subShops: Array<SubShop>,
  fetchShop: () => void,
  deleteItem: (id: number) => void,
  onDeleteProvisionUpdate: ({
    provisionId: number,
    shopItemId: number,
  }) => void,
  updateProvisions: (nb: number, id: number) => void,
  deleteSubShop: (id: number) => void,
  createOrUpdateSubShop: (data: [*]) => void,
  createOrUpdateShopItem: (shopItemData: [*], id: ?number) => void,
  loading: boolean,
};

type State = {
  itemInEditMode: Array<number>,
  newSubShopName: ?string,
};

export class ShopItemList extends Component<Props, State> {
  state = {
    itemInEditMode: [],
    newSubShopName: null,
  };

  componentDidMount() {
    this.props.fetchShop();
  }

  createOrUpdateShopItem = (shopItemData: [*], id: ?number) => {
    if (id) {
      this.setState((prevState) => ({
        itemInEditMode: prevState.itemInEditMode.filter((id_) => id_ !== id),
      }));
    }
    const formData = mapFormData(shopItemData, {
      name: 'name',
      subtitle: 'subtitle',
      description: 'description',
      price: 'price',
      tva: 'tva',
      cover: 'cover',
      subshop: 'subshop',
    });
    if (id) {
      formData.append('id', id);
    }
    this.props.createOrUpdateShopItem(formData, id);
  };

  deleteProvisionUpdate = ({ provisionId, shopItemId }) => {
    this.props.onDeleteProvisionUpdate({ provisionId, shopItemId });
  };

  renderSubShop = (subShop: SubShop, shopItems: Array<ShopItem>) => {
    const { deleteItem, updateProvisions, deleteSubShop } = this.props;
    return (
      <SubShopList
        key={subShop ? subShop.id : -1}
        subShop={subShop}
        shopItems={shopItems.filter((si) => si.subshop === subShop.id)}
        updateProvisions={updateProvisions}
        deleteProvisionUpdate={this.deleteProvisionUpdate}
        deleteItem={deleteItem}
        createOrUpdateSubShop={this.props.createOrUpdateSubShop}
        createOrUpdateShopItem={this.props.createOrUpdateShopItem}
        onDelete={() => deleteSubShop(subShop.id)}
      />
    );
  };

  handleSubShopNameChange = (event) => {
    this.setState({ newSubShopName: event.target.value });
  };

  activateNewSubShopForm = () => {
    this.setState({ newSubShopFormActive: true });
  };

  createSubShop = (event) => {
    event.preventDefault();
    const { createOrUpdateSubShop } = this.props;
    const { newSubShopName } = this.state;
    this.setState({ newSubShopFormActive: false });
    createOrUpdateSubShop({ name: newSubShopName, id: null });
    this.setState({ newSubShopName: null });
  };

  renderNewSubShop = () => {
    const { t, classes } = this.props;
    const { newSubShopFormActive, newSubShopName } = this.state;
    if (newSubShopFormActive) {
      return (
        <form onSubmit={this.createSubShop} className={classes.title}>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <TextField
                required
                placeholder={t('form.shop.subShop.namePlaceholder')}
                value={newSubShopName}
                onChange={this.handleSubShopNameChange}
              />
            </Grid>
            <Grid item>
              <IconButton color="primary" type="submit">
                <SaveIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="secondary"
                onClick={() =>
                  this.setState({
                    newSubShopName: null,
                    newSubShopFormActive: false,
                  })
                }
              >
                <CancelIcon />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      );
    }
    return (
      <div className={classes.title}>
        <ButtonBase onClick={this.activateNewSubShopForm}>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <IconButton>
                <AddIcon size={60} />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="h4" color="disabled">
                {t('form.shop.subShop.nameTitle')}
              </Typography>
            </Grid>
          </Grid>
        </ButtonBase>
        <Divider />
      </div>
    );
  };

  render() {
    const { shopItems, loading, subShops } = this.props;
    return (
      <div>
        {loading ? (
          <LinearProgress />
        ) : (
          <React.Fragment>
            {subShops.map((ss) => this.renderSubShop(ss, shopItems))}
            {this.renderNewSubShop()}
          </React.Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.shop.loading,
    shopItems: state.shop.all,
    subShops: state.shop.subShops,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchShop() {
      dispatch(shopActions.fetchAll());
      dispatch(shopActions.fetchAllSubShop());
    },
    createOrUpdateShopItem(shopItemData, id) {
      dispatch(shopActions.createOrUpdateShopItem(shopItemData, id));
    },
    createOrUpdateSubShop({ name, id }) {
      dispatch(shopActions.createOrUpdateSubShop({ name, id }));
    },
    deleteItem(id) {
      dispatch(shopActions.deleteItem(id));
    },
    updateProvisions(nb, id) {
      dispatch(shopActions.updateProvisions(nb, id));
    },
    onDeleteProvisionUpdate({ provisionId, shopItemId }) {
      dispatch(shopActions.deleteProvision({ provisionId, shopItemId }));
    },
    deleteSubShop(id) {
      dispatch(shopActions.deleteSubShop(id));
    },
  };
}

const styles = (theme) => ({
  title: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 3,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withStyles(styles),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.shopManager')),
)(ShopItemList);
