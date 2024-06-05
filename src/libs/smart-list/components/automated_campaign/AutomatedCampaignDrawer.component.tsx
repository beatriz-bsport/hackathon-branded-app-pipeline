import React, { CSSProperties, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { colors } from '@bsport/common/lib/colors';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

import Radio from '@material-ui/core/Radio';
import { withFormik, Form, FormikProps, useFormikContext } from 'formik';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import RepeatIcon from '@material-ui/icons/Repeat';
import Alert from '@material-ui/lab/Alert';
import { SEND_COMMUNICATION_ON_JOIN } from '@bsport/common/lib/master-data/smart-list';
import classNames from 'classnames';
import Select from 'react-select';
import type { ValueType } from 'react-select/lib/types';
import chroma from 'chroma-js';
import type { AutomatedCampaign, OptionType } from '#src/libs/smart-list/types';
import {
  MAX_LENGTH_PUSH_TITLE,
  MAX_LENGTH_PUSH_CONTENT,
  MAX_LENGTH_AUTOMATIC_SMS,
  MAX_LENGTH_SMS,
} from '#src/libs/communication-v2/constants';
import WriteNotification from '#src/libs/communication/components/WriteNotification.component';
// @ts-expect-error
import WriteSMS from '#src/libs/communication/components/WriteSMS.component';
// @ts-expect-error
import WriteEmail from '#src/libs/communication/components/WriteEmail.component';
// @ts-expect-error
import SelectTemplate from '#src/libs/communication/components/SelectTemplate.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
// @ts-expect-error
import { Submit, TextField } from '#src/components/forms';
import type { FeatureList } from '#src/libs/company/types';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { UNLIMITED_AUTOMATIC_MESSAGING } from '#src/libs/smart-list/components/constants';
import CommunicationSMSCostReminderModal from '#src/libs/communication-v2/CommunicationSMSCostReminderModal.component';
import { util } from '#src/libs/communication-v2/components/convertEncode.utils';
import type { OptionCallback } from '../../../../state/types';
// @ts-expect-error
import FeatureListProvider from '../../../company/hocs/feature-list-provider.hoc';
import Config from '../../../../config';

const WRITTEN_EMAIL_KIND = 0;
const TEMPLATE_EMAIL_KIND = 1;

const selectStyles = {
  menuPortal: (base: CSSProperties) => ({ ...base, zIndex: 9999 }),
  option: (base: CSSProperties, { isSelected }: { isSelected: boolean }) => {
    const color = chroma(colors.secondary);
    const contrastColor =
      chroma.contrast(color, 'white') > 2 ? 'white' : 'black';
    return {
      ...base,
      backgroundColor: isSelected && colors.secondary,
      color: isSelected ? contrastColor : colors.secondary,
      '&:hover': {
        backgroundColor: !isSelected && color.alpha(0.1).css(),
      },
      '&:active': {
        backgroundColor: color.alpha(0.3).css(),
      },
    };
  },
};

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  initial: AutomatedCampaign;
  // eslint-disable-next-line react/no-unused-prop-types
  default_event_kind?: number;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (data: any, options: OptionCallback) => void;
  onCancel: () => void;
  getEmails: () => void;
  getEmailDetail: (id: number) => void;
  emailListLoading: boolean;
  emails: EmailTemplateSummary[];
  emailDetailLoading: boolean;
  emailDetails: {
    [templateId: number]: EmailTemplateDetail;
  };
  open: boolean;
  mailDefaultTitle?: string;
  alreadyConfiguredCommunicationKind: number[];
  resolvedGenericTags: ResolvedGenericTags;
  hideAutoResend?: boolean;
};

type FormikValues = FormikProps<AutomatedCampaign & { email_kind: number }>;
const useFormikHandlers = () => {
  const { values, setValues, setFieldValue }: FormikValues = useFormikContext();
  const handleSwitchToWrittenKindEmail = () =>
    setValues({
      ...values,
      communication_kind: COMMUNICATION_KIND_EMAIL,
      email_kind: WRITTEN_EMAIL_KIND,
    });

  const handleSwitchToEmailDesignKindEmail = () =>
    setValues({
      ...values,
      communication_kind: COMMUNICATION_KIND_EMAIL,
      email_kind: TEMPLATE_EMAIL_KIND,
    });

  const handleSwitchToSms = () =>
    setValues({
      ...values,
      communication_kind: COMMUNICATION_KIND_SMS,
      email_kind: null,
    });
  const handleSwitchToPushNotification = () =>
    setValues({
      ...values,
      communication_kind: COMMUNICATION_KIND_PUSH_NOTIFICATION,
      email_kind: null,
    });

  const handleChangeMaxCommunicationPerMember = useCallback(
    (option: ValueType<OptionType>) => {
      setFieldValue(
        'max_communications_sent_per_member',
        (option as OptionType).value,
      );
    },
    [setFieldValue],
  );

  return {
    handleSwitchToWrittenKindEmail,
    handleSwitchToEmailDesignKindEmail,
    handleSwitchToSms,
    handleSwitchToPushNotification,
    handleChangeMaxCommunicationPerMember,
  };
};
export const AutomatedCommunicationDrawer: React.FC<
  Props & FormikProps<Values>
> = ({
  initial,
  errors,
  values,
  open,
  getEmails,
  resetForm,
  onCancel,
  setFieldValue,
  getEmailDetail,
  emailListLoading,
  emails,
  emailDetailLoading,
  emailDetails,
  mailDefaultTitle,
  isSubmitting,
  isValid,
  alreadyConfiguredCommunicationKind,
  resolvedGenericTags,
  hideAutoResend,
  handleSubmit,
  validateForm,
}) => {
  const { t } = useTranslation(['communication', 'common']);
  const classes = useStyles();
  const [openRefreshDialog, setOpenRefreshDialog] = React.useState(false);
  const [openedAdvancedSection, setOpenedAdvancedSection] =
    React.useState(false);
  const [isSmsCostReminderModalOpen, setIsSmsCostReminderModalOpen] =
    React.useState(false);

  const handleCostReminderModalOnClose = React.useCallback(
    () => setIsSmsCostReminderModalOpen(false),
    [],
  );
  const handleCostReminderModalOpen = React.useCallback(
    () => setIsSmsCostReminderModalOpen(true),
    [],
  );

  const handleSmsSending = React.useCallback(() => {
    handleSubmit();
    setIsSmsCostReminderModalOpen(false);
  }, [handleSubmit]);

  const handleChangeTemplate = useCallback(
    (id: number) => {
      setFieldValue('email_design', id);
      // Introducing a setTimeout to handle validation asynchronously.
      // This ensures that the state remains synchronized with the previous setFieldValue.
      setTimeout(() => {
        setFieldValue(
          'title',
          emails.find((email) => email.id === id)?.subject ?? '',
        );
      });
    },
    [setFieldValue, emails],
  );

  const handleClose = () => {
    resetForm();
    onCancel();
  };

  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  React.useEffect(() => {
    if (open) {
      getEmails();
      validateForm();
    }
  }, [open, getEmails, validateForm]);

  const handleTextChange = (text: string) => setFieldValue('text', text);
  const handleTitleChange = (title: string) => setFieldValue('title', title);
  const renderSubTitle = () => {
    if (values.id) {
      if (values.event_kind === SEND_COMMUNICATION_ON_JOIN) {
        return t('campaign.automated.form.subtitles.update.joinSmartList');
      }
      return t('campaign.automated.form.subtitles.update.leftSmartList');
    }

    if (values.event_kind === SEND_COMMUNICATION_ON_JOIN) {
      return t('campaign.automated.form.subtitles.create.joinSmartList');
    }
    return t('campaign.automated.form.subtitles.create.leftSmartList');
  };
  const handleOpenRefreshDialog = () => setOpenRefreshDialog(false);
  const handleOpenCloseAdvancedSection = () =>
    setOpenedAdvancedSection(!openedAdvancedSection);

  const handleReloadPage = () => document.location.reload();

  const {
    handleSwitchToWrittenKindEmail,
    handleSwitchToEmailDesignKindEmail,
    handleSwitchToSms,
    handleSwitchToPushNotification,
    handleChangeMaxCommunicationPerMember,
  } = useFormikHandlers();

  const AUTOMATIC_MESSAGE_OPTIONS: OptionType[] = React.useMemo(
    () => [
      {
        value: UNLIMITED_AUTOMATIC_MESSAGING,
        label: t('campaign.automated.form.unlimited'),
      },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
    ],
    [t],
  );

  const maxCommunicationValue = useMemo(
    () =>
      AUTOMATIC_MESSAGE_OPTIONS.filter(
        (option) => option.value === values.max_communications_sent_per_member,
      )?.[0],
    [values.max_communications_sent_per_member, AUTOMATIC_MESSAGE_OPTIONS],
  );

  return (
    <GenericResponsiveDrawer
      onClose={handleClose}
      open={open}
      subtitle={renderSubTitle()}
      title={t('mail.dialogTitle')}
    >
      <GenericResponsiveDialog maxWidth="sm" open={openRefreshDialog}>
        <DialogContent>
          <p>
            {values.communication_kind === COMMUNICATION_KIND_SMS
              ? t('mail.refreshTextPhone')
              : t('mail.refreshText')}
          </p>
          <DialogActions>
            <Button color="secondary" onClick={handleOpenRefreshDialog}>
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={handleReloadPage}
              type="submit"
              variant="outlined"
            >
              {t('common.refresh')}
            </Button>
          </DialogActions>
        </DialogContent>
      </GenericResponsiveDialog>
      <Form>
        <div className={classes.radioContainer}>
          <FormControlLabel
            classes={{ label: classes.center }}
            control={
              <Radio
                checked={
                  values.communication_kind === COMMUNICATION_KIND_EMAIL &&
                  values.email_kind === WRITTEN_EMAIL_KIND
                }
                disabled={
                  (alreadyConfiguredCommunicationKind || []).includes(
                    COMMUNICATION_KIND_EMAIL,
                  ) || !!initial?.id
                }
                onChange={handleSwitchToWrittenKindEmail}
              />
            }
            label={t('mail.writeMail')}
            labelPlacement="bottom"
          />
          <FormControlLabel
            classes={{ label: classes.center }}
            control={
              <Radio
                checked={
                  values.communication_kind === COMMUNICATION_KIND_EMAIL &&
                  values.email_kind === TEMPLATE_EMAIL_KIND
                }
                disabled={
                  (alreadyConfiguredCommunicationKind || []).includes(
                    COMMUNICATION_KIND_EMAIL,
                  ) || !!initial?.id
                }
                onChange={handleSwitchToEmailDesignKindEmail}
              />
            }
            label={t('mail.selectTemplate')}
            labelPlacement="bottom"
          />
          <FeatureListProvider>
            {(featureList: FeatureList) => (
              <FormControlLabel
                classes={{ label: classes.center }}
                control={
                  <Radio
                    checked={
                      values.communication_kind === COMMUNICATION_KIND_SMS
                    }
                    disabled={
                      !hasUpsell(featureList, UPSELL_IDENTIFIER_SMS) ||
                      (alreadyConfiguredCommunicationKind || []).includes(
                        COMMUNICATION_KIND_SMS,
                      ) ||
                      !!initial?.id
                    }
                    onChange={handleSwitchToSms}
                  />
                }
                label={t('mail.sendSms')}
                labelPlacement="bottom"
              />
            )}
          </FeatureListProvider>
          <FeatureListProvider>
            {(featureList: FeatureList) => (
              <FormControlLabel
                classes={{ label: classes.center }}
                control={
                  <Radio
                    checked={
                      values.communication_kind ===
                      COMMUNICATION_KIND_PUSH_NOTIFICATION
                    }
                    disabled={
                      (Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                        !hasUpsell(
                          featureList,
                          UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
                        )) ||
                      (alreadyConfiguredCommunicationKind || []).includes(
                        COMMUNICATION_KIND_PUSH_NOTIFICATION,
                      ) ||
                      !!initial?.id
                    }
                    onChange={handleSwitchToPushNotification}
                  />
                }
                label={t('mail.sendNotification')}
                labelPlacement="bottom"
              />
            )}
          </FeatureListProvider>
        </div>
        <div className={classes.contentEdition}>
          {values.communication_kind === COMMUNICATION_KIND_EMAIL &&
            values.email_kind === TEMPLATE_EMAIL_KIND && (
              <SelectTemplate
                emailDetailLoading={emailDetailLoading}
                emailDetails={emailDetails}
                emailListLoading={emailListLoading}
                emails={emails}
                getEmailDetail={getEmailDetail}
                getEmails={getEmails}
                mailDefaultTitle={mailDefaultTitle}
                onCancel={onCancel}
                onChangeTemplate={handleChangeTemplate}
                onChangeTitle={handleTitleChange}
                resolvedGenericTags={resolvedGenericTags}
                selectedMail={values.email_design}
                title={values.title}
              />
            )}
          {values.communication_kind === COMMUNICATION_KIND_EMAIL &&
            values.email_kind === WRITTEN_EMAIL_KIND && (
              <WriteEmail
                mailContent={values.text}
                onChangeContent={handleTextChange}
                onChangeTitle={handleTitleChange}
                title={values.title}
              />
            )}
          {values.communication_kind === COMMUNICATION_KIND_SMS && (
            <WriteSMS
              hideSmsCount
              contentLengthError={!!errors?.text}
              onChangeContent={handleTextChange}
              smsContent={values.text}
            />
          )}
          {values.communication_kind ===
            COMMUNICATION_KIND_PUSH_NOTIFICATION && (
            <WriteNotification
              notificationContent={values.text}
              notificationTitle={values.title}
              onNotificationContentChange={handleTextChange}
              onNotificationTitleChange={handleTitleChange}
            />
          )}
        </div>

        <Divider variant="fullWidth" />

        <div className={classes.limitSection}>
          <div className={classes.headerWithIcon}>
            <RemoveCircleIcon className={classes.leftIcon} />
            <Typography variant="h6">
              {t('campaign.automated.form.limitSection')}
            </Typography>
          </div>
          <div className={classes.selectContainer}>
            <Typography variant="caption">
              {t('campaign.automated.form.max_communications_sent_per_member')}
            </Typography>
            <Select
              onChange={handleChangeMaxCommunicationPerMember}
              options={AUTOMATIC_MESSAGE_OPTIONS}
              styles={selectStyles}
              value={maxCommunicationValue}
            />
          </div>
          <Alert className={classes.alert} severity="info" variant="outlined">
            {t(
              `campaign.automated.form.maxCommunicationSentHelperText.${values.event_kind}`,
            )}
          </Alert>
        </div>

        <Divider variant="fullWidth" />

        {!hideAutoResend &&
          values.communication_kind === COMMUNICATION_KIND_EMAIL && (
            <>
              <div className={classes.avancedSection}>
                <ButtonBase
                  disableRipple
                  className={classes.flexHeader}
                  onClick={handleOpenCloseAdvancedSection}
                >
                  <div className={classes.collapseTitle}>
                    <RepeatIcon className={classes.leftIcon} />
                    <Typography variant="h6">
                      {t('campaign.automated.form.advancedSection')}
                    </Typography>
                  </div>
                  <>
                    <ExpandMoreIcon
                      className={classNames(classes.expandIcon, {
                        [classes.rotate]: openedAdvancedSection,
                      })}
                    />
                  </>
                </ButtonBase>
                <Collapse in={openedAdvancedSection}>
                  <div className={classes.inputContainer}>
                    <TextField
                      castAsNumber
                      fullWidth
                      helperText={t('resendSection.resendCount.helperText')}
                      inputProps={{ min: 0, max: 5 }}
                      label={t('resendSection.resendCount.label')}
                      name="email_resend_count"
                      type="number"
                    />
                  </div>

                  <div className={classes.inputContainer}>
                    <TextField
                      castAsNumber
                      fullWidth
                      helperText={t('resendSection.resendDelay.helperText')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            className={classes.adornment}
                            position="end"
                          >
                            <Typography>
                              {t('common:day', {
                                count: values.email_resend_delay,
                              })}
                            </Typography>
                          </InputAdornment>
                        ),
                        inputProps: { min: 0, max: 180 },
                      }}
                      label={t('resendSection.resendDelay.label')}
                      name="email_resend_delay"
                      type="number"
                    />
                  </div>
                </Collapse>
              </div>

              <Divider />
            </>
          )}

        <div className={classes.buttonContainer}>
          <Button onClick={handleClose}>
            {t('translation:common.cancel')}
          </Button>
          {values.communication_kind === COMMUNICATION_KIND_SMS ? (
            <Button
              color="primary"
              disabled={isSubmitting || !isValid}
              onClick={handleCostReminderModalOpen}
              variant="contained"
            >
              {t('campaign.automated.form.submit')}
            </Button>
          ) : (
            <Submit color="primary" disabled={isSubmitting || !isValid}>
              {isSubmitting ? (
                <CircularProgress />
              ) : (
                t('campaign.automated.form.submit')
              )}
            </Submit>
          )}
        </div>
        <CommunicationSMSCostReminderModal
          handleClose={handleCostReminderModalOnClose}
          open={isSmsCostReminderModalOpen}
          sendMessageOnClick={handleSmsSending}
        />
      </Form>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  selectContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  limitSection: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    gap: theme.spacing(2),
  },
  radioContainer: {
    marginBottom: theme.spacing(2),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailConsentWarningContainer: {
    border: 'solid 1px rgb(255, 0, 0)',
    borderRadius: '5px',
    background: '#FCEAEA',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(2),
  },
  warningParagraph: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  center: {
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  flexHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  headerWithIcon: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  collapseTitle: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  avancedSection: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  alert: {
    alignItems: 'center',
  },
  expandIcon: {
    transform: 'rotate(0)',
    transition: 'all ease 0.3s',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
  contentEdition: {
    marginBottom: theme.spacing(3),
  },
  adornment: {
    paddingLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  inputContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

type Values = {
  id?: number;
  event_kind: number;
  communication_kind: number;
  text: string | null;
  email_design: number | null;
  title: string | null;
  max_communications_sent_per_member: number | null;
  email_kind: number | null;
  email_resend_count: number;
  email_resend_delay: number;
};

const AutomatedCampaignValidationSchema = Yup.object().shape({
  event_kind: Yup.number().required(),
  communication_kind: Yup.number().required(),
  text: Yup.string()
    .when('email_kind', {
      is: (email_kind: number) => email_kind !== TEMPLATE_EMAIL_KIND,
      then: Yup.string().min(1).required(),
      otherwise: Yup.string().nullable(),
    })
    .test(
      'content_max_length_for_sms_and_psuh_notification',
      'error_content_length',
      function checkContentLength(item) {
        if (!item) return true;
        const smsMaxLength =
          util.pickencoding(item) === 'gsm'
            ? MAX_LENGTH_SMS
            : MAX_LENGTH_AUTOMATIC_SMS;
        if (
          this.parent.communication_kind ===
          COMMUNICATION_KIND_PUSH_NOTIFICATION
        ) {
          return item.length <= MAX_LENGTH_PUSH_CONTENT;
        }
        if (this.parent.communication_kind === COMMUNICATION_KIND_SMS) {
          return item.length <= smsMaxLength;
        }
        return true;
      },
    ),
  email_design: Yup.mixed().when('email_kind', {
    is: (email_kind: number) => email_kind === TEMPLATE_EMAIL_KIND,
    then: Yup.number().required(),
    otherwise: Yup.number().nullable(),
  }),
  title: Yup.string().test(
    'title_max_length_for_push_notification',
    'error_title_length',
    function checkTitleLength(item) {
      if (!item) return true;
      if (
        this.parent.communication_kind === COMMUNICATION_KIND_PUSH_NOTIFICATION
      ) {
        return item.length <= MAX_LENGTH_PUSH_TITLE;
      }
      return true;
    },
  ),
  max_communications_sent_per_member: Yup.number().nullable().max(3),
  email_resend_count: Yup.number()
    .min(0)
    .max(5)
    .test(
      'check_resend_count_validity',
      '',
      function checkResendCountValidity(item) {
        if (
          this.parent.communication_kind === COMMUNICATION_KIND_EMAIL &&
          item + this.parent.email_resend_delay > 0
        ) {
          return item > 0 && this.parent.email_resend_delay > 0;
        }
        return true;
      },
    ),
  email_resend_delay: Yup.number()
    .min(0)
    .max(180)
    .test(
      'check_resend_delay_validity',
      '',
      function checkResendDelayValidity(item) {
        if (
          this.parent.communication_kind === COMMUNICATION_KIND_EMAIL &&
          item + this.parent.email_resend_count > 0
        ) {
          return item > 0 && this.parent.email_resend_count > 0;
        }
        return true;
      },
    ),
});

const formikFormWrapper = withFormik<Props, Values>({
  mapPropsToValues: ({ initial, default_event_kind }: Props) => {
    if (initial) {
      return {
        id: initial.id,
        event_kind: initial.event_kind,
        communication_kind: initial.communication_kind,
        text: initial.text,
        email_design: initial.email_design,
        title: initial.title,
        max_communications_sent_per_member:
          initial.max_communications_sent_per_member,
        email_kind: initial?.email_design
          ? TEMPLATE_EMAIL_KIND
          : WRITTEN_EMAIL_KIND,
        email_resend_count: initial.email_resend_count,
        email_resend_delay: initial.email_resend_delay,
      };
    }
    return {
      id: null,
      event_kind: default_event_kind || SEND_COMMUNICATION_ON_JOIN,
      communication_kind: COMMUNICATION_KIND_EMAIL,
      text: '',
      email_design: null,
      title: '',
      max_communications_sent_per_member: UNLIMITED_AUTOMATIC_MESSAGING,
      email_kind: WRITTEN_EMAIL_KIND,
      email_resend_count: 0,
      email_resend_delay: 0,
    };
  },
  enableReinitialize: true,
  validationSchema: AutomatedCampaignValidationSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const valuesToSubmit =
      values.communication_kind === COMMUNICATION_KIND_EMAIL
        ? values
        : {
            ...values,
            email_resend_count: 0,
            email_resend_delay: 0,
          };
    onSubmit(valuesToSubmit, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default formikFormWrapper(AutomatedCommunicationDrawer);
