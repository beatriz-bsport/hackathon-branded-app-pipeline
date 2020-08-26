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
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import NumericInput from '../../../components/input/NumericInput.component';
import EmailSelector from '../../email-editor/components/EmailSelector.component';
import type { Notification } from '../types';

const BOOKING_NOTIFICATION_VALID_ATTENDANCE = 3;
const BOOKING_NOTIFICATION_VALID_ABSENCE = 4;
const BOOKING_NOTIFICATION_CANCELLED_REFUNDED = 5;
const BOOKING_NOTIFICATION_CANCELLED_NOT_REFUNDED = 6;

type Props = {
  t: TFunction,
  openForm: boolean,
  openPreForm: boolean,
  classes: Object,
  onCancel: () => void,
  getEmails: () => void,
  emails: Array<any>,
  getEmailDetail: (id: number) => void,
  emailDetails: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  notification?: Notification,
  onSubmit: (data: any) => void,
  nextStep: () => void,
  update: boolean,
};

export class BookingCreationNotificationForm extends Component<Props, State> {
  state = {
    bookingStatus: 'valid',
    kind: BOOKING_NOTIFICATION_VALID_ATTENDANCE,
    when: 'before',
    displayMailPreview: false,
    selectedMail: null,
    hours: null,
    notify_booking_nb: 1,
  };

  computeWhen = () => {
    return this.props.notification.hours > 0 ? 'after' : 'before';
  };

  computeKind = () => {
    if (this.state.kind === BOOKING_NOTIFICATION_VALID_ATTENDANCE) {
      return 'attendance';
    }
    if (this.state.kind === BOOKING_NOTIFICATION_VALID_ABSENCE) {
      return 'absence';
    }
    if (this.state.kind === BOOKING_NOTIFICATION_CANCELLED_REFUNDED) {
      return 'refunded';
    }
    return 'notRefunded';
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.openForm !== prevProps.openForm) {
      if (this.props.notification) {
        this.props.getEmailDetail(this.props.notification.email_design);
      }
      this.props.getEmails();
      this.setState({
        when: this.props.notification ? this.computeWhen() : 'before',
        displayMailPreview: false,
        hours: this.props.notification
          ? Math.abs(this.props.notification.hours)
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
      });
      if (this.props.update && !prevProps.update) {
        this.setState({
          kind: this.props.notification
            ? this.props.notification.kind
            : BOOKING_NOTIFICATION_VALID_ATTENDANCE,
          notify_booking_nb: this.props.notification
            ? this.props.notification.notify_booking_nb
            : 1,
        });
      }
    }
  }

  renderLoadingOrEmpty = (loading: boolean, emails: Array<any>) => {
    if (loading) {
      return <CircularProgress />;
    }
    if (emails.length === 0) {
      return (
        <div className={this.props.classes.previewEmpty}>
          <InfoIcon fontSize="large" color="disabled" />
          <Typography color="textSecondary">
            {this.props.t('paymentPack:notification.form.noMailAvailable')}
          </Typography>
        </div>
      );
    }
    return (
      <div className={this.props.classes.previewEmpty}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography color="textSecondary">
          {this.props.t('paymentPack:notification.form.selectToShowPreview')}
        </Typography>
      </div>
    );
  };

  renderTimeChoice = () => {
    return (
      <div className={this.props.classes.inlineContainer}>
        <Typography variant="caption">
          {this.props.t('booking:notification.form.chooseTime.first')}
        </Typography>
        <NumericInput
          onChange={(ev) => {
            this.setState({
              hours: ev.target.value ? parseInt(ev.target.value, 10) : null,
            });
          }}
          classes={{ textInput: this.props.classes.textInput }}
          value={this.state.hours}
          error={
            !this.state.hours ||
            this.state.hours < 0 ||
            this.state.hours > 32767
          }
        />
        <Typography variant="caption">
          {this.props.t('booking:notification.form.chooseTime.second', {
            context: this.state.when,
          })}
        </Typography>
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
                this.setState({ selectedMail: ev ? ev.value : null });
                if (ev) {
                  this.props.getEmailDetail(ev.value);
                }
              }}
              helperText={t('paymentPack:notification.form.mailSelection')}
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
                  {t('paymentPack:notification.form.hideMail')}
                </Typography>
              </div>
            ) : (
              <div className={classes.inlineContainer}>
                <VisibilityIcon className={classes.visibilityIcon} />
                <Typography variant="caption">
                  {t('paymentPack:notification.form.showMail')}
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

  renderEmailField() {
    return (
      <div className={this.props.classes.emailInput}>
        <Typography variant="caption">
          {this.props.t('paymentPack:notification.form.mailTitle')}
        </Typography>
        {this.renderEmailSelector()}
      </div>
    );
  }

  checkFormValidity = () => {
    return (
      !!this.state.hours &&
      this.state.hours > 0 &&
      this.state.hours < 32767 &&
      !!this.state.selectedMail
    );
  };

  checkPreFormValidity = () => {
    return (
      !!this.state.notify_booking_nb &&
      this.state.notify_booking_nb > 0 &&
      this.state.notify_booking_nb <= 32767
    );
  };

  renderPreForm = () => {
    const { t, classes } = this.props;
    return (
      <div className={classes.dialogContainer}>
        <Typography variant="body2" className={this.props.classes.explain}>
          {t('booking:notification.form.explain')}
        </Typography>
        <div className={classes.fieldContainer}>
          <Typography variant="subtitle2">
            {t('booking:notification.form.chooseStatus.title')}
          </Typography>
          <RadioGroup
            value={this.state.bookingStatus}
            onChange={(ev) =>
              this.setState({
                bookingStatus: ev.target.value,
                kind:
                  ev.target.value === 'valid'
                    ? BOOKING_NOTIFICATION_VALID_ATTENDANCE
                    : BOOKING_NOTIFICATION_CANCELLED_REFUNDED,
              })
            }
          >
            <FormControlLabel
              value="valid"
              control={<Radio checked={this.state.bookingStatus === 'valid'} />}
              label={t('booking:notification.form.chooseStatus.valid')}
              classes={{ label: classes.label }}
            />
            <FormControlLabel
              value="cancelled"
              control={
                <Radio checked={this.state.bookingStatus === 'cancelled'} />
              }
              label={t('booking:notification.form.chooseStatus.cancelled')}
              classes={{ label: classes.label }}
            />
          </RadioGroup>
        </div>
        <div className={classes.fieldContainer}>
          <Typography variant="subtitle2">
            {t('booking:notification.form.chooseKind.title')}
          </Typography>
          <RadioGroup
            aria-label="Applies to "
            name="applies_to"
            value={this.state.kind}
            onChange={(ev) =>
              this.setState({
                kind: parseInt(ev.target.value, 10),
              })
            }
          >
            {this.state.bookingStatus === 'valid' ? (
              <>
                <FormControlLabel
                  value={BOOKING_NOTIFICATION_VALID_ATTENDANCE}
                  control={
                    <Radio
                      checked={
                        this.state.kind ===
                        BOOKING_NOTIFICATION_VALID_ATTENDANCE
                      }
                    />
                  }
                  label={t('booking:notification.form.chooseKind.attendance')}
                  classes={{ label: classes.label }}
                />
                <FormControlLabel
                  value={BOOKING_NOTIFICATION_VALID_ABSENCE}
                  control={
                    <Radio
                      checked={
                        this.state.kind === BOOKING_NOTIFICATION_VALID_ABSENCE
                      }
                    />
                  }
                  label={t('booking:notification.form.chooseKind.absence')}
                  classes={{ label: classes.label }}
                />
              </>
            ) : (
              <>
                <FormControlLabel
                  value={BOOKING_NOTIFICATION_CANCELLED_REFUNDED}
                  control={
                    <Radio
                      checked={
                        this.state.kind ===
                        BOOKING_NOTIFICATION_CANCELLED_REFUNDED
                      }
                    />
                  }
                  label={t('booking:notification.form.chooseKind.refunded')}
                  classes={{ label: classes.label }}
                />
                <FormControlLabel
                  value={BOOKING_NOTIFICATION_CANCELLED_NOT_REFUNDED}
                  control={
                    <Radio
                      checked={
                        this.state.kind ===
                        BOOKING_NOTIFICATION_CANCELLED_NOT_REFUNDED
                      }
                    />
                  }
                  label={t('booking:notification.form.chooseKind.notRefunded')}
                  classes={{ label: classes.label }}
                />
              </>
            )}
          </RadioGroup>
          <div className={classes.inlineContainer}>
            <Typography variant="caption">
              {t('booking:notification.form.eventNb')}
            </Typography>
            <NumericInput
              onChange={(ev) => {
                this.setState({
                  notify_booking_nb: ev.target.value
                    ? parseInt(ev.target.value, 10)
                    : null,
                });
              }}
              classes={{ textInput: this.props.classes.textInput }}
              value={this.state.notify_booking_nb}
              error={
                !this.state.notify_booking_nb ||
                this.state.notify_booking_nb <= 0 ||
                this.state.notify_booking_nb > 32767
              }
            />
          </div>
          <Typography variant="caption" className={classes.example}>
            {`${t('booking:notification.form.help.text')} ${t(
              `booking:notification.form.help.${this.computeKind()}`,
              { notify_booking_nb: this.state.notify_booking_nb },
            )}`}
          </Typography>
        </div>
        <DialogActions className={classes.bottomButtons}>
          <Button onClick={this.props.onCancel}>
            {t('booking:notification.form.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={this.props.nextStep}
            disabled={!this.checkPreFormValidity()}
          >
            {t('booking:notification.form.next')}
          </Button>
        </DialogActions>
      </div>
    );
  };

  renderForm = () => {
    const { t, classes } = this.props;
    return (
      <div className={classes.dialogContainer}>
        <div className={classes.fieldContainer}>
          <Typography variant="subtitle2">
            {t('booking:notification.form.typeTitle')}
          </Typography>
          <RadioGroup
            aria-label="Applies to "
            name="applies_to"
            value={this.state.when}
            onChange={(ev) =>
              this.setState({
                when: ev.target.value,
              })
            }
          >
            <FormControlLabel
              value="before"
              control={<Radio checked={this.state.when === 'before'} />}
              label={t('booking:notification.form.sendBeforeMail')}
              classes={{ label: classes.label }}
            />
            <FormControlLabel
              value="after"
              control={<Radio checked={this.state.when === 'after'} />}
              label={t('booking:notification.form.sendAfterMail')}
              classes={{ label: classes.label }}
            />
          </RadioGroup>
        </div>
        <div className={classes.fieldContainer}>
          <Typography variant="subtitle2">
            {t('booking:notification.form.settingTitle')}
          </Typography>
          {this.renderTimeChoice()}
          {this.renderEmailField()}
        </div>

        <DialogActions className={classes.bottomButtons}>
          <Button
            onClick={() => {
              this.props.onCancel();
            }}
          >
            {t('booking:notification.form.cancel')}
          </Button>
          <Button
            color="primary"
            disabled={!this.checkFormValidity()}
            onClick={() => {
              this.props.onSubmit({
                kind: this.state.kind,
                email_design: this.state.selectedMail,
                hours:
                  this.state.when === 'before'
                    ? this.state.hours * -1
                    : this.state.hours,
                notify_booking_nb: this.state.notify_booking_nb,
              });
            }}
          >
            {t('booking:notification.form.submit')}
          </Button>
        </DialogActions>
      </div>
    );
  };

  render() {
    const { t } = this.props;
    return (
      <div>
        <Dialog open={!!(this.props.openPreForm || this.props.openForm)}>
          <DialogTitle>{t('booking:notification.form.title')}</DialogTitle>
          {!!this.props.openPreForm && this.renderPreForm()}
          {!!this.props.openForm && this.renderForm()}
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  bottomButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  smartListSelector: {
    marginTop: theme.spacing(2),
  },
  fieldContainer: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  textInput: {
    width: '70px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    minHeight: '30vh',
    minWidth: '40vh',
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
  dialogContainer: {
    padding: theme.spacing(1),
    minWidth: '500px',
  },
  visibilityIcon: {
    marginRight: theme.spacing(1),
  },
  label: {
    // Mimics caption variant of Typography
    fontSize: 12,
    fontWeight: 400,
  },
  emailInput: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  example: {
    color: 'grey',
  },
  explain: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['booking', 'paymentPack']),
  withStyles(styles),
)(BookingCreationNotificationForm);
