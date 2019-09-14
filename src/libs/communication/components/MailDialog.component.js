// @flow
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
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

import WarningIcon from '@material-ui/icons/Warning';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';

import type { MemberMailData } from '../types';

type Props = {
  receiversNotEditable: boolean,
  onCancel: () => void,
  sendMailAction: (data: MemberMailData) => void,
  classes: Object,
  t: TFunction,
  fullScreen: boolean,
  open: boolean,
  receiverInfo: Array<{ id: number, name: string, email: string }>,
  mailDefaultTitle: string,
};

export class SendMailToMembers extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openRefreshDialog: false,
      displayReceiverList: false,
      checkedReceivers: [
        ...this.props.receiverInfo
          .filter((receiver) => receiver.email !== null)
          .map((receiver) => receiver.id),
      ],
      mailTitle: this.props.mailDefaultTitle,
      mailContent: '',
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.receiverInfo !== this.props.receiverInfo) {
      this.setState({
        checkedReceivers: [
          ...this.props.receiverInfo
            .filter((receiver) => !!receiver.email)
            .map((receiver) => receiver.id),
        ],
      });
    }
    if (prevProps.mailDefaultTitle !== this.props.mailDefaultTitle) {
      this.setState({
        mailContent: '',
        mailTitle: this.props.mailDefaultTitle,
      });
    }
  }

  handleToggle = (value: string) => () => {
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

  openMemberPage = (event: SyntheticEvent<any>, memberId) => {
    event.preventDefault();
    const url = `/member/edit/${memberId}`;
    const win = window.open(url);
    win.focus();
    this.setState({ openRefreshDialog: true });
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
      receiversNotEditable,
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
                  members: this.state.checkedReceivers,
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
              >
                <PersonIcon color="action" />
                <ListItemText
                  primary={`${t('recipients')} (${Object.keys(
                    this.state.checkedReceivers,
                  ).length.toString()}/${Object.keys(
                    this.props.receiverInfo,
                  ).length.toString()})`}
                />
                {Object.keys(this.state.checkedReceivers).length ===
                Object.keys(this.props.receiverInfo).length ? null : (
                  <WarningIcon className={classes.IconMargin} color="error" />
                )}
                {this.state.displayReceiverList ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Divider />
              <Collapse in={this.state.displayReceiverList}>
                {receiverInfo.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemText
                      id={member.id}
                      primary={member.name}
                      secondary={
                        member.email ? (
                          member.email
                        ) : (
                          <div>
                            {t('mail.missing')}
                            <Button
                              onClick={(event) =>
                                this.openMemberPage(event, member.id)
                              }
                            >
                              <EditIcon />
                            </Button>
                          </div>
                        )
                      }
                      secondaryTypographyProps={{
                        color: member.email ? '' : 'error',
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        disabled={!member.email || receiversNotEditable}
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
              <Dialog open={this.state.openRefreshDialog}>
                <DialogContent>
                  <p>{t('mail.refreshText')}</p>
                  <DialogActions>
                    <Button
                      color="secondary"
                      onClick={() =>
                        this.setState({ openRefreshDialog: false })
                      }
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      variant="outlined"
                      type="submit"
                      color="primary"
                      onClick={() => document.location.reload(true)}
                    >
                      {t('common.refresh')}
                    </Button>
                  </DialogActions>
                </DialogContent>
              </Dialog>
              <TextField
                name="Mail title"
                label={t('mail.title')}
                fullWidth
                className={classes.mailTitle}
                value={this.state.mailTitle}
                onChange={(e) => this.setState({ mailTitle: e.target.value })}
              />
              <TextField
                name="Mail content"
                label={t('mail.content')}
                rows="15"
                value={this.state.mailContent}
                onChange={(e) => this.setState({ mailContent: e.target.value })}
                fullWidth
                multiline
                variant="outlined"
              />
              <DialogActions>
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
  IconMargin: {
    marginRight: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['communication']),
  withStyles(styles),
)(SendMailToMembers);
