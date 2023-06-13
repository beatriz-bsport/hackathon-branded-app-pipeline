import React from 'react';
import omit from 'lodash/omit';
import Immutable from 'seamless-immutable';
import ConnectedTriggerNodeElementFlowVersion from '../nodes/ConnectedTriggerNodeElementFlowVersion.component';
import EntryStepNodeElementFlowVersion from '../nodes/EntryStepNodeElementFlowVersion.component';
import StepNodeElementFlowVersion from '../nodes/StepNodeElementFlowVersion.component';
import ExitStepNodeElementFlowVersion from '../nodes/ExitStepNodeElementFlowVersion.component';

import type {
  Cadence,
  ConnectedTrigger,
  CadenceStep,
} from '#libs/sequential_marketing/types';

import type { CustomNode, StoredStep, StoredTrigger } from './types';

import { TriggerIdentifier } from '#libs/sequential_marketing/constants';
import { SmartList } from '#libs/smart-list/types';

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
  steps: CadenceStep[];
  stepNodeFakerSource: CadenceStep | null;
  displayDisabledTriggers: boolean;
};

export const useStepsAndTriggersRecorder = ({
  steps,
  displayDisabledTriggers,
  stepNodeFakerSource,
}: NodeElementStoreProps) => {
  /*
  Hook handling storage of the element that must be displayed as nodes 
  inside the graph.
  */

  // Entry step
  const storedEntryStep = React.useMemo(() => {
    const newStoredEntryStep = steps.find((step) => step?.is_entrypoint);
    if (newStoredEntryStep) {
      return newStoredEntryStep;
    }
    return null;
  }, [steps]);

  // All other steps
  const storedSteps = React.useMemo(() => {
    const notEntrySteps = steps.filter(
      (step) => !step?.is_entrypoint && !!step,
    );
    if (notEntrySteps && notEntrySteps.length !== 0) {
      return notEntrySteps.map((_step) => ({ ...omit(_step, ['exits']) }));
    }
    return [];
  }, [steps]);

  // Connected Triggers : Kind of a "flat list" constructed by reducing all the steps and their
  // exits configurations (the step in still re-injected mostly for handling forms / events on click)
  const storedTriggers = React.useMemo(() => {
    if (steps && steps.length !== 0) {
      return Immutable.from(
        steps.reduce<StoredTrigger[]>((acc, step) => {
          return acc.concat(
            (step?.exits || [])
              .filter(
                (_trig) =>
                  _trig?.trigger_config?.identifier !==
                    TriggerIdentifier.TIMEOUT &&
                  (displayDisabledTriggers || !_trig.disabled),
              )
              .map((trig) =>
                Immutable({
                  step: { ...omit(step, ['exits']) },
                  trigger: Immutable(trig),
                }),
              ),
          );
        }, []),
      );
    }
    // Enforcing the typing here to avoid default on any.
    return Immutable<StoredTrigger[]>([]);
  }, [steps, displayDisabledTriggers]);

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
  cadence: Cadence;
  smartlistById: { [id: number]: SmartList };
  storedEntryStep: CadenceStep;

  storedSteps: StoredStep[];
  storedTriggers: Immutable.ImmutableArray<StoredTrigger>;
  storedStepNodeFakerSource: CadenceStep;
  onClickEntryStep: (step: CadenceStep) => void;
  enterSubscriptionMode: (
    step: StoredStep,
    destination_step?: number | string | null,
  ) => void;
  onClickConnectedTrigger: (
    step: StoredStep,
    connected_trigger: ConnectedTrigger,
  ) => void;
  resetAllSelection: () => void;
  handleGetNodeConnectedEgdes: (nodeId: string) => void;
  handleSelectedStepForEdition: (stepId: number) => void;
  deleteCadenceStep: (stepId: number) => void;
  deleteConnectedTrigger: (
    cadenceId: number,
    connectedTriggerUUID: string,
    sourceStepId: number,
  ) => void;
  cadenceEditMode: boolean;
};

export const useNodeElementsRecorder = ({
  cadence,
  cadenceEditMode,
  smartlistById,
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

  // console.log(storedSteps);
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
        ...(storedEntryStep.canvas.position?.x &&
        storedEntryStep.canvas?.position?.y
          ? {
              position: {
                x: parseFloat(storedEntryStep.canvas?.position?.x ?? '0'),
                y: parseFloat(storedEntryStep.canvas?.position?.y ?? '0'),
              },
            }
          : { position: { x: 0, y: 0 } }),
        data: {
          step: storedEntryStep,
          cadence,
          smartlistById,
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
    smartlistById,
  ]);

  // The tiggerNodeElements consumes the list of storedTriggers data to draw the ConnecteTriggers Elements on the graph.
  const triggerNodeElements = React.useMemo(() => {
    if (storedTriggers) {
      return storedTriggers.map((triggerNode) => ({
        id: triggerNode.trigger.trigger_config?.uuid,
        type: CustomNodesEnum.ConnectedTriggerNodeElementFlowVersionNode,
        ...(triggerNode?.trigger?.canvas?.position?.x &&
        triggerNode?.trigger.canvas?.position?.y
          ? {
              position: {
                x: parseFloat(triggerNode.trigger.canvas.position.x),
                y: parseFloat(triggerNode.trigger.canvas.position.y),
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
              triggerNode.trigger?.trigger_config?.uuid,
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
          x: parseFloat(storedStepNodeFakerSource?.canvas?.position?.x),
          y: parseFloat(storedStepNodeFakerSource?.canvas?.position?.y) + 200,
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
  }, [cadenceEditMode, storedStepNodeFakerSource, resetAllSelection]);

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
        ...(stepNode?.canvas?.position?.x && stepNode?.canvas?.position?.y
          ? {
              position: {
                x: parseFloat(stepNode.canvas.position.x),
                y: parseFloat(stepNode.canvas.position.y),
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
  }, [cadenceEditMode, storedSteps, handleOnConnectedStep]);

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
