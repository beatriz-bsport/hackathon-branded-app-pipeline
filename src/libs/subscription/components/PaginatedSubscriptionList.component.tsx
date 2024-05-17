import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
// @ts-expect-error
import PaginatedListBase from '#components/PaginatedListBase.component';
import SubscriptionRowItem from './SubscriptionRowItem.component';
import { Subscription } from '../types';

type Props = {
  items: Array<Subscription>;
  nbItems: number;
  loading?: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize?: number) => void;
  onClick?: (subscriptionId: number) => void;
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
      renderItem={(sub: Subscription) =>
        sub ? (
          <SubscriptionRowItem
            key={sub.id}
            onClick={props.onClick ? () => props.onClick(sub.id) : null}
            subscription={sub}
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'F8F8F8',
  },
}));

export default React.memo(PaginatedSubscriptionList);
