import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { replace as replaceRouter } from 'connected-react-router';
import flatten from 'lodash/flatten';

import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/styles';
import withTitle from '#hocs/with-title.hoc';
// @ts-expect-error
import withQueryParams from '#hocs/with-query-params.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';

import {
  fetchAllGroupTemplates,
  fetchAllTagTemplates,
  createOrUpdateTagTemplate,
  createOrUpdateTagGroupTemplate,
  fetchTagTemplateUsage,
  deleteTagTemplate,
  deleteTagGroupTemplate,
} from '#libs/tag/actions';

import {
  fetchMemberListWithoutTagsAction,
  fetchMemberListWithTagsAction,
  membersListWithoutTagRepo,
  membersListWithTagRepo,
  tag as tagMemberAction,
  untag as untagMemberAction,
} from '#libs/member/actions';

import { getAllTemplate } from '#libs/tag/selectors';
import TagGroupList from '#libs/tag/components/TagGroupList.component';
import type { Tag, TagGroup } from '#libs/tag/types';

import { Member } from '#libs/member/types';

import TagDetailHeader from '#libs/marketing/components/TagDetailHeader.component';
import TagDetailMembers from '#libs/marketing/components/TagDetailMembers.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { RootState } from '../../../reducers';
import { MaterialStyleType } from '../../../utils/types';

const DETAIL_PANEL_ENABLED = false; // due to perf with exclude / include on backend, also it actually does not make much sense

type StateHandlerType = {
  tagKind: string;
  selectedTag?: Tag;
  selectedTagId?: number;
};
type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  StateHandlerType;

const MEMBERS_ITEM_PER_PAGE = 10;

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.TagGroup,
);
class MarketingTagManagement extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchAllGroups();
    this.props.fetchAllTags();
    this.fetchTagData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedTagId !== this.props.selectedTagId) {
      this.fetchTagData();
    }
  }

  fetchTagData = () => {
    if (this.props.selectedTagId) {
      this.loadMembersWithTag(1, MEMBERS_ITEM_PER_PAGE);
      this.loadMembersWithoutTag(1, MEMBERS_ITEM_PER_PAGE);
    }
    this.props.fetchTagUsage();
  };

  createOrUpdateTag = (data: {
    id?: number;
    name: string;
    group?: number;
    color?: string;
    icon?: string;
  }) => {
    this.props.createOrUpdateTag(data);
  };

  onDeleteTag = (tag: Tag) => {
    this.props.deleteTag(tag.id);
    this.props.fetchAllGroups({
      onSuccess: () => {
        if (this.props.selectedTag && tag.id === this.props.selectedTagId) {
          this.props.replace(`/f/marketing/tags/${window.location.search}`);
        }
      },
    });
  };

  deleteTagGroup = (tagGroup: TagGroup) => {
    this.props.deleteTagGroup(tagGroup.id, {
      onSuccess: () => {
        this.props.fetchAllGroups();
      },
    });
    if (this.props.selectedTag) {
      tagGroup.tags.forEach((tag) => {
        tag.id === this.props.selectedTag.id &&
          this.props.replace(`/f/marketing/tags/${window.location.search}`);
      });
    }
  };

  scrollToGroupName = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  createOrUpdateTagGroup = (data: { id: number; name: string }) => {
    this.props.createOrUpdateTagGroup(data, {
      onSuccess: () => {
        trackFormSuccess(data?.id);
        this.props.fetchAllGroups({
          onSuccess: this.scrollToGroupName,
        });
      },
    });
  };

  loadMembersWithTag = (page: number, page_size: number) => {
    this.props.fetchMemberListWithTagsAction({
      tag_templates_included: [this.props.selectedTagId],
      page,
      page_size,
      exclude_archived: true,
      email_confirmed: true,
    });
  };

  loadMembersWithoutTag = (page: number, page_size: number) => {
    this.props.fetchMemberListWithoutTagsAction({
      tag_templates_excluded: [this.props.selectedTagId],
      page,
      page_size,
      exclude_archived: true,
      email_confirmed: true,
    });
  };

  onSelectTag = (tag: Tag) => {
    this.props.replace(`/f/marketing/tags/${tag.id}${window.location.search}`);
  };

  onClickTagMember = (member: Member) => {
    this.props.tag(member.id, this.props.selectedTagId, {
      onSuccess: () => this.fetchTagData(),
    });
  };

  onClickUntagMember = (member: Member) => {
    this.props.untag(member.id, this.props.selectedTagId, {
      onSuccess: () => this.fetchTagData(),
    });
  };

  render() {
    const { classes, membersWithTagList, membersWithoutTagList } = this.props;
    return (
      <div className={classes.container}>
        {this.props.tagsLoading && <LinearProgress />}
        <div className={classes.contentContainer}>
          <div className={classes.leftPanel}>
            <TagGroupList
              onCreateOrUpdateTag={this.createOrUpdateTag}
              onCreateOrUpdateTagGroup={this.createOrUpdateTagGroup}
              onDeleteTag={this.onDeleteTag}
              onDeleteTagGroup={this.deleteTagGroup}
              // @ts-expect-error
              onSelectTag={DETAIL_PANEL_ENABLED && this.onSelectTag}
              selectedTag={this.props.selectedTag}
              tagGroupList={this.props.tagGroups}
              tagKind={this.props.tagKind}
              tagUsageById={this.props.tagUsageById}
            />
          </div>
          {DETAIL_PANEL_ENABLED && (
            <div className={classes.rightPanel}>
              <TagDetailHeader tag={this.props.selectedTag} />
              <div className={classes.tagDetail}>
                {this.props.selectedTag && (
                  <TagDetailMembers
                    itemPerPage={MEMBERS_ITEM_PER_PAGE}
                    membersWithoutTagList={membersWithoutTagList.items}
                    membersWithoutTagListCount={membersWithoutTagList.count}
                    membersWithoutTagListLoading={membersWithoutTagList.loading}
                    membersWithoutTagListPage={membersWithoutTagList.page}
                    membersWithTagList={membersWithTagList.items}
                    membersWithTagListCount={membersWithTagList.count}
                    membersWithTagListLoading={membersWithTagList.loading}
                    membersWithTagListPage={membersWithTagList.page}
                    // @ts-expect-error
                    onClickMember={this.props.onClickMember}
                    onClickTagMember={this.onClickTagMember}
                    onClickUntagMember={this.onClickUntagMember}
                    onPageRequestWithoutTag={this.loadMembersWithoutTag}
                    onPageRequestWithTag={this.loadMembersWithTag}
                    // @ts-expect-error
                    tag={this.props.selectedTag}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  tagGroups: getAllTemplate(state),
  tagUsageById: state.tag.tagTemplateUsage.byId,
  tagsLoading: state.tag.tagTemplate.loading,
  membersWithTagList: membersListWithTagRepo.selectors.full(state.member),
  membersWithoutTagList: membersListWithoutTagRepo.selectors.full(state.member),
});

const mapDispatchToProps = {
  fetchAllGroups: fetchAllGroupTemplates,
  fetchAllTags: fetchAllTagTemplates,
  fetchTagUsage: fetchTagTemplateUsage,
  createOrUpdateTagGroup: createOrUpdateTagGroupTemplate,
  createOrUpdateTag: createOrUpdateTagTemplate,
  deleteTagGroup: deleteTagGroupTemplate,
  deleteTag: deleteTagTemplate,
  // refreshFilteredMembers,
  fetchMemberListWithTagsAction,
  fetchMemberListWithoutTagsAction,
  // fetchTagAllMembersAction,
  // fetchUntagAllMemberAction,
  tag: tagMemberAction,
  untag: untagMemberAction,
  // onClickMember: (id: number) => push(`/member/${id}`),
  replace: replaceRouter,
  // unTagAllOffersAction,
  // unTagOfferAction,
};

// @ts-expect-error
const styles = (theme) => ({
  tagDetail: {
    maxHeight: '90vh',
    overflow: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    marginTop: -theme.spacing(2),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  toolbarTitle: {
    marginRight: theme.spacing(2),
  },
  contentContainer: {
    display: 'flex',
    width: '100%',
    marginTop: theme.spacing(2),
  },
  leftPanel: {
    flex: 1,
    maxWidth: '50%',
    paddingBottom: '2vh',
  },
  rightPanel: {
    flex: 1,
    maxWidth: '50%',
    marginLeft: theme.spacing(4),
    paddingBottom: '2vh',
  },
});

export default compose(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['tag']),
  routerParamsToProps({ selectedTagId: 'selectedTagId:number' }),
  connect(mapStateToProps, mapDispatchToProps),
  withQueryParams([['tagKind'], 'queryParams', 'setQueryParams']),
  withProps(({ queryParams, selectedTagId, tagGroups }) => ({
    tagKind: queryParams?.tagKind || 'member',
    selectedTag: selectedTagId
      ? flatten(tagGroups.map((tg: TagGroup) => tg.tags)).find(
          (tag: Tag) => tag.id === selectedTagId,
        )
      : null,
  })),
  withTitle(({ t }: { t: TFunction }) => t('navigation:backofficeMenu.tags')),
)(MarketingTagManagement);
