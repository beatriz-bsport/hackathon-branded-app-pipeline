import React from 'react';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import flatten from 'lodash/flatten';
import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/styles';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { push, replace as replaceRouter } from 'connected-react-router';
import Radio from '@material-ui/core/Radio';

import Typography from '@material-ui/core/Typography';
import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchAllGroups,
  fetchAllTags,
  createOrUpdateTag,
  createOrUpdateTagGroup,
  fetchTagUsage,
  deleteTag,
  deleteTagGroup,
} from '../../libs/tag/actions';

import {
  applySmartListAutoTagRules,
  fetchAutoTagRules,
  fetchSmartLists,
  updateSmartListAutoTag,
  deleteMultiSmartListAutoTagRules,
} from '../../libs/smart-list/actions';

import { getAll } from '../../libs/tag/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import withTitle from '../../hocs/with-title.hoc';
import { RootState } from '../../reducers';
import TagGroupList from '../../libs/tag/components/TagGroupList.component';
import { Tag, TagGroup } from '../../libs/tag/types';
import { fetchCoupons, untagCoupon } from '../../libs/coupon/actions';
import { MaterialStyleType } from '../../utils/types';
import TagDetailHeader from '../../libs/marketing/components/TagDetailHeader.component';
import {
  fetchMemberListWithoutTagsAction,
  fetchMemberListWithTagsAction,
  fetchTagAllMembersAction,
  fetchUntagAllMemberAction,
  membersListWithoutTagRepo,
  membersListWithTagRepo,
  refreshFilteredMembers,
  tag as tagMemberAction,
  untag as untagMemberAction,
} from '../../libs/member/actions';
import TagDetailMembers from '../../libs/marketing/components/TagDetailMembers.component';
import { Member } from '../../libs/member/types';
import TagDetailCoupon from '../../libs/marketing/components/TagDetailCoupon';
import { Coupon } from '../../libs/coupon/types';
import TagDetailSmartlist from '../../libs/marketing/components/TagDetailSmartlist';
import { AutoTagRule, SmartList } from '../../libs/smart-list/types';
import { getAutotagRuleBySmartlist } from '../../libs/smart-list/selectors';
import { OptionCallback } from '../../state/types';

type OwnProps = {
  tagKind: string;
  selectedTag?: Tag;
  selectedTagId?: number;
  goToCoupon: () => void;
  goToSmartlist: () => void;
};
type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const MEMBERS_ITEM_PER_PAGE = 10;

const TAG_KIND_MEMBER = 'member';
const TAG_KIND_COUPON = 'coupon';
const TAG_KIND_SMARTLIST = 'smartlist';

class TagManagement extends React.PureComponent<Props> {
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
      this.loadMembersWithTag(
        1,
        MEMBERS_ITEM_PER_PAGE,
        this.props.selectedTagId,
      );
      this.loadMembersWithoutTag(
        1,
        MEMBERS_ITEM_PER_PAGE,
        this.props.selectedTagId,
      );

      this.props.fetchCoupons({
        tags__in: [this.props.selectedTagId],
      });

      this.props.fetchSmartLists({ tag: this.props.selectedTagId });
      this.props.fetchAutoTagRules({ tag: this.props.selectedTagId });
    }
    this.props.fetchTagUsage();
  };

  createOrUpdateTag = (data: { id?: number; name: string; group?: number }) => {
    this.props.createOrUpdateTag(data);
  };

  onDeleteTag = (tag: Tag) => {
    this.props.deleteTag(tag.id);
    this.props.fetchAllGroups({
      onSuccess: () => {
        if (this.props.selectedTag && tag.id === this.props.selectedTagId) {
          this.props.replace(`/marketing/tags/${window.location.search}`);
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
          this.props.replace(`/marketing/tags/${window.location.search}`);
      });
    }
  };

  createOrUpdateTagGroup = (data: { id: number; name: string }) => {
    this.props.createOrUpdateTagGroup(data, {
      onSuccess: () => this.props.fetchAllGroups(),
    });
  };

  loadMembersWithTag = (page: number, page_size: number) => {
    this.props.fetchMemberListWithTagsAction({
      tags_included: [this.props.selectedTagId],
      page,
      page_size,
    });
  };

  loadMembersWithoutTag = (page: number, page_size: number) => {
    this.props.fetchMemberListWithoutTagsAction({
      tags_excluded: [this.props.selectedTagId],
      page,
      page_size,
    });
  };

  onSelectTag = (tag: Tag) => {
    this.props.replace(`/marketing/tags/${tag.id}${window.location.search}`);
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

  untagAllMember = (options: OptionCallback) => {
    if (this.props.selectedTagId) {
      this.props.fetchUntagAllMemberAction(this.props.selectedTagId, {
        onSuccess: () => {
          this.fetchTagData();
          if (options && options.onSuccess) {
            options.onSuccess();
          }
        },
        onError: () => {
          if (options && options.onError) {
            options.onError();
          }
        },
      });
    }
  };

  tagAllMember = (options: OptionCallback) => {
    if (this.props.selectedTagId) {
      this.props.fetchTagAllMembersAction(this.props.selectedTagId, {
        onSuccess: () => {
          this.fetchTagData();
          if (options && options.onSuccess) {
            options.onSuccess();
          }
        },
        onError: () => {
          if (options && options.onError) {
            options.onError();
          }
        },
      });
    }
  };

  onClickUntagCoupon = async (coupon: Coupon) => {
    if (this.props.selectedTagId) {
      await this.props.untagCoupon(coupon.id, this.props.selectedTagId);
      this.props.fetchCoupons({
        tags__in: [this.props.selectedTagId],
      });
    }
  };

  onClickUntagSmartlist = async (smartlist: SmartList) => {
    if (this.props.selectedTagId) {
      await this.props.deleteMultiSmartListAutoTagRules(
        smartlist.id,
        this.props.selectedTagId,
      );
      this.props.fetchSmartLists({ tag: this.props.selectedTagId });
    }
  };

  onChangeSmartListTagRule = (autotagRule: AutoTagRule) => {
    this.props.updateSmartListAutoTag(autotagRule.id, autotagRule, {
      onSuccess: () => {
        this.props.fetchAutoTagRules({ tag: autotagRule.tag });
        this.props.applySmartListAutoTagRules(autotagRule.smartlist);
      },
    });
  };

  render() {
    const {
      classes,
      t,
      membersWithTagList,
      membersWithoutTagList,
    } = this.props;

    return (
      <div className={classes.container}>
        {this.props.tagsLoading && <LinearProgress />}
        <Paper className={classes.toolbar}>
          <Typography className={classes.toolbarTitle}>
            {t('management.tagKind.toolbar')}
          </Typography>
          <RadioGroup
            aria-label="tag-kind"
            name="tag-kind"
            value={this.props.tagKind}
            onChange={(ev) =>
              this.props.setQueryParams('tagKind')(ev.target.value)
            }
            className={classes.row}
            row
          >
            <FormControlLabel
              value={TAG_KIND_MEMBER}
              control={<Radio />}
              label={t('management.tagKind.member')}
            />
            <FormControlLabel
              value={TAG_KIND_COUPON}
              control={<Radio />}
              label={t('management.tagKind.coupon')}
            />
            <FormControlLabel
              value={TAG_KIND_SMARTLIST}
              control={<Radio />}
              label={t('management.tagKind.smartlist')}
            />
          </RadioGroup>
        </Paper>

        <div className={classes.contentContainer}>
          <div className={classes.leftPanel}>
            <TagGroupList
              tagGroupList={this.props.tagGroups}
              onCreateOrUpdateTagGroup={this.createOrUpdateTagGroup}
              onDeleteTagGroup={this.deleteTagGroup}
              onCreateOrUpdateTag={this.createOrUpdateTag}
              onDeleteTag={this.onDeleteTag}
              onSelectTag={this.onSelectTag}
              selectedTag={this.props.selectedTag}
              tagUsageById={this.props.tagUsageById}
              tagKind={this.props.tagKind}
            />
          </div>

          <div className={classes.rightPanel}>
            <TagDetailHeader tag={this.props.selectedTag} />

            {this.props.selectedTag &&
              this.props.tagKind === TAG_KIND_MEMBER && (
                <TagDetailMembers
                  tag={this.props.selectedTag}
                  membersWithTagList={membersWithTagList.items}
                  membersWithTagListCount={membersWithTagList.count}
                  membersWithTagListLoading={membersWithTagList.loading}
                  membersWithTagListPage={membersWithTagList.page}
                  membersWithoutTagList={membersWithoutTagList.items}
                  membersWithoutTagListCount={membersWithoutTagList.count}
                  membersWithoutTagListLoading={membersWithoutTagList.loading}
                  membersWithoutTagListPage={membersWithoutTagList.page}
                  onPageRequestWithTag={this.loadMembersWithTag}
                  onPageRequestWithoutTag={this.loadMembersWithoutTag}
                  onClickTagMember={this.onClickTagMember}
                  onClickMember={this.props.onClickMember}
                  onClickUntagMember={this.onClickUntagMember}
                  itemPerPage={MEMBERS_ITEM_PER_PAGE}
                  untagAll={this.untagAllMember}
                  tagAll={this.tagAllMember}
                />
              )}

            {this.props.selectedTag &&
              this.props.tagKind === TAG_KIND_COUPON && (
                <TagDetailCoupon
                  coupons={this.props.coupons}
                  loading={this.props.couponsLoading}
                  tag={this.props.selectedTag}
                  onClickRemoveTag={this.onClickUntagCoupon}
                  goToCoupon={this.props.goToCoupon}
                />
              )}

            {this.props.selectedTag &&
              this.props.tagKind === TAG_KIND_SMARTLIST && (
                <TagDetailSmartlist
                  smartlistList={this.props.smartlist}
                  autotagRuleBySmartlist={this.props.autotagRuleBySmartList}
                  loading={
                    this.props.smartlistLoading || this.props.autotagRuleLoading
                  }
                  tag={this.props.selectedTag}
                  onClickRemoveTag={this.onClickUntagSmartlist}
                  onChangeTagRule={this.onChangeSmartListTagRule}
                  goToSmartlist={this.props.goToSmartlist}
                />
              )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  tagGroups: getAll(state),
  tagGroupsLoading: state.tag.group.loading,
  tagUsageById: state.tag.tagUsage.byId,
  tagsLoading: state.tag.tag.loading,
  members: state.member.allIds,
  membersWithTagList: membersListWithTagRepo.selectors.full(state.member),
  membersWithoutTagList: membersListWithoutTagRepo.selectors.full(state.member),
  coupons: state.coupon.coupon.items,
  couponsLoading: state.coupon.coupon.loading,
  smartlist: state.smartList.smartListFiltered.items,
  smartlistLoading: state.smartList.smartListFiltered.loading,
  autotagRuleBySmartList: getAutotagRuleBySmartlist(state),
  autotagRuleLoading: state.smartList.smartListTagRules.loading,
});

const mapDispatchToProps = {
  fetchAllGroups,
  fetchAllTags,
  fetchTagUsage,
  createOrUpdateTagGroup,
  createOrUpdateTag,
  deleteTagGroup,
  deleteTag,
  refreshFilteredMembers,
  fetchMemberListWithTagsAction,
  fetchMemberListWithoutTagsAction,
  fetchTagAllMembersAction,
  fetchUntagAllMemberAction,
  tag: tagMemberAction,
  untag: untagMemberAction,
  untagCoupon,
  fetchCoupons,
  fetchSmartLists,
  fetchAutoTagRules,
  updateSmartListAutoTag,
  applySmartListAutoTagRules,
  deleteMultiSmartListAutoTagRules,
  onClickMember: (id: number) => push(`/member/${id}`),
  replace: replaceRouter,
  goToCoupon: () => push('/coupon'),
  goToSmartlist: () => push('/smart-list'),
};

const styles = (theme) => ({
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
  },
  rightPanel: {
    flex: 1,
    maxWidth: '50%',
    marginLeft: theme.spacing(4),
  },
});

export default compose(
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
)(TagManagement);
