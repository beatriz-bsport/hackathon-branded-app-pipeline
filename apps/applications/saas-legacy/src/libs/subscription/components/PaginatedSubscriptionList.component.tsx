import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import SubscriptionRowItem from './SubscriptionRowItem.component';
import type { Subscription, Contract } from '../types';
import type { FranchiseCompany } from '#src/libs/franchise/types';

type Props = {
  items: Array<Subscription>;
  nbItems: number;
  loading?: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize?: number) => void;
  getFranchiseCompanyById?: (id: number) => FranchiseCompany;
  getContractById?: (id: number) => Contract;
  onClick?: (subscriptionId: number, companyId?: number) => void;
  withoutSubscriptionStatus?: boolean;
};

export const PaginatedSubscriptionList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('subscription');
  return (
    <PaginatedListBase
      itemPerPage={props.itemPerPage}
      items={props.items}
      listProps={{ disablePadding: 'true', dense: 'true' }}
      loading={props.loading}
      nbItems={props.nbItems}
      onPageRequested={(page: number, pageSize?: number) =>
        props.onPageRequested(page, pageSize)
      }
      page={props.page}
      renderEmpty={() => (
        <div>
          <Typography
            className={classes.emptyContainer}
            color="textSecondary"
            variant="caption"
          >
            {t('noAssociatedSubscription')}
          </Typography>
          <Divider />
        </div>
      )}
      renderItem={(subscription: Subscription) =>
        subscription ? (
          <SubscriptionRowItem
            key={subscription.id}
            company={props.getFranchiseCompanyById?.(
              props.getContractById?.(subscription.contract)?.company,
            )}
            onClick={
              (!!props.onClick &&
                ((subscriptionId: number) =>
                  props.onClick(
                    subscriptionId,
                    props.getContractById?.(subscription.contract)?.company,
                  ))) ??
              null
            }
            subscription={subscription}
            withoutSubscriptionStatus={props.withoutSubscriptionStatus}
          />
        ) : null
      }
    />
  );
};

const useStyles = makeStyles((theme) => ({
  emptyContainer: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'F8F8F8',
  },
}));

export default React.memo(PaginatedSubscriptionList);
