import React from 'react';
import Immutable from 'seamless-immutable';

import { getConnectedEdges } from 'react-flow-renderer';

import type {
  Cadence,
  CadenceStep,
  ConnectedTrigger,
  GraphCanvas,
  MarketingActionEssentials,
  CadenceInitialConfiguration,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type { EmailTemplateSummary } from '#src/libs/email-editor/types';
import type { Tag } from '#src/libs/tag/types';
import {
  DestinationStatus,
  InitialConfigurationStep,
} from '#src/libs/sequential_marketing/constants';
import type { OptionCallback } from '../../../../../state/types';

import type { CustomNode, StoredTrigger } from './types';
import useEdgesRenderer from './useEdges.hook';
import {
  CustomNodesEnum,
  useStepsAndTriggersRecorder,
  useNodeElementsRecorder,
} from './useNodes.hooks';

type Props = {
  cadence: Cadence;
  cadenceEditMode: boolean;
  displayDisabledTriggers: boolean;
  marketingActionEssentials: MarketingActionEssentials;
  initialConfiguration: CadenceInitialConfiguration;
  isConvertStepIntoExitDialogHidden: boolean;
  isDeleteStepDialogHidden: boolean;
  isDeleteExitDialogHidden: boolean;
  isEntryActionBubbleOpen: boolean;
  isEntryFirstConfiguration: boolean;
  smartlists: Immutable.ImmutableArray<SmartList>;
  steps: CadenceStep[];
  convertCadenceExitIntoStep: (
    triggerUuid: string,
    step: {
      name: string;
      canvas: GraphCanvas;
    },
  ) => void;
  convertCadenceStepIntoExit: (
    stepId: number,
    status: DestinationStatus,
  ) => void;
  editConnectedTrigger: (
    data: ConnectedTrigger,
    options?: OptionCallback<ConnectedTrigger>,
  ) => void;
  updateCadenceStepCanvasPosition: (
    id: number,
    { x, y }: { x: number; y: number },
  ) => void;
  updateConnectedTriggerPosition: (
    id: number,
    { ct_uuid, x, y }: { ct_uuid: string; x: number; y: number },
  ) => void;
  onClickEntryStep: (step: CadenceStep) => void;
  onClickConnectedTrigger: (
    step: CadenceStep,
    connected_trigger: ConnectedTrigger,
  ) => void;
  resetAllSelection: () => void;
  handleCreateNewStepWithTrigger: (
    connected_trigger: ConnectedTrigger,
    options?: OptionCallback<number>,
  ) => void;
  handleSelectedStepForEdition: (stepId: number) => void;
  deleteCadenceStep: (stepId: number) => void;
  deleteConnectedTrigger: (
    cadenceId: number,
    connectedTriggerUUID: string,
    sourceStepId: number,
  ) => void;
  deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
  getSmartlist: (id: number) => SmartList;
  getStepMarketingActions: (stepId: number) => StepMarketingActions[];
  getStepMemberCountActions: (stepId: number) => number;
  getTag: (id: string) => Tag;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
  submitMarketingActionForm: (data: {
    list: StepMarketingActions[];
    stepId: number;
  }) => void;
  updateCadenceStepName: (data: { name: string; stepId: number }) => void;
  upsertMarketingAction: (
    marketingAction: Partial<StepMarketingActions>,
  ) => void;
  doNotDisplayDeleteStepDialogAnymore: () => void;
  doNotDisplayDeleteExitDialogAnymore: () => void;
  doNotDisplayConvertStepIntoExitDialogAnymore: () => void;
  setInitialConfig: (data: CadenceInitialConfiguration) => void;
  setCurrentStepConfiguration: (
    currentStepConfiguration: InitialConfigurationStep,
  ) => void;
};

const useGraph = ({
  cadence,
  steps,
  cadenceEditMode,
  displayDisabledTriggers,
  initialConfiguration,
  isConvertStepIntoExitDialogHidden,
  isDeleteStepDialogHidden,
  isDeleteExitDialogHidden,
  isEntryActionBubbleOpen,
  isEntryFirstConfiguration,
  marketingActionEssentials,
  smartlists,
  convertCadenceExitIntoStep,
  convertCadenceStepIntoExit,
  deleteCadenceStep,
  deleteConnectedTrigger,
  deleteStepMarketingAction,
  doNotDisplayConvertStepIntoExitDialogAnymore,
  doNotDisplayDeleteStepDialogAnymore,
  doNotDisplayDeleteExitDialogAnymore,
  editConnectedTrigger,
  getEmailTemplate,
  getSmartlist,
  getStepMarketingActions,
  getStepMemberCountActions,
  getTag,
  handleCreateNewStepWithTrigger,
  handleSelectedStepForEdition,
  onClickConnectedTrigger,
  onClickEntryStep,
  resetAllSelection,
  setCurrentStepConfiguration,
  setInitialConfig,
  submitMarketingActionForm,
  updateCadenceStepCanvasPosition,
  updateCadenceStepName,
  updateConnectedTriggerPosition,
  upsertMarketingAction,
}: Props) => {
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  const [edgesIdsToHighlight, setEdgesIdsToHighlight] = React.useState([]);
  const [fakerTrigger, setFakerTrigger] = React.useState<StoredTrigger | null>(
    null,
  );

  const handleUpdateFakerTrigger = React.useCallback(
    (storedTrigger: StoredTrigger) => {
      setFakerTrigger(storedTrigger);
    },
    [],
  );

  const handleResetFakerTrigger = React.useCallback(() => {
    setFakerTrigger(null);
  }, []);

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
      fakerTrigger,
    });

  const { entryNode, triggerNodeElements, stepNodeElements, exitNodeElements } =
    useNodeElementsRecorder({
      cadence,
      cadenceEditMode,
      fakerTrigger,
      isEntryActionBubbleOpen,
      isEntryFirstConfiguration,
      initialConfiguration,
      smartlists,
      marketingActionEssentials,
      storedEntryStep,
      storedSteps,
      storedTriggers,
      isDeleteStepDialogHidden,
      isDeleteExitDialogHidden,
      isConvertStepIntoExitDialogHidden,
      convertCadenceExitIntoStep,
      convertCadenceStepIntoExit,
      deleteCadenceStep,
      deleteConnectedTrigger,
      deleteStepMarketingAction,
      doNotDisplayConvertStepIntoExitDialogAnymore,
      doNotDisplayDeleteStepDialogAnymore,
      doNotDisplayDeleteExitDialogAnymore,
      editConnectedTrigger,
      getEmailTemplate,
      getSmartlist,
      getStepMarketingActions,
      getStepMemberCountActions,
      getTag,
      handleCreateNewStepWithTrigger,
      handleGetNodeConnectedEgdes,
      handleResetFakerTrigger,
      handleSelectedStepForEdition,
      handleUpdateFakerTrigger,
      onClickConnectedTrigger,
      onClickEntryStep,
      resetAllSelection,
      setCurrentStepConfiguration,
      setInitialConfig,
      submitMarketingActionForm,
      updateCadenceStepName,
      upsertMarketingAction,
    });

  const onNodeDragStop = React.useCallback(
    (
      _: React.MouseEvent,
      node: CustomNode,

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
