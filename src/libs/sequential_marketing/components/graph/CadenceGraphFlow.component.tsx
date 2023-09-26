import React from 'react';
import classNames from 'classnames';
import Immutable from 'seamless-immutable';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
} from 'react-flow-renderer';

import type { OptionCallback } from '../../../../state/types';
import { useNodeTypes, useGraphStyles, useGraph } from './hooks';
import CadenceGraphViewPort from './CadenceGraphViewPort.component';
import {
  getCadenceWinOrLoseConnectedTriggers,
  isMinimalCadenceConfigurationCompleted,
} from '#libs/sequential_marketing/utils';

import type {
  Cadence,
  CadenceStep,
  ConnectedTrigger,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import type { Tag, TagGroupAPI } from '#libs/tag/types';
import { DestinationStatus } from '#libs/sequential_marketing/constants';

const rfStyle = {
  backgroundColor: 'transparent',
};

type Props = {
  cadence: Cadence;
  steps: CadenceStep[];
  updateCadenceStepCanvasPosition: (
    id: number,
    { x, y }: { x: number; y: number },
  ) => void;
  updateConnectedTriggerPosition: (
    id: number,
    { ct_uuid, x, y }: { ct_uuid: string; x: number; y: number },
  ) => void;
  onClickEntryStep: (step: CadenceStep) => void;
  handleSelectStepForSubscription: (
    step: CadenceStep,
    subscriptionDestination?: number | string | null,
  ) => void;
  cadenceMinimalConfigurationState: {
    cadenceWinConfigured: boolean;
    cadenceLoseConfigured: boolean;
    cadenceEntryConfigured: boolean;
  };
  onClickConnectedTrigger: (
    step: CadenceStep,
    connected_trigger: ConnectedTrigger,
  ) => void;
  resetAllSelection: () => void;
  cadenceEditMode: boolean;
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
  tagList: Tag<TagGroupAPI>[];
  submitMarketingActionForm: (data: {
    list: StepMarketingActions[];
    step: number;
  }) => void;
  updateCadenceStepName: (data: { name: string; stepId: number }) => void;
  emailSummaryListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailDetailListLoading: boolean;
  emailDetailList: Record<number, EmailTemplateDetail>;
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  resolvedGenericTags: ResolvedGenericTags;
  tagCategories: { [tag_name: string]: string[] };
  smartlists: Immutable.ImmutableArray<SmartList>;
  editConnectedTrigger: (
    trigger: ConnectedTrigger,
    options?: OptionCallback,
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
  deleteCadenceStep,
  deleteConnectedTrigger,
  editConnectedTrigger,
  fetchEmailSummaryList,
  getEmailDetail,
  getEmailTemplate,
  getSmartlist,
  getStepMarketingActions,
  getTag,
  handleSelectedStepForEdition,
  handleSelectStepForSubscription,
  onClickConnectedTrigger,
  onClickEntryStep,
  resetAllSelection,
  submitMarketingActionForm,
  updateCadenceStepCanvasPosition,
  updateCadenceStepName,
  updateConnectedTriggerPosition,
}) => {
  const [disabledMode, setDisabledMode] = React.useState(true);
  const [displayDisabledTriggers, setDisplayDisabledTriggers] =
    React.useState(false);

  const classes = useGraphStyles();

  const { nodes, setNodes, edges, setEdges, onNodeDragStop } = useGraph({
    cadence,
    cadenceEditMode,
    steps,
    displayDisabledTriggers,
    onClickEntryStep,
    updateCadenceStepCanvasPosition,
    updateConnectedTriggerPosition,
    enterSubscriptionMode: handleSelectStepForSubscription,
    onClickConnectedTrigger,
    resetAllSelection,
    handleSelectedStepForEdition,
    deleteCadenceStep,
    deleteConnectedTrigger,
    getSmartlist,
    getStepMarketingActions,
    getTag,
    getEmailTemplate,
    triggerBubbleProps: {
      smartlists,
      onConfirm: editConnectedTrigger,
    },
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
