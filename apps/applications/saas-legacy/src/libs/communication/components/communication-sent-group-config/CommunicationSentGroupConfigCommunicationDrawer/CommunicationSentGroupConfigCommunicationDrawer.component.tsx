import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import { withFormik, Form, FormikProps, useFormikContext } from 'formik';
// @ts-expect-error
import WriteEmail from '#src/libs/communication/components/WriteEmail.component';
// @ts-expect-error
import SelectTemplate from '#src/libs/communication/components/SelectTemplate.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import type { SendGroupedCommunicationData } from '#src/libs/communication/types';
import { CONTEXT_FRANCHISE } from '#src/libs/communication-v2/constants';
import { SenderEmailKind } from '#src/libs/communication/constants';
import { FranchiseCompany } from '#src/libs/franchise/types';
import type { OptionCallback } from '../../../../../state/types';
// @ts-expect-error
import { Submit } from '../../../../../components/forms';
import CommunicationSentGroupConfigCommunicationSenderEmailChoice from './CommunicationSentGroupConfigCommunicationSenderEmailChoice.component';

const WRITTEN_EMAIL_KIND = 0;
const TEMPLATE_EMAIL_KIND = 1;

const CommunicationSentGroupConfigValidationSchemaCommunicationValidationSchema =
  Yup.object().shape({
    body: Yup.string().test({
      name: 'body',
      test: function nonEmptyBody(body) {
        const { email_kind } = this.parent;
        if (email_kind === WRITTEN_EMAIL_KIND && !body?.length) {
          return this.createError({
            message: 'campaign:schemaError.nonEmptyBody',
            path: this.path,
          });
        }
        return true;
      },
    }),
    email_design: Yup.number()
      .nullable()
      .test({
        name: 'email_design',
        test: function nonEmptyEmailTemplate(email_design) {
          const { email_kind } = this.parent;
          if (email_kind === TEMPLATE_EMAIL_KIND && !email_design) {
            return this.createError({
              message: 'campaign:schemaError.nonEmptyEmailTemplate',
              path: this.path,
            });
          }
          return true;
        },
      }),
    subject: Yup.string().min(1).required(),
    communicationSentGroupConfigId: Yup.number().required(),
    senderEmailKind: Yup.string().required(),
    senderEmail: Yup.string().required(),
    email_kind: Yup.number().required(),
  });

type Props = {
  fetchEmailTemplatesSummaries: () => void;
  emailTemplatesListLoading: boolean;
  emailTemplatesList: EmailTemplateSummary[];
  fetchEmailTemplateDetail: (id: number) => void;
  emailTemplateDetailLoading: boolean;
  emailTemplateDetails: { [key: number]: EmailTemplateDetail };
  isEmailDrawerOpen: boolean;
  onCancel: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (
    data: SendGroupedCommunicationData,
    options?: OptionCallback,
  ) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  communicationSentGroupConfigId: number;
  resolvedGenericTags: ResolvedGenericTags;
  franchisorCustomDomain: string | null;
  companies: FranchiseCompany[];
};

type FormikValues = FormikProps<Values>;

const useFormikHandlers = () => {
  const { values, setValues }: FormikValues = useFormikContext();
  const handleSwitchToWrittenKindEmail = () =>
    setValues({
      ...values,
      email_kind: WRITTEN_EMAIL_KIND,
    });

  const handleSwitchToEmailDesignKindEmail = () =>
    setValues({
      ...values,
      email_kind: TEMPLATE_EMAIL_KIND,
    });

  return {
    handleSwitchToWrittenKindEmail,
    handleSwitchToEmailDesignKindEmail,
  };
};

export const CommunicationSentGroupConfigCommunicationDrawer: React.FC<
  Props & FormikProps<Values>
> = ({
  values,
  isEmailDrawerOpen,
  fetchEmailTemplatesSummaries,
  resetForm,
  onCancel,
  setFieldValue,
  setValues,
  fetchEmailTemplateDetail,
  emailTemplatesListLoading,
  emailTemplatesList,
  emailTemplateDetailLoading,
  emailTemplateDetails,
  isSubmitting,
  isValid,
  resolvedGenericTags,
  franchisorCustomDomain,
  companies,
}) => {
  const { t } = useTranslation(['communication', 'campaign']);
  const classes = useStyles();
  const [isOpenRefreshDialog, setIsOpenRefreshDialog] = React.useState(false);
  const handleClose = () => {
    resetForm();
    onCancel();
  };

  React.useEffect(() => {
    if (!isEmailDrawerOpen) {
      resetForm();
    }
  }, [isEmailDrawerOpen, resetForm]);

  React.useEffect(() => {
    if (isEmailDrawerOpen) {
      fetchEmailTemplatesSummaries();
    }
  }, [isEmailDrawerOpen, fetchEmailTemplatesSummaries]);

  const handleBodyChange = useCallback(
    (body: string) => setFieldValue('body', body),
    [setFieldValue],
  );

  const handleSubjectChange = useCallback(
    (subject: string) => setFieldValue('subject', subject),
    [setFieldValue],
  );

  const handleTemplateChange = useCallback(
    (id: number) => {
      setValues({
        ...values,
        email_design: id,
        subject:
          emailTemplatesList.find((email) => email.id === id)?.subject ?? '',
      });
    },
    [setValues, emailTemplatesList, values],
  );

  const handleCloseRefreshDialog = useCallback(
    () => setIsOpenRefreshDialog(false),
    [],
  );

  const handleReloadPage = () => document.location.reload();

  const { handleSwitchToWrittenKindEmail, handleSwitchToEmailDesignKindEmail } =
    useFormikHandlers();

  return (
    <GenericResponsiveDrawer
      onClose={handleClose}
      open={isEmailDrawerOpen}
      title={t('mail.dialogTitle')}
    >
      <GenericResponsiveDialog maxWidth="sm" open={isOpenRefreshDialog}>
        <DialogContent>
          {t('mail.refreshText')}
          <DialogActions>
            <Button color="secondary" onClick={handleCloseRefreshDialog}>
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
          <div className={classes.radioContainerItem}>
            <FormControlLabel
              classes={{ label: classes.center }}
              control={
                <Radio
                  checked={values.email_kind === WRITTEN_EMAIL_KIND}
                  onChange={handleSwitchToWrittenKindEmail}
                />
              }
              label={t('mail.writeMail')}
              labelPlacement="bottom"
            />
          </div>
          <div className={classes.radioContainerItem}>
            <FormControlLabel
              classes={{ label: classes.center }}
              control={
                <Radio
                  checked={values.email_kind === TEMPLATE_EMAIL_KIND}
                  onChange={handleSwitchToEmailDesignKindEmail}
                />
              }
              label={t('mail.selectTemplate')}
              labelPlacement="bottom"
            />
          </div>
        </div>
        <CommunicationSentGroupConfigCommunicationSenderEmailChoice
          companies={companies}
          franchisorCustomDomain={franchisorCustomDomain}
        />
        {values.email_kind === TEMPLATE_EMAIL_KIND && (
          <SelectTemplate
            fromFranchisor
            emailDetailLoading={emailTemplateDetailLoading}
            emailDetails={emailTemplateDetails}
            emailListLoading={emailTemplatesListLoading}
            emails={emailTemplatesList}
            getEmailDetail={fetchEmailTemplateDetail}
            getEmails={fetchEmailTemplatesSummaries}
            onCancel={onCancel}
            onChangeTemplate={handleTemplateChange}
            onChangeTitle={handleSubjectChange}
            resolvedGenericTags={resolvedGenericTags}
            selectedMail={values.email_design}
            title={values.subject}
          />
        )}
        {values.email_kind === WRITTEN_EMAIL_KIND && (
          <WriteEmail
            mailContent={values.body}
            onChangeContent={handleBodyChange}
            onChangeTitle={handleSubjectChange}
            title={values.subject}
          />
        )}
        <div className={classes.buttonContainer}>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Submit color="primary" disabled={isSubmitting || !isValid}>
            {isSubmitting ? (
              <CircularProgress />
            ) : (
              t('campaign:mail.sendButton')
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
  radioContainerItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1 0 0',
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
  emailRadioContainer: { display: 'flex', flexDirection: 'column' },
}));

export type Values = {
  communicationSentGroupConfigId: number;
  body: string | null;
  email_design: number | null;
  subject: string | null;
  email_kind: number | null;
  senderEmailKind: SenderEmailKind;
  senderEmail: string;
  senderCustomEmailUsername: string;
};

const formikFormWrapper = withFormik<Props, Values>({
  mapPropsToValues: ({
    communicationSentGroupConfigId,
    companies,
  }: {
    communicationSentGroupConfigId: number;
    companies: FranchiseCompany[];
  }) => {
    return {
      body: '',
      email_design: null,
      subject: '',
      email_kind: WRITTEN_EMAIL_KIND,
      communicationSentGroupConfigId,
      senderEmailKind: SenderEmailKind.franchisee,
      senderEmail: companies ? companies[0].email : '',
      senderCustomEmailUsername: '',
    };
  },
  validationSchema:
    CommunicationSentGroupConfigValidationSchemaCommunicationValidationSchema,
  validateOnMount: true,
  handleSubmit: (
    values,
    { props: { onSubmit, franchisorCustomDomain }, setSubmitting },
  ) => {
    onSubmit(
      {
        send_communication_data: {
          subject: values.subject,
          context_identifier: CONTEXT_FRANCHISE,
          context_object_id: values.communicationSentGroupConfigId,
          ...(values.email_kind === WRITTEN_EMAIL_KIND
            ? { body: values.body }
            : { email_template: values.email_design }),
        },
        communication_sent_group_config: values.communicationSentGroupConfigId,
        ...(values.senderEmailKind === SenderEmailKind.franchisee
          ? { from_address: values.senderEmail }
          : {
              from_address: `${values.senderCustomEmailUsername}@${franchisorCustomDomain}`,
            }),
      },
      {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      },
    );
  },
});

export default React.memo(
  formikFormWrapper(CommunicationSentGroupConfigCommunicationDrawer),
);
