import React, { Component } from 'react';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import classNames from 'classnames';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Theme, WithStyles } from '@material-ui/core/styles';

import Config from '../../config';
import withTitle from '#hocs/with-title.hoc';
// @ts-expect-error : Not typed hoc
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import {
  retrieveCadence as retrieveCadenceAction,
  fetchCadenceStepList as fetchCadenceStepListAction,
  setCadenceInitialConfiguration as setCadenceInitialConfigurationAction,
  updateCadenceInitialConfiguration as updateCadenceInitialConfigurationAction,
  updateCadence as updateCadenceAction,
  activateCadence as activateCadenceAction,
  shutOffCadence as shutOffCadenceAction,
  updateCadenceStepCanvasPosition as updateCadenceStepCanvasPositionAction,
  convertCadenceStepIntoExit as convertCadenceStepIntoExitAction,
  updateCadenceStepConnectedTriggerCanvasPosition as updateCadenceStepConnectedTriggerCanvasPositionAction,
  convertCadenceExitIntoStep as convertCadenceExitIntoStepAction,
  subscribeStepToStep as subscribeStepToStepAction,
  updateConnectedTrigger as updateConnectedTriggerAction,
  updateCadenceStepName as updateCadenceStepNameAction,
  deleteCadenceStep as deleteCadenceStepAction,
  fetchMarketingActions as fetchMarketingActionsAction,
  upsertStepMarketingAction as upsertStepMarketingActionAction,
  deleteStepMarketingAction as deleteStepMarketingActionAction,
  deleteConnectedTrigger as deleteConnectedTriggerAction,
  modifyStepMarketingActionsConfiguration as modifyStepMarketingActionsConfigurationAction,
} from '#libs/sequential_marketing/actions';

import {
  doNotDisplayDeleteStepDialogAnymore as doNotDisplayDeleteStepDialogAnymoreAction,
  doNotDisplayConvertStepIntoExitDialogAnymore as doNotDisplayConvertStepIntoExitDialogAnymoreAction,
  doNotDisplayPauseDialogAnymore as doNotDisplayPauseDialogAnymoreAction,
  doNotDisplayWelcomeDialogAnymore as doNotDisplayWelcomeDialogAnymoreAction,
} from '#libs/user-preference/actions';
import {
  getIsDeleteStepDialogHidden,
  getIsConvertStepIntoExitDialogHidden,
  getIsPauseDialogHidden,
  getDoNotDisplayCadenceWelcomeDialog,
} from '#libs/user-preference/selectors';

import {
  getAllSmartList,
  getSmartList,
  getSmartListDict,
} from '#libs/smart-list/selectors';
import {
  CadencePanelMode,
  DestinationStatus,
  InitialConfigurationStep,
  TriggerKind,
  HEADER_HEIGHT,
  LOST_OUTPUT_TIMEOUT_TRIGGER_ID,
  DestinationKind,
} from '#libs/sequential_marketing/constants';
import {
  getCadenceOnlyActiveCTs,
  getCadenceStepList,
  getCadenceStep,
  getStepMarketingActionsByStepId,
  getStepMarketingActionsLoading,
  getStepMarketingActionsUpsertLoading,
  getStepMemberCount,
} from '#libs/sequential_marketing/selectors';

import type { WithHandlerType } from '../../utils/types';
import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';
import type {
  Cadence,
  ConnectedTrigger,
  CadenceStep,
  StepMarketingActions,
  GraphCanvas,
  CadenceInitialConfigurationState,
  CadenceInitialConfiguration,
} from '#libs/sequential_marketing/types';

import CadenceDetailHeader from '#libs/sequential_marketing/components/CadenceDetailHeader.component';
import { fetchAllSmartLists } from '#libs/smart-list/actions';
import CadenceGraphFlow from '#libs/sequential_marketing/components/graph/CadenceGraphFlow.component';
import {
  emailTemplatesSummaries,
  emailTemplateDetail,
  emailTemplateComplete,
} from '#libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
  getEmailTemplateSummary,
} from '#libs/email-editor/selectors';
import { getAllTagsWithTagGroup, getTag } from '#libs/tag/selectors';

import { getHorizontalPositionFromSource } from '#libs/sequential_marketing/components/graph/hooks';
import {
  getResolvedGenericTags,
  getTagCategories,
} from '#libs/notification-rule/selectors';
import {
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
  fetchTagList as fetchTagListAction,
} from '#libs/notification-rule/actions';

import { hasUpsell } from '#libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_CADENCE,
} from '#libs/platform-billing/upsell-identifiers';

import UpsellBlocker from '#libs/platform-billing/components/UpsellBlocker.component';
import CadenceUtilityDialog, {
  DialogVariant,
} from '#libs/sequential_marketing/components/dialogs/DialogUtility';

import CustomStarIcon from '#components/icons/CustomStarIcon.component';
import { isCadenceInitialConfigurationCompleted } from '#libs/sequential_marketing/utils';
import {
  updateConnectedTriggerUuid,
  getConnectedTriggerDefaultValues,
} from '#libs/sequential_marketing/components/graph/hooks/utils';

type OwnProps = {
  cadenceId: number;
};

type StateHandlerType = typeof StateHandlersInit &
  WithHandlerType<typeof StateHandlersSetter>;

type ConnectedPropsAndState = ConnectedProps<typeof connector> &
  StateHandlerType;

type ConnectedPropsAndStateAndRefreshAll = ConnectedPropsAndState &
  WithHandlerType<typeof mapRefreshAllHandler>;

type Props = OwnProps &
  ConnectedPropsAndStateAndRefreshAll &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  StateHandlerType &
  WithTranslation;

/**
 * Component for handling different cases where the detail shouldn't be accessed.
 */
const ContentWrapper = ({
  children,
  cadence,
  loading,
  cadenceRetrieveError,
  cadenceId,
}: {
  cadenceId: number;
  cadence: Cadence;
  loading: boolean;
  cadenceRetrieveError: Error | null;
  children: React.JSX.Element;
}) => {
  const dialogContainer = document?.getElementById(
    'cadence-detail-page-container',
  );

  // If still loading, render the children
  if (loading) {
    return children;
  }
  // If cadence retrieval encountered an error or cadenceId is not a number, block access
  if (cadenceRetrieveError || Number.isNaN(cadenceId)) {
    return (
      <CadenceUtilityDialog
        open
        BackdropProps={{
          style: { position: 'absolute' },
        }}
        dialogContainer={dialogContainer}
        variant={DialogVariant.BLOCK_UNACCESSIBLE_WORKFLOW}
      />
    );
  }

  // If cadence is archived, block access
  if (cadence?.archived) {
    return (
      <CadenceUtilityDialog
        open
        BackdropProps={{ style: { position: 'absolute' } }}
        dialogContainer={dialogContainer}
        variant={DialogVariant.BLOCK_ARCHIVED_WORKFLOW}
      />
    );
  }

  return <>{children}</>;
};
export class CadenceDetailPage extends Component<Props> {
  componentDidMount(): void {
    if (this.props.cadenceId) {
      this.props.retrieveCadence();
    }
    this.props.fetchAllSmartLists();
    this.props.fetchEmailTemplatesSummaries();
    const minimalConfigration = this.getCadenceMinimalConfigurationState();
    this.props.setCadenceMinimalConfigurationState(minimalConfigration);
    this.props.setCurrentStepConfigurationFromCadenceMinimalConfiguration(
      minimalConfigration,
    );
    this.props.fetchTagList();
    this.props.fetchResolvedGenericTags();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.cadence &&
        this.props.cadence &&
        prevProps.cadence !== this.props.cadence) ||
      (prevProps.loading && !this.props.loading)
    ) {
      const minimalConfigration = this.getCadenceMinimalConfigurationState();
      this.props.setCadenceMinimalConfigurationState(minimalConfigration);
      this.props.setCurrentStepConfigurationFromCadenceMinimalConfiguration(
        minimalConfigration,
      );
      this.props.setIsWelcomeDialogOpen(
        !this.props.cadence.initialized &&
          !this.props.doNotDisplayWelcomeDialog,
      );
      if (
        !minimalConfigration.cadenceWinConfigured ||
        !minimalConfigration.cadenceLoseConfigured
      ) {
        this.props.setCadenceEditMode(false);
        this.props.setRightPanelMode(
          CadencePanelMode.CADENCE_PANEL_INTIAL_PARAMETERS,
        );
      } else if (!this.props.selectedStepIdForEdition) {
        this.props.setRightPanelMode(CadencePanelMode.CADENCE_PANEL_HOW_TO);
      }
    }
  }

  getCadenceMinimalConfigurationState =
    (): CadenceInitialConfigurationState => {
      const cadenceWinConfigured =
        (this.props.cadence?.exits || []).filter(
          (exit: ConnectedTrigger) =>
            exit?.destination_config?.status === DestinationStatus.WIN,
        ).length !== 0;

      const cadenceLoseConfigured =
        (this.props.cadence?.exits || []).filter(
          (exit: ConnectedTrigger) =>
            exit?.destination_config?.status === DestinationStatus.FAIL,
        ).length !== 0;

      const cadenceEntryConfigured =
        !!this.props.cadence?.entries &&
        this.props.cadence?.entries?.filter(
          (entry: ConnectedTrigger) => !entry.disabled,
        )?.length !== 0;

      return {
        cadenceWinConfigured,
        cadenceLoseConfigured,
        cadenceEntryConfigured,
      };
    };

  displayEntryParametersForm = () =>
    this.props.setRightPanelMode(
      CadencePanelMode.CADENCE_PANEL_ENTRY_PARAMETERS,
    );

  displayWinParametersForm = () =>
    this.props.setRightPanelMode(CadencePanelMode.CADENCE_PANEL_WIN_PARAMETERS);

  displayLoseParametersForm = () =>
    this.props.setRightPanelMode(
      CadencePanelMode.CADENCE_PANEL_LOSE_PARAMETERS,
    );

  displayNewStepParametersForm = () =>
    this.props.setRightPanelMode(CadencePanelMode.CADENCE_PANEL_NEW_STEP);

  displayEditTriggerForm = () =>
    this.props.setRightPanelMode(CadencePanelMode.CADENCE_PANEL_EDIT_TRIGGER);

  displayEditStepForm = () =>
    this.props.setRightPanelMode(CadencePanelMode.CADENCE_EDIT_STEP);

  handleSelectedStepForEdition = (step_id: number) => {
    this.displayEditStepForm();
    this.props.fetchMarketingActions(step_id);
    this.props.setSelectedStepIdForEdition(step_id);
  };

  handleCreateNewStepWithTrigger = (
    connected_trigger: ConnectedTrigger,
    options?: OptionCallback<number>,
  ) => {
    this.props.subscribeStepToStep(connected_trigger, {
      ...options,
      onSuccess: (stepId) => {
        options?.onSuccess?.(stepId);
      },
    });
  };

  handleEditConnectedTrigger = (
    trigger: ConnectedTrigger,
    options: OptionCallback<ConnectedTrigger>,
  ) => {
    this.props.updateConnectedTrigger(trigger, options);
  };

  handleClickConnectedTrigger = (
    step: CadenceStep,
    trigger: ConnectedTrigger,
  ) => {
    this.displayEditTriggerForm();
    this.props.setTriggerForEdition(step, trigger);
  };

  resetAllSelection = () => {
    this.props.resetSubscriptionDestination();
    this.props.setRightPanelMode(CadencePanelMode.CADENCE_PANEL_HOW_TO);
  };

  switchCadenceEditMode = () => {
    this.props.setCadenceEditMode(!this.props.cadenceEditMode);
    this.props.setRightPanelMode(CadencePanelMode.CADENCE_PANEL_HOW_TO);
  };

  setCadenceInitialConfiguration = (
    initialConfig: CadenceInitialConfiguration,
    save?: boolean,
  ) => {
    if (this.props.cadence.initialized) {
      this.props.updateCadenceInitialConfiguration(initialConfig, {
        onSuccess: () => this.props.retrieveCadence(),
        onError: () => this.props.retrieveCadence(),
      });
    } else {
      this.props.setInitialConfigurationState(initialConfig);
      this.props.setCadenceMinimalConfigurationState({
        cadenceWinConfigured:
          initialConfig[InitialConfigurationStep.CADENCE_WIN_STEP]
            .connectedTriggers?.length > 0,
        cadenceLoseConfigured:
          initialConfig[InitialConfigurationStep.CADENCE_LOSE_STEP]
            .connectedTriggers?.length > 0,
        cadenceEntryConfigured:
          initialConfig[InitialConfigurationStep.CADENCE_ENTRY_STEP]
            .connectedTriggers?.length > 0,
      });
      if (
        isCadenceInitialConfigurationCompleted(
          this.props.cadenceMinimalConfigurationState,
        ) &&
        save
      ) {
        this.props.setCadenceInitialConfiguration(initialConfig, {
          onSuccess: (entryStepId: number) => {
            this.props.updateStepMarketingActionList(
              {
                list:
                  initialConfig[
                    InitialConfigurationStep.CADENCE_ENTRY_STEP
                  ].marketingActions?.map((action) => ({
                    ...action,
                    id: null,
                    cadence_step: entryStepId,
                  })) ?? [],
                stepId: entryStepId,
              },
              {
                onSuccess: () => this.props.retrieveCadence(),
                onError: () => this.props.retrieveCadence(),
              },
            );
          },
          onError: () => this.props.retrieveCadence(),
        });
      }
    }
  };

  handleUpsertStepMarketingAction = (
    marketingAction: Partial<StepMarketingActions>,
  ) => this.props.upsertStepMarketingAction(marketingAction);

  closeWelcomeDialog = (isChecked?: boolean) => {
    this.props.setIsWelcomeDialogOpen(false);
    isChecked && this.props.doNotDisplayWelcomeDialogAnymore();
  };

  isPushNotificationUpsellActive = () =>
    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'
      ? hasUpsell(this.props.featureList, UPSELL_IDENTIFIER_PUSH_NOTIFICATION)
      : true;

  render() {
    const { classes } = this.props;

    // If isWelcomeDialogOpen is set to null, it indicates that it hasn't been defined yet,
    // and we don't want the configuration to start without determining whether the dialog should appear or not.
    const isEntryFirstConfiguration =
      this.props.isWelcomeDialogOpen !== null &&
      !this.props.isWelcomeDialogOpen &&
      !this.props.cadence.initialized &&
      !this.props.cadenceMinimalConfigurationState.cadenceEntryConfigured;

    return (
      <div className={classes.pageContainer} id="cadence-detail-page-container">
        <UpsellBlocker
          CustomIconComponent={<CustomStarIcon />}
          upsellIdentifier={UPSELL_IDENTIFIER_CADENCE}
        />
        <ContentWrapper
          cadence={this.props.cadence}
          cadenceId={this.props.cadenceId}
          cadenceRetrieveError={this.props.cadenceRetrieveError}
          loading={this.props.loading}
        >
          <>
            <div className={classes.mainPanel}>
              <div className={classes.stickyTop}>
                <div
                  className={classNames(
                    classes.whiteGreyBorderContainer,
                    classes.header,
                  )}
                >
                  <CadenceDetailHeader
                    cadence={this.props.cadence}
                    cadenceEditMode={this.props.cadenceEditMode}
                    doNotDisplayPauseDialogAnymore={
                      this.props.doNotDisplayPauseDialogAnymore
                    }
                    goBack={this.props.backtoCadenceList}
                    isPauseDialogHidden={this.props.isPauseDialogHidden}
                    loading={this.props.loading}
                    onActivate={this.props.activateCadence}
                    onEdit={this.props.updateCadenceName}
                    onShutOff={this.props.shutOffCadence}
                    switchCadenceEditMode={this.switchCadenceEditMode}
                  />
                </div>
              </div>
              <div className={classes.mainPanelContent}>
                <CadenceGraphFlow
                  cadence={this.props.cadence}
                  cadenceEditMode={this.props.cadenceEditMode}
                  convertCadenceExitIntoStep={
                    this.props.convertCadenceExitIntoStep
                  }
                  convertCadenceStepIntoExit={
                    this.props.convertCadenceStepIntoExit
                  }
                  currentStepConfiguration={this.props.currentStepConfiguration}
                  deleteCadenceStep={this.props.deleteCadenceStep}
                  deleteConnectedTrigger={
                    this.props.deleteConnectedTriggerAction
                  }
                  deleteStepMarketingAction={
                    this.props.deleteStepMarketingAction
                  }
                  doNotDisplayConvertStepIntoExitDialogAnymore={
                    this.props.doNotDisplayConvertStepIntoExitDialogAnymore
                  }
                  doNotDisplayDeleteStepDialogAnymore={
                    this.props.doNotDisplayDeleteStepDialogAnymore
                  }
                  editConnectedTrigger={this.handleEditConnectedTrigger}
                  emailDetailList={this.props.emailDetailList}
                  emailDetailListLoading={this.props.emailDetailListLoading}
                  emailSummaryList={this.props.emailSummaryList}
                  emailSummaryListLoading={this.props.emailSummaryListLoading}
                  fetchEmailSummaryList={this.props.fetchEmailSummaryList}
                  getEmailDetail={this.props.fetchEmailDetail}
                  getEmailTemplate={this.props.getEmailTemplate}
                  getSmartlist={this.props.getSmartlist}
                  getStepMarketingActions={this.props.getStepMarketingActions}
                  getStepMemberCountActions={
                    this.props.getStepMemberCountActions
                  }
                  getTag={this.props.getTag}
                  handleCreateNewStepWithTrigger={
                    this.handleCreateNewStepWithTrigger
                  }
                  handleSelectedStepForEdition={
                    this.handleSelectedStepForEdition
                  }
                  initialConfiguration={this.props.initialConfigurationValues}
                  isConvertStepIntoExitDialogHidden={
                    this.props.isConvertStepIntoExitDialogHidden
                  }
                  isDeleteStepDialogHidden={this.props.isDeleteStepDialogHidden}
                  isEntryFirstConfiguration={isEntryFirstConfiguration}
                  isPushNotificationUpsellActive={this.isPushNotificationUpsellActive()}
                  onClickConnectedTrigger={this.handleClickConnectedTrigger}
                  onClickEntryStep={this.props.onClickEntryStep}
                  resetAllSelection={this.resetAllSelection}
                  resolvedGenericTags={this.props.resolvedGenericTags}
                  setCurrentStepConfiguration={
                    this.props.setCurrentStepConfigurationState
                  }
                  setInitialConfig={this.setCadenceInitialConfiguration}
                  smartlists={this.props.smartlists}
                  steps={this.props.steps}
                  submitMarketingActionForm={
                    this.props.updateStepMarketingActionList
                  }
                  tagCategories={this.props.tagCategories}
                  tagList={this.props.allTagsWithTagGroup}
                  updateCadenceStepCanvasPosition={
                    this.props.updateCadenceStepCanvasPosition
                  }
                  updateCadenceStepName={this.props.updateCadenceStepName}
                  updateConnectedTriggerPosition={
                    this.props.updateCadenceStepConnectedTriggerCanvasPosition
                  }
                  upsertMarketingAction={this.handleUpsertStepMarketingAction}
                />
              </div>
            </div>
          </>
        </ContentWrapper>
        <CadenceUtilityDialog
          onCancel={this.props.backtoCadenceList}
          onConfirm={this.closeWelcomeDialog}
          open={this.props.isWelcomeDialogOpen}
          variant={DialogVariant.WELCOME}
        />
      </div>
    );
  }
}

type StateHandlerInit = {
  rightPanelMode: CadencePanelMode;
  stepForSubscription: CadenceStep | null;
  selectedStepIdForEdition: number | null;
  subscriptionDestinationConfig: {
    step?: number | null;
    exit?: boolean;
  };
  cadenceMinimalConfigurationState: CadenceInitialConfigurationState;
  initialConfigurationValues: CadenceInitialConfiguration;
  currentStepConfiguration: InitialConfigurationStep | null;
  triggerForEdition: {
    trigger: ConnectedTrigger | null;
    step: CadenceStep | null;
  };
  cadenceEditMode: boolean;
  isWelcomeDialogOpen: boolean | null;
};

const StateHandlersInit: StateHandlerInit = {
  rightPanelMode: CadencePanelMode.CADENCE_PANEL_HOW_TO,
  stepForSubscription: null,
  selectedStepIdForEdition: null,
  subscriptionDestinationConfig: {},
  cadenceMinimalConfigurationState: {
    cadenceEntryConfigured: false,
    cadenceWinConfigured: false,
    cadenceLoseConfigured: false,
  },
  initialConfigurationValues: {
    [InitialConfigurationStep.CADENCE_ENTRY_STEP]: { connectedTriggers: [] },
    [InitialConfigurationStep.CADENCE_WIN_STEP]: { connectedTriggers: [] },
    [InitialConfigurationStep.CADENCE_LOSE_STEP]: {
      connectedTriggers: [
        getConnectedTriggerDefaultValues({
          triggerKind: TriggerKind.ONLY_TIMEOUT,
          triggerUuid: LOST_OUTPUT_TIMEOUT_TRIGGER_ID,
          destinationKind: DestinationKind.CADENCE_TO_OUTSIDE,
          destinationStatus: DestinationStatus.FAIL,
        }),
      ],
    },
  },
  currentStepConfiguration: null,
  triggerForEdition: { trigger: null, step: null },
  cadenceEditMode: false,
  isWelcomeDialogOpen: null,
};

const StateHandlersSetter = {
  setRightPanelMode: () => (rightPanelMode: CadencePanelMode) => {
    return { rightPanelMode };
  },

  setStepFormSubscription:
    () =>
    (
      stepForSubscription: CadenceStep | null,
      subscriptionDestinationConfig: {
        step?: number | null;
        exit?: boolean;
      },
    ) => {
      return {
        stepForSubscription,
        subscriptionDestinationConfig,
      };
    },

  setCadenceMinimalConfigurationState:
    () =>
    (cadenceMinimalConfigurationState: CadenceInitialConfigurationState) => ({
      cadenceMinimalConfigurationState,
    }),

  setInitialConfigurationState:
    () => (initialConfigurationValues: CadenceInitialConfiguration) => ({
      initialConfigurationValues,
    }),

  setCurrentStepConfigurationState:
    () => (currentStepConfiguration: InitialConfigurationStep) => ({
      currentStepConfiguration,
    }),

  setCurrentStepConfigurationFromCadenceMinimalConfiguration:
    () =>
    (cadenceMinimalConfigurationState: CadenceInitialConfigurationState) => {
      if (cadenceMinimalConfigurationState) {
        if (!cadenceMinimalConfigurationState.cadenceEntryConfigured)
          return {
            currentStepConfiguration:
              InitialConfigurationStep.CADENCE_ENTRY_STEP,
          };
        if (!cadenceMinimalConfigurationState.cadenceWinConfigured)
          return {
            currentStepConfiguration: InitialConfigurationStep.CADENCE_WIN_STEP,
          };
        if (!cadenceMinimalConfigurationState.cadenceLoseConfigured)
          return {
            currentStepConfiguration:
              InitialConfigurationStep.CADENCE_LOSE_STEP,
          };
      }
      return {};
    },

  resetSubscriptionDestination: () => () => ({
    subscriptionDestinationConfig: {},
    triggerForEdition: {
      step: null as CadenceStep,
      trigger: null as ConnectedTrigger,
    },
  }),

  setTriggerForEdition:
    () => (step: CadenceStep, trigger: ConnectedTrigger) => {
      return {
        triggerForEdition: {
          step,
          trigger,
        },
      };
    },

  setCadenceEditMode: () => (cadenceEditMode: boolean) => ({
    cadenceEditMode,
  }),

  setSelectedStepIdForEdition: () => (selectedStepIdForEdition: number) => ({
    selectedStepIdForEdition,
  }),

  setIsWelcomeDialogOpen: () => (isWelcomeDialogOpen: boolean) => ({
    isWelcomeDialogOpen,
  }),
};

const mapRefreshAllHandler = {
  retrieveCadence:
    (props: OwnProps & ConnectedPropsAndState) =>
    (options?: OptionCallback) => {
      props.retrieveCadenceAction(props.cadenceId, {
        onSuccess: (cadence) => {
          props.fetchMarketingActionsAction({ cadence: cadence.id });
          props.fetchCadenceStepListAction(
            { id__in: cadence.steps },
            { onSuccess: () => options?.onSuccess?.() },
          );
        },
      });
    },
};

const mapWithHandlers = {
  backtoCadenceList:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) => () =>
      props.push('/audience/wip'),

  updateCadenceName:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: { name: string }, options?: OptionCallback) => {
      props.updateCadenceAction(props.cadenceId, data, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },

  updateCadenceStepName:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: { name: string; stepId: number }) =>
      props.updateCadenceStepNameAction(data.stepId, data.name),

  activateCadence:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (options?: OptionCallback) => {
      props.activateCadenceAction(props.cadenceId, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },

  shutOffCadence:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (options?: OptionCallback) => {
      props.shutOffCadenceAction(props.cadenceId, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },

  setCadenceInitialConfiguration:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (
      initialConfiguration: CadenceInitialConfiguration,
      options?: OptionCallback<number>,
    ) => {
      props.setCadenceInitialConfigurationAction(
        props.cadenceId,
        {
          ...initialConfiguration,
          [InitialConfigurationStep.CADENCE_LOSE_STEP]: {
            connectedTriggers: initialConfiguration[
              InitialConfigurationStep.CADENCE_LOSE_STEP
            ].connectedTriggers?.map((trigger) =>
              trigger?.trigger_config?.uuid === LOST_OUTPUT_TIMEOUT_TRIGGER_ID
                ? updateConnectedTriggerUuid(trigger)
                : trigger,
            ),
          },
        },
        {
          onSuccess: (cadence: Cadence) => {
            props.setCadenceEditMode(true);
            options?.onSuccess?.(cadence.entrypoint_step_id);
          },
          onError: () => {
            options?.onError?.();
          },
        },
      );
    },

  updateCadenceInitialConfiguration:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (
      initialConfiguration: CadenceInitialConfiguration,
      options?: OptionCallback<number>,
    ) => {
      props.updateCadenceInitialConfigurationAction(
        props.cadenceId,
        initialConfiguration,
        {
          onSuccess: () => options?.onSuccess?.(),
          onError: () => options?.onError?.(),
        },
      );
    },

  updateCadenceStepCanvasPosition:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (
      id: number,
      position: { x: number; y: number },
      options?: OptionCallback,
    ) => {
      props.updateCadenceStepCanvasPositionAction(id, position, {
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },

  convertCadenceStepIntoExit:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (id: number, status: DestinationStatus) => {
      props.convertCadenceStepIntoExitAction(id, status);
    },

  updateCadenceStepConnectedTriggerCanvasPosition:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (
      id: number,
      position: { ct_uuid: string; x: number; y: number },
      options?: OptionCallback,
    ) => {
      props.updateCadenceStepConnectedTriggerCanvasPositionAction(
        props.cadenceId,
        position,
        {
          onSuccess: () => {
            options?.onSuccess?.();
          },
          onError: () => {
            options?.onError?.();
          },
        },
      );
    },

  convertCadenceExitIntoStep:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (triggerUuid: string, step: { name: string; canvas: GraphCanvas }) => {
      props.convertCadenceExitIntoStepAction(
        props.cadenceId,
        triggerUuid,
        step,
      );
    },

  onClickEntryStep:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (step: CadenceStep) => {
      if (step?.is_entrypoint) {
        props.setRightPanelMode(
          CadencePanelMode.CADENCE_PANEL_ENTRY_PARAMETERS,
        );
      }
    },

  subscribeStepToStep:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll & WithTranslation) =>
    (connected_trigger: ConnectedTrigger, options?: OptionCallback<number>) => {
      // TODO : Need to find a way to position correctly element on creation
      props.subscribeStepToStepAction(
        props.cadenceId,
        {
          connected_trigger,
          ...(!connected_trigger?.destination_config?.destination_id
            ? {
                step: {
                  id: null,
                  name: props.t('cadence.steps.defaultName'),
                  canvas: {
                    position: {
                      x: getHorizontalPositionFromSource(
                        connected_trigger?.canvas,
                      ),
                      y: connected_trigger?.canvas?.position?.y,
                    },
                  },
                },
              }
            : {}),
        },
        {
          onSuccess: (step) => {
            props.resetSubscriptionDestination();
            props.retrieveCadence({
              onSuccess: () =>
                options?.onSuccess?.(
                  step?.connected_trigger?.destination_config?.destination_id,
                ),
            });
          },
          onError: (err) => {
            props.resetSubscriptionDestination();
            options?.onError?.(err);
          },
        },
      );
    },

  updateStepMarketingActionList:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (
      data: { list: StepMarketingActions[]; stepId: number },
      options?: OptionCallback<StepMarketingActions[]>,
    ) =>
      props.modifyStepMarketingActionsConfigurationAction(data, options),

  deleteCadenceStep:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (stepId: number) => {
      if (stepId) {
        props.deleteCadenceStepAction(stepId, {
          onSuccess: () => props.retrieveCadence?.(),
        });
      }
    },

  updateConnectedTrigger:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (trigger: ConnectedTrigger, options?: OptionCallback<ConnectedTrigger>) => {
      props.updateConnectedTriggerAction(
        props.cadenceId,
        trigger?.trigger_config?.uuid,
        trigger,
        options,
      );
    },

  fetchMarketingActions:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (stepId: number, options?: OptionCallback) => {
      if (stepId) {
        props.fetchMarketingActionsAction(
          { cadence_step: stepId },
          {
            onSuccess: () => options?.onSuccess?.(),
            onError: () => options?.onError?.(),
          },
        );
      }
    },

  upsertStepMarketingAction:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (
      data: Partial<StepMarketingActions>,
      options?: OptionCallback<StepMarketingActions>,
    ) =>
      data && props.upsertStepMarketingActionAction(data, options),

  doNotDisplayDeleteStepDialogAnymore:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) => () => {
      props.doNotDisplayDeleteStepDialogAnymoreAction(props.cadenceId);
    },

  doNotDisplayConvertStepIntoExitDialogAnymore:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) => () => {
      props.doNotDisplayConvertStepIntoExitDialogAnymoreAction(props.cadenceId);
    },

  doNotDisplayPauseDialogAnymore:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) => () => {
      props.doNotDisplayPauseDialogAnymoreAction(props.cadenceId);
    },

  doNotDisplayWelcomeDialogAnymore:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) => () => {
      props.doNotDisplayWelcomeDialogAnymoreAction();
    },

  deleteStepMarketingAction:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: { id: number; stepId: number }) =>
      props.deleteStepMarketingActionAction(data),
};

const connector = connect(
  (
    state: RootState,
    { cadenceId, selectedStepIdForEdition }: OwnProps & StateHandlerType,
  ) => ({
    // CADENCES
    cadence: getCadenceOnlyActiveCTs(state, cadenceId),
    steps: getCadenceStepList(state, cadenceId),
    loading: state.cadenceWIP.cadence.loading || state.cadenceWIP.step.loading,
    stepForEdition: getCadenceStep(state, selectedStepIdForEdition),
    stepMarketingActionsLoading: getStepMarketingActionsLoading(state),
    stepMarketingActionsUpsertLoading:
      getStepMarketingActionsUpsertLoading(state),
    getStepMemberCountActions: (stepId: number) =>
      getStepMemberCount(state, stepId),
    getStepMarketingActions: (stepId: number) =>
      getStepMarketingActionsByStepId(state, stepId),
    // SMARTLISTS
    smartlists: getAllSmartList(state),
    isDeleteStepDialogHidden: getIsDeleteStepDialogHidden(state, cadenceId),
    isConvertStepIntoExitDialogHidden: getIsConvertStepIntoExitDialogHidden(
      state,
      cadenceId,
    ),
    isPauseDialogHidden: getIsPauseDialogHidden(state, cadenceId),
    doNotDisplayWelcomeDialog: getDoNotDisplayCadenceWelcomeDialog(state),
    smartlistById: getSmartListDict(state),
    getSmartlist: (id: number) => getSmartList(state, id),
    // EMAILS
    emailDetailList: getEmailTemplatesDetail(state),
    emailDetailListLoading: state.emailTemplate.detail.loading,
    emailSummaryList: getAllEmailTemplatesSummaries(state),
    emailSummaryListLoading: state.emailTemplate.loading,
    getEmailTemplate: (id: string) => getEmailTemplateSummary(state, id),
    // NOTIFICATION RULE TAGS (USED FOR EMAILS)
    resolvedGenericTags: getResolvedGenericTags(state),
    tagCategories: getTagCategories(state),
    // TAGS (USED FOR MEMBERS)
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    getTag: (id: string) => getTag(state, id),
    featureList: state.company.feature.data,
    cadenceRetrieveError: state.cadenceWIP.cadence.error,
  }),
  {
    push: pushRouter,
    // CADENCES
    activateCadenceAction,
    convertCadenceExitIntoStepAction,
    convertCadenceStepIntoExitAction,
    deleteCadenceStepAction,
    deleteConnectedTriggerAction,
    deleteStepMarketingActionAction,
    doNotDisplayConvertStepIntoExitDialogAnymoreAction,
    doNotDisplayDeleteStepDialogAnymoreAction,
    doNotDisplayPauseDialogAnymoreAction,
    doNotDisplayWelcomeDialogAnymoreAction,
    fetchCadenceStepListAction,
    fetchMarketingActionsAction,
    modifyStepMarketingActionsConfigurationAction,
    retrieveCadenceAction,
    setCadenceInitialConfigurationAction,
    shutOffCadenceAction,
    subscribeStepToStepAction,
    updateCadenceAction,
    updateCadenceStepCanvasPositionAction,
    updateCadenceStepConnectedTriggerCanvasPositionAction,
    updateCadenceStepNameAction,
    updateConnectedTriggerAction,
    updateCadenceInitialConfigurationAction,
    upsertStepMarketingActionAction,
    // SMARTLISTS
    fetchAllSmartLists,
    // EMAILS
    fetchEmailTemplatesSummaries: () => emailTemplatesSummaries(),
    fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
    fetchEmailSummaryList: emailTemplatesSummaries,
    fetchEmailDetail: emailTemplateComplete,
    // NOTIFICATION RULE TAGS (USED FOR EMAILS)
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    fetchTagList: fetchTagListAction,
  },
);

const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      display: 'flex',
      width: '100%',
      height: '100%',
      marginTop: -theme.spacing(2),
      backgroudColor: 'black',
      position: 'relative',
    },
    whiteGreyBorderContainer: {
      backgroundColor: 'white',
      borderColor: '#E0E0E0',
      border: '1px solid',
    },
    mainPanel: {
      float: 'left',
      width: '100%',
    },
    header: {
      height: HEADER_HEIGHT,
    },
    scrollable: {
      display: 'flex',
      overflow: 'auto',
      minHeight: '100vh',
      hight: '100%',
      marginRight: '-50px',
      paddingRight: '50px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      // Safari, Chrom, Opera : hide scrollbar
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      // Ie and Edge : hide scrollbar
      '-ms-overflow-style': 'none',
      // Firefox : hide scrollbar
      scrollbarWidth: 'none',
      maxHeight: '100vh',
    },
    stickyTop: {
      position: 'sticky',
    },
    mainPanelContent: {
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'hidden',
      maxHeight: '100%',
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    },
  });

export default compose(
  routerParamsToProps({ cadenceId: 'cadenceId:number' }),
  withTranslation('marketing'),
  withStyles(styles),
  withStateHandlers(StateHandlersInit, StateHandlersSetter),
  connector,
  withHandlers(mapRefreshAllHandler),
  withHandlers(mapWithHandlers),
  withTitle(({ cadence }: { cadence: Cadence }) => {
    return cadence?.name || '';
  }),
)(CadenceDetailPage);
