// @ts-nocheck
import React from 'react';

import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import {
  useFormikContext,
  withFormik,
  FormikProps,
  Form,
  ErrorMessage,
} from 'formik';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TimerIcon from '@material-ui/icons/Timer';

import Button from '@material-ui/core/Button';

import useCadenceFormContext from '../hooks';
import useCadenceFormStyles from '../hooks/styles.hook';
import {
  // EVENTS
  RuleBetweenEntryEvent,
  CADENCE_EVENT_ALL_CHOICES,
} from '#libs/sequential_marketingDEPRECATED/constants';

import NumericInput from '#components/input/NumericInput.component';
import { Submit } from '#components/forms';
import TriggerSection from './TriggerSectionForm.component';
import ExitConfigurationSection from './ExitConfigurationSectionForm.component';

import type { Tag, TagGroup } from '#libs/tag/types';
import type {
  EmailTemplate,
  EmailTemplateDetail,
} from '#libs/email-editor/types';
import type { SmartList } from '#libs/smart-list/types';
import type { OptionCallback } from '../../../../../../state/types';

import { TRIGGER_DETAULT_TIMEOUT_DAYS } from '#libs/sequential_marketingDEPRECATED/components/form/Trigger/utils';
import {
  CADENCE_STEPPER_ENTRY_STEP,
  CADENCE_STEPPER_WIN_STEP,
  CADENCE_STEPPER_LOSE_STEP,
  StepChoice,
} from '#libs/sequential_marketingDEPRECATED/components/form/CadenceSettingsFormStepper.component';
import { FormValues } from '#libs/sequential_marketingDEPRECATED/serializers/types';

export type ComponentProps = {
  viewMode?: boolean;
  smartlists: SmartList[];
  loading?: boolean;
  forceAndLogicForTriggerAndSmartList?: boolean;
  tagList?: Array<Tag<TagGroup>>;
  withTimeout?: boolean;
  emailListLoading?: boolean;
  emails?: Array<EmailTemplate>;
  emailDetailLoading?: boolean;
  emailDetails?: Array<EmailTemplateDetail>;
  withExit?: boolean;
  onCancel?: () => void;
  getEmails?: () => void;
  getEmailDetail?: (id: number) => void;
  cadenceEntry?: boolean;
  cadenceExitSuccess?: boolean;
  cadenceExitFail?: boolean;
  noEmptyTrigger?: boolean;
  formValues?: FormValues;
};

export type FormProps = {
  initial?: Partial<Values>;
  onSubmit: (data: Values, options: OptionCallback) => void;
};

export type Values = {
  withTimeout: boolean;
  trigger_has_event: boolean;
  trigger_event_kind: string | null;
  trigger_has_smartlist: boolean;
  trigger_smartlist_selected: number | null;
  trigger_logic_between_event_and_smartlist: number | null;
  trigger_destination_timeout_days: number;
  marketing_actions: any;
  is_exit_success: boolean;
  is_exit_fail: boolean;
  noEmptyTrigger?: boolean;
};

export type SelectorOption = { label: string; value: number | string };

export type FormikValues = FormikProps<Values>;

const CadenceTriggerFormSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  trigger_has_event: Yup.boolean(),
  trigger_event_kind: Yup.string()
    .nullable(true)
    .oneOf([null].concat(CADENCE_EVENT_ALL_CHOICES))
    .test(
      'Event Base Kind Must Be Defined',
      'marketing.cadence.form.error.select_trigger_event_kind',
      function checkEventBaseKind(item) {
        if (this.parent.trigger_has_event) {
          return !!item;
        }
        return true;
      },
    ),
  trigger_has_smartlist: Yup.boolean(),
  trigger_smartlist_selected: Yup.number()
    .nullable(true)
    .test(
      'SmartList Selected Must Be Defined',
      'marketing.cadence.form.error.select_a_smartlist',
      function checkSmartListSelection(item) {
        if (this.parent.trigger_has_smartlist) {
          return !!item;
        }
        return true;
      },
    ),
  trigger_logic_between_event_and_smartlist: Yup.number()
    .oneOf([
      RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
      RuleBetweenEntryEvent.OR_RULE_BETWEEN_ENTRY_EVENT,
    ])
    .test(
      'Rule Between Entries must be Defined',
      'marketing.cadence.form.error.trigger_logic_between_event_and_smartlist',
      function checkRulebetWeenEntries(item) {
        if (
          this.parent.trigger_has_smartlist &&
          this.parent.trigger_has_event
        ) {
          return !!item;
        }
        return true;
      },
    ),
  is_exit_fail: Yup.boolean()
    .nullable(true)
    .test(
      'Exit Fail and ExitSuccess Not Both True',
      'marketing.cadence.form.error.multiple_exit_config',
      function CheckExitStatus(item) {
        if (item) {
          return !this.parent.is_exit_success;
        }
        return true;
      },
    ),
  is_exit_success: Yup.boolean().nullable(true),
  noEmptyTrigger: Yup.boolean()
    .nullable(true)
    .test(
      'Check For Empty Trigger',
      'marketing:cadence.form.error.triggerCannotBeEmpty',
      function CheckForEmptyTrigger(item) {
        if (!item) {
          return true;
        }
        return (
          this.parent.trigger_event_kind ||
          this.parent.trigger_smartlist_selected
        );
      },
    ),
  trigger_destination_timeout_days: Yup.number()
    .nullable(false)
    .test(
      'Check For Timeout Value',
      'marketing:cadence.form.error.timeoutMustBeStrictPositive',
      function CheckForTimeoutValue(days) {
        if (!days) {
          return true;
        }
        return days > 0;
      },
    ),
});

export const CadenceTriggerForm: React.FC<ComponentProps> = ({
  viewMode,
  smartlists,
  loading,
  withTimeout,
  cadenceEntry,
  cadenceExitSuccess,
  cadenceExitFail,
  onCancel,
  forceAndLogicForTriggerAndSmartList,
  withExit,
}) => {
  const smartListChoices = React.useMemo(
    () => [...(smartlists || [])],
    [smartlists],
  );

  const { t } = useTranslation('marketing');

  const classes = useCadenceFormStyles();

  const { isSubmitting, isValid }: FormikValues = useFormikContext();

  const { handleChangeTimeOut, timeoutValue } = useCadenceFormContext({
    smartlists: smartListChoices,
    forceAndLogicForTriggerAndSmartList: !!forceAndLogicForTriggerAndSmartList,
  });

  return (
    <Form className={classes.flexVertical}>
      <TriggerSection
        smartlists={smartListChoices}
        forceAndLogicForTriggerAndSmartList={
          !!forceAndLogicForTriggerAndSmartList
        }
        cadenceEntry={!!cadenceEntry}
        cadenceExitSuccess={!!cadenceExitSuccess}
        cadenceExitFail={!!cadenceExitFail}
      />
      {withExit && <Divider />}
      <ExitConfigurationSection withExit={withExit} />
      {withExit && <Divider />}

      {withTimeout && (
        <div className={classes.timeoutSection}>
          <Divider />
          <div className={classes.titleWithIcon}>
            <TimerIcon className={classes.icon} />
            <Typography variant="h6">
              {t('cadence.form.trigger.trigger_timeout_title')}
            </Typography>
          </div>
          <div className={classes.timeoutSelectorContainer}>
            <div className={classes.timeoutInput}>
              <NumericInput
                value={timeoutValue}
                onChange={handleChangeTimeOut}
                InputProps={{
                  inputProps: { step: 1, min: 1 },
                }}
                error={timeoutValue < 1}
              />
            </div>
            <div className={classes.timeoutInpoutText}>
              <Typography variant="body1">
                {t('cadence.form.trigger.trigger_timeout_select_label')}
              </Typography>
            </div>
          </div>
          {timeoutValue < 1 && (
            <div className={classes.timeoutInputErrorText}>
              <Typography variant="caption" color="error">
                {t('cadence.form.error.timeoutMustBeStrictPositive')}
              </Typography>
            </div>
          )}
          <Typography variant="caption" color="textSecondary">
            {t('cadence.form.trigger.trigger_timeout_explain_value_selected', {
              days: timeoutValue,
            })}
          </Typography>
        </div>
      )}
      <ErrorMessage name="noEmptyTrigger">
        {(error_msg) => (
          <Typography variant="caption" color="error">
            {t(`${error_msg}`)}
          </Typography>
        )}
      </ErrorMessage>
      <>
        <div className={classes.actions}>
          {onCancel && (
            <Button variant="text" onClick={onCancel}>
              {t('cadence.form.previous')}
            </Button>
          )}
          {!viewMode && (
            <Submit
              id="submit_steup_entry"
              variant="contained"
              color="primary"
              disabled={isSubmitting || loading || !isValid}
            >
              {t('cadence.form.next')}
            </Submit>
          )}
        </div>
      </>
    </Form>
  );
};

const formikFormWrapper = withFormik<ComponentProps & FormProps, Values>({
  mapPropsToValues: ({
    initial,
    withTimeout,
    withExit,
    noEmptyTrigger,
    cadenceEntry,
    cadenceExitSuccess,
    cadenceExitFail,
    formValues,
  }: ComponentProps & FormProps) => {
    if (initial) {
      return {
        ...initial,
        noEmptyTrigger: !!noEmptyTrigger,
      };
    }

    if (formValues) {
      // This function returns the current step of the form
      // during the initial setup form or 0 if no step is set
      const getStep = () => {
        switch (true) {
          case cadenceEntry:
            return CADENCE_STEPPER_ENTRY_STEP;
          case cadenceExitSuccess:
            return CADENCE_STEPPER_WIN_STEP;
          case cadenceExitFail:
            return CADENCE_STEPPER_LOSE_STEP;
          default:
            return 0;
        }
      };

      const step: StepChoice | 0 = getStep();

      return {
        withTimeout: !!withTimeout,
        trigger_has_event: formValues[step]?.trigger_has_event ?? false,
        trigger_event_kind: formValues[step]?.trigger_event_kind ?? null,
        trigger_has_smartlist: formValues[step]?.trigger_has_smartlist ?? false,
        trigger_smartlist_selected:
          formValues[step]?.trigger_smartlist_selected ?? null,
        trigger_logic_between_event_and_smartlist:
          formValues[step]?.trigger_logic_between_event_and_smartlist ??
          RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
        ...(withExit ? { is_exit_success: true, is_exit_fail: false } : {}),
        ...(withTimeout
          ? { trigger_destination_timeout_days: TRIGGER_DETAULT_TIMEOUT_DAYS }
          : {}),
        noEmptyTrigger: !!noEmptyTrigger,
      };
    }

    return {
      withTimeout: !!withTimeout,
      trigger_has_event: false,
      trigger_event_kind: null,
      trigger_has_smartlist: false,
      trigger_smartlist_selected: null,
      trigger_logic_between_event_and_smartlist:
        RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
      ...(withExit ? { is_exit_success: true, is_exit_fail: false } : {}),
      ...(withTimeout
        ? { trigger_destination_timeout_days: TRIGGER_DETAULT_TIMEOUT_DAYS }
        : {}),
      noEmptyTrigger: !!noEmptyTrigger,
    };
  },
  enableReinitialize: true,
  validationSchema: CadenceTriggerFormSchema,
  validateOnMount: true,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default formikFormWrapper(CadenceTriggerForm);
