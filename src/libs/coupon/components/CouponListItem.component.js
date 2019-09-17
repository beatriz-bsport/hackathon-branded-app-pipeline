// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose, pure } from 'recompose';

import {
  VOUCHER_TYPE_PERCENT,
  VOUCHER_TYPE_AMOUNT,
} from '@bsport/common/lib/master-data/coupon';

import type { Coupon } from '../types';

type Props = {
  coupon: Coupon,
  divider?: boolean,
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void,
  onClick?: () => void,

  classes: Object,
};

export const CouponListItem = (props: Props) => {
  const { coupon, classes } = props;
  let secondaryText = '';
  switch (coupon.voucher_type) {
    case VOUCHER_TYPE_PERCENT:
      secondaryText = `${coupon.percent_off}%`;
      break;
    case VOUCHER_TYPE_AMOUNT:
      secondaryText = `${coupon.amount_off}€`;
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
        {props.onEdit ? (
          <IconButton
            color="primary"
            onClick={(ev) => {
              ev.stopPropagation();
              props.onEdit(coupon.id);
            }}
          >
            <EditIcon />
          </IconButton>
        ) : null}
        {props.onDelete ? (
          <IconButton
            onClick={(ev) => {
              ev.stopPropagation();
              props.onDelete(coupon.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null}
      </div>
    </ListItem>
  );
};

const styles = () => ({
  buttonContainer: {},
});

export default compose(
  withStyles(styles),
  pure,
)(CouponListItem);
