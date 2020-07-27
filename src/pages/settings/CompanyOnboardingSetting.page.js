// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { injectStripe, Elements, StripeProvider } from 'react-stripe-elements';
import { withState, compose, withHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import { getOnboardingLink as getOnboardingLinkAPI } from '../../libs/company/api';

import Config from '../../config';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

type Props = {
  stripe: Stripe,
  getOnboardingLink: (tokenId: string) => Promise,
  setError: (?Error) => void,
  classes: Object,
  t: TFunction,
  error: ?Error,
};

export class CompanyOnboardingSettingPage extends React.Component<Props> {
  componentDidMount() {
    this.props.stripe
      .createToken('account', { tos_shown_and_accepted: true })
      .then(({ token }) => {
        this.props.getOnboardingLink(token.id);
      })
      .catch((err) => {
        console.error(err);
        this.props.setError(err);
      });
  }

  render() {
    if (!this.props.error) {
      return (
        <div className={this.props.classes.container}>
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className={this.props.classes.container}>
        <WarningIcon fontSize="large" />
        <Typography>{this.props.t('companyOnboarding.error')}</Typography>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    display: 'flex',
  },
});

const CompanyOnboardingSettingPageComposed = compose(
  injectStripe,
  withStyles(styles),
  withTranslation(['settings']),
  withState('error', 'setError', null),
  withHandlers({
    getOnboardingLink: ({ setError }) => (tokenId) =>
      getOnboardingLinkAPI({ account_token: tokenId })
        .then((r) => {
          window.location = r.data.url;
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        }),
  }),
)(CompanyOnboardingSettingPage);

export default (props: Props) => (
  <StripeProvider apiKey={STRIPE_KEY}>
    <Elements>
      <CompanyOnboardingSettingPageComposed {...props} />
    </Elements>
  </StripeProvider>
);
