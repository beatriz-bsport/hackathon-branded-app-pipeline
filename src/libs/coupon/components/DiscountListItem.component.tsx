import React, { useCallback } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { FranchiseCompany } from '#src/libs/franchise/types';
import CompanyChip from '../../../components/franchise/CompanyChip.component';
import type { Discount } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  discount: Discount;
  disabled?: boolean;
  goToInvoice?: (uuid: string) => void;
  goToBillingPlan: (id: number) => void;
  divider?: boolean;
  company?: FranchiseCompany;
};

export const DiscountListItem: React.FC<Props> = ({
  discount,
  disabled,
  goToInvoice,
  goToBillingPlan,
  divider,
  company,
}) => {
  const { t } = useTranslation('member');
  const classes = useStyles();

  const { invoice, source_invoice, billing_plan } = discount;

  const hideSecondaryAction = !goToInvoice && !!(invoice || source_invoice);

  const secondaryActionHandler = useCallback(() => {
    if (invoice && goToInvoice) {
      return goToInvoice(invoice);
    }
    if (billing_plan) {
      return goToBillingPlan(billing_plan);
    }
    if (source_invoice && goToInvoice) return goToInvoice(source_invoice);
    return null;
  }, [invoice, source_invoice, billing_plan, goToBillingPlan, goToInvoice]);

  return (
    <ListItem disabled={!!disabled} divider={!!divider}>
      <ListItemText
        primary={
          <div className={classes.flex}>
            <Typography>{discount.name}</Typography>
            {company && (
              <CompanyChip
                className={classes.chip}
                company={company}
                size="small"
              />
            )}
            {discount?.memberArchived && (
              <Typography color="secondary" variant="caption">
                {`${'\u00A0'}(${t('archived')})`}
              </Typography>
            )}
          </div>
        }
        secondary={
          <div className={classes.flex}>
            {getCurrencyDisplayWithPrice(discount.voucher)}
            {discount.reverted && (
              <Typography color="error" variant="caption">
                {`${'\u00A0'}(${t('coupon:reverted')})`}
              </Typography>
            )}
          </div>
        }
      />
      {!hideSecondaryAction && (
        <ListItemSecondaryAction>
          <IconButton disabled={!!disabled} onClick={secondaryActionHandler}>
            <ArrowForwardIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  chip: {
    margin: `0 ${theme.spacing(2)}px`,
  },
}));

export default React.memo(DiscountListItem);
