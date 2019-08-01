// @flow

import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';

import RecursiveToogle from './form/RecursionToogle.component';
import RedButton from '../../components/button/RedButton.component';

type Props = {
  t: (x: string) => string,
  onCancel: () => void,
  offerWasCancelled: ?boolean,
  processing: ?boolean,
  onHardDelete: () => void,
  onCancelOffer: ({ cashback: boolean, notify: boolean }) => void,
  fetchSimilarOffers: () => void,
  similarOfferLoading: boolean,
  similarOffers: Array<Offer>,
  classes: Object,
};

type State = {
  notify: boolean,
  cashback: boolean,
  deleteAll: boolean,
};

export class DeleteOfferForm extends Component<Props, State> {
  state = {
    notify: true,
    cashback: true,
    deleteAll: false,
  };

  componentWillMount() {
    this.props.fetchSimilarOffers();
  }

  onCreditBackSwitch = (event: Object) => {
    this.setState({ cashback: event.target.checked });
  };

  onNotifySwitch = (event: Object) => {
    this.setState({ notify: event.target.checked });
  };

  onConfirm = () => {
    const { offerWasCancelled } = this.props;
    const { notify, cashback, deleteAll } = this.state;
    if (offerWasCancelled) {
      return this.props.onHardDelete({ deleteAll });
    }
    return this.props.onCancelOffer({ notify, cashback, deleteAll });
  };

  renderInside = () => {
    const { t, classes, offerWasCancelled } = this.props;
    if (offerWasCancelled) {
      return (
        <div>
          <Typography>{t('form.offer.delete.explainHardDelete')}</Typography>
          <RecursiveToogle
            color="secondary"
            shouldModifyAllDates={this.state.deleteAll}
            message={this.props.t('form.offer.explainRecursiveOfferDelete')}
            listTitle={this.props.t('offer.offersPendingDelete')}
            loading={this.props.similarOfferLoading}
            similarOffers={this.props.similarOffers}
            onChangeRecursion={({ modifyRecursively }) =>
              this.setState({ deleteAll: modifyRecursively })
            }
          />
        </div>
      );
    }
    const { notify, cashback, deleteAll } = this.state;
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography className={classes.explainText}>
            {t('form.offer.delete.explainModalities')}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16} alignItems="center">
            <Grid item>
              <Switch checked={cashback} onChange={this.onCreditBackSwitch} />
            </Grid>
            <Grid item>
              <Typography disabled>
                {t('form.offer.delete.explainCreditBack')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16} alignItems="center">
            <Grid item>
              <Switch checked={notify} onChange={this.onNotifySwitch} />
            </Grid>
            <Grid item>
              <Typography>{t('form.offer.delete.explainNotify')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <RecursiveToogle
            color="secondary"
            shouldModifyAllDates={deleteAll}
            message={this.props.t('form.offer.explainRecursiveOfferDelete')}
            listTitle={this.props.t('offer.offersPendingDelete')}
            loading={this.props.similarOfferLoading}
            similarOffers={this.props.similarOffers.filter((o) => o.available)}
            onChangeRecursion={({ modifyRecursively }) =>
              this.setState({ deleteAll: modifyRecursively })
            }
          />
        </Grid>
      </Grid>
    );
  };

  render() {
    const { t, processing, onCancel, offerWasCancelled } = this.props;
    return (
      <Grid
        container
        direction="column"
        spacing={16}
        style={{ height: '100%' }}
      >
        <Grid item>
          <Typography variant="h6">
            {offerWasCancelled
              ? t('form.offer.deleteTitle')
              : t('form.offer.cancelTitle')}
          </Typography>
        </Grid>
        <Grid item>{this.renderInside()}</Grid>
        <Grid item>
          <Grid container item justify="flex-end">
            <Button onClick={onCancel}>{t('common.cancel')}</Button>
            {processing ? (
              <CircularProgress />
            ) : (
              <RedButton onClick={this.onConfirm}>
                {t('common.confirm')}
              </RedButton>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  explainText: {
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    backgroundColor: '#F2F2F2',
  },
});

export default withNamespaces()(withStyles(styles)(DeleteOfferForm));
