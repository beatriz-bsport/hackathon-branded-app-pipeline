import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import clsx from 'clsx';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Delete from '@material-ui/icons/Delete';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import ReplacementRequestStatusChip from '#src/libs/replacement-request/components/replacement-request-table/ReplacementRequestStatusChip.component';
import ReplacementRequestLateStatusChip from '#src/libs/replacement-request/components/replacement-request-table/ReplacementRequestLateStatusChip.component';
import ReplacementRequestRegistrationsStatusChip from '#src/libs/replacement-request/components/replacement-request-table/ReplacementRequestRegistrationsStatusChip.component';
import ReplacementRequestCoachAnswerButtons from '#src/libs/replacement-request/components/replacement-request-table/ReplacementRequestCoachAnswerButtons.component';
import ReplacementRequestManagerActionButtons from '#src/libs/replacement-request/components/replacement-request-table/ReplacementRequestManagerActionButtons.component';
import ReplacementRequestClosingDateExtensionButton from '#src/libs/replacement-request/components/replacement-request-table/ReplacementRequestClosingDateExtensionButton.component';

import LevelChip from '#src/libs/level/components/Level.component';
import { Level } from '#src/libs/level/types';
import {
  Establishment,
  EstablishmentGroup,
} from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import {
  ReplacementOffer,
  ReplacementRequest,
} from '#src/libs/replacement-request/types';
import {
  ReplacementDisplays,
  REPLACEMENT_REQUEST_DISABLED_REASONS,
  ReplacementRequestCoachAnswerStatus,
  ReplacementRequestStatus,
} from '#src/libs/replacement-request/constants';
import { isReplacementRequestToBeCreatedLate } from '#src/libs/replacement-request/utils';
import {
  formatAsDatetimeAdapted,
  formatISOStringAsTime,
} from '../../../../utils/datetime';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import Tooltip from '#src/components/Tooltip.component';

type Props = {
  timezoneName: string;
  replacementRequest: ReplacementRequest<
    Coach,
    Establishment,
    MetaActivity,
    number,
    number,
    number,
    Level
  > & {
    offer: ReplacementOffer<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >;
  };
  enableMultiLocalization: boolean;
  establishmentGroups: EstablishmentGroup[];
  replacementDisplay: ReplacementDisplays;
  handleCoachAnswer?: (
    status: ReplacementRequestCoachAnswerStatus,
    replacementRequestId: number,
  ) => void;
  handleDeleteAction?: (replacementRequestId: number) => void;
  coach?: Coach;
  handleExtensionAction?: (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => void;
  handleReplaceAction?: (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => void;
  handleRefuseAction?: (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => void;
  handleMarkSubstituteAsUnavailable?: (requestId: number) => void;
  nbLateRequestsLeft?: number;
  daysBeforeOfferReplacementRequestIsLate?: number;
  isMobile: boolean;
  isLastItem: boolean;
};

export const ActivitiesToReplaceTableRow: React.FC<Props> = ({
  replacementRequest,
  enableMultiLocalization,
  establishmentGroups,
  replacementDisplay,
  handleCoachAnswer,
  handleDeleteAction,
  handleExtensionAction,
  handleReplaceAction,
  handleRefuseAction,
  handleMarkSubstituteAsUnavailable,
  nbLateRequestsLeft,
  daysBeforeOfferReplacementRequestIsLate,
  timezoneName,
  isLastItem,
  isMobile,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const offer = replacementRequest.offer;

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

  const onClickDelete = useCallback(() => {
    return handleDeleteAction(replacementRequest.id);
  }, [handleDeleteAction, replacementRequest.id]);

  const handleCoachAnswerWithReplacementRequest = useCallback(
    (answer: ReplacementRequestCoachAnswerStatus) =>
      handleCoachAnswer(answer, replacementRequest.id),
    [handleCoachAnswer, replacementRequest.id],
  );

  const allowEndlessSubstitutions = useSafeFlag(
    FeatureFlags.BOOKING_ALLOW_ENDLESS_SUBSTITUTIONS,
  );

  const reasonUnavailableDisabled = useMemo(() => {
    if (replacementDisplay !== ReplacementDisplays.REPLACEMENT_DISPLAY_CONFIRM)
      return '';
    if (
      isReplacementRequestToBeCreatedLate(
        offer,
        daysBeforeOfferReplacementRequestIsLate,
      ) &&
      nbLateRequestsLeft === 0
    ) {
      return REPLACEMENT_REQUEST_DISABLED_REASONS.REPLACEMENT_REQUEST_DISABLED_NO_LATE_REQUESTS_LEFT;
    }
    return '';
  }, [
    replacementDisplay,
    offerDateStartAsDateTime,
    offer,
    daysBeforeOfferReplacementRequestIsLate,
    nbLateRequestsLeft,
  ]);

  if (isMobile) {
    return (
      <div
        className={clsx(classes.mobileContainer, {
          [classes.mobileListItemDivider]: !isLastItem,
        })}
      >
        <div
          className={clsx(
            classes.mobileSubRow,
            classes.mobileHeader,
            classes.mobileLightDivider,
          )}
        >
          <div className={classes.dateRow}>
            <Typography className={classes.marginRight2} variant="body2">
              {offerDateStartAsDateTime.toFormat('EEE d MMM, yyyy')}
            </Typography>
            <Typography className={clsx(classes.grey, classes.mobileSmallFont)}>
              {`${formatISOStringAsTime(
                offerDateStartAsDateTime.toISO(),
                timezone,
              )} - ${formatISOStringAsTime(
                offerDateEndAsDateTime.toISO(),
                timezone,
              )}`}
            </Typography>
          </div>
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE && (
            <Typography className={classes.mobileSmallFont}>
              {replacementRequest.coach_author?.name}
            </Typography>
          )}
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_TEACHER_FOUND && (
            <Typography className={classes.mobileSmallFont}>
              {replacementRequest.coach_author?.name}
            </Typography>
          )}
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_PENDING && (
            <>
              {replacementRequest?.offer?.available ? (
                <ReplacementRequestStatusChip
                  isMobile={isMobile}
                  replacementRequestStatus={replacementRequest.status}
                />
              ) : (
                <ReplacementRequestStatusChip
                  isMobile={isMobile}
                  replacementRequestStatus={
                    ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_DISPLAYED_AS_CANCELLED_BECAUSE_OFFER_IS_CANCELLED
                  }
                />
              )}
            </>
          )}
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_ACTIONS && (
            <ReplacementRequestRegistrationsStatusChip
              areClosed={
                DateTime.now() >
                DateTime.fromISO(replacementRequest.closing_date)
              }
              isMobile={isMobile}
              nbAnswers={(replacementRequest.coach_answer ?? []).length}
            />
          )}
        </div>

        <div className={classes.mobileSubRow}>
          <div className={classes.mobileOfferInfoColumn}>
            <div className={classes.offerInfo}>
              <Typography
                className={clsx(classes.mobileSmallFont, classes.weight500)}
              >
                {offer?.name_override || offer?.meta_activity?.name}
              </Typography>
              <Typography className={classes.mobileSmallFont}>
                {offer?.establishment?.title}
              </Typography>
              {enableMultiLocalization && (
                <div className={classes.mobileMultiLoc}>
                  <LocationOnIcon
                    className={classes.iconLeft}
                    fontSize="small"
                  />
                  <Typography className={classes.mobileSmallFont}>
                    {establishmentGroupList.join(', ')}
                  </Typography>
                </div>
              )}
              {replacementDisplay ===
                ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_ACTIONS && (
                <>
                  <Typography className={classes.mobileSmallFont}>
                    {offer?.coach?.name}
                  </Typography>
                  <ReplacementRequestClosingDateExtensionButton
                    isMobile={isMobile}
                    onClick={handleExtensionAction}
                    replacementRequest={replacementRequest}
                  />
                </>
              )}
              {replacementDisplay ===
                ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE && (
                <Typography
                  className={clsx(classes.grey, classes.mobileSmallFont)}
                >
                  {t('marketplace.until', {
                    date: DateTime.fromISO(
                      replacementRequest.closing_date,
                    ).toFormat('D - t'),
                  })}
                </Typography>
              )}
              {replacementDisplay ===
                ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_PENDING && (
                <Typography
                  className={clsx(
                    classes.grey,
                    classes.mobileSmallFont,
                    classes.mobileRequestReason,
                  )}
                  variant="body2"
                >
                  {replacementRequest.reason}
                </Typography>
              )}
            </div>
          </div>

          <LevelChip
            isChip
            // @ts-expect-error
            customLevel={offer.customLevel}
            smallFont={isMobile}
          />
        </div>
        <div className={classes.mobileActionRow}>
          {/* /!\ row reverse */}
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE && (
            <ReplacementRequestCoachAnswerButtons
              coachAnswer={
                replacementRequest.coach_answer?.length > 0
                  ? replacementRequest.coach_answer[0].answer
                  : null
              }
              // @ts-expect-error
              handleCoachAnswer={handleCoachAnswerWithReplacementRequest}
              smallFont={isMobile}
            />
          )}
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_PENDING && (
            <Button
              className={classes.mobileDeleteButton}
              color="primary"
              onClick={onClickDelete}
              value={replacementRequest.id}
            >
              {t('requests.cancel')}
            </Button>
          )}
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_ACTIONS && (
            <>
              <ReplacementRequestManagerActionButtons
                handleRefuseAction={handleRefuseAction}
                handleReplaceButton={handleReplaceAction}
                isMobile={isMobile}
                replacementRequest={replacementRequest}
              />
              <ReplacementRequestLateStatusChip
                isLate={replacementRequest.has_requested_late}
                isMobile={isMobile}
              />
            </>
          )}
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_CONFIRM &&
            allowEndlessSubstitutions && (
              <Tooltip
                hide={reasonUnavailableDisabled === ''}
                title={t(`unavailableReplacement.${reasonUnavailableDisabled}`)}
              >
                <span>
                  <Button
                    className={classes.mobileDeleteButton}
                    color="primary"
                    disabled={reasonUnavailableDisabled !== ''}
                    onClick={() =>
                      handleMarkSubstituteAsUnavailable?.(replacementRequest.id)
                    }
                  >
                    {t('confirmations.unavailable')}
                  </Button>
                </span>
              </Tooltip>
            )}
        </div>
      </div>
    );
  }

  return (
    <>
      <TableRow key={replacementRequest.id}>
        {[
          ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_ACTIONS,
          ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE,
        ].includes(replacementDisplay) ? (
          <TableCell className={classes.tableCell}>
            <Typography className={classes.weight500} variant="subtitle1">
              {offer?.name_override || offer?.meta_activity?.name}
            </Typography>
            <Typography className={classes.weight500} variant="subtitle2">
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
        ) : (
          <>
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
                {offer?.name_override || offer?.meta_activity?.name}
              </Typography>
            </TableCell>
          </>
        )}

        <TableCell className={classes.tableCell}>
          <div className={classes.level}>
            <LevelChip
              isChip
              // @ts-expect-error
              customLevel={offer.customLevel}
            />
          </div>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Typography variant="subtitle1">
            {offer?.establishment?.title}
          </Typography>
        </TableCell>
        {enableMultiLocalization && (
          <TableCell className={classes.tableCell}>
            <Typography>{establishmentGroupList.join(', ')}</Typography>
          </TableCell>
        )}
        {(replacementDisplay ===
          ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_PENDING ||
          replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_TEACHER_FOUND) && (
          <React.Fragment>
            <TableCell
              className={clsx(classes.tableCell, classes.responsiveReason)}
            >
              <Typography className={classes.grey} variant="body2">
                {replacementRequest.reason}
              </Typography>
            </TableCell>
            {(replacementRequest.status ===
              ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS ||
              replacementRequest.status ===
                ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_REPLACEMENT_PROPOSITIONS) && (
              <React.Fragment>
                <TableCell className={classes.tableCell}>
                  {replacementRequest?.offer?.available ? (
                    <ReplacementRequestStatusChip
                      replacementRequestStatus={replacementRequest.status}
                    />
                  ) : (
                    <ReplacementRequestStatusChip
                      replacementRequestStatus={
                        ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_DISPLAYED_AS_CANCELLED_BECAUSE_OFFER_IS_CANCELLED
                      }
                    />
                  )}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Hidden xsDown>
                    <IconButton
                      onClick={onClickDelete}
                      value={replacementRequest.id}
                    >
                      <Delete classes={{ root: classes.grey }} />
                    </IconButton>
                  </Hidden>
                  <Hidden smUp>
                    <Button
                      onClick={onClickDelete}
                      value={replacementRequest.id}
                    >
                      {t('requests.cancel')}
                    </Button>
                  </Hidden>
                </TableCell>
              </React.Fragment>
            )}
            {(replacementRequest.status ===
              ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_TEACHER_FOUND ||
              replacementRequest.status ===
                ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_SUBSTITUTE_UNAVAILABLE) && (
              <>
                <TableCell className={classes.tableCell}>
                  <Typography>
                    {replacementRequest.coach_author?.name}
                  </Typography>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Typography>{offer.coach_override?.name}</Typography>
                </TableCell>
              </>
            )}
          </React.Fragment>
        )}
        {replacementDisplay ===
          ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE && (
          <React.Fragment>
            <TableCell className={classes.tableCell}>
              <Typography>{replacementRequest.coach_author?.name}</Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Typography>
                {DateTime.fromISO(replacementRequest.closing_date).toFormat(
                  'D - t',
                )}
              </Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <ReplacementRequestCoachAnswerButtons
                coachAnswer={
                  replacementRequest.coach_answer?.length > 0
                    ? replacementRequest.coach_answer[0].answer
                    : null
                }
                // @ts-expect-error
                handleCoachAnswer={handleCoachAnswerWithReplacementRequest}
              />
            </TableCell>
          </React.Fragment>
        )}
        {replacementDisplay ===
          ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_ACTIONS && (
          <>
            <TableCell className={classes.tableCell}>
              <Typography>{offer.coach?.name}</Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <ReplacementRequestLateStatusChip
                isLate={replacementRequest.has_requested_late}
              />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <ReplacementRequestClosingDateExtensionButton
                onClick={handleExtensionAction}
                replacementRequest={replacementRequest}
              />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <ReplacementRequestRegistrationsStatusChip
                areClosed={
                  DateTime.now() >
                  DateTime.fromISO(replacementRequest.closing_date)
                }
                nbAnswers={(replacementRequest.coach_answer ?? []).length}
              />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <ReplacementRequestManagerActionButtons
                handleRefuseAction={handleRefuseAction}
                handleReplaceButton={handleReplaceAction}
                replacementRequest={replacementRequest}
              />
            </TableCell>
          </>
        )}
        {replacementDisplay ===
          ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_HISTORY && (
          <>
            <TableCell className={classes.tableCell}>
              <Typography>{offer.coach?.name}</Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Typography>{offer.coach_override?.name}</Typography>
            </TableCell>
          </>
        )}
        {replacementDisplay ===
          ReplacementDisplays.REPLACEMENT_DISPLAY_CONFIRM &&
          allowEndlessSubstitutions && (
            <TableCell className={classes.tableCell}>
              <Tooltip
                hide={reasonUnavailableDisabled === ''}
                title={t(`unavailableReplacement.${reasonUnavailableDisabled}`)}
              >
                <span>
                  <Button
                    color="primary"
                    disabled={reasonUnavailableDisabled !== ''}
                    onClick={() =>
                      handleMarkSubstituteAsUnavailable?.(replacementRequest.id)
                    }
                  >
                    {t('confirmations.unavailable')}
                  </Button>
                </span>
              </Tooltip>
            </TableCell>
          )}
      </TableRow>
    </>
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
  responsiveReason: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
    margin: `${theme.spacing(0.5)}px 0`,
  },
  weight500: {
    fontWeight: 500,
  },
  marginRight2: { marginRight: theme.spacing(2) },
  offerInfo: { marginBottom: theme.spacing(1) },
  dateRow: {
    display: 'flex',
  },
  mobileContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  mobileSubRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  mobileActionRow: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileLightDivider: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    marginBottom: theme.spacing(1),
  },
  mobileListItemDivider: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  mobileSmallFont: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
  mobileOfferInfoColumn: {
    maxWidth: '70%',
  },
  mobileRequestReason: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  mobileDeleteButton: {
    marginTop: -theme.spacing(1),
  },
  mobileHeader: { paddingBottom: theme.spacing(1) },
  mobileMultiLoc: { display: 'flex' },
  iconLeft: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      marginRight: theme.spacing(0.5),
    },
  },
}));

export default ActivitiesToReplaceTableRow;
