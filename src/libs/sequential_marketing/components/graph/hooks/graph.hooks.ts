import React from 'react';

import { getConnectedEdges } from 'react-flow-renderer';

import {
  CustomNodesEnum,
  useStepsAndTriggersRecorder,
  useNodeElementsRecorder,
} from './useNodes.hooks';

import useEdgesRenderer from './useEdges.hook';

import type {
  Cadence,
  ConnectedTrigger,
  CadenceStep,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type { CustomNode } from './types';
import type { SmartList } from '#libs/smart-list/types';
import type { EmailTemplateSummary } from '#libs/email-editor/types';
import type { Tag } from '#libs/tag/types';
import type { StepEditionBubbleProps } from '../bubbles/StepEditionBubble.component';

export type Props = {
  cadence: Cadence;
  steps: CadenceStep[];
  displayDisabledTriggers: boolean;
  cadenceEditMode: boolean;
  stepBubbleProps: Omit<StepEditionBubbleProps, 'step'>;
  updateCadenceStepCanvasPosition: (
    id: number,
    { x, y }: { x: number; y: number },
  ) => void;
  updateConnectedTriggerPosition: (
    id: number,
    { ct_uuid, x, y }: { ct_uuid: string; x: number; y: number },
  ) => void;
  enterSubscriptionMode: (
    step: CadenceStep,
    destination_step?: number | string | null,
  ) => void;
  onClickEntryStep: (step: CadenceStep) => void;
  onClickConnectedTrigger: (
    step: CadenceStep,
    connected_trigger: ConnectedTrigger,
  ) => void;
  resetAllSelection: () => void;
  handleSelectedStepForEdition: (stepId: number) => void;
  deleteCadenceStep: (stepId: number) => void;
  deleteConnectedTrigger: (
    cadenceId: number,
    connectedTriggerUUID: string,
    sourceStepId: number,
  ) => void;
  getSmartlist: (id: number) => SmartList;
  getStepMarketingActions: (stepId: number) => StepMarketingActions[];
  getTag: (id: string) => Tag;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
};

export const useGraph = ({
  cadence,
  cadenceEditMode,
  steps,
  displayDisabledTriggers,
  stepBubbleProps,
  onClickEntryStep,
  updateCadenceStepCanvasPosition,
  updateConnectedTriggerPosition,
  enterSubscriptionMode,
  onClickConnectedTrigger,
  resetAllSelection,
  handleSelectedStepForEdition,
  deleteCadenceStep,
  deleteConnectedTrigger,
  getSmartlist,
  getStepMarketingActions,
  getTag,
  getEmailTemplate,
}: Props) => {
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  const [edgesIdsToHighlight, setEdgesIdsToHighlight] = React.useState([]);

  const handleGetNodeConnectedEgdes = React.useCallback(
    (nodeId: string) => {
      if (edgesIdsToHighlight && edgesIdsToHighlight.length !== 0) {
        setEdgesIdsToHighlight([]);
      } else {
        // @ts-expect-error : I do not really understand why a lot of attributes are not just optional...
        const connectedEgdges = getConnectedEdges([{ id: nodeId }], edges);
        setEdgesIdsToHighlight(connectedEgdges.map((edge) => edge.id));
      }
    },
    [edges, edgesIdsToHighlight],
  );
  const { storedEntryStep, storedTriggers, storedSteps } =
    useStepsAndTriggersRecorder({
      steps,
      displayDisabledTriggers,
    });

  const { entryNode, triggerNodeElements, stepNodeElements, exitNodeElements } =
    useNodeElementsRecorder({
      cadence,
      cadenceEditMode,
      storedEntryStep,
      storedSteps,
      storedTriggers,
      onClickEntryStep,
      enterSubscriptionMode,
      onClickConnectedTrigger,
      resetAllSelection,
      handleGetNodeConnectedEgdes,
      handleSelectedStepForEdition,
      deleteCadenceStep,
      deleteConnectedTrigger,
      getSmartlist,
      getStepMarketingActions,
      getTag,
      getEmailTemplate,
      stepBubbleProps,
    });

  const onNodeDragStop = React.useCallback(
    (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _: React.MouseEvent,
      node: CustomNode,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      __: CustomNode[],
    ) => {
      switch (node.type) {
        case CustomNodesEnum.EntryStepFlowVersionNode:
        case CustomNodesEnum.InnerStepFlowVersionNode:
          if (node?.data?.step?.id) {
            updateCadenceStepCanvasPosition(node.data.step.id, {
              x: node.position.x,
              y: node.position.y,
            });
          }
          break;
        case CustomNodesEnum.ExitCardFlowVersionNode:
          break;
        case CustomNodesEnum.TriggerCardFlowVersionNode:
          if (
            node?.data?.trigger?.trigger_config?.uuid &&
            node?.data?.step?.id
          ) {
            updateConnectedTriggerPosition(node.data.step.id, {
              ct_uuid: node.data.trigger.trigger_config.uuid,
              x: node.position.x,
              y: node.position.y,
            });
          }
          break;
        default:
      }
    },
    [updateCadenceStepCanvasPosition, updateConnectedTriggerPosition],
  );

  React.useEffect(() => {
    const controlledNodes = [];

    if (entryNode) {
      controlledNodes.push(entryNode);
    }

    if (triggerNodeElements && triggerNodeElements?.length) {
      controlledNodes.push(...triggerNodeElements);
    }

    if (stepNodeElements && stepNodeElements?.length) {
      controlledNodes.push(...stepNodeElements);
    }

    if (exitNodeElements && exitNodeElements?.length) {
      controlledNodes.push(...exitNodeElements);
    }

    setNodes(controlledNodes);
  }, [
    cadence,
    entryNode,
    stepNodeElements,
    triggerNodeElements,
    exitNodeElements,
    storedEntryStep,
    storedSteps,
    setNodes,
  ]);

  const { edgesFromTriggersToDestination, edgesFromStepNodeToTriggers } =
    useEdgesRenderer({
      storedTriggers,
      edgesIdsToHighlight,
    });

  React.useEffect(() => {
    const newEdges = [];
    if (
      edgesFromTriggersToDestination &&
      edgesFromTriggersToDestination.length !== 0
    ) {
      newEdges.push(...edgesFromTriggersToDestination);
    }
    if (
      edgesFromStepNodeToTriggers &&
      edgesFromStepNodeToTriggers.length !== 0
    ) {
      newEdges.push(...edgesFromStepNodeToTriggers);
    }
    setEdges(newEdges);
  }, [edgesFromTriggersToDestination, edgesFromStepNodeToTriggers]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodeDragStop,
  };
};

export default useGraph;
