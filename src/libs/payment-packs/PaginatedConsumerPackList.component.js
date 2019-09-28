// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import PaginatedListBase from '../../components/PaginatedListBase.component';
import ConsumerPackRowItem from './ConsumerPackRowItem.component';

type Props = {
  paymentPack: PaymentPack,
  onClick: ?(ConsumerPaymentPack) => void,
  consumerPacksUpdating: Array<number>,
  decrementCredit: (id: number) => void,
  incrementCredit: (id: number) => void,
  items: Array<ConsumerPaymentPack>,
  nbItems: number,
  loading: boolean,
  page: number,
  itemPerPage: number,
  onPageRequested: (id: number, page: number, pageSize: number) => void,
  t: TFunction,
  classes: Object,
};

export const PaginatedConsumerPackList = (props: Props) => (
  <PaginatedListBase
    listProps={{ disablePadding: 'true', dense: 'true' }}
    items={props.items}
    nbItems={props.nbItems}
    loading={props.loading}
    page={props.page}
    itemPerPage={props.itemPerPage}
    onPageRequested={(page, pageSize) => props.onPageRequested(page, pageSize)}
    renderEmpty={() => (
      <div>
        <Typography
          className={props.classes.emptyContainer}
          variant="caption"
          color="textSecondary"
        >
          {props.t('paymentPack.noConsumerPack')}
        </Typography>
        <Divider />
      </div>
    )}
    renderItem={(cpp) => (
      <ConsumerPackRowItem
        key={cpp.id}
        consumerPack={cpp}
        paymentPack={props.paymentPack}
        decrementCredit={props.decrementCredit}
        incrementCredit={props.incrementCredit}
        onClick={props.onClick ? () => props.onClick(cpp) : null}
        loading={
          (props.consumerPacksUpdating || []).filter((id) => id === cpp.id)
            .length > 0
        }
      />
    )}
  />
);

const styles = (theme) => ({
  emptyContainer: {
    padding: theme.spacing.unit * 2,
    backgroundColor: 'F8F8F8',
  },
});

export default withNamespaces()(withStyles(styles)(PaginatedConsumerPackList));
