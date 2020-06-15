// @flow

import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Hidden from '@material-ui/core/Hidden';
import { withTranslation } from 'react-i18next';

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
            disabled={this.props.processing}
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
      <div>
        <Typography className={classes.explainText}>
          {t('form.offer.delete.explainModalities')}
        </Typography>
        <Hidden xsUp>
          <div className={classes.row}>
            <Switch
              disabled
              checked={cashback}
              onChange={this.onCreditBackSwitch}
            />
            <Typography disabled>
              {t('form.offer.delete.explainCreditBack')}
            </Typography>
          </div>
        </Hidden>
        <div className={classes.row}>
          <Switch
            disabled={this.props.processing}
            checked={notify}
            onChange={this.onNotifySwitch}
          />
          <Typography>{t('form.offer.delete.explainNotify')}</Typography>
        </div>
        <RecursiveToogle
          color="secondary"
          disabled={this.props.processing}
          shouldModifyAllDates={deleteAll}
          message={this.props.t('form.offer.explainRecursiveOfferDelete')}
          listTitle={this.props.t('offer.offersPendingDelete')}
          loading={this.props.similarOfferLoading}
          similarOffers={this.props.similarOffers.filter((o) => o.available)}
          onChangeRecursion={({ modifyRecursively }) =>
            this.setState({ deleteAll: modifyRecursively })
          }
        />
      </div>
    );
  };

  render() {
    const { t, processing, onCancel, offerWasCancelled } = this.props;
    return (
      <React.Fragment>
        <DialogTitle>
          {offerWasCancelled
            ? t('form.offer.deleteTitle')
            : t('form.offer.cancelTitle')}
        </DialogTitle>
        {this.renderInside()}
        <DialogActions>
          <Button disabled={processing} onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          {processing ? (
            <CircularProgress />
          ) : (
            <RedButton onClick={this.onConfirm}>
              {t('common.confirm')}
            </RedButton>
          )}
        </DialogActions>
      </React.Fragment>
    );
  }
}

const styles = (theme) => ({
  explainText: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#F2F2F2',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default withTranslation()(withStyles(styles)(DeleteOfferForm));
