import React, { useCallback } from 'react';
import { Paper } from '@material-ui/core';

import ExtensionListItem from '#src/components/ExtensionListItem';
// @ts-expect-error
import PaginatedListBase from '../../../../components/PaginatedListBase.component';
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
  const handleDeleteExtension = useCallback(
    (massExtension: PrivatePassMassExtension) => () => {
      props.onDelete(massExtension);
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
        renderItem={(massExtension: PrivatePassMassExtension) => (
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

export default PrivatePassMassExtensionList;
