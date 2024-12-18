import React, { useCallback, useEffect } from 'react';
import { compose } from 'recompose';
// eslint-disable-next-line bsport/no-redux-in-component
import { ConnectedProps, connect } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router';
import { WithTranslation, useTranslation } from 'react-i18next';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import type { Dispatch } from 'src/state/types';
import { Theme } from '@material-ui/core';
import type { RootState } from 'src/reducers';
import { makeStyles } from '@material-ui/styles';
import { push as pushRouter } from 'connected-react-router';

import classNames from 'classnames';
import DelayedTextField from '#src/components/DelayedTextField.component';

import { searchFranchiseUsers as searchFranchiseUsersAction } from '../actions';

const SEARCH_URI = '/f/search';

type Props = ConnectedProps<typeof connector> &
  OwnProps &
  WithTranslation &
  RouteComponentProps;

type OwnProps = {
  className?: string;
};

export const SearchBar: React.FC<Props> = ({
  previousURI,
  push,
  searchForText,
  className,
}) => {
  const [searchText, setSearchText] = React.useState('');
  const classes = useStyles();
  const { t } = useTranslation('search');
  const { location } = useHistory();

  const clearSearch = useCallback(() => {
    setSearchText('');
    push(previousURI);
  }, [previousURI, push]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (!value || value === '') {
        clearSearch();
      } else if (value !== searchText) {
        searchForText(value);
        setSearchText(value);
      }
    },
    [clearSearch, searchForText, searchText],
  );

  useEffect(() => {
    const hasMoved = !location?.pathname?.includes(SEARCH_URI);
    if (hasMoved) {
      setSearchText('');
    }
  }, [location.pathname, clearSearch]);

  return (
    <div className={classNames(classes.bar, className)}>
      <DelayedTextField
        fullWidth
        className={classes.field}
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchText.length > 0 && (
            <InputAdornment position="end">
              <IconButton
                aria-label={searchText ? 'Clear search' : 'Search'}
                onClick={clearSearch}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={handleChange}
        placeholder={t('input')}
        value={searchText}
        variant="outlined"
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    previousURI: state.franchise.searchedUsers.previousURI,
  }),
  (dispatch: Dispatch) => {
    return {
      searchForText(text: string) {
        dispatch(searchFranchiseUsersAction({ text }));
      },
      push: (path: string) => {
        dispatch(pushRouter(path));
      },
    };
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    width: '100%',
  },
  input: {
    width: '100%',
  },
  field: {
    backgroundColor: '#F8F8F8',
  },
  flexDiv: {
    display: 'flex',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
  },
  icon: {
    fontSize: '14px',
    paddingTop: theme.spacing(0.5),
  },
}));

export default compose<Props, OwnProps>(connector, React.memo)(SearchBar);
