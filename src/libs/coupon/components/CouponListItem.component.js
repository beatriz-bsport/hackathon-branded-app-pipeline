// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose, pure } from 'recompose';

import {
  VOUCHER_TYPE_PERCENT,
  VOUCHER_TYPE_AMOUNT,
} from '@bsport/common/lib/master-data/coupon';

import { withTranslation } from 'react-i18next';
import type { Coupon } from '../types';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  t: TFunction,
  coupon: Coupon,
  divider?: boolean,
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void,
  onClick?: () => void,
  classes: Object,
};

export const CouponListItem = (props: Props) => {
  const { coupon, classes, t } = props;
  let secondaryText = '';
  switch (coupon.voucher_type) {
    case VOUCHER_TYPE_PERCENT:
      secondaryText = `${coupon.percent_off}%`;
      break;
    case VOUCHER_TYPE_AMOUNT:
      secondaryText = `${getCurrencyDisplayWithPrice(coupon.amount_off)}`;
      break;
    default:
      break;
  }
  return (
    <ListItem
      divider={!!props.divider}
      button={!!props.onClick}
      onClick={props.onClick}
    >
      <ListItemText
        primary={`${coupon.name} (${coupon.nb_discounts})`}
        secondary={secondaryText}
      />
      <div className={classes.buttonContainer}>
        <ListItemResponsiveAction
          actions={[
            props.onEdit && {
              icon: EditIcon,
              label: t('common.edit'),
              color: 'primary',
              onClick: () => props.onEdit(coupon.id),
            },
            props.onDelete && {
              icon: DeleteIcon,
              label: t('common.delete'),
              onClick: () => props.onDelete(coupon.id),
            },
          ]}
        />
      </div>
    </ListItem>
  );
};

const styles = () => ({
  buttonContainer: {},
});

export default compose(
  withStyles(styles),
  withTranslation(),
  pure,
)(CouponListItem);
