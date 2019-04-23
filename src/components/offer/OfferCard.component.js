// @flow

import React, { Component } from 'react';

import {
  Typography,
  Grid,
  Paper,
  Button,
  withStyles,
  ListItem,
  ListItemText,
  Icon,
  Hidden,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DeleteIcon from '@material-ui/icons/Delete';
import { withNamespaces } from 'react-i18next';

import { Level, Sport } from '../category';
import Avatar from '../Avatar.component';
import RedButton from '../button/RedButton.component';

import { formatAsTime, humanizeDuration } from '../../datetime';
import type { Offer } from '../../api/types';

type Props = {
  t: (x: string) => string,
  classes: Object,
  offer: Offer,
  noHeader: ?boolean,
  onEditButtonClick: () => void,
  onDeleteButtonClick: () => void,
  goToOfferManagement: (offerId: number) => void,
};

export class OfferCard extends Component<Props> {
  getHeader = () => {
    const { classes, t, offer } = this.props;
    const { available, name, level_id, parent_category } = offer;

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
          <ListItemText primary={name} />
          {available ? null : (
            <Typography variant="h2" color="error">
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
    const {
      nb_bookings,
      nb_option,
      waiting_list_max_size,
      effectif,
    } = this.props.offer;
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={4} className={[classes.rightBorder, classes.stat]}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={8}
          >
            <Grid item>
              <Typography
                variant="h3"
                color="primary"
                align="center"
                style={{ position: 'relative' }}
              >
                {nb_bookings}
                <Typography
                  variant="h6"
                  color="primary"
                  noWrap
                  style={{ position: 'absolute', right: -30, top: 0 }}
                >
                  {`/${effectif}`}
                </Typography>
              </Typography>
            </Grid>
            <Grid item>
              <Typography> {t('booking.confirmed')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} className={[classes.rightBorder, classes.stat]}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={8}
          >
            <Grid item>
              <Typography variant="h3" color="secondary" align="center">
                {parseInt((nb_bookings / effectif) * 100, 10)} %
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{t('booking.fillRate')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} className={classes.stat}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={8}
          >
            <Grid item>
              <Typography
                variant="h3"
                color={nb_option ? 'error' : 'secondary'}
                align="center"
                style={{ position: 'relative' }}
              >
                {nb_option}
                <Typography
                  variant="h6"
                  style={{ position: 'absolute', top: 0, right: -30 }}
                >
                  {`/${waiting_list_max_size}`}
                </Typography>
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

  getPracticalInfo = () => {
    const {
      t,
      classes,
      offer,
      onEditButtonClick,
      onDeleteButtonClick,
    } = this.props;
    const {
      available,
      date_start,
      coach,
      coach_override,
      duration_minute,
    } = offer;
    return (
      <Grid
        container
        alignItems="center"
        direction="row"
        className={classes.footer}
      >
        <Grid item xs={4}>
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
        <Grid item xs={8} style={{ borderLeft: '1px solid #EEEEEE' }}>
          <Grid
            container
            spacing={8}
            justify="center"
            alignItems="flex-start"
            direction="column"
            className={classes.info}
          >
            <Grid item>
              <Grid container spacing={16} direction="row" alignItems="center">
                <Grid item>
                  <AccessTimeIcon />
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    {`${formatAsTime(date_start)} - ${humanizeDuration(
                      duration_minute * 60000,
                    )}`}
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
                wrap="nowrap"
              >
                <Grid item>
                  <LocationOnIcon />
                </Grid>
                <Grid item>{this.renderEstablishment()}</Grid>
              </Grid>
            </Grid>
            <Grid item>
              {available ? (
                <Grid
                  container
                  direction="row"
                  spacing={16}
                  wrap="nowrap"
                  className={classes.modifierButtonsBlock}
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
        </Grid>
      </Grid>
    );
  };

  render() {
    const { noHeader, offer, onDeleteButtonClick, classes, t } = this.props;
    const { available } = offer;
    if (offer) {
      return (
        <div style={{ width: '100%' }}>
          <Paper square className={available ? null : classes.disabledPaper}>
            <div>
              {noHeader ? null : this.getHeader()}
              {this.getStatsBody()}
              {this.getPracticalInfo()}
            </div>
          </Paper>
          <Button
            onClick={() => this.props.goToOfferManagement(offer.id)}
            color="primary"
            variant="contained"
            className={classes.manageButton}
          >
            {t('offer.manageOffer')}
          </Button>
          {available ? null : (
            <RedButton
              onClick={onDeleteButtonClick}
              variant="contained"
              className={classes.manageButton}
            >
              {t('form.offer.delete.buttonHardDelete')}
            </RedButton>
          )}
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
  info: {
    paddingLeft: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
  },
  stat: { paddingBottom: 20 },
  rightBorder: {
    borderRight: '1px solid #EEEEEE',
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
  modifierButtonsBlock: {
    marginTop: theme.spacing.unit * 2,
  },
  manageButton: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces()(OfferCard));
