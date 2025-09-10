import React, { useCallback, useEffect, useState } from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core';
import { push as pushRouter } from 'connected-react-router';

import {
  fetchEventTypeList as fetchEventTypeListAction,
  fetchNotificationRuleList as fetchNotificationRuleListAction,
  createOrUpdateNotificationRule as createOrUpdateNotificationRuleAction,
  fetchSettingsList as fetchSettingsListAction,
  updateSettings as updateSettingsAction,
  fetchTagList as fetchTagListAction,
  fetchResolvedGenericTags as fetchResolvedGenericTagsAction,
  deleteNotificationRule as deleteNotificationRuleAction,
} from '#src/libs/notification-rule/actions';
import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAction,
  createOrUpdateMarketingNotification as createOrUpdateMarketingNotificationAction,
  deleteMarketingNotification as deleteMarketingNotificationAction,
} from '#src/libs/marketing/actions';
import {
  emailTemplateDetail as fetchEmailDesignDetailAction,
  bulkEmailTemplateDetail as fetchBulkEmailDesignDetailAction,
  emailTemplatesSummaries as fetchEmailDesignListAction,
} from '#src/libs/email-editor/actions';

import {
  getEventByGroup,
  getRequiredTagsByEvent,
  getResolvedGenericTags,
  getTagCategories,
} from '#src/libs/notification-rule/selectors';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';
import { getCelebrationBirthday } from '#src/libs/marketing/selectors';

import withTitle from '#src/hocs/with-title.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
import { NotificationRuleSettings } from '#src/libs/notification-rule/types';
import NotificationRuleGroupHeader from '#src/libs/notification-rule/components/NotificationRuleGroupHeader.component';
import NotificationRulePreview from '#src/libs/notification-rule/components/NotificationRulePreview.component';
import NotificationRulePreviewHeader from '#src/libs/notification-rule/components/NotificationRulePreviewHeader.component';
import NotificationRuleListItem from '#src/libs/notification-rule/components/NotificationRuleListItem.component';
import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import HTMLPreviewDialog from '#src/components/html/HTMLPreviewDialog.component';
import { ResolvedGenericTags } from '#src/libs/email-editor/types';
import { RootState } from '../../reducers';
import { OptionCallback } from '../../state/types';

const BIRTHDAY_NOTIFICATION = {
  kind: 0,
  is_event_based: false,
};

type Props = ConnectedProps<typeof connector> &
  WithTranslation & {
    eventName: string;
    pageHeight: number;
    fetchResolvedGenericTags: () => void;
    resolvedGenericTags: ResolvedGenericTags;
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
    resolvedGenericTags,
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
    fetchResolvedGenericTags,
    push,
    t,
    eventName,
    requiredTagsByEvent,
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
    fetchResolvedGenericTags();
  }, [
    fetchEventTypeList,
    fetchNotificationRuleList,
    fetchEmailDesignList,
    fetchSettingsList,
    fetchMarketingNotificationList,
    fetchTagList,
    fetchResolvedGenericTags,
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

  const handleUpdateNotification = useCallback(
    (
      rule: {
        notification_event: number;
        email_design?: number;
        push_notification_title?: string;
        push_notification_content?: string;
        is_notification_push_active?: boolean;
      },
      options?: OptionCallback,
    ) => {
      if (rule.email_design) {
        fetchEmailDesignDetail(rule.email_design);
      }

      createOrUpdateNotificationRule(rule, options);
    },
    [fetchEmailDesignDetail, createOrUpdateNotificationRule],
  );

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
      <div className={classes.page} style={{ maxHeight: pageHeight }}>
        <div className={classes.gridContainer}>
          <div className={classes.gridItemLeft}>
            <NotificationRuleGroupHeader
              isOpen
              eventGroupName={eventName}
              eventsList={eventTypeList}
              onToggleClick={navigateToGeneral}
              settings={notificationRuleSettings}
            />
          </div>
          <div className={classes.gridItemRight}>
            <NotificationRulePreviewHeader
              className={classes.notificationHeader}
              onChange={handleSetDisplayNotification}
              value={displayNotification ? 'notification' : 'email'}
            />
          </div>
        </div>
        {eventTypeList.map((event) => (
          <React.Fragment key={event.notification_event}>
            <div className={classes.gridContainer}>
              <NotificationRuleListItem
                className={classes.gridItemLeft}
                disableCheckboxes={
                  notificationRuleSettings?.[event.notification_event]
                    ?.disable_checkboxes ?? false
                }
                disabled={
                  notificationRuleSettings?.[event.notification_event]
                    ?.disabled ?? false
                }
                emailDesignList={emailDesignList}
                event={event.notification_event}
                franchisedOwned={!!event.rule?.franchisor}
                onDeleteNotificationRule={deleteNotificationRule}
                onDisable={handleSettingsDisable(event.notification_event)}
                onSendCompany={handleSettingsCopy(event.notification_event)}
                requiredTags={requiredTagsByEvent[event.notification_event]}
                rule={event.rule}
                sendCompany={
                  notificationRuleSettings?.[event.notification_event]
                    ?.send_company ?? false
                }
                showEmailPreview={handleShowEmailPreview}
                showEmailPreviewHTML={setPreviewEmailHtml}
                tags={getMergeTags()}
                updateNotification={handleUpdateNotification}
              />
              <NotificationRulePreview
                className={classes.gridItemRight}
                displayMode={displayNotification ? 'notification' : 'email'}
                event={event}
                previewEmail={previewEmail}
                resolvedGenericTags={resolvedGenericTags}
                showEmailPreview={handleShowEmailPreview}
                showEmailPreviewHTML={setPreviewEmailHtml}
                theme={theme}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
      {(!!previewEmailHtml ||
        (!!previewEmailId &&
          previewEmail[previewEmailId] &&
          previewEmail[previewEmailId].html)) && (
        <HTMLPreviewDialog
          open
          buttonText={t('emailDesign.closePreview')}
          html={previewEmailHtml || previewEmail[previewEmailId]?.html}
          onClose={handleCloseEmailPreview}
          resolvedGenericTags={resolvedGenericTags}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  gridContainerTop: {
    display: 'flex',
    marginBottom: theme.spacing(3),
    alignItems: 'flex-end',
  },
  notificationHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  gridContainer: {
    display: 'flex',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  gridItemLeft: {
    width: '60%',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: 0,
    },
  },
  gridItemRight: {
    width: '40%',
    display: 'flex',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  gridItemRightTop: {
    width: '40%',
    display: 'flex',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  page: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
}));

const connector = connect(
  (state: RootState) => ({
    eventListWithRule: getEventByGroup.onlyGeneric(state),
    emailDesignList: getAllEmailTemplatesSummaries(state),
    previewEmail: getEmailTemplatesDetail(state),
    loading:
      state.notificationRule.rule.loading ||
      state.emailTemplate.loading ||
      state.notificationRule.settings.loading ||
      state.marketingNotification.loading,
    settingsData: state.notificationRule.settings.data,
    birthdayNotification: getCelebrationBirthday(state),
    tags: getTagCategories(state),
    resolvedGenericTags: getResolvedGenericTags(state),
    company: state.theme.theme.company,
    theme: state.theme.theme,
    requiredTagsByEvent: getRequiredTagsByEvent(state),
  }),
  {
    fetchEventTypeList: fetchEventTypeListAction,
    fetchNotificationRuleList: fetchNotificationRuleListAction,
    fetchEmailDesignList: fetchEmailDesignListAction,
    fetchEmailDesignDetail: fetchEmailDesignDetailAction,
    fetchBulkEmailDesignDetail: fetchBulkEmailDesignDetailAction,
    createOrUpdateNotificationRule: createOrUpdateNotificationRuleAction,
    fetchSettingsList: fetchSettingsListAction,
    updateSettings: updateSettingsAction,
    fetchMarketingNotificationList: fetchMarketingNotificationListAction,
    createOrUpdateMarketingNotification:
      createOrUpdateMarketingNotificationAction,
    deleteNotificationRule: deleteNotificationRuleAction,
    deleteMarketingNotification: deleteMarketingNotificationAction,
    fetchTagList: fetchTagListAction,
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    push: pushRouter,
  },
);

export default compose<any, Props>(
  withPageHeightHOC(),
  routerParamsToProps({ eventName: 'eventName:string' }),
  withTranslation(['notificationRule']),
  withTitle(({ t }) => t('pageTitle')),
  connector,
)(NotificationRuleDetail);
