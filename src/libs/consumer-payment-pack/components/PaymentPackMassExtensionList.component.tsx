import React from 'react';
import { Paper } from '@material-ui/core';

// @ts-ignore
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import PaymentPackMassExtensionListItem from './PaymentPackMassExtensionListItem.component';

import type { PaymentPackMassExtension } from '#libs/payment-packs/types';

type Props = {
  items: Array<PaymentPackMassExtension>;
  nbItems: number;
  loading: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize: number) => void;
  firstLoadDone: boolean;
  onDelete: (mE: PaymentPackMassExtension) => void;
};

export const PaginatedMassExtensionList = (props: Props) => {
  if (props.firstLoadDone && props.items.length === 0) {
    return null;
  }

  return (
    <Paper>
      <PaginatedListBase
        itemPerPage={props.itemPerPage}
        items={props.items}
        listProps={{ disablePadding: 'true', dense: 'true' }}
        loading={props.loading}
        nbItems={props.nbItems}
        onPageRequested={props.onPageRequested}
        page={props.page}
        renderEmpty={() => <></>}
        renderItem={(massExtension: PaymentPackMassExtension) => (
          <PaymentPackMassExtensionListItem
            key={massExtension.id}
            massExtension={massExtension}
            onDelete={props.onDelete}
          />
        )}
      />
    </Paper>
  );
};

export default PaginatedMassExtensionList;
