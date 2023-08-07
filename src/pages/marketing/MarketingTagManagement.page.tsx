// @ts-nocheck
import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { compose, withProps, withStateHandlers } from 'recompose';
import { push, replace as replaceRouter } from 'connected-react-router';
import flatten from 'lodash/flatten';

import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/styles';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { getTheme } from '#libs/theme/selectors';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import withTitle from '../../hocs/with-title.hoc';
import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import {
  fetchAllGroups,
  fetchAllTags,
  createOrUpdateTag,
  createOrUpdateTagGroup,
  fetchTagUsage,
  deleteTag,
  deleteTagGroup,
} from '#libs/tag/actions';
import { getAll } from '#libs/tag/selectors';
import TagGroupList from '#libs/tag/components/TagGroupList.component';
import type { Tag, TagGroup } from '#libs/tag/types';

import {
  applySmartListAutoTagRules,
  fetchAutoTagRules,
  fetchSmartLists,
  updateSmartListAutoTag,
  deleteMultiSmartListAutoTagRules,
} from '#libs/smart-list/actions';
import { AutoTagRule, SmartList } from '#libs/smart-list/types';
import { getAutotagRuleBySmartlist } from '#libs/smart-list/selectors';

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
} from '#libs/member/actions';
import { Member } from '#libs/member/types';

import { Coupon } from '#libs/coupon/types';
import { fetchCoupons, untagCoupon } from '#libs/coupon/actions';

import {
  fetchAllOffers as fetchAllOffersAction,
  fetchAllOffersPaginated as fetchAllOffersPaginatedAction,
  unTagAllOffers as unTagAllOffersAction,
  unTagOffer as unTagOfferAction,
} from '#libs/offer/actions';
import { fetchActivitiesCompany } from '#libs/meta-activity/actions';
import {
  getOfferCalendarState,
  getOfferCalendarStateData,
  withMetaActivity,
} from '#libs/offer/selectors';

import TagDetailHeader from '#libs/marketing/components/TagDetailHeader.component';
import TagDetailOffer from '#libs/marketing/components/TagDetailOffer.component';
import TagDetailSmartlist from '#libs/marketing/components/TagDetailSmartlist';
import TagDetailCoupon from '#libs/marketing/components/TagDetailCoupon';
import TagDetailMembers from '#libs/marketing/components/TagDetailMembers.component';
import TadDetailOfferFilters from '#libs/marketing/components/TagDetailOfferFilters.components';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

export enum TagAuthorizationFilter {
  showAll = 0,
  showOnlyWhiteList = 1,
  showOnlyBlackList = 2,
}
type StateHandlerInit = {
  offer_min_date: moment.Moment;
  offer_max_date: moment.Moment | null;
  tagAuthorizationFilter: TagAuthorizationFilter;
};
const withStateHandlersInit: StateHandlerInit = {
  offer_min_date: moment().startOf('month'),
  offer_max_date: moment().endOf('year'),
  tagAuthorizationFilter: 0,
};

const withStateHandlersSetter = {
  resetDatesfilter: () => () => {
    return {
      offer_min_date: moment().startOf('month'),
      offer_max_date: moment().endOf('month'),
    };
  },
  setOfferFilters:
    () =>
    (
      offer_min_date: moment.Moment,
      offer_max_date: moment.Moment,
      tagAuthorizationFilter: TagAuthorizationFilter,
    ) => {
      return { offer_min_date, offer_max_date, tagAuthorizationFilter };
    },
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {
  tagKind: string;
  selectedTag?: Tag;
  selectedTagId?: number;
  goToCoupon: () => void;
  goToSmartlist: () => void;
  goToActivity: () => void;
};
type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  StateHandlerType;

const MEMBERS_ITEM_PER_PAGE = 10;

const TAG_KIND_MEMBER = 'member';
const TAG_KIND_COUPON = 'coupon';
const TAG_KIND_SMARTLIST = 'smartlist';
const TAG_KIND_OFFER = 'offer';

const { trackFormSuccess } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.TagGroup,
);
class MarketingTagManagement extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchAllGroups();
    this.props.fetchAllTags();
    this.props.fetchActivitiesCompany(this.props.theme.company);
    this.fetchTagData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedTagId !== this.props.selectedTagId) {
      this.fetchTagData();
    }
    if (
      prevProps.selectedTagId === this.props.selectedTagId &&
      this.props.selectedTagId &&
      (prevProps.offer_min_date !== this.props.offer_min_date ||
        prevProps.offer_max_date !== this.props.offer_max_date ||
        prevProps.tagAuthorizationFilter !== this.props.tagAuthorizationFilter)
    ) {
      this.props.fetchAllOffersPaginatedAction({
        page: 1,
        page_size: MEMBERS_ITEM_PER_PAGE,
        available: true,
        min_date: this.props.offer_min_date.format('YYYY-MM-DD'),
        ...(this.props.offer_max_date
          ? {
              max_date: this.props.offer_max_date.format('YYYY-MM-DD'),
            }
          : {}),
        ...this.getOfferTagfilterParams(),
      });
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

      this.props.fetchAllOffersPaginatedAction({
        page: 1,
        page_size: MEMBERS_ITEM_PER_PAGE,
        available: true,
        min_date: this.props.offer_min_date.format('YYYY-MM-DD'),
        ...(this.props.offer_max_date
          ? {
              max_date: this.props.offer_max_date.format('YYYY-MM-DD'),
            }
          : {}),
        ...this.getOfferTagfilterParams(),
      });
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
      tags_included: [this.props.selectedTagId],
      page,
      page_size,
      exclude_archived: true,
      email_confirmed: true,
    });
  };

  loadMembersWithoutTag = (page: number, page_size: number) => {
    this.props.fetchMemberListWithoutTagsAction({
      tags_excluded: [this.props.selectedTagId],
      page,
      page_size,
      exclude_archived: true,
      email_confirmed: true,
    });
  };

  loadOfferFilterBySelectedTag = (page: number, page_size: number) => {
    this.props.fetchAllOffersPaginatedAction({
      page,
      page_size,
      min_date: this.props.offer_min_date.format('YYYY-MM-DD'),
      ...(this.props.offer_max_date
        ? {
            max_date: this.props.offer_max_date.format('YYYY-MM-DD'),
          }
        : {}),
      ...this.getOfferTagfilterParams(),
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

  getOfferTagfilterParams = () => {
    if (this.props.tagAuthorizationFilter === 1) {
      return { whitelist_tags_id__in: [this.props.selectedTagId] };
    }
    if (this.props.tagAuthorizationFilter === 2) {
      return { blacklist_tags_id__in: [this.props.selectedTagId] };
    }

    return { tags_ids__in: [this.props.selectedTagId] };
  };

  getOfferTagDeleteParams = () => {
    if (this.props.tagAuthorizationFilter === 1) {
      return { from_whitelist: true, from_blacklist: false };
    }
    if (this.props.tagAuthorizationFilter === 2) {
      return { from_whitelist: false, from_blacklist: true };
    }

    return { from_blacklist: true, from_whitelist: true };
  };

  unTagAllOffers = (options?: OptionCallback) => {
    this.props.unTagAllOffersAction(
      {
        tag_id: this.props.selectedTagId,
        ...this.getOfferTagDeleteParams(),
      },
      {
        onSuccess: () => {
          this.props.fetchTagUsage();
          this.props.fetchAllOffersPaginatedAction(
            {
              page: 1,
              page_size: MEMBERS_ITEM_PER_PAGE,
              available: true,
              min_date: this.props.offer_min_date.format('YYYY-MM-DD'),
              ...(this.props.offer_max_date
                ? {
                    max_date: this.props.offer_max_date.format('YYYY-MM-DD'),
                  }
                : {}),
              ...this.getOfferTagfilterParams(),
            },
            {
              onSuccess: () => options?.onSuccess && options?.onSuccess(),
              onError: () => options?.onError && options?.onError(),
            },
          );
        },
        onError: () => options?.onError && options?.onError(),
      },
    );
  };

  unTagOffer = (offerId: number, options?: OptionCallback) => {
    this.props.unTagOfferAction(
      {
        offer_id: offerId,
        tag_id: this.props.selectedTagId,
      },
      {
        onSuccess: () => {
          this.props.fetchTagUsage();
          this.props.fetchAllOffersPaginatedAction(
            {
              page: 1,
              page_size: MEMBERS_ITEM_PER_PAGE,
              available: true,
              min_date: this.props.offer_min_date.format('YYYY-MM-DD'),
              ...(this.props.offer_max_date
                ? {
                    max_date: this.props.offer_max_date.format('YYYY-MM-DD'),
                  }
                : {}),
              ...this.getOfferTagfilterParams(),
            },
            {
              onSuccess: () => options?.onSuccess && options?.onSuccess(),
              onError: () => options?.onError && options?.onError(),
            },
          );
        },
        onError: () => options?.onError && options?.onError(),
      },
    );
  };

  render() {
    const { classes, t, membersWithTagList, membersWithoutTagList } =
      this.props;
    return (
      <div className={classes.container}>
        {this.props.tagsLoading && <LinearProgress />}
        <Paper className={classes.toolbar}>
          <Typography className={classes.toolbarTitle}>
            {t('management.tagKind.toolbar')}
          </Typography>
          <RadioGroup
            row
            aria-label="tag-kind"
            className={classes.row}
            name="tag-kind"
            onChange={(ev) =>
              this.props.setQueryParams('tagKind')(ev.target.value)
            }
            value={this.props.tagKind}
          >
            <FormControlLabel
              control={<Radio />}
              label={t('management.tagKind.member')}
              value={TAG_KIND_MEMBER}
            />
            <FormControlLabel
              control={<Radio />}
              label={t('management.tagKind.coupon')}
              value={TAG_KIND_COUPON}
            />
            <FormControlLabel
              control={<Radio />}
              label={t('management.tagKind.smartlist')}
              value={TAG_KIND_SMARTLIST}
            />
            <FormControlLabel
              control={<Radio />}
              label={t('management.tagKind.offer')}
              value={TAG_KIND_OFFER}
            />
          </RadioGroup>
        </Paper>

        <div className={classes.contentContainer}>
          <div className={classes.leftPanel}>
            <TagGroupList
              onCreateOrUpdateTag={this.createOrUpdateTag}
              onCreateOrUpdateTagGroup={this.createOrUpdateTagGroup}
              onDeleteTag={this.onDeleteTag}
              onDeleteTagGroup={this.deleteTagGroup}
              onSelectTag={this.onSelectTag}
              selectedTag={this.props.selectedTag}
              tagGroupList={this.props.tagGroups}
              tagKind={this.props.tagKind}
              tagUsageById={this.props.tagUsageById}
            />
          </div>

          <div className={classes.rightPanel}>
            {this.props.selectedTag &&
              this.props.tagKind === TAG_KIND_OFFER && (
                <TadDetailOfferFilters
                  config={{
                    dateStart: this.props.offer_min_date,
                    dateEnd: this.props.offer_max_date,
                    tagAuthorizationFilter: this.props.tagAuthorizationFilter,
                  }}
                  onSubmit={(values: {
                    dateStart: moment.Moment;
                    dateEnd: moment.Moment;
                    tagAuthorizationFilter: TagAuthorizationFilter;
                  }) =>
                    this.props.setOfferFilters(
                      values.dateStart,
                      values.dateEnd,
                      parseInt(values.tagAuthorizationFilter.toString(), 10),
                    )
                  }
                />
              )}
            <TagDetailHeader tag={this.props.selectedTag} />
            <div className={classes.tagDetail}>
              {this.props.selectedTag &&
                this.props.tagKind === TAG_KIND_MEMBER && (
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
                    onClickMember={this.props.onClickMember}
                    onClickTagMember={this.onClickTagMember}
                    onClickUntagMember={this.onClickUntagMember}
                    onPageRequestWithoutTag={this.loadMembersWithoutTag}
                    onPageRequestWithTag={this.loadMembersWithTag}
                    tag={this.props.selectedTag}
                    tagAll={this.tagAllMember}
                    untagAll={this.untagAllMember}
                  />
                )}

              {this.props.selectedTag &&
                this.props.tagKind === TAG_KIND_COUPON && (
                  <TagDetailCoupon
                    coupons={this.props.coupons}
                    goToCoupon={this.props.goToCoupon}
                    loading={this.props.couponsLoading}
                    onClickRemoveTag={this.onClickUntagCoupon}
                    tag={this.props.selectedTag}
                  />
                )}

              {this.props.selectedTag &&
                this.props.tagKind === TAG_KIND_SMARTLIST && (
                  <TagDetailSmartlist
                    autotagRuleBySmartlist={this.props.autotagRuleBySmartList}
                    goToSmartlist={this.props.goToSmartlist}
                    loading={
                      this.props.smartlistLoading ||
                      this.props.autotagRuleLoading
                    }
                    onChangeTagRule={this.onChangeSmartListTagRule}
                    onClickRemoveTag={this.onClickUntagSmartlist}
                    smartlistList={this.props.smartlist}
                    tag={this.props.selectedTag}
                  />
                )}
              {this.props.selectedTag &&
                this.props.tagKind === TAG_KIND_OFFER && (
                  <TagDetailOffer
                    count={this.props.offersPaginatedState.count}
                    itemPerPage={MEMBERS_ITEM_PER_PAGE}
                    loading={
                      this.props.offersLoading ||
                      this.props.offerTagManagementLoading
                    }
                    offers={this.props.offersPaginatedData}
                    onPageRequested={this.loadOfferFilterBySelectedTag}
                    page={this.props.offersPaginatedState.page}
                    tag={this.props.selectedTag}
                    unTagAll={this.unTagAllOffers}
                    unTagOffer={this.unTagOffer}
                  />
                )}
            </div>
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
  offersPaginatedData: withMetaActivity(getOfferCalendarStateData)(state),
  offersPaginatedState: getOfferCalendarState(state),
  offersLoading: state.offer.loading,
  coupons: state.coupon.coupon.items,
  couponsLoading: state.coupon.coupon.loading,
  smartlist: state.smartList.smartListFiltered.items,
  smartlistLoading: state.smartList.smartListFiltered.loading,
  theme: getTheme(state),

  autotagRuleBySmartList: getAutotagRuleBySmartlist(state),
  autotagRuleLoading: state.smartList.smartListTagRules.loading,
  offerTagManagementLoading: state.offer.tagManagement.loading,
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
  goToActivity: (id: number) => push(`/activity/${id}/general`),
  fetchAllOffersAction,
  fetchAllOffersPaginatedAction,
  fetchActivitiesCompany,
  unTagAllOffersAction,
  unTagOfferAction,
};

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
  withStyles(styles),
  withTranslation(['tag']),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
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
