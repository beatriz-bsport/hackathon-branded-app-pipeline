// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { OptionCallback } from '../../../state/types.ts';

type Props = {
  t: TFunction,
  error: boolean,
  setError: (boolean) => void,
  validateEmail: (
    { uid: string, token: string },
    options: OptionCallback,
  ) => void,
  classes: Object,
  goToLogin: () => void,
  uid: string,
  token: string,
};

export class ValidateEmailWithToken extends React.Component<Props> {
  componentDidMount() {
    this.props.validateEmail(
      { uid: this.props.uid, token: this.props.token },
      {
        onError: () => {
          this.props.setError(true);
        },
      },
    );
  }

  render() {
    const { classes, t } = this.props;
    if (this.props.error) {
      return (
        <div className={classes.container}>
          <CancelIcon className={classes.icon} />
          <Typography>{t('emailValidation.linkExpired')}</Typography>
          <Button
            variant="outlined"
            onClick={this.props.goToLogin}
            color="primary"
          >
            {t('emailValidation.goToLogin')}
          </Button>
        </div>
      );
    }
    return (
      <div className={classes.container}>
        <CircularProgress />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
  icon: {
    height: 160,
    width: 160,
  },
});

export default compose(
  withTranslation(['login']),
  withStyles(styles),
  withState('error', 'setError', false),
)(ValidateEmailWithToken);
