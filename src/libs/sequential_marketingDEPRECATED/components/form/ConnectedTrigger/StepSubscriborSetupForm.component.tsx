import React from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import TriggerForm, { Values } from '../Trigger/components';
import { getInitialFormValuesFromCTList } from '../Trigger/utils';

import useConnectedTriggerFormStyles from './styles.hook';

import type {
  CadenceStep,
  CadenceConnectedTriggerConfig,
} from '#libs/sequential_marketingDEPRECATED/types';
import type { BaseFormComponentProps } from './types';
import type { OptionCallback } from '../../../../../state/types';

type StepSubscriborComponentProps = BaseFormComponentProps & {
  onSubmit: (data: Values, options?: OptionCallback) => void;
  triggerForEdition?:
    | {
        trigger: CadenceConnectedTriggerConfig;
        step: CadenceStep;
      }
    | {};
};
export const StepSubscriborSetupForm: React.FC<
  StepSubscriborComponentProps
> = ({ triggerForEdition, smartlists, onSubmit, toExit, viewMode }) => {
  const { t } = useTranslation('marketing');
  const classes = useConnectedTriggerFormStyles();

  const [initial, setInitial] = React.useState<Partial<Values>>(null);

  const handleSubmitForm = (data: Values, options: OptionCallback) => {
    onSubmit(data, options);
  };

  React.useEffect(() => {
    if (
      triggerForEdition &&
      'trigger' in triggerForEdition &&
      triggerForEdition.trigger
    ) {
      setInitial(
        getInitialFormValuesFromCTList({
          connected_triggers: [triggerForEdition.trigger],
          withExit: true,
        }),
      );
    }
  }, [triggerForEdition]);

  const withExit = initial?.is_exit_success || initial?.is_exit_fail;
  return (
    <div>
      <div className={classes.title}>
        <Typography variant="h6">{t('cadence.triggerElement')}</Typography>
      </div>
      <Divider />
      <TriggerForm
        forceAndLogicForTriggerAndSmartList
        noEmptyTrigger
        initial={initial}
        onSubmit={handleSubmitForm}
        smartlists={smartlists}
        viewMode={viewMode}
        withExit={toExit || withExit}
      />
    </div>
  );
};

export default StepSubscriborSetupForm;
