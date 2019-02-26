// @flow
import React, { Component } from 'react';

import {
  Divider,
  Grid,
  Typography,
  IconButton,
  Paper,
  TextField,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SaveIcon from '@material-ui/icons/Save';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import ShopItemCard from '../../components/shop/ShopItemCard.component';
import ShopItemForm from '../../components/form/ShopItemForm.component';
import RedButton from '../../components/button/RedButton.component';

const styles = (theme) => ({
  addIcon: {
    margin: theme.spacing.unit * 2,
    height: 64,
    width: 64,
  },
  title: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
  },
  divider: {
    marginBottom: theme.spacing.unit * 3,
  },
});

type Props = {
  t: TFunction,
  classes: Object,
  deleteItem: (id: number) => void,
  subShop: SubShop,
  createOrUpdateShopItem: (data: [*]) => void,
  createOrUpdateSubShop: (data: [*]) => void,
  onDelete: (id: number) => void,
  shopItems: Array<ShopItem>,
  updateProvisions: (qty: number, id: number) => void,
  deleteProvisionUpdate: ({ provisionId: number, shopItemId: number }) => void,
};

type State = {
  editMode: boolean,
  newItemFormDisplayed: boolean,
  itemInEditMode: Array<number>,
  newName: ?string,
};

export class SubShopList extends Component<Props, State> {
  state = {
    editMode: false,
    itemInEditMode: [],
    newItemFormDisplayed: false,
    newName: null,
  };

  putOnEditMode = (id: number) => {
    this.setState((prevState) => ({
      itemInEditMode: [id, ...prevState.itemInEditMode],
    }));
  };

  deleteItem = (id: number) => {
    this.props.deleteItem(id);
  };

  displayNewItemForm = () => {
    this.setState({
      newItemFormDisplayed: true,
    });
  };

  closeNewItemForm = () => {
    this.setState({ newItemFormDisplayed: false });
  };

  cancelEdit = (id: number) => {
    this.setState((prevState) => ({
      itemInEditMode: prevState.itemInEditMode.filter((id_) => id_ !== id),
    }));
  };

  createOrUpdateShopItem = (data: FormData, id: ?number) => {
    if (id) {
      this.setState((prevState) => ({
        itemInEditMode: prevState.itemInEditMode.filter((id_) => id_ !== id),
      }));
    } else {
      this.closeNewItemForm();
    }
    data.append('subshop', this.props.subShop.id);
    this.props.createOrUpdateShopItem(data, id);
  };

  handleChangeName = (event) => {
    this.setState({ newName: event.target.value });
  };

  toogleEditMode = () => {
    const { editMode } = this.state;
    const { subShop } = this.props;
    if (editMode) {
      this.setState({ editMode: false });
    } else {
      this.setState({ editMode: true, newName: subShop.name });
    }
  };

  showSubShopDeleteDialog = () => {
    this.setState({ showSubShopDeleteDialog: true });
  };

  updateSubShop = () => {
    this.props.createOrUpdateSubShop({
      name: this.state.newName,
      id: this.props.subShop.id,
    });
    this.setState({ editMode: false });
  };

  renderTitle = () => {
    const { classes, subShop } = this.props;
    const { editMode, newName } = this.state;
    if (editMode) {
      return (
        <Grid container direction="row" spacing={8} alignItems="center">
          <Grid item>
            <TextField onChange={this.handleChangeName} value={newName} />;
          </Grid>
          <Grid item>
            <IconButton onClick={this.updateSubShop}>
              <SaveIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={this.toogleEditMode}>
              <CancelIcon />
            </IconButton>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.title} variant="h4">
            {subShop.name}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16}>
            <Grid item>
              <IconButton onClick={this.toogleEditMode}>
                <EditIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={this.showSubShopDeleteDialog}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderSubShopDeleteDialog = () => {
    const { showSubShopDeleteDialog } = this.state;
    const { t } = this.props;
    if (showSubShopDeleteDialog) {
      return (
        <Dialog
          open={showSubShopDeleteDialog}
          onClose={() => this.setState({ showSubShopDeleteDialog: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t('shop.subShop.delete.title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('shop.subShop.delete.explain')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ showSubShopDeleteDialog: false })}
              color="secondary"
            >
              {t('common.cancel')}
            </Button>
            <RedButton onClick={this.props.onDelete} color="primary" autoFocus>
              {t('common.confirm')}
            </RedButton>
          </DialogActions>
        </Dialog>
      );
    }
    return null;
  };

  render() {
    const { shopItems, classes, updateProvisions } = this.props;
    const { itemInEditMode, newItemFormDisplayed } = this.state;
    return (
      <div>
        {this.renderTitle()}
        <Divider className={classes.divider} />
        <Grid container direction="row" spacing={16}>
          {shopItems.map((shopItem) => (
            <Grid item xs={12} md={4} key={shopItem.id}>
              {~itemInEditMode.indexOf(shopItem.id) ? ( //eslint-disable-line
                <ShopItemForm
                  initial={shopItem}
                  createOrUpdate={this.createOrUpdateShopItem}
                  onCancel={() => this.cancelEdit(shopItem.id)}
                />
              ) : (
                <ShopItemCard
                  onEdit={() => this.putOnEditMode(shopItem.id)}
                  item={shopItem}
                  onDelete={() => this.deleteItem(shopItem.id)}
                  deleteProvisionUpdate={(provisionId) =>
                    this.props.deleteProvisionUpdate({
                      provisionId,
                      shopItemId: shopItem.id,
                    })
                  }
                  onUpdateProvisions={(qty) =>
                    updateProvisions(qty, shopItem.id)
                  }
                />
              )}
            </Grid>
          ))}
          {newItemFormDisplayed ? (
            <Grid item xs={12} md={4}>
              <ShopItemForm
                createOrUpdate={this.createOrUpdateShopItem}
                onCancel={this.closeNewItemForm}
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={2}>
              <Paper>
                <Grid container item alignItems="center" justify="center">
                  <IconButton onClick={this.displayNewItemForm}>
                    <AddCircleOutlineIcon className={classes.addIcon} />
                  </IconButton>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
        {this.renderSubShopDeleteDialog()}
      </div>
    );
  }
}

export default withStyles(styles)(withNamespaces()(SubShopList));
