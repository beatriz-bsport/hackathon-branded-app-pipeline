import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CirculareProgress from '@material-ui/core/CircularProgress';
import WarningIcon from '@material-ui/icons/Warning';
import red from '@material-ui/core/colors/red';
import { MaterialStyleType } from '../../../utils/types';
import { Member } from '../types';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  archiveMemberStatus: Array<number>;
  loading: boolean;
  member: Member;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const MemberArchiveDialog = (props: Props) => {
  const { t, open, onConfirm, onClose, archiveMemberStatus, loading, member } =
    props;
  const { classes } = props;
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>{t('archive.dialog.title')}</DialogTitle>
      {loading ? (
        <div className={classes.centerLoading}>
          <CirculareProgress size={30} color="primary" />
        </div>
      ) : (
        <div className={classes.dialogContent}>
          <DialogContentText className={classes.dialogContentText}>
            <div className={classes.helperText}>
              <Typography>{t('archive.dialog.helper_text_1')}</Typography>
            </div>
            <div className={classes.helperText}>
              <Typography>{t('archive.dialog.helper_text_2')}</Typography>
            </div>
          </DialogContentText>
          {!archiveMemberStatus || archiveMemberStatus?.length === 0 ? null : (
            <div className={classes.warningContainer}>
              <WarningIcon className={classes.warningIcon} />
              <div className={classes.warningTextContainer}>
                <Typography variant="caption">
                  {t('archive.dialog.warning.general')}
                </Typography>
                <div className={classes.warningMap}>
                  {archiveMemberStatus.map((identifier: number) => (
                    <div key={identifier} className={classes.warningItem}>
                      <Typography variant="caption">
                        {t(`archive.dialog.warning.${identifier}`)}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <DialogActions>
        <Button onClick={() => onClose()} variant="text" color="inherit">
          {t('archive.dialog.actions.close')}
        </Button>
        <Button
          onClick={() => onConfirm(member.id)}
          variant="contained"
          color="primary"
        >
          {t('archive.dialog.actions.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const styles = (theme: Theme) => ({
  dialogContent: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  dialogContentText: {
    color: 'black',
  },
  helperText: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  warningContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${red[500]}`,
    backgroundColor: red[50],
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
  },
  warningIcon: {
    marginRight: theme.spacing(1),
    color: red[500],
  },
  warningTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  warningMap: {
    paddingLeft: theme.spacing(2),
  },
  warningItem: {
    '&::before': {
      content: '"\u2022"',
      paddingRight: theme.spacing(1),
    },
  },
  centerLoading: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
});
export default compose<any, OwnProps>(
  withTranslation('member'),
  withStyles(styles),
)(MemberArchiveDialog);
