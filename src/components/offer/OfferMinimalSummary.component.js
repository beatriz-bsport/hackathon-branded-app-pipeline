// @flow
import React, { useState } from 'react';
import { pure } from 'recompose';
import classNames from 'classnames';
import { withTranslation, TFunction } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import VideocamIcon from '@material-ui/icons/Videocam';
import withStyles from '@material-ui/core/styles/withStyles';
import LabelIcon from '@material-ui/icons/Label';
import FolderIcon from '@material-ui/icons/Folder';

import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import { getCoachDisplayName } from '@bsport/common/lib/master-data/coach';
import ReplacementRequestPendingChip from '#libs/replacement-request/components/replacement-request-table/ReplacementRequestPendingChip.component';
import FreeOfferChip from '#libs/offer/components/FreeOfferChip.component';
import type { Theme as CompanyTheme } from '#libs/theme/types';
import {
  formatMinutes,
  formatAsDatetime,
  formatISOStringAsTime,
} from '../../utils/datetime';

import Tooltip from '../Tooltip.component';
import EmptyListItem from '../LoadingListItem.component';
import PaymentPackTagsDialog from '../../libs/payment-packs/components/PaymentPackTagsDialog.component';
import type { Offer } from '../../api/types';
import DEFAULT_PROFILE_PICTURE_URL from '../../assets/constants';
import RollCallChip from '../../libs/offer/components/RollCallChip.component';
import OfferIconHybridIndicator from '../../libs/offer/components/OfferHybridIconIndicator.component';
import CoachToolTip, {
  AdditionalCoachesTooltipTitle,
} from '../../libs/associated-coach/components/CoachToolTip.component';

const styles = (theme) => ({
  relativeContainer: { position: 'relative' },
  chipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  offerTitleText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  videocamIcon: {
    marginRight: theme.spacing(1) / 2,
  },
  listItem: {
    width: '100%',
  },
  disabled: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
  noOverflow: {
    overflow: 'hidden',
  },
  topAlign: {
    alignSelf: 'start',
  },
  noWrap: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  textMaxWidth: {
    maxWidth: '90%',
  },
  rollCallChip: { marginTop: theme.spacing(0.5) },
  replacementChip: { marginBottom: theme.spacing(0.5) },
});

type Props = {
  noDate: ?boolean,
  offer: Offer,
  showCoachName: ?boolean,
  selected: boolean,
  overrideClickAction: () => void,
  onModifyTags: (offer: Offer) => void,
  t: TFunction,
  loading: boolean,
  classes: Object,
  isCoach: boolean,
  showTags: boolean,
  fixedHeight?: number,
  getHasPendingReplacementRequest?: (offerId: number) => boolean,
  openRollCallDrawer: () => void,
  isRollCallMandatory: boolean,
  displayCoachInfoOnHover?: boolean,
  companyTheme: CompanyTheme,
  coachDisplay?: MarketPlaceCoachDisplay,
};

const getFillingInfo = (offer: Offer) => {
  const fillingInfo = (
    <div style={{ display: 'inline-flex', alignItems: 'flex-end' }}>
      <Typography inline color="secondary" variant="subtitle2">
        {`${offer.nb_bookings} `}
      </Typography>
      <Typography color="textPrimary" variant="subtitle2">
        {`/${offer.effectif}`}
      </Typography>
      <Hidden smDown>
        <React.Fragment>
          <Typography inline color="textPrimary" variant="caption">
            &nbsp;(
          </Typography>
          <Typography inline color="primary" variant="caption">
            {offer.nb_attendant}
          </Typography>
          <Typography inline variant="caption">
            +
          </Typography>
          <Typography inline color="error" variant="caption">
            {offer.nb_non_attendant}
          </Typography>
          <Typography color="textPrimary" variant="caption">
            )
            {!!offer.nb_option && (
              <Typography inline color="textSecondary" variant="caption">
                &nbsp; ⧗{`${offer.nb_option}/${offer.waiting_list_max_size}`}
              </Typography>
            )}
          </Typography>
        </React.Fragment>
      </Hidden>
    </div>
  );
  const fillingInfoProps = {
    color: offer.nb_bookings < offer.effectif ? 'error' : 'primary',
  };
  const formattedFillingRate = `${parseInt(
    (offer.nb_bookings / (offer.effectif || 1)) * 100,
    10,
  )}%`;

  return [fillingInfo, fillingInfoProps, formattedFillingRate];
};

export function OfferMinimalSummary(props: Props) {
  const {
    noDate,
    offer,
    showCoachName,
    overrideClickAction,
    onModifyTags,
    selected,
    t,
    classes,
    loading,
    isCoach,
    showTags,
    fixedHeight,
    getHasPendingReplacementRequest,
    displayCoachInfoOnHover,
    companyTheme,
    coachDisplay,
  } = props;

  const [tagManagementDialog, setTagManagementDialog] = useState(false);

  const hasPendingReplacementRequest = getHasPendingReplacementRequest
    ? getHasPendingReplacementRequest(offer.id)
    : false;

  if (!offer || loading) {
    return <EmptyListItem key="" dense divider />;
  }

  const {
    name,
    id,
    establishment,
    establishment_override,
    duration_minute,
    coach,
    additional_coaches,
    coach_override,
    available,
    date_start,
    whitelist_tags,
    blacklist_tags,
    credit_price,
    credit_price_override,
    name_override,
  } = offer;

  const disabledAvatarProps = {
    style: {
      opacity: '0.65',
      backgroundColor: 'rgb(0,0,0)',
    },
  };

  let formattedName = name_override || name;
  if (!available) {
    formattedName += ` - ${t('offer:disabled')}`;
  }
  const currentEstablishment =
    establishment_override || establishment || offer.etablissement;
  const dateFormatter = noDate ? formatISOStringAsTime : formatAsDatetime;
  const [fillingInfo, fillingInfoProps, formattedFillingRate] =
    getFillingInfo(offer);

  let actualCoachName = '  -  ';
  if (coach && !coach_override) {
    actualCoachName = getCoachDisplayName(
      coachDisplay,
      coach?.name,
      coach?.firstname,
    );
  }
  if (coach_override) {
    actualCoachName = getCoachDisplayName(
      coachDisplay,
      coach_override?.name,
      coach_override?.firstname,
    );
  }

  const textClasses = fixedHeight
    ? {
        primary: classes.noWrap,
        secondary: classes.noWrap,
      }
    : {};

  return (
    <>
      <PaymentPackTagsDialog
        blacklistTags={blacklist_tags}
        className={classes.noOverflow}
        onClose={() => setTagManagementDialog(false)}
        onModify={() => {
          setTagManagementDialog(false);
          onModifyTags();
        }}
        open={tagManagementDialog}
        whitelistTags={whitelist_tags}
      />
      <ListItem
        key={id}
        dense
        divider
        button={!!overrideClickAction}
        className={classNames(
          classes.listItem,
          available ? {} : classes.disabled,
        )}
        onClick={overrideClickAction}
        selected={selected}
        style={{
          borderLeft: offer.meta_activity_color ? '5px solid' : '0px',
          borderLeftColor: offer.meta_activity_color,
          height: fixedHeight,
          backgroundColor:
            (offer.has_spivi_error || offer.has_spivi_booking_error) &&
            offer.available
              ? '#FFF7EB'
              : null,
        }}
      >
        <Grid container alignItems="center" directon="row">
          <Grid item xs={6}>
            <Grid container alignItems="center" direction="row" wrap="nowrap">
              <Hidden smDown>
                <Grid item>
                  {coach_override && isCoach ? (
                    <Tooltip
                      title={
                        displayCoachInfoOnHover ? (
                          <CoachToolTip coach={coach_override} />
                        ) : (
                          ''
                        )
                      }
                    >
                      <div>
                        <Avatar
                          src={
                            coach_override.photo || DEFAULT_PROFILE_PICTURE_URL
                          }
                        />
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        displayCoachInfoOnHover ? (
                          <CoachToolTip coach={coach} />
                        ) : (
                          ''
                        )
                      }
                    >
                      <div>
                        <IconButton disableRipple disabled={!!coach_override}>
                          <Avatar
                            imgProps={coach_override ? disabledAvatarProps : {}}
                            src={
                              coach
                                ? coach.photo || DEFAULT_PROFILE_PICTURE_URL
                                : ''
                            }
                          />
                        </IconButton>
                      </div>
                    </Tooltip>
                  )}
                </Grid>
              </Hidden>
              <Grid item style={coach_override ? { marginLeft: -30 } : {}}>
                {coach_override && !isCoach ? (
                  <Tooltip
                    title={
                      displayCoachInfoOnHover ? (
                        <CoachToolTip coach={coach_override} />
                      ) : (
                        ''
                      )
                    }
                  >
                    <IconButton disableRipple>
                      <Avatar
                        src={
                          coach_override.photo || DEFAULT_PROFILE_PICTURE_URL
                        }
                      />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Grid>
              <Grid item xs={9}>
                <ListItemText
                  classes={textClasses}
                  primary={
                    <div className={classes.offerTitleText}>
                      {offer.is_broadcast && !offer?.linked_hybrid_offer_id && (
                        <VideocamIcon className={classes.videocamIcon} />
                      )}
                      {offer?.linked_hybrid_offer_id && (
                        <OfferIconHybridIndicator
                          className={classes.videocamIcon}
                          iconProps={{ fontSize: 'large' }}
                        />
                      )}
                      {offer.group && (
                        <FolderIcon className={classes.videocamIcon} />
                      )}
                      <Typography
                        className={classNames(textClasses?.primary, {
                          [classes.textMaxWidth]: fixedHeight,
                        })}
                        variant="inherit"
                      >
                        {formattedName}
                      </Typography>
                      <FreeOfferChip
                        companyTheme={companyTheme}
                        credits={credit_price}
                        creditsOverride={credit_price_override}
                        size="small"
                      />
                    </div>
                  }
                  secondary={`${dateFormatter(
                    date_start,
                    offer.timezone_name,
                  )} - ${formatMinutes(duration_minute, t)}`}
                />
              </Grid>
              {showTags &&
                (whitelist_tags?.length > 0 || blacklist_tags?.length > 0) && (
                  <Grid item className={classes.topAlign}>
                    <Tooltip
                      disableInteractive
                      placement="bottom-start"
                      title={t('offer:tagManagementInfo', {
                        authorized: whitelist_tags.length || 0,
                        unauthorized: blacklist_tags.length || 0,
                      })}
                    >
                      <IconButton
                        disableRipple
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setTagManagementDialog(true);
                        }}
                        onMouseDown={(ev) => ev.stopPropagation()}
                      >
                        <LabelIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <ListItemText
              classes={textClasses}
              primary={fillingInfo}
              primaryTypographyProps={fillingInfoProps}
              secondary={formattedFillingRate}
            />
          </Grid>
          <Grid item className={classes.relativeContainer} xs={2}>
            {additional_coaches?.length > 0 ? (
              <ListItemText
                classes={textClasses}
                primary={
                  showCoachName
                    ? actualCoachName
                    : (currentEstablishment || {}).title
                }
                secondary={
                  <Tooltip
                    title={
                      <AdditionalCoachesTooltipTitle
                        coaches={additional_coaches}
                        mainCoachName={actualCoachName}
                      />
                    }
                  >
                    <div>
                      {t('offer:allCoaches', {
                        count: additional_coaches?.length + 1,
                      })}
                    </div>
                  </Tooltip>
                }
              />
            ) : (
              <ListItemText
                classes={textClasses}
                primary={
                  showCoachName
                    ? actualCoachName
                    : (currentEstablishment || {}).title
                }
                secondary={actualCoachName}
              />
            )}
          </Grid>
          <Grid item className={classes.chipContainer} xs={1}>
            {hasPendingReplacementRequest && (
              <Tooltip>
                <div
                  className={
                    props.isRollCallMandatory && classes.replacementChip
                  }
                  title={t('offer:pendingReplacementRequest')}
                >
                  <ReplacementRequestPendingChip height={22} width={30} />
                </div>
              </Tooltip>
            )}
            {props.isRollCallMandatory && (
              <div
                className={hasPendingReplacementRequest && classes.rollCallChip}
              >
                <RollCallChip
                  isValidated={!offer.roll_call_needs_validation}
                  lastValidatedRollCallDate={offer.date_roll_call_last_modified}
                  onClick={props.openRollCallDrawer}
                />
              </div>
            )}
          </Grid>
        </Grid>
      </ListItem>
    </>
  );
}

export default withTranslation(['offer', 'datetime'])(
  withStyles(styles)(pure(OfferMinimalSummary)),
);
