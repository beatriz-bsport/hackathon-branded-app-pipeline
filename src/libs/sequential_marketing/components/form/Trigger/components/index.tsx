import React from 'react';

import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { useFormikContext, withFormik, FormikProps, Form } from 'formik';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TimerIcon from '@material-ui/icons/Timer';

import Button from '@material-ui/core/Button';

import useCadenceFormContext from '../hooks';
import useCadenceFormStyles from '../hooks/styles.hook';
import {
  // EVENTS
  RuleBetweenEntryEvent,
  // MARKETING ACTIONS
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  CADENCE_MARKETING_ACTION_SMS,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  CADENCE_EVENT_ALL_CHOICES,
} from '#libs/sequential_marketing/constants';

import { getTriggerFormData, defaultMarketingActions } from '../utils';

import NumericInput from '#components/input/NumericInput.component';
import { Submit } from '#components/forms';
import TriggerSection from './TriggerSectionForm.component';
import ExitConfigurationSection from './ExitConfigurationSectionForm.component';
import MarketingActionsForm, {
  MarketingActionsValues,
} from '#libs/communication-v2/components/SequentialMarketing/MarketingActionsForm.component';

import type { Tag, TagGroup } from '#libs/tag/types';
import type {
  EmailTemplate,
  EmailTemplateDetail,
} from '#libs/email-editor/types';
import type { SmartList } from '#libs/smart-list/types';
import type { Cadence } from '#libs/sequential_marketing/types';
import type { OptionCallback } from '../../../../../../state/types';

export type ComponentProps = {
  viewMode?: boolean;
  smartlists: SmartList[];
  loading?: boolean;
  withMarketingActions?: boolean;
  forceAndLogicForTriggerAndSmartList?: boolean;
  onlyMarketingActions?: boolean;
  tagList: Array<Tag<TagGroup>>;
  withTimeout?: boolean;
  emailListLoading: boolean;
  emails: Array<EmailTemplate>;
  emailDetailLoading: boolean;
  emailDetails: Array<EmailTemplateDetail>;
  withExit?: boolean;
  onCancel?: () => void;
  getEmails: () => void;
  getEmailDetail: (id: number) => void;
};

export type FormProps = {
  initial?: Cadence;
  onSubmit: (data: Values, options: OptionCallback) => void;
};

export type Values = {
  withMarketingActions: boolean;
  withTimeout: boolean;
  trigger_has_event: boolean;
  trigger_event_kind: string | null;
  trigger_has_smartlist: boolean;
  trigger_smartlist_selected: number | null;
  trigger_logic_between_event_and_smartlist: number | null;
  trigger_destination_timeout_days: number;
  marketing_actions: MarketingActionsValues;
  is_exit_success: boolean;
  is_exit_fail: boolean;
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
      'marketing.candence.form.error.multiple_exit_config',
      function CheckExitStatus(item) {
        if (item) {
          return !this.parent.is_exit_success;
        }
        return true;
      },
    ),
  is_exit_success: Yup.boolean().nullable(true),
});

export const CadenceTriggerForm: React.FC<ComponentProps> = ({
  viewMode,
  smartlists,
  tagList,
  loading,
  withMarketingActions,
  onlyMarketingActions,
  withTimeout,
  emailListLoading,
  emails,
  emailDetailLoading,
  emailDetails,
  onCancel,
  getEmailDetail,
  forceAndLogicForTriggerAndSmartList,
  withExit,
}) => {
  const smartListChoices = React.useMemo(
    () => [...(smartlists || [])],
    [smartlists],
  );
  const { t } = useTranslation('marketing');
  const classes = useCadenceFormStyles();

  const { values, errors, isSubmitting }: FormikValues = useFormikContext();

  const {
    handleChangeTimeOut,
    timeoutValue,
    selectedMarketingActions,
    handleWrittenEmailContentChange,
    handleWrittenEmailTitleChange,
    handleSmsContentChange,
    handlePushNotificationTitleChange,
    handlePushNotificationContentChange,
    handleEmailTemplateTitleChange,
    handleSelectEmailDesign,
    handleResetMarketingAction,
    handleMarketingActionChange,
  } = useCadenceFormContext({
    emails,
    smartlists: smartListChoices,
    forceAndLogicForTriggerAndSmartList: !!forceAndLogicForTriggerAndSmartList,
  });

  return (
    <Form className={classes.flexVertical}>
      <TriggerSection
        smartlists={smartListChoices}
        onlyMarketingActions={onlyMarketingActions}
        emails={emails}
        forceAndLogicForTriggerAndSmartList={
          !!forceAndLogicForTriggerAndSmartList
        }
      />
      {withExit && <Divider />}
      <ExitConfigurationSection withExit={withExit} />
      {withExit && <Divider />}

      {(withMarketingActions || onlyMarketingActions) && (
        <MarketingActionsForm
          emails={emails}
          tagList={tagList}
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
          emailListLoading={emailListLoading}
          getEmailDetail={getEmailDetail}
          selectedMarketingActions={selectedMarketingActions}
          handleWrittenEmailContentChange={handleWrittenEmailContentChange}
          handleWrittenEmailTitleChange={handleWrittenEmailTitleChange}
          handleSmsContentChange={handleSmsContentChange}
          handlePushNotificationTitleChange={handlePushNotificationTitleChange}
          handlePushNotificationContentChange={
            handlePushNotificationContentChange
          }
          handleEmailTemplateTitleChange={handleEmailTemplateTitleChange}
          handleSelectEmailDesign={handleSelectEmailDesign}
          handleResetMarketingAction={handleResetMarketingAction}
          handleMarketingActionChange={handleMarketingActionChange}
          onCancel={onCancel}
          marketing_actions={values.marketing_actions}
          errors={errors.marketing_actions}
        />
      )}
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
                  inputProps: { step: 1, min: 0 },
                }}
              />
            </div>
            <div className={classes.timeoutInpoutText}>
              <Typography variant="body1">
                {t('cadence.form.trigger.trigger_timeout_select_label')}
              </Typography>
            </div>
          </div>
          <Typography variant="caption" color="textSecondary">
            {t('cadence.form.trigger.trigger_timeout_explain_value_selected')}
          </Typography>
        </div>
      )}
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
              disabled={isSubmitting || loading}
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
    withMarketingActions,
    withTimeout,
    withExit,
  }: ComponentProps & FormProps) => {
    if (initial) {
      return {
        ...initial,
        ...defaultMarketingActions,
      };
    }

    return {
      withMarketingActions: !!withMarketingActions,
      withTimeout: !!withTimeout,
      trigger_has_event: false,
      trigger_event_kind: null,
      trigger_has_smartlist: false,
      trigger_smartlist_selected: null,
      trigger_logic_between_event_and_smartlist:
        RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
      ...(withExit ? { is_exit_success: true, is_exit_fail: false } : {}),
      ...(withMarketingActions
        ? {
            marketing_actions: {
              [CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]: {
                configured: false,
                title: '',
                content: '',
              },
              [CADENCE_MARKETING_ACTION_SMS]: {
                configured: false,
                content: '',
              },
              [CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]: {
                configured: false,
                title: '',
                content: '',
              },
              [CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]: {
                configured: false,
                email_design_id: null,
                title: '',
              },
              [CADENCE_MARKETING_ACTION_TAG_MANAGEMENT]: {
                configured: false,
                tag_id: null,
              },
            },
          }
        : {}),
      ...(withTimeout ? { trigger_destination_timeout_days: 7 } : {}),
    };
  },
  enableReinitialize: true,
  validationSchema: CadenceTriggerFormSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const cleanedData = getTriggerFormData(values);
    onSubmit(cleanedData, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default formikFormWrapper(CadenceTriggerForm);
