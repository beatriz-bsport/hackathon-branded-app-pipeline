// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';

import EmailSelector from '../../email-editor/components/EmailSelector.component';

type Props = {
  t: TFunction,
  classes: Object,
  event: ?MarketingNotification,

  emailDesignList: Array<EmailDesign>,
  onChangeEmailDesign: (MarketingNotification) => void,
  onDeleteNotification: (id: number) => void,
  showEmailPreview: (id: number) => void,

  company: number,
  kind: number,
  is_event_based: boolean,
};

export const BirthdayNotification = (props: Props) => {
  return (
    <Paper className={props.classes.container}>
      <div className={props.classes.rightContainer}>
        <ListItemText
          className={props.classes.text}
          primary={props.t('marketingNotification.birthday')}
        />
        <div className={props.classes.selector}>
          <div style={{ flex: 1 }}>
            <IconButton
              className={props.classes.showEmail}
              color="primary"
              disabled={!(props.event || {}).email_design}
              onClick={() => {
                props.showEmailPreview(props.event.email_design);
              }}
              variant="outlined"
            >
              <VisibilityIcon />
            </IconButton>
          </div>
          <div style={{ minWidth: 400 }}>
            <EmailSelector
              emails={props.emailDesignList}
              helperText={props.t('emailDesign.birthdayPlaceholder')}
              onChange={(optionValue) => {
                if (!optionValue) {
                  return props.onDeleteNotification(props.event.id);
                }
                if ((props.event || {}).id) {
                  return props.onChangeEmailDesign({
                    ...props.event,
                    email_design: optionValue,
                  });
                }
                return props.onChangeEmailDesign({
                  email_design: optionValue,
                  company: props.company,
                  kind: props.kind,
                  is_event_based: props.is_event_based,
                });
              }}
              value={(props.event || {}).email_design}
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
)(BirthdayNotification);
