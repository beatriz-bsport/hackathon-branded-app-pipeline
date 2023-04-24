// @ts-nocheck
import React from 'react';
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

import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

import Radio from '@material-ui/core/Radio';
import { withFormik, Form, FormikProps, useFormikContext } from 'formik';
import SettingsIcon from '@material-ui/icons/Settings';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from '@material-ui/lab/Alert';
import { SEND_COMMUNICATION_ON_JOIN } from '@bsport/common/lib/master-data/smart-list';
import { AutomatedCampaign } from '#libs/smart-list/types';
import Config from '../../../../config';
import {
  MAX_LENGTH_PUSH_TITLE,
  MAX_LENGTH_PUSH_CONTENT,
  MAX_LENGTH_AUTOMATIC_SMS,
} from '#libs/communication-v2/constants';
import WriteNotification from '#libs/communication/components/WriteNotification.component';
import WriteSMS from '#libs/communication/components/WriteSMS.component';
import WriteEmail from '#libs/communication/components/WriteEmail.component';
import SelectTemplate from '#libs/communication/components/SelectTemplate.component';
import FeatureListProvider from '../../../company/hocs/feature-list-provider.hoc';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { Submit } from '#components/forms';
import NumericInput from '#components/input/NumericInput.component';
import type { FeatureList } from '#libs/company/types';
import type { OptionCallback } from '../../../../state/types';
import { ResolvedGenericTags } from '#libs/email-editor/types';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';

const WRITTEN_EMAIL_KIND = 0;
const TEMPLATE_EMAIL_KIND = 1;

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
  emails: Array<any>;
  emailDetailLoading: boolean;
  emailDetails: Array<any>;
  open: boolean;
  mailDefaultTitle?: string;
  alreadyConfiguredCommunicationKind: number[];
  resolvedGenericTags: ResolvedGenericTags;
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

  const handleChangeMaxCommunicationPerMember = (event) =>
    setFieldValue('max_communications_sent_per_member', event.target.value);

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
}) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();
  const [openRefreshDialog, setOpenRefreshDialog] = React.useState(false);
  const [openedAdvancedSection, setOpenedAdvancedSection] =
    React.useState(false);

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
    }
  }, [open, getEmails]);

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

  return (
    <GenericResponsiveDrawer
      title={t('mail.dialogTitle')}
      subtitle={renderSubTitle()}
      open={open}
      onClose={handleClose}
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
              variant="outlined"
              type="submit"
              color="primary"
              onClick={handleReloadPage}
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
                onChange={handleSwitchToWrittenKindEmail}
                disabled={
                  (alreadyConfiguredCommunicationKind || []).includes(
                    COMMUNICATION_KIND_EMAIL,
                  ) || !!initial?.id
                }
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
                onChange={handleSwitchToEmailDesignKindEmail}
                disabled={
                  (alreadyConfiguredCommunicationKind || []).includes(
                    COMMUNICATION_KIND_EMAIL,
                  ) || !!initial?.id
                }
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
                      (Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                        !hasUpsell(featureList, UPSELL_IDENTIFIER_SMS)) ||
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
        {values.communication_kind === COMMUNICATION_KIND_EMAIL &&
          values.email_kind === TEMPLATE_EMAIL_KIND && (
            <SelectTemplate
              title={values.title}
              selectedMail={values.email_design}
              onChangeTitle={handleTitleChange}
              onChangeTemplate={(id: number) => {
                setFieldValue('email_design', id);
                setFieldValue(
                  'title',
                  emails.find((email) => email.id === id)?.subject ?? '',
                );
              }}
              onCancel={onCancel}
              getEmails={getEmails}
              getEmailDetail={getEmailDetail}
              emailListLoading={emailListLoading}
              emails={emails}
              emailDetailLoading={emailDetailLoading}
              emailDetails={emailDetails}
              mailDefaultTitle={mailDefaultTitle}
              resolvedGenericTags={resolvedGenericTags}
            />
          )}
        {values.communication_kind === COMMUNICATION_KIND_EMAIL &&
          values.email_kind === WRITTEN_EMAIL_KIND && (
            <WriteEmail
              mailContent={values.text}
              title={values.title}
              onChangeContent={handleTextChange}
              onChangeTitle={handleTitleChange}
            />
          )}
        {values.communication_kind === COMMUNICATION_KIND_SMS && (
          <WriteSMS
            hideSmsCount
            smsContent={values.text}
            onChangeContent={handleTextChange}
            contentLengthError={!!errors?.text}
            maxLengthContent={MAX_LENGTH_AUTOMATIC_SMS}
          />
        )}
        {values.communication_kind === COMMUNICATION_KIND_PUSH_NOTIFICATION && (
          <WriteNotification
            notificationTitle={values.title}
            onNotificationTitleChange={handleTitleChange}
            notificationContent={values.text}
            onNotificationContentChange={handleTextChange}
          />
        )}
        <div className={classes.avancedSection}>
          <ButtonBase
            onClick={handleOpenCloseAdvancedSection}
            className={classes.flexHeader}
            disableRipple
          >
            <div className={classes.headerWithIcon}>
              <SettingsIcon className={classes.leftIcon} />
              <Typography variant="h6">
                {t('campaign.automated.form.advancedSection')}
              </Typography>
            </div>
            <>
              {openedAdvancedSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </>
          </ButtonBase>
          <Collapse in={openedAdvancedSection}>
            <NumericInput
              required
              fullWidth
              helperText={t(
                'campaign.automated.form.max_communications_sent_per_member_limit',
                { max: 3 },
              )}
              label={t(
                'campaign.automated.form.max_communications_sent_per_member',
              )}
              value={values.max_communications_sent_per_member}
              onChange={handleChangeMaxCommunicationPerMember}
              InputProps={{
                inputProps: { step: 1, min: 0 },
              }}
            />
          </Collapse>
        </div>
        <Alert variant="outlined" severity="info" className={classes.alert}>
          {t('campaign.automated.form.frequenceHelper', {
            event_kind: t(`campaign.automated.eventKind.${values.event_kind}`),
            max: values.max_communications_sent_per_member,
          })}
        </Alert>
        <div className={classes.buttonContainer}>
          <Button onClick={handleClose}>
            {t('translation:common.cancel')}
          </Button>
          <Submit disabled={isSubmitting || !isValid} color="primary">
            {isSubmitting ? (
              <CircularProgress />
            ) : (
              t('campaign.automated.form.submit')
            )}
          </Submit>
        </div>
      </Form>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
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
  },
  leftIcon: {
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  headerWithIcon: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: theme.spacing(2),
  },
  avancedSection: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  alert: {
    alignItems: 'center',
  },
}));

type Values = {
  id?: number;
  event_kind: number;
  communication_kind: number;
  text: string | null;
  email_design: number | null;
  title: string | null;
  max_communications_sent_per_member: number;
  email_kind: number | null;
};

const AutomatedCampaignValidationSchema = Yup.object().shape({
  event_kind: Yup.number().required(),
  communication_kind: Yup.number().required(),
  text: Yup.string().test(
    'content_max_length_for_sms_and_psuh_notification',
    'error_content_length',
    function checkContentLength(item) {
      if (!item) return true;
      if (
        this.parent.communication_kind === COMMUNICATION_KIND_PUSH_NOTIFICATION
      ) {
        return item.length <= MAX_LENGTH_PUSH_CONTENT;
      }
      if (this.parent.communication_kind === COMMUNICATION_KIND_SMS) {
        return item.length <= MAX_LENGTH_AUTOMATIC_SMS;
      }

      return true;
    },
  ),
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
  max_communications_sent_per_member: Yup.number().required().max(3),
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
      };
    }
    return {
      id: null,
      event_kind: default_event_kind || SEND_COMMUNICATION_ON_JOIN,
      communication_kind: COMMUNICATION_KIND_EMAIL,
      text: '',
      email_design: null,
      title: '',
      max_communications_sent_per_member: 1,
      email_kind: WRITTEN_EMAIL_KIND,
    };
  },
  enableReinitialize: true,
  validationSchema: AutomatedCampaignValidationSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default formikFormWrapper(AutomatedCommunicationDrawer);
