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
} from '#src/libs/franchise/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import FranchiseMemberDetailsCard from '#src/libs/franchise/components/FranchiseMemberDetailsCard.components';
import type { RootState } from '#src/reducers';
// @ts-expect-error
import { navigateAsCompanyAdmin as navigateAsCompanyAdminAction } from '#src/actions/auth.actions';
import { FRANCHISE_USER_MEMBERS_PAGE_DEFAULT_SIZE } from '#src/libs/franchise/constants';
import type { FranchiseUserMember } from '#src/libs/franchise/types';
import {
  getFranchiseUserInfo,
  getFranchiseUserMembersCount,
  getFranchiseUserMembersLoading,
  getFranchiseUserMembersPage,
  getFranchiseUserMembersList,
} from '#src/libs/franchise/selectors';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';

type ParamsProps = {
  userId: number;
};

type Props = ParamsProps & ConnectedProps<typeof connector>;

const FranchiseMemberDetailInfo: React.FC<Props> = ({
  userId,
  user,
  members,
  membersLoading,
  membersCount,
  membersPage,
  fetchFranchiseUserInfo,
  fetchFranchiseUserMembers,
  fetchFranchise,
  navigateAsCompanyAdmin,
}) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();

  const listProps = {
    className: classes.companiesContainer,
  };

  useEffect(() => {
    fetchFranchiseUserInfo({ user_id: userId });
  }, [fetchFranchiseUserInfo, userId]);

  React.useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  const goToMemberInCompany = React.useCallback(
    (companyId: number) => () => {
      navigateAsCompanyAdmin(
        companyId,
        `/member/${user?.company_member[companyId]}/info`,
      );
    },
    [navigateAsCompanyAdmin, user?.company_member],
  );

  const fetchMembersList = React.useCallback(
    (page: number) => {
      fetchFranchiseUserMembers({ user_id: userId, page });
    },
    [fetchFranchiseUserMembers, userId],
  );

  if (!user) return <LinearProgress />;

  return (
    <FranchiseMemberPageLayout
      leftChildren={
        <FranchiseMemberSectionLayout>
          <FranchiseMemberDetailsCard user={user} />
        </FranchiseMemberSectionLayout>
      }
      rightChildren={
        <FranchiseMemberSectionLayout title={t('member.franchises')}>
          <Paper>
            <PaginatedListBase
              displayLastDivider
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
    padding: theme.spacing(2),
  },
}));

const connector = connect(
  (state: RootState) => ({
    user: getFranchiseUserInfo(state),
    members: getFranchiseUserMembersList(state),
    membersLoading: getFranchiseUserMembersLoading(state),
    membersCount: getFranchiseUserMembersCount(state),
    membersPage: getFranchiseUserMembersPage(state),
  }),
  {
    fetchFranchiseUserInfo: fetchFranchiseUserInfoAction,
    fetchFranchiseUserMembers: fetchFranchiseUserMembersAction,
    fetchFranchise: fetchFranchiseAction,
    navigateAsCompanyAdmin: navigateAsCompanyAdminAction,
  },
);

export default compose<Props, {}>(
  React.memo,
  routerParamsToProps({ userId: 'userId:number' }),
  connector,
)(FranchiseMemberDetailInfo);
