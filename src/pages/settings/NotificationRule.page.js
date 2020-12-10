/* eslint-disable no-console */
// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import {
  fetchEventTypeList,
  fetchNotificationRuleList,
  createOrUpdateNotificationRule,
  deleteNotificationRule,
  fetchSettingsList,
  updateSettings as updateSettingsAction,
} from '../../libs/notification-rule/actions';
import { getEventByGroup } from '../../libs/notification-rule/selectors';
import NotificationRuleListItem from '../../libs/notification-rule/components/NotificationRuleListItem.component';

import {
  fetchMarketingNotificationList,
  createOrUpdateMarketingNotification,
  deleteMarketingNotification,
} from '../../libs/marketing/actions';
import { getCelebrationBirthday } from '../../libs/marketing/selectors';
import BirthdayNotification from '../../libs/marketing/components/BirthdayNotification.component';
import type { MarketingNotification } from '../../libs/marketing/types';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';

import {
  emailTemplateDetail as fetchEmailDesignDetailAction,
  emailTemplatesSummaries as fetchEmailDesignList,
} from '../../libs/email-editor/actions';
import withTitle from '../../hocs/with-title.hoc';

const BIRTHDAY_NOTIFICATION = {
  kind: 0,
  is_event_based: false,
};

type Props = {
  t: TFunction,
  fetchEventTypeList: () => void,
  fetchNotificationRuleList: () => void,
  fetchEmailDesignList: () => void,
  classes: Object,
  eventListWithRule: Array<EventWithRule>,

  loading: boolean,

  deleteNotificationRule: (id: number) => void,
  emailDesignList: Array<EmailDesign>,

  previewEmailHtml: ?string,
  previewEmail: ?EmailDesign,
  showEmailPreview: (id: number) => void,
  setPreviewEmailHTML: (string) => void,
  createOrUpdateNotificationRule: (data: any) => void,
  closeEmailPreview: () => void,

  settingsData: Array<Object>,
  fetchSettingsList: () => void,
  handleSettingsDisable: (notification_event: number, ev: Object) => void,
  handleSettingsCopy: (notification_event: number, ev: Object) => void,

  birthdayNotification: MarketingNotification,
  fetchMarketingNotificationList: (params: any) => void,
  createOrUpdateMarketingNotification: (data: any) => void,
  deleteMarketingNotification: (id: number) => void,
  company: number,
};

export class NotificationRule extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchEventTypeList();
    this.props.fetchNotificationRuleList();
    this.props.fetchEmailDesignList();
    this.props.fetchSettingsList();
    this.props.fetchMarketingNotificationList({
      kind: BIRTHDAY_NOTIFICATION.kind,
    });
  }

  render() {
    const { settingsData } = this.props;
    const notificationRuleSettings = settingsData.length
      ? settingsData[0].settings
      : {};
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? (
          <LinearProgress className={this.props.classes.loading} />
        ) : null}
        {Object.entries(this.props.eventListWithRule).map(
          ([event_group_name, eventTypeList]) => (
            <div className={this.props.classes.group} key={event_group_name}>
              <Typography variant="h6" className={this.props.classes.title}>
                {this.props.t(`ruleGroup.${event_group_name}`)}
              </Typography>
              <div className={this.props.classes.row}>
                <Typography
                  variant="caption"
                  className={this.props.classes.active}
                >
                  {this.props.t('caption.active')}
                </Typography>
                <Typography
                  variant="caption"
                  styles={{ wordWrap: 'break-word' }}
                  className={this.props.classes.sendCopy}
                >
                  {this.props.t('caption.sendCopy')}
                </Typography>
                <div className={this.props.classes.rightContainer}>
                  <Typography
                    variant="caption"
                    className={this.props.classes.event}
                  >
                    {this.props.t('caption.event')}
                  </Typography>
                  <Typography
                    variant="caption"
                    className={this.props.classes.email}
                  >
                    {this.props.t('caption.emailDesign')}
                  </Typography>
                </div>
              </div>
              {eventTypeList.map((e) => (
                <NotificationRuleListItem
                  event={e.notification_event}
                  rule={e.rule}
                  key={e.event_type}
                  emailDesignList={this.props.emailDesignList}
                  onChangeEmailDesign={
                    this.props.createOrUpdateNotificationRule
                  }
                  showEmailPreview={this.props.showEmailPreview}
                  showEmailPreviewHTML={this.props.setPreviewEmailHTML}
                  onDeleteNotificationRule={this.props.deleteNotificationRule}
                  disabled={
                    notificationRuleSettings[e.notification_event]
                      ? notificationRuleSettings[e.notification_event].disabled
                      : false
                  }
                  sendCompany={
                    notificationRuleSettings[e.notification_event]
                      ? notificationRuleSettings[e.notification_event]
                          .send_company
                      : false
                  }
                  onDisable={(ev) =>
                    this.props.handleSettingsDisable(e.notification_event, ev)
                  }
                  onSendCompany={(ev) =>
                    this.props.handleSettingsCopy(e.notification_event, ev)
                  }
                />
              ))}
            </div>
          ),
        )}
        {!this.props.loading && (
          <div className={this.props.classes.group} key="marketing">
            <Typography variant="h6" className={this.props.classes.title}>
              {this.props.t('ruleGroup.marketing')}
            </Typography>
            <div className={this.props.classes.row}>
              <div className={this.props.classes.rightContainer}>
                <Typography
                  variant="caption"
                  className={this.props.classes.event}
                >
                  {this.props.t('caption.event')}
                </Typography>
                <Typography
                  variant="caption"
                  className={this.props.classes.email}
                >
                  {this.props.t('caption.emailDesign')}
                </Typography>
              </div>
            </div>
            <BirthdayNotification
              event={this.props.birthdayNotification}
              company={this.props.company}
              kind={BIRTHDAY_NOTIFICATION.kind}
              is_event_based={BIRTHDAY_NOTIFICATION.is_event_based}
              emailDesignList={this.props.emailDesignList}
              showEmailPreview={this.props.showEmailPreview}
              onChangeEmailDesign={
                this.props.createOrUpdateMarketingNotification
              }
              onDeleteNotification={this.props.deleteMarketingNotification}
            />
          </div>
        )}

        {this.props.previewEmailHtml ||
        (this.props.previewEmail && this.props.previewEmail.html) ? (
          <Dialog open>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  this.props.previewEmailHtml || this.props.previewEmail.html,
              }}
            />
            <DialogActions>
              <Button onClick={() => this.props.closeEmailPreview()}>
                {this.props.t('emailDesign.closePreview')}
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginBottom: '30vh',
  },
  loading: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  group: {
    margin: theme.spacing(2),
  },
  row: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  active: {
    marginLeft: theme.spacing(2.3),
    width: 55,
  },
  sendCopy: {
    marginLeft: theme.spacing(1),
    width: 95,
  },
  event: {
    marginLeft: theme.spacing(3),
  },
  email: {
    marginRight: '8vw',
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['notificationRule']),
  withTitle(({ t }) => t('pageTitle')),
  withStyles(styles),
  withState('previewEmailId', 'setPreviewEmailId', null),
  withState('previewEmailHtml', 'setPreviewEmailHTML', null),
  connect(
    (state, { previewEmailId }) => ({
      eventListWithRule: getEventByGroup.onlyGeneric(state),
      emailDesignList: getAllEmailTemplatesSummaries(state),
      previewEmail: getEmailTemplatesDetail(state)[previewEmailId],
      loading:
        state.notificationRule.rule.loading ||
        state.emailTemplate.isLoading ||
        state.notificationRule.settings.loading ||
        state.marketingNotification.loading,
      settingsData: state.notificationRule.settings.data,
      birthdayNotification: getCelebrationBirthday(state),
      company: state.theme.theme.company,
    }),
    {
      fetchEventTypeList,
      fetchNotificationRuleList,
      fetchEmailDesignList,
      fetchEmailDesignDetail: fetchEmailDesignDetailAction,
      createOrUpdateNotificationRule,
      deleteNotificationRule,
      fetchSettingsList,
      updateSettings: updateSettingsAction,
      fetchMarketingNotificationList,
      createOrUpdateMarketingNotification,
      deleteMarketingNotification,
    },
  ),
  withHandlers({
    closeEmailPreview: ({ setPreviewEmailId, setPreviewEmailHTML }) => () => {
      setPreviewEmailHTML(null);
      setPreviewEmailId(null);
    },
  }),
  withHandlers({
    handleUpdate: ({ settingsData, updateSettings }) => (
      notificationRuleSettings,
    ) => {
      updateSettings({
        ...settingsData[0],
        settings: notificationRuleSettings,
      });
    },
  }),
  withHandlers({
    showEmailPreview: ({ setPreviewEmailId, fetchEmailDesignDetail }) => (
      id,
    ) => {
      setPreviewEmailId(id);
      fetchEmailDesignDetail(id);
    },
    handleSettingsDisable: ({ settingsData, handleUpdate }) => (
      notification_event,
      ev,
    ) => {
      let notificationRuleSettings = { ...settingsData[0].settings };
      if (!notificationRuleSettings[notification_event]) {
        notificationRuleSettings = {
          ...notificationRuleSettings,
          [notification_event]: {
            disabled: !ev.target.checked,
            send_company: false,
          },
        };
      } else {
        notificationRuleSettings = {
          ...notificationRuleSettings,
          [notification_event]: {
            ...notificationRuleSettings[notification_event],
            disabled: !ev.target.checked,
          },
        };
      }
      handleUpdate(notificationRuleSettings);
    },
    handleSettingsCopy: ({ settingsData, handleUpdate }) => (
      notification_event,
      ev,
    ) => {
      let notificationRuleSettings = { ...settingsData[0].settings };
      if (!notificationRuleSettings[notification_event]) {
        notificationRuleSettings = {
          ...notificationRuleSettings,
          [notification_event]: {
            disabled: false,
            send_company: ev.target.checked,
          },
        };
      } else {
        notificationRuleSettings = {
          ...notificationRuleSettings,
          [notification_event]: {
            ...notificationRuleSettings[notification_event],
            send_company: ev.target.checked,
          },
        };
      }
      handleUpdate(notificationRuleSettings);
    },
  }),
)(NotificationRule);
