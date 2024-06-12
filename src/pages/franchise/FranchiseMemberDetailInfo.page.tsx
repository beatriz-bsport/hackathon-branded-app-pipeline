import React, { useEffect } from 'react';

import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import FranchiseMemberPageLayout from '#src/components/franchise/FranchiseMemberPageLayout.component';
import FranchiseMemberSectionLayout from '#src/components/franchise/FranchiseMemberSectionLayout.component';
import FranchiseMemberRowItem from '#src/libs/franchise/components/FranchiseMemberRowItem.component';
import {
  fetchFranchiseUserInfo as fetchFranchiseUserInfoAction,
  fetchFranchiseUserMembers as fetchFranchiseUserMembersAction,
  fetchFranchise as fetchFranchiseAction,
  fetchFranchiseUserTags as fetchFranchiseUserTagsAction,
  updateFranchiseUserTags as updateFranchiseUserTagsActions,
} from '#src/libs/franchise/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
// @ts-expect-error
import { openNewWindowToImpersonate as openNewWindowToImpersonateAction } from '#src/actions/auth.actions';

import FranchiseMemberDetailsCard from '#src/libs/franchise/components/FranchiseMemberDetailsCard.components';
import type { RootState } from '#src/reducers';
import {
  FRANCHISE_MEMBER_TAG_PAGE_DEFAULT_SIZE,
  FRANCHISE_USER_MEMBERS_PAGE_DEFAULT_SIZE,
} from '#src/libs/franchise/constants';
import type { FranchiseUserMember } from '#src/libs/franchise/types';
import {
  getFranchiseUserInfo,
  getFranchiseUserMembersCount,
  getFranchiseUserMembersLoading,
  getFranchiseUserMembersPage,
  getFranchiseUserMembersList,
  getFranchiseUserTagsCount,
  getFranchiseUserTagsList,
  getFranchiseUserTagsLoading,
  getFranchiseUserTagsPage,
} from '#src/libs/franchise/selectors';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import FranchiseMemberTagList from '#src/libs/franchise/components/FranchiseMemberTagList.component';
import { getTagTemplates, getAllTemplate } from '#src/libs/tag/selectors';
import {
  fetchAllGroupTemplates as fetchAllGroupTemplatesActions,
  fetchAllTagTemplates as fetchAllTagTemplatesActions,
} from '#src/libs/tag/actions';
import FranchiseMemberTagManagementModal from '#src/libs/franchise/components/FranchiseMemberTagManagementModal.component';

type ParamsProps = {
  userId: number;
};

type Props = ParamsProps & ConnectedProps<typeof connector>;

const FranchiseMemberDetailInfo: React.FC<Props> = ({
  fetchAllGroupTemplates,
  fetchAllTagTemplates,
  fetchFranchise,
  fetchFranchiseUserInfo,
  fetchFranchiseUserMembers,
  fetchFranchiseUserTags,
  members,
  membersCount,
  membersLoading,
  membersPage,
  openNewWindowToImpersonate,
  tags,
  tagsByTagGroup,
  tagsCount,
  tagsLoading,
  tagsPage,
  tagTemplates,
  updateFranchiseUserTags,
  user,
  userId,
}) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();

  const listProps = {
    className: classes.companiesContainer,
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    fetchFranchiseUserInfo({ user_id: userId });
  }, [fetchFranchiseUserInfo, userId]);

  React.useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  const goToMemberInCompany = React.useCallback(
    (companyId: number) => () => {
      if (companyId && user && user.company_member) {
        openNewWindowToImpersonate(
          companyId,
          `/member/${user?.company_member[companyId]}/info`,
        );
      }
    },
    [user, openNewWindowToImpersonate],
  );

  const fetchMembersList = React.useCallback(
    (page: number) => {
      fetchFranchiseUserMembers({ user_id: userId, page });
    },
    [fetchFranchiseUserMembers, userId],
  );

  const fetchTagsList = React.useCallback(
    (page: number) => {
      fetchFranchiseUserTags({ user_id: userId, page });
    },
    [fetchFranchiseUserTags, userId],
  );

  const onModalSave = React.useCallback(
    (selectedTagTemplateIds: number[]) => {
      updateFranchiseUserTags(
        {
          user_id: userId,
          data: { user_tag_ids: selectedTagTemplateIds },
        },
        {
          onBackgroundSuccess: () => {
            fetchFranchiseUserTags({
              user_id: userId,
              page: 1,
              page_size: selectedTagTemplateIds.length,
            });
          },
        },
      );
    },
    [userId, fetchFranchiseUserTags, updateFranchiseUserTags],
  );

  useEffect(() => {
    if (isModalOpen) {
      fetchAllTagTemplates();
      fetchAllGroupTemplates();
    }
  }, [isModalOpen, fetchAllTagTemplates, fetchAllGroupTemplates]);

  useEffect(() => {
    /*
    In the modal, we want to retieve all the tags associated to the User
    but the call on the previous page (which stores the tags in `userTags`) is paginated with `page_size = FRANCHISE_MEMBER_TAG_PAGE_DEFAULT_SIZE`. 
    So, if `tagsCount > FRANCHISE_MEMBER_TAG_PAGE_DEFAULT_SIZE`, only `FRANCHISE_MEMBER_TAG_PAGE_DEFAULT_SIZE` tags among the `tagsCount` have been fecthed.
    Thus, we need to fetch all the tags by doing a paginated call with `page_size = tagsCount`.
    */
    if (isModalOpen && tagsCount > FRANCHISE_MEMBER_TAG_PAGE_DEFAULT_SIZE) {
      fetchFranchiseUserTags({
        user_id: userId,
        page: 1,
        page_size: tagsCount,
      });
    }
  }, [isModalOpen, userId, tagsCount, fetchFranchiseUserTags]);

  if (!user) return <LinearProgress />;

  return (
    <FranchiseMemberPageLayout
      leftChildren={
        <FranchiseMemberSectionLayout>
          <FranchiseMemberDetailsCard user={user} />
          <div className={classes.detailAndTagsContainer}>
            <Paper>
              <FranchiseMemberTagList
                fetchTagsList={fetchTagsList}
                setIsModalOpen={setIsModalOpen}
                tags={tags}
                tagsCount={tagsCount}
                tagsLoading={tagsLoading}
                tagsPage={tagsPage}
              />
              <FranchiseMemberTagManagementModal
                onSave={onModalSave}
                open={isModalOpen}
                setOpen={setIsModalOpen}
                tagsByTagGroup={tagsByTagGroup}
                tagTemplates={tagTemplates}
                userTags={tags}
              />
            </Paper>
          </div>
        </FranchiseMemberSectionLayout>
      }
      rightChildren={
        <FranchiseMemberSectionLayout title={t('member.franchises')}>
          <Paper>
            <PaginatedListBase
              itemPerPage={FRANCHISE_USER_MEMBERS_PAGE_DEFAULT_SIZE}
              items={members}
              listProps={listProps}
              loading={membersLoading}
              nbItems={membersCount}
              onPageRequested={fetchMembersList}
              page={membersPage}
              renderItem={(member: FranchiseUserMember) => (
                <FranchiseMemberRowItem
                  isLast={member.id === members.at(-1).id}
                  member={member}
                  onClick={goToMemberInCompany(parseInt(member.company_id))}
                />
              )}
            />
          </Paper>
        </FranchiseMemberSectionLayout>
      }
    />
  );
};

const useStyles = makeStyles((theme) => ({
  companiesContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
  },
  detailAndTagsContainer: {
    marginTop: theme.spacing(2),
  },
}));

const connector = connect(
  (state: RootState) => ({
    user: getFranchiseUserInfo(state),
    members: getFranchiseUserMembersList(state),
    membersLoading: getFranchiseUserMembersLoading(state),
    membersCount: getFranchiseUserMembersCount(state),
    membersPage: getFranchiseUserMembersPage(state),
    tags: getFranchiseUserTagsList(state),
    tagsLoading: getFranchiseUserTagsLoading(state),
    tagsCount: getFranchiseUserTagsCount(state),
    tagsPage: getFranchiseUserTagsPage(state),
    tagTemplates: getTagTemplates(state),
    tagsByTagGroup: getAllTemplate(state),
  }),
  {
    fetchFranchiseUserInfo: fetchFranchiseUserInfoAction,
    fetchFranchiseUserMembers: fetchFranchiseUserMembersAction,
    fetchFranchise: fetchFranchiseAction,
    fetchFranchiseUserTags: fetchFranchiseUserTagsAction,
    updateFranchiseUserTags: updateFranchiseUserTagsActions,
    fetchAllGroupTemplates: fetchAllGroupTemplatesActions,
    fetchAllTagTemplates: fetchAllTagTemplatesActions,
    openNewWindowToImpersonate: openNewWindowToImpersonateAction,
  },
);

export default compose<Props, {}>(
  React.memo,
  routerParamsToProps({ userId: 'userId:number' }),
  connector,
)(FranchiseMemberDetailInfo);
