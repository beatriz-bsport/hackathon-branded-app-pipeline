// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import parse from '../query-string';

import { search as searchActions } from '../actions';

type Props = {
  t: TFunction,
  searchForText: (string, path: ?string, changeLocation: boolean) => void,
  searchText: string,
  clearSearch: (boolean) => void,
  history: Object,
  classes: *,
  className: string,
  changeLocation: boolean,
};

export class SearchBar extends Component<Props> {
  handleChange = (e: Object) => {
    const { value } = e.target;

    if (!value) {
      this.clearSearch();
    } else {
      const { searchForText, history, changeLocation, searchText } = this.props;

      if (value !== searchText) {
        searchForText(value, history.location.pathname, changeLocation);
      }
    }
  };

  clearSearch = () => {
    this.props.clearSearch(this.props.changeLocation);
  };

  render() {
    const { t, classes, className, searchText } = this.props;
    return (
      <div className={`${classes.bar} ${className}`}>
        <TextField
          variant="outlined"
          className={classes.field}
          placeholder={t('search.input')}
          value={searchText || ''}
          fullWidth
          onChange={this.handleChange}
          InputProps={{
            className: classes.input,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchText ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label={searchText ? 'Clear search' : 'Search'}
                  onClick={this.clearSearch}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </div>
    );
  }
}

function mapDisPatchToProps(dispatch) {
  return {
    searchForText(text: string, replace: boolean, changeLocation: boolean) {
      dispatch(searchActions.searchText(text, replace, changeLocation));
    },
    clearSearch(changeLocation: boolean) {
      dispatch(searchActions.clearSearch(changeLocation));
    },
  };
}

const styles = () => ({
  bar: {
    width: '100%',
  },
  input: {
    width: '100%',
  },
  field: {
    backgroundColor: '#F8F8F8',
  },
});

function getSearchText(state, location) {
  if (state.search.searchText) {
    return state.search.searchText;
  }
  const query = parse((location && location.search) || '');
  return query.q;
}

export default compose(
  withStyles(styles),
  translate(),
  withRouter,
  connect(
    (state, { location }) => ({
      searchText: getSearchText(state, location),
    }),
    mapDisPatchToProps,
  ),
)(SearchBar);
