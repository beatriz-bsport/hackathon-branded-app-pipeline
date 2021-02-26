import React from 'react';
import { Paper } from '@material-ui/core';
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import PaymentPackMassExtensionListItem from './PaymentPackMassExtensionListItem.component';

import { PaymentPackMassExtension } from '../types';

type Props = {
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

export default PaginatedPaymentPackMassExtensionList;
