import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  open: boolean;
  data: {
    exists: boolean;
    status_code: number | null;
    member_pk: number | null;
    old_email: string | null;
    updated_email: string | null;
    error: boolean;
  };
  onConfirm: () => void;
  onCancel: () => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const MemberChangeEmailDialog = (props: Props) => {
  const { t, classes, data, onCancel, onConfirm } = props;
  if (!data.exists) {
    return null;
  }
  const warningText = () => {
    if (data.exists && data.member_pk) {
      return t('changeEmailRequest.dialog.mergeMember.warning');
    }
    if (data.exists && !data.member_pk && data.error) {
      return t('changeEmailRequest.dialog.simpleChange.warning');
    }
    return t('changeEmailRequest.dialog.linkMember.warning');
  };

  const securityHelperText = () => {
    if (data.exists && data.member_pk) {
      return '';
    }
    return `${t('changeEmailRequest.dialog.securityHelperText')}${'\u00A0'}`;
  };
  const securityText = () => {
    if (data.exists && data.member_pk) {
      return t('changeEmailRequest.dialog.mergeMember.unchangedEmail', {
        old_email: data.old_email,
        new_email: data.updated_email,
      });
    }
    if (data.exists && !data.member_pk && data.error) {
      return t('changeEmailRequest.dialog.simpleChange.unchangedEmail');
    }
    return t('changeEmailRequest.dialog.linkMember.unchangedEmail', {
      old_email: data.old_email,
    });
  };
  const renderTitle = () => {
    if (data.exists && !data.error) {
      return t('changeEmailRequest.dialog.titleMerge');
    }
    return t('changeEmailRequest.dialog.title');
  };
  return (
    <>
      <Dialog open={props.open} maxWidth="sm" fullWidth>
        <DialogTitle>{renderTitle()}</DialogTitle>
        <div className={classes.dialogContent}>
          <Typography variant="body1">{warningText()}</Typography>
          <div className={classes.emailDetail}>
            <Typography variant="body1">
              {t('changeEmailRequest.dialog.oldEmail', {
                email: data.old_email,
              })}
            </Typography>
          </div>
          <div className={classes.emailDetail}>
            <Typography variant="body1">
              {t('changeEmailRequest.dialog.newEmail', {
                email: data.updated_email,
              })}
            </Typography>
          </div>
          {data.exists && !data.member_pk && !data.error && (
            <div className={classes.helperContainer}>
              <Typography variant="body1">
                {t('changeEmailRequest.dialog.linkMember.notIncompany', {
                  new_email: data.updated_email,
                })}
              </Typography>
            </div>
          )}
          <div className={classes.helperContainer}>
            <Typography variant="body1">
              {`${securityHelperText()}${securityText()} `}
            </Typography>
            <div className={classes.cancelHelperText}>
              <Typography variant="body1">
                {t('changeEmailRequest.dialog.cancelHelperText')}
              </Typography>
            </div>
            <div className={classes.expiryContainer}>
              {!data.member_pk && (
                <Typography variant="body1">
                  {t('changeEmailRequest.dialog.expiryText')}
                </Typography>
              )}
            </div>
          </div>
        </div>
        <DialogActions>
          <Button onClick={() => onCancel()} variant="text" color="secondary">
            {t('changeEmailRequest.dialog.actions.close')}
          </Button>
          <Button
            onClick={() => onConfirm()}
            variant="contained"
            color="primary"
          >
            {t('changeEmailRequest.dialog.actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
const styles = (theme: Theme) => ({
  title: {
    padding: theme.spacing(2),
  },
  dialogContent: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
  dialogContentText: {
    color: 'black',
  },
  emailDetail: {
    display: 'flex',
    paddingLeft: theme.spacing(1),
    '&::before': {
      content: '"\u2022"',
      paddingRight: theme.spacing(1),
    },
  },
  helperContainer: {
    paddingTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  expiryContainer: {
    paddingTop: theme.spacing(4),
  },
  cancelHelperText: {
    paddingTop: theme.spacing(2),
  },
});
export default compose<any, OwnProps>(
  withTranslation('member'),
  withStyles(styles),
)(MemberChangeEmailDialog);
