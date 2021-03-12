import React from 'react';
import { Paper } from '@material-ui/core';

// @ts-ignore
import PaginatedListBase from '../../../../components/PaginatedListBase.component';
import PrivatePassMassExtensionListItem from './PrivatePassMassExtensionListItem.component';
import { PrivateConsumerPassMassExtension } from '../../types';

type Props = {
  items: Array<PrivateConsumerPassMassExtension>;
  nbItems: number;
  loading: boolean;
  page: number;
  itemPerPage: number;
  onPageRequested: (page: number, pageSize: number) => void;
  firstLoadDone: boolean;
  onDelete: (mE: PrivateConsumerPassMassExtension) => void;
};

export const PrivatePassMassExtensionList = (props: Props) => {
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
        renderItem={(massExtension: PrivateConsumerPassMassExtension) => (
          <PrivatePassMassExtensionListItem
            massExtension={massExtension}
            key={massExtension.id}
            onDelete={props.onDelete}
          />
        )}
      />
    </Paper>
  );
};

export default PrivatePassMassExtensionList;
