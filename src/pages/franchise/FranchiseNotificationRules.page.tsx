// @flow
import React, { useEffect, useState } from 'react';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import { createStyles, Grid, Theme } from '@material-ui/core';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchEventTypeList as fetchEventTypeListAction,
  fetchNotificationRuleList as fetchNotificationRuleListAction,
  updateSettings as updateSettingsAction,
  createOrUpdateNotificationRule as createOrUpdateNotificationRuleAction,
  deleteNotificationRule as deleteNotificationRuleAction,
} from '../../libs/notification-rule/actions';
import {
  getEventByGroup,
  getFranchiseNotificationRules,
} from '../../libs/notification-rule/selectors';

import { fetchMarketingNotificationList as fetchMarketingNotificationListAction } from '../../libs/marketing/actions';
import { getCelebrationBirthday } from '../../libs/marketing/selectors';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';

import {
  emailTemplateDetail as fetchEmailDesignDetailAction,
  emailTemplatesSummaries as fetchEmailDesignListAction,
} from '../../libs/email-editor/actions';
import withTitle from '../../hocs/with-title.hoc';
import { RootState } from '../../reducers';
import { getFranchiseCompanies } from '../../libs/franchise/selectors';

import FranchiseNotificationRuleList from '../../libs/franchise/components/FranchiseNotificationRuleList.component';
import FranchiseNotificationRuleDetails from '../../libs/franchise/components/FranchiseNotificationRuleDetails.component';
import { NotificationRule } from '../../libs/notification-rule/types';

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
    classes,
  } = props;

  useEffect(() => {
    fetchEventTypeList();
    fetchEmailDesignList();
    fetchMarketingNotificationList({
      kind: BIRTHDAY_NOTIFICATION.kind,
    });
  }, [
    fetchEventTypeList,
    fetchEmailDesignList,
    fetchMarketingNotificationList,
  ]);

  useEffect(() => {
    fetchNotificationRuleList();
  }, [fetchNotificationRuleList]);

  const [selectedPreviewEmail, setSelectedPreviewEmail] = useState(null);

  if (loading || Object.keys({ ...eventListWithRule }).length === 0) {
    return <LinearProgress />;
  }

  const handleFetchPreview = (emailId: number) => {
    setSelectedPreviewEmail(emailId);

    fetchEmailDesignDetail(emailId);
  };

  const handleCreate = (data: Omit<NotificationRule, 'id'>) => {
    createOrUpdateNotificationRule(data);
  };

  const handleDelete = (id: number) => () => {
    deleteNotificationRule(id);
  };

  const handleEdit = (id: number) => (data: Omit<NotificationRule, 'id'>) => {
    createOrUpdateNotificationRule({ ...data, id });
  };

  const handleNavigation = (id: number) => () => {
    navigateToNotification(id);
  };

  return (
    <div className={classes.page}>
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} md={6} className={classes.column}>
          <FranchiseNotificationRuleList
            eventListWithRule={eventListWithRule}
            notificationId={notificationId}
            navigateToNotification={handleNavigation}
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.column}>
          <FranchiseNotificationRuleDetails
            emailDesignList={emailDesignList}
            companies={companies}
            previewEmail={previewEmail}
            rules={rules}
            notificationId={notificationId}
            fetchEmailDesignDetail={fetchEmailDesignDetail}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleCreate={handleCreate}
            handleFetchPreview={handleFetchPreview}
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
