// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import SubscriptionRowItem from './SubscriptionRowItem.component';

type Props = {
  items: Array<Subscription>,
  nbItems: number,
  loading: boolean,
  page: number,
  itemPerPage: number,
  onPageRequested: (id: number, page: number, pageSize: number) => void,
  onClick: (sub: Subscription) => void,
};

export const PaginatedSubscriptionList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  return (
    <PaginatedListBase
      listProps={{ disablePadding: 'true', dense: 'true' }}
      items={props.items}
      nbItems={props.nbItems}
      loading={props.loading}
      page={props.page}
      itemPerPage={props.itemPerPage}
      onPageRequested={(page, pageSize) =>
        props.onPageRequested(page, pageSize)
      }
      renderEmpty={() => (
        <div>
          <Typography
            className={classes.emptyContainer}
            variant="caption"
            color="textSecondary"
          >
            {t('noAssociatedSubscription')}
          </Typography>
          <Divider />
        </div>
      )}
      renderItem={(sub) => (
        <SubscriptionRowItem
          key={sub.id}
          subscription={sub}
          onClick={props.onClick ? () => props.onClick(sub) : null}
        />
      )}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
    backgroundColor: 'F8F8F8',
  },
}));

export default PaginatedSubscriptionList;
