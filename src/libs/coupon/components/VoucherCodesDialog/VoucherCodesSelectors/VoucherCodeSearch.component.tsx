import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import DelayedTextField from '#components/DelayedTextField.component';

type Props = {
  allCodes: string[];
  setCodes: React.Dispatch<React.SetStateAction<string[]>>;
};

const VoucherCodeSearch: React.FC<Props> = ({ allCodes, setCodes }) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();

  const [searchInput, setSearchInput] = useState('');

  const handleOnChangeSearch = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setSearchInput(event.target.value);
    },
    [],
  );

  const filterCodes = useCallback(() => {
    if (!allCodes) return;
    const filteredCodes =
      allCodes.filter((code) => code.includes(searchInput)) ?? [];
    setCodes(filteredCodes);
  }, [setCodes, searchInput, allCodes]);

  const handleOnResetSearch = useCallback(() => {
    setSearchInput('');
    setCodes(allCodes);
  }, [setSearchInput, setCodes, allCodes]);

  const inputProps = useMemo(
    () => ({
      className: classes.input,
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
      endAdornment: searchInput ? (
        <InputAdornment position="end">
          <IconButton
            aria-label={searchInput ? 'Clear search' : 'Search'}
            onClick={handleOnResetSearch}
          >
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      ) : null,
    }),
    [classes.input, handleOnResetSearch, searchInput],
  );

  useEffect(() => {
    filterCodes();
  }, [searchInput, filterCodes]);

  return (
    <DelayedTextField
      fullWidth
      className={classes.textField}
      InputProps={inputProps}
      onChange={handleOnChangeSearch}
      placeholder={t(
        'uniqueCodeCoupon.voucherCodesDialog.searchBar.placeHolder',
      )}
      size="small"
      value={searchInput}
      variant="outlined"
    />
  );
};

const useStyles = makeStyles((theme) => ({
  input: {
    height: theme.spacing(7),
  },
  textField: {
    backgroundColor: theme.palette.grey[50],
    borderColor: theme.palette.grey[300],
  },
}));

export default React.memo(VoucherCodeSearch);
