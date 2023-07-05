import React from 'react';
import omit from 'lodash/omit';
import Immutable from 'seamless-immutable';
import EntryStepFlowVersion from '../nodes/steps/EntryStepFlowVersion.component';
import InnerStepFlowVersion from '../nodes/steps/InnerStepFlowVersion.component';
import TriggerCardFlowVersion from '../nodes/triggers/TriggerCardFlowVersion.component';
import ExitCardFlowVersion from '../nodes/exits/CadenceExitCardFlowVersion.component';

import {
  DestinationKind,
  TriggerIdentifier,
} from '#libs/sequential_marketing/constants';

import type {
  Cadence,
  ConnectedTrigger,
  CadenceStep,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type { StoredStep, StoredTrigger } from './types';
import type { SmartList } from '#libs/smart-list/types';
import type { EmailTemplateSummary } from '#libs/email-editor/types';
import type { Tag } from '#libs/tag/types';

export enum CustomNodesEnum {
  // Nodes for steps
  EntryStepFlowVersionNode = 'EntryStepFlowVersion',
  InnerStepFlowVersionNode = 'InnerStepFlowVersion',
  ExitCardFlowVersionNode = 'ExitCardFlowVersion',
  // Nodes for triggers
  TriggerCardFlowVersionNode = 'TriggerCardFlowVersion',
}

export enum NodeIdentifiersEnum {
  EXIT_NODE_IDENTIFIER = 'exit_node_element',
}

export const useNodeTypes = () => {
  // Memo mandatory
  // [DOCUMENTATION] : https://reactflow.dev/docs/guides/custom-nodes/#adding-the-node-type
  const nodeTypes = React.useMemo(() => {
    return {
      EntryStepFlowVersion,
      TriggerCardFlowVersion,
      InnerStepFlowVersion,
      ExitCardFlowVersion,
    };
  }, []);

  return { nodeTypes };
};

type NodeElementStoreProps = {
  steps: CadenceStep[];
  displayDisabledTriggers: boolean;
};

export const useStepsAndTriggersRecorder = ({
  steps,
  displayDisabledTriggers,
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

  return {
    storedEntryStep,
    storedTriggers,
    storedSteps,
  };
};

type NodeRendererProps = {
  cadence: Cadence;
  storedEntryStep: CadenceStep;
  storedSteps: StoredStep[];
  storedTriggers: Immutable.ImmutableArray<StoredTrigger>;
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
  getSmartlist: (id: number) => SmartList;
  getStepMarketingActions: (stepId: number) => StepMarketingActions[];
  getTag: (id: string) => Tag;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
  cadenceEditMode: boolean;
};

export const useNodeElementsRecorder = ({
  cadence,
  cadenceEditMode,
  storedEntryStep,
  storedSteps,
  storedTriggers,
  onClickEntryStep,
  enterSubscriptionMode,
  onClickConnectedTrigger,
  handleGetNodeConnectedEgdes,
  handleSelectedStepForEdition,
  deleteCadenceStep,
  deleteConnectedTrigger,
  getSmartlist,
  getStepMarketingActions,
  getTag,
  getEmailTemplate,
}: NodeRendererProps) => {
  const handleSelectEntryStepForSubscription = React.useCallback(
    () => enterSubscriptionMode(storedEntryStep),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storedEntryStep],
  );

  const onConnectToEntryStep = React.useCallback(
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
        type: CustomNodesEnum.EntryStepFlowVersionNode,
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
          triggerList: cadence.entries,
          disabled: !cadenceEditMode,
          marketingActionList: getStepMarketingActions?.(storedEntryStep?.id),
          onCardClick: () => onClickEntryStep(storedEntryStep), // TODO: code the onClickEntryStep function
          addNextStep: handleSelectEntryStepForSubscription,
          handleChangeInExit: () => {}, // TODO: code the changeInExit function
          addMarketingAction: () => {}, // TODO: code the newMA function
          getSmartlist,
          getTag,
          getEmailTemplate,
          onConnectToStep: onConnectToEntryStep,
        },
      };
    }
    return null;
  }, [
    storedEntryStep,
    cadence.entries,
    cadenceEditMode,
    getStepMarketingActions,
    handleSelectEntryStepForSubscription,
    onConnectToEntryStep,
    getSmartlist,
    getTag,
    getEmailTemplate,
    onClickEntryStep,
  ]);

  // The tiggerNodeElements consumes the list of storedTriggers data to draw the ConnectedTriggerElements on the graph.
  const triggerNodeElements = React.useMemo(() => {
    if (storedTriggers) {
      return storedTriggers.map((triggerNode) => ({
        id: triggerNode.trigger.trigger_config?.uuid,
        type: CustomNodesEnum.TriggerCardFlowVersionNode,
        ...(triggerNode?.trigger?.canvas?.position?.x &&
        triggerNode?.trigger.canvas?.position?.y
          ? {
              position: {
                x: parseFloat(triggerNode.trigger.canvas.position.x),
                y: parseFloat(triggerNode.trigger.canvas.position.y),
              },
            }
          : { position: { x: 400, y: 0 } }),
        data: {
          step: triggerNode.step,
          trigger: triggerNode.trigger,
          onCardClick: () =>
            onClickConnectedTrigger(triggerNode.step, triggerNode.trigger),
          onDelete: () =>
            deleteConnectedTrigger(
              cadence.id,
              triggerNode.trigger?.trigger_config?.uuid,
              triggerNode.trigger.destination_config.source_id,
            ),
          getSmartlist,
          disabled: !cadenceEditMode,
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
    getSmartlist,
  ]);

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

  const onConnectToInnerStep = React.useCallback(
    (stepNode: StoredStep) => (cadence_step_id: string) =>
      handleOnConnectedStep(cadence_step_id, stepNode),
    [handleOnConnectedStep],
  );

  // The stepNodeElements consumes the storedSteps data to draw the steps
  const stepNodeElements = React.useMemo(() => {
    if (storedSteps && storedSteps.length !== 0) {
      return storedSteps.map((stepNode) => ({
        id: stepNode?.id?.toString(),
        type: CustomNodesEnum.InnerStepFlowVersionNode,
        ...(stepNode?.canvas?.position?.x && stepNode?.canvas?.position?.y
          ? {
              position: {
                x: parseFloat(stepNode.canvas.position.x),
                y: parseFloat(stepNode.canvas.position.y),
              },
            }
          : { position: { x: 800, y: 0 } }),
        data: {
          step: stepNode,
          disabled: !cadenceEditMode,
          marketingActionList: getStepMarketingActions?.(stepNode?.id),
          onDelete: () => deleteCadenceStep(stepNode?.id),
          handleChangeInExit: () => {}, // TODO: code the changeInExit function
          addMarketingAction: () => {}, // TODO: code the newMA function
          addNextStep: () => enterSubscriptionMode(stepNode),
          onCardClick: () => {
            handleSelectedStepForEdition(stepNode?.id);
            handleGetNodeConnectedEgdes(stepNode?.id?.toString());
          },
          onConnectToStep: onConnectToInnerStep(stepNode),
          getTag,
          getEmailTemplate,
        },
      }));
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cadenceEditMode,
    storedSteps,
    handleOnConnectedStep,
    getTag,
    getEmailTemplate,
  ]);

  const storedTriggersToOutside = React.useMemo(
    () =>
      storedTriggers.filter(
        (storedTrigger) =>
          storedTrigger.trigger.destination_config.kind ===
          DestinationKind.STEP_TO_OUTSIDE,
      ),
    [storedTriggers],
  );

  // The exitNodeElements consumes the list of storedTriggersToOutside data to draw the ExitElements on the graph.
  const exitNodeElements = React.useMemo(() => {
    if (storedTriggersToOutside && storedTriggersToOutside?.length > 0) {
      return storedTriggersToOutside.map((triggerNode) => ({
        id: `exit_node_for_trigger_${triggerNode?.trigger?.trigger_config?.uuid}`,
        type: CustomNodesEnum.ExitCardFlowVersionNode,
        ...(triggerNode?.trigger?.canvas?.position?.x &&
        triggerNode?.trigger?.canvas?.position?.y
          ? {
              position: {
                x: parseFloat(triggerNode.trigger.canvas.position.x) + 400,
                y: parseFloat(triggerNode.trigger.canvas.position.y) + 25,
              },
            }
          : { position: { x: 1200, y: 0 } }),
        data: {
          step: triggerNode?.step,
          status: triggerNode?.trigger?.destination_config?.status,
          onDelete: () => {},
          handleChangeInStep: () => {},
          disabled: !cadenceEditMode,
        },
      }));
    }
    return [];
  }, [cadenceEditMode, storedTriggersToOutside]);

  return { entryNode, triggerNodeElements, stepNodeElements, exitNodeElements };
};
