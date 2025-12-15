import React from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getPaymentGroupStatusBySecret as getPaymentGroupStatusBySecretAPI } from '../../../libs/payment/api';

export class CheckPaymentStatus extends React.Component<Props> {
  state = { interval: null };

  componentDidMount() {
    this.setState({
      interval: setInterval(
        () =>
          getPaymentGroupStatusBySecretAPI(this.props.paymentIntent).then(
            (r) => {
              if ([200, 400].includes(r.data)) {
                // Stop polling when we get success response
                if (this.state.interval) {
                  clearInterval(this.state.interval);
                }
                this.props.onSuccess();
              } else if ([300, 600].includes(r.data)) {
                // due to backend issue, we never get through this case,
                // see https://bsporttest.atlassian.net/browse/BS-3786 for more information
                if (this.state.interval) {
                  clearInterval(this.state.interval);
                }
                this.props.onFail();
              }
            },
          ),
        2000,
      ),
    });
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.container}>
        <CircularProgress />
        <Typography variant="caption">
          {t('myBasket.checkingPaymentStatus')}
        </Typography>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20vh',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
});

export default compose(
  withTranslation(['checkout']),
  withStyles(styles),
)(CheckPaymentStatus);
