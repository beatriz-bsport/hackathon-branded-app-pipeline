import React from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import CadenceSettingsFormStepper, {
  CADENCE_STEPPER_WIN_STEP,
} from '../CadenceSettingsFormStepper.component';

import TriggerForm, { Values } from '../Trigger/components';
import { getInitialFormValuesFromCTList } from '../Trigger/utils';

import useConnectedTriggerFormStyles from './styles.hook';

import { CadenceDestinationEnum } from '#libs/sequential_marketingDEPRECATED/constants';
import type { OptionCallback } from '../../../../../state/types';
import type { BaseFormComponentProps } from './types';

type InitialWinComponentProps = BaseFormComponentProps & {
  onSubmit: (
    data: {
      [CADENCE_STEPPER_WIN_STEP]: Values | {};
    },
    options?: OptionCallback,
  ) => void;
};

export const CadenceWinSetupForm: React.FC<InitialWinComponentProps> = ({
  cadence,
  smartlists,
  onSubmit,
  viewMode,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useConnectedTriggerFormStyles();

  const [initial, setInitial] = React.useState<Partial<Values>>(null);

  React.useEffect(() => {
    if (
      cadence &&
      cadence.exits?.filter(
        (ct_exit) =>
          ct_exit.destination_config.status ===
          CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_SUCCESS_STATUS,
      )
    ) {
      const relevant_connected_triggers = cadence.exits?.filter(
        (ct_exit) =>
          ct_exit.destination_config.status ===
          CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_SUCCESS_STATUS,
      );
      setInitial(
        getInitialFormValuesFromCTList({
          connected_triggers: relevant_connected_triggers || [],
        }),
      );
    }
  }, [cadence]);

  const handleSubmitForm = (data: Values) => {
    onSubmit({ [CADENCE_STEPPER_WIN_STEP]: data });
  };

  return (
    <div>
      <div className={classes.title}>
        <Typography variant="h6">{t('cadence.cadenceParameters')}</Typography>
      </div>
      <div className={classes.stepperContainer}>
        <CadenceSettingsFormStepper
          step={CADENCE_STEPPER_WIN_STEP}
          displaySteps={[CADENCE_STEPPER_WIN_STEP]}
        />
      </div>
      <Divider />
      <TriggerForm
        initial={initial}
        smartlists={smartlists}
        onSubmit={handleSubmitForm}
        viewMode={viewMode}
        cadenceExitSuccess
        noEmptyTrigger
      />
    </div>
  );
};

export default CadenceWinSetupForm;
