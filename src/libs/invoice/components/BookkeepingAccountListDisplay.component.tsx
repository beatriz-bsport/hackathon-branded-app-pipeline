import React from 'react';
import { useTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import makeStyles from '@material-ui/core/styles/makeStyles';

import type { BookkeepingAccount } from '#libs/payment/types';
import InfoTypography from '#components/typo/InfoTypography.components';

export type BookkeepingAccountListDisplayProps = {
  setOpenBookkeepingAccountDialogForm: (open: boolean) => void;
  bookkeepingAccounts: BookkeepingAccount[];
  setBookkeepingAccountToUpdate: (
    bookkeepingAccount: BookkeepingAccount,
  ) => void;
  fetchLinkedProductNames: (bookkeepingAccountId: number) => void;
  setBookkeepingAccountToDelete: (
    bookkeepingAccount?: BookkeepingAccount,
  ) => void;
};

const BookkeepingAccountListDisplay: React.FC<
  BookkeepingAccountListDisplayProps
> = ({
  bookkeepingAccounts,
  setOpenBookkeepingAccountDialogForm,
  setBookkeepingAccountToUpdate,
  fetchLinkedProductNames,
  setBookkeepingAccountToDelete,
}) => {
  const hasBookkeepingAccounts =
    bookkeepingAccounts && bookkeepingAccounts.length !== 0;

  const classes = useStyles();
  const { t } = useTranslation('establishment');

  const getDeleteBookkeepingAccountOnClick = React.useCallback(
    (bookkeepingAccount: BookkeepingAccount) => () => {
      fetchLinkedProductNames(bookkeepingAccount.id);
      setBookkeepingAccountToDelete(bookkeepingAccount);
    },
    [fetchLinkedProductNames, setBookkeepingAccountToDelete],
  );

  const getEditBookkeepingAccountOnClick = React.useCallback(
    (id: number) => () => {
      setOpenBookkeepingAccountDialogForm(true);
      setBookkeepingAccountToUpdate(
        bookkeepingAccounts.find((b) => b.id === id),
      );
    },
    [
      setOpenBookkeepingAccountDialogForm,
      setBookkeepingAccountToUpdate,
      bookkeepingAccounts,
    ],
  );

  const createBookkeepingAccountOnClick = React.useCallback(() => {
    setOpenBookkeepingAccountDialogForm(true);
    setBookkeepingAccountToUpdate(null);
  }, [setOpenBookkeepingAccountDialogForm, setBookkeepingAccountToUpdate]);

  return (
    <Paper className={classes.paper}>
      <>
        <Typography className={classes.header} component="h3" variant="h6">
          {t('bookkeeping_account.header')}
        </Typography>
        {hasBookkeepingAccounts && (
          <Button
            color="primary"
            onClick={createBookkeepingAccountOnClick}
            variant="outlined"
          >
            <AddIcon />
            {t('bookkeeping_account.add')}
          </Button>
        )}
      </>
      {!hasBookkeepingAccounts && (
        <>
          <div className={classes.textAndIcon}>
            <InfoTypography
              content={t('bookkeeping_account.helperText')}
              variant="caption"
            />
          </div>
          <Button
            color="primary"
            onClick={createBookkeepingAccountOnClick}
            variant="outlined"
          >
            <AddIcon />
            {t('bookkeeping_account.add')}
          </Button>
        </>
      )}

      {hasBookkeepingAccounts && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('bookkeeping_account.account_number')}</TableCell>
              <TableCell>{t('bookkeeping_account.account_name')}</TableCell>
              <TableCell>{t('bookkeeping_account.vat_rate')}</TableCell>
              <TableCell align="center">
                {t('bookkeeping_account.table.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookkeepingAccounts.map((bookkeeping_account) => (
              <TableRow key={bookkeeping_account.id}>
                <TableCell>{bookkeeping_account.account_number}</TableCell>
                <TableCell> {bookkeeping_account.account_name}</TableCell>
                <TableCell>
                  {`${parseFloat(bookkeeping_account.vat_rate)}%`}
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={getEditBookkeepingAccountOnClick(
                      bookkeeping_account.id,
                    )}
                  >
                    <EditIcon color="primary" />
                  </Button>
                  <Button
                    onClick={getDeleteBookkeepingAccountOnClick(
                      bookkeeping_account,
                    )}
                  >
                    <DeleteIcon className={classes.greyIcon} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  chip: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  greyIcon: {
    color: theme.palette.grey[700],
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  textAndIcon: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
}));

export default React.memo(BookkeepingAccountListDisplay);
