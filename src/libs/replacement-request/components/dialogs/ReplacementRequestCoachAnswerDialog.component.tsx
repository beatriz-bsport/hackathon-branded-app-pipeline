import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CircularProgress, useTheme } from '@material-ui/core/';

import ValidationIcon from '#components/icons/ValidationIcon.component';
import LevelChip from '#libs/level/components/Level.component';
import ReplacementRequestRegistrationsStatusChip from '#libs/replacement-request/components/replacement-request-table/ReplacementRequestRegistrationsStatusChip.component';
import ReplacementRequestCoachAnswerTable from '../coach-answer-table/ReplacementRequestCoachAnswerTable.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

import { ReplacementRequest } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level } from '#libs/level/types';
import CoachAvatar from '#libs/associated-coach/components/CoachAvatar.component';
import { OptionCallback } from '../../../../state/types';

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

  if (success)
    return (
      <GenericResponsiveDialog open={open} maxWidth="sm">
        <div className={classes.validationIcon}>
          <ValidationIcon color={theme.palette.success.main} />
        </div>
        <Typography
          variant="h6"
          className={classnames(
            classes.successTexts,
            classes.confirmAndSuccess,
          )}
        >
          {t('coachAnswers.success.requestSent')}
        </Typography>
        <Typography
          variant="body1"
          className={classnames(
            classes.successTexts,
            classes.confirmAndSuccess,
          )}
        >
          {t('coachAnswers.success.description', {
            coach: selectedCoachAnswer.coach.name,
            date: moment(replacementRequest.offer.date_start).format('L'),
            time: moment(replacementRequest.offer.date_start).format('LT'),
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
      <GenericResponsiveDialog open={open} maxWidth="sm">
        <Typography variant="h6" className={classes.confirmAndSuccess}>
          {t('coachAnswers.confirmation.title')}
        </Typography>
        <Typography variant="body1" className={classes.confirmAndSuccess}>
          {t('coachAnswers.confirmation.description', {
            coach_override: selectedCoachAnswer.coach.name,
            coach: replacementRequest.offer.coach.name,
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
                onClick={handleSubmit}
                color="primary"
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
    <GenericResponsiveDialog open={open} maxWidth="sm">
      <div className={classes.dateContainer}>
        <Typography variant="h6">
          {moment(replacementRequest.offer.date_start).format('ddd D MMM')}
        </Typography>
        <Typography variant="body2" className={classes.grey}>
          {moment(replacementRequest.offer.date_start).format('LT')} -{' '}
          {moment(replacementRequest.offer.date_start)
            .add(replacementRequest.offer.duration_minute, 'minutes')
            .format('LT')}
        </Typography>
      </div>
      <div className={classes.spaceBetween}>
        <Typography variant="subtitle1" className={classes.weight500}>
          {replacementRequest.offer.meta_activity.name}
        </Typography>
        <div className={classes.chipContainer}>
          <LevelChip
            customLevel={replacementRequest.offer.customLevel}
            isChip
          />
        </div>
      </div>
      <div className={classes.flexRow}>
        <CoachAvatar coach={replacementRequest.offer.coach} />
        <Typography variant="body2" className={classes.grey}>
          {replacementRequest.offer.coach.name}
        </Typography>
      </div>

      <div className={classes.responsiveContainer}>
        <div className={classes.responsiveSubContainer}>
          <div className={classes.row}>
            <Typography variant="subtitle1" className={classes.weight500}>
              {t('coachAnswers.closing_date')}
            </Typography>
            <ReplacementRequestRegistrationsStatusChip
              areClosed={moment().isAfter(replacementRequest.closing_date)}
              floatChip
            />
          </div>
          <Typography variant="body2" className={classnames(classes.grey)}>
            {moment(replacementRequest.closing_date).format('L')}
          </Typography>
        </div>

        <div className={classes.responsiveSubContainer}>
          <Typography variant="subtitle1" className={classes.weight500}>
            {t('coachAnswers.reason')}
          </Typography>
          <Typography variant="body2" className={classnames(classes.grey)}>
            {`"${replacementRequest.reason}"`}
          </Typography>
        </div>
      </div>
      <ReplacementRequestCoachAnswerTable
        coaches={coaches}
        replacementRequestCoachAnswerList={replacementRequest.coach_answer}
        onAttribute={handleAttribute}
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
