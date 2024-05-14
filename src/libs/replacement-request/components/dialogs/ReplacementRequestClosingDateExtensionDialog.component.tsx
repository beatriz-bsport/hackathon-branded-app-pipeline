import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTheme } from '@material-ui/core/';
import CircularProgress from '@material-ui/core/CircularProgress';

import ValidationIcon from '#components/icons/ValidationIcon.component';
import UpdateIcon from '#components/icons/UpdateIcon.component';
import DateTimeInput from '#src/components/input/DateTimeInput.component';
import { ReplacementRequest } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level } from '#libs/level/types';
import { OptionCallback } from '../../../../state/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
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
  onClose: () => void;
  onSubmit: (id: number, date: string, options?: OptionCallback) => void;
  timezoneName: string;
  loading: boolean;
};

export const ReplacementRequestClosingDateExtensionDialog: React.FC<Props> = ({
  open,
  replacementRequest,
  onClose,
  onSubmit,
  timezoneName,
  loading,
}) => {
  const classes = useStyles();

  const [date, setDate] = React.useState<DateTime | null>(
    replacementRequest
      ? DateTime.fromISO(replacementRequest.closing_date)
      : null,
  );
  const [success, setSuccess] = React.useState(false);

  const { t } = useTranslation('replacement');

  const theme = useTheme();

  const handleSubmit = () => {
    onSubmit(
      replacementRequest.id,
      date ? date.toISO() : DateTime.now().toISO(),
      {
        onSuccess: () => {
          setSuccess(true);
        },
      },
    );
  };

  const handleClose = () => onClose();

  const handleChange = React.useCallback(
    (newDate: DateTime) => setDate(newDate),
    [setDate],
  );

  React.useEffect(() => {
    setDate(
      replacementRequest
        ? DateTime.fromISO(replacementRequest.closing_date)
        : DateTime.now(),
    );
  }, [replacementRequest]);

  if (!replacementRequest) return null;

  if (success)
    return (
      <GenericResponsiveDialog maxWidth="sm" open={open}>
        <div className={classes.validationIcon}>
          <ValidationIcon color={theme.palette.success.main} />
        </div>
        <Typography className={classes.successTexts} variant="h6">
          {t('askForClosingDateExtension.requestSent')}
        </Typography>
        <Typography className={classes.successTexts} variant="body1">
          {t('askForClosingDateExtension.requestSentDescription')}
        </Typography>
        <div className={classes.alignMiddle}>
          <Button className={classes.buttons} onClick={handleClose}>
            {t('askForClosingDateExtension.close')}
          </Button>
        </div>
      </GenericResponsiveDialog>
    );

  return (
    <GenericResponsiveDialog maxWidth="sm" open={open}>
      <div className={classes.validationIcon}>
        <UpdateIcon />
      </div>
      <Typography className={classes.centered} variant="h6">
        {t('askForClosingDateExtension.title')}
      </Typography>
      <Typography className={classes.centered} variant="body1">
        {t('askForClosingDateExtension.description', {
          closing_date: DateTime.fromISO(
            replacementRequest.closing_date,
          ).toFormat('DDD t'),
        })}
      </Typography>
      <div className={classes.marginLeft}>
        <Typography variant="subtitle1">
          {DateTime.fromISO(replacementRequest.offer.date_start).toFormat(
            'EEE d MMM',
          )}
        </Typography>
        <Typography className={classes.grey} variant="body2">
          {formatISOStringAsTime(replacementRequest.offer.date_start)} -{' '}
          {formatISOStringAsTime(
            DateTime.fromISO(replacementRequest.offer.date_start)
              .plus({
                minute: replacementRequest.offer.duration_minute,
              })
              .toISO(),
          )}
        </Typography>
      </div>
      <div className={classes.marginLeft}>
        <DateTimeInput
          separateInputs
          label={t('askForClosingDateExtension.closing_date')}
          maxDate={DateTime.fromISO(
            replacementRequest.offer.date_start,
          ).toISODate()}
          minDate={DateTime.fromISO(
            replacementRequest.closing_date,
          ).toISODate()}
          onChange={handleChange}
          timezone={timezoneName}
          value={date}
        />
      </div>
      <Typography className={classes.marginLeft} variant="body1">
        {t('askForClosingDateExtension.new_closing_date', {
          closing_date: date.toLocaleString(DateTime.DATE_FULL),
          time: formatISOStringAsTime(date.toISO()),
        })}
      </Typography>
      <div className={classes.alignRight}>
        {loading ? (
          <CircularProgress className={classes.circularProgress} />
        ) : (
          <>
            <Button className={classes.buttons} onClick={onClose}>
              {t('askForClosingDateExtension.cancel')}
            </Button>
            <Button
              className={classes.buttons}
              color="primary"
              onClick={handleSubmit}
              variant="contained"
            >
              {t('askForClosingDateExtension.submit')}
            </Button>
          </>
        )}
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
  centered: {
    margin: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    textAlign: 'center',
  },
  marginLeft: {
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(2),
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
    margin: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    textAlign: 'center',
  },
  alignMiddle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
}));

export default ReplacementRequestClosingDateExtensionDialog;
