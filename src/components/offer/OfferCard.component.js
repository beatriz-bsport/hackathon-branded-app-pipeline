// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { withTranslation, TFunction } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DateRangeIcon from '@material-ui/icons/DateRange';
import RefreshIcon from '@material-ui/icons/Refresh';
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
import LabelIcon from '@material-ui/icons/Label';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import TimeIcon from '@material-ui/icons/AccessTime';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import MemberMinimalListItem from '../../libs/member/components/MemberMinimalListItem.component';
import Level from '#libs/level/components/Level.component';
import Sport from '../../libs/category/components/SCT.component';
import RedButton from '../button/RedButton.component';
import type { Offer } from '../../api/types';
import { PermissionContext } from '../../context';
import CheckPermission from '../../libs/role/components/CheckPermission.component';
import PaymentPackTagsDialog from '../../libs/payment-packs/components/PaymentPackTagsDialog.component';
import FreeOfferChip from '#libs/offer/components/FreeOfferChip.component';

import { getRecurrenceTrad } from '#libs/group-offer/utils';
import { formatAsDatetimeAdapted, formatAsTime } from '../../utils/datetime';
import OfferIconHybridIndicator from '../../libs/offer/components/OfferHybridIconIndicator.component';
import OfferCardStastitics from '../../libs/offer/components/OfferCardStastistics.compant';

import type { Theme as CompanyTheme } from '#libs/theme/types';

type Props = {
  t: TFunction,
  classes: Object,
  offer: Offer,
  linkedHybridSession?: Offer,
  noHeader: ?boolean,
  onEditButtonClick: () => void,
  onDeleteButtonClick: () => void,
  companyId: number,
  snackbarSuccess: (string) => void,
  members: Array<Member>,
  membersLoading: boolean,
  bookings: Array<Booking>,
  bookingsLoading: boolean,
  goToOfferManagement: (id: number) => void,
  onRestoreButtonClick: () => void,
  showOfferGender?: boolean,
  showVaccinationStatus: boolean,
  onModifyTags?: (offer: Offer) => void,
  companyTheme?: CompanyTheme,
};

type State = {
  tagManagementDialog: Boolean,
};

export class OfferCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tagManagementDialog: false,
    };
  }

  getHeader = () => {
    const { classes, t, offer, companyTheme } = this.props;
    const {
      available,
      name,
      parent_category,
      credit_price,
      credit_price_override,
      customLevel,
      meta_activity,
      linked_hybrid_offer_id,
    } = offer;

    return (
      <div className={classes.header}>
        <ListItem>
          <ListItemIcon>
            <Sport
              noname
              parentCategory={parent_category || meta_activity?.parent_category}
            />
          </ListItemIcon>
          <ListItemText
            primary={name || meta_activity?.name}
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
          <div className={classes.levelAndHybridRow}>
            {linked_hybrid_offer_id && (
              <OfferIconHybridIndicator iconProps={{ fontSize: 'large' }} />
            )}
            <FreeOfferChip
              credits={credit_price}
              creditsOverride={credit_price_override}
              companyTheme={companyTheme}
              size="large"
            />
            <Level customLevel={customLevel} />
          </div>
        </ListItem>
      </div>
    );
  };

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
              <PermissionContext.Consumer>
                {(permissions) => (
                  <List dense>
                    {this.props.bookings
                      .filter((b) => b.booking_status_code === 0)
                      .map((b) => (
                        <MemberMinimalListItem
                          anonimize={!permissions?.member?.search}
                          firstBooking={b.first_in_company}
                          member={this.props.members.find(
                            (m) => m.id === b.member,
                          )}
                          key={b.id}
                          showVaccinationStatus={
                            this.props.showVaccinationStatus
                          }
                          bottomCredit
                        />
                      ))}
                  </List>
                )}
              </PermissionContext.Consumer>
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
          <PaymentPackTagsDialog
            open={this.state.tagManagementDialog}
            whitelistTags={offer.whitelist_tags}
            blacklistTags={offer.blacklist_tags}
            onClose={() => this.setState({ tagManagementDialog: false })}
            onModify={() => {
              this.setState({ tagManagementDialog: false });
              this.props.onModifyTags(offer);
            }}
          />
          <Paper square className={available ? null : classes.disabledPaper}>
            {noHeader ? null : this.getHeader()}
            <OfferCardStastitics
              offer={this.props.offer}
              linkedHybridSession={this.props.linkedHybridSession}
              bookings={this.props.bookings}
              showOfferGender={this.props.showOfferGender}
            />
            <Divider />
            <div className={classes.row}>
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={formatAsTime(offer.date_start, offer.timezone_name)}
                  secondary={formatAsDatetimeAdapted(
                    offer.date_start,
                    'LL',
                    offer.timezone_name,
                  )}
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
            {offer?.group && (
              <div className={classes.row}>
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={offer.group?.name} />
                </ListItem>
              </div>
            )}
            {offer?.group &&
              Object.keys(offer.group?.recurrence_rule ?? {}).length > 0 && (
                <>
                  <div className={classes.row}>
                    <ListItem>
                      <ListItemIcon>
                        <DateRangeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('offer:recurrenceIndex', {
                          index: offer.group?.recurrence_index + 1 ?? 1,
                        })}
                      />
                    </ListItem>
                  </div>
                  <div className={classes.row}>
                    <ListItem>
                      <ListItemIcon>
                        <RefreshIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={getRecurrenceTrad(
                          offer.group?.recurrence_rule,
                          t,
                        )}
                      />
                    </ListItem>
                  </div>
                </>
              )}

            {(offer?.whitelist_tags?.length > 0 ||
              offer?.blacklist_tags?.length > 0) && (
              <div>
                <ListItem>
                  <ListItemIcon>
                    <LabelIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('offer:tagManagementInfo', {
                      authorized: offer.whitelist_tags?.length || 0,
                      unauthorized: offer.blacklist_tags?.length || 0,
                    })}
                  />
                  <IconButton
                    disableRipple
                    onClick={() => {
                      this.setState({ tagManagementDialog: true });
                    }}
                  >
                    <VisibilityIcon color="primary" />
                  </IconButton>
                </ListItem>
              </div>
            )}
            <Divider />
            {available ? (
              <div>
                <div className={this.props.classes.bottomBlock}>
                  <div className={this.props.classes.buttonContainer}>
                    <CheckPermission requiredPermissions="offer.edit">
                      <div className={this.props.classes.button}>
                        <Button color="primary" onClick={onEditButtonClick}>
                          <EditIcon className={classes.iconLeft} />
                          <Hidden xsDown>
                            {t('offer:calendar.modifyOffer')}
                          </Hidden>
                        </Button>
                      </div>
                    </CheckPermission>

                    <CheckPermission requiredPermissions="offer.delete">
                      <div className={this.props.classes.button}>
                        <RedButton onClick={onDeleteButtonClick}>
                          <DeleteIcon className={classes.iconLeft} />
                          <Hidden xsDown>
                            {t('offer:calendar.deleteOffer')}
                          </Hidden>
                        </RedButton>
                      </div>
                    </CheckPermission>
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
  levelAndHybridRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['offer', 'datetime']),
)(OfferCard);
