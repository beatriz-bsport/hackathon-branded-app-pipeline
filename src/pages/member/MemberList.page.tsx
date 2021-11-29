// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withState } from 'recompose';
import { createStyles, WithStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { TFunction } from 'i18next';
import { fetchMemberList } from '../../libs/member/api';
import withTitle from '../../hocs/with-title.hoc';
import { getPermissions } from '../../libs/role/selectors';
import MemberTable from '../../libs/member/MemberTable.component';
import TagChipList from '../../libs/tag/components/TagChipList.component';
import TagFilterForm from '../../libs/tag/components/TagFilterForm.component';
import tagSelectors from '../../libs/tag/selectors';
import type { Tag } from '../../libs/tag/types';
import { fetchTags } from '../../libs/tag/actions';
import { RootState } from '../../reducers';
import {
  archiveMember,
  interrogateMemberStatus,
  fetchMember,
} from '../../libs/member/actions';
import {
  getMemberDetail,
  getMemberArchiveStatus,
} from '../../libs/member/selectors';
import MemberArchiveDialog from '../../libs/member/components/MemberArchiveDialog.component';

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
        tags={this.props.tags}
        includes={this.state.tagsIncluded}
        excludes={this.state.tagsExcluded}
        handleReinit={() =>
          this.setState({ tagsIncluded: [], tagsExcluded: [] })
        }
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
        handleAdd={() => this.setState({ showFilterForm: true })}
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

  render() {
    const { addMember, goToMemberPage } = this.props;

    return (
      <>
        <Grid container direction="row" spacing={4}>
          <Grid item xs={12}>
            <MemberTable
              tagsExcluded={this.state.tagsExcluded}
              tagsIncluded={this.state.tagsIncluded}
              fetch={this.fetchMemberList}
              goToMember={goToMemberPage}
              addMember={addMember}
              customToolBar={this.tagFilterBar}
              interrogateMemberStatus={(id: number) =>
                this.interrogateMemberStatus(id)
              }
              disabledMemberId={this.state.disabledMemberId}
              hideAddButton={!this.props.permissions?.member?.create}
            />
          </Grid>
          <TagFilterForm
            open={this.state.showFilterForm}
            onClose={() => this.setState({ showFilterForm: false })}
            tagList={this.props.tags}
            createFilter={this.createTagFilter}
          />
        </Grid>
        <MemberArchiveDialog
          open={this.props.openArchiveDialog}
          member={this.props.memberToArchive}
          archiveMemberStatus={this.props.memberArchiveStatus}
          loading={this.props.memberArchiveLoading}
          onClose={() => {
            this.props.setOpenArchiveDialog(false);
            this.props.setMemberSelectedForArchive(null);
          }}
          onConfirm={this.archiveMember}
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
