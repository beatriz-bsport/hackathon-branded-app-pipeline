// @ts-nocheck
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
import Alert from '@material-ui/lab/Alert';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
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
import HTMLPreviewDialog from '#components/html/HTMLPreviewDialog.component';
import InfoBox from '#components/box/InfoBox.component';
import RequiredTags from '#components/notification/RequiredTags.component';

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
  restrictedAccess?: boolean;
  requiredTagsByEvent: { [key: number]: string[] };
  showAlert?: boolean;
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
    restrictedAccess,
    requiredTagsByEvent,
    showAlert,
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
          {restrictedAccess && (
            <InfoBox
              className={classes.infoBox}
              content={t('franchise.form.restrictedAccess')}
            />
          )}
          <Typography className={classes.description} variant="body1">
            {t('franchise.form.description', {
              name: t(`eventType.${notification_event}`),
            })}
          </Typography>
          <TextField
            fullWidth
            required
            disabled={restrictedAccess}
            id="name"
            label={t('franchise.form.name')}
            name="name"
          />
          <AlertError name="name" />

          <Typography className={classes.subtitle} variant="h6">
            {t('franchise.form.pickTemplate')}
          </Typography>
          <div className={classes.selector}>
            <div className={classes.emailSelector}>
              <EmailSelector
                error
                disabled={restrictedAccess}
                emails={
                  emailTemplates.filter((e) => e.company_id === null) || []
                }
                helperText={t('franchise.form.mailSelection')}
                name="email_design"
                onChange={(eventValue) => {
                  setFieldValue('email_design', eventValue || null);
                  eventValue && refreshEmailPreview(eventValue);
                }}
                value={values.email_design}
              />
              <AlertError name="email_design" />
            </div>
            <IconButton
              className={classes.showEmail}
              color="primary"
              disabled={!values.email_design}
              onClick={() => {
                setShowPreview(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
          {requiredTagsByEvent[notification_event] && showAlert && (
            <Alert
              classes={{ message: classes.MuiAlertMessage }}
              icon={false}
              severity="error"
            >
              <div className={classes.row}>
                <div className={classes.column}>
                  <ErrorOutlineIcon className={classes.iconColorRed} />
                </div>
                <div className={classes.column}>
                  <Typography>
                    {t('listItem.infoBoxErrorMessageFirstLine')}
                  </Typography>
                  <RequiredTags
                    requiredTagsList={
                      props.requiredTagsByEvent[props.notification_event]
                    }
                  />
                  <Typography>
                    {t('listItem.infoBoxErrorMessageLastLine')}
                  </Typography>
                </div>
              </div>
            </Alert>
          )}
          <Typography className={classes.subtitle} variant="h6">
            {t('franchise.form.useFor')}
          </Typography>
          <FranchiseCompaniesSelector
            companies={companies}
            companyDic={companyDic}
            menuPortalTarget={document.querySelector('body')}
            onChange={(newValue) => {
              setFieldValue(
                'selectedCompanies',
                newValue.map((val) => parseInt(val?.value, 10)), // don't touch selected unallowed companies {...selectedCompanies.filter((id)=> companies.some((c)=>c.id=id && !c.allowed)), ...newValue.blabla}
              );
            }}
            selectedCompanies={companies
              .filter((c) => values.selectedCompanies.includes(c.id))
              .map((c) => ({
                label: c.name,
                value: `${c.id}`,
              }))}
            unclearable={restrictedAccess}
          />
          <AlertError name="selectedCompanies" />
          <Typography className={classes.subtitle} variant="h6">
            {t('franchise.form.parameters')}
          </Typography>
          <CheckboxField
            disabled={
              restrictedAccess ||
              requiredTagsByEvent[notification_event].length > 0
            }
            label={t('franchise.form.activate')}
            name="active"
          />
          <Typography className={classes.grey} variant="caption">
            {t(
              values.active
                ? 'franchise.form.activateSubtitleActivate'
                : 'franchise.form.activateSubtitleDeactivate',
            )}
          </Typography>
          <CheckboxField
            disabled={
              restrictedAccess ||
              requiredTagsByEvent[notification_event].length > 0
            }
            label={t('franchise.form.receiveCC')}
            name="receiveCarbonCopy"
          />
          {values.receiveCarbonCopy && (
            <Typography className={classes.grey} variant="caption">
              {t('franchise.form.receiveCarbonCopySubtitle')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="text">
            {t('franchise.form.cancel')}
          </Button>
          <Submit
            color="primary"
            disabled={isSubmitting || !dirty || !isValid}
            onClick={() => handleSubmit()}
            variant="contained"
          >
            {t('franchise.form.save')}
          </Submit>
        </DialogActions>
      </Dialog>
      {showPreview && previewEmail && (
        <HTMLPreviewDialog
          open
          buttonText={t('franchise.form.cancel')}
          html={previewEmail?.html}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    infoBox: {
      marginBottom: theme.spacing(2),
    },
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
    listStyle: {
      margin: 'unset',
      paddingLeft: theme.spacing(3),
      '& li': {
        listStyleType: 'unset',
      },
    },
    iconColorRed: {
      color: theme.palette.error.main,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingRight: '15px',
    },
    MuiAlertMessage: {
      width: '100%',
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
      setSubmitting(false);
    },
  }),
)(FranchiseNotificationRuleFormModal);
