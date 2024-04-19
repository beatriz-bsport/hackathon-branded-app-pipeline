import React, { useCallback } from 'react';
import { Paper } from '@material-ui/core';

// @ts-ignore
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import ExtensionListItem from '#components/ExtensionListItem';

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
  const handleDeleteExtension = useCallback(
    (massExtension: PaymentPackMassExtension) => () => {
      props.onDelete?.(massExtension);
    },
    // prevent passing entire props dict in dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onDelete],
  );

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
          <ExtensionListItem
            key={massExtension.id}
            showBottomDivider
            extension={massExtension}
            onDelete={handleDeleteExtension(massExtension)}
          />
        )}
      />
    </Paper>
  );
};

export default PaginatedMassExtensionList;
