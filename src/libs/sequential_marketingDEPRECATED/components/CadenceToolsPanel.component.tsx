// @ts-nocheck
import React from 'react';

import classNames from 'classnames';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import CadenceHowTo from './CadenceHowTo.component';
import {
  CadenceInitialSetupForm,
  CadenceEntrySetupForm,
  CadenceWinSetupForm,
  CadenceLoseSetupForm,
  StepSubscriborSetupForm,
} from '#libs/sequential_marketingDEPRECATED/components/form/ConnectedTrigger';
import CadenceStepForm from './form/CadenceStepForm.component';
import StepMarketingActionsForm from '#libs/sequential_marketingDEPRECATED/components/form/StepMarketingActionsForm';
import {
  CADENCE_STEPPER_ENTRY_STEP,
  CADENCE_STEPPER_WIN_STEP,
  CADENCE_STEPPER_LOSE_STEP,
} from '#libs/sequential_marketingDEPRECATED/components/form/CadenceSettingsFormStepper.component';

import type { Values } from '#libs/sequential_marketingDEPRECATED/components/form/Trigger/components';
import type {
  Cadence,
  CadenceStep,
  CadenceConnectedTriggerConfig,
  StepMarketingActions,
} from '#libs/sequential_marketingDEPRECATED/types';
import type { SmartList } from '#libs/smart-list/types';
import type { OptionCallback } from '../../../state/types';
import { CadencePanelMode } from '#libs/sequential_marketingDEPRECATED/constants';

type Props = {
  cadence: Cadence;
  cadenceEditMode: boolean;
  loading: boolean;
  mode: CadencePanelMode;
  smartlists: SmartList[];
  tagList: any;
  setUpFormSubmit: (
    data: {
      [CADENCE_STEPPER_ENTRY_STEP]?: Values | {};
      [CADENCE_STEPPER_WIN_STEP]?: Values | {};
      [CADENCE_STEPPER_LOSE_STEP]?: Values | {};
    },
    options?: OptionCallback,
  ) => void;
  updateInitialConfiguration: (
    data: {
      [CADENCE_STEPPER_ENTRY_STEP]?: Values | {};
      [CADENCE_STEPPER_WIN_STEP]?: Values | {};
      [CADENCE_STEPPER_LOSE_STEP]?: Values | {};
    },
    options?: OptionCallback,
  ) => void;
  handleSubmitNewStepWithTrigger: (
    data: Values,
    options?: OptionCallback,
  ) => void;
  handleSubmitEditConnectedTrigger: (
    data: Values,
    options?: OptionCallback,
  ) => void;
  getEmails: () => void;
  getEmailDetail: (id: number) => void;
  emailListLoading: boolean;
  emails: Array<any>;
  emailDetailLoading: boolean;
  emailDetails: Array<any>;
  triggerForEdition:
    | {
        trigger: CadenceConnectedTriggerConfig;
        step: CadenceStep;
      }
    | {};
  subscriptionDestinationConfig: {
    step?: number | null;
    exit?: boolean;
  };
  stepForEdition: CadenceStep;
  updateCadenceStepName: (
    data: { name: string },
    options?: OptionCallback,
  ) => void;
  getStepMarketingActions: (id: number) => StepMarketingActions[];
  stepMarketingActionsLoading: boolean;
  stepMarketingActionsUpsertLoading: boolean;
  upsertStepMarketingAtions: (
    data: StepMarketingActions,
    options?: OptionCallback,
  ) => void;
  deleteStepMarketingAction: (data: { id: number; stepId: number }) => void;
};

export const CadenceToolsPanel: React.FC<Props> = ({
  mode,
  loading,
  cadence,
  cadenceEditMode,
  smartlists,
  getEmails,
  getEmailDetail,
  emailListLoading,
  emails,
  emailDetailLoading,
  emailDetails,
  setUpFormSubmit,
  updateInitialConfiguration,
  handleSubmitNewStepWithTrigger,
  handleSubmitEditConnectedTrigger,
  tagList,
  triggerForEdition,
  subscriptionDestinationConfig,
  stepForEdition,
  updateCadenceStepName,
  getStepMarketingActions,
  stepMarketingActionsLoading,
  stepMarketingActionsUpsertLoading,
  upsertStepMarketingAtions,
  deleteStepMarketingAction,
}) => {
  const classes = useStyles();

  if (loading) {
    return (
      <div className={classes.centeredContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (mode === CadencePanelMode.CADENCE_PANEL_HOW_TO) {
    return (
      <div className={classes.flexContainer}>
        <CadenceHowTo />
      </div>
    );
  }

  if (mode === CadencePanelMode.CADENCE_EDIT_STEP) {
    const marketingActions = getStepMarketingActions(stepForEdition?.id);

    return (
      <div className={classes.flexContainer}>
        <div>
          <CadenceStepForm
            step={stepForEdition}
            onSubmit={updateCadenceStepName}
          />
          <StepMarketingActionsForm
            marketingActions={marketingActions}
            step={stepForEdition}
            smartlists={smartlists}
            getEmails={getEmails}
            getEmailDetail={getEmailDetail}
            emailListLoading={emailListLoading}
            emails={emails}
            emailDetailLoading={emailDetailLoading}
            emailDetails={emailDetails}
            tagList={tagList}
            stepMarketingActionsLoading={stepMarketingActionsLoading}
            stepMarketingActionsUpsertLoading={
              stepMarketingActionsUpsertLoading
            }
            upsertStepMarketingAtions={upsertStepMarketingAtions}
            deleteStepMarketingAction={deleteStepMarketingAction}
          />
        </div>
      </div>
    );
  }

  if (mode === CadencePanelMode.CADENCE_PANEL_INTIAL_PARAMETERS) {
    return (
      <div className={classes.flexContainer}>
        <CadenceInitialSetupForm
          cadence={cadence}
          smartlists={smartlists}
          onSubmit={setUpFormSubmit}
          viewMode={!cadenceEditMode}
        />
      </div>
    );
  }

  if (mode === CadencePanelMode.CADENCE_PANEL_ENTRY_PARAMETERS) {
    const cadenceEntryPoint = cadence?.steps?.find(
      (step) => step?.is_entry_step,
    );
    const marketingActions = getStepMarketingActions(cadenceEntryPoint?.id);
    const handleSubmit = (data) =>
      updateInitialConfiguration({ [CADENCE_STEPPER_ENTRY_STEP]: data });

    return (
      <div className={classes.flexContainer}>
        <div>
          <div className={classes.paddingBottom}>
            <CadenceEntrySetupForm
              cadence={cadence}
              smartlists={smartlists}
              onSubmit={handleSubmit}
              viewMode={!cadenceEditMode}
            />
          </div>
          <StepMarketingActionsForm
            marketingActions={marketingActions}
            step={cadenceEntryPoint}
            smartlists={smartlists}
            getEmails={getEmails}
            getEmailDetail={getEmailDetail}
            emailListLoading={emailListLoading}
            emails={emails}
            emailDetailLoading={emailDetailLoading}
            emailDetails={emailDetails}
            tagList={tagList}
            stepMarketingActionsLoading={stepMarketingActionsLoading}
            stepMarketingActionsUpsertLoading={
              stepMarketingActionsUpsertLoading
            }
            upsertStepMarketingAtions={upsertStepMarketingAtions}
            deleteStepMarketingAction={deleteStepMarketingAction}
          />
        </div>
      </div>
    );
  }
  if (mode === CadencePanelMode.CADENCE_PANEL_WIN_PARAMETERS) {
    const handleSubmit = (data) => updateInitialConfiguration(data);

    return (
      <div className={classes.flexContainer}>
        <CadenceWinSetupForm
          cadence={cadence}
          smartlists={smartlists}
          onSubmit={handleSubmit}
          viewMode={!cadenceEditMode}
        />
      </div>
    );
  }
  if (mode === CadencePanelMode.CADENCE_PANEL_LOSE_PARAMETERS) {
    const handleSubmit = (data) => updateInitialConfiguration(data);

    return (
      <div className={classes.flexContainer}>
        <CadenceLoseSetupForm
          cadence={cadence}
          smartlists={smartlists}
          onSubmit={handleSubmit}
          viewMode={!cadenceEditMode}
        />
      </div>
    );
  }
  if (mode === CadencePanelMode.CADENCE_PANEL_NEW_STEP) {
    return (
      <div
        className={classNames(
          classes.flexContainer,
          classes.extraBottomPadding,
        )}
      >
        <StepSubscriborSetupForm
          smartlists={smartlists}
          onSubmit={handleSubmitNewStepWithTrigger}
          toExit={!!subscriptionDestinationConfig?.exit}
          viewMode={!cadenceEditMode}
        />
      </div>
    );
  }
  if (mode === CadencePanelMode.CADENCE_PANEL_EDIT_TRIGGER) {
    return (
      <div
        className={classNames(
          classes.flexContainer,
          classes.extraBottomPadding,
        )}
      >
        <StepSubscriborSetupForm
          triggerForEdition={triggerForEdition}
          smartlists={smartlists}
          onSubmit={handleSubmitEditConnectedTrigger}
          viewMode={!cadenceEditMode}
        />
      </div>
    );
  }

  return <CadenceHowTo />;
};

const useStyles = makeStyles((theme: Theme) => ({
  centeredContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexContainer: {
    display: 'flex',
    padding: theme.spacing(2),
  },
  extraBottomPadding: {
    paddingBottom: theme.spacing(20),
  },
  paddingBottom: {
    paddingBottom: theme.spacing(2),
  },
}));

export default CadenceToolsPanel;
