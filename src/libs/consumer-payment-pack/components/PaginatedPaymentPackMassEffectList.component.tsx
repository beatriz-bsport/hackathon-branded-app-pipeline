import React from 'react';
import { Paper, Theme } from '@material-ui/core';
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import PaymentPackMassExtensionListItem from './PaymentPackMassExtensionListItem.component';

import { PaymentPackMassExtension } from '../types';

type OwnProps = {
  items: Array<PaymentPackMassExtension>;
  nbItems: number;
  loading: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize: number) => void;
  firstLoadDone: boolean;
};

export const PaginatedPaymentPackMassExtensionList = (props: Props) => {
  if (props.firstLoadDone && props.items.length === 0) {
    return null;
  }

  return (
    <Paper>
      <PaginatedListBase
        listProps={{ disablePadding: 'true', dense: 'true' }}
        items={props.items}
        nbItems={props.nbItems}
        loading={props.loading}
        page={props.page}
        itemPerPage={props.itemPerPage}
        onPageRequested={props.onPageRequested}
        renderEmpty={() => null}
        renderItem={(massExtension: PaymentPackMassExtension) => (
          <PaymentPackMassExtensionListItem
            massExtension={massExtension}
            key={massExtension.id}
            onDelete={props.onDelete}
          />
        )}
      />
    </Paper>
  );
};

const styles = (theme: Theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
    backgroundColor: 'F8F8F8',
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  labelValueContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
});

export default PaginatedPaymentPackMassExtensionList;
