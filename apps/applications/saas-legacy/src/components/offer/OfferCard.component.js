// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { withTranslation, TFunction } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
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
import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { BOOKING_SOURCE_MIGRATION } from '@bsport/common/lib/master-data/booking_source.js';

import { Alert, AlertTitle } from '@material-ui/lab';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import {
  getDeletePermission,
  getEditPermission,
  getCreatePermission,
} from '#src/libs/offer/utils';
import FreeOfferChip from '#src/libs/offer/components/FreeOfferChip.component';
import { getRecurrenceTrad } from '#src/libs/group-offer/utils';
import MemberMinimalListItem from '../../libs/member/components/MemberMinimalListItem.component';
import Sport from '../../libs/category/components/SCT.component';
import RedButton from '../button/RedButton.component';
import PaymentPackTagsDialog from '../../libs/payment-packs/components/PaymentPackTagsDialog.component';

import OfferIconHybridIndicator from '../../libs/offer/components/OfferHybridIconIndicator.component';
import OfferCardStastiticsContainer from '../../libs/offer/components/OfferCardStastisticsContainer.component';
import OfferDetail from './OfferDetail.component';
import OfferDuplicateDialog from './OfferDuplicateDialog.container';
import { getCreditsDividedValue } from '#src/libs/theme/utils';

type Props = {
  t: TFunction,
  classes: Object,
  offer: Offer,
  linkedHybridSession?: Offer,
  noHeader?: boolean,
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
  onModifyTags?: (offer: Offer) => void,
  companyTheme?: CompanyTheme,
  onRefreshOffers?: () => void,
};

type State = {
  tagManagementDialog: Boolean,
};

export class OfferCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tagManagementDialog: false,
      duplicateDialog: false,
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
      meta_activity,
      linked_hybrid_offer_id,
      name_override,
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
            primary={name_override || name || meta_activity?.name}
            secondary={
              <div className={classes.nameAndCredits}>
                {name_override && (
                  <Typography component="span" variant="body2">
                    {meta_activity?.name && `${meta_activity.name}`}
                  </Typography>
                )}
                <Typography component="span" variant="body2">
                  {`${getCreditsDividedValue(credit_price_override)} ${t(
                    'offer:credit_price',
                  )}`}
                </Typography>
              </div>
            }
          />
          {available ? null : (
            <Typography color="error" variant="h2">
              {t('offer:disabled')}
            </Typography>
          )}
          <div className={classes.levelAndHybridRow}>
            {linked_hybrid_offer_id && (
              <OfferIconHybridIndicator iconProps={{ fontSize: 'large' }} />
            )}
            <FreeOfferChip
              companyTheme={companyTheme}
              credits={credit_price}
              creditsOverride={credit_price_override}
              size="large"
            />
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
              className={this.props.classes.listButtonBase}
              onClick={() =>
                this.props.goToOfferManagement(this.props.offer.id)
              }
            >
              <List dense>
                {this.props.bookings
                  .filter((b) => b.booking_status_code === 0)
                  .map((b) => (
                    <MemberMinimalListItem
                      key={b.id}
                      bottomCredit
                      firstBooking={b.first_in_company}
                      member={this.props.members.find((m) => m.id === b.member)}
                    />
                  ))}
              </List>
            </ButtonBase>
          ) : (
            <div className={this.props.classes.noBookings}>
              <Typography align="left" variant="caption">
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
      companyTheme,
    } = this.props;

    const spiviErrorOnBooking =
      !!this.props.bookings &&
      this.props.bookings.some((booking) => booking.has_spivi_error);

    const { available } = offer;

    // For grouped sessions, there is a specific mechanism for duplication
    // that is accessible from the grouped sessions page.
    const canBeDuplicated =
      !offer.group &&
      !!offer.meta_activity?.customer_enabled &&
      offer.coach?.disabled !== true &&
      offer.establishment?.disabled !== true;

    if (offer) {
      return (
        <ObjectLevelPermissionProvider
          requiredPermission={[
            'session.activity.allowed_actions.edit',
            'session.activity.allowed_actions.delete',
            'session.activity.allowed_actions.create',
            'session.workshop.allowed_actions.edit',
            'session.workshop.allowed_actions.delete',
            'session.workshop.allowed_actions.create',
          ]}
        >
          {([
            hasEditActivityPermission,
            hasDeleteActivityPermission,
            hasCreateActivityPermission,
            hasEditWorkshopPermission,
            hasDeleteWorkshopPermission,
            hasCreateWorkshopPermission,
          ]: boolean[]) => (
            <div style={{ width: '100%' }}>
              <PaymentPackTagsDialog
                blacklistTags={offer.blacklist_tags}
                onClose={() => this.setState({ tagManagementDialog: false })}
                onModify={() => {
                  this.setState({ tagManagementDialog: false });
                  this.props.onModifyTags(offer);
                }}
                open={this.state.tagManagementDialog}
                whitelistTags={offer.whitelist_tags}
              />
              <OfferDuplicateDialog
                offer={offer}
                onClose={() => this.setState({ duplicateDialog: false })}
                onDuplicate={() => {
                  this.setState({ duplicateDialog: false });
                  this.props?.onRefreshOffers();
                }}
                open={this.state.duplicateDialog}
              />
              <Paper
                square
                className={available ? null : classes.disabledPaper}
              >
                {noHeader ? null : this.getHeader()}
                <OfferCardStastiticsContainer
                  bookings={this.props.bookings}
                  linkedHybridSession={this.props.linkedHybridSession}
                  offer={this.props.offer}
                  showOfferGender={this.props.showOfferGender}
                />
                {offer?.source === BOOKING_SOURCE_MIGRATION.id && (
                  <ListItem className={classes.migrationAlertListItem}>
                    <Alert severity="info">
                      {t('offer:booking.comesFromMigration')}
                    </Alert>
                  </ListItem>
                )}
                <div className={classes.offerDetailContainer}>
                  <OfferDetail
                    coachDisplay={companyTheme.coach_display}
                    offer={offer}
                  />
                </div>

                {offer?.group &&
                  Object.keys(offer.group?.recurrence_rule ?? {}).length >
                    0 && (
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
                {(offer.has_spivi_error || spiviErrorOnBooking) &&
                  offer.available && (
                    <Alert
                      className={classes.alertSpiviContainer}
                      severity="warning"
                    >
                      <AlertTitle>
                        {t('offer:calendar.alertSpivi.title')}
                      </AlertTitle>
                      <ul className={classes.list}>
                        {offer.has_spivi_error && (
                          <li>{t('offer:calendar.alertSpivi.textOffer')}</li>
                        )}
                        {spiviErrorOnBooking && (
                          <li>{t('offer:calendar.alertSpivi.textBooking')}</li>
                        )}
                      </ul>
                    </Alert>
                  )}
                <Divider />
                {available ? (
                  <div>
                    <div className={this.props.classes.bottomBlock}>
                      <div className={this.props.classes.buttonContainer}>
                        {getEditPermission(
                          offer,
                          hasEditActivityPermission,
                          hasEditWorkshopPermission,
                        ) && (
                          <Button color="primary" onClick={onEditButtonClick}>
                            <EditIcon className={classes.iconLeft} />
                            <Hidden xsDown>
                              {t('offer:calendar.modifyOffer')}
                            </Hidden>
                          </Button>
                        )}
                        {getCreatePermission(
                          offer,
                          hasCreateActivityPermission,
                          hasCreateWorkshopPermission,
                        ) &&
                          canBeDuplicated && (
                            <Button
                              color="primary"
                              onClick={() =>
                                this.setState({ duplicateDialog: true })
                              }
                            >
                              <FileCopyIcon className={classes.iconLeft} />
                              <Hidden xsDown>
                                {t('offer:calendar.duplicateOffer')}
                              </Hidden>
                            </Button>
                          )}
                        {getDeletePermission(
                          offer,
                          hasDeleteActivityPermission,
                          hasDeleteWorkshopPermission,
                        ) && (
                          <RedButton onClick={onDeleteButtonClick}>
                            <DeleteIcon className={classes.iconLeft} />
                            <Hidden xsDown>
                              {t('offer:calendar.deleteOffer')}
                            </Hidden>
                          </RedButton>
                        )}
                      </div>
                      {offer.id && this.props.companyId ? (
                        <div className={this.props.classes.buttonContainer}>
                          <CopyToClipboard
                            text={`${window.location.origin}/customer/payment/offer/${offer.id}?membership=${this.props.companyId}`}
                          >
                            <ButtonBase
                              className={classes.link}
                              onClick={() =>
                                this.props.snackbarSuccess('link.copied')
                              }
                            >
                              <LinkIcon />
                              <Hidden xsDown>
                                <Typography
                                  align="left"
                                  className={classes.linkTypo}
                                  variant="caption"
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
              <Link
                style={{ textDecoration: 'none' }}
                to={`/offer/${offer.id}`}
              >
                <Button
                  className={classes.manageButton}
                  color="primary"
                  variant="contained"
                >
                  {t('offer:manageOffer')}
                </Button>
              </Link>
              {!available && (
                <>
                  <Button
                    className={classes.manageButton}
                    color="secondary"
                    onClick={this.props.onRestoreButtonClick}
                    variant="contained"
                  >
                    {t('offer:restoreOffer')}
                  </Button>
                  <RedButton
                    className={classes.manageButton}
                    onClick={onDeleteButtonClick}
                    variant="contained"
                  >
                    {t('offer:forms.delete.buttonHardDelete')}
                  </RedButton>
                </>
              )}
            </div>
          )}
        </ObjectLevelPermissionProvider>
      );
    }
    return null;
  }
}

const styles = (theme) => ({
  bookingList: {
    backgroundColor: '#F8F8F8',
  },
  info: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1) * 1,
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  disabledPaper: {
    backgroundColor: '#F6F6F6',
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
  alertSpiviContainer: { margin: theme.spacing(2) },
  list: {
    margin: 'unset',
    paddingLeft: theme.spacing(3),
    '& li': {
      listStyleType: 'unset',
    },
  },
  migrationAlertListItem: {
    paddingTop: theme.spacing(2),
  },
  offerDetailContainer: {
    padding: theme.spacing(2),
  },
  nameAndCredits: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['offer', 'datetime']),
)(OfferCard);
