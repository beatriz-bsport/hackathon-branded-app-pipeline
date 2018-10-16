// @flow

import React, { Component } from 'react';

import {
  Typography,
  Grid,
  Paper,
  Button,
  withStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  CircularProgress,
  ListItem,
  ListItemText,
  Icon,
  List,
  Hidden,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { translate } from 'react-i18next';

import Level from './Level.component';
import Sport from './Sport.component';
import Avatar from './Avatar.component';
import BookingTable from './booking/BookingTable.component';
import PaymentPackSummary from './consumer/PaymentPackSummary.component';
import RedButton from './button/RedButton.component';

import { formatAsTime } from '../datetime';
import type { Offer, PaymentPack } from '../api/types';

type Props = {
  t: (x: string) => string,
  classes: Object,
  offer: Offer,
  bookingLoading: boolean,
  noHeader: ?boolean,
  validatedBookings: Array<Object>,
  pendingBookings: Array<Object>,
  bookingOptions: Array<Object>,
  discardOption: (id: number) => void,
  onEditButtonClick: () => void,
  onDeleteButtonClick: () => void,
  compatiblePacks: Array<PaymentPack>,
  compatiblePacksLoading: boolean,
  bookingUpdaters: {
    discardBooking: (id: number) => void,
    discardBookingAttendance: (id: number) => void,
    confirmBooking: (id: number) => void,
    confirmBookingAttendance: (id: number) => void,
  },
};

export class OfferCard extends Component<Props> {
  getHeader = () => {
    const { classes, t, offer } = this.props;
    const {
      available,
      name,
      level_id,
      parent_category,
      price,
      credit_price,
    } = offer;
    const formattedPrice = `${price}€ - ${credit_price} ${t(
      'common.credit_s',
    ).toLowerCase()}`;

    return (
      <Grid
        container
        direction="row"
        wrap="nowrap"
        alignItems="flex-start"
        justify="space-between"
      >
        <ListItem className={classes.paddedBlock}>
          <Icon>
            <Sport noname parentCategory={parent_category} />
          </Icon>
          <ListItemText primary={name} secondary={formattedPrice} />
          {available ? null : (
            <Typography variant="title" color="error">
              {t('offer.disabled')}
            </Typography>
          )}
        </ListItem>
        <Grid item className={classes.paddedBlock}>
          <Grid container direction="column" alignItems="flex-end" spacing={8}>
            <Grid item>
              <Level levelId={level_id} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  getStatsBody = () => {
    const { classes, t } = this.props;
    const { nb_validated, nb_option, effectif } = this.props.offer;
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={4} style={{ borderRight: '1px solid #EEEEEE' }}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={8}
            className={classes.stat}
          >
            <Grid item>
              <Typography variant="display2" color="primary">
                {nb_validated}
              </Typography>
            </Grid>
            <Grid item>
              <Typography> {t('booking.confirmed')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} style={{ borderRight: '1px solid #EEEEEE' }}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={8}
            className={classes.stat}
          >
            <Grid item>
              <Typography variant="display2" color="secondary">
                {parseInt((nb_validated / effectif) * 100, 10)} %
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{t('booking.fillRate')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={8}
            className={classes.stat}
          >
            <Grid item>
              <Typography
                variant="display2"
                color={nb_option ? 'error' : 'secondary'}
              >
                {nb_option}
              </Typography>
            </Grid>
            <Grid item>
              <Typography> {t('booking.waiting')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderEstablishment = () => {
    const { offer, t } = this.props;
    const { etablissement, establishment_override } = offer;
    if (establishment_override) {
      return (
        <Grid container direction="column">
          <Grid item>
            <Grid container direction="row" spacing={16} alignItems="center">
              <Grid item>
                <Typography>{establishment_override.title}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption">
                  {t('offer.extraordinaryEstablishment')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {establishment_override.location.address}
            </Typography>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography>{etablissement.title}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">
            {etablissement.location.address}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  getFooter = () => {
    const {
      t,
      classes,
      offer,
      onEditButtonClick,
      onDeleteButtonClick,
    } = this.props;
    const { available, date_start, coach, coach_override } = offer;
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="row"
        className={classes.footer}
      >
        <Grid
          item
          xs={4}
          style={{ borderRight: '1px solid #EEEEEE' }}
          className={classes.stat}
        >
          <Grid container direction="column" spacing={8} alignItems="center">
            <Grid item>
              <Avatar user={coach_override || coach} />
            </Grid>
            <Grid item>
              {coach_override ? (
                <Typography variant="caption">
                  {t('offer.substitute')}
                </Typography>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8} className={classes.stat}>
          <Grid
            container
            spacing={8}
            justify="center"
            alignItems="flex-start"
            direction="column"
            className={classes.info}
          >
            <Grid item>
              <Grid container direction="column" spacing={8}>
                <Grid item>
                  <Grid
                    container
                    spacing={16}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item>
                      <AccessTimeIcon />
                    </Grid>
                    <Grid item>
                      <Typography variant="title">
                        {formatAsTime(date_start)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    spacing={16}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item>
                      <LocationOnIcon />
                    </Grid>
                    <Grid item>{this.renderEstablishment()}</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {available ? (
            <Grid
              container
              direction="row"
              spacing={24}
              wrap="nowrap"
              justify="center"
            >
              <Grid item>
                <Button color="primary" onClick={onEditButtonClick}>
                  <EditIcon className={classes.iconLeft} />
                  <Hidden xsDown>{t('calendar.modifyOffer')}</Hidden>
                </Button>
              </Grid>
              <Grid item>
                <RedButton onClick={onDeleteButtonClick}>
                  <DeleteIcon className={classes.iconLeft} />
                  <Hidden xsDown>{t('calendar.deleteOffer')}</Hidden>
                </RedButton>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    );
  };

  getCustomer = () => {
    const {
      t,
      pendingBookings,
      validatedBookings,
      bookingOptions,
      bookingLoading,
      discardOption,
      bookingUpdaters,
      classes,
      offer,
    } = this.props;
    const { available } = offer;

    return (
      <Grid container>
        <Grid item xs={12}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              className={available ? null : classes.disabledPaper}
            >
              <Typography>{t('booking.seeCustomers')}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              className={available ? null : classes.disabledPaper}
            >
              <BookingTable
                loading={bookingLoading}
                validatedBookings={validatedBookings}
                pendingBookings={pendingBookings}
                bookingOptions={bookingOptions}
                discardOption={discardOption}
                bookingUpdaters={bookingUpdaters}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    );
  };

  renderPaymentPackList = () => {
    const { t, compatiblePacks } = this.props;

    if (compatiblePacks.length === 0) {
      return (
        <Typography variant="caption">
          {t('offer.noCompatiblePacks')}
        </Typography>
      );
    }
    return (
      <List dense disablePadding style={{ width: '100%' }}>
        {compatiblePacks.map((cp) => (
          <PaymentPackSummary paymentPack={cp} key={cp.id} />
        ))}
      </List>
    );
  };

  getCompatiblePacks = () => {
    const { t, classes, offer, compatiblePacksLoading } = this.props;
    const { available } = offer;

    return (
      <Grid container>
        <Grid item xs={12}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              className={available ? null : classes.disabledPaper}
            >
              <Typography>{t('offer.compatiblePacks')}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              className={available ? null : classes.disabledPaper}
            >
              {compatiblePacksLoading ? (
                <CircularProgress />
              ) : (
                this.renderPaymentPackList()
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { noHeader, offer, classes } = this.props;
    const { available } = offer;
    if (offer) {
      return (
        <div>
          <Grid container direction="column">
            <Grid item>
              <Paper
                square
                className={available ? null : classes.disabledPaper}
              >
                <Grid container direction="column">
                  {noHeader ? null : <Grid item>{this.getHeader()}</Grid>}
                  <Grid item>{this.getStatsBody()}</Grid>
                  <Grid item>{this.getFooter()}</Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              {this.getCustomer()}
            </Grid>
            <Grid item xs={12}>
              {this.getCompatiblePacks()}
            </Grid>
          </Grid>
        </div>
      );
    }
    return null;
  }
}

const styles = (theme) => ({
  paddedBlock: {
    padding: theme.spacing.unit * 4,
  },
  footer: {
    borderTop: 'solid 1px #EEEEEE',
    borderBottom: 'solid 1px #EEEEEE',
  },
  stat: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  info: {
    paddingLeft: theme.spacing.unit * 3,
  },
  editButtonContainer: {
    margin: theme.spacing.unit * 2,
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
  },
  disabledPaper: {
    backgroundColor: '#F6F6F6',
  },
});

export default withStyles(styles)(translate()(OfferCard));
