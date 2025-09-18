import React from 'react';
import clsx from 'clsx';
import Immutable from 'seamless-immutable';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
} from 'react-flow-renderer';

import {
  DestinationStatus,
  InitialConfigurationStep,
} from '#src/libs/sequential_marketing/constants';
import { getCadenceWinOrLoseConnectedTriggers } from '#src/libs/sequential_marketing/utils';

import type { EmailTemplateSummary } from '#src/libs/email-editor/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type { Tag } from '#src/libs/tag/types';
import type {
  Cadence,
  CadenceStep,
  ConnectedTrigger,
  GraphCanvas,
  MarketingActionEssentials,
  CadenceInitialConfiguration,
  StepMarketingActions,
} from '#src/libs/sequential_marketing/types';
import type { OptionCallback } from '../../../../state/types';
import { useNodeTypes, useGraphStyles, useGraph } from './hooks';
import CadenceGraphViewPort from './CadenceGraphViewPort.component';

const rfStyle = {
  backgroundColor: 'transparent',
};

type Props = {
  cadence: Cadence;
  steps: CadenceStep[];
  currentStepConfiguration: InitialConfigurationStep;
  initialConfiguration: CadenceInitialConfiguration;
  cadenceEditMode: boolean;
  isConvertStepIntoExitDialogHidden: boolean;
  isDeleteStepDialogHidden: boolean;
  isDeleteExitDialogHidden: boolean;
  isEntryFirstConfiguration: boolean;
  smartlists: Immutable.ImmutableArray<SmartList>;
  convertCadenceStepIntoExit: (
    stepId: number,
    status: DestinationStatus,
  ) => void;
  convertCadenceExitIntoStep: (
    triggerUuid: string,
    step: {
      name: string;
      canvas: GraphCanvas;
    },
  ) => void;
  deleteCadenceStep: (stepId: number) => void;
  deleteConnectedTrigger: (
    cadenceId: number,
    connectedTriggerUUID: string,
    sourceStepId: number,
  ) => void;
  deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
  doNotDisplayConvertStepIntoExitDialogAnymore: () => void;
  doNotDisplayDeleteStepDialogAnymore: () => void;
  doNotDisplayDeleteExitDialogAnymore: () => void;
  editConnectedTrigger: (
    trigger: ConnectedTrigger,
    options?: OptionCallback<ConnectedTrigger>,
  ) => void;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
  getSmartlist: (id: number) => SmartList;
  getStepMarketingActions: (stepId: number) => StepMarketingActions[];
  getStepMemberCountActions: (stepId: number) => number;
  getTag: (id: string) => Tag;
  handleCreateNewStepWithTrigger: (
    connected_trigger: ConnectedTrigger,
    options?: OptionCallback<number>,
  ) => void;
  handleSelectedStepForEdition: (stepId: number) => void;
  onClickConnectedTrigger: (
    step: CadenceStep,
    connected_trigger: ConnectedTrigger,
  ) => void;
  onClickEntryStep: (step: CadenceStep) => void;
  resetAllSelection: () => void;
  setCurrentStepConfiguration: (
    currentStepConfiguration: InitialConfigurationStep,
  ) => void;
  setInitialConfig: (data: CadenceInitialConfiguration, save?: boolean) => void;
  submitMarketingActionForm: (data: {
    list: StepMarketingActions[];
    stepId: number;
  }) => void;
  updateCadenceStepCanvasPosition: (
    id: number,
    { x, y }: { x: number; y: number },
  ) => void;
  updateCadenceStepName: (data: { name: string; stepId: number }) => void;
  updateConnectedTriggerPosition: (
    id: number,
    { ct_uuid, x, y }: { ct_uuid: string; x: number; y: number },
  ) => void;
  upsertMarketingAction: (
    marketingAction: Partial<StepMarketingActions>,
  ) => void;
} & MarketingActionEssentials;

export const CadenceGraphFlow: React.FC<Props> = ({
  cadence,
  cadenceEditMode,
  currentStepConfiguration,
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  initialConfiguration,
  isConvertStepIntoExitDialogHidden,
  isDeleteStepDialogHidden,
  isDeleteExitDialogHidden,
  isEntryFirstConfiguration,
  resolvedGenericTags,
  smartlists,
  steps,
  tagCategories,
  tagList,
  convertCadenceExitIntoStep,
  convertCadenceStepIntoExit,
  deleteCadenceStep,
  deleteConnectedTrigger,
  deleteStepMarketingAction,
  editConnectedTrigger,
  fetchEmailSummaryList,
  getEmailDetail,
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
  doNotDisplayConvertStepIntoExitDialogAnymore,
  doNotDisplayDeleteStepDialogAnymore,
  doNotDisplayDeleteExitDialogAnymore,
}) => {
  const [displayDisabledTriggers, setDisplayDisabledTriggers] =
    React.useState(false);

  const [isEntryActionBubbleOpen, setIsEntryActionBubbleOpen] =
    React.useState(false);

  const [containerDimensions, setContainerDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  const openEntryActionBubble = React.useCallback(
    () => setIsEntryActionBubbleOpen(true),
    [],
  );

  const closeEntryActionBubble = React.useCallback(
    () => setIsEntryActionBubbleOpen(false),
    [],
  );

  const creationMode = !(cadence?.initialized ?? true);

  const isFirstOutputConfiguration =
    creationMode &&
    [
      InitialConfigurationStep.CADENCE_LOSE_STEP,
      InitialConfigurationStep.CADENCE_WIN_STEP,
    ].includes(currentStepConfiguration);

  const classes = useGraphStyles({ isFirstOutputConfiguration });

  const { nodes, setNodes, edges, setEdges, onNodeDragStop } = useGraph({
    cadence,
    cadenceEditMode,
    displayDisabledTriggers,
    initialConfiguration,
    isEntryActionBubbleOpen,
    isEntryFirstConfiguration,
    smartlists,
    steps,
    isDeleteStepDialogHidden,
    isDeleteExitDialogHidden,
    isConvertStepIntoExitDialogHidden,
    convertCadenceExitIntoStep,
    convertCadenceStepIntoExit,
    deleteCadenceStep,
    deleteConnectedTrigger,
    deleteStepMarketingAction,
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
    updateCadenceStepCanvasPosition,
    updateConnectedTriggerPosition,
    upsertMarketingAction,
    submitMarketingActionForm,
    updateCadenceStepName,
    marketingActionEssentials: {
      emailDetailList,
      emailDetailListLoading,
      emailSummaryList,
      emailSummaryListLoading,
      resolvedGenericTags,
      tagCategories,
      tagList,
      fetchEmailSummaryList,
      getEmailDetail,
    },
    doNotDisplayConvertStepIntoExitDialogAnymore,
    doNotDisplayDeleteStepDialogAnymore,
    doNotDisplayDeleteExitDialogAnymore,
  });

  const winTriggers = React.useMemo(
    () =>
      !!cadence &&
      getCadenceWinOrLoseConnectedTriggers(cadence, DestinationStatus.WIN),
    [cadence],
  );

  const loseTriggers = React.useMemo(
    () =>
      !!cadence &&
      getCadenceWinOrLoseConnectedTriggers(cadence, DestinationStatus.FAIL),
    [cadence],
  );

  const repositionedEntryNode = React.useMemo(() => {
    return nodes.map((node) =>
      node?.data?.step?.is_entrypoint &&
      containerDimensions.height &&
      containerDimensions.width
        ? {
            ...node,
            position: {
              x: containerDimensions.width / 15,
              y: (containerDimensions.height - node.height) / 2,
            },
          }
        : node,
    );
  }, [containerDimensions.height, containerDimensions.width, nodes]);

  const onNodesChange = React.useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange = React.useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect = React.useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const { nodeTypes } = useNodeTypes();

  React.useEffect(() => {
    const container = document.getElementById('react-flow-div');

    const updateDimensions = () => {
      if (container) {
        const newWidth = container.offsetWidth;
        const newHeight = container.offsetHeight;
        if (
          newWidth !== containerDimensions.width ||
          newHeight !== containerDimensions.height
        ) {
          setContainerDimensions({ width: newWidth, height: newHeight });
        }
      }
    };

    // Attach an event listener to update dimensions when the container size changes
    window.addEventListener('resize', updateDimensions);

    // Initial dimensions setup
    updateDimensions();

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [containerDimensions]);

  return (
    <ReactFlowProvider>
      <div
        className={clsx({
          [classes.blurDisabledOverLay]: creationMode,
          [classes.clearDisabledOverLay]:
            !creationMode && (cadence.active || !cadenceEditMode),
        })}
        id="react-flow-div"
      />
      <CadenceGraphViewPort
        active={cadence.active}
        closeEntryActionBubble={closeEntryActionBubble}
        creationMode={creationMode}
        displayDisabledTriggers={displayDisabledTriggers}
        editMode={cadenceEditMode}
        getSmartlist={getSmartlist}
        initialConfiguration={initialConfiguration}
        isFirstOutputConfiguration={isFirstOutputConfiguration}
        loseTriggers={loseTriggers}
        openEntryActionBubble={openEntryActionBubble}
        setCurrentStepConfiguration={setCurrentStepConfiguration}
        setInitialConfig={setInitialConfig}
        smartlists={smartlists}
        switchDisplayDisabledNodes={() =>
          setDisplayDisabledTriggers(!displayDisabledTriggers)
        }
        winTriggers={winTriggers}
      />
      <ReactFlow
        edges={edges}
        fitView={!creationMode}
        fitViewOptions={{ maxZoom: 1, minZoom: 0 }}
        maxZoom={2}
        nodes={creationMode ? repositionedEntryNode : nodes}
        nodesConnectable={cadenceEditMode}
        nodesDraggable={cadenceEditMode}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onNodesChange={onNodesChange}
        onPaneClick={resetAllSelection}
        style={rfStyle}
        zoomOnDoubleClick={false}
      />
    </ReactFlowProvider>
  );
};

export default React.memo(CadenceGraphFlow);
