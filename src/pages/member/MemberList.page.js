// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fetchMemberList } from '../../libs/member/api';
import withTitle from '../../hocs/with-title.hoc';
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

  classes: Object,
  t: TFunction,
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
    <div className={this.props.classes.actionBar}>
      <Button onClick={this.props.addMember} color="primary" variant="outlined">
        <AddIcon />
        {this.props.t('member:addMember')}
      </Button>
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
    </div>
  );

  render() {
    const { addMember, goToMemberPage } = this.props;

    return (
      <Grid container direction="row" spacing={4}>
        <Grid item xs={12}>
          <MemberTable
            tagsExcluded={this.state.tagsExcluded}
            tagsIncluded={this.state.tagsIncluded}
            fetch={fetchMemberList}
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

const styles = (theme) => ({
  actionBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: theme.spacing(2),
    marginLeft: -theme.spacing(1),
  },
});

export default compose(
  withTranslation(['titles', 'member']),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) => t('titles:member.members')),
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
