// @flow

import React from 'react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import DeleteIcon from '@material-ui/icons/Delete';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import EditIcon from '@material-ui/icons/Edit';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import LinkIcon from '@material-ui/icons/Link';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonBase from '@material-ui/core/ButtonBase';
import RedButton from '../../../components/button/RedButton.component';

import type { ShopItem } from '../types';

const ShopItemCard = (props: {
  shopitem: ShopItem,
  addToOrder: ?(id: number) => void,
  onEdit: ?(shopitem: ShopItem) => void,
  onDelete: ?() => void,
  t: TFunction,
  classes: Object,
  snackbarSuccess: (string) => void,
}) => {
  const { shopitem, t, snackbarSuccess, classes } = props;

  const renderLinkToPaymentPage = () => {
    return shopitem.id && shopitem.company ? (
      <ButtonBase
        className={classes.link}
        onClick={() => snackbarSuccess('shop:link.copied')}
      >
        <LinkIcon />
        <CopyToClipboard
          text={`${window.location.origin}/customer/payment/shop-item/${shopitem.id}/?membership=${shopitem.company}`}
        >
          <Typography className={classes.linkTypo}>
            {t('shop:link.copyLink')}
          </Typography>
        </CopyToClipboard>
      </ButtonBase>
    ) : (
      <CircularProgress />
    );
  };

  if (!props.shopitem) {
    return <div />;
  }
  return (
    <Card>
      {props.shopitem.cover ? (
        <CardMedia component="img" image={props.shopitem.cover} />
      ) : null}
      <CardContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Typography variant="h5" component="h3">
            {props.shopitem.name}
          </Typography>
          <Typography variant="h6" component="p" style={{ marginLeft: 28 }}>
            {`${props.shopitem.price}€`}
          </Typography>
        </div>
        <Typography variant="h6" component="h4">
          {props.shopitem.subtitle}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: 16 }}
        >
          {props.shopitem.description || props.t('shopitem.noDescription')}
        </Typography>
      </CardContent>
      {renderLinkToPaymentPage()}
      <CardActions>
        {props.addToOrder ? (
          <Button
            color="primary"
            onClick={() => props.addToOrder(props.shopitem.id)}
          >
            <AddShoppingCartIcon style={{ marginRight: 8 }} />
            {props.t('shopitem.action.addToCard')}
          </Button>
        ) : null}
        {props.onEdit ? (
          <Button color="primary" onClick={() => props.onEdit(props.shopitem)}>
            <EditIcon style={{ marginRight: 8 }} />
            {props.t('shopitem.action.edit')}
          </Button>
        ) : null}
        {props.onDelete ? (
          <RedButton onClick={props.onDelete}>
            <DeleteIcon style={{ marginRight: 8 }} />
            {props.t('shopitem.action.delete')}
          </RedButton>
        ) : null}
      </CardActions>
    </Card>
  );
};

const styles = (theme) => ({
  link: {
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    paddingLeft: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['shop']),
  withStyles(styles),
)(ShopItemCard);
