// @flow

import React from 'react';

import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
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
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { colors } from '@bsport/common/lib/colors';

import FACEBOOK_PNG from '../../../public/images/facebook.png';
import INSTAGRAM_PNG from '../../../public/images/instagram.png';

import Map from '../../../components/map/Map.component';
import TypographyMultiline from '../../../components/TypographyMultiline.component';

import { isOfferInThePast } from '../utils';
import { formatMinutes } from '../../../utils/datetime';

type Props = {
  offer: Offer,
  showBookingButton: ?boolean,
  goToOfferPayment: (offer: Offer) => void,
  hideCoach: boolean,
  hideMap: ?boolean,

  onClose: () => void,

  t: TFunction,
  classes: Object,
  mapContainerClassName?: string,
};

export class MarketPlaceActivity extends React.Component<Props> {
  getSocialLink = (url: string) => {
    if (url && !url.toLowerCase().includes('http')) {
      return `http://${url}`;
    }
    return url;
  };

  showSocialLink = (coach: any) => {
    const facebook_url = this.getSocialLink(coach.facebook_url);
    const instagram_url = this.getSocialLink(coach.instagram_url);
    if (coach.facebook_url || coach.instagram_url) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {coach.facebook_url && (
            <a className={this.props.classes.rightIcon} href={facebook_url}>
              <Icon color="primary">
                <img
                  style={{ height: 24, width: 24 }}
                  src={FACEBOOK_PNG}
                  alt="Facebook"
                />
              </Icon>
            </a>
          )}
          {coach.instagram_url && (
            <a className={this.props.classes.rightIcon} href={instagram_url}>
              <Icon color="primary">
                <img
                  style={{ height: 24, width: 24 }}
                  src={INSTAGRAM_PNG}
                  alt="Instagram"
                />
              </Icon>
            </a>
          )}
        </div>
      );
    }
    return null;
  };

  renderCoachBanner = () => {
    const { offer, classes, t } = this.props;
    if (this.props.hideCoach) {
      return null;
    }
    if (offer && offer.coach) {
      return (
        <div>
          <Typography variant="h6" className={classes.title}>
            {t('marketplace.teacher')}
          </Typography>
          {offer.coach_override ? (
            <div className={classes.coachBox}>
              <Avatar
                src={offer.coach_override.photo}
                className={classes.avatarSubstitute}
              />
              <div className={classes.coachInformations}>
                <div className={classes.coachContain}>
                  <ListItemText
                    primary={offer.coach_override.name}
                    secondary={t('marketplace.substitute')}
                  />
                  {this.showSocialLink(offer.coach_override)}
                </div>
                {offer.coach_override.description ? (
                  <TypographyMultiline
                    color="textSecondary"
                    variant="body1"
                    className={classes.coachDescription}
                  >
                    {offer.coach_override.description}
                  </TypographyMultiline>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className={classes.coachBox}>
            <Avatar src={offer.coach.photo} />
            <div className={classes.coachInformations}>
              <div className={classes.coachContain}>
                <ListItemText
                  primary={offer.coach.name}
                  secondary={
                    offer.coach_override ? t('marketplace.substituted') : null
                  }
                />
                {this.showSocialLink(offer.coach)}
              </div>
              {offer.coach_override ? null : (
                <TypographyMultiline
                  color="textSecondary"
                  variant="body1"
                  className={classes.multiline}
                >
                  {offer.coach.description}
                </TypographyMultiline>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  render() {
    const { offer, classes, onClose, t } = this.props;
    if (
      typeof offer.establishment === 'number' ||
      typeof offer.coach === 'number' ||
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
    const establishment = offer.establishment_override || offer.establishment;
    const { location } = establishment || { location: null };
    const center = location ? [location.latitude, location.longitude] : null;
    const markers = location ? [establishment] : [];
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
          src={offer.meta_activity.cover_main}
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
              onClick={() => {
                this.props.goToOfferPayment(offer);
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            >
              {t('marketplace.bookButton.book')}
            </Button>
          ) : null}
          <div>
            <Typography variant="body2" className={classes.hashtags}>
              {/* {activity.hashtags} */}
            </Typography>
            <Typography variant="h6" className={classes.title}>
              {offer.meta_activity.name}
            </Typography>
            <TypographyMultiline color="textSecondary" variant="body2">
              {offer.meta_activity.description}
            </TypographyMultiline>
            <Typography variant="h6" className={classes.title}>
              {t('metaActivity:settings.conditions')}
            </Typography>
            <Typography variant="caption" component="h4">
              {t('metaActivity:settings.lastDiscardBeforeMinutes', {
                m: formatMinutes(offer.meta_activity.last_discard_minutes, t),
              })}
            </Typography>
            {this.renderCoachBanner()}
            <Typography variant="h6" className={classes.title}>
              {establishment.title}
            </Typography>
            <Typography variant="body2" className={classes.address}>
              {establishment.location.address}
            </Typography>
            {!this.props.hideMap ? (
              <Map
                center={center}
                markers={markers}
                zoom={15}
                mapContainerClassName={this.props.mapContainerClassName}
              />
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
              onClick={() => {
                this.props.goToOfferPayment(offer);
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            >
              {t('marketplace.bookButton.book')}
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
  coachBox: {
    paddingLeft: '16px',
    paddingRight: '16px',
    display: 'flex',
    paddingTop: '11px',
    paddingBottom: '11px',
  },
  coachList: {
    alignItems: 'flex-start',
  },
  coachInformations: {
    paddingLeft: '16px',
    width: '100%',
  },
  coachContain: {
    display: 'flex',
    alignItems: 'center',
  },
  rightInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
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
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
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
    overflowY: 'auto',
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
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['translation', 'datetime']),
)(MarketPlaceActivity);
