// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { NOTIFICATION_EVENT_GROUPS } from '@bsport/common/lib/master-data/notification-rule-events';

import {
  fetchEventTypeList,
  fetchNotificationRuleList,
  createOrUpdateNotificationRule,
  deleteNotificationRule,
} from '../../libs/notification-rule/actions';
import { getEventListWithRule } from '../../libs/notification-rule/selectors';
import NotificationRuleListItem from '../../libs/notification-rule/components/NotificationRuleListItem.component';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';

import {
  emailTemplateDetail as fetchEmailDesignDetailAction,
  emailTemplatesSummaries as fetchEmailDesignList,
} from '../../libs/email-editor/actions';

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
      <div>
        {this.props.loading ? (
          <LinearProgress className={this.props.classes.loading} />
        ) : null}
        {Object.entries(NOTIFICATION_EVENT_GROUPS).map(
          ([name, eventTypeList]) => (
            <div className={this.props.classes.group} key={name}>
              <Typography variant="h6">
                {this.props.t(`ruleGroup.${name}`)}
              </Typography>
              {this.props.eventListWithRule
                .filter((e) => eventTypeList.includes(e.notification_event))
                .map((e) => (
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
  loading: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  group: {
    margin: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['notificationRule']),
  withStyles(styles),
  withState('previewEmailId', 'setPreviewEmailId', null),
  withState('previewEmailHtml', 'setPreviewEmailHTML', null),
  connect(
    (state, { previewEmailId }) => ({
      eventListWithRule: getEventListWithRule(state),
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
