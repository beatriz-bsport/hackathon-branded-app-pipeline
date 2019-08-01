// @flow

import Fuse from 'fuse.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import memoize from 'memoize-one';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import memberSelectors from '../libs/member/selectors';

import ResultList from '../components/search/ResultList.component';
import SearchBar from '../components/SearchBar.component';

import { search as searchActions } from '../actions';

import withDrawer from '../hocs/with-drawer.hoc';

type Props = {
  members: *[],
  classes: *,
  member: *,
  selected: number,
  pushToMember: (memberId: number) => void,
  membersLoading: boolean,
  selectEntity: (*) => void,
  t: TFunction,
};
type State = {};

const styles = (theme) => ({
  mobileOnly: {
    paddingTop: theme.spacing.unit * 1,
    paddingLeft: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 0.5,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    [theme.breakpoints.down('md')]: {
      paddingTop: 60,
    },
    [theme.breakpoints.up('md')]: {
      margin: -theme.spacing.unit * 3,
      width: `calc(100% + ${theme.spacing.unit * 6}px)`,
    },
    width: '100%',
    minHeight: 'calc(100vh - 65px)',
  },
  content: {
    height: 'calc(100vh - 65px)',
    overflowY: 'auto',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexFlow: 'row',
    },
  },
  detail: {
    flex: 2,
    width: '100%',
    padding: theme.spacing.unit * 2,
    overflowY: 'auto',
  },
  hidden: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  buttonGoBack: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

export class SearchResults extends Component<Props, State> {
  getFuse = memoize((items) => {
    const options = {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 2,
      keys: ['name', 'email'],
    };
    return new Fuse(items, options);
  });

  selectEntity = (entity) => {
    if (entity.type === 'member') {
      this.props.pushToMember(entity.data.id);
    } else {
      this.props.selectEntity(entity);
    }
  };

  render() {
    const { t, classes, member, selected } = this.props;
    const hasLoaded = member;
    const isLoadingMember = !hasLoaded && selected;
    return (
      <Paper className={classes.root}>
        <SearchBar className={classes.mobileOnly} />
        {isLoadingMember ? <LinearProgress /> : null}
        {hasLoaded ? (
          <Button
            color="secondary"
            fullWidth
            className={classes.buttonGoBack}
            onClick={() => this.props.selectEntity(null)}
          >
            {t('search.go_back')}
          </Button>
        ) : null}
        <div className={classes.content}>
          {hasLoaded ? null : <LinearProgress />}
          <ResultList
            items={this.props.members}
            selected={selected}
            selectEntity={this.selectEntity}
            loading={this.props.membersLoading}
            className={selected && !isLoadingMember ? classes.hidden : ''}
          />
        </div>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  const { member } = state.member;
  const { selectedId } = state.search;
  return {
    selected: selectedId,
    members: memberSelectors.getSearched(state),
    searchText: state.search.text,
    member: member && member.id === selectedId ? member : null,
    membersLoading: state.member.search.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pushToMember(memberId: number) {
      dispatch(push(`/member/${memberId}/`));
    },
    selectEntity(entity) {
      dispatch(searchActions.selectEntity(entity));
    },
  };
}

export default withStyles(styles)(
  withNamespaces()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(
      withDrawer(({ t }: { t: TFunction }) => t('appbar.title.searchResults'))(
        SearchResults,
      ),
    ),
  ),
);
