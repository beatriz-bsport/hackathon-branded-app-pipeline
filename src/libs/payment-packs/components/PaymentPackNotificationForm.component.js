// @flow

import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import withStyles from '@material-ui/core/styles/withStyles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Collapse from '@material-ui/core/Collapse';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import InfoIcon from '@material-ui/icons/Info';

import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import SmartListSelector from '../../smart-list/components/SmartListSelector.component';
import EmailSelector from '../../email-editor/components/EmailSelector.component';
import NumericInput from '../../../components/input/NumericInput.component';

const PAYMENT_PACK_NOTIFICATION_DAY_LEFT = 0;
const PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT = 1;
const PAYMENT_PACK_NOTIFICATION_DAY_PAST = 2;

type Props = {
  classes: Object,
  getEmails: () => void,
  getSmartLists: () => void,
  getEmailDetail: (id: number) => void,
  t: TFunction,
  emailListLoading: boolean,
  open: boolean,
  emails: Array<any>,
  notification: any,
  smartLists: Array<any>,
  emailDetailLoading: boolean,
  emailDetails: Array<any>,
  onCancel: () => void,
  onSubmit: (data: any) => void,
};

export class notificationRuleForm extends Component<Props, state> {
  state = {
    kind: 0,
    displayMailPreview: false,
    selectedMail: null,
    smartlist_include: [],
    smartlist_exclude: [],
    days_left: null,
    credits_left: null,
  };

  computeKind = () => {
    if (
      this.props.notification.kind === PAYMENT_PACK_NOTIFICATION_DAY_LEFT &&
      this.props.notification.days_left < 0
    ) {
      return PAYMENT_PACK_NOTIFICATION_DAY_PAST;
    }

    if (
      this.props.notification.kind === PAYMENT_PACK_NOTIFICATION_DAY_LEFT &&
      this.props.notification.days_left >= 0
    ) {
      return PAYMENT_PACK_NOTIFICATION_DAY_LEFT;
    }
    return PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT;
  };

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open) {
      if (this.props.notification) {
        this.props.getEmailDetail(this.props.notification.email_design);
      }
      this.props.getEmails();
      this.props.getSmartLists();
      this.setState({
        kind: this.props.notification
          ? this.computeKind()
          : PAYMENT_PACK_NOTIFICATION_DAY_LEFT,
        displayMailPreview: false,
        days_left: this.props.notification
          ? Math.abs(this.props.notification.days_left)
          : null,
        credits_left: this.props.notification
          ? this.props.notification.credits_left
          : null,

        selectedMail:
          this.props.notification &&
          this.props.emails.find(
            (email) => email.id === this.props.notification.email_design,
          )
            ? this.props.emails.find(
                (email) => email.id === this.props.notification.email_design,
              ).id
            : null,
        smartlist_include: this.props.notification
          ? this.props.notification.smartlist_include
          : [],
        smartlist_exclude: this.props.notification
          ? this.props.notification.smartlist_exclude
          : [],
      });
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
            {this.props.t('notification.form.noMailAvailable')}
          </Typography>
        </div>
      );
    }

    return (
      <div className={this.props.classes.previewEmpty}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography color="textSecondary">
          {this.props.t('notification.form.selectToShowPreview')}
        </Typography>
      </div>
    );
  };

  renderCreditChoice = () => {
    return (
      <div>
        <div className={this.props.classes.inlineContainer}>
          <Typography variant="caption">
            {this.props.t(
              `notification.${PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT}.first`,
            )}
          </Typography>
          <NumericInput
            key={this.state.kind}
            onChange={(ev) =>
              this.setState({
                credits_left: ev.target.value
                  ? parseInt(ev.target.value, 10)
                  : null,
              })
            }
            classes={this.props.classes}
            value={this.state.credits_left}
          />
          <Typography variant="caption">
            {this.props.t(
              `notification.${PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT}.second`,
            )}
          </Typography>
        </div>
      </div>
    );
  };

  renderTimeChoice = () => {
    return (
      <div className={this.props.classes.inlineContainer}>
        <Typography variant="caption">
          {this.props.t(`notification.${this.state.kind}.first`)}
        </Typography>
        <NumericInput
          key={this.state.kind}
          onChange={(ev) =>
            this.setState({
              days_left: ev.target.value ? parseInt(ev.target.value, 10) : null,
            })
          }
          classes={this.props.classes}
          value={this.state.days_left}
        />
        <Typography variant="caption">
          {this.props.t(`notification.${this.state.kind}.second`)}
        </Typography>
      </div>
    );
  };

  renderSmartListChoice = () => {
    return (
      <div>
        <div className={this.props.classes.smartListSelector}>
          <Typography variant="caption">
            {this.props.t('notification.form.smartListHelper')}
          </Typography>
          <SmartListSelector
            smartLists={this.props.smartLists}
            values={this.state.smartlist_exclude}
            onChange={(ev) =>
              this.setState({
                smartlist_exclude: ev.map((item) => item.value),
              })
            }
            helperText={this.props.t('notification.form.smartListSelection')}
          />
        </div>
        <div className={this.props.classes.smartListSelector}>
          <Typography variant="caption">
            {this.props.t('notification.form.smartListHelperInclude')}
          </Typography>
          <SmartListSelector
            smartLists={this.props.smartLists}
            values={this.state.smartlist_include}
            onChange={(ev) =>
              this.setState({
                smartlist_include: ev.map((item) => item.value),
              })
            }
            helperText={this.props.t('notification.form.smartListSelection')}
          />
        </div>
      </div>
    );
  };

  renderEmailSelector = () => {
    const { classes, t } = this.props;
    return (
      <div>
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
              helperText={t('notification.form.mailSelection')}
            />
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
                  {t('notification.form.hideMail')}
                </Typography>
              </div>
            ) : (
              <div className={classes.inlineContainer}>
                <VisibilityIcon className={classes.visibilityIcon} />
                <Typography variant="caption">
                  {t('notification.form.showMail')}
                </Typography>
              </div>
            )}
          </Button>
        </div>
        <Collapse in={this.state.displayMailPreview}>
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
        </Collapse>
      </div>
    );
  };

  checkFormValidity = () => {
    if (this.state.kind === null || this.state.selectedMail === null) {
      return false;
    }
    if (
      this.state.days_left === null &&
      this.state.kind === PAYMENT_PACK_NOTIFICATION_DAY_PAST
    ) {
      return false;
    }
    if (
      this.state.days_left === null &&
      this.state.kind === PAYMENT_PACK_NOTIFICATION_DAY_LEFT
    ) {
      return false;
    }
    if (
      (this.state.credits_left === null &&
        this.state.kind === PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT) ||
      this.state.credits_left < 0
    ) {
      return false;
    }
    return true;
  };

  render() {
    const { notification, t, classes } = this.props;
    if (notification && notification.loading) return <CircularProgress />;

    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Formulaire notification</DialogTitle>
        <div className={classes.dialogContainer}>
          <div className={classes.fieldContainer}>
            <Typography variant="subtitle2">
              {t('notification.form.typeTitle')}
            </Typography>
            <RadioGroup
              aria-label="Applies to "
              name="applies_to"
              value={this.state.kind}
              onChange={(ev) =>
                this.setState({
                  kind: parseInt(ev.target.value, 10),
                  days_left: null,
                  credits_left: null,
                })
              }
            >
              <FormControlLabel
                value={PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT}
                control={
                  <Radio
                    checked={
                      PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT === this.state.kind
                    }
                  />
                }
                label={t('notification.form.creditType')}
              />
              <FormControlLabel
                value={PAYMENT_PACK_NOTIFICATION_DAY_LEFT}
                control={
                  <Radio
                    checked={
                      PAYMENT_PACK_NOTIFICATION_DAY_LEFT === this.state.kind
                    }
                  />
                }
                label={t('notification.form.daysType')}
              />
              <FormControlLabel
                value={PAYMENT_PACK_NOTIFICATION_DAY_PAST}
                control={
                  <Radio
                    checked={
                      PAYMENT_PACK_NOTIFICATION_DAY_PAST === this.state.kind
                    }
                  />
                }
                label={t('notification.form.daysPastType')}
              />
            </RadioGroup>
          </div>
          <div className={classes.fieldContainer}>
            <Typography variant="subtitle2">
              {t('notification.form.settingTitle')}
            </Typography>

            {PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT === this.state.kind
              ? this.renderCreditChoice()
              : this.renderTimeChoice()}
            {PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT === this.state.kind
              ? null
              : this.renderSmartListChoice()}
          </div>
          <div className={classes.fieldContainer}>
            <Typography variant="subtitle2">
              {t('notification.form.mailTitle')}
            </Typography>

            {this.renderEmailSelector()}
          </div>
          <DialogActions className={classes.bottomButtons}>
            <Button onClick={this.props.onCancel}>
              {t('notification.form.cancel')}
            </Button>
            <Button
              color="primary"
              disabled={!this.checkFormValidity()}
              onClick={() =>
                this.props.onSubmit({
                  kind:
                    this.state.kind === PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT
                      ? PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT
                      : PAYMENT_PACK_NOTIFICATION_DAY_LEFT,
                  days_left:
                    this.state.kind === PAYMENT_PACK_NOTIFICATION_DAY_LEFT
                      ? this.state.days_left
                      : -this.state.days_left,
                  credits_left: this.state.credits_left,
                  email_design: this.state.selectedMail,
                  smartlist_include: this.state.smartlist_include,
                  smartlist_exclude: this.state.smartlist_exclude,
                })
              }
            >
              {t('notification.form.submit')}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  bottomButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  smartListSelector: {
    marginTop: theme.spacing.unit * 2,
  },
  fieldContainer: {
    marginBottom: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  textInput: {
    width: '70px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
  dialogContainer: {
    padding: theme.spacing.unit,
    minWidth: '500px',
  },
  visibilityIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['paymentPack']),
  withStyles(styles),
)(notificationRuleForm);
