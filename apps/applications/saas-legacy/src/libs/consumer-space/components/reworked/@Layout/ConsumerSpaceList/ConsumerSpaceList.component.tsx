import React from 'react';

import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';

import './styles.css';

interface RowDataItem {
  id?: number;
  uuid?: string;
}

type Props<RowDataType extends RowDataItem> = {
  /** The data source to populate the list */
  data: RowDataType[];
  /** Computes the display of the list or skeleton according to the boolean */
  isLoading: boolean;
  /** A render function returning the component for current row */
  rowRenderer: React.FC<{ item: RowDataType; index: number }>;
};

export default function ConsumerSpaceList<RowDataType extends RowDataItem>({
  data,
  isLoading,
  rowRenderer,
}: Props<RowDataType>) {
  if (isLoading) {
    return (
      <ConsumerCardSkeleton className="bs-consumer-space-virtualized-list--skeleton" />
    );
  }
  return (
    <>
      {data.map((item, index) => (
        <li
          key={item.id || item.uuid}
          className="bs-consumer-space-virtualized-list__item"
        >
          {rowRenderer({ item, index })}
        </li>
      ))}
    </>
  );
}
