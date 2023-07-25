import React from 'react';
import classNames from 'classnames';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
} from 'react-flow-renderer';

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
import type { EmailTemplateSummary } from '#libs/email-editor/types';
import type { Tag } from '#libs/tag/types';
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
};

export const CadenceGraphFlow: React.FC<Props> = ({
  cadence,
  steps,
  cadenceMinimalConfigurationState,
  cadenceEditMode,
  updateCadenceStepCanvasPosition,
  updateConnectedTriggerPosition,
  onClickEntryStep,
  handleSelectStepForSubscription,
  onClickConnectedTrigger,
  resetAllSelection,
  handleSelectedStepForEdition,
  deleteCadenceStep,
  deleteConnectedTrigger,
  getSmartlist,
  getStepMarketingActions,
  getTag,
  getEmailTemplate,
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
        displayDisabledTriggers={displayDisabledTriggers}
        switchDisplayDisabledNodes={() =>
          setDisplayDisabledTriggers(!displayDisabledTriggers)
        }
        active={cadence.active}
        editMode={cadenceEditMode}
        winTriggers={winTriggers}
        loseTriggers={loseTriggers}
        getSmartlist={getSmartlist}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        style={rfStyle}
        onNodeDragStop={onNodeDragStop}
        fitViewOptions={{ maxZoom: 1, minZoom: 0 }}
        maxZoom={2}
        nodesDraggable={cadenceEditMode}
        nodesConnectable={cadenceEditMode}
        onPaneClick={resetAllSelection}
        fitView
      />
    </ReactFlowProvider>
  );
};

export default React.memo(CadenceGraphFlow);
