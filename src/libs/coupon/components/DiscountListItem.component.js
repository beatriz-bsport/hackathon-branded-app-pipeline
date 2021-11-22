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
import type { Discount } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  discount: Discount,
  goToInvoice: (uuid: string) => void,
  goToBillingPlan: (id: number) => void,
  divider: ?boolean,
};

export const DiscountListItem = (props: Props) => {
  const { t } = useTranslation('member');
  return (
    <ListItem divider={!!props.divider}>
      <ListItemText
        primary={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{props.discount.name}</Typography>
            {props.discount?.memberArchived && (
              <Typography variant="caption" color="secondary">
                {`${'\u00A0'}(${t('archived')})`}
              </Typography>
            )}
          </div>
        }
        secondary={`${getCurrencyDisplayWithPrice(props.discount.voucher)}`}
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
            return null;
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default pure(DiscountListItem);
