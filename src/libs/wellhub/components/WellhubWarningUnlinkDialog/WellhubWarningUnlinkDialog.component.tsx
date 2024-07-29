import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { Alert, AlertTitle } from '@material-ui/lab';

type Props = {
  isDeletion: boolean;
  isOpen: boolean;
  goBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

const WellhubWarningUnlinkDialog: React.FC<Props> = ({
  isDeletion,
  isOpen,
  goBack,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();

  const title = React.useMemo(
    () =>
      isDeletion
        ? t('wellhub.configuration.dialog.title.deletion')
        : t('wellhub.configuration.dialog.title.edition'),
    [isDeletion, t],
  );

  const cancelButtonLabel = React.useMemo(
    () =>
      isDeletion
        ? t('wellhub.configuration.dialog.action.cancel')
        : t('wellhub.configuration.dialog.action.back'),
    [isDeletion, t],
  );

  const handleCancel = React.useCallback(() => {
    isDeletion ? onClose() : goBack();
  }, [goBack, isDeletion, onClose]);

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={onClose} open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Alert severity="error">
          <AlertTitle>
            {t('wellhub.configuration.dialog.unlink.title')}
          </AlertTitle>
          {t('wellhub.configuration.dialog.unlink.text')}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button className={classes.cancelButton} onClick={handleCancel}>
          {cancelButtonLabel}
        </Button>
        <Button color="primary" onClick={onConfirm}>
          {t('wellhub.configuration.dialog.action.confirm')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  listSubHeader: {
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(0.5),
    paddingLeft: 0,
  },
  cancelButton: {
    color: theme.palette.grey[600],
  },
  establishmentsField: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export default React.memo(WellhubWarningUnlinkDialog);
