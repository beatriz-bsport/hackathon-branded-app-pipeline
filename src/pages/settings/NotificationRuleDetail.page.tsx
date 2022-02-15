// @flow
import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core';
import { push as pushRouter } from 'connected-react-router';

import { RootState } from '../../reducers';
import {
  fetchEventTypeList as fetchEventTypeListAction,
  fetchNotificationRuleList as fetchNotificationRuleListAction,
  createOrUpdateNotificationRule as createOrUpdateNotificationRuleAction,
  deleteNotificationRule as deleteNotificationRuleAction,
  fetchSettingsList as fetchSettingsListAction,
  updateSettings as updateSettingsAction,
  fetchTagList as fetchTagListAction,
} from '#libs/notification-rule/actions';
import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createOrUpdateMarketingNotification as createOrUpdateMarketingNotificationAction,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '#libs/marketing/actions';
import {
  emailTemplateDetail as fetchEmailDesignDetailAction,
  bulkEmailTemplateDetail as fetchBulkEmailDesignDetailAction,
  emailTemplatesSummaries as fetchEmailDesignListAction,
} from '#libs/email-editor/actions';

import {
  getEventByGroup,
  getTagCategories,
} from '#libs/notification-rule/selectors';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import { getCelebrationBirthday } from '#libs/marketing/selectors';

import withTitle from '#hocs/with-title.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import { NotificationRuleSettings } from '#libs/notification-rule/types';
import NotificationRuleGroupHeader from '#libs/notification-rule/components/NotificationRuleGroupHeader.component';
import NotificationRulePreview from '#libs/notification-rule/components/NotificationRulePreview.component';
import NotificationRulePreviewHeader from '#libs/notification-rule/components/NotificationRulePreviewHeader.component';
import NotificationRuleListItem from '#libs/notification-rule/components/NotificationRuleListItem.component';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';

const BIRTHDAY_NOTIFICATION = {
  kind: 0,
  is_event_based: false,
};

type Props = ConnectedProps<typeof connector> &
  WithTranslation & {
    eventName: string;
    pageHeight: number;
  };

const NotificationRuleDetail = (props: Props) => {
  const {
    eventListWithRule,
    emailDesignList,
    previewEmail,
    loading,
    settingsData,
    theme,
    tags,
    pageHeight,
    fetchEventTypeList,
    fetchNotificationRuleList,
    fetchEmailDesignList,
    fetchEmailDesignDetail,
    fetchBulkEmailDesignDetail,
    createOrUpdateNotificationRule,
    deleteNotificationRule,
    fetchSettingsList,
    updateSettings,
    fetchMarketingNotificationList,
    fetchTagList,
    push,
    t,
    eventName,
  } = props;

  useEffect(() => {
    fetchEventTypeList();
    fetchNotificationRuleList();
    fetchEmailDesignList();
    fetchSettingsList();
    fetchMarketingNotificationList({
      kind: BIRTHDAY_NOTIFICATION.kind,
    });
    fetchTagList();
  }, [
    fetchEventTypeList,
    fetchNotificationRuleList,
    fetchEmailDesignList,
    fetchSettingsList,
    fetchMarketingNotificationList,
    fetchTagList,
  ]);

  useEffect(() => {
    const eventTypeList = eventListWithRule?.[eventName] ?? [];
    const mailToFetch = eventTypeList
      .filter((e) => e?.rule?.email_design)
      .map((e) => e?.rule?.email_design);
    if (mailToFetch.length > 0) {
      fetchBulkEmailDesignDetail(mailToFetch);
    }
  }, [fetchBulkEmailDesignDetail, eventListWithRule, eventName]);

  const [displayNotification, setDisplayNotification] = useState(false);
  const [previewEmailId, setPreviewEmailId] = useState<number | null>(null);
  const [previewEmailHtml, setPreviewEmailHtml] = useState<string | null>(null);

  const handleCloseEmailPreview = () => {
    setPreviewEmailHtml(null);
    setPreviewEmailId(null);
  };

  const handleShowEmailPreview = (id: number) => {
    setPreviewEmailId(id);
    fetchEmailDesignDetail(id);
  };

  const handleSetDisplayNotification = (
    _: any,
    value: 'notification' | 'email',
  ) => {
    if (value === 'notification') {
      setDisplayNotification(true);
      return;
    }
    setDisplayNotification(false);
  };

  const notificationRuleSettings = settingsData.length
    ? settingsData[0].settings
    : {};

  const handleUpdateNotification = (rule: {
    notification_event: number;
    email_design?: number;
    push_notification_title?: string;
    push_notification_content?: string;
    is_notification_push_active?: boolean;
  }) => {
    if (rule.email_design) {
      fetchEmailDesignDetail(rule.email_design);
    }

    createOrUpdateNotificationRule(rule);
  };

  const handleUpdate = (
    newNotificationRuleSettings: Record<number, NotificationRuleSettings>,
  ) => {
    updateSettings({
      ...settingsData[0],
      settings: newNotificationRuleSettings,
    });
  };

  const handleSettingsDisable =
    (notification_event: number) =>
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      handleUpdate({
        ...notificationRuleSettings,
        [notification_event]: {
          ...(notificationRuleSettings?.[notification_event] ?? {}),
          disabled: !ev.target.checked,
          send_company:
            notificationRuleSettings?.[notification_event]?.send_company ??
            false,
        },
      });
    };

  const handleSettingsCopy =
    (notification_event: number) =>
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      handleUpdate({
        ...notificationRuleSettings,
        [notification_event]: {
          ...(notificationRuleSettings?.[notification_event] ?? {}),
          disabled:
            notificationRuleSettings?.[notification_event]?.disabled ?? false,
          send_company: ev.target.checked,
        },
      });
    };

  const navigateToGeneral = () => () => {
    push(`/settings/notification-rule`);
  };

  const classes = useStyles();

  const eventTypeList = eventListWithRule?.[eventName] ?? [];

  const getMergeTags = (): {
    label: string;
    options: { label: string; value: string }[];
  }[] => {
    if (tags) {
      return [
        ...Object.entries(tags).reduce((acc, [tagCategory, tagList]) => {
          acc.push({
            label: t(`notificationRule:tag.${tagCategory}.name`),
            options: [...tagList].map((tag) => ({
              label: t(`notificationRule:tag.${tagCategory}.tags.${tag}`),
              value: `{${tag}}`,
            })),
          });
          return acc;
        }, []),
      ];
    }
    return [];
  };

  return (
    <div>
      {loading && <BackofficeLinearProgress />}
      <div className={classes.wrapper} style={{ maxHeight: pageHeight }}>
        <div className={classes.sticky}>
          <NotificationRuleGroupHeader
            eventGroupName={eventName}
            eventsList={eventTypeList}
            settings={notificationRuleSettings}
            isOpen
            onToggleClick={navigateToGeneral}
          />
        </div>
        <div className={classes.sticky}>
          <NotificationRulePreviewHeader
            className={classes.preview}
            value={displayNotification ? 'notification' : 'email'}
            onChange={handleSetDisplayNotification}
          />
        </div>
        {eventTypeList.map((event) => (
          <React.Fragment key={event.notification_event}>
            <NotificationRuleListItem
              event={event.notification_event}
              rule={event.rule}
              emailDesignList={emailDesignList}
              updateNotification={handleUpdateNotification}
              showEmailPreview={handleShowEmailPreview}
              showEmailPreviewHTML={setPreviewEmailHtml}
              onDeleteNotificationRule={deleteNotificationRule}
              franchisedOwned={!!event.rule?.franchisor ?? false}
              disabled={
                notificationRuleSettings?.[event.notification_event]
                  ?.disabled ?? false
              }
              sendCompany={
                notificationRuleSettings?.[event.notification_event]
                  ?.send_company ?? false
              }
              onDisable={handleSettingsDisable(event.notification_event)}
              onSendCompany={handleSettingsCopy(event.notification_event)}
              tags={getMergeTags()}
              className={classes.listItem}
            />
            <NotificationRulePreview
              event={event}
              previewEmail={previewEmail}
              displayMode={displayNotification ? 'notification' : 'email'}
              showEmailPreview={handleShowEmailPreview}
              showEmailPreviewHTML={setPreviewEmailHtml}
              theme={theme}
              className={classes.shrink}
            />
          </React.Fragment>
        ))}
      </div>
      {(!!previewEmailHtml ||
        (!!previewEmailId &&
          previewEmail[previewEmailId] &&
          previewEmail[previewEmailId].html)) && (
        <Dialog open>
          <div
            // eslint-disable-next-line
                dangerouslySetInnerHTML={{
              __html: previewEmailHtml || previewEmail[previewEmailId].html,
            }}
          />
          <DialogActions>
            <Button onClick={handleCloseEmailPreview}>
              {t('emailDesign.closePreview')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  sticky: {
    position: 'sticky',
    width: '100%',
    top: 0,
    left: 0,
    backgroundColor: theme.palette.background.default,
    zIndex: 2,
  },
  preview: {
    paddingTop: theme.spacing(6),
  },
  listItem: {
    flexShrink: 0,
    marginLeft: 2,
    marginRight: 2,
  },
  wrapper: {
    overflow: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gridGap: theme.spacing(3),
  },
  shrink: {
    display: 'flex',
    flex: 1,
    position: 'relative',
  },
}));

const connector = connect(
  (state: RootState) => ({
    eventListWithRule: getEventByGroup.onlyGeneric(state),
    emailDesignList: getAllEmailTemplatesSummaries(state),
    previewEmail: getEmailTemplatesDetail(state),
    loading:
      state.notificationRule.rule.loading ||
      state.emailTemplate.isLoading ||
      state.notificationRule.settings.loading ||
      state.marketingNotification.loading,
    settingsData: state.notificationRule.settings.data,
    birthdayNotification: getCelebrationBirthday(state),
    tags: getTagCategories(state),
    company: state.theme.theme.company,
    theme: state.theme.theme,
  }),
  {
    fetchEventTypeList: fetchEventTypeListAction,
    fetchNotificationRuleList: fetchNotificationRuleListAction,
    fetchEmailDesignList: fetchEmailDesignListAction,
    fetchEmailDesignDetail: fetchEmailDesignDetailAction,
    fetchBulkEmailDesignDetail: fetchBulkEmailDesignDetailAction,
    createOrUpdateNotificationRule: createOrUpdateNotificationRuleAction,
    deleteNotificationRule: deleteNotificationRuleAction,
    fetchSettingsList: fetchSettingsListAction,
    updateSettings: updateSettingsAction,
    fetchMarketingNotificationList: fetchMarketingNotificationListAction,
    createOrUpdateMarketingNotification:
      createOrUpdateMarketingNotificationAction,
    deleteMarketingNotification: deleteMarketingNotificationAction,
    fetchTagList: fetchTagListAction,
    push: pushRouter,
  },
);

export default compose<any, Props>(
  withPageHeightHOC(),
  routerParamsToProps({ eventName: 'eventName' }),
  withTranslation(['notificationRule']),
  withTitle(({ t }) => t('pageTitle')),
  connector,
)(NotificationRuleDetail);
