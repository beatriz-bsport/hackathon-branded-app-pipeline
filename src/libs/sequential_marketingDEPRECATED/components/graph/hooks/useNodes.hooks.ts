// @ts-nocheck
import React from 'react';
import omit from 'lodash/omit';
import ConnectedTriggerNodeElementFlowVersion from '../nodes/ConnectedTriggerNodeElementFlowVersion.component';
import EntryStepNodeElementFlowVersion from '../nodes/EntryStepNodeElementFlowVersion.component';
import StepNodeElementFlowVersion from '../nodes/StepNodeElementFlowVersion.component';
import ExitStepNodeElementFlowVersion from '../nodes/ExitStepNodeElementFlowVersion.component';

import type {
  Cadence,
  CadenceConnectedTriggerConfig,
  CadenceStep,
  CadenceTrackingDataBase,
  StepConnectedTriggerConfig,
} from '#libs/sequential_marketingDEPRECATED/types';

import type { CustomNode, StoredStep, StoredTrigger } from './types';

export enum CustomNodesEnum {
  // Nodes for steps
  EntryStepNodeElementFlowVersionNode = 'EntryStepNodeElementFlowVersion',
  StepNodeElementFlowVersionNode = 'StepNodeElementFlowVersion',
  ExitStepNodeElementFlowVersionNode = 'ExitStepNodeElementFlowVersion',
  // Nodes for triggers
  ConnectedTriggerNodeElementFlowVersionNode = 'ConnectedTriggerNodeElementFlowVersion',
}
export enum NodeIdentifiersEnum {
  EXIT_NODE_IDENTIFIER = 'exit_node_element',
}

export const NODE_FAKER_IDENTIFIER = 'NewFakerNode';
export const useNodeTypes = () => {
  // Memo mandatory
  // [DOCUMENTATION] : https://reactflow.dev/docs/guides/custom-nodes/#adding-the-node-type
  const nodeTypes = React.useMemo(() => {
    return {
      EntryStepNodeElementFlowVersion,
      ConnectedTriggerNodeElementFlowVersion,
      StepNodeElementFlowVersion,
      ExitStepNodeElementFlowVersion,
    };
  }, []);

  return { nodeTypes };
};

type NodeElementStoreProps = {
  cadence: Cadence<
    number,
    CadenceConnectedTriggerConfig,
    CadenceConnectedTriggerConfig,
    CadenceTrackingDataBase,
    CadenceStep
  >;
  stepNodeFakerSource: CadenceStep | null;
  displayDisabledTriggers: boolean;
};

export const useStepsAndTriggersRecorder = ({
  cadence,
  displayDisabledTriggers,
  stepNodeFakerSource,
}: NodeElementStoreProps) => {
  /*
  Hook handling storage of the element that must be displayed as nodes 
  inside the graph.
  */

  // All cadence steps
  const cadenceSteps = React.useMemo(() => {
    if (cadence?.steps) {
      return cadence.steps;
    }
    return [];
  }, [cadence]);

  // Entry step
  const storedEntryStep = React.useMemo(() => {
    const newStoredEntryStep = cadenceSteps.find((step) => step?.is_entry_step);
    if (newStoredEntryStep) {
      return newStoredEntryStep;
    }
    return null;
  }, [cadenceSteps]);

  // All other steps
  const storedSteps = React.useMemo(() => {
    const notEntrySteps = cadenceSteps.filter(
      (step) => !step?.is_entry_step && !!step,
    );
    if (notEntrySteps && notEntrySteps.length !== 0) {
      return notEntrySteps.map((_step) => ({ ...omit(_step, ['exits']) }));
    }
    return [];
  }, [cadenceSteps]);

  // Connected Triggers : Kind of a "flat list" constructed by reducing all the steps and their
  // exits configurations (the step in still re-injected mostly for handling forms / events on click)
  const storedTriggers: StoredTrigger[] = React.useMemo(() => {
    if (cadenceSteps && cadenceSteps.length !== 0) {
      return cadenceSteps.reduce((acc, step) => {
        return [
          ...acc,
          ...(step?.exits || [])
            .filter(
              (_trig) =>
                _trig?.trigger_config?.identifier !== 'trigger_timeout' &&
                (displayDisabledTriggers || !_trig.disabled),
            )
            .map((trig) => ({
              step: { ...omit(step, ['exits']) },
              trigger: trig,
            })),
        ];
      }, []);
    }
    return [];
  }, [cadenceSteps, displayDisabledTriggers]);

  const storedStepNodeFakerSource = React.useMemo(
    () => stepNodeFakerSource,
    [stepNodeFakerSource],
  );

  return {
    storedEntryStep,
    storedTriggers,
    storedSteps,
    storedStepNodeFakerSource,
  };
};

type NodeRendererProps = {
  cadence: Cadence<
    number,
    CadenceConnectedTriggerConfig,
    CadenceConnectedTriggerConfig,
    CadenceTrackingDataBase,
    CadenceStep
  >;
  cadenceEditMode: boolean;
  storedEntryStep: CadenceStep<
    number,
    number,
    StepConnectedTriggerConfig<number>
  >;
  storedSteps: StoredStep[];
  storedTriggers: StoredTrigger[];
  storedStepNodeFakerSource: CadenceStep<
    number,
    number,
    StepConnectedTriggerConfig<number>
  >;
  onClickEntryStep: (step: CadenceStep) => void;
  enterSubscriptionMode: (
    step: StoredStep,
    destination_step?: number | string | null,
  ) => void;
  onClickConnectedTrigger: (
    step: CadenceStep,
    connected_trigger: CadenceConnectedTriggerConfig,
  ) => void;
  resetAllSelection: () => void;
  handleGetNodeConnectedEgdes: (nodeId: string) => void;
  handleSelectedStepForEdition: (stepId: number) => void;
  deleteCadenceStep: (stepId: number) => void;
  deleteConnectedTrigger: (triggerId: string) => void;
};

export const useNodeElementsRecorder = ({
  cadence,
  cadenceEditMode,
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
  deleteConnectedTrigger,
}: NodeRendererProps) => {
  const handleSelectEntryStepForSubscription = React.useCallback(
    () => enterSubscriptionMode(storedEntryStep),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storedEntryStep],
  );

  const onConnectToStep = React.useCallback(
    (cadence_step_id: number) =>
      enterSubscriptionMode(storedEntryStep, cadence_step_id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storedEntryStep],
  );

  // The EntryNode consumes the StoredEntryNode data to draw the initial step on the graph.
  const entryNode = React.useMemo(() => {
    if (storedEntryStep) {
      return {
        id: storedEntryStep.id.toString(),
        type: CustomNodesEnum.EntryStepNodeElementFlowVersionNode,
        ...(storedEntryStep.canvas.positions?.x &&
        storedEntryStep.canvas?.positions?.y
          ? {
              position: {
                x: parseFloat(storedEntryStep.canvas?.positions?.x ?? '0'),
                y: parseFloat(storedEntryStep.canvas?.positions?.y ?? '0'),
              },
            }
          : { position: { x: 0, y: 0 } }),
        data: {
          step: storedEntryStep,
          cadence,
          onCardClick: () => onClickEntryStep(storedEntryStep),
          handleSelectStepForSubscription: handleSelectEntryStepForSubscription,
          onConnectToStep,
        },
      };
    }
    return null;
  }, [
    onClickEntryStep,
    handleSelectEntryStepForSubscription,
    onConnectToStep,
    storedEntryStep,
    cadence,
  ]);

  // The tiggerNodeElements consumes the list of storedTriggers data to draw the ConnecteTriggers Elements on the graph.
  const triggerNodeElements = React.useMemo(() => {
    if (storedTriggers) {
      return storedTriggers.map((triggerNode) => ({
        id: triggerNode.trigger.uuid,
        type: CustomNodesEnum.ConnectedTriggerNodeElementFlowVersionNode,
        ...(triggerNode?.trigger?.canvas?.positions?.x &&
        triggerNode?.trigger.canvas?.positions?.y
          ? {
              position: {
                x: parseFloat(triggerNode.trigger.canvas.positions.x),
                y: parseFloat(triggerNode.trigger.canvas.positions.y),
              },
            }
          : { position: { x: 0, y: 0 } }),
        data: {
          step: triggerNode.step,
          trigger: triggerNode.trigger,
          cadence,
          onCardClick: () =>
            onClickConnectedTrigger(triggerNode.step, triggerNode.trigger),
          onDelete: () =>
            deleteConnectedTrigger(
              cadence.id,
              triggerNode.trigger.uuid,
              triggerNode.trigger.destination_config.source_id,
            ),
          disabled: triggerNode.trigger.disabled,
          cadenceEditMode,
        },
      }));
    }
    return [];
  }, [
    cadence,
    cadenceEditMode,
    storedTriggers,
    deleteConnectedTrigger,
    onClickConnectedTrigger,
  ]);

  // The fakeNodeElement consumes the storedStepNodeFakerSource to draw a fake node
  // knowing from which source(aka node of the graph) it must de displayed.
  const fakeNodeElement = React.useMemo(() => {
    if (storedStepNodeFakerSource) {
      return {
        id: NODE_FAKER_IDENTIFIER,
        type: CustomNodesEnum.ConnectedTriggerNodeElementFlowVersionNode,
        position: {
          x: parseFloat(storedStepNodeFakerSource?.canvas?.positions?.x),
          y: parseFloat(storedStepNodeFakerSource?.canvas?.positions?.y) + 200,
        },
        draggable: false,
        data: {
          faker: true,
          resetFaker: () => resetAllSelection(),
          cadenceEditMode,
        },
      };
    }
    return null;
  }, [storedStepNodeFakerSource, cadenceEditMode, resetAllSelection]);

  const handleOnConnectedStep = React.useCallback(
    (cadence_step_id: string, stepNode) => {
      if (typeof cadence_step_id !== 'string') {
        return;
      }
      if (!Number.isNaN(parseInt(cadence_step_id))) {
        enterSubscriptionMode(stepNode, parseInt(cadence_step_id));
      } else if (cadence_step_id === NodeIdentifiersEnum.EXIT_NODE_IDENTIFIER) {
        enterSubscriptionMode(stepNode, cadence_step_id);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // The stepNodesElements consumes the storedSteps data to draw the steps
  const stepNodesElements = React.useMemo(() => {
    if (storedSteps && storedSteps.length !== 0) {
      return storedSteps.map((stepNode) => ({
        id: stepNode?.id?.toString(),
        type: CustomNodesEnum.StepNodeElementFlowVersionNode,
        ...(stepNode?.canvas?.positions?.x && stepNode?.canvas?.positions?.y
          ? {
              position: {
                x: parseFloat(stepNode.canvas.positions.x),
                y: parseFloat(stepNode.canvas.positions.y),
              },
            }
          : { position: { x: 0, y: 0 } }),
        data: {
          step: stepNode,
          cadenceEditMode,
          handleSelectStepForSubscription: () =>
            enterSubscriptionMode(stepNode),
          onConnectToStep: (cadence_step_id: string) =>
            handleOnConnectedStep(cadence_step_id, stepNode),
          onCardClick: () => {
            handleSelectedStepForEdition(stepNode?.id);
            handleGetNodeConnectedEgdes(stepNode?.id?.toString());
          },
          onDelete: () => deleteCadenceStep(stepNode?.id),
        },
      }));
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedSteps, cadenceEditMode, handleOnConnectedStep]);

  return { entryNode, triggerNodeElements, fakeNodeElement, stepNodesElements };
};

export const computeBottomPosition = ({ nodes }: { nodes: CustomNode[] }) => {
  const positionX =
    nodes?.find(
      (_node) =>
        _node.type === CustomNodesEnum.EntryStepNodeElementFlowVersionNode,
    )?.position?.x ?? 0;

  const positionY =
    (nodes
      .map((_node) => _node?.position?.y)
      .reduce((a, b) => Math.max(a, b), 0) || 100) + 100;

  return {
    x: positionX,
    y: positionY,
  };
};
