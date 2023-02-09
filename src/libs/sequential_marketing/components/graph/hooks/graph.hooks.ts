import React from 'react';

import { getConnectedEdges } from 'react-flow-renderer';
import type {
  Cadence,
  CadenceConnectedTriggerConfig,
  CadenceStep,
  CadenceTrackingDataBase,
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

export type Props = {
  updateCadenceStepCanvasPosition: (
    id: number,
    { x, y }: { x: number; y: number },
  ) => void;
  updateConnectedTriggerPosition: (
    id: number,
    { ct_uuid, x, y }: { ct_uuid: string; x: number; y: number },
  ) => void;
  cadence: Cadence<
    number,
    CadenceConnectedTriggerConfig,
    CadenceConnectedTriggerConfig,
    CadenceTrackingDataBase,
    CadenceStep
  >;
  enterSubscriptionMode: (
    step: CadenceStep,
    destination_step?: number | string | null,
  ) => void;
  onClickEntryStep: (step: CadenceStep) => void;
  stepNodeFakerSource: CadenceStep | null;
  onClickConnectedTrigger: (
    step: CadenceStep,
    connected_trigger: CadenceConnectedTriggerConfig,
  ) => void;
  displayDisabledTriggers: boolean;
  resetAllSelection: () => void;
  handleSelectedStepForEdition: (stepId: number) => void;
  deleteCadenceStep: (stepId: number) => void;
};

export const useGraph = ({
  cadence,
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
}: Props) => {
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  const [edgesIdsToHighlight, setEdgesIdsToHighlight] = React.useState([]);

  const handleGetNodeConnectedEgdes = React.useCallback(
    (nodeId: string) => {
      if (edgesIdsToHighlight && edgesIdsToHighlight.length !== 0) {
        setEdgesIdsToHighlight([]);
      } else {
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
    cadence,
    displayDisabledTriggers,
    stepNodeFakerSource,
  });

  const { entryNode, triggerNodeElements, fakeNodeElement, stepNodesElements } =
    useNodeElementsRecorder({
      cadence,
      storedEntryStep,
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
    });
  const onNodeDragStop = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: React.MouseEvent,
    node: CustomNode,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nodesElements: CustomNode[],
  ) => {
    if (
      node?.data?.step?.id &&
      [
        CustomNodesEnum.EntryStepNodeElementFlowVersionNode,
        CustomNodesEnum.StepNodeElementFlowVersionNode,
        CustomNodesEnum.ExitStepNodeElementFlowVersionNode,
      ].includes(node.type)
    ) {
      updateCadenceStepCanvasPosition(node.data.step.id, {
        x: node.position.x,
        y: node.position.y,
      });
    }
    if (
      node?.data?.trigger?.uuid &&
      node?.data?.step?.id &&
      node.type === CustomNodesEnum.ConnectedTriggerNodeElementFlowVersionNode
    ) {
      updateConnectedTriggerPosition(node.data.step.id, {
        ct_uuid: node.data.trigger.uuid,
        x: node.position.x,
        y: node.position.y,
      });
    }
  };

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
