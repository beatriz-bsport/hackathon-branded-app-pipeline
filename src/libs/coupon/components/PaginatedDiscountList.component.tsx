import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
// @ts-expect-error
import type { Discount } from '#libs/coupon/types';
import { FranchiseCompany } from '#libs/franchise/types';
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import DiscountListItem from './DiscountListItem.component';


type Props = {
  items: Array<Discount>;
  allowedFranchisees?: Array<number>;
  nbItems: number;
  loading: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize: number) => void;
  goToInvoice: (companyId: number, uuid: string) => void;
  goToBillingPlan: (companyId: number, id: number) => void;
  companies?: Array<FranchiseCompany>;
};

export const PaginatedDiscountList = (props: Props) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();

  return (
    <Paper className={classes.paperContainer}>
      <PaginatedListBase
        itemPerPage={props.itemPerPage}
        items={props.items}
        listProps={{ dense: true }}
        loading={props.loading}
        nbItems={props.nbItems}
        onPageRequested={props.onPageRequested}
        page={props.page}
        renderEmpty={() => (
          <>
            <div className={classes.emptyContainer}>
              <Typography color="textSecondary" variant="caption">
                {t('noDiscount')}
              </Typography>
            </div>
            <Divider />
          </>
        )}
        renderItem={(discount: Discount) => (
          <DiscountListItem
            divider
            company={props.companies.find(
              (company) => discount.company === company.id,
            )}
            disabled={
              props.allowedFranchisees?.length &&
              !props.allowedFranchisees.includes(discount.company)
            }
            discount={discount}
            goToBillingPlan={(id: number) =>
              props.goToBillingPlan(discount.company, id)
            }
            goToInvoice={(uuid: string) =>
              props.goToInvoice(discount.company, uuid)
            }
          />
        )}
      />
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
  paperContainer: {
    padding: theme.spacing(1),
  },
}));

export default PaginatedDiscountList;
