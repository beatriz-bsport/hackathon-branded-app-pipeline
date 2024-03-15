import React from 'react';

import type { OptionCallback } from '../../../state/types';
import type {
  BookkeepingAccount,
  BookkeepingAccountSubmitParams,
} from '#libs/payment/types';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#libs/payment/constants';

import BookkeepingAccountForm from './BookkeepingAccountForm.component';
import BookkeepingAccountListDisplay from './BookkeepingAccountListDisplay.component';
import BookkepingAccountDeletionModal from './BookkepingAccountDeletionModal.component';

type Props = {
  bookkeepingAccounts: BookkeepingAccount[];
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
  onDeleteBookkeepingAccount: (
    id: number,
    options: OptionCallback<number>,
  ) => void;
  fetchLinkedProductNames: (bookkeepingAccountId: number) => void;
  linkedProductNames?: string[];
};

const BookkeepingAccountSection: React.FC<Props> = ({
  bookkeepingAccounts,
  fetchDisplayedBookkeepingAccounts,
  onDeleteBookkeepingAccount,
  onCreateBookkeepingAccount,
  onUpdateBookkeepingAccount,
  isBookkeepingAccountsLoading,
  fetchLinkedProductNames,
  linkedProductNames,
}) => {
  const [
    openBookkeepingAccountDialogForm,
    setOpenBookkeepingAccountDialogForm,
  ] = React.useState(false);

  const [bookkeepingAccountToUpdate, setBookkeepingAccountToUpdate] =
    React.useState<BookkeepingAccount | null>(null);

  const [bookkeepingAccountToDelete, setBookkeepingAccountToDelete] =
    React.useState<BookkeepingAccount | null>(null);
  if (!IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED) {
    return null;
  }

  return (
    <div>
      <BookkeepingAccountForm
        bookkeepingAccountToUpdate={bookkeepingAccountToUpdate}
        fetchDisplayedBookkeepingAccounts={fetchDisplayedBookkeepingAccounts}
        isBookkeepingAccountsLoading={isBookkeepingAccountsLoading}
        isUpdatingBookkeepingAccount={!!bookkeepingAccountToUpdate}
        onCreateBookkeepingAccount={onCreateBookkeepingAccount}
        onUpdateBookkeepingAccount={onUpdateBookkeepingAccount}
        openBookkeepingAccountDialogForm={openBookkeepingAccountDialogForm}
        setOpenBookkeepingAccountDialogForm={
          setOpenBookkeepingAccountDialogForm
        }
      />
      <BookkeepingAccountListDisplay
        bookkeepingAccounts={bookkeepingAccounts}
        fetchLinkedProductNames={fetchLinkedProductNames}
        setBookkeepingAccountToDelete={setBookkeepingAccountToDelete}
        setBookkeepingAccountToUpdate={setBookkeepingAccountToUpdate}
        setOpenBookkeepingAccountDialogForm={
          setOpenBookkeepingAccountDialogForm
        }
      />
      <BookkepingAccountDeletionModal
        bookkeepingAccountToDelete={bookkeepingAccountToDelete}
        fetchDisplayedBookkeepingAccounts={fetchDisplayedBookkeepingAccounts}
        isLoading={isBookkeepingAccountsLoading}
        linkedProductNames={linkedProductNames}
        onDeleteBookkeepingAccount={onDeleteBookkeepingAccount}
        setBookkeepingAccountToDelete={setBookkeepingAccountToDelete}
      />
    </div>
  );
};

export default React.memo(BookkeepingAccountSection);
