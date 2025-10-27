import Fuse from 'fuse.js';
import React from 'react';
import { compose } from 'recompose';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import memoize from 'memoize-one';
// @ts-expect-error
import { withTranslation, TFunction } from 'react-i18next';
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
} from '#src/libs/member/selectors';

// @ts-expect-error
import ResultList from '#src/components/search/ResultList.component';
import SearchBar from '#src/components/SearchBar.component';

import { MemberMinimal, Member } from '#src/libs/member/types';

import withTitle from '#src/hocs/with-title.hoc';
import MemberMinimalListItem from '#src/libs/member/components/MemberMinimalListItem.component';
import { searchArchived as searchArchivedMembers } from '#src/libs/member/actions';
import { checkMemberInEstablishment as checkMemberInEstablishmentAction } from '#src/libs/access-control/actions';
import { hasAnyUpsell } from '#src/libs/platform-billing/utils';
import {
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
  UPSELL_IDENTIFIER_KISI_INTEGRATION,
} from '#src/libs/platform-billing/upsell-identifiers';
import { getEstablishmentsSelectedInRole } from '#src/libs/establishment/selectors';
import { withSendToBroadcastChannel } from '#src/libs/broadcast-channel/hocs';
import type { MemberVisitREST } from '#src/libs/access-control/types';
import {
  BroadcastChannelMessageType,
  type BroadcastChannelMessage,
} from '#src/libs/broadcast-channel/types';
import type { OptionCallback } from '#src/state/types';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { parseQueryString } from '../http';
// @ts-expect-error
import { search as searchActions } from '../actions';
// @ts-expect-error
import RolePermission from '../libs/role/types';
import { getPermissions } from '../libs/role/selectors';

type Props = {
  members: MemberMinimal[];
  classes: any;
  checkMemberInEstablishment: (
    {
      memberId,
      establishmentIds,
    }: {
      memberId: number;
      establishmentIds?: number[];
    },
    options?: OptionCallback<MemberVisitREST>,
  ) => void;
  member: any;
  selected: number;
  pushToMember: (memberId: number) => void;
  // membersLoading: boolean, unused
  selectEntity: () => void;
  t: TFunction;
  loading: boolean;
  openCreateMember: () => void;
  membersArchived: { [key: number]: Member };
  archivedSearchLoading: boolean;
  searchText: string;
  permissions: RolePermission;
  searchForTextInArchive: (tex: string) => void;
  sendToBroadcastChannel: (
    message: BroadcastChannelMessage<MemberVisitREST>,
  ) => void;
};

type State = {
  openArchivedSection: boolean;
  memberArchivedCloseMatch: Member;
};

// @ts-expect-error
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
    minWidth: '600px',
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
export class SearchResults extends React.Component<Props, State> {
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

  // @ts-expect-error
  selectEntity = (entity) => {
    if (entity.type === 'member') {
      this.props.pushToMember(entity.data.id);
    } else {
      // @ts-expect-error
      this.props.selectEntity(entity);
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.searchText !== this.props.searchText ||
      prevProps.membersArchived !== this.props.membersArchived
    ) {
      this.handleUpdateMemberCloseMatch(this.props.searchText);
      if (prevProps.searchText !== this.props.searchText) {
        this.setState({ openArchivedSection: false });
      }
    }
  }

  handleUpdateMemberCloseMatch = (searchText: string) => {
    const fuzeSearch = this.getFuse(this.props.membersArchived).search(
      searchText,
    );
    // @ts-expect-error
    if (fuzeSearch?.length !== 0 && fuzeSearch[0].score < 0.00001) {
      // @ts-expect-error
      this.setState({ memberArchivedCloseMatch: fuzeSearch[0].item });
    }
  };

  toggleArchiveResult = () => {
    this.setState((prevState) => {
      if (!prevState.openArchivedSection) {
        this.props.searchForTextInArchive(this.props.searchText);
      }
      return {
        openArchivedSection: !prevState.openArchivedSection,
      };
    });
  };

  handleCheckinMember = (member: Member) => {
    this.props.checkMemberInEstablishment(
      {
        memberId: member.id,
        // @ts-expect-error
        establishmentIds: this.props.establishmentsSelectedInRole,
      },
      {
        onSuccess: (data) => {
          this.props.sendToBroadcastChannel({
            type: BroadcastChannelMessageType.accessControlMemberVisitCreate,
            payload: data,
          });
        },
      },
    );
  };

  hideAccessMonitoringButton =
    // @ts-expect-error
    !hasAnyUpsell(this.props.featureList, [
      UPSELL_IDENTIFIER_ACCESS_MONITORING,
      UPSELL_IDENTIFIER_KISI_INTEGRATION,
    ]) || !this.props.permissions?.navigationMenu?.accessMonitoring?.perform;

  disableAccessMonitoringButton =
    // @ts-expect-error
    !this.props.establishmentsSelectedInRole?.length;

  render() {
    const { t, classes, member, selected } = this.props;
    const hasLoaded = member;
    const isLoadingMember = !hasLoaded && selected;
    return (
      <Grid container>
        <Grid item className={classes.root} md={6} xs={12}>
          {/* @ts-expect-error */}
          <SearchBar changeLocation className={classes.mobileOnly} />
          {hasLoaded ? (
            <Button
              fullWidth
              className={classes.buttonGoBack}
              color="secondary"
              // @ts-expect-error
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
                  bottomCredit
                  // @ts-expect-error
                  member={this.state.memberArchivedCloseMatch}
                  onClick={() => {
                    this.props.pushToMember(
                      this.state.memberArchivedCloseMatch.id,
                    );
                  }}
                />
              </div>
            </Paper>
          )}
          <div className={classes.content}>
            <Paper className={classes.contentInner}>
              <ObjectLevelPermissionWrapper
                forcedBehavior="hidden"
                requiredPermission="member.allowed_actions.create"
              >
                <ListItem button divider onClick={this.props.openCreateMember}>
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('actions.addMember')} />
                </ListItem>
              </ObjectLevelPermissionWrapper>
              <ResultList
                className={selected && !isLoadingMember ? classes.hidden : ''}
                disableAccessMonitoringButton={
                  this.disableAccessMonitoringButton
                }
                items={this.props.members}
                loading={this.props.loading}
                onMemberCheckin={
                  !this.hideAccessMonitoringButton && this.handleCheckinMember
                }
                selected={selected}
                selectEntity={this.selectEntity}
              />
            </Paper>
            <Paper className={classes.contentInner}>
              <ListItem button divider onClick={this.toggleArchiveResult}>
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
                  className={selected && !isLoadingMember ? classes.hidden : ''}
                  items={this.props.membersArchived}
                  loading={this.props.archivedSearchLoading}
                  selected={selected}
                  selectEntity={this.selectEntity}
                />
              </Collapse>
            </Paper>
          </div>
        </Grid>
        {this.state.memberArchivedCloseMatch && (
          <Grid item md={6} xs={12}>
            <div className={classes.stickyPoper}>
              <Paper>
                <div className={classes.card}>
                  <div className={classes.cardHeader}>
                    <Typography variant="h6">
                      {t('member.closeMemberMatch')}
                    </Typography>
                  </div>
                  <MemberMinimalListItem
                    bottomCredit
                    // @ts-expect-error
                    member={this.state.memberArchivedCloseMatch}
                    onClick={() => {
                      this.props.pushToMember(
                        this.state.memberArchivedCloseMatch.id,
                      );
                    }}
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

// @ts-expect-error
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
    permissions: getPermissions(state),
    featureList: state.company.feature.data,
    establishmentsSelectedInRole: getEstablishmentsSelectedInRole(state),
  };
}

// @ts-expect-error
function getSearchText(state, location) {
  if (state.search.searchText) {
    return state.search.searchText;
  }
  const query = parseQueryString((location && location.search) || '');
  return query.q;
}

export default compose(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['search']),
  connect(mapStateToProps, {
    pushToMember: (memberId: number) => push(`/member/${memberId}/`),
    selectEntity: searchActions.selectEntity,
    openCreateMember: () => push('/member/add'),
    searchForTextInArchive: (text: string) =>
      searchArchivedMembers(text, { only_archived: true }),
    checkMemberInEstablishment: checkMemberInEstablishmentAction,
  }),
  // @ts-expect-error
  connect((state, { location }) => ({
    searchText: getSearchText(state, location),
  })),
  withTitle(({ t }: { t: TFunction }) => t('titles:searchResults')),
  withSendToBroadcastChannel,
)(SearchResults);
