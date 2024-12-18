import React from 'react';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import CoachListItem from './CoachListItem.component';
import type { Coach } from '../types';

interface VirtualProps {
  itemCount: number;
  variableItemSize: (index: number) => number;
  itemSize: number;
  minItemsDisplaid?: number;
  renderRow: (index: number) => React.ReactChild;
}

interface Props {
  coachList: Array<Coach>;
  onCoachSelected?: (id: number) => void;
  onEditCoach?: (id: number) => void;
  deleteCoach?: (id: number) => void;
  restoreCoach?: (id: number) => void;
}

const Row = ({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: React.ReactChild;
}) => <div style={style}>{children}</div>;

const VirtualizedVariableList: React.FC<VirtualProps> = ({
  itemCount,
  itemSize = 100,
  variableItemSize,
  minItemsDisplaid = 1,
  renderRow,
}) => (
  <div
    style={{ flex: 1, minHeight: minItemsDisplaid * itemSize, height: '100%' }}
  >
    <AutoSizer>
      {(dimensions: { height: number; width: number }) => (
        <VariableSizeList
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
        </VariableSizeList>
      )}
    </AutoSizer>
  </div>
);

const VirtualizedCoachList = ({
  coachList,
  onCoachSelected,
  onEditCoach,
  deleteCoach,
  restoreCoach,
}: Props) => (
  <VirtualizedVariableList
    itemCount={coachList?.length || 0}
    itemSize={81}
    minItemsDisplaid={20}
    renderRow={(index: number) => {
      const coach = coachList[index];
      return (
        <CoachListItem
          key={coach.id}
          divider
          coach={coach}
          deleteCoach={deleteCoach}
          index={index}
          onCoachSelected={onCoachSelected}
          onEditCoach={onEditCoach}
          restoreCoach={restoreCoach}
        />
      );
    }}
    variableItemSize={() => 81}
  />
);

export default React.memo(VirtualizedCoachList);
