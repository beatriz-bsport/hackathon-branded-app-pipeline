import React from 'react';

import { getConnectedEdges } from 'react-flow-renderer';
import type {
  Cadence,
  ConnectedTrigger,
  CadenceStep,
} from '#libs/sequential_marketing/types';

import {
  CustomNodesEnum,
  NodeIdentifiersEnum,
  useStepsAndTriggersRecorder,
  useNodeElementsRecorder,
  computeBottomPosition,
} from './useNodes.hooks';

import useEdgesRenderer from './useEdges.hook';

import { CustomNode } from './types';
import { SmartList } from '#libs/smart-list/types';

export type Props = {
  cadence: Cadence;
  steps: CadenceStep[];
  smartlistById: { [id: number]: SmartList };
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
  stepNodeFakerSource: CadenceStep | null;
  onClickConnectedTrigger: (
    step: CadenceStep,
    connected_trigger: ConnectedTrigger,
  ) => void;
  displayDisabledTriggers: boolean;
  resetAllSelection: () => void;
  handleSelectedStepForEdition: (stepId: number) => void;
  deleteCadenceStep: (stepId: number) => void;
  deleteConnectedTrigger: (
    cadenceId: number,
    connectedTriggerUUID: string,
    sourceStepId: number,
  ) => void;
  cadenceEditMode: boolean;
};

export const useGraph = ({
  cadence,
  cadenceEditMode,
  steps,
  smartlistById,
  onClickEntryStep,
  updateCadenceStepCanvasPosition,
  updateConnectedTriggerPosition,
  enterSubscriptionMode,
  stepNodeFakerSource,
  onClickConnectedTrigger,
  displayDisabledTriggers,
  resetAllSelection,
  handleSelectedStepForEdition,
  deleteCadenceStep,
  deleteConnectedTrigger,
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
  const {
    storedEntryStep,
    storedTriggers,
    storedSteps,
    storedStepNodeFakerSource,
  } = useStepsAndTriggersRecorder({
    steps,
    displayDisabledTriggers,
    stepNodeFakerSource,
  });

  const { entryNode, triggerNodeElements, fakeNodeElement, stepNodesElements } =
    useNodeElementsRecorder({
      cadence,
      cadenceEditMode,
      storedEntryStep,
      smartlistById,
      storedSteps,
      storedTriggers,
      storedStepNodeFakerSource,
      onClickEntryStep,
      enterSubscriptionMode,
      onClickConnectedTrigger,
      resetAllSelection,
      handleGetNodeConnectedEgdes,
      handleSelectedStepForEdition,
      deleteCadenceStep,
      deleteConnectedTrigger,
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
        case CustomNodesEnum.EntryStepNodeElementFlowVersionNode:
        case CustomNodesEnum.StepNodeElementFlowVersionNode:
        case CustomNodesEnum.ExitStepNodeElementFlowVersionNode:
          if (node?.data?.step?.id) {
            updateCadenceStepCanvasPosition(node.data.step.id, {
              x: node.position.x,
              y: node.position.y,
            });
          }
          break;
        case CustomNodesEnum.ConnectedTriggerNodeElementFlowVersionNode:
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
    if (fakeNodeElement) {
      controlledNodes.push(fakeNodeElement);
    }
    if (triggerNodeElements && triggerNodeElements.length !== 0) {
      controlledNodes.push(...triggerNodeElements);
    }

    if (stepNodesElements && stepNodesElements.length !== 0) {
      controlledNodes.push(...stepNodesElements);
    }

    controlledNodes.push({
      id: NodeIdentifiersEnum.EXIT_NODE_IDENTIFIER,
      type: CustomNodesEnum.ExitStepNodeElementFlowVersionNode,
      data: { cadence },
      // Position ExitNode at the very bottom
      position: computeBottomPosition({ nodes: controlledNodes }),
    });
    setNodes(controlledNodes);
  }, [
    cadence,
    entryNode,
    stepNodesElements,
    fakeNodeElement,
    triggerNodeElements,
    storedEntryStep,
    storedSteps,
    storedStepNodeFakerSource,
    setNodes,
  ]);

  const {
    edgesFromTriggersToDestination,
    edgesFromStepNodeToTriggers,
    edgeForStoredNodeFaker,
  } = useEdgesRenderer({
    storedTriggers,
    storedStepNodeFakerSource,
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
    if (edgeForStoredNodeFaker) {
      newEdges.push(edgeForStoredNodeFaker);
    }

    setEdges(newEdges);
  }, [
    edgesFromTriggersToDestination,
    edgesFromStepNodeToTriggers,
    edgeForStoredNodeFaker,
  ]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodeDragStop,
  };
};

export default useGraph;
