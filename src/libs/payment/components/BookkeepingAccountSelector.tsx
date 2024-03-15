import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import type { BookkeepingAccount } from '../types';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '../constants';

type Choice = {
  label: string;
  value: number;
};
type Props = {
  bookkeepingAccounts: BookkeepingAccount[];
  bookkeepingAccountById: Record<number, BookkeepingAccount>;
  selectedBookkeepingAccountId?: number;
  setFieldValue: (bookkeepingAccountId: number) => void;
};

const getBookkeepingAccountChoice = (ba: BookkeepingAccount): Choice => ({
  label: `${ba.account_name} (${parseFloat(ba.vat_rate)}%)`,
  value: ba.id,
});

const BookkeepingAccountSelector: React.FC<Props> = ({
  bookkeepingAccounts,
  selectedBookkeepingAccountId,
  bookkeepingAccountById,
  setFieldValue,
}) => {
  const { t } = useTranslation('establishment');
  const classes = useStyles();

  const onBookkeepingAccountChange = React.useCallback(
    (value: Choice | null) => {
      const bookkeepingAccountId = value?.value ?? null;
      setFieldValue(bookkeepingAccountId);
    },
    [setFieldValue],
  );

  const bookkeepingAccountChoices: Choice[] = React.useMemo(
    () =>
      Object.values(
        (bookkeepingAccounts || []).map((ba) =>
          getBookkeepingAccountChoice(ba),
        ),
      ),
    [bookkeepingAccounts],
  );

  if (!IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED) {
    return null;
  }

  const currentValue =
    bookkeepingAccountById &&
    bookkeepingAccountById[selectedBookkeepingAccountId]
      ? getBookkeepingAccountChoice(
          bookkeepingAccountById[selectedBookkeepingAccountId],
        )
      : null;
  return (
    <>
      <Typography className={classes.title} component="h4">
        {t('bookkeeping_account.select_input.label')}
      </Typography>
      <MaterialUISelector
        isClearable
        onChange={onBookkeepingAccountChange}
        options={bookkeepingAccountChoices}
        placeholder={t('bookkeeping_account.select_input.placeholder')}
        value={currentValue}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(BookkeepingAccountSelector);
