// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTheme } from '@material-ui/core/';
import CircularProgress from '@material-ui/core/CircularProgress';

import ValidationIcon from '#components/icons/ValidationIcon.component';
import UpdateIcon from '#components/icons/UpdateIcon.component';
import DateTimeInput from '#components/input/DateTimeInput.component';
import { ReplacementRequest } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level } from '#libs/level/types';
import { OptionCallback } from '../../../../state/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import {
  formatAsDatetimeAdapted,
  formatAsTime,
} from '../../../../utils/datetime';

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

  const [date, setDate] = React.useState(
    replacementRequest?.closing_date || null,
  );
  const [success, setSuccess] = React.useState(false);

  const { t } = useTranslation('replacement');

  const theme = useTheme();

  const handleSubmit = () => {
    onSubmit(replacementRequest.id, moment(date).format(), {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  };

  const handleClose = () => onClose();

  const handleChange = React.useCallback(
    (new_date: string) => setDate(new_date),
    [setDate],
  );

  React.useEffect(() => {
    setDate(replacementRequest?.closing_date || null);
  }, [replacementRequest]);

  if (!replacementRequest) return null;

  if (success)
    return (
      <GenericResponsiveDialog open={open} maxWidth="sm">
        <div className={classes.validationIcon}>
          <ValidationIcon color={theme.palette.success.main} />
        </div>
        <Typography variant="h6" className={classes.successTexts}>
          {t('askForClosingDateExtension.requestSent')}
        </Typography>
        <Typography variant="body1" className={classes.successTexts}>
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
    <GenericResponsiveDialog open={open} maxWidth="sm">
      <div className={classes.validationIcon}>
        <UpdateIcon />
      </div>
      <Typography variant="h6" className={classes.centered}>
        {t('askForClosingDateExtension.title')}
      </Typography>
      <Typography variant="body1" className={classes.centered}>
        {t('askForClosingDateExtension.description', {
          closing_date: moment(replacementRequest.closing_date).format('LL LT'),
        })}
      </Typography>
      <div className={classes.marginLeft}>
        <Typography variant="subtitle1">
          {moment(replacementRequest.offer.date_start).format('ddd D MMM')}
        </Typography>
        <Typography variant="body2" className={classes.grey}>
          {formatAsTime(replacementRequest.offer.date_start)} -{' '}
          {formatAsTime(
            moment(replacementRequest.offer.date_start).add(
              replacementRequest.offer.duration_minute,
              'minutes',
            ),
          )}
        </Typography>
      </div>
      <div className={classes.marginLeft}>
        <DateTimeInput
          label={t('askForClosingDateExtension.closing_date')}
          value={date}
          onChange={handleChange}
          className={classes.marginLeft}
          timezone={timezoneName}
          minDate={moment(replacementRequest.closing_date).format('YYYY-MM-DD')}
          maxDate={moment(replacementRequest.offer.date_start).format(
            'YYYY-MM-DD',
          )}
          separateInputs
        />
      </div>
      <Typography variant="body1" className={classes.marginLeft}>
        {t('askForClosingDateExtension.new_closing_date', {
          closing_date: formatAsDatetimeAdapted(date, 'LL'),
          time: formatAsTime(date),
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
              onClick={handleSubmit}
              color="primary"
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
