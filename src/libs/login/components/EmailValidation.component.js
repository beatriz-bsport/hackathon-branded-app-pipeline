// @flow
import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import EmailIcon from '@material-ui/icons/Email';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import type { OptionCallback } from '../../../state/types';

import RedButton from '../../../components/button/RedButton.component';

type Props = {
  t: TFunction,
  checkEmailValidation: (callback: () => void) => void,
  setValidated: (boolean) => void,
  validated: boolean,
  hasSentAgain: boolean,
  setHasSentAgain: (boolean) => void,
  setSending: (boolean) => void,
  isSending: boolean,
  requestValidationEmail: (OptionCallback) => void,
  classes: Object,
  disconnect: () => void,
};

export class ValidateEmail extends React.Component<Props> {
  interval: ?Interval;

  componentDidMount() {
    if (this.props.checkEmailValidation) {
      this.interval = setInterval(() => {
        try {
          this.props.checkEmailValidation(() => this.props.setValidated(true));
        } catch (err) {
          console.error(err);
        }
      }, 3000);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        {!this.props.validated && (
          <div className={this.props.classes.inner}>
            <EmailIcon fontSize="large" className={this.props.classes.icon} />
            <Typography>{this.props.t('emailValidation.explain')}</Typography>
            {!!this.props.hasSentAgain && (
              <Button variant="outlined" disabled>
                <CheckIcon className={this.props.classes.leftIcon} />
                {this.props.t('emailValidation.hasSentAgain')}
              </Button>
            )}
            <div className={this.props.classes.row}>
              {!this.props.hasSentAgain && (
                <Button
                  disabled={this.props.isSending}
                  onClick={() => {
                    this.props.setSending(true);
                    this.props.requestValidationEmail({
                      onSuccess: () => {
                        this.props.setHasSentAgain(true);
                        this.props.setSending(false);
                      },
                      onError: () => {
                        this.props.setSending(false);
                      },
                    });
                  }}
                  variant="outlined"
                  color="primary"
                >
                  {this.props.t('emailValidation.sendAgain')}
                </Button>
              )}
              <RedButton onClick={this.props.disconnect} color="secondary">
                {this.props.t('emailValidation.disconnect')}
              </RedButton>
            </div>
          </div>
        )}
        {!!this.props.validated && (
          <div className={this.props.classes.inner}>
            <CheckIcon color="primary" className={this.props.classes.icon} />
            <Typography>{this.props.t('emailValidation.success')}</Typography>
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&>*': {
      marginBottom: theme.spacing(4),
    },
  },
  icon: {
    height: 160,
    width: 160,
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    flex: 1,
    '&>*': {
      marginBottom: theme.spacing(10),
    },
  },
});
export default compose(
  withState('validated', 'setValidated', false),
  withState('hasSentAgain', 'setHasSentAgain', false),
  withState('isSending', 'setSending', false),
  withTranslation(['login']),
  withStyles(styles),
)(ValidateEmail);
