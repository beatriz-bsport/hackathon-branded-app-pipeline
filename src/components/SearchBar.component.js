// @flow

import React, { Component } from 'react';
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
  searchForText: (string, path: ?string) => void,
  searchText: string,
  clearSearch: () => void,
  location: Object,
  history: Object,
  classes: *,
  className: string,
};
type State = {
  searchText: string,
};

export class SearchBar extends Component<Props, State> {
  state = {
    searchText: '',
  };

  constructor(props: Props) {
    super(props);

    const query = parse((props.location && props.location.search) || '');
    this.state.searchText = query.q;
    if (props.searchText) {
      this.state.searchText = props.searchText;
    }

    if (this.state.searchText) {
      this.props.searchForText(this.state.searchText);
    }
  }

  handleChange = (e: Object) => {
    const { value } = e.target;
    if (!value) {
      this.clearSearch();
    } else {
      this.setState({ searchText: value });
      this.props.searchForText(value, this.props.history.location.pathname);
    }
  };

  clearSearch = () => {
    this.setState({ searchText: '' });
    this.props.clearSearch();
  };

  render() {
    const { t, classes, className } = this.props;
    return (
      <div className={`${classes.bar} ${className}`}>
        <TextField
          variant="outlined"
          className={classes.field}
          placeholder={t('search.input')}
          value={this.state.searchText || ''}
          fullWidth
          onChange={this.handleChange}
          InputProps={{
            className: classes.input,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: this.state.searchText ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label={this.state.searchText ? 'Clear search' : 'Search'}
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
    searchForText(text: string, replace: boolean) {
      dispatch(searchActions.searchText(text, replace));
    },
    clearSearch() {
      dispatch(searchActions.clearSearch());
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

export default withStyles(styles)(
  translate()(
    withRouter(
      connect(
        null,
        mapDisPatchToProps,
      )(SearchBar),
    ),
  ),
);
