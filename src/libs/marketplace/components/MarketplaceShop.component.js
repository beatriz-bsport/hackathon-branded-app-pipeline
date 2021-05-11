// @flow

import React from 'react';

import { withState, compose } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Typography from '@material-ui/core/Typography';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { SubShop, ShopItem } from '../../shop/types';
import ShopItemCard from '../../shop/components/ShopItemCard.component';
import ShopItemListItem from '../../shop/components/ShopItemListItem.component';
import Analytics from '../../../components/analytics/Analytics.component';

const SubShopComponent = (props: {
  subshop: SubShop,
  addToOrder: (id: number) => void,
  expanded: boolean,
  toogleExpanded: () => void,
  selectShopItem: (ShopItem) => void,
}) => {
  return (
    <div
      style={{
        marginTop: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Typography inline variant="h5" component="h2">
            {`${props.subshop.name}`}
          </Typography>
          <Typography inline variant="body1" style={{ marginLeft: 8 }}>
            {`(${props.subshop.shopItems.length})`}
          </Typography>
        </div>
        <IconButton onClick={props.toogleExpanded}>
          {props.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      <Collapse in={props.expanded}>
        <Paper>
          <List disablePadding dense>
            {props.subshop.shopItems.map((si) => (
              <ShopItemListItem
                shopitem={si}
                key={si.id}
                onClick={() => props.selectShopItem(si)}
                additionalActions={
                  <React.Fragment>
                    <IconButton disableRipple style={{ marginRight: 32 }}>
                      <VisibilityIcon />
                    </IconButton>
                    <ListItemSecondaryAction>
                      <IconButton
                        color="primary"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          props.addToOrder(si.id);
                          Analytics.addShopItemToCart(si);
                        }}
                      >
                        <AddShoppingCartIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </React.Fragment>
                }
              />
            ))}
          </List>
        </Paper>
      </Collapse>
      {props.expanded ? null : <Divider />}
    </div>
  );
};

type Props = {
  subShops: Array<SubShop>,
  selectedShopItem: ?ShopItem,
  notExpandedSubshop: Array<number>,

  setNotExpandedSubshop: (Array<number>) => void,
  selectShopItem: (?ShopItem) => void,
  addToOrder: (id: number) => void,

  t: TFunction,
  classes: Object,
};

export function MarketplaceShop(props: Props) {
  if (props.subShops.length === 0) {
    return (
      <div className={props.classes.container}>
        <Typography
          color="textSecondary"
          variantl="caption"
          className={props.classes.emptyText}
        >
          {props.t('marketplace.shop.isEmpty')}
        </Typography>
      </div>
    );
  }
  return (
    <div className={props.classes.container}>
      <div className={props.classes.subShopListContainer}>
        {props.subShops
          .filter((sub) => sub.shopitems.length !== 0)
          .map((sub) => (
            <SubShopComponent
              key={sub.id}
              subshop={sub}
              expanded={!props.notExpandedSubshop.includes(sub.id)}
              toogleExpanded={() => {
                if (props.notExpandedSubshop.includes(sub.id)) {
                  props.setNotExpandedSubshop(
                    props.notExpandedSubshop.filter((id) => id !== sub.id),
                  );
                } else {
                  props.setNotExpandedSubshop([
                    ...props.notExpandedSubshop,
                    sub.id,
                  ]);
                }
              }}
              classes={props.classes}
              addToOrder={props.addToOrder}
              selectShopItem={props.selectShopItem}
            />
          ))}
        <Dialog
          open={!!props.selectedShopItem}
          onClose={() => props.selectShopItem(null)}
        >
          <div style={{ scroll: 'auto' }}>
            <ShopItemCard
              shopitem={props.selectedShopItem}
              t={props.t}
              addToOrder={(id: number) => {
                props.selectShopItem(null);
                props.addToOrder(id);
              }}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  },
  shopitemCard: {
    width: '80%',
    position: 'fixed',
  },
  shopitemCardContainer: {
    right: 0,
    width: '50%',
    padding: theme.spacing(4),
  },
  subheader: {
    backgroundColor: theme.palette.background.default,
  },
  subShopListContainer: {
    left: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
  },
  emptyText: {
    padding: theme.spacing(5),
  },
});

export default compose(
  withTranslation(),
  withStyles(styles),
  withState('selectedShopItem', 'selectShopItem', null),
  withState('notExpandedSubshop', 'setNotExpandedSubshop', []),
)(MarketplaceShop);
