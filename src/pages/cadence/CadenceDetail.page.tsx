// @ts-nocheck
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
} from '#libs/sequential_marketing/actions';

import {
  getAllSmartList,
  getSmartListDict,
} from '../../libs/smart-list/selectors';

import {
  DestinationStatus,
  CadencePanelMode,
} from '#libs/sequential_marketing/constants';
import { WithHandlerType } from '../../utils/types';
import {
  getCadenceOnlyActiveCTs,
  getCadenceStepList,
  getCadenceStep,
  getStepMarketingActionsByStepId,
  getStepMarketingActionsLoading,
  getStepMarketingActionsUpsertLoading,
} from '#libs/sequential_marketing/selectors';
import { OptionCallback } from '../../state/types';
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
} from '#libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';

import { NodeIdentifiersEnum } from '#libs/sequential_marketing/components/graph/hooks';

export const drawerWidth = 400;
export const headerHeight = 110;

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
    subscriptionDestination: number | string | null,
  ) => {
    this.displayNewStepParametersForm();
    this.props.setStepFormSubscription(step, {
      step:
        typeof subscriptionDestination !== 'string' && subscriptionDestination
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

  handleSubmitEditConnectedTrigger = (
    data: Values,
    options: OptionCallback,
  ) => {
    this.props.updateConnectedTrigger(data, options);
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
                goBack={this.props.backtoCadenceList}
                onEdit={this.props.updateCadenceName}
                onEditWinParameters={this.displayWinParametersForm}
                onEditLoseParameters={this.displayLoseParametersForm}
                onActivate={this.props.activateCadence}
                onShutOff={this.props.shutOffCadence}
                loading={this.props.loading}
                cadence={this.props.cadence}
                cadenceEditMode={this.props.cadenceEditMode}
                switchCadenceEditMode={this.switchCadenceEditMode}
                cadenceMinimalConfigurationState={
                  this.props.cadenceMinimalConfigurationState
                }
                smartlistById={this.props.smartlistById}
              />
            </div>
          </div>
          <div className={classes.mainPanelContent}>
            <CadenceGraphFlow
              cadence={this.props.cadence}
              smartlistById={this.props.smartlistById}
              steps={this.props.steps}
              updateCadenceStepCanvasPosition={
                this.props.updateCadenceStepCanvasPosition
              }
              updateConnectedTriggerPosition={
                this.props.updateCadenceStepConnectedTriggerCanvasPosition
              }
              onClickEntryStep={this.props.onClickEntryStep}
              handleSelectStepForSubscription={
                this.handleSelectStepForSubscription
              }
              cadenceMinimalConfigurationState={
                this.props.cadenceMinimalConfigurationState
              }
              stepNodeFakerSource={this.props.stepNodeFakerSource}
              onClickConnectedTrigger={this.handleClickConnectedTrigger}
              resetAllSelection={this.resetAllSelection}
              cadenceEditMode={this.props.cadenceEditMode}
              handleSelectedStepForEdition={this.handleSelectedStepForEdition}
              deleteCadenceStep={this.props.deleteCadenceStep}
              deleteConnectedTrigger={this.props.deleteConnectedTriggerAction}
            />
          </div>
        </div>
        <div className={classes.drawerDocker}>
          <div className={classes.drawerPaper}>
            <div
              className={classNames(
                classes.scrollable,
                classes.whiteGreyBorderContainer,
              )}
            >
              {/* Tool Panel Place Holder */}
            </div>
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
  stepNodeFakerSource: CadenceStep | null;
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
  stepNodeFakerSource: null,
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
      const notDestination =
        !subscriptionDestinationConfig?.step &&
        !subscriptionDestinationConfig.exit;
      return {
        stepForSubscription,
        subscriptionDestinationConfig,
        stepNodeFakerSource: notDestination ? stepForSubscription : null,
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
    stepNodeFakerSource: null,
    subscriptionDestinationConfig: {},
    triggerForEdition: { step: null, trigger: null },
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
          props.fetchCadenceStepListAction(
            { id__in: cadence.steps },
            { onSuccess: options?.onSuccess },
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
    (data: { name: string }, options?: OptionCallback) => {
      if (props.selectedStepIdForEdition) {
        props.updateCadenceStepAction(props.selectedStepIdForEdition, data, {
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

  deleteCadenceStep:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (stepId: number) => {
      if (stepId) {
        props.deleteCadenceStepAction(stepId, {
          onSuccess: props.retrieveCadence,
        });
      }
    },

  updateConnectedTrigger:
    (props: OwnProps & ConnectedPropsAndStateAndRefreshAll) =>
    (data: Values, options?: OptionCallback) => {
      if (
        props.triggerForEdition?.step?.id &&
        props.triggerForEdition?.trigger?.uuid
      ) {
        props.updateConnectedTriggerAction(
          props.cadenceId,
          props.triggerForEdition.trigger.uuid,
          props.triggerForEdition?.trigger?.canvas,
          { ...props.triggerForEdition, values: data },
          {
            onSuccess: () => {
              props.resetSubscriptionDestination();
              options && options.onSuccess && options.onSuccess();
              props.retrieveCadenceAction(props.cadenceId, {
                onSuccess: () => {
                  props.retrieveCadence();
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
    emailTemplatesList: getAllEmailTemplatesSummaries(state),
    emailTemplatesDetails: getEmailTemplatesDetail(state),
    emailListLoading: state.emailTemplate.loading,
    emailDetailLoading: state.emailTemplate.detail.loading,
    stepForEdition: getCadenceStep(state, selectedStepIdForEdition),
    getStepMarketingActions: (stepId: number) =>
      getStepMarketingActionsByStepId(state, stepId),
    stepMarketingActionsLoading: getStepMarketingActionsLoading(state),
    stepMarketingActionsUpsertLoading:
      getStepMarketingActionsUpsertLoading(state),
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
    fetchEmailTemplatesSummaries: () => emailTemplatesSummaries(),
    fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
    updateCadenceStepAction,
    deleteCadenceStepAction,
    fetchMarketingActionsAction,
    upsertStepMarketingAtionsAction,
    deleteStepMarketingActionAction,
    deleteConnectedTriggerAction,
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
      width: `calc(100% - ${drawerWidth}px)`,
    },
    header: {
      height: `${headerHeight}px`,
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
    drawerDocker: {
      flex: '0 0 auto',
    },
    drawerPaper: {
      width: drawerWidth,
      position: 'fixed',
      display: 'inherit',
      zIndex: 200,
      overflowX: 'hidden',
      overflowY: 'auto',
      left: 'auto',
      flex: '1 0 100%',
      height: '100%',
      outline: 0,
      flexDirection: 'column',
    },
    stickyTop: {
      position: 'sticky',
    },
    mainPanelContent: {
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'hidden',
      maxHeight: '100%',
      height: `calc(100vh - ${headerHeight}px)`,
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
