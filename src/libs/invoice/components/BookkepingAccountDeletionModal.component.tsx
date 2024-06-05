import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { useTranslation } from 'react-i18next';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import type { OptionCallback } from '#src/state/types';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import RedButton from '#src/components/button/RedButton.component';

export type BookkepingAccountDeletionModalProps = {
  bookkeepingAccountToDelete: BookkeepingAccount | null;
  fetchDisplayedBookkeepingAccounts: () => void;
  isLoading: boolean;
  linkedProductNames?: string[];
  onDeleteBookkeepingAccount: (
    id: number,
    options: OptionCallback<number>,
  ) => void;
  setBookkeepingAccountToDelete: (
    bookkeepingAccount: BookkeepingAccount | null,
  ) => void;
};

const ModalDialogContent: React.FC<{
  isLoading: boolean;
  linkedProductNames?: string[];
  classes: ReturnType<typeof useStyles>;
}> = ({ isLoading, linkedProductNames, classes }) => {
  const { t } = useTranslation('establishment');

  if (isLoading) {
    return (
      <div className={classes.container}>
        <CircularProgress />
      </div>
    );
  }
  if (linkedProductNames && linkedProductNames.length > 0) {
    return (
      <DialogContentText>
        {t('bookkeeping_account.modal.delete.contentLinked')}
        <List className={classes.list}>
          {linkedProductNames.map((name, index) => (
            <ListItemText key={index} className={classes.listItem}>
              {name}
            </ListItemText>
          ))}
        </List>
      </DialogContentText>
    );
  }

  return (
    <DialogContentText>
      {t('bookkeeping_account.modal.delete.content')}
    </DialogContentText>
  );
};

const BookkepingAccountDeletionModal: React.FC<
  BookkepingAccountDeletionModalProps
> = ({
  bookkeepingAccountToDelete,
  fetchDisplayedBookkeepingAccounts,
  isLoading,
  linkedProductNames,
  onDeleteBookkeepingAccount,
  setBookkeepingAccountToDelete,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('establishment');

  const handleCancel = React.useCallback(() => {
    setBookkeepingAccountToDelete(null);
  }, [setBookkeepingAccountToDelete]);

  const handleDeletion = React.useCallback(() => {
    if (bookkeepingAccountToDelete) {
      onDeleteBookkeepingAccount(bookkeepingAccountToDelete.id, {
        onSuccess: () => {
          fetchDisplayedBookkeepingAccounts();
        },
      });
    }
    setBookkeepingAccountToDelete(null);
  }, [
    bookkeepingAccountToDelete,
    fetchDisplayedBookkeepingAccounts,
    onDeleteBookkeepingAccount,
    setBookkeepingAccountToDelete,
  ]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleCancel}
      open={!!bookkeepingAccountToDelete}
      scroll="paper"
    >
      <DialogTitle>{t('bookkeeping_account.modal.delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <ModalDialogContent
            classes={classes}
            isLoading={isLoading}
            linkedProductNames={linkedProductNames}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
          {t('bookkeeping_account.modal.delete.cancel')}
        </Button>

        <RedButton
          color="primary"
          disabled={isLoading || linkedProductNames?.length > 0}
          onClick={handleDeletion}
        >
          {t('bookkeeping_account.modal.delete.confirm')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  list: {
    listStyleType: 'disc',
  },
  listItem: {
    display: 'list-item',
    margin: theme.spacing(0, 2),
  },
}));

export default React.memo(BookkepingAccountDeletionModal);
