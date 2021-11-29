// @flow

import Fuse from 'fuse.js';
import React, { Component } from 'react';
import { compose } from 'recompose';
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
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {
  getSearchedMembers,
  withTags,
  getSearchedMembersArchived,
} from '../libs/member/selectors';
import { getPermissions } from '../libs/role/selectors';
import Permission from '../libs/role/types';

import ResultList from '../components/search/ResultList.component';
import SearchBar from '../components/SearchBar.component';

import { search as searchActions } from '../actions';

import withTitle from '../hocs/with-title.hoc';
import { showVaccinationStatus } from '../libs/custom-form/selectors';
import type { Member } from '../libs/member/types';
import { parseQueryString } from '../http';
import MemberMinimalListItem from '../libs/member/components/MemberMinimalListItem.component';

type Props = {
  members: *[],
  classes: any,
  member: any,
  selected: number,
  pushToMember: (memberId: number) => void,
  // membersLoading: boolean, unused
  selectEntity: () => void,
  t: TFunction,
  loading: boolean,
  openCreateMember: () => void,
  showVaccinationStatus: boolean,
  membersArchived: { [key: number]: Member },
  archivedSearchLoading: boolean,
  searchText: string,
  permissions: Permission,
};
type State = {
  openArchivedSection: boolean,
  memberArchivedCloseMatch: Member,
};

const styles = (theme) => ({
  mobileOnly: {
    paddingTop: theme.spacing(1) * 1,
    paddingLeft: theme.spacing(1) * 1,
    paddingBottom: theme.spacing(1) * 0.5,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  cardMobileOnly: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(0.5),
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(-3),
      marginTop: theme.spacing(-3),
      width: `calc(100% + ${theme.spacing(6)}px)`,
    },
    width: '100%',
    minHeight: 'calc(100vh - 65px)',
    marginRight: 0,
    paddingRight: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingBottom: '20vh',
  },
  contentInner: {
    flexDirection: 'column',
    flex: 'display',
    width: '100%',
    minWidth: '400px',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(1),
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
  stickyPoper: {
    position: 'fixed',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(0.5),
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  cardHeader: {
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
  },
});
export class SearchResults extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openArchivedSection: false,
      memberArchivedCloseMatch: null,
    };
  }

  getFuse = memoize((items) => {
    const options = {
      shouldSort: true,
      threshold: 0.6,
      maxPatternLength: 32,
      minMatchCharLength: 6,
      keys: ['name', 'email', 'phone'],
      includeScore: true,
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

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.searchText !== this.props.searchText ||
      prevProps.membersArchived !== this.props.membersArchived
    ) {
      this.handleUpdateMemberCloseMatch(this.props.searchText);
    }
  }

  handleUpdateMemberCloseMatch = (searchText: string) => {
    const fuzeSearch = this.getFuse(this.props.membersArchived).search(
      searchText,
    );
    if (fuzeSearch?.length !== 0 && fuzeSearch[0].score < 0.00001) {
      this.setState({ memberArchivedCloseMatch: fuzeSearch[0].item });
    }
  };

  render() {
    const { t, classes, member, selected } = this.props;
    const hasLoaded = member;
    const isLoadingMember = !hasLoaded && selected;
    return (
      <Grid container>
        <Grid item xs={12} md={4} className={classes.root}>
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
          {this.state.memberArchivedCloseMatch && (
            <Paper>
              <div className={classes.cardMobileOnly}>
                <div className={classes.cardHeader}>
                  <Typography variant="h6">
                    {t('member.closeMemberMatch')}
                  </Typography>
                </div>
                <MemberMinimalListItem
                  member={this.state.memberArchivedCloseMatch}
                  onClick={() => {
                    this.props.pushToMember(
                      this.state.memberArchivedCloseMatch.id,
                    );
                  }}
                  showVaccinationStatus={this.props.showVaccinationStatus}
                />
              </div>
            </Paper>
          )}
          <div className={classes.content}>
            <Paper className={classes.contentInner}>
              {this.props.permissions?.member?.create && (
                <ListItem button divider onClick={this.props.openCreateMember}>
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('actions.addMember')} />
                </ListItem>
              )}
              <ResultList
                items={this.props.members}
                loading={this.props.loading}
                selected={selected}
                selectEntity={this.selectEntity}
                className={selected && !isLoadingMember ? classes.hidden : ''}
                showVaccinationStatus={this.props.showVaccinationStatus}
              />
            </Paper>
            <Paper className={classes.contentInner}>
              <ListItem
                button
                divider
                onClick={() =>
                  this.setState((prevState) => ({
                    openArchivedSection: !prevState.openArchivedSection,
                  }))
                }
              >
                <ListItemText primary={t('member.archived')} />
                <ListItemIcon>
                  {this.state.openArchivedSection ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItemIcon>
              </ListItem>
              <Collapse in={this.state.openArchivedSection}>
                <ResultList
                  items={this.props.membersArchived}
                  loading={this.props.archivedSearchLoading}
                  selected={selected}
                  selectEntity={this.selectEntity}
                  className={selected && !isLoadingMember ? classes.hidden : ''}
                  showVaccinationStatus={this.props.showVaccinationStatus}
                />
              </Collapse>
            </Paper>
          </div>
        </Grid>
        {this.state.memberArchivedCloseMatch && (
          <Grid item xs={12} md={6}>
            <div className={classes.stickyPoper}>
              <Paper>
                <div className={classes.card}>
                  <div className={classes.cardHeader}>
                    <Typography variant="h6">
                      {t('member.closeMemberMatch')}
                    </Typography>
                  </div>
                  <MemberMinimalListItem
                    member={this.state.memberArchivedCloseMatch}
                    onClick={() => {
                      this.props.pushToMember(
                        this.state.memberArchivedCloseMatch.id,
                      );
                    }}
                    showVaccinationStatus={this.props.showVaccinationStatus}
                  />
                </div>
              </Paper>
            </div>
          </Grid>
        )}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const { member } = state.member;
  const { selectedId } = state.search;
  return {
    selected: selectedId,
    members: withTags(getSearchedMembers)(state),
    membersArchived: withTags(getSearchedMembersArchived)(state),
    loading: state.member.search.loading,
    archivedSearchLoading: state.member.search.archived.loading,
    searchText: state.search.text,
    member: member && member.id === selectedId ? member : null,
    membersLoading: state.member.search.loading,
    showVaccinationStatus: showVaccinationStatus(state),
    permissions: getPermissions(state),
  };
}

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
  connect(mapStateToProps, {
    pushToMember: (memberId: number) => push(`/member/${memberId}/`),
    selectEntity: searchActions.selectEntity,
    openCreateMember: () => push('/member/add'),
  }),
  connect((state, { location }) => ({
    searchText: getSearchText(state, location),
  })),
  withTitle(({ t }: { t: TFunction }) => t('titles:searchResults')),
)(SearchResults);
