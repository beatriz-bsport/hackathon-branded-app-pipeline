// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';

import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import Fab from '@material-ui/core/Fab';

import DialogContent from '@material-ui/core/DialogContent';
import { compose } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

import DialogTitle from '@material-ui/core/DialogTitle';
import EmailSelector from '../../email-editor/components/EmailSelector.component';

type Props = {
  open: boolean,
  onClose: () => void,
  emails: any,
  classes: Object,
  getEmailDetail: (id: number) => void,
  emailDetails: any,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  onSubmit: (id: number) => void,
  t: TFunction,
  getEmails: () => void,
};

export class SendEmailDialog extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedMail: null,
    };
  }

  componentDidMount() {
    this.props.getEmails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open) {
      this.props.getEmails();
    }
  }

  renderLoadingOrEmpty = (loading, emails) => {
    if (loading) {
      return <CircularProgress />;
    }
    if (emails.length === 0) {
      return (
        <div className={this.props.classes.previewEmpty}>
          <InfoIcon fontSize="large" color="disabled" />
          <Typography color="textSecondary">
            {this.props.t('mail.noMailAvailable')}
          </Typography>
        </div>
      );
    }

    return (
      <div className={this.props.classes.previewEmpty}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography color="textSecondary">
          {this.props.t('selectToShowPreview')}
        </Typography>
      </div>
    );
  };

  renderActionButtons = () => (
    <div className={this.props.classes.buttonContainer}>
      <Button
        onClick={() => {
          this.props.onClose();
          this.setState({ selectedMail: null });
        }}
      >
        {this.props.t('mail.cancel')}
      </Button>
      <Button
        color="primary"
        onClick={() => {
          if (this.state.selectedMail !== null) {
            this.props.onSubmit(this.state.selectedMail);
            this.props.onClose();

            this.setState({ selectedMail: null });
          }
        }}
        disabled={this.state.selectedMail === null}
        variant="outlined"
      >
        {this.props.t('mail.send')}
      </Button>
    </div>
  );

  render() {
    const { classes, t } = this.props;
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle>{t('mail.sendMailTitle')}</DialogTitle>
        <DialogContent>
          {this.renderActionButtons()}
          <div className={classes.collapser}>
            {this.props.emailListLoading ? (
              <LinearProgress className={classes.selectorContainer} />
            ) : (
              <div className={classes.selectorContainer}>
                <EmailSelector
                  emails={this.props.emails}
                  value={this.state.selectedMail}
                  onChange={(ev) => {
                    this.setState({ selectedMail: ev.value });
                    this.props.getEmailDetail(ev.value);
                  }}
                  helperText={t('Mails')}
                />
                <Fab
                  onClick={() => {
                    this.props.onClose();
                    const url = '/email-template/create';
                    const win = window.open(url);
                    win.focus();
                    this.setState({ selectedMail: null });
                  }}
                  size="small"
                  color="secondary"
                  className={classes.addIcon}
                >
                  <AddIcon />
                </Fab>
              </div>
            )}
          </div>

          <div className={classes.editIcon}>
            <Fab
              onClick={() => {
                this.props.onClose();
                const url = `/email-template/${this.state.selectedMail}/edit`;
                const win = window.open(url);
                win.focus();
                this.setState({ selectedMail: null });
              }}
              color="secondary"
              size="small"
              disabled={this.state.selectedMail === null}
              classes={{ disabled: classes.disabled }}
            >
              <EditIcon />
            </Fab>
          </div>
          <div className={classes.mailPreview}>
            {this.state.selectedMail &&
            !!this.props.emailDetails[this.state.selectedMail] ? (
              <div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.props.emailDetails
                      ? this.props.emailDetails[this.state.selectedMail].html
                      : null,
                  }}
                />
              </div>
            ) : (
              this.renderLoadingOrEmpty(
                this.props.emailDetailLoading,
                this.props.emails,
              )
            )}
          </div>
          {this.renderActionButtons()}
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  addIcon: {
    marginLeft: theme.spacing.unit,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,

    marginBottom: theme.spacing.unit,
  },
  editIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '-20px',
  },
  mailPreview: {
    border: '1px solid grey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    minHeight: '30vh',
    minWidth: '40vh',
  },
  selectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit,
  },
  previewEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing.unit * 6,
  },
  textContent: {
    paddingTop: theme.spacing.unit * 2,
  },
  collapser: {
    paddingLeft: theme.spacing.unit * 2,
  },
  disabled: {
    backgroundColor: 'rgb(212, 212, 212) !important',
    color: 'white !important',
  },
});
export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(SendEmailDialog);
