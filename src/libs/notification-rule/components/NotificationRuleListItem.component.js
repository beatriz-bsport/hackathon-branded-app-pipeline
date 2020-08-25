// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import { compose } from 'recompose';

import { withTranslation } from 'react-i18next';
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

  disabled: boolean,
  sendCompany: boolean,
  onDisable: (ev: Object) => void,
  onSendCompany: (ev: Object) => void,
};
export const NotificationRuleListItem = (props: Props) => {
  return (
    <Paper className={props.classes.container}>
      <Checkbox
        className={props.classes.checkbox}
        checked={!props.disabled}
        onChange={(ev) => props.onDisable(ev)}
      />
      <Checkbox
        className={props.classes.checkbox}
        checked={props.sendCompany}
        onChange={(ev) => props.onSendCompany(ev)}
      />
      <div className={props.classes.rightContainer}>
        <ListItemText
          className={props.classes.text}
          primary={props.t(`eventType.${props.event}`)}
        />
        <div className={props.classes.selector}>
          <div style={{ flex: 1 }}>
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
          </div>
          <div style={{ minWidth: 400 }}>
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
        </div>
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
    // justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  checkbox: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
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
});

export default compose(
  withTranslation(['notificationRule']),
  withStyles(styles),
)(NotificationRuleListItem);
