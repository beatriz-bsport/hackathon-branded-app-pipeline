import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const Row = ({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: React.ReactChild;
}) => <div style={style}>{children}</div>;

type Props = {
  itemCount: number;
  itemSize: number;
  minItemsDisplaid?: number;
  renderRow: (index: number) => React.ReactChild;
};

const VirtualizeListAutoSize: React.FC<Props> = ({
  itemCount,
  itemSize,
  minItemsDisplaid = 1,
  renderRow,
}) => (
  <div
    style={{
      flex: 1,
      minHeight: Math.min(minItemsDisplaid, itemCount) * itemSize,
    }}
  >
    <AutoSizer>
      {(autoSizerProps: { height: number; width: number }) => (
        <List
          height={autoSizerProps.height}
          itemCount={itemCount}
          itemSize={itemSize}
          width={autoSizerProps.width}
        >
          {(listProps: { index: number; style: React.CSSProperties }) => (
            <Row style={listProps.style}>{renderRow(listProps.index)}</Row>
          )}
        </List>
      )}
    </AutoSizer>
  </div>
);

export default VirtualizeListAutoSize;
