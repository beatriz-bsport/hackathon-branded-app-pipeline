import React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
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
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  urlContainer: {
    marginTop: theme.spacing(2),
  },
});

interface Props extends WithStyles<typeof styles>, WithTranslation {
  open: boolean;
  onClose: () => void;
  calendarUrl: string;
}

class SyncCalendarDialog extends React.PureComponent<Props> {
  handleCopyCalendarUrl = () => {
    navigator.clipboard
      .writeText(this.props.calendarUrl)
      .then(() => {
        alert('Calendar URL copied to clipboard!');
      })
      .catch(() => {
        // Fallback if clipboard API fails
        prompt('Copy this URL:', this.props.calendarUrl);
      });
  };

  render() {
    const { classes, open, onClose, calendarUrl } = this.props;

    return (
      <Dialog maxWidth="sm" onClose={onClose} open={open}>
        <DialogTitle>
          {this.props.t('calendar.syncCalendarDialog.title')}
        </DialogTitle>
        <DialogContent>
          <Typography paragraph variant="body1">
            {this.props.t('calendar.syncCalendarDialog.description')}
          </Typography>
          <Typography paragraph variant="body2">
            <strong>
              {this.props.t('calendar.syncCalendarDialog.instructionsTitle')}
            </strong>
          </Typography>
          <Typography component="ul" variant="body2">
            <li>
              <strong>
                {this.props.t('calendar.syncCalendarDialog.google.title')}
              </strong>
              {this.props.t('calendar.syncCalendarDialog.google.instructions')}
            </li>
            <li>
              <strong>
                {this.props.t('calendar.syncCalendarDialog.apple.title')}
              </strong>
              {this.props.t('calendar.syncCalendarDialog.apple.instructions')}
            </li>
          </Typography>
          <div className={classes.urlContainer}>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={this.handleCopyCalendarUrl}
                  >
                    <FileCopyIcon />
                  </IconButton>
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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(SyncCalendarDialog);
