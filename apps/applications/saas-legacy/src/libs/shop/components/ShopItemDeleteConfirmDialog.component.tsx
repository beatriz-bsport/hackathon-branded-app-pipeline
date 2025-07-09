import React from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import WarningIcon from '@material-ui/icons/Warning';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import RedButton from '#src/components/button/RedButton.component';
import { VALIDATION_DELAY } from '#src/libs/constants';

type Props = {
  open: boolean;
  shopItemName?: string;
  isUsedInCombo?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

export const ShopItemDeleteConfirmDialog: React.FC<Props> = ({
  open,
  shopItemName,
  isUsedInCombo,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation(['shop', 'common']);

  const classes = useStyles();

  return (
    <GenericResponsiveDialog maxWidth="sm" open={open}>
      <DialogTitle>
        {shopItemName
          ? t('shop:shopItemDetail.deleteModal.title', { name: shopItemName })
          : t('shop:shopItemDetail.deleteModal.genericTitle')}
      </DialogTitle>

      <DialogContent>
        {isUsedInCombo && (
          <DialogContentText className={classes.warningDelete}>
            <WarningIcon
              className={classes.warningIcon}
              color="error"
              fontSize="large"
            />
            <Typography>
              {t('shop:shopItemDetail.deleteModal.comboWarning')}
            </Typography>
          </DialogContentText>
        )}
        <DialogContentText>
          {t('shop:shopItemDetail.deleteModal.message')}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={onCancel}>
          {t('common:cancel')}
        </Button>
        <RedButton
          autoFocus
          color="primary"
          delayBeforeActivation={VALIDATION_DELAY}
          onClick={onSubmit}
        >
          {t('common:delete')}
        </RedButton>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  warningDelete: {
    display: 'flex',
  },
  warningIcon: {
    marginRight: theme.spacing(2),
  },
}));

export default React.memo(ShopItemDeleteConfirmDialog);
