// @flow

import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { colors } from '@bsport/common/lib/colors';

import Map from '../../../components/map/Map.component';
import TypographyMultiline from '../../../components/TypographyMultiline.component';

import ConsumerPackCheckout from '../../../pages/payment/offer/ConsumerPackCheckout.component';
import PaymentPackSummary from '../../../components/payment-pack/PaymentPackSummary.component';

import { isOfferInThePast } from '../utils';

type Props = {
  offer: Offer,
  offerId: number,
  offer: Offer,
  showBookingButton: ?boolean,
  displayPacksInformation: ?boolean,
  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatiblePaymentPacks: Array<PaymentPack>,
  goToOfferPayment: (offerId: number) => void,
  onCompletePurchase: () => void,
  hideMap: ?boolean,

  goToPackPayment: (packId: number, offerId: number, companyId: number) => void,
  fetchPassData: (id: number) => void,
  onClose: () => void,

  t: TFunction,
  classes: Object,
};

export class MarketPlaceActivity extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPassData(this.props.offerId);
  }

  renderCoachBanner = () => {
    const { offer, classes, t } = this.props;
    if (offer && offer.activity.coach) {
      return (
        <div>
          <Typography variant="h6" className={classes.title}>
            Coach
          </Typography>
          {offer.coach_override && offer.coach_override.user ? (
            <ListItem>
              <Avatar
                src={offer.coach_override.user.photo}
                className={classes.avatarSubstitute}
              />
              <ListItemText
                primary={offer.coach_override.user.name}
                secondary={t('marketplace.substitute')}
              />
            </ListItem>
          ) : null}
          <ListItem>
            <Avatar src={offer.activity.coach.user.photo} />
            <ListItemText
              primary={offer.activity.coach.user.name}
              secondary={
                offer.coach_override ? t('marketplace.substituted') : null
              }
            />
          </ListItem>
        </div>
      );
    }
    return null;
  };

  render() {
    const { offer, classes, onClose } = this.props;
    const { activity } = offer;
    if (
      typeof activity === 'number' ||
      typeof activity.establishment === 'number' ||
      typeof activity.coach === 'number' ||
      typeof offer.coach_override === 'number' ||
      typeof offer.establishment_override === 'number'
    ) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}
        >
          <CircularProgress />
        </div>
      );
    }
    const establishment =
      offer.establishment_override || offer.activity.establishment;
    const { location } = establishment || { location: null };
    const center = location ? [location.latitude, location.longitude] : null;
    const markers = location ? [establishment] : [];
    const unlimitedPass = this.props.compatibleConsumerPacks.filter(
      (cpp) => cpp.payment_pack.unlimited,
    );
    const passToDisplay = unlimitedPass.length
      ? unlimitedPass
      : this.props.compatibleConsumerPacks;
    return (
      <Card className={classes.card}>
        <IconButton
          color="secondary"
          className={classes.cancelButton}
          onClick={onClose}
        >
          <ArrowBackIcon className={classes.cancelIcon} />
        </IconButton>
        <CardMedia
          className={classes.media}
          src={activity.meta_activity.cover_main}
          component="img"
        />
        <CardContent>
          {this.props.showBookingButton ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.callButton}
              disabled={!isOfferInThePast(offer) || !offer.available}
              onClick={() => this.props.goToOfferPayment(offer.id)}
            >
              Réserver
            </Button>
          ) : null}
          <div>
            <Typography variant="body1" className={classes.hashtags}>
              {activity.hashtags}
            </Typography>
            <Typography variant="h6" className={classes.title}>
              {activity.meta_activity.name}
            </Typography>
            <TypographyMultiline color="textSecondary" variant="body1">
              {activity.meta_activity.description}
            </TypographyMultiline>
            {this.renderCoachBanner()}
            {this.props.displayPacksInformation && passToDisplay.length ? (
              <div>
                <Typography variant="h6" className={classes.title}>
                  Mes abonnements compatibles
                </Typography>
                {passToDisplay.map((p) => (
                  <ConsumerPackCheckout
                    creditPrice={offer.credit_price}
                    key={p.id}
                    offerId={offer.id}
                    consumerPack={p}
                    urlParams={{}}
                    onCompletePurchase={this.props.onCompletePurchase}
                  />
                ))}
              </div>
            ) : null}
            {this.props.displayPacksInformation &&
            this.props.compatiblePaymentPacks.length ? (
              <div>
                <Typography variant="h6" className={classes.title}>
                  Abonnements compatibles
                </Typography>
                <div className={classes.listPaymentPacks}>
                  {this.props.compatiblePaymentPacks.map((p) => (
                    <div key={p.id}>
                      <PaymentPackSummary
                        paymentPack={p}
                        buyButton={
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              this.props.goToPackPayment(
                                p.id,
                                this.props.offerId,
                                activity.company,
                              )
                            }
                          >
                            <AddShoppingCartIcon className={classes.leftIcon} />
                            {`${p.price} €`}
                          </Button>
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <Typography variant="h6" className={classes.title}>
              {establishment.title}
            </Typography>
            <Typography variant="body1" className={classes.address}>
              {establishment.location.address}
            </Typography>
            {!this.props.hideMap ? (
              <Map center={center} markers={markers} zoom={15} />
            ) : null}
          </div>
        </CardContent>
        {this.props.showBookingButton ? (
          <CardActions>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={!isOfferInThePast(offer) || !offer.available}
              onClick={() => this.props.goToOfferPayment(offer.id)}
            >
              Réserver
            </Button>
          </CardActions>
        ) : null}
      </Card>
    );
  }
}

const styles = (theme) => ({
  avatarSubstitute: {
    border: '2px solid black',
    borderColor: colors.primary,
  },
  card: {
    margin: '0 auto',
    minWidth: 200,
  },
  media: {
    maxHeight: 400,
    objectFit: 'cover',
  },
  hashtags: {
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 500,
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit,
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
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    position: 'fixed',
    top: 10,
    left: 10,
    zIndex: 1000,
  },
  cancelIcon: {
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    width: 32,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces([]),
)(MarketPlaceActivity);
