// @flow

import React, { Component } from 'react';
import { compose, withState } from 'recompose';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';

import { push } from 'connected-react-router';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
// import Popover from '@material-ui/core/Popover';
import Popover from '@material-ui/core/Popper';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { getMemberHistory } from '../libs/member/selectors';

import { parseQueryString } from '../http';
import DelayedTextField from './DelayedTextField.component';

import { search as searchActions } from '../actions';
import { searchArchived as searchArchivedMembers } from '../libs/member/actions';

type Props = {
  t: TFunction,
  searchForText: (string, path: ?string, changeLocation: boolean) => void,
  searchForTextAmoungArchived: (text: string) => void,
  searchText: string,
  clearSearch: (boolean) => void,
  history: Object,
  classes: any,
  className: string,
  changeLocation: boolean,
  push: (string) => void,
  memberHistory: Array<Member>,
  setMemberHistoryAnchor: (HTMLElement) => void,
  memberHistoryAnchor: ?HTMLElement,
};

export class SearchBar extends Component<Props> {
  handleChange = (e: Object) => {
    const { value } = e.target;
    this.props.setMemberHistoryAnchor(null);

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
        <Popover
          style={{
            zIndex: 1000000,
            padding: 8,
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
          disableAutoFocus
          anchorEl={this.props.memberHistoryAnchor}
          open={
            Boolean(this.props.memberHistoryAnchor) &&
            !!this.props.memberHistory.length
          }
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                {this.props.memberHistory.map((m) => (
                  <ListItem
                    key={m.id}
                    divider
                    button
                    onClick={() => {
                      this.props.push(`/member/${m.id}/info`);
                    }}
                  >
                    <ListItemText primary={m.name} secondary={m.email} />
                  </ListItem>
                ))}
              </Paper>
            </Fade>
          )}
        </Popover>
        <DelayedTextField
          variant="outlined"
          className={classes.field}
          placeholder={t('input')}
          value={searchText || ''}
          fullWidth
          onChange={this.handleChange}
          onBlur={() => this.props.setMemberHistoryAnchor(null)}
          onFocus={(ev) => {
            this.props.setMemberHistoryAnchor(ev.currentTarget);
          }}
          InputProps={{
            className: classes.input,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment:
              !!searchText || !!this.props.memberHistoryAnchor ? (
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
      dispatch(
        searchActions.searchText(
          text,
          replace,
          changeLocation,
          {
            hide_archived: true,
          },
          {
            onSuccess: () => {
              dispatch(searchArchivedMembers(text, { only_archived: true }));
            },
          },
        ),
      );
    },
    clearSearch(changeLocation: boolean) {
      dispatch(searchActions.clearSearch(changeLocation));
    },
    push(path) {
      dispatch(push(path));
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
  const query = parseQueryString((location && location.search) || '');
  return query.q;
}

export default compose(
  withStyles(styles),
  withTranslation(['search']),
  withRouter,
  withState('memberHistoryAnchor', 'setMemberHistoryAnchor', null),
  connect(
    (state, { location }) => ({
      searchText: getSearchText(state, location),
      memberHistory: getMemberHistory(state),
    }),
    mapDisPatchToProps,
  ),
)(SearchBar);
