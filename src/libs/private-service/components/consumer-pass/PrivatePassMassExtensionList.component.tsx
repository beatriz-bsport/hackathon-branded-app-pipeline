// @ts-nocheck
import React from 'react';
import { Paper } from '@material-ui/core';

// @ts-ignore
import PaginatedListBase from '../../../../components/PaginatedListBase.component';
import PrivatePassMassExtensionListItem from './PrivatePassMassExtensionListItem.component';
import type { PrivatePassMassExtension } from '../../types';

type Props = {
  items: Array<PrivatePassMassExtension>;
  nbItems: number;
  loading: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize: number) => void;
  firstLoadDone: boolean;
  onDelete: (mE: PrivatePassMassExtension) => void;
};

export const PrivatePassMassExtensionList = (props: Props) => {
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
        renderEmpty={() => null}
        renderItem={(massExtension: PrivatePassMassExtension) => (
          <PrivatePassMassExtensionListItem
            key={massExtension.id}
            massExtension={massExtension}
            onDelete={props.onDelete}
          />
        )}
      />
    </Paper>
  );
};

export default PrivatePassMassExtensionList;
