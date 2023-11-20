import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const CadenceActivateDialog: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  return (
    <GenericResponsiveDialog maxWidth="xs" open={open}>
      <div className={classes.container}>
        <div className={classes.paddingBottom}>
          <div className={classes.largeIconContainer}>
            <PlayArrowIcon className={classes.largeIcon} />
          </div>
        </div>
        <Typography className={classes.paddingBottom} variant="h6">
          {t('audience.activate.dialog.title')}
        </Typography>
        <Typography align="center" variant="body1">
          {t('audience.activate.dialog.firstHelper')}
        </Typography>
        <Typography
          align="center"
          className={classes.paddingBottom}
          variant="body1"
        >
          {t('cadence.activate.dialog.secondHelper')}
        </Typography>
        <div className={classes.actions}>
          <Button onClick={onCancel} variant="text">
            {t('cadence.activate.dialog.cancel')}
          </Button>
          <Button color="primary" onClick={onConfirm} variant="contained">
            {t('cadence.activate.button')}
          </Button>
        </div>
      </div>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  paddingBottom: {
    paddingBottom: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
  },
  largeIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    backgroundColor: '#F1F9F1',
    width: '110px',
    height: '110px',
  },
  largeIcon: {
    fontSize: '4rem',
    color: green[500],
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
}));

export default CadenceActivateDialog;
