// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import { withNamespaces } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';

import { Link } from 'react-router-dom';

import type { TFunction } from 'react-i18next';
import { Level } from '../category';
import Sport from '../../libs/category/components/SCT.component';
import Avatar from '../Avatar.component';
import RedButton from '../button/RedButton.component';

import { formatAsTime, formatMinutes } from '../../datetime';
import type { Offer } from '../../api/types';

import type { Permission } from '../../libs/role/types';

type Props = {
  t: TFunction,
  classes: Object,
  offer: Offer,
  noHeader: ?boolean,
  onEditButtonClick: () => void,
  onDeleteButtonClick: () => void,
  permission: Permission,
  companyId: number,
  snackbarSuccess: (string) => void,
};

export class OfferCard extends Component<Props> {
  getHeader = () => {
    const { classes, t, offer } = this.props;
    const {
      available,
      name,
      parent_category,
      credit_price_override,
      level,
    } = offer;

    return (
      <Grid
        container
        direction="row"
        wrap="nowrap"
        alignItems="flex-start"
        justify="space-between"
      >
        <div>
          <ListItem className={classes.paddedBlock}>
            <Icon>
              <Sport noname parentCategory={parent_category} />
            </Icon>
            <ListItemText
              primary={name}
              secondary={
                credit_price_override !== 1
                  ? `${credit_price_override} ${t('offer:credit_price')}`
                  : null
              }
            />
            {available ? null : (
              <Typography variant="h2" color="error">
                {t('offer:disabled')}
              </Typography>
            )}
          </ListItem>
        </div>
        <Grid item className={classes.paddedBlock}>
          <Grid container direction="column" alignItems="flex-end" spacing={8}>
            <Grid item>
              <Level levelId={level} />
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
        <Grid
          item
          xs={4}
          className={classNames(classes.rightBorder, classes.stat)}
        >
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
                  component="div"
                  color="primary"
                  noWrap
                  style={{ position: 'absolute', right: -30, top: 0 }}
                >
                  {`/${effectif}`}
                </Typography>
              </Typography>
            </Grid>
            <Grid item>
              <Typography> {t('offer:booking.confirmed')}</Typography>
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
          >
            <Grid item>
              <Typography variant="h3" color="secondary" align="center">
                {parseInt((nb_bookings / effectif) * 100, 10)} %
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{t('offer:booking.fillRate')}</Typography>
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
                  component="div"
                  style={{ position: 'absolute', top: 0, right: -30 }}
                >
                  {`/${waiting_list_max_size}`}
                </Typography>
              </Typography>
            </Grid>
            <Grid item>
              <Typography> {t('offer:booking.waiting')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderEstablishment = () => {
    const { offer, t } = this.props;
    const { establishment, establishment_override } = offer;
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
                  {t('offer:extraordinaryEstablishment')}
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
          <Typography>
            {establishment ? establishment.title : '  -  '}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">
            {establishment ? establishment.location.address : '  -  '}
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
                  {t('offer:substitute')}
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
            <ListItem>
              <AccessTimeIcon />
              <ListItemText variant="h6">
                {`${formatAsTime(date_start)} - ${formatMinutes(
                  duration_minute,
                  t,
                )}`}
              </ListItemText>
            </ListItem>

            <ListItem>
              <LocationOnIcon />
              <ListItemText>{this.renderEstablishment()}</ListItemText>
            </ListItem>

            {offer.id && this.props.companyId ? (
              <ButtonBase
                onClick={() =>
                  this.props.snackbarSuccess(t('offer:card.copied'))
                }
                className={classes.link}
              >
                <LinkIcon />
                <CopyToClipboard
                  text={`${window.location.origin}/customer/payment/offer/${offer.id}?membership=${this.props.companyId}`}
                >
                  <Typography className={classes.linkTypo}>
                    {t('offer:card.copyLink')}
                  </Typography>
                </CopyToClipboard>
              </ButtonBase>
            ) : null}
          </Grid>
          {available ? (
            <Grid
              container
              direction="row"
              spacing={16}
              wrap="nowrap"
              className={classes.modifierButtonsBlock}
            >
              {this.props.permission.offer.edit ? (
                <ListItem>
                  <Button color="primary" onClick={onEditButtonClick}>
                    <EditIcon className={classes.iconLeft} />
                    <Hidden xsDown>{t('offer:calendar.modifyOffer')}</Hidden>
                  </Button>
                </ListItem>
              ) : null}
              {this.props.permission.offer.delete ? (
                <ListItem>
                  <RedButton onClick={onDeleteButtonClick}>
                    <DeleteIcon className={classes.iconLeft} />
                    <Hidden xsDown>{t('offer:calendar.deleteOffer')}</Hidden>
                  </RedButton>
                </ListItem>
              ) : null}
            </Grid>
          ) : null}
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
          <Link style={{ textDecoration: 'none' }} to={`/offer/${offer.id}`}>
            <Button
              color="primary"
              variant="contained"
              className={classes.manageButton}
            >
              {t('offer:manageOffer')}
            </Button>
          </Link>
          {available ? null : (
            <RedButton
              onClick={onDeleteButtonClick}
              variant="contained"
              className={classes.manageButton}
            >
              {t('offer:forms.delete.buttonHardDelete')}
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
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 1,
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
    marginTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  manageButton: {
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  link: {
    marginLeft: theme.spacing.unit,
    padding: theme.spacing.unit,
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    marginLeft: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(
  withNamespaces(['offer', 'datetime'])(OfferCard),
);
