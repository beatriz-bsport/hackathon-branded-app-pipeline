import React from 'react';
import {
  AutoSizer,
  List,
  CellMeasurerCache,
  CellMeasurer,
} from 'react-virtualized';

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
  /** The CellMeasurer cache instance used to recompute the row height */
  cache: CellMeasurerCache;
  /** The number of rows in the current list */
  rowCount: number;
  /** A render function returning the component for current row */
  rowRenderer: React.FC<{ item: RowDataType; index: number }>;
};

export default function ConsumerSpaceVirtualizedList<
  RowDataType extends RowDataItem,
>({ data, isLoading, cache, rowCount, rowRenderer }: Props<RowDataType>) {
  if (isLoading) {
    return (
      <ConsumerCardSkeleton className="bs-consumer-space-virtualized-list--skeleton" />
    );
  }
  return (
    <AutoSizer className="bs-consumer-space-virtualized-list__autosizer">
      {({ height, width }) => (
        <List
          className="bs-consumer-space-virtualized-list__root"
          deferredMeasurementCache={cache}
          height={height}
          rowCount={rowCount}
          rowHeight={cache.rowHeight}
          rowRenderer={({ index, style, parent }) => {
            return (
              <CellMeasurer
                key={data[index].id || data[index].uuid}
                cache={cache}
                parent={parent}
                rowIndex={index}
              >
                <div
                  className="bs-consumer-space-virtualized-list__item"
                  style={style}
                >
                  {rowRenderer({ item: data[index], index })}
                </div>
              </CellMeasurer>
            );
          }}
          width={width}
        />
      )}
    </AutoSizer>
  );
}
