// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Paper from '@material-ui/core/Paper';

import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import EmailSelector from '../../email-editor/components/EmailSelector.component';

type Props = {
  t: TFunction,
  classes: Object,

  emailDesignList: Array<EmailDesign>,

  showEmailPreviewHTML: (string) => void,
  showEmailPreview: (id: number) => void,

  onChangeEmailDesign: (NotificationRule) => void,
  onDeleteNotificationRule: (id: number) => void,

  event: number,
  rule: ?NotificationRule,
};
export const NotificationRuleListItem = (props: Props) => {
  return (
    <Paper className={props.classes.container}>
      <ListItemText
        className={props.classes.text}
        primary={props.t(`eventType.${props.event}`)}
      />
      <div className={props.classes.selector}>
        <IconButton
          disabled={!props.rule}
          className={props.classes.showEmail}
          color="primary"
          onClick={() => {
            if (props.rule && !props.rule.email_design) {
              props.showEmailPreviewHTML(props.rule.email_template);
            } else {
              props.showEmailPreview(props.rule.email_design);
            }
          }}
          variant="outlined"
        >
          <VisibilityIcon />
        </IconButton>
        <EmailSelector
          emails={props.emailDesignList}
          value={(props.rule || {}).email_design}
          helperText={props.t('emailDesign.placeholder')}
          onChange={(option) => {
            if (!option) {
              return props.onDeleteNotificationRule(props.rule.id);
            }
            if (props.rule) {
              return props.onChangeEmailDesign({
                ...props.rule,
                email_design: option.value,
              });
            }
            return props.onChangeEmailDesign({
              notification_event: props.event,
              email_design: option.value,
            });
          }}
        />
      </div>
    </Paper>
  );
};

const styles = (theme) => ({
  container: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    maxWidth: '55%',
    marginLeft: theme.spacing(1),
  },
  showEmail: {
    marginRight: theme.spacing(1),
  },
  selector: {
    width: '45%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default compose(
  withNamespaces(['notificationRule']),
  withStyles(styles),
)(NotificationRuleListItem);
