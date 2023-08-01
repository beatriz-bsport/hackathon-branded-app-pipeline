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
import Alert from '@material-ui/lab/Alert/Alert';
import TextField from '@material-ui/core/TextField';

import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';

import VisibilityIcon from '@material-ui/icons/Visibility';

import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import EmailSelector from '../../email-editor/components/EmailSelector.component';
import HTMLPreview from '../../../components/html/HTMLPreview.component';

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
  resolvedGenericTags: ResolvedGenericTags,
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
          <Alert
            className={this.props.classes.alertInfo}
            color="grey"
            severity="info"
          >
            {this.props.t('mail.noMailAvailable')}
          </Alert>
        </div>
      );
    }

    return (
      <div className={this.props.classes.previewEmpty}>
        <Alert
          className={this.props.classes.alertInfo}
          color="grey"
          severity="info"
        >
          {this.props.t('mail.selectToShowPreview')}
        </Alert>
      </div>
    );
  };

  handleOnChange = (ev) => {
    if (ev && ev.value) {
      this.props.onChangeTemplate(ev.value);
      this.props.getEmailDetail(ev.value);
    }
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <TextField
          fullWidth
          required
          className={classes.mailTitle}
          name="Mail title"
          onChange={(e) => {
            this.props.onChangeTitle(e.target.value);
          }}
          placeholder={t('mail.title')}
          value={this.props.title}
        />
        <div>
          {this.props.emailListLoading ? (
            <LinearProgress className={classes.selectorContainer} />
          ) : (
            <div className={classes.selectorContainer}>
              <EmailSelector
                emails={this.props.emails}
                helperText={t('mail.mailSelection')}
                onChange={this.handleOnChange}
                value={this.props.selectedMail}
              />
              <Fab
                className={classes.addIcon}
                color="secondary"
                onClick={() => {
                  this.props.onCancel();
                  const url = '/email-template/create';
                  const win = window.open(url);
                  win.focus();
                  this.props.onChangeTemplate(null);
                }}
                size="small"
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
                  classes={{ disabled: classes.disabled }}
                  className={classes.advanceIndex}
                  color="secondary"
                  disabled={this.props.selectedMail === null}
                  onClick={() => {
                    this.props.onCancel();
                    const url = `/email-template/${this.props.selectedMail}/edit`;
                    const win = window.open(url);
                    win.focus();
                    this.props.onChangeTemplate(null);
                  }}
                  size="small"
                >
                  <EditIcon />
                </Fab>
              </div>
            ) : null}
            <div className={classes.mailPreview}>
              {this.props.selectedMail &&
              !!this.props.emailDetails[this.props.selectedMail] ? (
                <HTMLPreview
                  scrolling
                  html={
                    this.props.emailDetails?.[this.props.selectedMail]?.html
                  }
                  resolvedGenericTags={this.props.resolvedGenericTags}
                />
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
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
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
    zIndex: 100,
  },
  advanceIndex: {
    zIndex: 10,
  },
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(SelectTemplate);
