// @ts-nocheck
import React from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import CadenceSettingsFormStepper, {
  CADENCE_STEPPER_ENTRY_STEP,
} from '../CadenceSettingsFormStepper.component';

import TriggerForm, { Values } from '../Trigger/components';
import { getInitialFormValuesFromCTList } from '../Trigger/utils';

import useConnectedTriggerFormStyles from './styles.hook';

import type { OptionCallback } from '../../../../../state/types';
import type { BaseFormComponentProps } from './types';
import type { Cadence } from '#libs/sequential_marketingDEPRECATED/types';

type InitialEntryComponentProps = BaseFormComponentProps & {
  onSubmit: (
    data: {
      [CADENCE_STEPPER_ENTRY_STEP]: Values | {};
    },
    options?: OptionCallback,
  ) => void;
};

export const CadenceEntrySetupForm: React.FC<InitialEntryComponentProps> = ({
  cadence,
  smartlists,
  onSubmit,
  viewMode,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useConnectedTriggerFormStyles();

  const [initial, setInitial] = React.useState<Cadence | null>(null);

  React.useEffect(() => {
    if (cadence && cadence.entries) {
      setInitial(
        getInitialFormValuesFromCTList({ connected_triggers: cadence.entries }),
      );
    }
  }, [cadence]);

  const handleSubmitForm = (data: Values) => {
    onSubmit(data);
  };

  return (
    <div>
      <div className={classes.title}>
        <Typography variant="h6">{t('cadence.cadenceParameters')}</Typography>
      </div>
      <div className={classes.stepperContainer}>
        <CadenceSettingsFormStepper
          step={CADENCE_STEPPER_ENTRY_STEP}
          displaySteps={[CADENCE_STEPPER_ENTRY_STEP]}
        />
      </div>
      <Divider />
      <TriggerForm
        initial={initial}
        smartlists={smartlists}
        onSubmit={handleSubmitForm}
        viewMode={viewMode}
        cadenceEntry
        noEmptyTrigger
      />
    </div>
  );
};

export default CadenceEntrySetupForm;
