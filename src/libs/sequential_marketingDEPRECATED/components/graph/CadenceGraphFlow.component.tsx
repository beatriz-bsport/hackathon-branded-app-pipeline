import React from 'react';
import classNames from 'classnames';

import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
} from 'react-flow-renderer';

import { useNodeTypes, useGraphStyles, useGraph } from './hooks';

import type {
  Cadence,
  CadenceConnectedTriggerConfig,
  CadenceStep,
  CadenceTrackingDataBase,
} from '#libs/sequential_marketingDEPRECATED/types';

import CadenceGraphViewPort from './CadenceGraphViewPort.component';

const rfStyle = {
  backgroundColor: 'transparent',
};

type Props = {
  cadence: Cadence<
    number,
    CadenceConnectedTriggerConfig,
    CadenceConnectedTriggerConfig,
    CadenceTrackingDataBase,
    CadenceStep
  >;
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
    subscriptionDestination: number | string | null,
  ) => void;
  cadenceMinimalConfigurationState: {
    cadenceWinConfigured: boolean;
    cadenceLoseConfigured: boolean;
    cadenceEntryConfigured: boolean;
  };
  stepNodeFakerSource: CadenceStep | null;
  onClickConnectedTrigger: (
    step: CadenceStep,
    connected_trigger: CadenceConnectedTriggerConfig,
  ) => void;
  resetAllSelection: () => void;
  cadenceEditMode: boolean;
  handleSelectedStepForEdition: (stepId: number) => void;
  deleteCadenceStep: (stepId: number) => void;
  deleteConnectedTrigger: (triggerId: string) => void;
};

export const Flow: React.FC<Props> = ({
  cadence,
  updateCadenceStepCanvasPosition,
  updateConnectedTriggerPosition,
  onClickEntryStep,
  handleSelectStepForSubscription,
  cadenceMinimalConfigurationState,
  stepNodeFakerSource,
  onClickConnectedTrigger,
  resetAllSelection,
  cadenceEditMode,
  handleSelectedStepForEdition,
  deleteCadenceStep,
  deleteConnectedTrigger,
}) => {
  const [disabledMode, setDisabledMode] = React.useState(true);
  const [displayDisabledTriggers, setDisplayDisabledTriggers] =
    React.useState(false);

  const classes = useGraphStyles();

  const enterSubscriptionMode = (
    step: CadenceStep,
    destination_step: number | null | string = null,
  ) => {
    handleSelectStepForSubscription(step, destination_step);
  };

  const { nodes, setNodes, edges, setEdges, onNodeDragStop } = useGraph({
    cadence,
    cadenceEditMode,
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
      !cadenceMinimalConfigurationState.cadenceLoseConfigured ||
      !cadenceMinimalConfigurationState.cadenceWinConfigured ||
      !cadenceMinimalConfigurationState.cadenceEntryConfigured
    ) {
      setDisabledMode(true);
    } else {
      setDisabledMode(false);
    }
  }, [cadenceMinimalConfigurationState]);

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
        switchDisplayDisabledNodes={() =>
          setDisplayDisabledTriggers(!displayDisabledTriggers)
        }
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

export default Flow;
