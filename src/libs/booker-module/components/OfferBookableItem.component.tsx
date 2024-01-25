// @ts-nocheck
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import BlockIcon from '@material-ui/icons/Block';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment-timezone';
import clx from 'classnames';

import {
  OFFER_WAITING_LIST_STATUS_FULL,
  OFFER_WAITING_LIST_STATUS_OPEN,
} from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
  OFFER_BOOKABLE_STATUS_LOCKED,
} from '@bsport/common/lib/master-data/bookable-status';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';
import { getCoachDisplayName } from '@bsport/common/lib/master-data/coach';
import {
  formatAsDatetimeAdapted,
  formatAsTime,
  formatMinutes,
} from '../../../utils/datetime';
import type { OfferStatus as OfferStatusType, Offer } from '#libs/offer/types';
import type { Coach } from '#libs/associated-coach/types';
import type { Establishment } from '#libs/establishment/types';
import { SpotInformation } from '#libs/spot-scheduling/types';
import PlaceNumber from '#libs/spot-scheduling/component/PlaceNumber.component';
import CustomChip from '#components/chip/CustomChip.component';

const OfferStatus = ({ offerStatus }: { offerStatus: OfferStatusType }) => {
  let statusColor = 'green';

  let statusText = '';

  let StatusIcon = () => <div />;
  const { t } = useTranslation('booking');
  if (offerStatus.blocked_by_tags) {
    statusColor = 'red';
    statusText = t('offer.offerStatus.blockedByTags');
    StatusIcon = BlockIcon;
  } else if (
    [
      OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
      OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
      OFFER_BOOKABLE_STATUS_LOCKED,
    ].includes(offerStatus.bookable_status)
  ) {
    statusColor = 'red';
    statusText = t(
      `offer.offerStatus.bookable_status.${offerStatus.bookable_status}`,
    );
    StatusIcon = BlockIcon;
  } else if (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE) {
    return null;
  } else if (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL) {
    StatusIcon = HourglassEmptyIcon;
    statusText = t(
      `offer.offerStatus.waiting_list_status.${offerStatus.waiting_list_status}`,
    );
    if (offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL) {
      statusColor = 'red';
    }
    if (offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN) {
      statusColor = 'green';
    }
  }

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        border: `1px solid ${statusColor}`,
        borderRadius: 4,
        margin: 6,
      }}
    >
      <StatusIcon
        fontSize="small"
        style={{ color: statusColor, marginRight: 4 }}
      />
      <Typography
        style={{ color: statusColor, paddingRight: 4 }}
        variant="caption"
      >
        {statusText}
      </Typography>
    </div>
  );
};

type OfferBookableItemProps = {
  offer: Offer<Coach, Establishment>;
  disabled: boolean;
  onAdd: (offer: Offer<Coach, Establishment>) => void;
  onRemove: (offer: Offer<Coach, Establishment>) => void;
  offerStatus: OfferStatusType;
  isRegistered: boolean;
  hideCoach: boolean;
  offerSpot?: number | undefined;
  offerSpotInformation?: SpotInformation;
  displayPositionInWaitingList?: boolean;
  waitingListPosition?: { member_position: number; waiting_list_size: number };
  isBookingLimitReached?: boolean;
  coachDisplay?: MarketPlaceCoachDisplay;
};
export const OfferBookableItem = (props: OfferBookableItemProps) => {
  const classes = useStyles();
  const { t } = useTranslation(['datetime', 'booking']);

  const { offer, coachDisplay } = props;

  const establishmentTitle =
    (offer && offer.establishment && offer.establishment.title) || '';

  const coach = (offer && offer.coach_override) || offer.coach;
  const coachName =
    getCoachDisplayName(coachDisplay, coach?.name, coach?.firstname) || '';

  const onClick =
    !props.disabled && (() => props.onAdd && props.onAdd(props.offer));

  const theme = useTheme();

  return (
    <>
      <ButtonBase
        className={clx([
          classes.container,
          props.disabled ? classes.disableContainer : null,
        ])}
        disableRipple={!onClick || props.onRemove}
        onClick={!props.onRemove && onClick}
      >
        {props.disabled && <div className={classes.disableOverlay} />}
        <div className={classes.time}>
          <Typography variant="h6">
            {formatAsTime(props.offer.date_start, props.offer.timezone_name)}
          </Typography>
          <Typography color="textSecondary">
            {formatMinutes(props.offer.duration_minute, t)}
          </Typography>
        </div>
        <div className={classes.generalInfo}>
          <Typography>
            {`${formatAsDatetimeAdapted(
              props.offer.date_start,
              'LL',
              props.offer.timezone_name,
            )}, 
              ${moment(props.offer.date_start)
                .tz(props.offer.timezone_name)
                .format('dddd')}`}
          </Typography>
          {props.offerSpot && (
            <PlaceNumber
              spotInformation={
                Object.keys(props?.offerSpotInformation || {}).length > 0
                  ? props.offerSpotInformation
                  : { indexType: props.offerSpot }
              }
            />
          )}
          {!props.hideCoach && (
            <Typography align="left" variant="body2">
              <strong>{coachName}</strong>
            </Typography>
          )}
          <Typography align="left" variant="caption">
            {establishmentTitle}
          </Typography>
          <div className={classes.rightPanel}>
            {props.onRemove ? (
              <IconButton onClick={() => props.onRemove(props.offer)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : (
              <div />
            )}
            {!!props.offerStatus && (
              <OfferStatus offerStatus={props.offerStatus} />
            )}
          </div>
        </div>
        {props.displayPositionInWaitingList && props.waitingListPosition && (
          <CustomChip
            displayedValue={`${props.waitingListPosition.member_position}/${props.waitingListPosition.waiting_list_size}`}
            mainColor={theme.palette.primary.main}
          />
        )}
      </ButtonBase>
      {props.isRegistered && (
        <div className={classes.hasRegisteredContainer}>
          <Typography className={classes.hasRegisteredTypo} variant="caption">
            {t('booking:bookingModule.hasRegistered')}
          </Typography>
        </div>
      )}
      {props.isBookingLimitReached && (
        <div className={classes.hasRegisteredContainer}>
          <Typography
            className={classes.isBookingLimitReachedTypo}
            variant="caption"
          >
            {t('booking:bookingModule.isBookingLimitReached')}
          </Typography>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  disableContainer: {
    backgroundColor: 'rgba(80, 80, 80, .1)',
  },
  time: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
  generalInfo: {
    flex: 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  rightPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  disableOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, .5)',
  },
  hasRegisteredContainer: {
    paddingLeft: theme.spacing(0.5),
    borderLeft: '1px solid rgba(80, 80, 80, .1)',
    borderRight: '1px solid rgba(80, 80, 80, .1)',
  },
  hasRegisteredTypo: {
    color: 'green',
  },
  isBookingLimitReachedTypo: {
    color: 'red',
  },
}));

export default OfferBookableItem;
