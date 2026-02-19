import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import clsx from 'clsx';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CircularProgress, useTheme } from '@material-ui/core/';

import ValidationIcon from '#src/components/icons/ValidationIcon.component';
import LevelChip from '#src/libs/level/components/Level.component';
import ReplacementRequestRegistrationsStatusChip from '#src/libs/replacement-request/components/replacement-request-table/ReplacementRequestRegistrationsStatusChip.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import { ReplacementRequest } from '#src/libs/replacement-request/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Level } from '#src/libs/level/types';
import CoachAvatar from '#src/libs/associated-coach/components/CoachAvatar.component';
import ReplacementRequestCoachAnswerTable from '../coach-answer-table/ReplacementRequestCoachAnswerTable.component';
import { OptionCallback } from '../../../../state/types';
import { formatISOStringAsTime } from '../../../../utils/datetime';

type Props = {
  open: boolean;
  replacementRequest: ReplacementRequest<
    Coach,
    Establishment,
    MetaActivity,
    number,
    number,
    number,
    Level
  >;
  coaches: Coach[];
  onClose: () => void;
  onSubmit: (
    requestId: number,
    answerId: number,
    options?: OptionCallback,
  ) => void;
  loading: boolean;
};

export const ReplacementRequestCoachAnswerDialog: React.FC<Props> = ({
  open,
  replacementRequest,
  coaches,
  onClose,
  onSubmit,
  loading,
}) => {
  const classes = useStyles();

  const [success, setSuccess] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [selectedCoachAnswer, setSelectedCoachAnswer] = React.useState(null);

  const { t } = useTranslation('replacement');

  const theme = useTheme();

  const handleSubmit = React.useCallback(() => {
    onSubmit(replacementRequest?.id, selectedCoachAnswer?.id, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  }, [onSubmit, replacementRequest, selectedCoachAnswer]);

  const handleClose = React.useCallback(() => {
    onClose();
    setSuccess(false);
  }, [onClose, setSuccess]);

  const handleCancelButton = React.useCallback(
    () => setConfirm(false),
    [setConfirm],
  );
  const handleAttribute = React.useCallback(
    (coachAnswer) => {
      setSelectedCoachAnswer(coachAnswer);
      setConfirm(true);
    },
    [setConfirm, setSelectedCoachAnswer],
  );

  if (!replacementRequest) return null;

  const coachAuthor =
    replacementRequest.coach_author &&
    typeof replacementRequest.coach_author === 'object'
      ? replacementRequest.coach_author
      : null;
  const coachAuthorName =
    coachAuthor?.name || replacementRequest.offer.coach?.name || '';

  if (success)
    return (
      <GenericResponsiveDialog maxWidth="sm" open={open}>
        <div className={classes.validationIcon}>
          <ValidationIcon color={theme.palette.success.main} />
        </div>
        <Typography
          className={clsx(classes.successTexts, classes.confirmAndSuccess)}
          variant="h6"
        >
          {t('coachAnswers.success.requestSent')}
        </Typography>
        <Typography
          className={clsx(classes.successTexts, classes.confirmAndSuccess)}
          variant="body1"
        >
          {t('coachAnswers.success.description', {
            coach: selectedCoachAnswer.coach.name,
            date: DateTime.fromISO(
              replacementRequest.offer.date_start,
            ).toLocaleString(DateTime.DATE_SHORT),
            time: formatISOStringAsTime(replacementRequest.offer.date_start),
          })}
        </Typography>
        <div className={classes.buttonContainer}>
          <Button className={classes.buttons} onClick={handleClose}>
            {t('coachAnswers.success.close')}
          </Button>
        </div>
      </GenericResponsiveDialog>
    );

  if (confirm)
    return (
      <GenericResponsiveDialog maxWidth="sm" open={open}>
        <Typography className={classes.confirmAndSuccess} variant="h6">
          {t('coachAnswers.confirmation.title')}
        </Typography>
        <Typography className={classes.confirmAndSuccess} variant="body1">
          {t('coachAnswers.confirmation.description', {
            coach_override: selectedCoachAnswer.coach.name,
            coach: coachAuthorName,
          })}
        </Typography>
        <div className={classes.buttonContainer}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Button className={classes.buttons} onClick={handleCancelButton}>
                {t('coachAnswers.confirmation.cancel')}
              </Button>
              <Button
                className={classes.buttons}
                color="primary"
                onClick={handleSubmit}
                variant="contained"
              >
                {t('coachAnswers.confirmation.confirm')}
              </Button>
            </>
          )}
        </div>
      </GenericResponsiveDialog>
    );

  return (
    <GenericResponsiveDialog maxWidth="sm" open={open}>
      <div className={classes.dateContainer}>
        <Typography variant="h6">
          {DateTime.fromISO(replacementRequest.offer.date_start).toFormat(
            'EEE d MMM',
          )}
        </Typography>
        <Typography className={classes.grey} variant="body2">
          {formatISOStringAsTime(replacementRequest.offer.date_start)} -{' '}
          {formatISOStringAsTime(
            DateTime.fromISO(replacementRequest.offer.date_start)
              .plus({ minute: replacementRequest.offer.duration_minute })
              .toISO(),
          )}
        </Typography>
      </div>
      <div className={classes.spaceBetween}>
        <Typography className={classes.weight500} variant="subtitle1">
          {replacementRequest?.offer?.name_override ||
            replacementRequest?.offer?.meta_activity.name}
        </Typography>
        <div className={classes.chipContainer}>
          <LevelChip
            isChip
            // @ts-expect-error
            customLevel={replacementRequest.offer.customLevel}
          />
        </div>
      </div>
      <div className={classes.flexRow}>
        <Typography>{replacementRequest.offer.establishment?.title}</Typography>
      </div>
      <div className={classes.flexRow}>
        <CoachAvatar coach={coachAuthor || replacementRequest.offer.coach} />
        <Typography className={classes.grey} variant="body2">
          {coachAuthorName}
        </Typography>
      </div>

      <div className={classes.responsiveContainer}>
        <div className={classes.responsiveSubContainer}>
          <div className={classes.row}>
            <Typography className={classes.weight500} variant="subtitle1">
              {t('coachAnswers.closing_date')}
            </Typography>
            <ReplacementRequestRegistrationsStatusChip
              floatChip
              areClosed={
                DateTime.now() >
                DateTime.fromISO(replacementRequest.closing_date)
              }
            />
          </div>
          <Typography className={clsx(classes.grey)} variant="body2">
            {DateTime.fromISO(replacementRequest.closing_date).toLocaleString(
              DateTime.DATE_SHORT,
            )}
          </Typography>
        </div>

        <div className={classes.responsiveSubContainer}>
          <Typography className={classes.weight500} variant="subtitle1">
            {t('coachAnswers.reason')}
          </Typography>
          <Typography className={clsx(classes.grey)} variant="body2">
            {`"${replacementRequest.reason}"`}
          </Typography>
        </div>
      </div>
      <ReplacementRequestCoachAnswerTable
        coaches={coaches}
        onAttribute={handleAttribute}
        // @ts-expect-error
        replacementRequestCoachAnswerList={replacementRequest.coach_answer}
      />
      <div className={classes.alignRight}>
        <Button className={classes.buttons} onClick={onClose}>
          {t('coachAnswers.close')}
        </Button>
      </div>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  grey: {
    color: theme.palette.grey[600],
  },
  container: {
    minWidth: '30%',
  },
  closingDate: {
    width: '100%',
  },
  dateContainer: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  chipContainer: {
    display: 'table',
  },
  spaceBetween: {
    margin: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
  flexRow: {
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  textField: {
    margin: theme.spacing(2),
  },
  alignRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  circularProgress: {
    margin: theme.spacing(1),
  },
  buttons: {
    margin: theme.spacing(1),
  },
  validationIcon: {
    paddingTop: theme.spacing(3),
    display: 'table',
    margin: 'auto',
  },
  successTexts: {
    textAlign: 'center',
  },
  confirmAndSuccess: {
    margin: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(3),
    paddingRight: theme.spacing(2),
  },
  weight500: { fontWeight: 500 },
  responsiveContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  responsiveSubContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

export default ReplacementRequestCoachAnswerDialog;
