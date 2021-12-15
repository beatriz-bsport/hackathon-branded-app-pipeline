// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { pure } from 'recompose';

import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import type { Discount } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  discount: Discount,
  goToInvoice: (uuid: string) => void,
  goToBillingPlan: (id: number) => void,
  divider?: boolean,
};

export const DiscountListItem = (props: Props) => {
  const { t } = useTranslation('member');
  const classes = useStyles();
  return (
    <ListItem divider={!!props.divider}>
      <ListItemText
        primary={
          <div className={classes.flex}>
            <Typography>{props.discount.name}</Typography>
            {props.discount?.memberArchived && (
              <Typography variant="caption" color="secondary">
                {`${'\u00A0'}(${t('archived')})`}
              </Typography>
            )}
          </div>
        }
        secondary={
          <div className={classes.flex}>
            {getCurrencyDisplayWithPrice(props.discount.voucher)}
            {props.discount.reverted && (
              <Typography variant="caption" color="error">
                {`${'\u00A0'}(${t('coupon:reverted')})`}
              </Typography>
            )}
          </div>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() => {
            if (props.discount.invoice) {
              return props.goToInvoice(props.discount.invoice);
            }
            if (props.discount.billing_plan) {
              return props.goToBillingPlan(props.discount.billing_plan);
            }
            if (props.discount.source_invoice)
              return props.goToInvoice(props.discount.source_invoice);
            return null;
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default pure(DiscountListItem);
