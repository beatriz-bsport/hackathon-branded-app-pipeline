// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { compose } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';

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
};

export class SendEmailDialog extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedMail: null,
    };
  }

  renderLoadingOrEmpty = (loading) => {
    if (loading) {
      return <CircularProgress />;
    }
    return (
      <div className={this.props.classes.previewEmpty}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography
          className={this.props.classes.emptyMessageText}
          color="textSecondary"
        >
          {this.props.t('selectToShowPreview')}
        </Typography>
      </div>
    );
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Dialog open={this.props.open}>
        <div className={classes.dialog}>
          <div className={classes.collapser}>
            {this.props.emailListLoading ? (
              <CircularProgress />
            ) : (
              <EmailSelector
                emails={this.props.emails}
                value={this.state.selectedMail}
                onChange={(ev) => {
                  this.setState({ selectedMail: ev.value });
                  this.props.getEmailDetail(ev.value);
                }}
                helperText={t('Mails')}
              />
            )}
          </div>
          <div className={classes.mailPreview}>
            {this.state.selectedMail &&
            !!this.props.emailDetails[this.state.selectedMail] ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: this.props.emailDetails
                    ? this.props.emailDetails[this.state.selectedMail].html
                    : null,
                }}
              />
            ) : (
              this.renderLoadingOrEmpty(this.props.emailDetailLoading)
            )}
          </div>
          <DialogActions>
            <Button
              onClick={() => {
                this.props.onClose();
                this.setState({ selectedMail: null });
              }}
            >
              {t('Annuler')}
            </Button>
            <Button
              disabled={this.state.selectedMail === null}
              color="primary"
              onClick={() => {
                this.props.onSubmit(this.state.selectedMail);
                this.props.onClose();

                this.setState({ selectedMail: null });
              }}
            >
              {t('send')}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
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
    paddingRight: theme.spacing.unit * 2,
  },
});
export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(SendEmailDialog);
