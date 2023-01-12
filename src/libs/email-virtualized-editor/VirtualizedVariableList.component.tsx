import React from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const Row = ({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: React.ReactChild;
}) => <div style={style}>{children}</div>;

type VirtualProps = {
  itemCount: number;
  variableItemSize: (index: number) => number;
  itemSize: number;
  minItemsDisplaid?: number;
  renderRow: (index: number) => React.ReactChild;
};

const VirtualizedVariableList: React.FC<VirtualProps> = ({
  itemCount,
  itemSize = 100,
  variableItemSize,
  minItemsDisplaid = 1,
  renderRow,
}) => (
  <div
    style={{ flex: 1, minHeight: minItemsDisplaid * itemSize, height: '100vh' }}
  >
    <AutoSizer>
      {(dimensions: { height: number; width: number }) => (
        <List
          height={dimensions.height}
          itemCount={itemCount}
          itemSize={variableItemSize}
          width={dimensions.width}
        >
          {(props: { index: number; style: React.CSSProperties }) => (
            <Row key={props.index} style={props.style}>
              {renderRow(props.index)}
            </Row>
          )}
        </List>
      )}
    </AutoSizer>
  </div>
);

export default VirtualizedVariableList;
