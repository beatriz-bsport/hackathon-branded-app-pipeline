import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import omit from 'lodash/omit';
import Immutable from 'seamless-immutable';

import {
  DestinationKind,
  InitialConfigurationStep,
  DEFAULT_X_FOR_ENTRYSTEP,
  DEFAULT_X_FOR_EXIT,
  DEFAULT_X_FOR_INNERSTEP,
  DEFAULT_X_FOR_TRIGGER,
  TriggerKind,
  DestinationStatus,
} from '#src/libs/sequential_marketing/constants';
import { isTriggerFake } from '#src/libs/sequential_marketing/components/helpers/utils';

import type {
  Cadence,
  CadenceStep,
  ConnectedTrigger,
  GraphCanvas,
  CadenceInitialConfiguration,
  StepMarketingActions,
  MarketingActionEssentials,
} from '#src/libs/sequential_marketing/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type { EmailTemplateSummary } from '#src/libs/email-editor/types';
import type { Tag } from '#src/libs/tag/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import type { OptionCallback } from '../../../../../state/types';
import type { StoredStep, StoredTrigger } from './types';
import { getConnectedTriggerDefaultValues } from './utils';
import ExitCardFlowVersion from '../nodes/exits/CadenceExitCardFlowVersion.component';
import TriggerCardFlowVersion from '../nodes/triggers/TriggerCardFlowVersion.component';
import InnerStepFlowVersion from '../nodes/steps/InnerStepFlowVersion.component';
import EntryStepFlowVersion from '../nodes/steps/EntryStepFlowVersion.component';

const { trackFormAdd } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Audience,
);

export enum CustomNodesEnum {
  // Nodes for steps
  EntryStepFlowVersionNode = 'EntryStepFlowVersion',
  InnerStepFlowVersionNode = 'InnerStepFlowVersion',
  ExitCardFlowVersionNode = 'ExitCardFlowVersion',
  // Nodes for triggers
  TriggerCardFlowVersionNode = 'TriggerCardFlowVersion',
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
      return notEntrySteps.map((step) => ({
        ...omit(step, ['exits']),
        hasExits: (step.exits ?? []).length > 0,
      }));
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
            (step?.exits ?? [])
              .filter((trigger) => displayDisabledTriggers || !trigger.disabled)
              .map(
                (trig) =>
                  Immutable({
                    step: { ...omit(step, ['exits']) },
                    trigger: Immutable(trig),
                  }) as StoredTrigger,
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
  initialConfiguration: CadenceInitialConfiguration;
  isEntryActionBubbleOpen: boolean;
  isEntryFirstConfiguration: boolean;
  smartlists: Immutable.ImmutableArray<SmartList>;
  marketingActionEssentials: MarketingActionEssentials;
  storedEntryStep: CadenceStep;
  storedSteps: StoredStep[];
  storedTriggers: Immutable.ImmutableArray<StoredTrigger>;
  fakerTrigger?: StoredTrigger;
  isDeleteStepDialogHidden: boolean;
  isDeleteExitDialogHidden: boolean;
  isConvertStepIntoExitDialogHidden: boolean;
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
  deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
  editConnectedTrigger: (
    data: ConnectedTrigger,
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
  submitMarketingActionForm: (data: {
    list: StepMarketingActions[];
    stepId: number;
  }) => void;
  updateCadenceStepName: (data: { name: string; stepId: number }) => void;
  upsertMarketingAction: (
    marketingAction: Partial<StepMarketingActions>,
  ) => void;
  doNotDisplayDeleteStepDialogAnymore: () => void;
  doNotDisplayDeleteExitDialogAnymore: () => void;
  doNotDisplayConvertStepIntoExitDialogAnymore: () => void;
  setInitialConfig: (data: CadenceInitialConfiguration) => void;
  setCurrentStepConfiguration: (
    currentStepConfiguration: InitialConfigurationStep,
  ) => void;
};

export const useNodeElementsRecorder = ({
  cadence,
  cadenceEditMode,
  initialConfiguration,
  isEntryActionBubbleOpen,
  isEntryFirstConfiguration,
  smartlists,
  marketingActionEssentials,
  storedEntryStep,
  storedSteps,
  storedTriggers,
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
  handleResetFakerTrigger,
  handleUpdateFakerTrigger,
  onClickConnectedTrigger,
  onClickEntryStep,
  setCurrentStepConfiguration,
  setInitialConfig,
  upsertMarketingAction,
  doNotDisplayDeleteStepDialogAnymore,
  doNotDisplayDeleteExitDialogAnymore,
  doNotDisplayConvertStepIntoExitDialogAnymore,
  submitMarketingActionForm,
  updateCadenceStepName,
}: NodeRendererProps) => {
  const [stepToEditId, setStepToEditId] = React.useState<number | null>(null);

  const isFirstConfigurationMode = !cadence.initialized;

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
      trackFormAdd(stepNode.cadence, {
        info: 'User opened the form to create a new trigger',
        triggerKind,
      });
      const faker = getConnectedTriggerDefaultValues({
        triggerKind,
        source: stepNode,
        destinationKind: DestinationKind.STEP_TO_STEP,
        isTemporary: true,
      });
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
          const faker = getConnectedTriggerDefaultValues({
            triggerKind,
            source: stepNode,
            destinationKind: DestinationKind.STEP_TO_STEP,
            destination: destinationStep,
            isTemporary: true,
          });
          handleUpdateFakerTrigger({
            step: stepNode,
            trigger: faker,
          });
        }
      },
    [handleUpdateFakerTrigger, storedSteps],
  );

  const handleConfirmEntryCriteriaBubble = React.useCallback(
    (value: ConnectedTrigger[]) => {
      const configuration = cadence.initialized
        ? {
            [InitialConfigurationStep.CADENCE_ENTRY_STEP]: {
              connectedTriggers: value,
            },
          }
        : {
            ...initialConfiguration,
            [InitialConfigurationStep.CADENCE_ENTRY_STEP]: {
              ...initialConfiguration[
                InitialConfigurationStep.CADENCE_ENTRY_STEP
              ],
              connectedTriggers: value,
            },
          };
      setInitialConfig(configuration);
    },
    [cadence.initialized, initialConfiguration, setInitialConfig],
  );

  const handleConfirmEntryActionBubble = React.useCallback(
    (value: StepMarketingActions[]) =>
      setInitialConfig({
        ...initialConfiguration,
        [InitialConfigurationStep.CADENCE_ENTRY_STEP]: {
          ...initialConfiguration[InitialConfigurationStep.CADENCE_ENTRY_STEP],
          marketingActions: value,
        },
      }),
    [initialConfiguration, setInitialConfig],
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
          marketingActionList: isFirstConfigurationMode
            ? initialConfiguration[InitialConfigurationStep.CADENCE_ENTRY_STEP]
                .marketingActions
            : getStepMarketingActions?.(storedEntryStep?.id),
          step: storedEntryStep,
          triggerList: isFirstConfigurationMode
            ? initialConfiguration[InitialConfigurationStep.CADENCE_ENTRY_STEP]
                .connectedTriggers
            : cadence.entries,
          isFirstConfigurationMode,
          isEntryActionBubbleOpen,
          isEntryFirstConfiguration,
          connectedTriggersBubble: {
            smartlists,
            onConfirm: handleConfirmEntryCriteriaBubble,
          },
          stepMemberCount: getStepMemberCountActions?.(storedEntryStep?.id),
          marketingActionEssentials,
          addNextStep: handleAddNextStepTrigger(storedEntryStep),
          deleteStepMarketingAction,
          getEmailTemplate,
          getSmartlist,
          getTag,
          onConnectToStep: onConnectToInnerStep(storedEntryStep),
          setCurrentStepConfiguration,
          submitMultipleMarketingActions: handleConfirmEntryActionBubble,
          upsertMarketingAction,
          ...(storedEntryStep.canvas?.position?.x &&
          storedEntryStep.canvas?.position?.y
            ? {
                position: {
                  x: parseFloat(storedEntryStep.canvas.position.x ?? '0'),
                  y: parseFloat(storedEntryStep.canvas.position.y ?? '0'),
                },
              }
            : { position: { x: DEFAULT_X_FOR_ENTRYSTEP, y: 0 } }),
        },
      };
    }
    return null;
    // To prevent rerender issue coming from the react flow lib :
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cadence.entries,
    cadenceEditMode,
    isEntryActionBubbleOpen,
    isEntryFirstConfiguration,
    smartlists,
    storedEntryStep,
    isFirstConfigurationMode,
    deleteStepMarketingAction,
    getEmailTemplate,
    getSmartlist,
    getStepMarketingActions,
    getStepMemberCountActions,
    getTag,
    handleAddNextStepTrigger,
    handleAddNextStepTrigger,
    handleConfirmEntryActionBubble,
    handleConfirmEntryCriteriaBubble,
    onClickEntryStep,
    onConnectToInnerStep,
    setCurrentStepConfiguration,
    upsertMarketingAction,
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

  const handleDeleteConnectedTrigger = React.useCallback(
    (connectedTrigger: ConnectedTrigger) => () => {
      cadence?.id &&
        connectedTrigger?.trigger_config?.uuid &&
        connectedTrigger.destination_config?.source_id &&
        deleteConnectedTrigger(
          cadence.id,
          connectedTrigger.trigger_config.uuid,
          connectedTrigger.destination_config.source_id,
        );
    },
    [cadence?.id, deleteConnectedTrigger],
  );

  /**
   * @description Checks whether a connected trigger can be deleted by testing it against the existing stored triggers.
   * @param {StoredTrigger} storedTriggerToTest - The connected trigger to be tested for deletion eligibility.
   * @returns {boolean} - Returns true if another connected trigger is directing to the same destination step,
   *                      allowing the provided connected trigger to be deleted.
   *                      Returns false if no other connected trigger leads to its destination step, indicating deletion is not allowed.
   *                      Also returns false if the connected trigger leads to an exit, indicating deletion is not allowed.
   */
  const connectedTriggerCanBeDeleted = React.useCallback(
    (storedTriggerToTest: StoredTrigger) => {
      if (!storedTriggerToTest?.trigger?.destination_config?.destination_id) {
        return false;
      }
      return !!storedTriggers?.find(
        (currentStoredTrigger) =>
          storedTriggerToTest.trigger.trigger_config.uuid !==
            currentStoredTrigger.trigger.trigger_config.uuid &&
          storedTriggerToTest.trigger.destination_config.destination_id ===
            currentStoredTrigger.trigger.destination_config.destination_id,
      );
    },
    [storedTriggers],
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
              onClickConnectedTrigger(
                triggerNode?.step,
                triggerNode?.trigger as ConnectedTrigger,
              ),
            onDelete: handleDeleteConnectedTrigger(
              triggerNode?.trigger as ConnectedTrigger,
            ),
            getSmartlist,
            disabled: !cadenceEditMode,
            canBeDeleted: connectedTriggerCanBeDeleted(
              triggerNode as StoredTrigger,
            ),
            bubble: {
              smartlists,
              onConfirm: handleConfirmTriggerBubble,
            },
            resetFakerTrigger: handleResetFakerTrigger,
            ...(triggerNode?.trigger?.canvas?.position?.x &&
            triggerNode?.trigger?.canvas?.position?.y
              ? {
                  position: {
                    x: parseFloat(triggerNode.trigger.canvas.position.x),
                    y: parseFloat(triggerNode.trigger.canvas.position.y),
                  },
                }
              : { position: { x: DEFAULT_X_FOR_TRIGGER, y: 0 } }),
          },
        };
      });
    }
    return [];
    // To prevent rerender issue coming from the react flow lib :
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cadenceEditMode,
    storedTriggers,
    connectedTriggerCanBeDeleted,
    deleteConnectedTrigger,
    getSmartlist,
    handleDeleteConnectedTrigger,
    handleResetFakerTrigger,
    onClickConnectedTrigger,
  ]);

  const handleConvertIntoExit = React.useCallback(
    (stepNode: StoredStep) => (status: DestinationStatus) =>
      stepNode?.id && convertCadenceStepIntoExit(stepNode.id, status),
    [convertCadenceStepIntoExit],
  );

  const handleDeleteCadenceStep = React.useCallback(
    (stepNode: StoredStep) => () =>
      stepNode?.id && deleteCadenceStep(stepNode.id),
    [deleteCadenceStep],
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
          marketingActionEssentials,
          stepToEditId,
          isDeleteStepDialogHidden,
          isConvertStepIntoExitDialogHidden,
          stepMemberCount: getStepMemberCountActions?.(stepNode?.id),
          addNextStep: handleAddNextStepTrigger(stepNode),
          deleteStepMarketingAction,
          doNotDisplayConvertStepIntoExitDialogAnymore,
          doNotDisplayDeleteStepDialogAnymore,
          endStepEdition: handleResetStepToEditId,
          getEmailTemplate,
          getTag,
          onConnectToStep: onConnectToInnerStep(stepNode),
          onDelete: handleDeleteCadenceStep(stepNode),
          submitConvertIntoExit: handleConvertIntoExit(stepNode),
          submitMarketingActionForm,
          updateCadenceStepName,
          upsertMarketingAction,
          ...(stepNode?.canvas?.position?.x && stepNode?.canvas?.position?.y
            ? {
                position: {
                  x: parseFloat(stepNode.canvas.position.x),
                  y: parseFloat(stepNode.canvas.position.y),
                },
              }
            : { position: { x: DEFAULT_X_FOR_INNERSTEP, y: 0 } }),
        },
      }));
    }
    return [];
    // To prevent rerender issue coming from the react flow lib :
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cadenceEditMode,
    storedSteps,
    isDeleteStepDialogHidden,
    isConvertStepIntoExitDialogHidden,
    stepToEditId,
    deleteStepMarketingAction,
    doNotDisplayConvertStepIntoExitDialogAnymore,
    doNotDisplayDeleteStepDialogAnymore,
    getEmailTemplate,
    getStepMemberCountActions,
    getTag,
    handleResetStepToEditId,
    submitMarketingActionForm,
    updateCadenceStepName,
    upsertMarketingAction,
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

  const handleEditCadenceExit = React.useCallback(
    (trigger: ConnectedTrigger) => (status: DestinationStatus) => {
      const updatedTrigger: ConnectedTrigger = {
        ...trigger,
        destination_config: { ...trigger?.destination_config, status },
      };
      editConnectedTrigger(updatedTrigger);
    },
    [editConnectedTrigger],
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
          onDelete: handleDeleteConnectedTrigger(
            triggerNode?.trigger as ConnectedTrigger,
          ),
          submitConvertIntoStep: handleConvertIntoStep(
            triggerNode?.trigger as ConnectedTrigger,
          ),
          editCadenceExit: handleEditCadenceExit(
            triggerNode?.trigger as ConnectedTrigger,
          ),
          ...(triggerNode?.trigger?.canvas?.position?.x &&
          triggerNode?.trigger?.canvas?.position?.y
            ? {
                position: {
                  x: parseFloat(triggerNode.trigger.canvas.position.x) + 400,
                  y: parseFloat(triggerNode.trigger.canvas.position.y) + 25,
                },
              }
            : { position: { x: DEFAULT_X_FOR_EXIT, y: 0 } }),
          isDeleteExitDialogHidden,
          doNotDisplayDeleteExitDialogAnymore,
        },
      }));
    }
    return [];
  }, [
    cadenceEditMode,
    handleConvertIntoStep,
    handleDeleteConnectedTrigger,
    handleEditCadenceExit,
    storedTriggersToOutside,
    isDeleteExitDialogHidden,
    doNotDisplayDeleteExitDialogAnymore,
  ]);

  return { entryNode, triggerNodeElements, stepNodeElements, exitNodeElements };
};
