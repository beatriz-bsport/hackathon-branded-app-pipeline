import React from 'react';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

import type { Cadence } from '#libs/sequential_marketing/types';

type Props = {
  open: boolean;
  cadence: Cadence | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export const CadenceArchivedDialog: React.FC<Props> = ({
  open,
  cadence,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  return (
    <GenericResponsiveDialog open={open} maxWidth="sm">
      <div className={classes.container}>
        <div className={classes.paddingBottom}>
          <div className={classes.largeIconContainer}>
            <DeleteIcon color="error" className={classes.largeIcon} />
          </div>
        </div>
        <Typography variant="h6" className={classes.paddingBottom}>
          {t('cadence.archive.dialog.title')}
        </Typography>
        <Typography variant="body1" align="center">
          {t('cadence.archive.dialog.beingArchived', { name: cadence?.name })}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          className={classes.paddingBottom}
        >
          {t('cadence.archive.dialog.helper', { name: cadence?.name })}
        </Typography>
        <div className={classes.actions}>
          <Button onClick={onCancel} variant="text">
            {t('cadence.archive.dialog.cancel')}
          </Button>
          <Button onClick={onConfirm} variant="contained" color="primary">
            {t('cadence.archive.dialog.confirm')}
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
    backgroundColor: '#FFF0EF',
    width: '110px',
    height: '110px',
  },
  largeIcon: {
    fontSize: '4rem',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
}));

export default CadenceArchivedDialog;
