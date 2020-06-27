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
} from '../../libs/notification-rule/actions';
import { getEventByGroup } from '../../libs/notification-rule/selectors';
import NotificationRuleListItem from '../../libs/notification-rule/components/NotificationRuleListItem.component';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';

import {
  emailTemplateDetail as fetchEmailDesignDetailAction,
  emailTemplatesSummaries as fetchEmailDesignList,
} from '../../libs/email-editor/actions';
import withTitle from '../../hocs/with-title.hoc';

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
};

export class NotificationRule extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchEventTypeList();
    this.props.fetchNotificationRuleList();
    this.props.fetchEmailDesignList();
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? (
          <LinearProgress className={this.props.classes.loading} />
        ) : null}
        {Object.entries(this.props.eventListWithRule).map(
          ([event_group_name, eventTypeList]) => (
            <div className={this.props.classes.group} key={event_group_name}>
              <Typography variant="h6">
                {this.props.t(`ruleGroup.${event_group_name}`)}
              </Typography>
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
                />
              ))}
            </div>
          ),
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
        state.notificationRule.rule.loading || state.emailTemplate.isLoading,
    }),
    {
      fetchEventTypeList,
      fetchNotificationRuleList,
      fetchEmailDesignList,
      fetchEmailDesignDetail: fetchEmailDesignDetailAction,
      createOrUpdateNotificationRule,
      deleteNotificationRule,
    },
  ),
  withHandlers({
    closeEmailPreview: ({ setPreviewEmailId, setPreviewEmailHTML }) => () => {
      setPreviewEmailHTML(null);
      setPreviewEmailId(null);
    },
  }),
  withHandlers({
    showEmailPreview: ({ setPreviewEmailId, fetchEmailDesignDetail }) => (
      id,
    ) => {
      setPreviewEmailId(id);
      fetchEmailDesignDetail(id);
    },
  }),
)(NotificationRule);
