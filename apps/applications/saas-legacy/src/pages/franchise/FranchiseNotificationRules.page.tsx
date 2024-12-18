import React, { useCallback, useEffect, useState } from 'react';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import { createStyles, Grid, Theme } from '@material-ui/core';
import { EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS } from '@bsport/common/lib/master-data/error-codes/notification-rule.js';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import {
  fetchEventTypeList as fetchEventTypeListAction,
  fetchNotificationRuleList as fetchNotificationRuleListAction,
  updateSettings as updateSettingsAction,
  createOrUpdateNotificationRule as createOrUpdateNotificationRuleAction,
  deleteNotificationRule as deleteNotificationRuleAction,
} from '#src/libs/notification-rule/actions';
import {
  getEventByGroup,
  getFranchiseNotificationRules,
  getRequiredTagsByEvent,
} from '#src/libs/notification-rule/selectors';

import { fetchMarketingNotificationList as fetchMarketingNotificationListAction } from '#src/libs/marketing/actions';
import { getCelebrationBirthday } from '#src/libs/marketing/selectors';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';

import {
  emailTemplateDetail as fetchEmailDesignDetailAction,
  emailTemplatesSummaries as fetchEmailDesignListAction,
} from '#src/libs/email-editor/actions';
import withTitle from '#src/hocs/with-title.hoc';
import { getFranchiseCompanies } from '#src/libs/franchise/selectors';

import FranchiseNotificationRuleList from '#src/libs/franchise/components/FranchiseNotificationRuleList.component';
import FranchiseNotificationRuleDetails from '#src/libs/franchise/components/FranchiseNotificationRuleDetails.component';
import { NotificationRule } from '#src/libs/notification-rule/types';
import { RootState } from '../../reducers';
import { OptionCallback } from '../../state/types';

const BIRTHDAY_NOTIFICATION = {
  kind: 0,
  is_event_based: false,
};

type OwnProps = {
  notificationId?: number;
};
type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export const FranchiseNotificationRule = (props: Props) => {
  const {
    eventListWithRule,
    emailDesignList,
    companies,
    previewEmail,
    loading,
    rules,
    notificationId,
    deleteNotificationRule,
    fetchEventTypeList,
    fetchEmailDesignList,
    fetchMarketingNotificationList,
    fetchEmailDesignDetail,
    navigateToNotification,
    createOrUpdateNotificationRule,
    fetchNotificationRuleList,
    requiredTagsByEvent,
    classes,
  } = props;

  useEffect(() => {
    fetchEventTypeList();
    fetchEmailDesignList();
    fetchMarketingNotificationList({
      kind: BIRTHDAY_NOTIFICATION.kind,
    });
    /* eslint-disable */
  }, [
    fetchEventTypeList,
    fetchEmailDesignList,
    fetchMarketingNotificationList,
  ]);
  /* eslint-enable */

  useEffect(() => {
    fetchNotificationRuleList();
  }, [fetchNotificationRuleList]);

  const [selectedPreviewEmail, setSelectedPreviewEmail] = useState(null);

  const handleFetchPreview = (emailId: number) => {
    setSelectedPreviewEmail(emailId);

    fetchEmailDesignDetail(emailId);
  };

  const handleCreate = useCallback(
    (data: Omit<NotificationRule, 'id'>, options: OptionCallback) => {
      createOrUpdateNotificationRule(data, {
        onError: (error: Error) => {
          if (
            // @ts-expect-error
            error.response?.data.error_code ===
              EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS &&
            options?.onError
          ) {
            options.onError();
          }
        },
        onSuccess: options?.onSuccess,
      });
    },
    [createOrUpdateNotificationRule],
  );

  const handleDelete = (id: number) => () => {
    deleteNotificationRule(id);
  };

  const handleEdit = useCallback(
    (id: number) =>
      (data: Omit<NotificationRule, 'id'>, options: OptionCallback) => {
        createOrUpdateNotificationRule(
          { ...data, id },
          {
            onError: (error: Error) => {
              if (
                // @ts-expect-error
                error.response?.data.error_code ===
                  EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS &&
                options?.onError
              ) {
                options.onError();
              }
            },
            onSuccess: options?.onSuccess,
          },
        );
      },
    [createOrUpdateNotificationRule],
  );

  const handleNavigation = (id: number) => () => {
    navigateToNotification(id);
  };

  if (loading || Object.keys({ ...eventListWithRule }).length === 0) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.page}>
      <Grid container direction="row" spacing={3}>
        <Grid item className={classes.column} md={6} xs={12}>
          <FranchiseNotificationRuleList
            // @ts-expect-error
            eventListWithRule={eventListWithRule}
            navigateToNotification={handleNavigation}
            notificationId={notificationId}
          />
        </Grid>
        <Grid item className={classes.column} md={6} xs={12}>
          <FranchiseNotificationRuleDetails
            // @ts-expect-error
            companies={companies}
            emailDesignList={emailDesignList}
            fetchEmailDesignDetail={fetchEmailDesignDetail}
            handleCreate={handleCreate}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleFetchPreview={handleFetchPreview}
            notificationId={notificationId}
            previewEmail={previewEmail}
            requiredTagsByEvent={requiredTagsByEvent}
            rules={rules}
            selectedPreviewEmail={selectedPreviewEmail}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    page: {
      padding: theme.spacing(2),
    },
    column: {
      paddingRight: theme.spacing(1),
      overflowY: 'auto',
      maxHeight: `calc(100vh - ${64 + 2 * theme.spacing(2)}px)`,
    },
  });

const connector = connect(
  (state: RootState, { notificationId }: { notificationId: number }) => ({
    rules: getFranchiseNotificationRules(state, notificationId),
    companies: getFranchiseCompanies(state),
    eventListWithRule: getEventByGroup.onlyGeneric(state),
    emailDesignList: getAllEmailTemplatesSummaries(state),
    previewEmail: getEmailTemplatesDetail(state),
    loading:
      state.notificationRule.rule.loading ||
      state.emailTemplate.loading ||
      state.marketingNotification.loading,
    birthdayNotification: getCelebrationBirthday(state),
    requiredTagsByEvent: getRequiredTagsByEvent(state),
  }),
  {
    createOrUpdateNotificationRule: createOrUpdateNotificationRuleAction,
    deleteNotificationRule: deleteNotificationRuleAction,
    fetchEventTypeList: fetchEventTypeListAction,
    fetchNotificationRuleList: fetchNotificationRuleListAction,
    fetchEmailDesignList: fetchEmailDesignListAction,
    fetchMarketingNotificationList: fetchMarketingNotificationListAction,
    fetchEmailDesignDetail: fetchEmailDesignDetailAction,
    updateSettings: updateSettingsAction,
    navigateToNotification: (notificationId: number) =>
      push(`/f/settings/notification-rule/${notificationId}`),
  },
);

export default compose<any, OwnProps>(
  withTranslation(['notificationRule']),
  withTitle(({ t }) => t('pageTitle')),
  routerParamsToProps({ notificationId: 'notificationId:number' }),
  withStyles(styles),
  connector,
)(FranchiseNotificationRule);
