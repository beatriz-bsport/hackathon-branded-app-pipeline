// @flow
//
import React from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import Fuse from 'fuse.js';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';

import memoize from 'memoize-one';

import DelayedTextField from './DelayedTextField.component';

type Props = {
  items: Array,
  searchFields: Array,
  placeHolder: string,
  searchText: string,
  clearSearch: () => void,
  changeSearch: (any) => void,
  searchResult: Array,
  t: TFunction,
};

export class FuzeSearch extends React.Component<Props> {
  getFuse = memoize((items) => {
    const options = {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      keys: this.props.searchFields,
    };
    return new Fuse(items, options);
  });

  render() {
    const fuse = this.getFuse(this.props.items);

    return (
      <div>
        <DelayedTextField
          placeholder={this.props.placeHolder}
          value={this.props.searchText || ''}
          fullWidth
          onChange={this.props.changeSearch(fuse)}
          delay={170}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: this.props.searchText ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label={this.props.searchText ? 'Clear search' : 'Search'}
                  onClick={this.props.clearSearch}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        {this.props.searchText !== '' &&
        this.props.searchResult.length === 0 ? (
          <Paper>
            <ListItem disabled>
              <ListItemText primary={this.props.t('search.noResult')} />
            </ListItem>
          </Paper>
        ) : null}
      </div>
    );
  }
}

export default compose(withNamespaces())(FuzeSearch);
