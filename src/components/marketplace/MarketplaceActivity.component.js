// @flow

import React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';

import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

import CancelIcon from '@material-ui/icons/Cancel';

import { get, API_URI } from '../../http';

import Map from '../establishment/Map.component';

import ConsumerPackCheckout from '../consumer/ConsumerPackCheckout.component';
import PaymentPackSummary from '../consumer/PaymentPackSummary.component';

import * as paymentActions from '../../actions/payment.actions';

export class MarketPlaceActivity extends React.Component {
  state = {
    loading: false,
    activity: null,
  };

  componentDidMount() {
    this.setState({ loading: true });
    get(`${API_URI}/activity/${this.props.offer.activity_id}/detail`)
      .then((response) => {
        this.setState({ activity: response.data, loading: false });
      })
      .catch(() => this.setState({ loading: false }));

    this.props.fetchPass(this.props.offerId);
    this.props.fetchPaymentPacks(this.props.offerId);
  }

  render() {
    if (this.state.loading || !this.state.activity) {
      return (
        <div className={this.props.classes.loading}>
          <CircularProgress />
        </div>
      );
    }
    const { offer, classes, onClose, pushRouter } = this.props;
    const { activity } = this.state;
    const establishment = offer.establishment_override || offer.etablissement;
    const { location } = establishment || { location: null };
    const center = location ? [location.latitude, location.longitude] : null;
    const markers = location ? [establishment] : [];
    return (
      <Card className={classes.card}>
        <IconButton className={classes.cancelButton} onClick={onClose}>
          <CancelIcon className={classes.cancelIcon} />
        </IconButton>
        <CardMedia
          className={classes.media}
          src={offer.cover_main}
          component="img"
        />
        <CardContent>
          {this.props.showBookingButton ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.callButton}
              onClick={() => pushRouter(`/customer/payment/offer/${offer.id}`)}
            >
              Réserver
            </Button>
          ) : null}
          {this.state.loading ? (
            <LinearProgress />
          ) : (
            <div>
              <Typography variant="body2" className={classes.hashtags}>
                {activity.hashtags}
              </Typography>
              <Typography variant="subtitle1" className={classes.title}>
                {offer.name}
              </Typography>
              <Typography variant="body2">{activity.description}</Typography>
              {this.props.displayPacksInformation &&
              this.props.compatibleConsumerPacks.length &&
              false ? (
                <div>
                  <Typography variant="subtitle1" className={classes.title}>
                    Mes abonnements compatibles
                  </Typography>
                  {this.props.compatibleConsumerPacks.map((p) => (
                    <ConsumerPackCheckout
                      key={p.id}
                      offerId={offer.id}
                      consumerPack={p}
                      urlParams=""
                    />
                  ))}
                </div>
              ) : null}
              {this.props.displayPacksInformation &&
              this.props.compatiblePaymentPacks.length &&
              false ? (
                <div>
                  <Typography variant="subtitle1" className={classes.title}>
                    Abonnements compatibles
                  </Typography>
                  <div className={classes.listPaymentPacks}>
                    {this.props.compatiblePaymentPacks.map((p) => (
                      <PaymentPackSummary
                        key={p.id}
                        paymentPack={p}
                        noDivider
                        buyButton
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              <Typography variant="subtitle1" className={classes.title}>
                Etablissement
              </Typography>
              <Typography variant="body2" className={classes.address}>
                {establishment.location.address}
              </Typography>
              <Map center={center} markers={markers} zoom={15} />
            </div>
          )}
        </CardContent>
        {this.props.showBookingButton ? (
          <CardActions>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => pushRouter(`/customer/payment/offer/${offer.id}`)}
            >
              Réserver
            </Button>
          </CardActions>
        ) : null}
      </Card>
    );

    // JSON.stringify(props);
  }
}

const styles = () => ({
  card: {
    margin: '0 auto',
    minWidth: 200,
    maxWidth: 700,
  },
  media: {
    maxHeight: 200,
    objectFit: 'cover',
  },
  hashtags: {
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 500,
    marginTop: 20,
  },
  address: {
    marginBottom: 20,
  },
  callButton: {
    marginBottom: 20,
  },
  listPaymentPacks: {
    backgroundColor: '#F8F8F8',
    maxHeight: 320,
    overflowY: 'scroll',
  },
  loading: {
    padding: 40,
  },
  cancelButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  cancelIcon: {
    color: 'secondary',
    height: 32,
    width: 32,
  },
});

function mapStateToProps(state, props) {
  return {
    offer:
      state.marketplace.detailedOffers.find((o) => o.id === props.offerId) ||
      {},
    compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
    compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
  };
}

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    {
      fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      fetchPass: paymentActions.fetchCompatiblePass,
      pushRouter,
    },
  ),
)(MarketPlaceActivity);
