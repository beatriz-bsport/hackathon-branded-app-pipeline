import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createTheme';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useTranslation } from 'react-i18next';
import ToolTip from '#src/components/Tooltip.component';
import { snackbarSuccess } from '#src/libs/snackbar/actions';

const useStyles = makeStyles((theme: Theme) => ({
  urlContainer: {
    marginTop: theme.spacing(2),
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
  calendarUrl: string;
}

const SyncCalendarDialog: React.FC<Props> = ({
  open,
  onClose,
  calendarUrl,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['privateService']);
  const dispatch = useDispatch();

  const handleCopyCalendarUrl = () => {
    navigator.clipboard
      .writeText(calendarUrl)
      .then(() => {
        dispatch(snackbarSuccess('calendar.syncCalendarDialog.copySuccess'));
        onClose();
      })
      .catch(() => {
        // Fallback if clipboard API fails
        prompt(t('calendar.syncCalendarDialog.copyInstruction'), calendarUrl);
      });
  };

  return (
    <Dialog maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>{t('calendar.syncCalendarDialog.title')}</DialogTitle>
      <DialogContent>
        <Typography paragraph variant="body1">
          {t('calendar.syncCalendarDialog.description')}
        </Typography>
        <Typography paragraph variant="body2">
          <strong>{t('calendar.syncCalendarDialog.instructionsTitle')}</strong>
        </Typography>
        <Typography component="ul" variant="body2">
          <li>
            <strong>{t('calendar.syncCalendarDialog.google.title')}</strong>
            {t('calendar.syncCalendarDialog.google.instructions')}
          </li>
          <li>
            <strong>{t('calendar.syncCalendarDialog.apple.title')}</strong>
            {t('calendar.syncCalendarDialog.apple.instructions')}
          </li>
        </Typography>
        <div className={classes.urlContainer}>
          <TextField
            fullWidth
            InputProps={{
              endAdornment: (
                <ToolTip
                  title={t('calendar.syncCalendarDialog.copyButton') as string}
                >
                  <IconButton color="primary" onClick={handleCopyCalendarUrl}>
                    <FileCopyIcon />
                  </IconButton>
                </ToolTip>
              ),
              readOnly: true,
            }}
            value={calendarUrl}
            variant="outlined"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          {t('calendar.syncCalendarDialog.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SyncCalendarDialog;
