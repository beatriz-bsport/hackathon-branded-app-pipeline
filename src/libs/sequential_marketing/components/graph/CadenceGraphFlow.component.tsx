import React from 'react';
import classNames from 'classnames';
import Immutable from 'seamless-immutable';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
} from 'react-flow-renderer';

import CadenceGraphViewPort from './CadenceGraphViewPort.component';
import { useNodeTypes, useGraphStyles, useGraph } from './hooks';
import { DestinationStatus } from '#libs/sequential_marketing/constants';
import {
  getCadenceWinOrLoseConnectedTriggers,
  isMinimalCadenceConfigurationCompleted,
} from '#libs/sequential_marketing/utils';

import type { OptionCallback } from '../../../../state/types';
import type { SmartList } from '#libs/smart-list/types';
import type { Tag, TagGroupAPI } from '#libs/tag/types';
import type {
  Cadence,
  CadenceStep,
  ConnectedTrigger,
  GraphCanvas,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';

const rfStyle = {
  backgroundColor: 'transparent',
};

type Props = {
  cadence: Cadence;
  cadenceMinimalConfigurationState: {
    cadenceWinConfigured: boolean;
    cadenceLoseConfigured: boolean;
    cadenceEntryConfigured: boolean;
  };
  cadenceEditMode: boolean;
  tagList: Tag<TagGroupAPI>[];
  emailSummaryListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailDetailListLoading: boolean;
  emailDetailList: Record<number, EmailTemplateDetail>;
  resolvedGenericTags: ResolvedGenericTags;
  tagCategories: { [tag_name: string]: string[] };
  smartlists: Immutable.ImmutableArray<SmartList>;
  steps: CadenceStep[];
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
  editConnectedTrigger: (
    trigger: ConnectedTrigger,
    options?: OptionCallback<ConnectedTrigger>,
  ) => void;
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
  getSmartlist: (id: number) => SmartList;
  getStepMarketingActions: (stepId: number) => StepMarketingActions[];
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
  submitMarketingActionForm: (data: {
    list: StepMarketingActions[];
    step: number;
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
};

export const CadenceGraphFlow: React.FC<Props> = ({
  cadence,
  cadenceEditMode,
  cadenceMinimalConfigurationState,
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  tagCategories,
  resolvedGenericTags,
  smartlists,
  steps,
  tagList,
  convertCadenceExitIntoStep,
  convertCadenceStepIntoExit,
  deleteCadenceStep,
  deleteConnectedTrigger,
  editConnectedTrigger,
  fetchEmailSummaryList,
  getEmailDetail,
  getEmailTemplate,
  getSmartlist,
  getStepMarketingActions,
  getTag,
  handleCreateNewStepWithTrigger,
  handleSelectedStepForEdition,
  onClickConnectedTrigger,
  onClickEntryStep,
  resetAllSelection,
  submitMarketingActionForm,
  updateCadenceStepCanvasPosition,
  updateCadenceStepName,
  updateConnectedTriggerPosition,
  upsertMarketingAction,
}) => {
  const [disabledMode, setDisabledMode] = React.useState(true);
  const [displayDisabledTriggers, setDisplayDisabledTriggers] =
    React.useState(false);

  const classes = useGraphStyles();

  const { nodes, setNodes, edges, setEdges, onNodeDragStop } = useGraph({
    cadence,
    cadenceEditMode,
    displayDisabledTriggers,
    smartlists,
    steps,
    convertCadenceExitIntoStep,
    convertCadenceStepIntoExit,
    deleteCadenceStep,
    deleteConnectedTrigger,
    editConnectedTrigger,
    getEmailTemplate,
    getSmartlist,
    getStepMarketingActions,
    getTag,
    handleCreateNewStepWithTrigger,
    handleSelectedStepForEdition,
    onClickConnectedTrigger,
    onClickEntryStep,
    resetAllSelection,
    updateCadenceStepCanvasPosition,
    updateConnectedTriggerPosition,
    upsertMarketingAction,
    stepBubbleProps: {
      emailDetailList,
      emailDetailListLoading,
      emailSummaryList,
      emailSummaryListLoading,
      resolvedGenericTags,
      tagCategories,
      tagList,
      fetchEmailSummaryList,
      getEmailDetail,
      onConfirm: submitMarketingActionForm,
      updateCadenceStepName,
    },
  });

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
    if (
      isMinimalCadenceConfigurationCompleted(cadenceMinimalConfigurationState)
    ) {
      setDisabledMode(false);
    } else {
      setDisabledMode(true);
    }
  }, [cadenceMinimalConfigurationState]);

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

  return (
    <ReactFlowProvider>
      <div
        className={classNames({
          [classes.blurDisabledOverLay]: disabledMode,
          [classes.clearDisabledOverLay]:
            !disabledMode && (cadence.active || !cadenceEditMode),
        })}
      />
      <CadenceGraphViewPort
        active={cadence.active}
        displayDisabledTriggers={displayDisabledTriggers}
        editMode={cadenceEditMode}
        getSmartlist={getSmartlist}
        loseTriggers={loseTriggers}
        switchDisplayDisabledNodes={() =>
          setDisplayDisabledTriggers(!displayDisabledTriggers)
        }
        winTriggers={winTriggers}
      />
      <ReactFlow
        fitView
        edges={edges}
        fitViewOptions={{ maxZoom: 1, minZoom: 0 }}
        maxZoom={2}
        nodes={nodes}
        nodesConnectable={cadenceEditMode}
        nodesDraggable={cadenceEditMode}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onNodesChange={onNodesChange}
        onPaneClick={resetAllSelection}
        style={rfStyle}
      />
    </ReactFlowProvider>
  );
};

export default React.memo(CadenceGraphFlow);
