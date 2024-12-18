import React, { useMemo, useState } from 'react';
import Alert from '@material-ui/lab/Alert/Alert';

import {
  Button,
  Typography,
  Collapse,
  Divider,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import SendIcon from '@material-ui/icons/Send';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Tooltip from '#src/components/Tooltip.component';
import { MAX_LENGTH_PUSH_TITLE } from '#src/libs/communication/constants';
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc';
import EmailSelector from '#src/libs/email-editor/components/EmailSelector.component';
// @ts-expect-error
import { CheckboxField, TextField } from '#src/components/forms';
import NotificationContentInput from '#src/libs/communication/components/NotificationContentInput.component';
import type { FeatureList } from '#src/libs/company/types';
import {
  EmailTemplateDetail,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import { replaceGenericTagsInTemplate } from '#src/libs/email-editor/utils';
import { UPSELL_IDENTIFIER_PUSH_NOTIFICATION } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';

type Props = {
  getEmailDetail: (id: number) => void;
  emailListLoading: boolean;
  send_email: boolean;
  send_notification_push: boolean;
  notificationTitle: string;
  notificationContent: string;
  emails: Array<any>;
  email_design: number;
  emailDetailLoading: boolean;
  emailDetails: { [key: string]: EmailTemplateDetail };
  setFieldValue: (key: string, value: any) => void;
  errors: any;
  resolvedGenericTags: ResolvedGenericTags;
  tags: { [tag_name: string]: string[] };
};

const MarketingRuleSendingMethodField = (props: Props) => {
  const {
    send_email,
    send_notification_push,
    notificationTitle,
    notificationContent,
    errors,
    emailListLoading,
    emails,
    email_design,
    getEmailDetail,
    emailDetailLoading,
    emailDetails,
    setFieldValue,
    tags,
    resolvedGenericTags,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation(['subscription', 'communication']);

  React.useEffect(() => {
    if (email_design) {
      getEmailDetail(email_design);
    }
  }, [getEmailDetail, email_design]);

  const [displayEmailPreview, setDisplayEmailPreview] = useState(false);

  const emailPreview = useMemo(
    () =>
      replaceGenericTagsInTemplate(
        resolvedGenericTags,
        emailDetails[email_design]?.html,
      ),
    [email_design, emailDetails, resolvedGenericTags],
  );
  return (
    <div>
      <Divider className={classes.divider} />
      <div className={classes.fieldContainer}>
        <div className={classes.titleContainer}>
          <SendIcon color="action" />
          <Typography variant="h6">
            {t('notificationForm.sendingMethod.title')}
          </Typography>
        </div>
        <div className={classes.choiceField}>
          <CheckboxField
            checked={send_email}
            label={t('notificationForm.sendingMethod.email')}
            name="send_email"
          />
          <FeatureListProvider>
            {(featureList: FeatureList) => {
              const hasPushNotificationUpsell = hasUpsell(
                featureList,
                UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
              );
              return (
                <Tooltip
                  hide={hasPushNotificationUpsell}
                  placement="bottom-start"
                  title={t('booking:notification.form.needPushUpsell')}
                >
                  <div className={classes.flex}>
                    <CheckboxField
                      checked={send_notification_push}
                      disabled={!hasPushNotificationUpsell}
                      label={t(
                        'notificationForm.sendingMethod.notificationPush',
                      )}
                      name="send_notification_push"
                    />
                  </div>
                </Tooltip>
              );
            }}
          </FeatureListProvider>
        </div>
        {send_notification_push && (
          <Typography color="textSecondary" variant="caption">
            {t('notificationForm.notificationPush.warning')}
          </Typography>
        )}
        {send_email && (
          <>
            <Typography
              className={classNames(
                [classes.spacingTop],
                [classes.spacingBottom],
              )}
              variant="subtitle2"
            >
              {t('notificationForm.emailNotification.parameters')}
            </Typography>
            <Typography
              className={classNames({
                [classes.errorText]: errors.email_design,
              })}
              variant="caption"
            >
              {t('notificationForm.emailNotification.emailToSend')}
            </Typography>
            {emailListLoading ? (
              <LinearProgress className={classes.selectorContainer} />
            ) : (
              <div className={classes.selectorContainer}>
                <div className={classes.emailSelectorContainer}>
                  <EmailSelector
                    emails={emails}
                    helperText={t(
                      'paymentPack:notification.form.mailSelection',
                    )}
                    // @ts-expect-error
                    name="email_design"
                    onChange={(eventValue) => {
                      setFieldValue('email_design', eventValue || null);
                      if (eventValue) getEmailDetail(eventValue);
                    }}
                    value={email_design}
                  />
                </div>
              </div>
            )}
            <div className={classes.buttonContainer}>
              <Button
                onClick={() =>
                  setDisplayEmailPreview((prevDisplay) => !prevDisplay)
                }
              >
                {displayEmailPreview ? (
                  <div className={classes.inlineContainer}>
                    <VisibilityOffIcon className={classes.visibilityIcon} />
                    <Typography variant="caption">
                      {t('paymentPack:notification.form.hideMail')}
                    </Typography>
                  </div>
                ) : (
                  <div className={classes.inlineContainer}>
                    <VisibilityIcon className={classes.visibilityIcon} />
                    <Typography variant="caption">
                      {t('paymentPack:notification.form.showMail')}
                    </Typography>
                  </div>
                )}
              </Button>
            </div>
            <Collapse in={displayEmailPreview}>
              <div className={classes.emailPreview}>
                {email_design && !!emailDetails[email_design] ? (
                  <div>
                    <div
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                        __html: emailPreview || null,
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    {emailDetailLoading ? (
                      <CircularProgress />
                    ) : (
                      <div className={classes.previewEmpty}>
                        <Alert className={classes.alertInfo} severity="info">
                          {emails.length
                            ? t('communication:mail.selectToShowPreview')
                            : t('notification.form.noMailAvailable')}
                        </Alert>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Collapse>
          </>
        )}
        {send_notification_push && (
          <div className={classes.fieldContainer}>
            <Typography
              className={classNames(
                [classes.spacingTop],
                [classes.spacingBottom],
                {
                  [classes.errorText]: errors.notificationContent,
                },
              )}
              variant="subtitle2"
            >
              {t('paymentPack:notification.form.pushTitle')}
            </Typography>
            <TextField
              fullWidth
              inputProps={{ maxLength: MAX_LENGTH_PUSH_TITLE }}
              label={t('communication:mail.titleNotification')}
              name="notificationTitle"
            />
            <Typography variant="caption">
              {`${notificationTitle?.length ?? 0}/${MAX_LENGTH_PUSH_TITLE}`}
            </Typography>
            <NotificationContentInput
              className={classes.notificationInput}
              label={t('communication:mail.contentNotification')}
              name="notificationContent"
              tags={tags}
              value={notificationContent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.info.main,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  fieldContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  inlineContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emailPreview: {
    border: '1px solid grey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    minHeight: '30vh',
    minWidth: '40vh',
  },
  choiceField: {
    marginLeft: theme.spacing(1.5),
    marginTop: theme.spacing(1.75),
  },
  select: {
    minWidth: theme.spacing(20),
  },
  selectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  emailSelectorContainer: {
    width: '100%',
  },
  previewEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(6),
  },
  visibilityIcon: {
    marginRight: theme.spacing(1),
  },
  errorText: {
    color: 'red',
  },
  spacingTop: {
    marginTop: theme.spacing(2),
  },
  spacingBottom: {
    marginBottom: theme.spacing(2),
  },
  notificationInput: {
    marginTop: theme.spacing(2),
  },
  flex: {
    display: 'flex',
  },
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(1) },
}));

export default MarketingRuleSendingMethodField;
