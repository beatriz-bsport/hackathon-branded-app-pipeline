// @flow
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import LinearProgress from '@material-ui/core/LinearProgress';

import Fab from '@material-ui/core/Fab';
import InfoIcon from '@material-ui/icons/Info';

import TextField from '@material-ui/core/TextField';

import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';

import VisibilityIcon from '@material-ui/icons/Visibility';

import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import EmailSelector from '../../email-editor/components/EmailSelector.component';

type Props = {
  onCancel: () => void,
  classes: Object,
  t: TFunction,
  getEmailDetail: (id: number) => void,
  emailListLoading: boolean,
  emails: Array<any>,
  emailDetailLoading: boolean,
  emailDetails: Array<any>,
  onChangeTitle: (string) => void,
  onChangeTemplate: (id: number) => void,
  selectedMail: number,
  title: string,
};

export class SelectTemplate extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMailPreview: true,
    };
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
          {this.props.t('mail.selectToShowPreview')}
        </Typography>
      </div>
    );
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <TextField
          name="Mail title"
          placeholder={t('mail.title')}
          fullWidth
          required
          className={classes.mailTitle}
          value={this.props.title}
          onChange={(e) => {
            this.props.onChangeTitle(e.target.value);
          }}
        />
        <div>
          {this.props.emailListLoading ? (
            <LinearProgress className={classes.selectorContainer} />
          ) : (
            <div className={classes.selectorContainer}>
              <EmailSelector
                emails={this.props.emails}
                value={this.props.selectedMail}
                onChange={(ev) => {
                  this.props.onChangeTemplate(ev.value);
                  this.props.getEmailDetail(ev.value);
                }}
                helperText={t('mail.mailSelection')}
              />
              <Fab
                onClick={() => {
                  this.props.onCancel();
                  const url = '/email-template/create';
                  const win = window.open(url);
                  win.focus();
                  this.props.onChangeTemplate(null);
                }}
                size="small"
                color="secondary"
                className={classes.addIcon}
              >
                <AddIcon />
              </Fab>
            </div>
          )}
          <div className={classes.buttonContainer}>
            <Button
              onClick={() =>
                this.setState((prevState) => ({
                  displayMailPreview: !prevState.displayMailPreview,
                }))
              }
            >
              {this.state.displayMailPreview ? (
                <div className={classes.inlineContainer}>
                  <VisibilityOffIcon className={classes.visibilityIcon} />
                  <Typography variant="caption">
                    {t('mail.hideMail')}
                  </Typography>
                </div>
              ) : (
                <div className={classes.inlineContainer}>
                  <VisibilityIcon className={classes.visibilityIcon} />
                  <Typography variant="caption">
                    {t('mail.showMail')}
                  </Typography>
                </div>
              )}
            </Button>
          </div>
          <Collapse in={this.state.displayMailPreview}>
            {this.props.selectedMail &&
            !!this.props.emailDetails[this.props.selectedMail] ? (
              <div className={classes.editIcon}>
                <Fab
                  onClick={() => {
                    this.props.onCancel();
                    const url = `/email-template/${this.props.selectedMail}/edit`;
                    const win = window.open(url);
                    win.focus();
                    this.props.onChangeTemplate(null);
                  }}
                  color="secondary"
                  size="small"
                  disabled={this.props.selectedMail === null}
                  classes={{ disabled: classes.disabled }}
                >
                  <EditIcon />
                </Fab>
              </div>
            ) : null}
            <div className={classes.mailPreview}>
              {this.props.selectedMail &&
              !!this.props.emailDetails[this.props.selectedMail] ? (
                <div>
                  <div
                    // eslint-disable-next-line
                    dangerouslySetInnerHTML={{
                      __html: this.props.emailDetails
                        ? this.props.emailDetails[this.props.selectedMail].html
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
          </Collapse>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  inlineContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  visibilityIcon: {
    marginRight: theme.spacing(1),
  },
  mailPreview: {
    border: '1px solid grey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    minHeight: '30vh',
    // minWidth: '40vh',
  },
  selectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  previewEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(6),
  },
  mailTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  addIcon: {
    marginLeft: theme.spacing(1),
  },
  editIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '-20px',
  },
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(SelectTemplate);
