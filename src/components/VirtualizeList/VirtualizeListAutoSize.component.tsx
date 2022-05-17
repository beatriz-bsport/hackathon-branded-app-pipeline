import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { CSSProperties } from '@material-ui/styles';

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
  renderRow: (index: number) => React.ReactChild;
};

const VirtualizeListAutoSize: React.FC<Props> = ({
  itemCount,
  itemSize,
  renderRow,
}) => (
  <AutoSizer>
    {(as: { height: number; width: number }) => (
      <List
        height={as.height}
        itemCount={itemCount}
        itemSize={itemSize}
        width={as.width}
      >
        {(r: { index: number; style: CSSProperties }) => (
          <Row style={r.style}>{renderRow(r.index)}</Row>
        )}
      </List>
    )}
  </AutoSizer>
);

export default VirtualizeListAutoSize;
