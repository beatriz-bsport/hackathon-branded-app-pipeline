// @flow

import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import DialogContent from '@material-ui/core/DialogContent';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import List from '@material-ui/core/List';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import withStyles from '@material-ui/core/styles/withStyles';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonBase from '@material-ui/core/ButtonBase';

import AddIcon from '@material-ui/icons/Add';
import LanguageIcon from '@material-ui/icons/Language';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { push } from 'connected-react-router';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import ShopItemDeleteDialog from '../../libs/shop/components/ShopItemDeleteDialog.component';
import {
  fetchShopItemAsManager as fetchAllShopItem,
  createOrUpdateShopItem,
  deleteItem as deleteShopItem,
  duplicateShopItem as duplicateShopItemAction,
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
import FuzeSearch from '../../components/FuzeSearch.component';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import withtitle from '../../hocs/with-title.hoc';
import Tooltip from '../../components/Tooltip.component';

type Props = {
  t: TFunction,
  classes: Object,
  subShops: Array<SubShop>,
  fetchSubShop: () => void,
  fetchShopItems: () => void,
  deleteItem: (id: number) => void,
  deleteSubShop: (id: number) => void,
  goToShopItem: (id: number) => void,
  createOrUpdateSubShop: (data: [*]) => void,
  fullScreen: boolean,
  duplicateShopItem: (id: number, suffix: string) => void,
  createOrUpdateShopItem: (
    shopItemData: [*],
    id: ?number,
    options: OptionCallback,
  ) => void,
  loading: boolean,
};

type State = {
  newSubShopName: ?string,
  createItemFromSubShop: ?number,
  shopitemToDelete: ?ShopItem,
};

export class ShopItemList extends Component<Props, State> {
  state = {
    newSubShopName: null,
    createItemFromSubShop: null,
    shopitemToDelete: null,
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchSubShop();
    this.props.fetchShopItems();
  }

  createOrUpdateShopItem = (shopItemData: [*], id: ?number) => {
    shopItemData.append('subshop', this.state.createItemFromSubShop);
    this.props.createOrUpdateShopItem(shopItemData, id, {
      onSuccess: () => {
        this.setState({
          createItemFromSubShop: null,
        });
        this.props.fetchShopItems();
      },
    });
  };

  changeSearch = (fuse) => (ev) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  renderSubShop = (subShop: SubShop) => {
    const { t } = this.props;

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
                key={si.id}
                onClick={() => this.props.goToShopItem(si.id)}
                additionalActions={
                  <ListItemSecondaryAction>
                    <IconButton disableRipple>
                      {si.marketplace_enabled ? (
                        <Tooltip title={t('languageToolTip')} aria-label="info">
                          <IconButton>
                            <LanguageIcon color="secondary" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={t('visibilityOfIconToolTip')}
                          aria-label="info"
                        >
                          <IconButton>
                            <VisibilityOffIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </IconButton>
                    <Tooltip title={t('common.duplicate')}>
                      <IconButton
                        onClick={() =>
                          this.props.duplicateShopItem(
                            si.id,
                            t('common.copySuffix'),
                          )
                        }
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={() => this.setState({ shopitemToDelete: si })}
                    >
                      <DeleteIcon />
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
              <Typography
                variant="h5"
                className={this.props.classes.sectionTitle}
              >
                {`+ ${t('form.shop.subShop.nameTitle')}`}
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
      <div className={this.props.classes.container}>
        <FuzeSearch
          searchText={this.state.searchText}
          clearSearch={this.clearSearch}
          changeSearch={this.changeSearch}
          items={subShops
            .map((subShop) => subShop.shopItems)
            .reduce(
              (shopItemList, shopItems) => shopItemList.concat(shopItems),
              [],
            )}
          placeholder={this.props.t('shop:search')}
          searchFields={['name', 'description']}
          searchResult={this.state.searchResult}
        />

        <Paper
          className={
            this.state.searchResult.length > 0 && this.state.searchText !== ''
              ? this.props.classes.searchPaperDisplayed
              : this.props.classes.searchPaperHiden
          }
        >
          <Collapse
            in={
              this.state.searchResult.length > 0 && this.state.searchText !== ''
            }
          >
            {this.state.searchResult.map((si) => (
              <ShopItemListItem
                shopitem={si}
                key={si.id}
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
                    <IconButton
                      onClick={() => this.setState({ shopitemToDelete: si })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                }
              />
            ))}
          </Collapse>
        </Paper>
        {subShops.map((ss) => this.renderSubShop(ss))}
        {this.renderNewSubShop()}
        <Dialog
          open={!!this.state.createItemFromSubShop}
          fullScreen={this.props.fullScreen}
        >
          <DialogContent>
            <ShopItemForm
              createOrUpdate={this.createOrUpdateShopItem}
              onCancel={() => this.setState({ createItemFromSubShop: null })}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={!!this.state.shopitemToDelete}>
          <ShopItemDeleteDialog
            shopitem={this.state.shopitemToDelete}
            onCancel={() => this.setState({ shopitemToDelete: null })}
            onSubmit={() => {
              this.props.deleteItem(this.state.shopitemToDelete.id);
              this.setState({ shopitemToDelete: null });
            }}
          />
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
    boderBottom: '0px',
  },
  button: {
    marginTop: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
});

export default compose(
  withTranslation(),
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
      duplicateShopItem: duplicateShopItemAction,
      deleteItem: deleteShopItem,
      deleteSubShop,
      goToShopItem: (id: number) => push(`/shop/${id}`),
    },
  ),
  withMobileDialog(),
  withStyles(styles),
  withtitle(({ t }: { t: TFunction }) => t('titles:shop')),
  withHandlers({
    duplicateShopItem: ({ duplicateShopItem, fetchShopItems }) => (
      id,
      suffix,
    ) => {
      duplicateShopItem(id, suffix, { onSuccess: () => fetchShopItems() });
    },
  }),
)(ShopItemList);
