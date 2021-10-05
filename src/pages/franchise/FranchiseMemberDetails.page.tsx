// @flow
import React, { useEffect } from 'react';
import { TFunction } from 'i18next';
import { push as pushAction } from 'connected-react-router';

import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import {
  CircularProgress,
  createStyles,
  Theme,
  WithStyles,
} from '@material-ui/core';
import classnames from 'classnames';

import {
  fetchFranchise as fetchFranchiseAction,
  fetchFranchiseUser as fetchFranchiseUserAction,
} from '../../libs/franchise/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import {
  getFranchiseCompanyById,
  getFranchiseUserById,
} from '../../libs/franchise/selectors';
import FranchiseMemberDetailsCard from '../../libs/franchise/components/FranchiseMemberDetailsCard.components';
import FranchiseMemberMembership from '../../libs/franchise/components/FranchiseMemberMembership.components';
import { RootState } from '../../reducers';
import { navigateAsCompanyAdmin as navigateAsCompanyAdminAction } from '../../actions/auth.actions';

type OwnProps = {
  userId: number;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles>;

const FranchiseMemberDetails = (props: Props) => {
  const {
    userId,
    user,
    companiesById,
    classes,
    fetchFranchiseUser,
    fetchFranchise,
    navigateAsCompanyAdmin,
    push,
  } = props;

  useEffect(() => {
    fetchFranchiseUser({ userId });
  }, [fetchFranchiseUser, userId]);

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  const goToCompanyDetails = (companyId: number) => () => {
    navigateAsCompanyAdmin(
      companyId,
      `/member/${user.company_member[companyId]}/info`,
    );
  };

  const goToFranchiseCompanyDetails = (companyId: number) => () => {
    push(`/f/franchises/${companyId}`);
  };

  return (
    <div className={classes.container}>
      {user && (
        <>
          <div className={classnames(classes.content, classes.left)}>
            <FranchiseMemberDetailsCard user={user} />
          </div>
          <div className={classes.content}>
            <FranchiseMemberMembership
              companies={user?.companies
                .map((companyId) => {
                  const company = companiesById[companyId];
                  if (!company) return null;
                  return company;
                })
                .filter((c) => c !== null)}
              goToCompanyDetails={goToCompanyDetails}
              goToFranchiseCompanyDetails={goToFranchiseCompanyDetails}
            />
          </div>
        </>
      )}
      {!user && <CircularProgress className={classes.loader} />}
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
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
    loader: {
      margin: 'auto',
      marginTop: theme.spacing(4),
    },
    left: {
      marginRight: theme.spacing(4),
      [theme.breakpoints.down('sm')]: {
        marginRight: 0,
        marginBottom: theme.spacing(4),
      },
    },
  });

const connector = connect(
  (state: RootState, props: { userId: number }) => ({
    user: getFranchiseUserById(state, props.userId),
    companiesById: getFranchiseCompanyById(state),
  }),
  {
    fetchFranchiseUser: fetchFranchiseUserAction,
    fetchFranchise: fetchFranchiseAction,
    navigateAsCompanyAdmin: navigateAsCompanyAdminAction,
    push: pushAction,
  },
);

export default compose<any, OwnProps>(
  routerParamsToProps({ userId: 'userId:number' }),
  withTranslation(['franchise']),
  withStyles(styles, { withTheme: true }),
  withTitle(({ t }: { t: TFunction }) => t('member.pageTitle')),
  connector,
)(FranchiseMemberDetails);
