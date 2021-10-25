import React, { useRef, useState } from 'react';
import { compose } from 'recompose';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import { FranchiseCompany } from '../types';
import {
  AlertError,
  CheckboxField,
  Submit,
  TextField,
} from '../../../components/forms';
import EmailSelector from '../../email-editor/components/EmailSelector.component';
import FranchiseCompaniesSelector from './FranchiseCompaniesSelector.component';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
import { FranchiseCompleteNotificationRule } from '../../notification-rule/types';

export type OwnProps = {
  rule?: FranchiseCompleteNotificationRule;
  notification_event: number;
  open: boolean;
  companies: FranchiseCompany[];
  emailTemplates: EmailTemplateSummary[];
  onSubmit: (data: Omit<FranchiseCompleteNotificationRule, 'id'>) => void;
  onClose: () => void;
  previewEmail: EmailTemplateDetail;
  refreshEmailPreview: (id: number) => void;
};

type Props = OwnProps & WithTranslation & WithStyles<typeof styles>;

const FranchiseNotificationRuleFormModal = (props: Props) => {
  const {
    notification_event,
    open,
    companies,
    emailTemplates,
    isSubmitting,
    setFieldValue,
    values,
    handleSubmit,
    dirty,
    isValid,
    onClose,
    classes,
    t,
    previewEmail,
    refreshEmailPreview,
  } = props;

  const ref = useRef(null);
  const companyDic = companies?.reduce<Record<number, FranchiseCompany>>(
    (dic, company) => {
      // eslint-disable-next-line no-param-reassign
      dic[company.id] = company;
      return dic;
    },
    {},
  );

  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>{t('franchise.form.title')}</DialogTitle>
        <DialogContent ref={ref} className={classes.content}>
          <Typography variant="body1" className={classes.description}>
            {t('franchise.form.description', {
              name: t(`eventType.${notification_event}`),
            })}
          </Typography>
          <TextField
            id="name"
            name="name"
            label={t('franchise.form.name')}
            fullWidth
            required
          />
          <AlertError name="name" />

          <Typography variant="h6" className={classes.subtitle}>
            {t('franchise.form.pickTemplate')}
          </Typography>
          <div className={classes.selector}>
            <div className={classes.emailSelector}>
              <EmailSelector
                error
                name="email_design"
                emails={
                  emailTemplates.filter((e) => e.company_id === null) || []
                }
                value={values.email_design}
                onChange={(ev) => {
                  setFieldValue('email_design', ev ? ev.value : null);
                  ev && refreshEmailPreview(ev.value);
                }}
                helperText={t('franchise.form.mailSelection')}
              />
              <AlertError name="email_design" />
            </div>
            <IconButton
              disabled={!values.email_design}
              className={classes.showEmail}
              color="primary"
              onClick={() => {
                setShowPreview(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
          <Typography variant="h6" className={classes.subtitle}>
            {t('franchise.form.useFor')}
          </Typography>
          <FranchiseCompaniesSelector
            onChange={(newValue) => {
              setFieldValue(
                'selectedCompanies',
                newValue.map((val) => parseInt(val?.value, 10)),
              );
            }}
            selectedCompanies={companies
              .filter((c) => values.selectedCompanies.includes(c.id))
              .map((c) => ({
                label: c.name,
                value: `${c.id}`,
              }))}
            companyDic={companyDic}
            companies={companies}
            menuPortalTarget={document.querySelector('body')}
          />
          <AlertError name="selectedCompanies" />
          <Typography variant="h6" className={classes.subtitle}>
            {t('franchise.form.parameters')}
          </Typography>
          <CheckboxField name="active" label={t('franchise.form.activate')} />
          <Typography variant="caption" className={classes.grey}>
            {t(
              values.active
                ? 'franchise.form.activateSubtitleActivate'
                : 'franchise.form.activateSubtitleDeactivate',
            )}
          </Typography>
          <CheckboxField
            name="receiveCarbonCopy"
            label={t('franchise.form.receiveCC')}
          />
          {values.receiveCarbonCopy && (
            <Typography variant="caption" className={classes.grey}>
              {t('franchise.form.receiveCarbonCopySubtitle')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={onClose}>
            {t('franchise.form.cancel')}
          </Button>
          <Submit
            disabled={isSubmitting || !dirty || !isValid}
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}
          >
            {t('franchise.form.save')}
          </Submit>
        </DialogActions>
      </Dialog>
      {showPreview && previewEmail && (
        <Dialog open>
          <div
            // eslint-disable-next-line
            dangerouslySetInnerHTML={{
              __html: previewEmail.html,
            }}
          />
          <DialogActions>
            <Button onClick={() => setShowPreview(false)}>
              {t('franchise.form.cancel')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    description: {
      marginBottom: theme.spacing(2),
    },
    content: {
      minWidth: 600,
    },
    subtitle: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      fontSize: 16,
    },
    grey: {
      color: theme.palette.grey[500],
    },
    showEmail: {
      padding: 0,
      marginBottom: 8,
    },
    selector: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    emailSelector: {
      flex: 1,
      minWidth: 400,
    },
  });

const NoticationSchema = Yup.object().shape({
  name: Yup.string().required('notificationRule:franchise.form.error.name'),
  selectedCompanies: Yup.array()
    .of(Yup.number())
    .required('notificationRule:franchise.form.error.selectCompanies'),
  email_design: Yup.number()
    .min(1)
    .required('notificationRule:franchise.form.error.email_design'),
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['notificationRule']),
  withFormik({
    mapPropsToValues: ({ initial, rule }) =>
      initial || {
        name: rule?.title ?? '',
        selectedCompanies: rule?.companies ?? [],
        email_design: rule?.email_design ?? undefined,
        active: rule?.is_active ?? true,
        receiveCarbonCopy: rule?.send_franchisor_carbon_copy ?? false,
      },
    validationSchema: NoticationSchema,
    handleSubmit: (
      values,
      { props: { onSubmit, notification_event }, setSubmitting },
    ) => {
      const data = {
        title: values.name,
        companies: values.selectedCompanies,
        email_design: values.email_design,
        notification_event,
        is_active: values.active,
        send_franchisor_carbon_copy: values.receiveCarbonCopy,
      };
      onSubmit(data, {
        onSuccess: () => setSubmitting(false),
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  }),
)(FranchiseNotificationRuleFormModal);
