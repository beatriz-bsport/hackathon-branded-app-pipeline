// @flow
import React from 'react';
import { withStyles, InputAdornment, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import DelayedTextField from '../../components/DelayedTextField.component';

type Props = {
  classes: Object,
  t: TFunction,
  onReset: () => void,
  searchedText: string,
  onChange: (Object) => void,
};

export function SearchMember(props: Props) {
  const { classes, t, onReset, searchedText, onChange } = props;
  return (
    <DelayedTextField
      variant="outlined"
      className={classes.field}
      placeholder={t('search.input')}
      fullWidth
      InputProps={{
        className: classes.input,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: searchedText ? (
          <InputAdornment position="end">
            <IconButton
              aria-label={searchedText ? 'Clear search' : 'Search'}
              onClick={onReset}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      value={searchedText}
      onChange={onChange}
    />
  );
}

const styles = () => ({
  input: {
    width: '100%',
  },
  field: {
    backgroundColor: '#F8F8F8',
  },
});

export default withNamespaces()(withStyles(styles)(SearchMember));
