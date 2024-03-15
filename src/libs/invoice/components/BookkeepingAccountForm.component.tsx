import React from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

import { FormikProps, withFormik } from 'formik';
import { Button, CircularProgress, DialogActions } from '@material-ui/core';
import * as Yup from 'yup';
import type { OptionCallback } from '#state/types';
import type {
  BookkeepingAccount,
  BookkeepingAccountSubmitParams,
} from '#libs/payment/types';
import NumericInput from '#components/input/NumericInput.component';

const validationSchema = Yup.object().shape({
  account_name: Yup.string().required('common:requiredField'),
  account_number: Yup.string().required('common:requiredField'),
  vat_rate: Yup.number()
    .min(0, 'common:positiveNumber')
    .typeError('common:numberRequired')
    .required('common:requiredField'),
});

export type BookkeepingAccountFormProps = {
  bookkeepingAccountToUpdate?: BookkeepingAccount;
  openBookkeepingAccountDialogForm: boolean;
  setOpenBookkeepingAccountDialogForm: (
    openBookkeepingAccountDialogForm: boolean,
  ) => void;
  fetchDisplayedBookkeepingAccounts: () => void;
  onCreateBookkeepingAccount: (
    data: BookkeepingAccountSubmitParams,
    options?: OptionCallback<BookkeepingAccount>,
  ) => void;
  onUpdateBookkeepingAccount: (
    id: number,
    data: BookkeepingAccountSubmitParams,
    options?: OptionCallback<BookkeepingAccount>,
  ) => void;
  isBookkeepingAccountsLoading: boolean;
  isUpdatingBookkeepingAccount: boolean;
};

type Props = Omit<
  BookkeepingAccountFormProps & FormikProps<BookkeepingAccountSubmitParams>,
  'createBookkeepingAccountOnSubmit'
>;

const BookkeepingAccountFormDialog: React.FC<Props> = ({
  values: { account_name, account_number, vat_rate },
  openBookkeepingAccountDialogForm,
  isBookkeepingAccountsLoading,
  touched,
  setOpenBookkeepingAccountDialogForm,
  handleSubmit,
  fetchDisplayedBookkeepingAccounts,
  setFieldValue,
  isUpdatingBookkeepingAccount,
  errors,
  resetForm,
}) => {
  const { t } = useTranslation(['establishment', 'common']);

  const disableSubmit = isBookkeepingAccountsLoading || !touched;

  const onClose = React.useCallback(() => {
    setOpenBookkeepingAccountDialogForm(false);
    resetForm();
  }, [setOpenBookkeepingAccountDialogForm, resetForm]);

  const onSubmit = React.useCallback(() => {
    handleSubmit();
    fetchDisplayedBookkeepingAccounts();
  }, [handleSubmit, fetchDisplayedBookkeepingAccounts]);

  const setFieldOnChange = React.useCallback(
    (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFieldValue(fieldName, value);
    },
    [setFieldValue],
  );

  return (
    <Dialog
      fullWidth
      aria-labelledby="bookkeeping-account-form"
      maxWidth="xs"
      onClose={onClose}
      open={openBookkeepingAccountDialogForm}
    >
      <DialogTitle id="bookkeeping-account-form">
        {isUpdatingBookkeepingAccount
          ? t('establishment:bookkeeping_account.form.titleUpdate')
          : t('establishment:bookkeeping_account.form.titleCreate')}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          disabled={isBookkeepingAccountsLoading}
          error={!!errors.account_number}
          helperText={errors?.account_number ? t(errors.account_number) : ''}
          id="bookkeeping_account_numbers"
          label={t('bookkeeping_account.account_number_required')}
          name="account_number"
          onChange={setFieldOnChange('account_number')}
          value={account_number}
        />
        <TextField
          fullWidth
          disabled={isBookkeepingAccountsLoading}
          error={!!errors.account_name}
          helperText={errors?.account_name ? t(errors.account_name) : ''}
          id="bookkeeping_account_name"
          label={t('establishment:bookkeeping_account.account_name_required')}
          name="account_name"
          onChange={setFieldOnChange('account_name')}
          value={account_name}
        />
        <NumericInput
          fullWidth
          disabled={isBookkeepingAccountsLoading}
          error={!!errors.vat_rate}
          helperText={errors?.vat_rate ? t(errors.vat_rate) : ''}
          id="bookkeeping_account_vat_rate"
          InputProps={{
            endAdornment: '%',
          }}
          label={t('establishment:bookkeeping_account.vat_rate')}
          name="vat_rate"
          onChange={setFieldOnChange('vat_rate')}
          value={parseFloat(vat_rate)}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" disabled={disableSubmit} onClick={onClose}>
          {t('common:cancel')}
        </Button>
        {isBookkeepingAccountsLoading ? (
          <CircularProgress size={35} />
        ) : (
          <Button autoFocus color="primary" onClick={onSubmit}>
            {t('common:save')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const formikFormWrapper = withFormik<
  BookkeepingAccountFormProps,
  BookkeepingAccountSubmitParams
>({
  enableReinitialize: true,
  mapPropsToValues: ({ bookkeepingAccountToUpdate }) => {
    return {
      account_name: bookkeepingAccountToUpdate?.account_name || '',
      account_number: bookkeepingAccountToUpdate?.account_number || '',
      vat_rate: bookkeepingAccountToUpdate?.vat_rate || '0',
    };
  },
  handleSubmit: (
    data,
    {
      props: {
        onCreateBookkeepingAccount,
        bookkeepingAccountToUpdate,
        onUpdateBookkeepingAccount,
        fetchDisplayedBookkeepingAccounts,
        setOpenBookkeepingAccountDialogForm,
      },
      resetForm,
    },
  ) => {
    if (bookkeepingAccountToUpdate) {
      onUpdateBookkeepingAccount(bookkeepingAccountToUpdate.id, data, {
        onSuccess: () => {
          fetchDisplayedBookkeepingAccounts();
          setOpenBookkeepingAccountDialogForm(false);
          resetForm();
        },
      });
    } else {
      onCreateBookkeepingAccount(data, {
        onSuccess: () => {
          fetchDisplayedBookkeepingAccounts();
          setOpenBookkeepingAccountDialogForm(false);
          resetForm();
        },
      });
    }
  },
  validationSchema,
});

export default formikFormWrapper(React.memo(BookkeepingAccountFormDialog));
