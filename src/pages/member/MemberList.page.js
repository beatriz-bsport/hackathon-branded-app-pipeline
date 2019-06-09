// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fetchAllMembers } from '../../libs/member/api';
import withDrawer from '../../hocs/with-drawer.hoc';
import MemberTable from '../../libs/member/MemberTable.component';

import TagChipList from '../../libs/tag/components/TagChipList.component';
import TagFilterForm from '../../libs/tag/components/TagFilterForm.component';
import tagSelectors from '../../libs/tag/selectors';
import type { Tag, TagGroup } from '../../libs/tag/types';

import { fetchTags } from '../../libs/tag/actions';

type Props = {
  goToMemberPage: (memberId: number) => void,
  addMember: () => void,
  tagGroups: Array<TagGroup>,
    fetchTags: () => void,
    tags: Array<Tag>,
};

export class Members extends Component<Props> {
  state = {
    tagsIncluded: [],
    tagsExcluded: [],
    showFilterForm: false,
  };

  componentDidMount() {
    this.props.fetchTags();
  }

  createTagFilter = (filter) => {
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
    <React.Fragment>
      <TagChipList
        tagGroups={this.props.tagGroups}
        tags={this.props.tags}
        includes={this.state.tagsIncluded}
        excludes={this.state.tagsExcluded}
        handleReinit={() =>
          this.setState({ tagsIncluded: [], tagsExcluded: [] })
        }
        handleDeleteTag={(id, include) => {
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
    </React.Fragment>
  );

  render() {
    const { addMember, goToMemberPage } = this.props;

    return (
      <Grid container direction="row" spacing={32}>
        <Grid item xs={12}>
          <MemberTable
            tagsExcluded={this.state.tagsExcluded}
            tagsIncluded={this.state.tagsIncluded}
            fetch={fetchAllMembers}
            goToMember={goToMemberPage}
            addMember={addMember}
            customToolBar={this.tagFilterBar}
          />
        </Grid>
        <TagFilterForm
          open={this.state.showFilterForm}
          onClose={() => this.setState({ showFilterForm: false })}
          tagGroups={this.props.tagGroups}
          createFilter={this.createTagFilter}
        />
      </Grid>
    );
  }
}

export default compose(
  withNamespaces(),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.members')),
  connect(
    (state) => ({
      loading: state.member.loading,
      tagGroups: tagSelectors.getMemberTagGroups(state),
      tags: tagSelectors.getMemberTags(state),
    }),
    {
      fetchTags,
      goToMemberPage: (id: number) => push(`/member/${id}/`),
      addMember: () => push('/member/add'),
    },
  ),
)(Members);
