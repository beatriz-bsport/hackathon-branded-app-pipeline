import React, { Component } from 'react';
import { compose, withState } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

import { createStyles, WithStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import {
  archiveMember,
  fetchMember,
  interrogateMemberStatus,
} from '#libs/member/actions';
import { fetchMemberList } from '#libs/member/api';
import { fetchTags } from '#libs/tag/actions';
import {
  getMemberArchiveStatus,
  getMemberDetail,
} from '#libs/member/selectors';
import { getPermissions } from '#libs/role/selectors';
import MemberArchiveDialog from '#libs/member/components/MemberArchiveDialog.component';
import MemberTable from '#libs/member/MemberTable.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import TagChipList from '#libs/tag/components/TagChipList.component';
import TagFilterForm from '#libs/tag/components/TagFilterForm.component';
import tagSelectors from '#libs/tag/selectors';
import withTitle from '../../hocs/with-title.hoc';

import type { Tag } from '#libs/tag/types';
import type { RootState } from '../../reducers';

type WithStateProps = {
  openArchiveDialog: boolean;
  setOpenArchiveDialog: (b: boolean) => void;
  setMemberSelectedForArchive: (id: number | null) => void;
  memberSelectedForArchive: number | null;
};
type Props = WithStateProps &
  WithStyles<typeof styles> &
  ConnectedProps<typeof connector>;

type TagFilterFormType = {
  include?: boolean;
  tagId?: number;
};

type State = {
  tagsIncluded: Array<Tag['id']>;
  tagsExcluded: Array<Tag['id']>;
  showFilterForm: boolean;
  disabledMemberId: Array<number>;
};

export class Members extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tagsIncluded: [],
      tagsExcluded: [],
      showFilterForm: false,
      disabledMemberId: [],
    };
  }

  componentDidMount() {
    this.props.fetchTags();
  }

  createTagFilter = (filter: TagFilterFormType) => {
    if (filter.include) {
      this.setState((prevState) => ({
        tagsIncluded: [...prevState.tagsIncluded, filter.tagId],
        showFilterForm: false,
      }));
    } else {
      this.setState((prevState) => ({
        tagsExcluded: [...prevState.tagsExcluded, filter.tagId],
        showFilterForm: false,
      }));
    }
  };

  tagFilterBar = () => (
    <div className={this.props.classes.actionBar}>
      <TagChipList
        excludes={this.state.tagsExcluded}
        handleAdd={() => this.setState({ showFilterForm: true })}
        handleDeleteTag={(id: number, include: boolean) => {
          if (include) {
            this.setState((prevState) => ({
              tagsIncluded: prevState.tagsIncluded.filter((id_) => id_ !== id),
            }));
          } else {
            this.setState((prevState) => ({
              tagsExcluded: prevState.tagsExcluded.filter((id_) => id_ !== id),
            }));
          }
        }}
        handleReinit={() =>
          this.setState({ tagsIncluded: [], tagsExcluded: [] })
        }
        includes={this.state.tagsIncluded}
        // @ts-expect-error tags actually has the type Tag<TagGroup>[]
        tags={this.props.tags}
      />
    </div>
  );

  fetchMemberList = (params: any = {}) => {
    return fetchMemberList({
      ...params,
      company: 0,
    });
  };

  archiveMember = (id: number) => {
    this.props.archiveMember(id, {
      onSuccess: () => {
        this.props.setOpenArchiveDialog(false);
        this.props.setMemberSelectedForArchive(null);
        this.setState((prevState) => ({
          disabledMemberId: [...prevState.disabledMemberId, id],
        }));
      },
    });
  };

  interrogateMemberStatus = (id: number) => {
    this.props.fetchMember(id);
    this.props.setOpenArchiveDialog(true);
    this.props.setMemberSelectedForArchive(id);
    this.props.interrogateMemberStatus(id, {
      onError: () => {
        this.props.setOpenArchiveDialog(false);
        this.props.setMemberSelectedForArchive(null);
      },
    });
  };

  closeTagFilterForm = () => this.setState({ showFilterForm: false });

  closeMemberArchiveDialog = () => {
    this.props.setOpenArchiveDialog(false);
    this.props.setMemberSelectedForArchive(null);
  };

  render() {
    const { addMember, goToMemberPage } = this.props;

    return (
      <>
        <Grid container direction="row" spacing={4}>
          <Grid item xs={12}>
            <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
              {(hasMemberProfileAccessPermission: boolean) => (
                <MemberTable
                  addMember={addMember}
                  customToolBar={this.tagFilterBar}
                  disabledMemberId={this.state.disabledMemberId}
                  fetch={this.fetchMemberList}
                  goToMember={
                    hasMemberProfileAccessPermission ? goToMemberPage : null
                  }
                  interrogateMemberStatus={this.interrogateMemberStatus}
                  tagsExcluded={this.state.tagsExcluded}
                  tagsIncluded={this.state.tagsIncluded}
                />
              )}
            </ObjectLevelPermissionProvider>
          </Grid>
          <TagFilterForm
            createFilter={this.createTagFilter}
            onClose={this.closeTagFilterForm}
            open={this.state.showFilterForm}
            tagList={this.props.tags}
          />
        </Grid>
        <MemberArchiveDialog
          archiveMemberStatus={this.props.memberArchiveStatus}
          loading={this.props.memberArchiveLoading}
          member={this.props.memberToArchive}
          onClose={this.closeMemberArchiveDialog}
          onConfirm={this.archiveMember}
          open={this.props.openArchiveDialog}
        />
      </>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    actionBar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      paddingTop: theme.spacing(2),
      marginLeft: theme.spacing(-1),
    },
  });

const connector = connect(
  (
    state: RootState,
    { memberSelectedForArchive }: { memberSelectedForArchive: number },
  ) => ({
    loading: state.member.loading,
    tags: tagSelectors.getMemberTagsWithTagGroup(state),
    memberArchiveStatus: getMemberArchiveStatus(
      state,
      memberSelectedForArchive,
    ),
    memberArchiveLoading: state.member.archive.loading,
    memberToArchive: getMemberDetail(state, memberSelectedForArchive),
    permissions: getPermissions(state),
  }),
  {
    fetchTags,
    goToMemberPage: (id: number) => push(`/member/${id}/`),
    addMember: () => push('/member/add'),
    archiveMember,
    interrogateMemberStatus,
    fetchMember,
  },
);

export default compose<any, Props>(
  withTranslation(['titles', 'member']),
  withState('openArchiveDialog', 'setOpenArchiveDialog', false),
  withState('memberSelectedForArchive', 'setMemberSelectedForArchive', null),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) => t('titles:member.members')),
  connector,
)(Members);
