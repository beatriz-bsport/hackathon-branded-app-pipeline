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
  CadenceStep,
  ConnectedTrigger,
} from '#libs/sequential_marketing/types';

import CadenceGraphViewPort from './CadenceGraphViewPort.component';
import { SmartList } from '#libs/smart-list/types';
import { isMinimalCadenceConfigurationCompleted } from '#libs/sequential_marketing/utils';

const rfStyle = {
  backgroundColor: 'transparent',
};

type Props = {
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
};

export const Flow: React.FC<Props> = ({
  cadence,
  steps,
  smartlistById,
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
        fitView
      />
    </ReactFlowProvider>
  );
};

export default React.memo(Flow);
