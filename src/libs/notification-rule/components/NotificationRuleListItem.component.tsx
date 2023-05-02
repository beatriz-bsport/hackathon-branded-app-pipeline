// @ts-nocheck
// @flow
import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { FormControlLabel, Typography, Button } from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { AxiosError } from 'axios';
import EmailSelector from '../../email-editor/components/EmailSelector.component';
import Tooltip from '../../../components/Tooltip.component';
import { NotificationRule } from '../types';
import { EmailTemplateSummary } from '#libs/email-editor/types';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import NotificationForm from './NotificationForm.component';
import { UPSELL_IDENTIFIER_PUSH_NOTIFICATION } from '#libs/platform-billing/upsell-identifiers';
import { FeatureList } from '#libs/company/types';
import { hasUpsell } from '#libs/platform-billing/utils';
import RequiredTags from '#components/notification/RequiredTags.component';
import { OptionCallback } from '../../../state/types';

const {
  EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS,
} = require('@bsport/common/lib/master-data/error-codes/notification-rule');

type Props = {
  emailDesignList: EmailTemplateSummary[];

  showEmailPreviewHTML: (html: string) => void;
  showEmailPreview: (id: number) => void;

  updateNotification: (
    rule: {
      notification_event: number;
      email_design?: number;
      push_notification_title?: string;
      push_notification_content?: string;
      is_notification_push_active?: boolean;
    },
    options?: OptionCallback,
  ) => void;
  onDeleteNotificationRule: (id: number) => void;

  event: number;
  rule?: NotificationRule;

  tags: {
    label: string;
    options: { label: string; value: string }[];
  }[];

  disabled: boolean;
  sendCompany: boolean;
  disableCheckboxes: boolean;
  franchisedOwned: boolean;
  onDisable: (ev: Object) => void;
  onSendCompany: (ev: Object) => void;
  className?: string;
  requiredTags: string[];
};
export const NotificationRuleListItem = (props: Props) => {
  const {
    disabled,
    sendCompany,
    disableCheckboxes,
    franchisedOwned,
    emailDesignList,
    event,
    rule,
    className,
    tags,
    updateNotification,
    onDeleteNotificationRule,
    showEmailPreviewHTML,
    showEmailPreview,
    onDisable,
    onSendCompany,
    requiredTags,
  } = props;

  const { t } = useTranslation('notificationRule');
  const classes = useStyles();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleTagsError = useCallback(
    (error: AxiosError) => {
      if (
        error.response?.data.error_code &&
        error.response?.data.error_code === EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS
      ) {
        setShowAlert(true);
      }
    },
    [setShowAlert],
  );

  const hideAlert = useCallback(() => {
    setShowAlert(false);
  }, [setShowAlert]);

  const handleShowEmail = () => {
    if (rule && !rule.email_design) {
      showEmailPreviewHTML(rule.email_template);
    } else {
      showEmailPreview(rule.email_design);
    }
  };

  const handleChangeEmail = useCallback(
    (option: any) => {
      if (!option) {
        return onDeleteNotificationRule(rule.id);
      }
      if (rule?.company) {
        return updateNotification(
          {
            ...rule,
            email_design: option.value,
          },
          { onError: handleTagsError, onSuccess: hideAlert },
        );
      }
      return updateNotification(
        {
          notification_event: event,
          email_design: option.value,
        },
        { onError: handleTagsError, onSuccess: hideAlert },
      );
    },
    [
      onDeleteNotificationRule,
      updateNotification,
      handleTagsError,
      hideAlert,
      event,
      rule,
    ],
  );

  const renderEmailSelector = () => (
    <>
      <Typography className={classes.emailLabel}>
        {t('listItem.mailToSend')}
      </Typography>
      <div className={classes.selector}>
        <div className={classes.tooltipContainer}>
          <Tooltip hide={!franchisedOwned} title={t('franchiseOwned')}>
            <div>
              {/* div is need here for the tooltip */}
              <EmailSelector
                emails={emailDesignList}
                value={(rule || {}).email_design}
                helperText={t('emailDesign.placeholder')}
                onChange={handleChangeEmail}
                disabled={franchisedOwned}
                nullCurrentValue={showAlert && !(rule || {}).email_design}
              />
            </div>
          </Tooltip>
        </div>
        <div>
          <IconButton
            disabled={!rule?.email_design}
            className={classes.showEmail}
            color="primary"
            onClick={handleShowEmail}
          >
            <VisibilityIcon
              color={rule?.email_design ? 'primary' : 'disabled'}
            />
          </IconButton>
        </div>
      </div>
    </>
  );

  const closeDialog = () => {
    setDialogIsOpen(false);
  };

  const openDialog = () => {
    setDialogIsOpen(true);
  };

  const handleSubmit = useCallback(
    ({
      push_notification_title,
      push_notification_content,
    }: {
      push_notification_title: string;
      push_notification_content: string;
    }) => {
      let is_notification_push_active;
      if (
        rule.push_notification_title === '' &&
        rule.push_notification_content === '' &&
        rule.is_notification_push_active === false
      ) {
        is_notification_push_active = true;
      }
      setDialogIsOpen(false);
      if (rule?.company || rule?.companies) {
        return updateNotification(
          {
            ...rule,
            push_notification_title,
            push_notification_content,
            is_notification_push_active,
          },
          { onError: handleTagsError, onSuccess: hideAlert },
        );
      }
      return updateNotification(
        {
          notification_event: event,
          push_notification_title,
          push_notification_content,
          is_notification_push_active,
        },
        { onError: handleTagsError, onSuccess: hideAlert },
      );
    },
    [
      rule,
      event,
      setDialogIsOpen,
      updateNotification,
      handleTagsError,
      hideAlert,
    ],
  );

  const handleNotificationToggle = useCallback(
    (_: any, value: boolean) => {
      setDialogIsOpen(false);
      if (rule?.company || rule?.companies) {
        return updateNotification(
          {
            ...rule,
            is_notification_push_active: value,
          },
          { onError: handleTagsError, onSuccess: hideAlert },
        );
      }
      return updateNotification(
        {
          notification_event: event,
          is_notification_push_active: value,
        },
        { onError: handleTagsError, onSuccess: hideAlert },
      );
    },
    [
      setDialogIsOpen,
      rule,
      event,
      updateNotification,
      handleTagsError,
      hideAlert,
    ],
  );

  return (
    <FeatureListProvider>
      {(featureList: FeatureList) => {
        const hasNotificationUpsell = hasUpsell(
          featureList,
          UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
        );

        return (
          <Paper className={classNames(classes.container, className)}>
            <Typography className={classes.title}>
              {t(`eventType.${event}`)}
            </Typography>
            <div className={classes.inner}>
              <div
                className={
                  hasNotificationUpsell ? classes.boxSeventy : classes.boxThirty
                }
              >
                <Typography className={classes.subtitle}>
                  {t('listItem.transactionnalEmail')}
                </Typography>
                <Tooltip
                  hide={!franchisedOwned}
                  title={<>{t('franchiseOwned')}</>}
                >
                  <div className={classes.checkbox}>
                    {/* div is need here for the tooltip */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!disabled}
                          onChange={onDisable}
                          disabled={
                            franchisedOwned ||
                            disableCheckboxes ||
                            requiredTags.length > 0
                          }
                        />
                      }
                      label={t('listItem.sendTransactionnalEmail')}
                      disabled={disableCheckboxes || requiredTags.length > 0}
                    />
                  </div>
                </Tooltip>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sendCompany}
                      onChange={(ev) => onSendCompany(ev)}
                      disabled={disableCheckboxes || requiredTags.length > 0}
                    />
                  }
                  label={t('listItem.copyCarbon')}
                  disabled={disableCheckboxes || requiredTags.length > 0}
                />
                {hasNotificationUpsell && renderEmailSelector()}
              </div>
              <div
                className={
                  hasNotificationUpsell ? classes.boxThirty : classes.boxSeventy
                }
              >
                {!hasNotificationUpsell && renderEmailSelector()}
                {hasNotificationUpsell && (
                  <>
                    <Typography className={classes.subtitle}>
                      {t('listItem.transactionnalNotification')}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rule?.is_notification_push_active ?? false}
                          onChange={handleNotificationToggle}
                          disabled={
                            (rule?.push_notification_content ?? '') === '' ||
                            (rule?.push_notification_title ?? '') === '' ||
                            disableCheckboxes ||
                            requiredTags.length > 0
                          }
                        />
                      }
                      label={t('listItem.sendTransactionnalNotification')}
                    />
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={openDialog}
                      disabled={disableCheckboxes || requiredTags.length > 0}
                    >
                      {t(
                        rule?.push_notification_content ||
                          rule?.push_notification_title
                          ? 'listItem.modifyTransactionnalNotification'
                          : 'listItem.createTransactionnalNotification',
                      )}
                    </Button>
                    {dialogIsOpen && (
                      <NotificationForm
                        onSubmit={handleSubmit}
                        onCancel={closeDialog}
                        initial={rule}
                        tags={tags}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            {showAlert && requiredTags.length > 0 && (
              <Alert
                severity="error"
                icon={false}
                classes={{ message: classes.MuiAlertMessage }}
              >
                <div className={classes.row}>
                  <div className={classes.column}>
                    <ErrorOutlineIcon className={classes.iconColorRed} />
                  </div>
                  <div className={classes.column}>
                    <Typography>
                      {t('listItem.infoBoxErrorMessageFirstLine')}
                    </Typography>
                    <RequiredTags requiredTagsList={props.requiredTags} />
                    <Typography>
                      {t('listItem.infoBoxErrorMessageLastLine')}
                    </Typography>
                  </div>
                </div>
              </Alert>
            )}
          </Paper>
        );
      }}
    </FeatureListProvider>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(4),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  title: {
    fontWeight: 500,
    fontSize: 20,
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontWeight: 500,
    fontSize: 14,
  },
  text: {
    maxWidth: '55%',
    marginLeft: theme.spacing(3),
  },
  showEmail: {
    marginRight: theme.spacing(1),
  },
  selector: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  event: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  rightContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inner: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  emailLabel: {
    fontSize: 12,
  },
  boxThirty: {
    flex: 3,
    width: '30%',
    [theme.breakpoints.down('xs')]: {
      flex: 1,
      width: '100%',
    },
  },
  boxSeventy: {
    flex: 7,
    width: '70%',
    [theme.breakpoints.down('xs')]: {
      flex: 1,
      width: '100%',
    },
  },
  checkbox: {
    marginBottom: theme.spacing(1),
  },
  tooltipContainer: {
    width: '85%',
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
}));

export default NotificationRuleListItem;
