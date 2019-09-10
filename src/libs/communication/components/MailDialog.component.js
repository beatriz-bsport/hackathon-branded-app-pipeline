// @flow
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';

type Props = {
  onCancel: () => void,
  sendMailAction: () => void,
  classes: Object,
  t: TFunction,
  fullScreen: boolean,
  open: boolean,
  receiverInfo: Array<{ id: number, name: string, email: string }>,
  mailDefaultTitle: string,
};

export class SendMailToMembers extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      displayReceiverList: false,
      checkedReceivers: this.props.receiverInfo
        .filter((receiver) => receiver.email !== null)
        .map((receiver) => receiver.id),
      mailTitle: this.props.mailDefaultTitle,
      mailContent: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.receiverInfo !== this.props.receiverInfo) {
      this.setState({
        checkedReceivers: this.props.receiverInfo
          .filter((receiver) => !!receiver.email)
          .map((receiver) => receiver.id),
      });
    }
    if (prevProps.mailDefaultTitle !== this.props.mailDefaultTitle) {
      this.setState({ mailTitle: this.props.mailDefaultTitle });
    }
  }

  renderWarning = (text: string) => (
    <Grid container direction="row" spacing={24}>
      <Grid item>
        <WarningIcon color="error" />
      </Grid>
      <Grid item>
        <Typography>{text}</Typography>
      </Grid>
    </Grid>
  );

  handleToggle = (value) => () => {
    this.setState((prevState) => {
      const currentIndex = prevState.checkedReceivers.indexOf(value);
      const newChecked = prevState.checkedReceivers;
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      return { ...prevState, checkedReceivers: newChecked };
    });
  };

  render() {
    const {
      t,
      sendMailAction,
      onCancel,
      classes,
      receiverInfo,
      fullScreen,
      open,
    } = this.props;
    return (
      <Dialog fullScreen={fullScreen} open={open}>
        <DialogContent>
          <div className={classes.sendMailDialogBox}>
            <form
              className={classes.formContent}
              onSubmit={(ev) => {
                ev.preventDefault();
                sendMailAction({
                  membersId: this.state.checkedReceivers,
                  subject: this.state.mailTitle,
                  body: this.state.mailContent,
                });
                onCancel();
              }}
            >
              <ListItem
                button
                onClick={() =>
                  this.setState((previousState) => ({
                    displayReceiverList: !previousState.displayReceiverList,
                  }))
                }
                className={classes.field}
              >
                <PersonIcon color="action" />
                <ListItemText
                  primary={`${t('recipients')} (${Object.keys(
                    this.state.checkedReceivers,
                  ).length.toString()})`}
                />
                {this.state.displayReceiverList ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Divider />
              <Collapse
                className={classes.field}
                in={this.state.displayReceiverList}
              >
                {receiverInfo.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemText
                      id={member.id}
                      primary={member.name}
                      secondary={
                        member.email ? member.email : t('mail.missing')
                      }
                      secondaryTypographyProps={{
                        color: member.email ? '' : 'error',
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        disabled={!member.email}
                        onChange={this.handleToggle(member.id)}
                        checked={
                          member.email
                            ? this.state.checkedReceivers.indexOf(member.id) !==
                              -1
                            : false
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </Collapse>

              <TextField
                name="Mail title"
                label={t('mail.title')}
                fullWidth
                className={(classes.field, classes.mailTitle)}
                value={this.state.mailTitle}
                onChange={(e) => this.setState({ mailTitle: e.target.value })}
              />
              <TextField
                name="Mail content"
                label={t('mail.content')}
                rows="15"
                className={classes.field}
                value={this.state.mailContent}
                onChange={(e) => this.setState({ mailContent: e.target.value })}
                fullWidth
                multiline
                variant="outlined"
              />
              <DialogActions className={classes.field}>
                <Button color="secondary" onClick={onCancel}>
                  {t('common.cancel')}
                </Button>
                <Button
                  variant="outlined"
                  disabled={this.state.mailContent === ''}
                  type="submit"
                  color="primary"
                >
                  {t('common.submit')}
                </Button>
              </DialogActions>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  sendMailDialogBox: {
    display: 'flex',
    direction: 'column',
    alignItems: 'flex-start',
  },
  mailTitle: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  formContent: {},
  field: {
    paddingBottom: '0px',
    marginBottom: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['communication']),
  withStyles(styles),
)(SendMailToMembers);
