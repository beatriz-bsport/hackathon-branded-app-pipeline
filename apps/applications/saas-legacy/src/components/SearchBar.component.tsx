import React, { Component } from 'react';
import { compose, withState } from 'recompose';
// eslint-disable-next-line bsport/no-redux-in-component
import { ConnectedProps, connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { WithTranslation, withTranslation } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';

import { push } from 'connected-react-router';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Cake } from '@material-ui/icons';
import Popover from '@material-ui/core/Popper';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import type { Dispatch } from 'src/state/types';
import { Theme } from '@material-ui/core';
import type { RootState } from 'src/reducers';
// @ts-expect-error error TS7016: Could not find a declaration file for module 'history'
import type { Location } from 'history';
import { WithStyles } from '@material-ui/styles';
import { DateTime } from 'luxon';
import { getMemberHistory } from '../libs/member/selectors';

import { parseQueryString } from '../http';
import DelayedTextField from './DelayedTextField.component';
// @ts-expect-error js file
import { search as searchActions } from '../actions';
import { searchArchived as searchArchivedMembers } from '../libs/member/actions';

type OwnProps = {
  autoFocus?: boolean;
  className: string;
  changeLocation: boolean;
  setMemberHistoryAnchor: (anchor: HTMLElement) => void;
  memberHistoryAnchor?: HTMLElement;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithTranslation &
  RouteComponentProps &
  WithStyles<typeof styles>;

export class SearchBar extends Component<Props> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
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
          transition
          anchorEl={this.props.memberHistoryAnchor}
          open={
            Boolean(this.props.memberHistoryAnchor) &&
            !!this.props.memberHistory.length
          }
          style={{
            zIndex: 1000000,
            padding: 8,
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                {this.props.memberHistory.map((m) => {
                  const todayDatime = DateTime.now();

                  const isBirthday = m?.birthday
                    ? DateTime.fromISO(m.birthday).month ===
                        todayDatime.month &&
                      DateTime.fromISO(m.birthday).day === todayDatime.day
                    : false;
                  return (
                    <ListItem
                      key={m.id}
                      button
                      divider
                      onClick={() => {
                        this.props.push(`/member/${m.id}/info`);
                      }}
                    >
                      <ListItemText
                        primary={
                          <div className={classes.flexDiv}>
                            <div>{m.name}</div>
                            <div className={classes.icon}>
                              {isBirthday && (
                                <Cake color="secondary" fontSize="inherit" />
                              )}
                            </div>
                          </div>
                        }
                        secondary={m.email}
                      />
                    </ListItem>
                  );
                })}
              </Paper>
            </Fade>
          )}
        </Popover>
        <DelayedTextField
          fullWidth
          autoFocus={this.props.autoFocus}
          className={classes.field}
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
          onBlur={() => this.props.setMemberHistoryAnchor(null)}
          onChange={this.handleChange}
          onFocus={(ev) => {
            this.props.setMemberHistoryAnchor(ev.currentTarget);
          }}
          placeholder={t('input')}
          value={searchText || ''}
          variant="outlined"
        />
      </div>
    );
  }
}

function mapDisPatchToProps(dispatch: Dispatch) {
  return {
    searchForText(text: string, replace: string, changeLocation: boolean) {
      dispatch(
        searchActions.searchText(text, replace, changeLocation, {
          hide_archived: true,
        }),
      );
    },
    searchForTextInArchive(text: string) {
      dispatch(searchArchivedMembers(text, { only_archived: true }));
    },
    clearSearch(changeLocation: boolean) {
      dispatch(searchActions.clearSearch(changeLocation));
    },
    push(path: string) {
      dispatch(push(path));
    },
  };
}

const styles = (theme: Theme) => ({
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
});

function getSearchText(state: RootState, location: Location) {
  if (state.search.searchText) {
    return state.search.searchText;
  }
  const query = parseQueryString((location && location.search) || '');
  return query.q;
}

const connector = connect(
  (state: RootState, { location }: { location: Location }) => ({
    searchText: getSearchText(state, location),
    memberHistory: getMemberHistory(state),
  }),
  mapDisPatchToProps,
);

export default compose(
  withStyles(styles),
  withTranslation(['search']),
  withRouter,
  withState('memberHistoryAnchor', 'setMemberHistoryAnchor', null),
  connector,
)(SearchBar);
