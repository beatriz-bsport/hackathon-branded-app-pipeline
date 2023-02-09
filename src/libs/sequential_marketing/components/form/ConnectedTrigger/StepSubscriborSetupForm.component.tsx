import React from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import TriggerForm, { Values } from '../Trigger/components';
import { getInitialFormValuesFromCTList } from '../Trigger/utils';

import useConnectedTriggerFormStyles from './styles.hook';

import type {
  Cadence,
  CadenceStep,
  CadenceConnectedTriggerConfig,
} from '#libs/sequential_marketing/types';
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
> = ({
  triggerForEdition,
  smartlists,
  tagList,
  emailListLoading,
  emails,
  emailDetailLoading,
  emailDetails,
  getEmails,
  getEmailDetail,
  onSubmit,
  toExit,
  viewMode,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useConnectedTriggerFormStyles();

  const [initial, setInitial] = React.useState<Cadence | null>(null);

  const handleSubmitForm = (data: Values, options: OptionCallback) => {
    onSubmit(data, options);
  };

  React.useEffect(() => {
    if (triggerForEdition && triggerForEdition.trigger) {
      setInitial(
        getInitialFormValuesFromCTList({
          connected_triggers: [triggerForEdition.trigger],
        }),
      );
    }
  }, [triggerForEdition]);

  return (
    <div>
      <div className={classes.title}>
        <Typography variant="h6">{t('cadence.triggerElement')}</Typography>
      </div>
      <Divider />
      <TriggerForm
        initial={initial}
        withMarketingActions
        smartlists={smartlists}
        tagList={tagList}
        onSubmit={handleSubmitForm}
        emailListLoading={emailListLoading}
        emails={emails}
        emailDetailLoading={emailDetailLoading}
        emailDetails={emailDetails}
        getEmails={getEmails}
        getEmailDetail={getEmailDetail}
        withExit={toExit}
        forceAndLogicForTriggerAndSmartList
        viewMode={viewMode}
      />
    </div>
  );
};

export default StepSubscriborSetupForm;
