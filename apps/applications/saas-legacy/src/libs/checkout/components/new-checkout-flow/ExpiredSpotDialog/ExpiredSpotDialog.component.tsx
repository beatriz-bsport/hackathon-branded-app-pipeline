import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import CustomMuiIcon from '#src/components/icons/CustomMuiIcon.component';

export type Props = {
  open: boolean;
  handleClose: () => void;
  loading: boolean;
};

const ExpiredSpotDialog: React.FC<Props> = ({ open, handleClose, loading }) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles();

  return (
    <GenericResponsiveDialog
      fullScreenBreakpoint="xs"
      maxWidth="sm"
      open={open}
    >
      <div className={classes.container}>
        <CustomMuiIcon
          customClassName={classes.warningIcon}
          customColor="#ff9800"
          defaultBackGround={false}
          MuiIcon={WarningRoundedIcon}
        />
        <Typography className={classes.title} variant="h6">
          {t('expiredSpotDialog.title')}
        </Typography>
        <Typography>{t('expiredSpotDialog.message')}</Typography>

        <div className={classes.actionButtonContainer}>
          <Button
            className={classes.closeButton}
            color="primary"
            disabled={loading}
            onClick={handleClose}
            variant="contained"
          >
            {t('expiredSpotDialog.refresh')}
            {loading && (
              <CircularProgress
                className={classes.circularProgress}
                size="1rem"
              />
            )}
          </Button>
        </div>
      </div>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',

    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
    },
  },
  warningIcon: {
    height: theme.spacing(9),
    width: theme.spacing(9),
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
  },
  actionButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  closeButton: {
    borderRadius: theme.spacing(3),
  },
  title: { paddingBottom: theme.spacing(1) },
  circularProgress: {
    marginLeft: theme.spacing(1),
  },
}));

export default React.memo(ExpiredSpotDialog);
