import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import omit from 'lodash/omit';
import Immutable from 'seamless-immutable';
import EntryStepFlowVersion from '../nodes/steps/EntryStepFlowVersion.component';
import InnerStepFlowVersion from '../nodes/steps/InnerStepFlowVersion.component';
import TriggerCardFlowVersion from '../nodes/triggers/TriggerCardFlowVersion.component';
import ExitCardFlowVersion from '../nodes/exits/CadenceExitCardFlowVersion.component';

import {
  DestinationKind,
  DEFAULT_X_FOR_ENTRYSTEP,
  DEFAULT_X_FOR_EXIT,
  DEFAULT_X_FOR_INNERSTEP,
  DEFAULT_X_FOR_TRIGGER,
  TriggerKind,
  DestinationStatus,
} from '#libs/sequential_marketing/constants';
import { getDefaultValuesComplete } from './utils';
import { isTriggerFake } from '#libs/sequential_marketing/components/helpers/utils';

import type {
  Cadence,
  ConnectedTrigger,
  CadenceStep,
  GraphCanvas,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type { StoredStep, StoredTrigger } from './types';
import type { SmartList } from '#libs/smart-list/types';
import type { EmailTemplateSummary } from '#libs/email-editor/types';
import type { Tag } from '#libs/tag/types';
import type { StepEditionBubbleProps } from '../bubbles/StepEditionBubble.component';
import type { OptionCallback } from '../../../../../state/types';

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
  fakerTrigger?: StoredTrigger;
};

export const useStepsAndTriggersRecorder = ({
  steps,
  displayDisabledTriggers,
  fakerTrigger,
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
  // TODO: Avoid too long list with duplicated data by making trigger list uniq
  const storedTriggers = React.useMemo(() => {
    if (steps && steps.length !== 0) {
      const triggers = Immutable.from(
        steps.reduce<StoredTrigger[]>((acc, step) => {
          return acc.concat(
            (step?.exits || [])
              .filter((trigger) => displayDisabledTriggers || !trigger.disabled)
              .map((trig) =>
                Immutable({
                  step: { ...omit(step, ['exits']) },
                  trigger: Immutable(trig),
                }),
              ),
          );
        }, []),
      );
      if (fakerTrigger) {
        return triggers.concat(Immutable([fakerTrigger]));
      }
      return triggers;
    }
    // Enforcing the typing here to avoid default on any.
    return Immutable<StoredTrigger[]>([]);
  }, [steps, fakerTrigger, displayDisabledTriggers]);

  return {
    storedEntryStep,
    storedTriggers,
    storedSteps,
  };
};

type NodeRendererProps = {
  cadence: Cadence;
  cadenceEditMode: boolean;
  smartlists: Immutable.ImmutableArray<SmartList>;
  stepBubbleProps: Omit<StepEditionBubbleProps, 'step'>;
  storedEntryStep: CadenceStep;
  storedSteps: StoredStep[];
  storedTriggers: Immutable.ImmutableArray<StoredTrigger>;
  fakerTrigger?: StoredTrigger;
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
  deleteCadenceStep: (stepId: number) => void;
  deleteConnectedTrigger: (
    cadenceId: number,
    connectedTriggerUUID: string,
    sourceStepId: number,
  ) => void;
  editConnectedTrigger: (
    data: ConnectedTrigger,
    options?: OptionCallback<ConnectedTrigger>,
  ) => void;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
  getSmartlist: (id: number) => SmartList;
  getStepMarketingActions: (stepId: number) => StepMarketingActions[];
  getTag: (id: string) => Tag;
  handleCreateNewStepWithTrigger: (
    connected_trigger: ConnectedTrigger,
    options?: OptionCallback<number>,
  ) => void;
  handleGetNodeConnectedEgdes: (nodeId: string) => void;
  handleResetFakerTrigger: () => void;
  handleSelectedStepForEdition: (stepId: number) => void;
  handleUpdateFakerTrigger: (storedTrigger: StoredTrigger) => void;
  onClickConnectedTrigger: (
    step: StoredStep,
    connected_trigger: ConnectedTrigger,
  ) => void;
  onClickEntryStep: (step: CadenceStep) => void;
  resetAllSelection: () => void;
  upsertMarketingAction: (
    marketingAction: Partial<StepMarketingActions>,
  ) => void;
};

export const useNodeElementsRecorder = ({
  cadence,
  cadenceEditMode,
  smartlists,
  stepBubbleProps,
  storedEntryStep,
  storedSteps,
  storedTriggers,
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
  handleResetFakerTrigger,
  handleUpdateFakerTrigger,
  onClickConnectedTrigger,
  onClickEntryStep,
  upsertMarketingAction,
}: NodeRendererProps) => {
  const [stepToEditId, setStepToEditId] = React.useState<number | null>(null);

  const handleBeginStepEdition = React.useCallback(
    (stepId: number) => setStepToEditId(stepId),
    [],
  );

  const handleResetStepToEditId = React.useCallback(
    () => setStepToEditId(null),
    [],
  );

  const handleAddNextStepTrigger = React.useCallback(
    (stepNode: StoredStep) => (triggerKind: TriggerKind) => {
      const faker = getDefaultValuesComplete(
        triggerKind,
        stepNode,
        DestinationKind.STEP_TO_STEP,
      );
      handleUpdateFakerTrigger({
        step: stepNode,
        trigger: faker,
      });
    },
    [handleUpdateFakerTrigger],
  );

  const onConnectToInnerStep = React.useCallback(
    (stepNode: StoredStep) =>
      (destinationId: number, triggerKind: TriggerKind) => {
        if (destinationId) {
          const destinationStep = storedSteps.find(
            (step) => step.id === destinationId,
          );
          const faker = getDefaultValuesComplete(
            triggerKind,
            stepNode,
            DestinationKind.STEP_TO_STEP,
            destinationStep,
          );
          handleUpdateFakerTrigger({
            step: stepNode,
            trigger: faker,
          });
        }
      },
    [handleUpdateFakerTrigger, storedSteps],
  );

  // The EntryNode consumes the StoredEntryNode data to draw the initial step on the graph.
  const entryNode = React.useMemo(() => {
    if (storedEntryStep) {
      return {
        id: storedEntryStep.id.toString(),
        type: CustomNodesEnum.EntryStepFlowVersionNode,
        ...(storedEntryStep.canvas?.position?.x &&
        storedEntryStep.canvas?.position?.y
          ? {
              position: {
                x: parseFloat(storedEntryStep.canvas.position.x ?? '0'),
                y: parseFloat(storedEntryStep.canvas.position.y ?? '0'),
              },
            }
          : { position: { x: DEFAULT_X_FOR_ENTRYSTEP, y: 0 } }),
        data: {
          disabled: !cadenceEditMode,
          marketingActionList: getStepMarketingActions?.(storedEntryStep?.id),
          step: storedEntryStep,
          triggerList: cadence.entries,
          addMarketingAction: () => {}, // TODO: code the newMA function
          addNextStep: handleAddNextStepTrigger(storedEntryStep),
          getEmailTemplate,
          getSmartlist,
          getTag,
          onCardClick: () => onClickEntryStep(storedEntryStep), // TODO: code the onClickEntryStep function
          onConnectToStep: onConnectToInnerStep(storedEntryStep),
        },
      };
    }
    return null;
  }, [
    cadence.entries,
    cadenceEditMode,
    storedEntryStep,
    getEmailTemplate,
    getSmartlist,
    getStepMarketingActions,
    getTag,
    handleAddNextStepTrigger,
    onClickEntryStep,
    onConnectToInnerStep,
  ]);

  const handleConfirmTriggerBubble = React.useCallback(
    (trigger: ConnectedTrigger, options?: OptionCallback<ConnectedTrigger>) => {
      if (isTriggerFake(trigger)) {
        const updatedTrigger: ConnectedTrigger = {
          ...trigger,
          trigger_config: { ...trigger?.trigger_config, uuid: uuidv4() },
        };
        handleResetFakerTrigger();
        handleCreateNewStepWithTrigger(updatedTrigger, {
          onSuccess:
            !updatedTrigger.destination_config.destination_id &&
            handleBeginStepEdition,
        });
      } else {
        editConnectedTrigger(trigger, options);
      }
    },
    [
      editConnectedTrigger,
      handleBeginStepEdition,
      handleCreateNewStepWithTrigger,
      handleResetFakerTrigger,
    ],
  );

  // The tiggerNodeElements consumes the list of storedTriggers data to draw the ConnectedTriggerElements on the graph.
  const triggerNodeElements = React.useMemo(() => {
    if (storedTriggers) {
      return storedTriggers.map((triggerNode) => {
        return {
          id: triggerNode?.trigger?.trigger_config?.uuid,
          type: CustomNodesEnum.TriggerCardFlowVersionNode,
          ...(triggerNode?.trigger?.canvas?.position?.x &&
          triggerNode?.trigger?.canvas?.position?.y
            ? {
                position: {
                  x: parseFloat(triggerNode.trigger.canvas.position.x),
                  y: parseFloat(triggerNode.trigger.canvas.position.y),
                },
              }
            : { position: { x: DEFAULT_X_FOR_TRIGGER, y: 0 } }),
          data: {
            step: triggerNode?.step,
            trigger: triggerNode?.trigger,
            onCardClick: () =>
              onClickConnectedTrigger(triggerNode?.step, triggerNode?.trigger),
            onDelete: () =>
              deleteConnectedTrigger(
                cadence?.id,
                triggerNode?.trigger?.trigger_config?.uuid,
                triggerNode?.trigger?.destination_config?.source_id,
              ),
            getSmartlist,
            disabled: !cadenceEditMode,
            bubble: {
              smartlists,
              onConfirm: handleConfirmTriggerBubble,
            },
            resetFakerTrigger: handleResetFakerTrigger,
          },
        };
      });
    }
    return [];
    // To prevent rerender issue coming from the react flow lib :
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cadence,
    cadenceEditMode,
    storedTriggers,
    deleteConnectedTrigger,
    getSmartlist,
    handleResetFakerTrigger,
    onClickConnectedTrigger,
  ]);

  const handleCreateNewMarketingAction = React.useCallback(
    (newMarketingAction: Partial<StepMarketingActions>) =>
      upsertMarketingAction(newMarketingAction),
    [upsertMarketingAction],
  );

  const handleConvertIntoExit = React.useCallback(
    (stepNode: StoredStep) => (status: DestinationStatus) =>
      stepNode?.id && convertCadenceStepIntoExit(stepNode.id, status),
    [convertCadenceStepIntoExit],
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
          : { position: { x: DEFAULT_X_FOR_INNERSTEP, y: 0 } }),
        data: {
          step: stepNode,
          disabled: !cadenceEditMode,
          marketingActionList: getStepMarketingActions?.(stepNode?.id),
          bubble: stepBubbleProps,
          stepToEditId,
          addNextStep: handleAddNextStepTrigger(stepNode),
          createNewMarketingAction: handleCreateNewMarketingAction,
          endStepEdition: handleResetStepToEditId,
          getEmailTemplate,
          getTag,
          onConnectToStep: onConnectToInnerStep(stepNode),
          onDelete: () => deleteCadenceStep(stepNode?.id),
          submitConvertIntoExit: handleConvertIntoExit(stepNode),
        },
      }));
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cadenceEditMode,
    storedSteps,
    stepToEditId,
    getEmailTemplate,
    getTag,
    handleResetStepToEditId,
  ]);

  const storedTriggersToOutside = React.useMemo(
    () =>
      storedTriggers.filter(
        (storedTrigger) =>
          storedTrigger?.trigger?.destination_config?.kind ===
          DestinationKind.STEP_TO_OUTSIDE,
      ),
    [storedTriggers],
  );

  const handleConvertIntoStep = React.useCallback(
    (trigger: ConnectedTrigger) => (name: string) => {
      const canvas: GraphCanvas = {
        position: {
          x: (parseFloat(trigger?.canvas?.position?.x) + 400).toString(),
          y: trigger?.canvas?.position?.y,
        },
      };
      convertCadenceExitIntoStep(trigger?.trigger_config?.uuid, {
        name,
        canvas,
      });
    },
    [convertCadenceExitIntoStep],
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
          : { position: { x: DEFAULT_X_FOR_EXIT, y: 0 } }),
        data: {
          disabled: !cadenceEditMode,
          status: triggerNode?.trigger?.destination_config?.status,
          onDelete: () => {},
          submitConvertIntoStep: handleConvertIntoStep(triggerNode?.trigger),
        },
      }));
    }
    return [];
  }, [cadenceEditMode, handleConvertIntoStep, storedTriggersToOutside]);

  return { entryNode, triggerNodeElements, stepNodeElements, exitNodeElements };
};
