import React, { Component } from 'react';
import { push as pushRouter } from 'connected-react-router';
import classNames from 'classnames';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import withTitle from '#hocs/with-title.hoc';
// @ts-expect-error : Not typed hoc
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import {
  retrieveCadence as retrieveCadenceAction,
  fetchCadenceStepList as fetchCadenceStepListAction,
  setInitialCadenceConfiguration as setInitialCadenceConfigurationAction,
  updateInitialCadenceConfiguration as updateInitialCadenceConfigurationAction,
  updateCadence as updateCadenceAction,
  activateCadence as activateCadenceAction,
  shutOffCadence as shutOffCadenceAction,
  updateCadenceStepCanvasPosition as updateCadenceStepCanvasPositionAction,
  updateCadenceStepConnectedTriggerCanvasPosition as updateCadenceStepConnectedTriggerCanvasPositionAction,
  subscribeStepToStep as subscribeStepToStepAction,
  updateConnectedTrigger as updateConnectedTriggerAction,
  updateCadenceStep as updateCadenceStepAction,
  deleteCadenceStep as deleteCadenceStepAction,
  fetchMarketingActions as fetchMarketingActionsAction,
  upsertStepMarketingAtions as upsertStepMarketingAtionsAction,
  deleteStepMarketingAction as deleteStepMarketingActionAction,
  deleteConnectedTrigger as deleteConnectedTriggerAction,
  modifyStepMarketingActionsConfiguration as modifyStepMarketingActionsConfigurationAction,
} from '#libs/sequential_marketing/actions';

import {
  getAllSmartList,
  getSmartList,
  getSmartListDict,
} from '../../libs/smart-list/selectors';

import {
  DestinationStatus,
  CadencePanelMode,
} from '#libs/sequential_marketing/constants';
import type { WithHandlerType } from '../../utils/types';
import {
  getCadenceOnlyActiveCTs,
  getCadenceStepList,
  getCadenceStep,
  getStepMarketingActionsByStepId,
  getStepMarketingActionsLoading,
  getStepMarketingActionsUpsertLoading,
} from '#libs/sequential_marketing/selectors';
import type { OptionCallback } from '../../state/types';
import type {
  Cadence,
  ConnectedTrigger,
  CadenceStep,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import CadenceDetailHeader from '#libs/sequential_marketing/components/CadenceDetailHeader.component';
import { fetchAllSmartLists } from '#libs/smart-list/actions';
import CadenceGraphFlow from '#libs/sequential_marketing/components/graph/CadenceGraphFlow.component';
import {
  CADENCE_STEPPER_ENTRY_STEP,
  CADENCE_STEPPER_WIN_STEP,
  CADENCE_STEPPER_LOSE_STEP,
} from '#libs/sequential_marketingDEPRECATED/components/form/CadenceSettingsFormStepper.component';
// This import stays on deprecated. Value wll be completly differrent after refactor.
import type { Values } from '#libs/sequential_marketingDEPRECATED/components/form/Trigger/components';
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

import { NodeIdentifiersEnum } from '#libs/sequential_marketing/components/graph/hooks';
import { HEADER_HEIGHT } from '#libs/sequential_marketing/constants/graph';
import {
  getResolvedGenericTags,
  getTagCategories,
} from '#libs/notification-rule/selectors';
import {
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
  fetchTagList as fetchTagListAction,
} from '#libs/notification-rule/actions';

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

export class CadenceDetailPage extends Component<Props> {
  componentDidMount(): void {
    if (this.props.cadenceId) {
      this.props.retrieveCadence();
    }
    this.props.fetchAllSmartLists();
    this.props.fetchEmailTemplatesSummaries();
    this.props.setCadenceMinimalConfigurationState(
      this.getCadenceMinimalConfigurationState(),
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
      const {
        cadenceWinConfigured,
        cadenceLoseConfigured,
        cadenceEntryConfigured,
      } = this.getCadenceMinimalConfigurationState();
      this.props.setCadenceMinimalConfigurationState({
        cadenceWinConfigured,
        cadenceLoseConfigured,
        cadenceEntryConfigured,
      });
      if (!cadenceWinConfigured || !cadenceLoseConfigured) {
        this.props.setCadenceEditMode(false);
        this.props.setRightPanelMode(
          CadencePanelMode.CADENCE_PANEL_INTIAL_PARAMETERS,
        );
      } else if (!this.props.selectedStepIdForEdition) {
        this.props.setRightPanelMode(CadencePanelMode.CADENCE_PANEL_HOW_TO);
      }
    }
  }

  getCadenceMinimalConfigurationState = () => {
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

  handleSelectStepForSubscription = (
    step: CadenceStep,
    subscriptionDestination?: number | string | null,
  ) => {
    this.displayNewStepParametersForm();
    this.props.setStepFormSubscription(step, {
      step:
        subscriptionDestination && typeof subscriptionDestination !== 'string'
          ? subscriptionDestination
          : null,
      exit:
        subscriptionDestination === NodeIdentifiersEnum.EXIT_NODE_IDENTIFIER,
    });
  };

  handleSelectedStepForEdition = (step_id: number) => {
    this.displayEditStepForm();
    this.props.fetchMarketingActions(step_id);
    this.props.setSelectedStepIdForEdition(step_id);
  };

  handleSubmitNewStepWithTrigger = (data: Values, options?: OptionCallback) => {
    this.props.subscribeStepToStep(data, {
      onSuccess: (step_id: number) => {
        options.onSuccess();
        this.handleSelectedStepForEdition(step_id);
      },
    });
  };

  handleEditConnectedTrigger = (
    trigger: ConnectedTrigger,
    options: OptionCallback,
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

  setInitialCadenceConfiguration = (
    data: {
      [CADENCE_STEPPER_ENTRY_STEP]?: Values | {};
      [CADENCE_STEPPER_WIN_STEP]?: Values | {};
      [CADENCE_STEPPER_LOSE_STEP]?: Values | {};
    },
    options?: OptionCallback,
  ) => {
    this.props.setInitialCadenceConfiguration(data, {
      onSuccess: () => {
        this.props.retrieveCadence();
        options?.onSuccess && options.onSuccess();
      },
      onError: () => {
        this.props.retrieveCadence();
        options?.onError && options.onError();
      },
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.pageContainer}>
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
                cadenceMinimalConfigurationState={
                  this.props.cadenceMinimalConfigurationState
                }
                goBack={this.props.backtoCadenceList}
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
              cadenceMinimalConfigurationState={
                this.props.cadenceMinimalConfigurationState
              }
              deleteCadenceStep={this.props.deleteCadenceStep}
              deleteConnectedTrigger={this.props.deleteConnectedTriggerAction}
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
              getTag={this.props.getTag}
              handleSelectedStepForEdition={this.handleSelectedStepForEdition}
              handleSelectStepForSubscription={
                this.handleSelectStepForSubscription
              }
              onClickConnectedTrigger={this.handleClickConnectedTrigger}
              onClickEntryStep={this.props.onClickEntryStep}
              resetAllSelection={this.resetAllSelection}
              resolvedGenericTags={this.props.resolvedGenericTags}
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
            />
          </div>
        </div>
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
  cadenceMinimalConfigurationState: {
    cadenceEntryConfigured: boolean;
    cadenceWinConfigured: boolean;
    cadenceLoseConfigured: boolean;
  };
  triggerForEdition: {
    trigger: ConnectedTrigger | null;
    step: CadenceStep | null;
  };
  cadenceEditMode: boolean;
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
  triggerForEdition: { trigger: null, step: null },
  cadenceEditMode: false,
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
    (cadenceMinimalConfigurationState: {
      cadenceWinConfigured: boolean;
      cadenceLoseConfigured: boolean;
      cadenceEntryConfigured: boolean;
    }) => ({ cadenceMinimalConfigurationState }),

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
  updateCadenceName:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: { name: string }, options?: OptionCallback) => {
      props.updateCadenceAction(props.cadenceId, data, {
        onSuccess: () => {
          options && options.onSuccess && options.onSuccess();
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
    },

  updateCadenceStepName:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: { name: string; stepId: number }, options?: OptionCallback) => {
      if (props.selectedStepIdForEdition) {
        props.updateCadenceStepAction(data.stepId, data, {
          onSuccess: () => {
            options && options.onSuccess && options.onSuccess();
          },
          onError: () => {
            options && options.onError && options.onError();
          },
        });
      }
    },

  activateCadence:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (options?: OptionCallback) => {
      props.activateCadenceAction(props.cadenceId, {
        onSuccess: () => {
          options && options.onSuccess && options.onSuccess();
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
    },

  shutOffCadence:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (options?: OptionCallback) => {
      props.shutOffCadenceAction(props.cadenceId, {
        onSuccess: () => {
          options && options.onSuccess && options.onSuccess();
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
    },

  setInitialCadenceConfiguration:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (
      data: {
        [CADENCE_STEPPER_ENTRY_STEP]?: Values | {};
        [CADENCE_STEPPER_WIN_STEP]?: Values | {};
        [CADENCE_STEPPER_LOSE_STEP]?: Values | {};
      },
      options?: OptionCallback,
    ) => {
      props.setInitialCadenceConfigurationAction(props.cadenceId, data, {
        onSuccess: () => {
          props.setCadenceEditMode(true);
          options && options.onSuccess && options.onSuccess();
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
    },

  updateInitialCadenceConfiguration:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (
      data: {
        [CADENCE_STEPPER_ENTRY_STEP]?: Values | {};
        [CADENCE_STEPPER_WIN_STEP]?: Values | {};
        [CADENCE_STEPPER_LOSE_STEP]?: Values | {};
      },
      options?: OptionCallback,
    ) => {
      props.updateInitialCadenceConfigurationAction(props.cadenceId, data, {
        onSuccess: () => {
          options && options.onSuccess && options.onSuccess();
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
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
          options && options.onSuccess && options.onSuccess();
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
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
            options && options.onSuccess && options.onSuccess();
          },
          onError: () => {
            options && options.onError && options.onError();
          },
        },
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
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: Values, options?: OptionCallback<number>) => {
      if (props.stepForSubscription?.id) {
        // TODO : Need to find a way to position correctly element on creation
        props.subscribeStepToStepAction(
          props.cadenceId,
          props.stepForSubscription,
          {
            ...data,
            ...(props.subscriptionDestinationConfig?.step
              ? { step: props.subscriptionDestinationConfig?.step }
              : {}),
          },
          {
            onSuccess: (step) => {
              props.resetSubscriptionDestination();
              props.retrieveCadence({
                onSuccess: () => {
                  options &&
                    options.onSuccess &&
                    options.onSuccess(
                      step.connected_trigger?.destination_config
                        ?.destination_id,
                    );
                },
              });
            },
            onError: () => {
              props.resetSubscriptionDestination();
              options && options.onError && options.onError();
            },
          },
        );
      }
    },

  updateStepMarketingActionList:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: { list: StepMarketingActions[]; step: number }) => {
      props.modifyStepMarketingActionsConfigurationAction(data);
    },

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
    (trigger: ConnectedTrigger, options?: OptionCallback) => {
      props.updateConnectedTriggerAction(
        props.cadenceId,
        trigger?.trigger_config?.uuid,
        trigger,
        {
          onSuccess: () => {
            props.resetSubscriptionDestination();
            options?.onSuccess?.();
            props.retrieveCadenceAction(props.cadenceId, {
              onSuccess: () => {
                props.retrieveCadence();
              },
            });
          },
          onError: () => {
            props.resetSubscriptionDestination();
            options?.onError?.();
          },
        },
      );
    },

  fetchMarketingActions:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (stepId: number, options?: OptionCallback) => {
      if (stepId) {
        props.fetchMarketingActionsAction(
          { cadence_step: stepId },
          {
            onSuccess: () => {
              options && options.onSuccess && options.onSuccess();
            },
            onError: () => {
              options && options.onError && options.onError();
            },
          },
        );
      }
    },

  upsertStepMarketingAtions:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: StepMarketingActions, options?: OptionCallback) => {
      if (data) {
        props.upsertStepMarketingAtionsAction(data, {
          onSuccess: () => {
            options && options.onSuccess && options.onSuccess();
          },
          onError: () => {
            options && options.onError && options.onError();
          },
        });
      }
    },

  deleteStepMarketingAction:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: { id: number; stepId: number }) => {
      props.deleteStepMarketingActionAction(data);
    },
};

const connector = connect(
  (
    state: RootState,
    { cadenceId, selectedStepIdForEdition }: OwnProps & StateHandlerType,
  ) => ({
    cadence: getCadenceOnlyActiveCTs(state, cadenceId),
    steps: getCadenceStepList(state, cadenceId),
    loading: state.cadenceWIP.cadence.loading || state.cadenceWIP.step.loading,
    smartlists: getAllSmartList(state),
    smartlistById: getSmartListDict(state),
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    stepForEdition: getCadenceStep(state, selectedStepIdForEdition),
    getStepMarketingActions: (stepId: number) =>
      getStepMarketingActionsByStepId(state, stepId),
    stepMarketingActionsLoading: getStepMarketingActionsLoading(state),
    stepMarketingActionsUpsertLoading:
      getStepMarketingActionsUpsertLoading(state),
    getSmartlist: (id: number) => getSmartList(state, id),
    getTag: (id: string) => getTag(state, id),
    // EMAILS
    emailDetailList: getEmailTemplatesDetail(state),
    emailDetailListLoading: state.emailTemplate.detail.loading,
    emailSummaryList: getAllEmailTemplatesSummaries(state),
    emailSummaryListLoading: state.emailTemplate.loading,
    getEmailTemplate: (id: string) => getEmailTemplateSummary(state, id),
    // TAGS
    resolvedGenericTags: getResolvedGenericTags(state),
    tagCategories: getTagCategories(state),
  }),
  {
    retrieveCadenceAction,
    fetchCadenceStepListAction,
    updateCadenceAction,
    activateCadenceAction,
    shutOffCadenceAction,
    setInitialCadenceConfigurationAction,
    updateInitialCadenceConfigurationAction,
    subscribeStepToStepAction,
    updateConnectedTriggerAction,
    backtoCadenceList: () => pushRouter('/cadence'),
    fetchAllSmartLists,
    updateCadenceStepCanvasPositionAction,
    updateCadenceStepConnectedTriggerCanvasPositionAction,
    updateCadenceStepAction,
    deleteCadenceStepAction,
    fetchMarketingActionsAction,
    upsertStepMarketingAtionsAction,
    deleteStepMarketingActionAction,
    deleteConnectedTriggerAction,
    modifyStepMarketingActionsConfigurationAction,
    // EMAILS
    fetchEmailTemplatesSummaries: () => emailTemplatesSummaries(),
    fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
    fetchEmailSummaryList: emailTemplatesSummaries,
    fetchEmailDetail: emailTemplateComplete,
    // TAGS
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    fetchTagList: fetchTagListAction,
  },
);

const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      marginTop: -theme.spacing(2),
      backgroudColor: 'black',
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
    return cadence && cadence.name ? `${cadence.name}` : '';
  }),
)(CadenceDetailPage);
