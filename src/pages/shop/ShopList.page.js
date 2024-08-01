// @flow

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

import type { OptionPropsWithData } from '../../libs/fuzzy-search/types';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { fetchTags } from '#src/libs/tag/actions';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';

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
import ShopItemForm from '../../libs/shop/components/ShopItemForm.component';

import type { ShopItem, SubShop } from '../../libs/shop/types';
import SubShopList from './SubShopList.component';
import ShopItemListItem from '../../libs/shop/components/ShopItemListItem.component';
import shopSelectors from '../../libs/shop/selectors';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import withtitle from '#src/hocs/with-title.hoc';
import Tooltip from '../../components/Tooltip.component';
import type { OptionCallback } from '../../state/types';
import type { BookkeepingAccount } from '../../libs/payment/types';
import { fetchBookkeepingAccountList } from '../../libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '../../libs/payment/selectors';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '../../libs/payment/constants';
import { FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_OLD_WEBSHOP } from '../../libs/shop/components/ShopListTabs/constants';
import ObjectSearchComponent from '../../libs/fuzzy-search/components/ObjectSearch.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

type ShopItemOption = {
  label: string,
  onClick: (id: number) => void,
  additionalActions: any,
  shopitem: ShopItem,
  value: number,
};

const Option: React.FC<OptionPropsWithData<ShopItemOption>> = (props) => (
  <ShopItemListItem divider {...props.data} />
);

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
  duplicateShopItem: (id: number, suffix: string) => void,
  createOrUpdateShopItem: (
    shopItemData: [*],
    id: ?number,
    options: OptionCallback,
  ) => void,
  loading: boolean,
  shopItemLoading: boolean,
  isShopItemUsedInCombo: (id: number) => void,
  archivationWarning: { [id: number]: { used_in_combo: boolean } },
  theme: Theme,
  allTagsWithTagGroup: Array<Tag<TagGroup>>,
  fetchTags: () => void,
  bookkeepingAccounts: BookkeepingAccount[],
  bookkeepingAccountById: Record<number, BookkeepingAccount>,
  fetchBookkeepingAccountList: () => void,
} & WithObjectSearch;

type State = {
  newSubShopName: string | null,
  createItemFromSubShop: number | null,
  shopitemToDelete: ShopItem | null,
};

export class ShopItemList extends Component<Props, State> {
  state = {
    newSubShopName: null,
    createItemFromSubShop: null,
    shopitemToDelete: null,
  };

  componentDidMount() {
    this.props.fetchSubShop();
    this.props.fetchShopItems();
    this.props.fetchTags();
    if (IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED) {
      this.props.fetchBookkeepingAccountList();
    }
  }

  createOrUpdateShopItem = (
    shopItemData: [*],
    id: ?number,
    options: OptionCallback,
  ) => {
    shopItemData.append('subshop', this.state.createItemFromSubShop);
    this.props.createOrUpdateShopItem(shopItemData, id ?? null, {
      onSuccess: () => {
        this.props.refreshOptions(
          'shop_item',
          FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_OLD_WEBSHOP,
        );
        this.setState({
          createItemFromSubShop: null,
        });
        this.props.fetchShopItems();
        if (options && options.onSuccess) options.onSuccess();
      },
    });
  };

  shopItemOptionsFormatter = (shopItems: ShopItem[]): ShopItemOption[] =>
    shopItems.map((shopItem) => {
      return {
        label: shopItem.name,
        onClick: () => this.props.goToShopItem(shopItem.id),
        shopitem: shopItem,
        value: shopItem.id,
        additionalActions: (
          <ListItemSecondaryAction>
            <IconButton disableRipple>
              {shopItem.marketplace_enabled ? (
                <LanguageIcon color="secondary" />
              ) : (
                <VisibilityOffIcon />
              )}
            </IconButton>
            <IconButton onClick={() => this.openDeleteShopItemDialog(shopItem)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ),
      };
    });

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
        <ObjectSearchComponent
          additionalParams={FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_OLD_WEBSHOP}
          components={{
            Option,
          }}
          optionsFormatter={this.shopItemOptionsFormatter}
          placeholder={this.props.t('shop:search')}
          searchedObjectType="shop_item"
          variant="underlined"
        />
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
          <ShopItemForm
            bookkeepingAccountById={this.props.bookkeepingAccountById}
            bookkeepingAccounts={this.props.bookkeepingAccounts}
            createOrUpdate={this.createOrUpdateShopItem}
            loading={this.props.shopItemLoading}
            onCancel={this.handleCloseShopItemForm}
            provincialTax={this.props.theme?.provincial_tax_value}
            tagList={this.props.allTagsWithTagGroup}
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
              this.props.deleteItem(this.state.shopitemToDelete.id, () =>
                this.props.refreshOptions(
                  'shop_item',
                  FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_OLD_WEBSHOP,
                ),
              );
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
  withObjectSearch,
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
      loading: state.shop.shopItem.asManager.loading,
      shopItemLoading: state.shop.shopItem.createOrUpdate.loading,
      subShops: shopSelectors.getSubShops(state),
      archivationWarning: state.shop.shopItem.combo.archivationWarning,
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
      bookkeepingAccounts: getBookkeepingAccountList(state),
      bookkeepingAccountById: getBookkeepingAccountById(state),
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
      fetchBookkeepingAccountListAction: fetchBookkeepingAccountList,
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
    fetchBookkeepingAccountList:
      ({ fetchBookkeepingAccountListAction }) =>
      () =>
        fetchBookkeepingAccountListAction({ is_active: true }),
  }),
)(ShopItemList);
