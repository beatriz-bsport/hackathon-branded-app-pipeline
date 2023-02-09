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
  StepMarketingActionsForm,
} from '#libs/sequential_marketing/components/form/ConnectedTrigger';
import CadenceStepForm from './form/CadenceStepForm.component';

import {
  CADENCE_STEPPER_ENTRY_STEP,
  CADENCE_STEPPER_WIN_STEP,
  CADENCE_STEPPER_LOSE_STEP,
} from '#libs/sequential_marketing/components/form/CadenceSettingsFormStepper.component';

import type { Values } from '#libs/sequential_marketing/components/form/Trigger/components';
import type {
  Cadence,
  CadenceStep,
  CadenceConnectedTriggerConfig,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import type { OptionCallback } from '../../../state/types';
import { CadencePanelMode } from '#libs/sequential_marketing/constants';

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
  stepForSubscription: CadenceStep;
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
};

export const CadenceToolePanel: React.FC<Props> = ({
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
  handleSubmitNewStepWithTrigger,
  handleSubmitEditConnectedTrigger,
  tagList,
  stepForSubscription,
  triggerForEdition,
  subscriptionDestinationConfig,
  stepForEdition,
  updateCadenceStepName,
}) => {
  const classes = useStyles();

  if (loading) {
    return (
      <div className={classes.centeredContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (mode === CadencePanelMode.CADENCE_PANEL_INITIAL) {
    return (
      <div className={classes.flexContainer}>
        <CadenceHowTo />
      </div>
    );
  }

  if (mode === CadencePanelMode.CADENCE_EDIT_STEP) {
    return (
      <div className={classes.flexContainer}>
        <CadenceStepForm
          step={stepForEdition}
          onSubmit={updateCadenceStepName}
        />
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
          getEmails={getEmails}
          getEmailDetail={getEmailDetail}
          emailListLoading={emailListLoading}
          emails={emails}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
          tagList={tagList}
          viewMode={!cadenceEditMode}
        />
      </div>
    );
  }

  if (mode === CadencePanelMode.CADENCE_PANEL_ENTRY_PARAMETERS) {
    const handleEntrySetSubmit = (data) =>
      setUpFormSubmit({ [CADENCE_STEPPER_ENTRY_STEP]: data });

    return (
      <div className={classes.flexContainer}>
        <CadenceEntrySetupForm
          cadence={cadence}
          smartlists={smartlists}
          onSubmit={handleEntrySetSubmit}
          getEmails={getEmails}
          getEmailDetail={getEmailDetail}
          emailListLoading={emailListLoading}
          emails={emails}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
          tagList={tagList}
          viewMode={!cadenceEditMode}
        />
      </div>
    );
  }
  if (mode === CadencePanelMode.CADENCE_PANEL_WIN_PARAMETERS) {
    return (
      <div className={classes.flexContainer}>
        <CadenceWinSetupForm
          cadence={cadence}
          smartlists={smartlists}
          onSubmit={setUpFormSubmit}
          getEmails={getEmails}
          getEmailDetail={getEmailDetail}
          emailListLoading={emailListLoading}
          emails={emails}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
          tagList={tagList}
          viewMode={!cadenceEditMode}
        />
      </div>
    );
  }
  if (mode === CadencePanelMode.CADENCE_PANEL_LOSE_PARAMETERS) {
    return (
      <div className={classes.flexContainer}>
        <CadenceLoseSetupForm
          cadence={cadence}
          smartlists={smartlists}
          onSubmit={setUpFormSubmit}
          getEmails={getEmails}
          getEmailDetail={getEmailDetail}
          emailListLoading={emailListLoading}
          emails={emails}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
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
          getEmails={getEmails}
          getEmailDetail={getEmailDetail}
          emailListLoading={emailListLoading}
          emails={emails}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
          tagList={tagList}
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
          getEmails={getEmails}
          getEmailDetail={getEmailDetail}
          emailListLoading={emailListLoading}
          emails={emails}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
          tagList={tagList}
          viewMode={!cadenceEditMode}
        />
      </div>
    );
  }
  if (mode === CadencePanelMode.CADENCE_PANEL_MARKETING_ACTIONS) {
    return (
      <div className={classes.flexContainer}>
        <StepMarketingActionsForm
          step={stepForSubscription}
          smartlists={smartlists}
          onSubmit={handleSubmitNewStepWithTrigger}
          getEmails={getEmails}
          getEmailDetail={getEmailDetail}
          emailListLoading={emailListLoading}
          emails={emails}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
          tagList={tagList}
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
}));

export default CadenceToolePanel;
