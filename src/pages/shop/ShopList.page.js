// @flow

import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';

import AddIcon from '@material-ui/icons/Add';
import LanguageIcon from '@material-ui/icons/Language';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { push } from 'react-router-redux';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  fetchAll as fetchAllShopItem,
  createOrUpdateShopItem,
  deleteItem as deleteShopItem,
} from '../../libs/shop/actions/shopitem';
import {
  fetchAllSubShop,
  createOrUpdateSubShop,
  deleteSubShop,
} from '../../libs/shop/actions/subshop';
import ShopItemForm from '../../libs/shop/components/ShopItemForm.component';

import type { SubShop } from '../../libs/shop/types';
import SubShopList from './SubShopList.component';
import ShopItemListItem from '../../libs/shop/components/ShopItemListItem.component';
import shopSelectors from '../../libs/shop/selectors';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  t: TFunction,
  classes: Object,
  subShops: Array<SubShop>,
  fetchSubShop: () => void,
  fetchShopItems: () => void,
  // deleteItem: (id: number) => void,
  deleteSubShop: (id: number) => void,
  goToShopItem: (id: number) => void,
  createOrUpdateSubShop: (data: [*]) => void,
  createOrUpdateShopItem: (shopItemData: [*], id: ?number) => void,
  loading: boolean,
};

type State = {
  newSubShopName: ?string,
  createItemFromSubShop: ?number,
};

export class ShopItemList extends Component<Props, State> {
  state = {
    newSubShopName: null,
    createItemFromSubShop: null,
  };

  componentDidMount() {
    this.props.fetchSubShop();
    this.props.fetchShopItems();
  }

  createOrUpdateShopItem = (shopItemData: [*], id: ?number) => {
    shopItemData.append('subshop', this.state.createItemFromSubShop);
    this.props.createOrUpdateShopItem(shopItemData, id);
    this.setState({
      createItemFromSubShop: null,
    });
  };

  renderSubShop = (subShop: SubShop) => {
    return (
      <SubShopList
        key={subShop ? subShop.id : -1}
        subShop={subShop}
        createOrUpdateSubShop={this.props.createOrUpdateSubShop}
        onDelete={() => this.props.deleteSubShop(subShop.id)}
      >
        <Paper>
          <List dense disablePadding>
            {subShop.shopItems.map((si) => (
              <ShopItemListItem
                shopitem={si}
                onClick={() => this.props.goToShopItem(si.id)}
                additionalActions={
                  <ListItemSecondaryAction>
                    <IconButton disableRipple>
                      {si.marketplace_enabled ? (
                        <LanguageIcon color="secondary" />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </ListItemSecondaryAction>
                }
              />
            ))}
            <ListItem
              onClick={() =>
                this.setState({ createItemFromSubShop: subShop.id })
              }
              button
            >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={this.props.t('form.shop.item.create')} />
            </ListItem>
          </List>
        </Paper>
      </SubShopList>
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
    const { newSubShopName } = this.state;
    this.setState({ newSubShopFormActive: false });
    this.props.createOrUpdateSubShop({ name: newSubShopName, id: null });
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
                autoFocus
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
    const { loading, subShops } = this.props;
    if (loading) {
      return <LinearProgress />;
    }
    return (
      <div>
        {subShops.map((ss) => this.renderSubShop(ss))}
        {this.renderNewSubShop()}
        <Dialog open={!!this.state.createItemFromSubShop}>
          <ShopItemForm
            createOrUpdate={this.createOrUpdateShopItem}
            onCancel={() => this.setState({ createItemFromSubShop: null })}
          />
        </Dialog>
      </div>
    );
  }
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
    (state) => ({
      loading: state.shop.loading,
      subShops: shopSelectors.getSubShops(state),
    }),
    {
      fetchShopItems: fetchAllShopItem,
      fetchSubShop: fetchAllSubShop,
      createOrUpdateShopItem,
      createOrUpdateSubShop,
      deleteItem: deleteShopItem,
      deleteSubShop,
      goToShopItem: (id: number) => push(`/shop/${id}`),
    },
  ),
  withStyles(styles),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.shopManager')),
)(ShopItemList);
