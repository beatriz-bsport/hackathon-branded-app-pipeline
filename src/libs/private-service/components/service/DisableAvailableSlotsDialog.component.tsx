import React from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import makeStyles from '@material-ui/core/styles/makeStyles';

type Props = {
  isOpen: boolean;
  isSubmitting: boolean;
  onDoItLater: () => void;
  onSubmit: () => void;
};

const DisableAvailableSlotsDialog: React.FC<Props> = (props) => {
  const { t } = useTranslation('privateService');

  const classes = useStyles();

  return (
    <GenericResponsiveDialog maxWidth="sm" open={props.isOpen}>
      <DialogTitle>{t('service.form.editConfirmation.title')}</DialogTitle>
      <DialogContent className={classes.contentContainer}>
        <Typography variant="body1">
          {t('service.form.editConfirmation.content')}
        </Typography>
        <Alert severity="info">
          {t('service.form.editConfirmation.alert')}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onDoItLater}>
          {t('service.form.editConfirmation.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={props.isSubmitting}
          onClick={props.onSubmit}
          variant="outlined"
        >
          {t('service.form.editConfirmation.confirm')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default React.memo(DisableAvailableSlotsDialog);
