// @flow

import React from 'react';

import { withState, compose } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { withTranslation, TFunction } from 'react-i18next';

import type { SubShop, ShopItem } from '../../shop/types';
import ShopItemCard from '../../shop/components/ShopItemCard.component';
import ShopItemListCard from '../../shop/components/ShopItemListCard.component';

const SubShopComponent = (props: {
  subshop: SubShop,
  addToOrder: (id: number) => void,
  expanded: boolean,
  toggleExpanded: () => void,
  selectShopItem: (s: ShopItemType) => void,
}) => {
  return (
    <div
      style={{
        marginTop: 24,
        marginBottom: 60,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Typography inline variant="h5">
          {`${props.subshop.name} (${props.subshop.shopItems.length})`}
        </Typography>
        <IconButton onClick={props.toggleExpanded}>
          {props.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      <Collapse in={props.expanded}>
        <Grid alignItems="stretch" spacing={4} container direction="row">
          {props.subshop.shopItems.map((si) => (
            <Grid key={si.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
              <ShopItemListCard
                shopitem={si}
                onClick={() => props.selectShopItem(si)}
                addToOrder={props.addToOrder}
              />
            </Grid>
          ))}
        </Grid>
      </Collapse>
      {props.expanded ? null : <Divider />}
    </div>
  );
};

type Props = {
  subShops: Array<SubShop>,
  selectedShopItem: ?ShopItem,
  notExpandedSubshop: Array<number>,

  setNotExpandedSubshop: (subshops: Array<number>) => void,
  selectShopItem: (shopitem: ?ShopItem) => void,
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
              toggleExpanded={() => {
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
  subShopListContainer: {
    left: 0,
    width: '100%',
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
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
