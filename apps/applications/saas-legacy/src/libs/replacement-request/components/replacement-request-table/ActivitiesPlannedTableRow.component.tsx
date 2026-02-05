import React, { useMemo, useCallback } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import IconButton from '@material-ui/core/IconButton';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Tooltip from '#src/components/Tooltip.component';

import { reasonCoachCannotAskForReplacement } from '#src/libs/replacement-request/utils';
import { ReplacementDisplays } from '#src/libs/replacement-request/constants';
import LevelChip from '#src/libs/level/components/Level.component';
import { Level } from '#src/libs/level/types';
import {
  Establishment,
  EstablishmentGroup,
} from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Offer } from '#src/libs/offer/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { ReplacementOffer } from '#src/libs/replacement-request/types';
import {
  formatAsDatetimeAdapted,
  formatISOStringAsTime,
} from '../../../../utils/datetime';

type Props = {
  timezoneName: string;
  nbLateRequestsLeft?: number;
  daysBeforeOfferReplacementRequestIsLate?: number;
  offer: ReplacementOffer<
    Coach,
    Establishment,
    MetaActivity,
    number,
    number,
    number,
    Level
  > & { hasPendingReplacementRequest?: boolean };
  coach: Coach;
  selectedOffers: number[];
  enableMultiLocalization: boolean;
  establishmentGroups: EstablishmentGroup[];
  handleCheckboxAction: (offer: Offer) => void;
  replacementDisplay: ReplacementDisplays;
  isMobile: boolean;
  setMobileReasonActionDisabled: (reason: string) => void;
  getHasPendingReplacementRequest?: (offerId: number) => boolean;
  getHasRefusedReplacementRequest?: (offerId: number) => boolean;
  isLastItem: boolean;
};

export const ActivitiesPlannedTableRow: React.FC<Props> = ({
  offer,
  coach,
  enableMultiLocalization,
  establishmentGroups,
  handleCheckboxAction,
  selectedOffers = [],
  replacementDisplay,
  nbLateRequestsLeft,
  daysBeforeOfferReplacementRequestIsLate,
  isMobile,
  timezoneName,
  setMobileReasonActionDisabled,
  getHasPendingReplacementRequest,
  getHasRefusedReplacementRequest,
  isLastItem,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const onClickCheckbox = useCallback(
    // @ts-expect-error
    () => handleCheckboxAction(offer),
    [handleCheckboxAction, offer],
  );

  const reasonActionDisabledClickHandler = useCallback(
    (reason: string) => () => setMobileReasonActionDisabled(reason),
    [setMobileReasonActionDisabled],
  );

  const isOfferSelected = !!selectedOffers && selectedOffers.includes(offer.id);
  const hasPendingReplacementRequest = getHasPendingReplacementRequest
    ? getHasPendingReplacementRequest(offer.id)
    : false;

  const hasRefusedReplacementRequest = getHasRefusedReplacementRequest
    ? getHasRefusedReplacementRequest(offer.id)
    : false;

  const reasonActionDisabled = useMemo(() => {
    return (
      replacementDisplay === ReplacementDisplays.REPLACEMENT_DISPLAY_CALENDAR &&
      reasonCoachCannotAskForReplacement(
        coach,
        offer,
        hasPendingReplacementRequest,
        hasRefusedReplacementRequest,
        nbLateRequestsLeft,
        daysBeforeOfferReplacementRequestIsLate,
      )
    );
  }, [
    coach,
    offer,
    replacementDisplay,
    nbLateRequestsLeft,
    daysBeforeOfferReplacementRequestIsLate,
    hasPendingReplacementRequest,
    hasRefusedReplacementRequest,
  ]);

  const establishmentGroupList = useMemo(
    () =>
      enableMultiLocalization
        ? establishmentGroups
            .filter((eg) => eg.establishment.includes(offer.establishment))
            .map((eg) => eg.name)
            .filter((eg) => !!eg)
        : [],
    [enableMultiLocalization, establishmentGroups, offer.establishment],
  );

  const offerDateStartAsDateTime = useMemo(
    () =>
      DateTime.fromISO(offer.date_start).setZone(
        offer.timezone_name ?? timezoneName,
      ),
    [offer, timezoneName],
  );

  const offerDateEndAsDateTime = useMemo(
    () =>
      DateTime.fromISO(offer.date_start)
        .setZone(offer.timezone_name ?? timezoneName)
        .plus({ minute: offer.duration_minute }),
    [offer, timezoneName],
  );

  const timezone = useMemo(
    () => offer.timezone_name ?? timezoneName,
    [offer.timezone_name, timezoneName],
  );

  if (isMobile) {
    return (
      <div
        className={clsx(classes.mobileContainer, {
          [classes.mobileListItemDivider]: !isLastItem,
        })}
      >
        <div className={classes.mobileRow}>
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_CALENDAR && (
            <div className={classes.mobileActionColumn}>
              {!isOfferSelected && reasonActionDisabled !== '' ? (
                <IconButton
                  onClick={reasonActionDisabledClickHandler(
                    reasonActionDisabled,
                  )}
                  size="small"
                >
                  <ErrorOutlineIcon className={classes.icon} />
                </IconButton>
              ) : (
                <span>
                  <Checkbox
                    checked={isOfferSelected}
                    onChange={onClickCheckbox}
                  />
                </span>
              )}
            </div>
          )}

          <div
            className={clsx(
              classes.mobileOfferColumn,
              classes.mobileColumnContainer,
              {
                [classes.opacity]:
                  replacementDisplay ===
                    ReplacementDisplays.REPLACEMENT_DISPLAY_CALENDAR &&
                  !isOfferSelected &&
                  reasonActionDisabled !== '',
              },
            )}
          >
            <div className={classes.mobileDateTimeContainer}>
              <Typography className={classes.weight500} variant="subtitle2">
                {formatAsDatetimeAdapted(
                  offerDateStartAsDateTime.toISO(),
                  'EEE DD',
                  timezone,
                )}
              </Typography>
              <Typography
                className={clsx(classes.grey, classes.mobileSmallFont)}
              >
                {`${formatISOStringAsTime(
                  offerDateStartAsDateTime.toISO(),
                  timezone,
                )} - ${formatISOStringAsTime(
                  offerDateEndAsDateTime.toISO(),
                  timezone,
                )}`}
              </Typography>
            </div>
            <Typography
              className={clsx(classes.mobileSmallFont, classes.weight500)}
            >
              {offer?.name_override || offer?.meta_activity?.name}
            </Typography>
            <Typography className={classes.mobileSmallFont}>
              {offer.establishment.title}
            </Typography>
            {enableMultiLocalization && (
              <div className={classes.mobileMultiLoc}>
                <LocationOnIcon className={classes.iconLeft} fontSize="small" />
                <Typography className={classes.mobileSmallFont}>
                  {establishmentGroupList.join(', ')}
                </Typography>
              </div>
            )}
          </div>

          <div
            className={clsx(
              classes.mobileLevelColumn,
              classes.mobileColumnContainer,
              {
                [classes.opacity]:
                  replacementDisplay ===
                    ReplacementDisplays.REPLACEMENT_DISPLAY_CALENDAR &&
                  !isOfferSelected &&
                  reasonActionDisabled !== '',
              },
            )}
          >
            <div className={classes.level}>
              <LevelChip
                isChip
                // @ts-expect-error
                customLevel={offer.customLevel}
                smallFont={isMobile}
              />
            </div>
          </div>
        </div>
        {replacementDisplay ===
          ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_HISTORY && (
          <div className={classes.mobileTeacherRow}>
            <div>
              <Typography
                className={clsx(classes.mobileSmallFont, classes.weight500)}
              >
                {t('header.teacher')}
              </Typography>
              <Typography className={classes.mobileSmallFont}>
                {offer.coach_author?.name || offer.coach.name}
              </Typography>
            </div>
            <div>
              <Typography
                className={clsx(classes.mobileSmallFont, classes.weight500)}
              >
                {t('header.teacher_override')}
              </Typography>
              <Typography className={classes.mobileSmallFont}>
                {offer.selected_coach?.name || offer.coach_override?.name}
              </Typography>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <TableRow key={offer.id}>
      <TableCell className={classes.tableCell}>
        <Typography className={classes.weight500} variant="subtitle1">
          {formatAsDatetimeAdapted(
            offerDateStartAsDateTime.toISO(),
            'EEE DD',
            timezone,
          )}
        </Typography>
        <Typography className={classes.grey} variant="body2">
          {`${formatISOStringAsTime(
            offerDateStartAsDateTime.toISO(),
            timezone,
          )} - ${formatISOStringAsTime(
            offerDateEndAsDateTime.toISO(),
            timezone,
          )}`}
        </Typography>
      </TableCell>
      <Hidden smUp>
        <Divider className={classes.divider} />
      </Hidden>
      <TableCell className={classes.tableCell}>
        <Typography className={classes.weight500} variant="subtitle1">
          {offer?.name_override || offer.meta_activity.name}
        </Typography>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <div className={classes.level}>
          {/* @ts-expect-error */}
          <LevelChip isChip customLevel={offer.customLevel} />
        </div>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <Typography variant="subtitle1">{offer.establishment.title}</Typography>
      </TableCell>
      {enableMultiLocalization && (
        <TableCell className={classes.tableCell}>
          <Typography>{establishmentGroupList.join(', ')}</Typography>
        </TableCell>
      )}

      {replacementDisplay ===
        ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_HISTORY && (
        <>
          <TableCell className={classes.tableCell}>
            <Typography>
              {offer.coach_author?.name || offer.coach.name}
            </Typography>
          </TableCell>
          <TableCell className={classes.tableCell}>
            <Typography>
              {offer.selected_coach?.name || offer.coach_override?.name}
            </Typography>
          </TableCell>
        </>
      )}
      {replacementDisplay ===
        ReplacementDisplays.REPLACEMENT_DISPLAY_CALENDAR && (
        <TableCell className={classes.tableCell}>
          <Tooltip
            hide={isOfferSelected || reasonActionDisabled === ''}
            title={t(`unavailableReplacement.${reasonActionDisabled}`)}
          >
            <span>
              <Checkbox
                checked={selectedOffers?.includes(offer.id)}
                disabled={!isOfferSelected && reasonActionDisabled !== ''}
                onChange={onClickCheckbox}
              />
            </span>
          </Tooltip>
        </TableCell>
      )}
    </TableRow>
  );
};

const useStyles = makeStyles((theme) => ({
  grey: {
    color: theme.palette.grey[600],
  },
  tableCell: {
    borderBottom: 'none',
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      paddingLeft: theme.spacing(1),
    },
  },
  level: {
    display: 'table',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      marginLeft: 'auto',
    },
  },
  divider: {
    width: '100%',
    order: 3,
    backgroundColor: theme.palette.grey[100],
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  weight500: {
    fontWeight: 500,
  },
  mobileContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  mobileRow: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  mobileListItemDivider: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  mobileActionColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
  },
  mobileColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  mobileOfferColumn: {
    flex: 4,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  mobileDateTimeContainer: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  mobileSmallFont: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
  mobileLevelColumn: { flex: 1 },
  mobileTeacherRow: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileMultiLoc: { display: 'flex' },
  iconLeft: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      marginRight: theme.spacing(0.5),
    },
  },
  opacity: { opacity: 0.5 },
  icon: { color: theme.palette.warning.main },
}));

export default ActivitiesPlannedTableRow;
