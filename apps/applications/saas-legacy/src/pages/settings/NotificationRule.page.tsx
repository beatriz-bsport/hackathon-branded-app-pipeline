import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core';
import { push as pushRouter } from 'connected-react-router';

import {
  fetchEventTypeList as fetchEventTypeListAction,
  fetchNotificationRuleList as fetchNotificationRuleListAction,
  fetchSettingsList as fetchSettingsListAction,
} from '#src/libs/notification-rule/actions';
import { fetchMarketingNotificationList as fetchMarketingNotificationListAction } from '#src/libs/marketing/actions';
import { emailTemplatesSummaries as fetchEmailDesignListAction } from '#src/libs/email-editor/actions';

import { getEventByGroup } from '#src/libs/notification-rule/selectors';

import withTitle from '#src/hocs/with-title.hoc';
import NotificationRuleGroupHeader from '#src/libs/notification-rule/components/NotificationRuleGroupHeader.component';
import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import { RootState } from '../../reducers';

const BIRTHDAY_NOTIFICATION = {
  kind: 0,
  is_event_based: false,
};

type Props = ConnectedProps<typeof connector> & WithTranslation;

const NotificationRule = (props: Props) => {
  const {
    eventListWithRule,
    settingsData,
    loading,
    fetchEventTypeList,
    fetchNotificationRuleList,
    fetchEmailDesignList,
    fetchSettingsList,
    fetchMarketingNotificationList,
    push,
  } = props;

  useEffect(() => {
    fetchEventTypeList();
    fetchNotificationRuleList();
    fetchEmailDesignList();
    fetchSettingsList();
    fetchMarketingNotificationList({
      kind: BIRTHDAY_NOTIFICATION.kind,
    });
  }, [
    fetchEventTypeList,
    fetchNotificationRuleList,
    fetchEmailDesignList,
    fetchSettingsList,
    fetchMarketingNotificationList,
  ]);

  const navigateToDetails = (eventName: string) => () => {
    push(`/settings/notification-rule/${eventName}`);
  };

  const classes = useStyles();

  const notificationRuleSettings = settingsData.length
    ? settingsData[0].settings
    : {};

  return (
    <>
      {loading && <BackofficeLinearProgress />}
      <div className={classes.wrapper}>
        <div className={classes.block}>
          {Object.entries(eventListWithRule).map(
            ([eventGroupName, eventTypeList]) => (
              <NotificationRuleGroupHeader
                className={classes.group}
                eventGroupName={eventGroupName}
                eventsList={eventTypeList}
                isOpen={false}
                onToggleClick={navigateToDetails}
                settings={notificationRuleSettings}
              />
            ),
          )}
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  block: {
    flex: 1,
  },
  group: {
    marginBottom: theme.spacing(4),
  },
  preview: {
    marginTop: theme.spacing(6),
  },
}));

const connector = connect(
  (state: RootState) => ({
    eventListWithRule: getEventByGroup.onlyGeneric(state),
    settingsData: state.notificationRule.settings.data,
    loading:
      state.notificationRule.rule.loading ||
      // @ts-expect-error
      state.emailTemplate.isLoading ||
      state.notificationRule.settings.loading ||
      state.marketingNotification.loading,
  }),
  {
    fetchEventTypeList: fetchEventTypeListAction,
    fetchNotificationRuleList: fetchNotificationRuleListAction,
    fetchEmailDesignList: fetchEmailDesignListAction,
    fetchSettingsList: fetchSettingsListAction,
    fetchMarketingNotificationList: fetchMarketingNotificationListAction,
    push: pushRouter,
  },
);

export default compose<any, Props>(
  withTranslation(['notificationRule']),
  withTitle(({ t }) => t('pageTitle')),
  connector,
)(NotificationRule);
