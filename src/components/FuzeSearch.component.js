// @flow
//
import React from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import Fuse from 'fuse.js';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import memoize from 'memoize-one';

import DelayedTextField from './DelayedTextField.component';

type Props = {
  items: Array,
  searchFields: Array,
  placeholder: string,
  searchText: string,
  clearSearch: () => void,
  changeSearch: (any) => void,
  classes: Object,
  variant?: string,
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
      <div className={this.props.classes.container}>
        <DelayedTextField
          variant={this.props.variant || 'standard'}
          placeholder={this.props.placeholder}
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
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            'data-testid': 'input-fuze-search',
          }}
        />
      </div>
    );
  }
}

const styles = () => ({
  container: { width: '100%' },
});

export default compose(withStyles(styles))(FuzeSearch);
