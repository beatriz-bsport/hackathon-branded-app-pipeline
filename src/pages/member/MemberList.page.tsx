// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { createStyles, WithStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { TFunction } from 'i18next';
import { fetchMemberList } from '../../libs/member/api';
import withTitle from '../../hocs/with-title.hoc';
import MemberTable from '../../libs/member/MemberTable.component';
import TagChipList from '../../libs/tag/components/TagChipList.component';
import TagFilterForm from '../../libs/tag/components/TagFilterForm.component';
import tagSelectors from '../../libs/tag/selectors';
import type { Tag } from '../../libs/tag/types';

import { fetchTags } from '../../libs/tag/actions';
import { RootState } from '../../reducers';

type Props = WithStyles<typeof styles> & ConnectedProps<typeof connector>;

type TagFilterFormType = {
  include?: boolean;
  tagId?: number;
};

type State = {
  tagsIncluded: Array<Tag['id']>;
  tagsExcluded: Array<Tag['id']>;
  showFilterForm: boolean;
};

export class Members extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tagsIncluded: [],
      tagsExcluded: [],
      showFilterForm: false,
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

  render() {
    const { addMember, goToMemberPage } = this.props;

    return (
      <Grid container direction="row" spacing={4}>
        <Grid item xs={12}>
          <MemberTable
            tagsExcluded={this.state.tagsExcluded}
            tagsIncluded={this.state.tagsIncluded}
            fetch={this.fetchMemberList}
            goToMember={goToMemberPage}
            addMember={addMember}
            customToolBar={this.tagFilterBar}
          />
        </Grid>
        <TagFilterForm
          open={this.state.showFilterForm}
          onClose={() => this.setState({ showFilterForm: false })}
          tagList={this.props.tags}
          createFilter={this.createTagFilter}
        />
      </Grid>
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
  (state: RootState) => ({
    loading: state.member.loading,
    tags: tagSelectors.getMemberTagsWithTagGroup(state),
  }),
  {
    fetchTags,
    goToMemberPage: (id: number) => push(`/member/${id}/`),
    addMember: () => push('/member/add'),
  },
);

export default compose<any, Props>(
  withTranslation(['titles', 'member']),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) => t('titles:member.members')),
  connector,
)(Members);
