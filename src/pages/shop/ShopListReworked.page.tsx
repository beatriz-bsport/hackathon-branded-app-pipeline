// @flow
//* BRUT COPY PAST WITHOUT TSX IMPLEMENTATION */
import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
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
import { withTranslation, TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import themeSelectors from '../../libs/theme/selectors';
import ShopItemDeleteDialog from '../../libs/shop/components/ShopItemDeleteDialog.component';
import {
  fetchShopItemAsManager as fetchAllShopItem,
  createOrUpdateShopItem,
  deleteItem as deleteShopItem,
  duplicateShopItem as duplicateShopItemAction,
  isShopItemUsedInCombo,
} from '../../libs/shop/actions/shopitem';
import {
  fetchAllSubShop,
  createOrUpdateSubShop,
  deleteSubShop,
} from '../../libs/shop/actions/subshop';
import { fetchTags } from '#libs/tag/actions';

import type {
  ShopItem,
  SubShop,
  ShopItemCreateEdit,
} from '../../libs/shop/types';
import SubShopList from './SubShopList.component';
import ShopItemListItem from '../../libs/shop/components/ShopItemListItem.component';
import ShopItemFormReworked from '../../libs/shop/components/ShopItemFormReworked';
import shopSelectors from '../../libs/shop/selectors';
import FuzeSearch from '../../components/FuzeSearch.component';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import withtitle from '../../hocs/with-title.hoc';
import Tooltip from '../../components/Tooltip.component';
import type { OptionCallback } from '../../state/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { mapFormDataWithObject } from '../form.utils';

import { SHOPITEM_FORMDATA_KEYS_MAPPER } from '../../libs/shop/constants';

type Props = {
  t: TFunction;
  classes: Object;
  subShops: Array<SubShop>;
  fetchSubShop: () => void;
  fetchShopItems: () => void;
  deleteItem: (id: number) => void;
  deleteSubShop: (id: number) => void;
  goToShopItem: (id: number) => void;
  createOrUpdateSubShop: (data: [*]) => void;
  duplicateShopItem: (id: number, suffix: string) => void;
  createOrUpdateShopItem: (
    shopItemData: [*],
    id: ?number,
    options: OptionCallback,
  ) => void;
  loading: boolean;
  shopItemLoading: boolean;
  isShopItemUsedInCombo: (id: number) => void;
  archivationWarning: { [id: number]: { used_in_combo: boolean } };
  theme: Theme;
  fetchTags: () => void;
};

type State = {
  newSubShopName: string | null;
  createItemFromSubShop: number | null;
  shopitemToDelete: ShopItem | null;
};

export class ShopListReworkedPage extends Component<Props, State> {
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
    this.props.fetchTags();
  }

  createOrUpdateShopItem = (
    shopItemData: ShopItemCreateEdit | FormData,
    id?: number | null,
    options?: OptionCallback<ShopItem>,
  ) => {
    let formData = new FormData();
    const { cover, ...finalShopItemData } = shopItemData;
    formData = mapFormDataWithObject(
      finalShopItemData,
      SHOPITEM_FORMDATA_KEYS_MAPPER,
      ['cover'],
    );
    if (shopItemData.cover) formData.append('cover', shopItemData.cover);
    formData.append('subshop', this.state.createItemFromSubShop);
    this.props.createOrUpdateShopItem(formData, id ?? null, {
      onSuccess: () => {
        this.setState({
          createItemFromSubShop: null,
        });
        this.props.fetchShopItems();
        if (options && options.onSuccess) options.onSuccess();
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

  openDeleteShopItemDialog = (shopItem: ShopItem) => {
    this.props.isShopItemUsedInCombo(shopItem.id);
    this.setState({ shopitemToDelete: shopItem });
  };

  renderSubShop = (subShop: SubShop) => {
    const { t } = this.props;

    return (
      <SubShopList
        key={subShop ? subShop.id : -1}
        createOrUpdateSubShop={this.props.createOrUpdateSubShop}
        onDelete={() => this.props.deleteSubShop(subShop.id)}
        subShop={subShop}
      >
        <Paper>
          <List dense disablePadding>
            {subShop.shopItems.map((si) => (
              <ShopItemListItem
                key={si.id}
                additionalActions={
                  <ListItemSecondaryAction>
                    <IconButton disableRipple>
                      {si.marketplace_enabled ? (
                        <Tooltip aria-label="info" title={t('languageToolTip')}>
                          <IconButton>
                            <LanguageIcon color="secondary" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          aria-label="info"
                          title={t('visibilityOfIconToolTip')}
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
                      onClick={() => this.openDeleteShopItemDialog(si)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                }
                onClick={() => this.props.goToShopItem(si.id)}
                shopitem={si}
              />
            ))}
            <ListItem
              button
              onClick={() =>
                this.setState({ createItemFromSubShop: subShop.id })
              }
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

  handleCloseShopItemForm = () =>
    this.setState({ createItemFromSubShop: null });

  renderNewSubShop = () => {
    const { t, classes } = this.props;
    const { newSubShopFormActive, newSubShopName } = this.state;
    if (newSubShopFormActive) {
      return (
        <form className={classes.title} onSubmit={this.createSubShop}>
          <Grid container alignItems="center" direction="row">
            <Grid item>
              <TextField
                autoFocus
                required
                onChange={this.handleSubShopNameChange}
                placeholder={t('form.shop.subShop.namePlaceholder')}
                value={newSubShopName}
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
          <Grid container alignItems="center" direction="row">
            <Grid item>
              <Typography
                className={this.props.classes.sectionTitle}
                variant="h5"
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
          changeSearch={this.changeSearch}
          clearSearch={this.clearSearch}
          items={subShops
            .map((subShop) => subShop.shopItems)
            .reduce(
              (shopItemList, shopItems) => shopItemList.concat(shopItems),
              [],
            )}
          placeholder={this.props.t('shop:search')}
          searchFields={['name', 'description']}
          searchResult={this.state.searchResult}
          searchText={this.state.searchText}
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
                key={si.id}
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
                      onClick={() => this.openDeleteShopItemDialog(si)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                }
                onClick={() => this.props.goToShopItem(si.id)}
                shopitem={si}
              />
            ))}
          </Collapse>
        </Paper>
        {subShops.map((ss) => this.renderSubShop(ss))}
        {this.renderNewSubShop()}
        <GenericResponsiveDrawer
          onClose={() => this.setState({ createItemFromSubShop: null })}
          open={!!this.state.createItemFromSubShop}
          title={this.props.t('shop:shopitem.form.title')}
          trackingObjectIdentifier={
            SegmentAnalyticsFormObjectIdentifier.ShopItem
          }
        >
          <ShopItemFormReworked
            isLoading={this.props.shopItemLoading}
            onCancel={this.handleCloseShopItemForm}
            onCreateSubmit={this.createOrUpdateShopItem}
            provincialTax={this.props.theme?.provincial_tax_value}
          />
        </GenericResponsiveDrawer>
        <Dialog open={!!this.state.shopitemToDelete}>
          <ShopItemDeleteDialog
            isUsedInCombo={
              this.props.archivationWarning[this.state.shopitemToDelete?.id]
                ?.used_in_combo || false
            }
            onCancel={() => this.setState({ shopitemToDelete: null })}
            onSubmit={() => {
              this.props.deleteItem(this.state.shopitemToDelete.id);
              this.setState({ shopitemToDelete: null });
            }}
            shopitem={this.state.shopitemToDelete}
          />
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
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
  withMobileDialog(),
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
      loading: state.shop.shopItem.asManager.loading,
      shopItemLoading: state.shop.shopItem.createOrUpdate.loading,
      subShops: shopSelectors.getSubShops(state),
      archivationWarning: state.shop.shopItem.combo.archivationWarning,
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
      isShopItemUsedInCombo,
      fetchTags,
    },
  ),
  withStyles(styles),
  withtitle(({ t }: { t: TFunction }) => t('titles:shop')),
  withHandlers({
    duplicateShopItem:
      ({ duplicateShopItem, fetchShopItems }) =>
      (id, suffix) => {
        duplicateShopItem(id, suffix, { onSuccess: () => fetchShopItems() });
      },
  }),
)(ShopListReworkedPage);
