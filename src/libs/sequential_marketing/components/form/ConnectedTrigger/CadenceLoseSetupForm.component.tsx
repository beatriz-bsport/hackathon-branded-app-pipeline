// @ts-nocheck
import React from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import CadenceSettingsFormStepper, {
  CADENCE_STEPPER_LOSE_STEP,
} from '../CadenceSettingsFormStepper.component';

import TriggerForm, { Values } from '../Trigger/components';
import { getInitialFormValuesFromCTList } from '../Trigger/utils';

import useConnectedTriggerFormStyles from './styles.hook';

import { CadenceDestinationEnum } from '#libs/sequential_marketing/constants';
import type { Cadence } from '#libs/sequential_marketing/types';
import type { OptionCallback } from '../../../../../state/types';
import type { BaseFormComponentProps } from './types';

type InitialLoseComponentProps = BaseFormComponentProps & {
  onSubmit: (
    data: {
      [CADENCE_STEPPER_LOSE_STEP]: Values | {};
    },
    options?: OptionCallback,
  ) => void;
};

export const CadenceLoseSetupForm: React.FC<InitialLoseComponentProps> = ({
  cadence,
  smartlists,
  onSubmit,
  viewMode,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useConnectedTriggerFormStyles();

  const [initial, setInitial] = React.useState<Cadence | null>(null);
  React.useEffect(() => {
    if (
      cadence &&
      cadence.exits?.filter(
        (ct_exit) =>
          ct_exit.destination_config.status ===
          CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_FAIL_STATUS,
      )
    ) {
      const relevant_connected_triggers = cadence.exits?.filter(
        (ct_exit) =>
          ct_exit.destination_config.status ===
          CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_FAIL_STATUS,
      );
      setInitial(
        getInitialFormValuesFromCTList({
          connected_triggers: relevant_connected_triggers || [],
          withTimeout: true,
        }),
      );
    }
  }, [cadence]);

  const handleSubmitForm = (data: Values) => {
    onSubmit({ [CADENCE_STEPPER_LOSE_STEP]: data });
  };

  return (
    <div>
      <div className={classes.title}>
        <Typography variant="h6">{t('cadence.cadenceParameters')}</Typography>
      </div>
      <div className={classes.stepperContainer}>
        <CadenceSettingsFormStepper
          step={CADENCE_STEPPER_LOSE_STEP}
          displaySteps={[CADENCE_STEPPER_LOSE_STEP]}
        />
      </div>
      <Divider />
      <TriggerForm
        initial={initial}
        smartlists={smartlists}
        onSubmit={handleSubmitForm}
        withTimeout
        viewMode={viewMode}
        cadenceExitFail
      />
    </div>
  );
};

export default CadenceLoseSetupForm;
