// @ts-nocheck
import React from 'react';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import { useTranslation } from 'react-i18next';
import type { StoredTrigger } from './types';
import {
  CadenceConnectedTriggerReasonEnum,
  CadenceDestinationEnum,
  StepConnectedTriggerReasonEnum,
} from '#libs/sequential_marketing/constants';

import { NodeIdentifiersEnum } from './useNodes.hooks';
import type {
  CadenceStep,
  StepConnectedTriggerConfig,
} from '#libs/sequential_marketing/types';

type EdgesRendererProps = {
  storedTriggers: StoredTrigger[];
  storedStepNodeFakerSource: CadenceStep<
    number,
    number,
    StepConnectedTriggerConfig<number>
  >;
  edgesIdsToHighlight: string[];
};
export const useEdgesRenderer = ({
  storedTriggers,
  storedStepNodeFakerSource,
  edgesIdsToHighlight,
}: EdgesRendererProps) => {
  const { t } = useTranslation('marketing');

  // Edges that must be drawn from  Triggers to their destination.
  // If the destination config doesn't contains any id then we link them to the exit.
  const edgesFromTriggersToDestination = React.useMemo(() => {
    if (storedTriggers && storedTriggers.length !== 0) {
      return storedTriggers.map((__triggerNode, index) => ({
        id: `${index}`,
        type: 'smoothstep',
        source: __triggerNode?.trigger?.uuid,
        target:
          __triggerNode?.trigger?.destination_config?.id?.toString() ||
          NodeIdentifiersEnum.EXIT_NODE_IDENTIFIER,
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
          target: __triggerNode?.trigger?.uuid,
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

  // Edge that must be drawn between a Node to a fake element displayed usely after opening a form (pre-display)
  const edgeForStoredNodeFaker = React.useMemo(() => {
    if (storedStepNodeFakerSource) {
      return {
        id: 'fakerNodeEdge',
        type: 'smoothstep',
        source: storedStepNodeFakerSource.id.toString(),
        target: 'NewFakerNode',
        animated: true,
        label: t('cadence.graph.nodeElement.edgeLabelForNodeCreation'),
        style: { stroke: green[400], 'stroke-width': 2 },
      };
    }
    return null;
  }, [storedStepNodeFakerSource, t]);

  return {
    edgesFromTriggersToDestination,
    edgesFromStepNodeToTriggers,
    edgeForStoredNodeFaker,
  };
};

export default useEdgesRenderer;

const baseEdgeStyle = {
  'stroke-width': 2,
};

const getEdgeStyle = ({
  destination_config = {},
}: {
  destination_config?: {
    id?: number;
    kind?: CadenceConnectedTriggerReasonEnum;
    reason?: StepConnectedTriggerReasonEnum;
    source_id?: number;
    status?: CadenceDestinationEnum;
  };
}) => {
  if (!destination_config) {
    return {
      ...baseEdgeStyle,
    };
  }
  return {
    ...baseEdgeStyle,
    ...(destination_config.status ===
    CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_SUCCESS_STATUS
      ? { stroke: green[400] }
      : {}),
    ...(destination_config.status ===
    CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_FAIL_STATUS
      ? { stroke: red[400] }
      : {}),
  };
};
