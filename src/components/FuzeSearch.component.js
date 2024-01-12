// @flow
//
import React from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import Fuse from 'fuse.js';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import memoize from 'memoize-one';

import DelayedTextField from './DelayedTextField.component';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';

type Props = {
  items: Array,
  searchFields: Array,
  placeholder: string,
  searchText: string,
  clearSearch: () => void,
  changeSearch: (any) => void,
  classes: Object,
  className?: string,
  inputClassName?: string,
  inputPropsClassName?: String,
  variant?: string,
  disableAutoFocus?: boolean,
  adornmentPosition: 'start' | 'end' | 'none',
  onClickSearch?: () => void,
  searchOnItemsChange?: boolean,
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

  componentDidUpdate(prevProps) {
    if (
      this.props.searchOnItemsChange &&
      !isEqual(prevProps.items, this.props.items)
    ) {
      this.props.changeSearch(this.getFuse(this.props.items))({
        target: { value: this.props.searchText },
      });
    }
  }

  render() {
    const fuse = this.getFuse(this.props.items);
    const adornmentPosition = this.props.adornmentPosition ?? 'start';
    const { onClickSearch } = this.props;

    return (
      <div
        className={classNames(
          this.props.classes.container,
          this.props.className,
        )}
      >
        <DelayedTextField
          fullWidth
          autoFocus={!this.props.disableAutoFocus}
          delay={170}
          InputProps={{
            className: this.props.inputClassName,
            startAdornment:
              adornmentPosition === 'start' ? (
                <InputAdornment position="start">
                  {onClickSearch ? (
                    <IconButton
                      className={this.props.classes.iconButton}
                      disabled={!this.props.searchText}
                      onClick={onClickSearch}
                    >
                      <CustomMuiIcon
                        icon="Search"
                        variant={this.props.searchText ? 'primary' : undefined}
                      />
                    </IconButton>
                  ) : (
                    <SearchIcon />
                  )}
                </InputAdornment>
              ) : null,
            endAdornment: (
              <div className={this.props.classes.endAdornment}>
                {this.props.searchText ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        this.props.searchText ? 'Clear search' : 'Search'
                      }
                      className={this.props.classes.iconButton}
                      onClick={this.props.clearSearch}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null}
                {adornmentPosition === 'end' ? (
                  <InputAdornment position="end" style={{ marginLeft: 0 }}>
                    {onClickSearch ? (
                      <IconButton
                        className={this.props.classes.iconButton}
                        disabled={!this.props.searchText}
                        onClick={onClickSearch}
                      >
                        <CustomMuiIcon
                          icon="Search"
                          variant={
                            this.props.searchText ? 'primary' : undefined
                          }
                        />
                      </IconButton>
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                ) : null}
              </div>
            ),
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{
            'data-testid': 'input-fuze-search',
            className: this.props.inputPropsClassName,
          }}
          onChange={this.props.changeSearch(fuse)}
          placeholder={this.props.placeholder}
          value={this.props.searchText || ''}
          variant={this.props.variant || 'standard'}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: { width: '100%' },
  endAdornment: {
    display: 'flex',
  },
  iconButton: {
    padding: theme.spacing(0.75),
  },
});

export default compose(withStyles(styles))(FuzeSearch);
