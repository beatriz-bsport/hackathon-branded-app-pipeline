// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import classnames from 'classnames';

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
import ReplacementRequestStatusChip from '#libs/replacement-request/components/replacement-request-table/ReplacementRequestStatusChip.component';
import ReplacementRequestLateStatusChip from '#libs/replacement-request/components/replacement-request-table/ReplacementRequestLateStatusChip.component';
import ReplacementRequestRegistrationsStatusChip from '#libs/replacement-request/components/replacement-request-table/ReplacementRequestRegistrationsStatusChip.component';
import ReplacementRequestCoachAnswerButtons from '#libs/replacement-request/components/replacement-request-table/ReplacementRequestCoachAnswerButtons.component';
import ReplacementRequestManagerActionButtons from '#libs/replacement-request/components/replacement-request-table/ReplacementRequestManagerActionButtons.component';
import ReplacementRequestClosingDateExtensionButton from '#libs/replacement-request/components/replacement-request-table/ReplacementRequestClosingDateExtensionButton.component';

import LevelChip from '#libs/level/components/Level.component';
import { Level } from '#libs/level/types';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { ReplacementRequest } from '#libs/replacement-request/types';
import {
  ReplacementDisplays,
  ReplacementRequestCoachAnswerStatus,
  ReplacementRequestStatus,
} from '#libs/replacement-request/constants';
import {
  formatAsDatetimeAdapted,
  formatAsTime,
} from '../../../../utils/datetime';

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
  >;
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
  timezoneName,
  isLastItem,
  isMobile,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const establishmentGroupList = useMemo(
    () =>
      enableMultiLocalization
        ? establishmentGroups
            .filter((eg) =>
              eg.establishment.includes(replacementRequest.offer.establishment),
            )
            .map((eg) => eg.name)
            .filter((eg) => !!eg)
        : [],
    [
      enableMultiLocalization,
      establishmentGroups,
      replacementRequest.offer.establishment,
    ],
  );

  const offerDateStartAsMoment = useMemo(
    () =>
      moment(replacementRequest.offer.date_start).tz(
        replacementRequest.offer.timezone_name ?? timezoneName,
      ),
    [replacementRequest.offer, timezoneName],
  );

  const offerDateEndAsMoment = useMemo(
    () =>
      moment(replacementRequest.offer.date_start)
        .tz(replacementRequest.offer.timezone_name ?? timezoneName)
        .add(replacementRequest.offer.duration_minute, 'minutes'),
    [replacementRequest.offer, timezoneName],
  );

  const timezone = useMemo(
    () => replacementRequest.offer.timezone_name ?? timezoneName,
    [replacementRequest.offer.timezone_name, timezoneName],
  );

  const onClickDelete = useCallback(() => {
    return handleDeleteAction(replacementRequest.id);
  }, [handleDeleteAction, replacementRequest.id]);

  const handleCoachAnswerWithReplacementRequest = useCallback(
    (answer: ReplacementRequestCoachAnswerStatus) =>
      handleCoachAnswer(answer, replacementRequest.id),
    [handleCoachAnswer, replacementRequest.id],
  );

  if (isMobile) {
    return (
      <div
        className={classnames(classes.mobileContainer, {
          [classes.mobileListItemDivider]: !isLastItem,
        })}
      >
        <div
          className={classnames(
            classes.mobileSubRow,
            classes.mobileHeader,
            classes.mobileLightDivider,
          )}
        >
          <div className={classes.dateRow}>
            <Typography className={classes.marginRight2} variant="body2">
              {formatAsDatetimeAdapted(
                offerDateStartAsMoment,
                'ddd D MMM, YYYY',
                timezone,
              )}
            </Typography>
            <Typography
              className={classnames(classes.grey, classes.mobileSmallFont)}
            >
              {`${formatAsTime(
                offerDateStartAsMoment,
                timezone,
              )} - ${formatAsTime(offerDateEndAsMoment, timezone)}`}
            </Typography>
          </div>
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE && (
            <Typography className={classes.mobileSmallFont}>
              {replacementRequest.offer.coach?.name}
            </Typography>
          )}
          {replacementDisplay ===
            ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_TEACHER_FOUND && (
            <Typography className={classes.mobileSmallFont}>
              {replacementRequest.offer.coach_override?.name}
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
              areClosed={moment().isAfter(replacementRequest.closing_date)}
              isMobile={isMobile}
              nbAnswers={(replacementRequest.coach_answer || []).length}
            />
          )}
        </div>

        <div className={classes.mobileSubRow}>
          <div className={classes.mobileOfferInfoColumn}>
            <div className={classes.offerInfo}>
              <Typography
                className={classnames(
                  classes.mobileSmallFont,
                  classes.weight500,
                )}
              >
                {replacementRequest.offer?.name_override ||
                  replacementRequest.offer?.meta_activity?.name}
              </Typography>
              <Typography className={classes.mobileSmallFont}>
                {replacementRequest.offer?.establishment?.title}
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
                    {replacementRequest.offer?.coach?.name}
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
                  className={classnames(classes.grey, classes.mobileSmallFont)}
                >
                  {t('marketplace.until', {
                    date: moment(replacementRequest.closing_date).format(
                      'L - LT',
                    ),
                  })}
                </Typography>
              )}
              {replacementDisplay ===
                ReplacementDisplays.REPLACEMENT_DISPLAY_REQUEST_PENDING && (
                <Typography
                  className={classnames(
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
            customLevel={replacementRequest.offer.customLevel}
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
              {replacementRequest.offer?.name_override ||
                replacementRequest.offer?.meta_activity?.name}
            </Typography>
            <Typography className={classes.weight500} variant="subtitle2">
              {formatAsDatetimeAdapted(
                offerDateStartAsMoment,
                'ddd D MMM, YYYY',
                timezone,
              )}
            </Typography>
            <Typography className={classes.grey} variant="body2">
              {`${formatAsTime(
                offerDateStartAsMoment,
                timezone,
              )} - ${formatAsTime(offerDateEndAsMoment, timezone)}`}
            </Typography>
          </TableCell>
        ) : (
          <>
            <TableCell className={classes.tableCell}>
              <Typography className={classes.weight500} variant="subtitle1">
                {formatAsDatetimeAdapted(
                  offerDateStartAsMoment,
                  'ddd D MMM, YYYY',
                  timezone,
                )}
              </Typography>
              <Typography className={classes.grey} variant="body2">
                {`${formatAsTime(
                  offerDateStartAsMoment,
                  timezone,
                )} - ${formatAsTime(offerDateEndAsMoment, timezone)}`}
              </Typography>
            </TableCell>
            <Hidden smUp>
              <Divider className={classes.divider} />
            </Hidden>
            <TableCell className={classes.tableCell}>
              <Typography className={classes.weight500} variant="subtitle1">
                {replacementRequest.offer?.name_override ||
                  replacementRequest.offer?.meta_activity?.name}
              </Typography>
            </TableCell>
          </>
        )}

        <TableCell className={classes.tableCell}>
          <div className={classes.level}>
            <LevelChip
              isChip
              customLevel={replacementRequest.offer.customLevel}
            />
          </div>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Typography variant="subtitle1">
            {replacementRequest.offer?.establishment?.title}
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
              className={classnames(
                classes.tableCell,
                classes.responsiveReason,
              )}
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
            {replacementRequest.status ===
              ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_TEACHER_FOUND && (
              <TableCell className={classes.tableCell}>
                <Typography>
                  {replacementRequest.offer.coach_override?.name}
                </Typography>
              </TableCell>
            )}
          </React.Fragment>
        )}
        {replacementDisplay ===
          ReplacementDisplays.REPLACEMENT_DISPLAY_MARKETPLACE && (
          <React.Fragment>
            <TableCell className={classes.tableCell}>
              <Typography>{replacementRequest.offer.coach?.name}</Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Typography>
                {moment(replacementRequest.closing_date).format('L - LT')}
              </Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <ReplacementRequestCoachAnswerButtons
                coachAnswer={
                  replacementRequest.coach_answer?.length > 0
                    ? replacementRequest.coach_answer[0].answer
                    : null
                }
                handleCoachAnswer={handleCoachAnswerWithReplacementRequest}
              />
            </TableCell>
          </React.Fragment>
        )}
        {replacementDisplay ===
          ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_ACTIONS && (
          <>
            <TableCell className={classes.tableCell}>
              <Typography>{replacementRequest.offer.coach?.name}</Typography>
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
                areClosed={moment().isAfter(replacementRequest.closing_date)}
                nbAnswers={(replacementRequest.coach_answer || []).length}
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
              <Typography>{replacementRequest.offer.coach?.name}</Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Typography>
                {replacementRequest.offer.coach_override?.name}
              </Typography>
            </TableCell>
          </>
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
