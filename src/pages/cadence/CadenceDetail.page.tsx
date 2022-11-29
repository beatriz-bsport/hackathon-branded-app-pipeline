import React, { Component } from 'react';
import { push as pushRouter } from 'connected-react-router';
import classNames from 'classnames';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import withTitle from '#hocs/with-title.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import {
  retrieveCadence as retrieveCadenceAction,
  fetchCadenceStepList as fetchCadenceStepListAction,
  upsertCadenceConfiguration as upsertCadenceConfigurationAction,
  updateCadence as updateCadenceAction,
  activateCadence as activateCadenceAction,
  shutOffCadence as shutOffCadenceAction,
  updateCadenceStepCanvasPosition as updateCadenceStepCanvasPositionAction,
  updateCadenceStepConnectedTriggerCanvasPosition as updateCadenceStepConnectedTriggerCanvasPositionAction,
  subscribeStepToStep as subscribeStepToStepAction,
  updateConnectedTrigger as updateConnectedTriggerAction,
  updateCadenceStep as updateCadenceStepAction,
  deleteCadenceStep as deleteCadenceStepAction,
} from '#libs/sequential_marketing/actions';

import { getAllSmartList } from '../../libs/smart-list/selectors';

import {
  CadenceDestinationEnum,
  CadencePanelMode,
} from '#libs/sequential_marketing/constants';
import { WithHandlerType } from '../../utils/types';
import {
  getCadenceOnlyActiveCTs,
  withSteps,
  withSmartLists,
  getCadenceStep,
} from '#libs/sequential_marketing/selectors';
import { OptionCallback } from '../../state/types';
import type {
  Cadence,
  CadenceConnectedTriggerConfig,
  CadenceStep,
} from '#libs/sequential_marketing/types';
import CadenceDetailHeader from '#libs/sequential_marketing/components/CadenceDetailHeader.component';
import CadenceToolsPanel from '#libs/sequential_marketing/components/CadenceToolsPanel.component';
import { fetchAllSmartLists } from '#libs/smart-list/actions';
import CadenceGraphFlow from '#libs/sequential_marketing/components/graph/CadenceGraphFlow.component';
import {
  CADENCE_STEPPER_ENTRY_STEP,
  CADENCE_STEPPER_WIN_STEP,
  CADENCE_STEPPER_LOSE_STEP,
} from '#libs/sequential_marketing/components/form/CadenceSettingsFormStepper.component';
import type { Values } from '#libs/sequential_marketing/components/form/Trigger/components';
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

type Props = OwnProps &
  ConnectedPropsAndState &
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
    this.props.setCadenceWinAndLoseConfiguration(this.cadenceConfiguration());
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.cadence &&
      this.props.cadence &&
      prevProps.cadence !== this.props.cadence
    ) {
      const { cadenceWinConfigured, cadenceLoseConfigured } =
        this.cadenceConfiguration();
      this.props.setCadenceWinAndLoseConfiguration({
        cadenceWinConfigured,
        cadenceLoseConfigured,
      });
      if (!cadenceWinConfigured || !cadenceLoseConfigured) {
        this.props.setCadenceEditMode(false);
        this.props.setRightPanelMode(
          CadencePanelMode.CADENCE_PANEL_INTIAL_PARAMETERS,
        );
      }
    }
  }

  cadenceConfiguration = () => {
    const cadenceWinConfigured =
      (this.props.cadence?.exits || []).filter(
        (exit: CadenceConnectedTriggerConfig) =>
          exit?.destination_config?.status ===
          CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_SUCCESS_STATUS,
      ).length !== 0;

    const cadenceLoseConfigured =
      (this.props.cadence?.exits || []).filter(
        (exit: CadenceConnectedTriggerConfig) =>
          exit?.destination_config?.status ===
          CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_FAIL_STATUS,
      ).length !== 0;

    return {
      cadenceWinConfigured,
      cadenceLoseConfigured,
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

  displayMarketingActionsParametersForm = () => {
    this.props.setStepFormSubscription(null, null);
    this.props.setRightPanelMode(
      CadencePanelMode.CADENCE_PANEL_MARKETING_ACTIONS,
    );
  };

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
    this.props.setSelectedStepIdForEdition(step_id);
  };

  handleSubmitNewStepWithTrigger = (data: Values, options?: OptionCallback) => {
    this.props.subscribeStepToStep(data, options);
  };

  handleSubmitEditConnectedTrigger = (
    data: Values,
    options: OptionCallback,
  ) => {
    this.props.updateConnectedTrigger(data, options);
  };

  handleClickConnectedTrigger = (
    step: CadenceStep,
    trigger: CadenceConnectedTriggerConfig,
  ) => {
    this.displayEditTriggerForm();
    this.props.setTriggerForEdition(step, trigger);
  };

  resetAllSelection = () => {
    this.props.resetSubscriptionDestination();
    this.props.setRightPanelMode(CadencePanelMode.CADENCE_PANEL_INITIAL);
  };

  switchCadenceEditMode = () =>
    this.props.setCadenceEditMode(!this.props.cadenceEditMode);

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
              />
            </div>
          </div>
          <div className={classes.mainPanelContent}>
            <CadenceGraphFlow
              cadence={this.props.cadence}
              updateCadenceStepCanvasPosition={
                this.props.updateCadenceStepCanvasPosition
              }
              updateConnectedTriggerPosition={
                this.props.updateCadenceStepConnectedTriggerCanvasPosition
              }
              onClickEntryStep={this.props.onClickStepItem}
              handleSelectStepForSubscription={
                this.handleSelectStepForSubscription
              }
              handleEditMarketingActions={
                this.displayMarketingActionsParametersForm
              }
              cadenceWinAndLoseConfiguration={
                this.props.cadenceWinAndLoseConfiguration
              }
              stepNodeFakerSource={this.props.stepNodeFakerSource}
              onClickConnectedTrigger={this.handleClickConnectedTrigger}
              resetAllSelection={this.resetAllSelection}
              cadenceEditMode={this.props.cadenceEditMode}
              handleSelectedStepForEdition={this.handleSelectedStepForEdition}
              deleteCadenceStep={this.props.deleteCadenceStepAction}
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
              <CadenceToolsPanel
                loading={this.props.loading}
                cadence={this.props.cadence}
                mode={this.props.rightPanelMode}
                smartlists={this.props.smartlists}
                getEmails={this.props.fetchEmailTemplatesSummaries}
                emails={this.props.email_templates_list}
                getEmailDetail={this.props.fetchEmailTemplateDetail}
                emailDetails={this.props.email_templates_details}
                emailListLoading={this.props.emailListLoading}
                emailDetailLoading={this.props.emailDetailLoading}
                setUpFormSubmit={this.props.upsertCadenceConfiguration}
                handleSubmitNewStepWithTrigger={
                  this.handleSubmitNewStepWithTrigger
                }
                handleSubmitEditConnectedTrigger={
                  this.handleSubmitEditConnectedTrigger
                }
                stepForSubscription={this.props.stepForSubscription}
                subscriptionDestinationConfig={
                  this.props.subscriptionDestinationConfig
                }
                tagList={this.props.allTagsWithTagGroup}
                cadenceWinAndLoseConfiguration={
                  this.props.cadenceWinAndLoseConfiguration
                }
                triggerForEdition={this.props.triggerForEdition}
                cadenceEditMode={this.props.cadenceEditMode}
                updateCadenceStepName={this.props.updateCadenceStepName}
                stepForEdition={this.props.stepForEdition}
              />
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
  cadenceWinAndLoseConfiguration: {
    cadenceWinConfigured: boolean;
    cadenceLoseConfigured: boolean;
  };
  stepNodeFakerSource: CadenceStep | null;
  triggerForEdition: {
    trigger: CadenceConnectedTriggerConfig | null;
    step: CadenceStep | null;
  };
  cadenceEditMode: boolean;
};
const StateHandlersInit: StateHandlerInit = {
  rightPanelMode: CadencePanelMode.CADENCE_PANEL_INITIAL,
  stepForSubscription: null,
  selectedStepIdForEdition: null,
  subscriptionDestinationConfig: {},
  cadenceWinAndLoseConfiguration: {
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
  setCadenceWinAndLoseConfiguration:
    () =>
    (cadenceWinAndLoseConfiguration: {
      cadenceWinConfigured: boolean;
      cadenceLoseConfigured: boolean;
    }) => ({ cadenceWinAndLoseConfiguration }),

  resetSubscriptionDestination: () => () => ({
    stepNodeFakerSource: null,
    subscriptionDestinationConfig: {},
    triggerForEdition: { step: null, trigger: null },
  }),

  setTriggerForEdition:
    () => (step: CadenceStep, trigger: CadenceConnectedTriggerConfig) => {
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
const mapWithHandlers = {
  retrieveCadence: (props: OwnProps & ConnectedPropsAndState) => () => {
    props.retrieveCadenceAction(props.cadenceId, {
      onSuccess: (cadence) => {
        props.fetchCadenceStepListAction({ id__in: cadence.steps });
      },
    });
  },
  updateCadenceName:
    (props: OwnProps & ConnectedPropsAndState) =>
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
    (props: OwnProps & ConnectedPropsAndState) =>
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
    (props: OwnProps & ConnectedPropsAndState) =>
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
    (props: OwnProps & ConnectedPropsAndState) =>
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
  upsertCadenceConfiguration:
    (props: OwnProps & ConnectedPropsAndState) =>
    (
      data: {
        [CADENCE_STEPPER_ENTRY_STEP]?: Values | {};
        [CADENCE_STEPPER_WIN_STEP]?: Values | {};
        [CADENCE_STEPPER_LOSE_STEP]?: Values | {};
      },
      options?: OptionCallback,
    ) => {
      props.upsertCadenceConfigurationAction(props.cadenceId, data, {
        onSuccess: () => {
          options && options.onSuccess && options.onSuccess();
        },
        onError: () => {
          options && options.onError && options.onError();
        },
      });
    },
  updateCadenceStepCanvasPosition:
    (props: OwnProps & ConnectedPropsAndState) =>
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
    (props: OwnProps & ConnectedPropsAndState) =>
    (
      id: number,
      position: { ct_uuid: string; x: number; y: number },
      options?: OptionCallback,
    ) => {
      props.updateCadenceStepConnectedTriggerCanvasPositionAction(
        id,
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
  onClickStepItem:
    (props: OwnProps & ConnectedPropsAndState) => (step: CadenceStep) => {
      if (step?.is_entry_step) {
        props.setRightPanelMode(
          CadencePanelMode.CADENCE_PANEL_ENTRY_PARAMETERS,
        );
      }
    },

  subscribeStepToStep:
    (props: OwnProps & ConnectedPropsAndState) =>
    (data: Values, options?: OptionCallback) => {
      if (props.stepForSubscription?.id) {
        props.subscribeStepToStepAction(
          props.stepForSubscription?.id,
          {
            ...data,
            ...(props.subscriptionDestinationConfig?.step
              ? { step: props.subscriptionDestinationConfig?.step }
              : {}),
          },
          {
            onSuccess: () => {
              props.resetSubscriptionDestination();
              options && options.onSuccess && options.onSuccess();
              props.retrieveCadenceAction(props.cadenceId, {
                onSuccess: (cadence) => {
                  props.fetchCadenceStepListAction({ id__in: cadence.steps });
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
  updateConnectedTrigger:
    (props: OwnProps & ConnectedPropsAndState) =>
    (data: Values, options?: OptionCallback) => {
      if (
        props.triggerForEdition?.step?.id &&
        props.triggerForEdition?.trigger
      ) {
        props.updateConnectedTriggerAction(
          props.triggerForEdition.step.id,
          {
            ...data,
            ...(props.subscriptionDestinationConfig?.step
              ? { step: props.subscriptionDestinationConfig?.step }
              : {}),
            trigger: props.triggerForEdition.trigger.uuid,
          },
          {
            onSuccess: () => {
              props.resetSubscriptionDestination();
              options && options.onSuccess && options.onSuccess();
              props.retrieveCadenceAction(props.cadenceId, {
                onSuccess: (cadence) => {
                  props.fetchCadenceStepListAction({ id__in: cadence.steps });
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
};
const connector = connect(
  (
    state: RootState,
    { cadenceId, selectedStepIdForEdition }: OwnProps & StateHandlerType,
  ) => ({
    cadence: withSmartLists(withSteps(getCadenceOnlyActiveCTs))(
      state,
      cadenceId,
    ),
    loading: state.cadence.cadence.loading || state.cadence.step.loading,
    smartlists: getAllSmartList(state),
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    email_templates_list: getAllEmailTemplatesSummaries(state),
    email_templates_details: getEmailTemplatesDetail(state),
    emailListLoading: state.emailTemplate.loading,
    emailDetailLoading: state.emailTemplate.detail.loading,
    stepForEdition: getCadenceStep(state, selectedStepIdForEdition),
  }),
  {
    retrieveCadenceAction,
    fetchCadenceStepListAction,
    updateCadenceAction,
    activateCadenceAction,
    shutOffCadenceAction,
    upsertCadenceConfigurationAction,
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
  withHandlers(mapWithHandlers),
  withTitle(({ cadence }: { cadence: Cadence }) => {
    return cadence && cadence.name ? `${cadence.name}` : '';
  }),
)(CadenceDetailPage);
