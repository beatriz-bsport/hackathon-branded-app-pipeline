// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import { withTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import TimeIcon from '@material-ui/icons/AccessTime';
import moment from 'moment-timezone';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Link } from 'react-router-dom';
import type { TFunction } from 'react-i18next';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import MemberMinimalListItem from '../../libs/member/components/MemberMinimalListItem.component';

import { Level } from '../category';
import Sport from '../../libs/category/components/SCT.component';
import RedButton from '../button/RedButton.component';

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
  members: Array<Member>,
  membersLoading: boolean,
  bookings: Array<Booking>,
  bookingsLoading: boolean,
  goToOfferManagement: (id: number) => void,
  onRestoreButtonClick: () => void,
  showOfferGender?: boolean,
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
      <div className={classes.header}>
        <ListItem>
          <ListItemIcon>
            <Sport noname parentCategory={parent_category} />
          </ListItemIcon>
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
        <Level levelId={level} />
      </div>
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
      <div className={classes.statContainer}>
        <div className={classNames(classes.rightBorder, classes.stat)}>
          <div>
            <Typography variant="h3" color="primary" align="center">
              {nb_bookings}
              {`/${effectif}`}
            </Typography>
          </div>
          {this.props.showOfferGender ? (
            <Typography
              variant="caption"
              align="center"
              className={classes.statName}
            >
              {t('offer:booking.confirmed')}
              {' '}(&#9792;{this.props.offer.female}{`/${this.props.offer.male}`}&#9794;{'+'}{this.props.offer.other})
            </Typography>
          ) : (
            <Typography
              variant="caption"
              align="center"
              className={classes.statName}
            >
              {' '}
              {t('offer:booking.confirmed')}
            </Typography>
          )}
        </div>
        <div className={classNames(classes.rightBorder, classes.stat)}>
          <Typography variant="h3" color="secondary" align="center">
            {parseInt((nb_bookings / effectif) * 100, 10)} %
          </Typography>
          <Typography
            align="center"
            variant="caption"
            className={classes.statName}
          >
            {t('offer:booking.fillRate')}
          </Typography>
        </div>
        <div className={classes.stat}>
          <Typography
            variant="h3"
            color={nb_option ? 'error' : 'secondary'}
            align="center"
          >
            {nb_option}
            {`/${waiting_list_max_size}`}
          </Typography>
          <Typography
            variant="caption"
            align="center"
            className={classes.statName}
          >
            {' '}
            {t('offer:booking.waiting')}
          </Typography>
        </div>
      </div>
    );
  };

  renderEstablishment = () => {
    const { offer, t } = this.props;
    const { establishment, establishment_override } = offer;
    if (establishment_override) {
      return (
        <Grid container direction="column">
          <Grid item>
            <Grid container direction="row" spacing={2} alignItems="center">
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
              {establishment_override && establishment_override.location
                ? establishment_override.location.address
                : ' - '}
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
            {establishment && establishment.location
              ? establishment.location.address
              : '  -  '}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  // getPracticalInfo = () => {
  //   const {
  //     t,
  //     classes,
  //     offer,
  //     onEditButtonClick,
  //     onDeleteButtonClick,
  //   } = this.props;
  //   const {
  //     available,
  //     date_start,
  //     coach,
  //     coach_override,
  //     duration_minute,
  //   } = offer;
  //   return (
  //     <Grid
  //       container
  //       alignItems="center"
  //       direction="row"
  //       className={classes.footer}
  //     >
  //       <Grid item xs={4}>
  //         <Grid container direction="column" spacing={1} alignItems="center">
  //           <Grid item>
  //             <Avatar user={coach_override || coach} />
  //           </Grid>
  //           <Grid item>
  //             {coach_override ? (
  //               <Typography variant="caption">
  //                 {t('offer:substitute')}
  //               </Typography>
  //             ) : null}
  //           </Grid>
  //         </Grid>
  //       </Grid>
  //       <Grid item xs={8} style={{ borderLeft: '1px solid #EEEEEE' }}>
  //         <Grid
  //           container
  //           spacing={1}
  //           justify="center"
  //           alignItems="flex-start"
  //           direction="column"
  //           className={classes.info}
  //         >
  //           <ListItem>
  //             <ListItemIcon>
  //               <AccessTimeIcon />
  //             </ListItemIcon>
  //             <ListItemText variant="h6">
  //               {`${formatAsTime(date_start)} - ${formatMinutes(
  //                 duration_minute,
  //                 t,
  //               )}`}
  //             </ListItemText>
  //           </ListItem>

  //           <ListItem>
  //             <ListItemIcon>
  //               <LocationOnIcon />
  //             </ListItemIcon>
  //             <ListItemText>{this.renderEstablishment()}</ListItemText>
  //           </ListItem>

  //           {offer.id && this.props.companyId ? (
  //             <ButtonBase
  //               onClick={() => this.props.snackbarSuccess('link.copied')}
  //               className={classes.link}
  //             >
  //               <LinkIcon />
  //               <CopyToClipboard
  // eslint-disable-next-line
  //                 text={`${window.location.origin}/customer/payment/offer/${offer.id}?membership=${this.props.companyId}`}
  //               >
  //                 <Typography className={classes.linkTypo}>
  //                   {t('offer:card.copyLink')}
  //                 </Typography>
  //               </CopyToClipboard>
  //             </ButtonBase>
  //           ) : null}
  //         </Grid>
  //         {available ? (
  //           <Grid
  //             container
  //             direction="row"
  //             spacing={2}
  //             wrap="nowrap"
  //             className={classes.modifierButtonsBlock}
  //           >
  //             {this.props.permission.offer.edit ? (
  //               <ListItem>
  //                 <Button color="primary" onClick={onEditButtonClick}>
  //                   <EditIcon className={classes.iconLeft} />
  //                   <Hidden xsDown>{t('offer:calendar.modifyOffer')}</Hidden>
  //                 </Button>
  //               </ListItem>
  //             ) : null}
  //             {this.props.permission.offer.delete ? (
  //               <ListItem>
  //                 <RedButton onClick={onDeleteButtonClick}>
  //                   <DeleteIcon className={classes.iconLeft} />
  //                   <Hidden xsDown>{t('offer:calendar.deleteOffer')}</Hidden>
  //                 </RedButton>
  //               </ListItem>
  //             ) : null}
  //           </Grid>
  //         ) : null}
  //       </Grid>
  //     </Grid>
  //   );
  // };

  renderBookingList = () => {
    const { t, classes } = this.props;
    if (this.props.bookingsLoading || this.props.membersLoading) {
      return (
        <div>
          <Typography className={this.props.classes.bookingListTitle}>
            {t('offer:bookingList')}
          </Typography>
          <Divider />
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        </div>
      );
    }
    return (
      <div>
        <Typography className={this.props.classes.bookingListTitle}>
          {t('offer:bookingList')}
        </Typography>
        <Divider />
        <div className={classes.bookingList}>
          {this.props.bookings.length > 0 ? (
            <ButtonBase
              onClick={() =>
                this.props.goToOfferManagement(this.props.offer.id)
              }
              className={this.props.classes.listButtonBase}
            >
              <List dense>
                {this.props.bookings
                  .filter((b) => b.booking_status_code === 0)
                  .map((b) => (
                    <MemberMinimalListItem
                      anonimize={!this.props.permission.member.search}
                      firstBooking={b.first_in_company}
                      member={this.props.members.find((m) => m.id === b.member)}
                      key={b.id}
                    />
                  ))}
              </List>
            </ButtonBase>
          ) : (
            <div className={this.props.classes.noBookings}>
              <Typography variant="caption" align="left">
                {t('offer:bookingListEmpty')}
              </Typography>
            </div>
          )}
        </div>
        <Divider />
      </div>
    );
  };

  render() {
    const {
      noHeader,
      offer,
      onDeleteButtonClick,
      classes,
      t,
      onEditButtonClick,
    } = this.props;
    const { available } = offer;
    if (offer) {
      const coach = offer.coach_override || offer.coach || null;
      return (
        <div style={{ width: '100%' }}>
          <Paper square className={available ? null : classes.disabledPaper}>
            {noHeader ? null : this.getHeader()}
            {this.getStatsBody()}
            <Divider />
            <div className={classes.row}>
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={moment(offer.date_start)
                    .tz(offer.timezone_name)
                    .format('LT')}
                  secondary={moment(offer.date_start)
                    .tz(offer.timezone_name)
                    .format('LL')}
                />
              </ListItem>
            </div>
            {!!coach && (
              <div className={classes.row}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={coach.photo} />{' '}
                  </ListItemAvatar>
                  <ListItemText primary={coach.name} />
                </ListItem>
              </div>
            )}
            {!!offer.establishment && (
              <div className={classes.row}>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      offer.establishment ? offer.establishment.title : '  -  '
                    }
                    secondary={
                      offer.establishment && offer.establishment.location
                        ? offer.establishment.location.address
                        : '  -  '
                    }
                  />
                </ListItem>
              </div>
            )}
            <Divider />
            {available ? (
              <div>
                <div className={this.props.classes.bottomBlock}>
                  <div className={this.props.classes.buttonContainer}>
                    {this.props.permission.offer.edit ? (
                      <div className={this.props.classes.button}>
                        <Button color="primary" onClick={onEditButtonClick}>
                          <EditIcon className={classes.iconLeft} />
                          <Hidden xsDown>
                            {t('offer:calendar.modifyOffer')}
                          </Hidden>
                        </Button>
                      </div>
                    ) : null}
                    {this.props.permission.offer.delete ? (
                      <div className={this.props.classes.button}>
                        <RedButton onClick={onDeleteButtonClick}>
                          <DeleteIcon className={classes.iconLeft} />
                          <Hidden xsDown>
                            {t('offer:calendar.deleteOffer')}
                          </Hidden>
                        </RedButton>
                      </div>
                    ) : null}
                  </div>
                  {offer.id && this.props.companyId ? (
                    <div className={this.props.classes.buttonContainer}>
                      <CopyToClipboard
                        text={`${window.location.origin}/customer/payment/offer/${offer.id}?membership=${this.props.companyId}`}
                      >
                        <ButtonBase
                          onClick={() =>
                            this.props.snackbarSuccess('link.copied')
                          }
                          className={classes.link}
                        >
                          <LinkIcon />
                          <Hidden xsDown>
                            <Typography
                              variant="caption"
                              align="left"
                              className={classes.linkTypo}
                            >
                              {t('offer:card.copyLink')}
                            </Typography>
                          </Hidden>
                        </ButtonBase>
                      </CopyToClipboard>
                    </div>
                  ) : null}
                </div>
                {this.renderBookingList()}
              </div>
            ) : null}
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
          {!available && (
            <>
              <Button
                color="secondary"
                variant="contained"
                className={classes.manageButton}
                onClick={this.props.onRestoreButtonClick}
              >
                {t('offer:restoreOffer')}
              </Button>
              <RedButton
                onClick={onDeleteButtonClick}
                variant="contained"
                className={classes.manageButton}
              >
                {t('offer:forms.delete.buttonHardDelete')}
              </RedButton>
            </>
          )}
        </div>
      );
    }
    return null;
  }
}

const styles = (theme) => ({
  paddedBlock: {
    padding: theme.spacing(4),
  },
  footer: {
    borderTop: 'solid 1px #EEEEEE',
    borderBottom: 'solid 1px #EEEEEE',
  },
  bookingList: {
    backgroundColor: '#F8F8F8',
  },
  info: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1) * 1,
  },
  stat: {
    flex: 3,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightBorder: {
    borderRight: '1px solid #EEEEEE',
  },
  statContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderTop: '1px solid #EEEEEE',
  },
  editButtonContainer: {
    margin: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  disabledPaper: {
    backgroundColor: '#F6F6F6',
  },
  modifierButtonsBlock: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  manageButton: {
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  link: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    marginLeft: theme.spacing(2),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
  },
  bookingListTitle: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  bottomBlock: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: theme.spacing(2),
  },
  noBookings: {
    padding: theme.spacing(2), // : theme.spacing(2),
  },
  listButtonBase: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    width: '100%',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['offer', 'datetime']),
)(OfferCard);
