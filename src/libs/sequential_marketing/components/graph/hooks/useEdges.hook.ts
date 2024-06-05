import React from 'react';
import Immutable from 'seamless-immutable';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import type { DestinationConfig } from '#src/libs/sequential_marketing/types';
import {
  DestinationStatus,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';
import type { StoredTrigger } from './types';

type EdgesRendererProps = {
  storedTriggers: Immutable.ImmutableArray<StoredTrigger>;
  edgesIdsToHighlight: string[];
};

export const useEdgesRenderer = ({
  storedTriggers,
  edgesIdsToHighlight,
}: EdgesRendererProps) => {
  // Edges that must be drawn from  Triggers to their destination.
  // If the destination config doesn't contains any id then we link them to the exit.
  const edgesFromTriggersToDestination = React.useMemo(() => {
    if (storedTriggers && storedTriggers.length !== 0) {
      return storedTriggers.map((__triggerNode, index) => ({
        id: `${index}`,
        type: 'smoothstep',
        source: __triggerNode?.trigger?.trigger_config?.uuid,
        target:
          __triggerNode?.trigger?.destination_config?.destination_id?.toString() ||
          `exit_node_for_trigger_${__triggerNode?.trigger?.trigger_config?.uuid}`,
        style: getEdgeStyle({
          destination_config: __triggerNode?.trigger?.destination_config,
        }),
        animated: edgesIdsToHighlight.includes(`${index}`),
      }));
    }
    return [];
  }, [storedTriggers, edgesIdsToHighlight]);

  // Edges that must be drawn from  Steps to their triggers.
  const edgesFromStepNodeToTriggers = React.useMemo(() => {
    if (storedTriggers && storedTriggers.length !== 0) {
      return storedTriggers
        .filter(
          (triggerNode) =>
            !!triggerNode?.trigger?.destination_config?.source_id,
        )
        .map((__triggerNode, index) => ({
          id: `edge_from_step_to_node${index}`,
          type: 'smoothstep',
          source:
            __triggerNode?.trigger?.destination_config?.source_id?.toString(),
          target: __triggerNode?.trigger?.trigger_config?.uuid,
          style: getEdgeStyle({
            destination_config: __triggerNode?.trigger?.destination_config,
          }),
          animated: edgesIdsToHighlight.includes(
            `edge_from_step_to_node${index}`,
          ),
        }));
    }
    return [];
  }, [storedTriggers, edgesIdsToHighlight]);

  return {
    edgesFromTriggersToDestination,
    edgesFromStepNodeToTriggers,
  };
};

export default useEdgesRenderer;

const baseEdgeStyle = {
  strokeWidth: 2,
  stroke: SequentialMarketingColors.INNER_STEP_COLOR,
};

const getEdgeStyle = ({
  destination_config = {},
}: {
  destination_config?: Partial<DestinationConfig>;
}) => {
  if (!destination_config) {
    return {
      ...baseEdgeStyle,
    };
  }
  return {
    ...baseEdgeStyle,
    ...(destination_config.status === DestinationStatus.WIN
      ? { stroke: green[400] }
      : {}),
    ...(destination_config.status === DestinationStatus.FAIL
      ? { stroke: red[400] }
      : {}),
  };
};
