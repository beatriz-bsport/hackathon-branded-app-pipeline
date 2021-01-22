// @flow
import React from 'react';

import { colors } from '@bsport/common/lib/colors';

import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import StoreIcon from '@material-ui/icons/Store';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import LanguageIcon from '@material-ui/icons/Language';
import Typography from '@material-ui/core/Typography';
import { getCurrencyDisplay } from '../../theme/selectors';

import type { ShopItem } from '../types';

type Props = {
  classes: Object,
  t: TFunction,
  shopitem: ShopItem,
  onProvisionUpdate: () => void,
};

const ProvisionSummary = (props: Props) => (
  <div className={props.classes.container}>
    <div className={props.classes.line}>
      <Typography inline color="secondary" variant="subtitle2" component="h3">
        {props.t('provision.total_sales')}
      </Typography>
      <Typography inline color="primary" variant="h6" component="h3">
        {props.shopitem.total_sales}
      </Typography>
    </div>
    <div className={props.classes.line}>
      <Typography inline color="secondary" variant="subtitle2" component="h3">
        {props.t('provision.current_stock')}
      </Typography>
      <Typography
        inline
        color={props.shopitem.current_stock > 0 ? 'primary' : 'error'}
        variant="h6"
        component="h3"
      >
        {props.shopitem.current_stock}
      </Typography>
    </div>
    <div className={props.classes.line}>
      <Typography inline color="secondary" variant="subtitle2" component="h3">
        {props.t('shopitem.detail.supplier_price')}
      </Typography>
      <Typography inline variant="h6" component="h3">
        {`${props.shopitem.supplier_price} ${getCurrencyDisplay()}`}
      </Typography>
    </div>
    <div className={props.classes.line}>
      <Typography inline color="secondary" variant="subtitle2" component="h3">
        {props.t('shopitem.detail.onsite_payment_available')}
      </Typography>
      <Typography inline variant="h6" component="h3">
        {props.shopitem.onsite_payment_available
          ? props.t('shopitem.detail.enabled')
          : props.t('shopitem.detail.disabled')}
      </Typography>
    </div>
    <div className={props.classes.line}>
      <Typography inline color="secondary" variant="subtitle2" component="h3">
        {props.t('shopitem.detail.is_deliverable')}
      </Typography>
      <Typography inline variant="h6" component="h3">
        {props.t(
          props.shopitem.is_deliverable
            ? 'shopitem.detail.enabled'
            : 'shopitem.detail.disabled',
        )}
      </Typography>
    </div>
    <div className={props.classes.line}>
      <Typography inline color="secondary" variant="subtitle2" component="h3">
        {props.t('shopitem.detail.marketplace_enabled')}
      </Typography>
      <Typography
        inline
        variant="h6"
        component="h3"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {props.shopitem.marketplace_enabled ? (
          <React.Fragment>
            <LanguageIcon className={props.classes.iconLeft} />{' '}
            {props.t('shopitem.detail.enabled')}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <VisibilityOffIcon className={props.classes.iconLeft} />{' '}
            {props.t('shopitem.detail.disabled')}
          </React.Fragment>
        )}
      </Typography>
    </div>
    <div className={props.classes.actionButtonContainer}>
      <Button
        variant="contained"
        color="secondary"
        onClick={props.onProvisionUpdate}
      >
        <StoreIcon className={props.classes.iconLeft} />
        {props.t('provision.action.update')}
      </Button>
    </div>
  </div>
);

const styles = (theme) => ({
  container: {
    border: `1px solid ${colors.secondary}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  line: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionButtonContainer: {
    display: 'flex',
    marginTop: theme.spacing(2),
    justifyContent: 'flex-end',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['shop']),
  withStyles(styles),
)(ProvisionSummary);
