import React, { useEffect } from 'react';
import { push as pushAction } from 'connected-react-router';

import { ConnectedProps, connect } from 'react-redux';
import { compose } from 'recompose';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classnames from 'classnames';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import {
  fetchFranchise as fetchFranchiseAction,
  fetchFranchiseUser as fetchFranchiseUserAction,
} from '#src/libs/franchise/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import {
  getFranchiseUserById,
  withAllowedFranchisees,
} from '#src/libs/franchise/selectors';
import FranchiseMemberDetailsCard from '#src/libs/franchise/components/FranchiseMemberDetailsCard.components';
import FranchiseMemberMembership from '#src/libs/franchise/components/FranchiseMemberMembership.components';
import type { RootState } from '../../reducers';
// @ts-expect-error
import { navigateAsCompanyAdmin as navigateAsCompanyAdminAction } from '../../actions/auth.actions';

type ParamsProps = {
  userId: number;
};

type Props = ParamsProps & ConnectedProps<typeof connector>;

const FranchiseMemberDetailInfo: React.FC<Props> = ({
  userId,
  user,
  fetchFranchiseUser,
  fetchFranchise,
  navigateAsCompanyAdmin,
  push,
}) => {
  const classes = useStyles();

  useEffect(() => {
    fetchFranchiseUser({ userId });
  }, [fetchFranchiseUser, userId]);

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  const goToCompanyDetails = React.useCallback(
    (companyId: number) => () => {
      navigateAsCompanyAdmin(
        companyId,
        `/member/${user?.company_member[companyId]}/info`,
      );
    },
    [navigateAsCompanyAdmin, user?.company_member],
  );

  const goToFranchiseCompanyDetails = React.useCallback(
    (companyId: number) => () => {
      push(`/f/franchises/${companyId}`);
    },
    [push],
  );

  return (
    <div className={classes.container}>
      {user ? (
        <>
          <div className={classnames(classes.content, classes.left)}>
            <FranchiseMemberDetailsCard user={user} />
          </div>
          <div className={classes.content}>
            <FranchiseMemberMembership
              // @ts-expect-error -> TO DO: will be corrected in the BS-3827 ticket
              companies={user?.companies}
              goToCompanyDetails={goToCompanyDetails}
              goToFranchiseCompanyDetails={goToFranchiseCompanyDetails}
            />
          </div>
        </>
      ) : (
        <LinearProgress />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: theme.spacing(4),
    },
  },
  content: {
    flex: 1,
  },
  left: {
    marginRight: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginBottom: theme.spacing(4),
    },
  },
}));

const connector = connect(
  (state: RootState, props: { userId: number }) => ({
    // @ts-expect-error -> TO DO: will be corrected in the BS-3827 ticket
    user: withAllowedFranchisees(getFranchiseUserById)(state, props.userId),
  }),
  {
    fetchFranchiseUser: fetchFranchiseUserAction,
    fetchFranchise: fetchFranchiseAction,
    navigateAsCompanyAdmin: navigateAsCompanyAdminAction,
    push: pushAction,
  },
);

export default compose<Props, {}>(
  React.memo,
  routerParamsToProps({ userId: 'userId:number' }),
  connector,
)(FranchiseMemberDetailInfo);
