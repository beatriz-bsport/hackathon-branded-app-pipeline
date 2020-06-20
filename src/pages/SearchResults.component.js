// @flow

import Fuse from 'fuse.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import memoize from 'memoize-one';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { getSearchedMembers } from '../libs/member/selectors';

import ResultList from '../components/search/ResultList.component';
import SearchBar from '../components/SearchBar.component';

import { search as searchActions } from '../actions';

import withTitle from '../hocs/with-title.hoc';

type Props = {
  members: *[],
  classes: *,
  member: *,
  selected: number,
  pushToMember: (memberId: number) => void,
  // membersLoading: boolean, unused
  selectEntity: (*) => void,
  t: TFunction,
  loading: boolean,
};
type State = {};

const styles = (theme) => ({
  mobileOnly: {
    paddingTop: theme.spacing(1) * 1,
    paddingLeft: theme.spacing(1) * 1,
    paddingBottom: theme.spacing(1) * 0.5,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    [theme.breakpoints.up('md')]: {
      margin: -theme.spacing(3),
      width: `calc(100% + ${theme.spacing(6)}px)`,
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
  contentInner: {
    flexDirection: 'column',
    flex: 'display',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  detail: {
    flex: 2,
    width: '100%',
    padding: theme.spacing(2),
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
      <div className={classes.root}>
        <SearchBar changeLocation className={classes.mobileOnly} />
        {hasLoaded ? (
          <Button
            color="secondary"
            fullWidth
            className={classes.buttonGoBack}
            onClick={() => this.props.selectEntity(null)}
          >
            {t('go_back')}
          </Button>
        ) : null}
        <div className={classes.content}>
          <Paper className={classes.contentInner}>
            <ListItem button divider onClick={this.props.openCreateMember}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary={t('actions.addMember')} />
            </ListItem>
            <ResultList
              items={this.props.members}
              loading={this.props.loading}
              selected={selected}
              selectEntity={this.selectEntity}
              className={selected && !isLoadingMember ? classes.hidden : ''}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { member } = state.member;
  const { selectedId } = state.search;
  return {
    selected: selectedId,
    members: getSearchedMembers(state),
    loading: state.member.search.loading,
    searchText: state.search.text,
    member: member && member.id === selectedId ? member : null,
    membersLoading: state.member.search.loading,
  };
}

export default withStyles(styles)(
  withTranslation(['search'])(
    connect(
      mapStateToProps,
      {
        pushToMember: (memberId: number) => push(`/member/${memberId}/`),
        selectEntity: searchActions.selectEntity,
        openCreateMember: () => push('/member/add'),
      },
    )(
      withTitle(({ t }: { t: TFunction }) => t('titles:searchResults'))(
        SearchResults,
      ),
    ),
  ),
);
