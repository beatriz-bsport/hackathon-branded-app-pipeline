// @flow
import React, { Component } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { TFunction } from 'i18next';
import { push as pushAction } from 'connected-react-router';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import FranchiseCompanySearchList from '../../libs/franchise/components/FranchiseCompanySearchList.components';
import FranchiseCompanyDetails from '../../libs/franchise/components/FranchiseCompanyDetails.components';
import {
  getFranchiseCompanies,
  getFranchiseCompanyById,
  getCompanyGroupList,
} from '../../libs/franchise/selectors';
import { RootState } from '../../reducers';
import {
  fetchFranchise as fetchFranchiseAction,
  fetchCompanyGroupList,
  createOrUpdateCompanyGroup,
} from '../../libs/franchise/actions';
import { fetchFilteredMembers as fetchFilteredMembersAction } from '../../libs/member/actions';
import {
  getAllMembers,
  getListCountMembers,
} from '../../libs/member/selectors';
import {
  fetchAssociatedEstablishments as fetchAssociatedEstablishmentsAction,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '../../libs/establishment/actions';
import {
  getAllAssociatedEstablishment,
  getEstablishment,
} from '../../libs/establishment/selectors';
import { Establishment } from '../../libs/establishment/types';
import { navigateAsCompanyAdmin as navigateAsCompanyAdminAction } from '../../actions/auth.actions';

type OwnProps = {
  companyId: number;
};

type State = {
  page: number;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class FranchiseCompanyList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      page: 1,
    };
  }

  componentDidMount() {
    this.props.fetchFranchise();
    this.props.fetchCompanyGroupList();

    if (this.props.companyId && !Number.isNaN(this.props.companyId)) {
      this.props.fetchFilteredMembers({
        company: this.props.companyId,
        page: this.state.page,
        page_size: 5,
      });

      this.props.fetchAssociatedEstablishments({
        company: this.props.companyId,
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    // on new company click
    if (
      prevProps.companyId !== this.props.companyId &&
      !Number.isNaN(this.props.companyId)
    ) {
      this.props.fetchFilteredMembers({
        company: this.props.companyId,
        page: this.state.page,
        page_size: 5,
      });

      this.props.fetchAssociatedEstablishments({
        company: this.props.companyId,
      });
    }

    if (
      prevProps.associatedEstablishments !== this.props.associatedEstablishments
    ) {
      this.props.fetchEstablishmentBulk(
        this.props.associatedEstablishments.map(
          (associatedEstablishment) => associatedEstablishment.establishment,
        ),
      );
    }
  }

  handleCompanySelected = (companySelected: number) => () => {
    this.setState({ page: 1 });
    this.props.push(`/f/franchises/${companySelected}`);
  };

  handleChangePage = (newPage: number) => {
    this.setState({ page: newPage });
    this.props.fetchFilteredMembers({
      company: this.props.companyId,
      page: newPage,
      page_size: 5,
    });
  };

  goToCompany = (companyId: number) => () => {
    this.props.navigateAsCompanyAdmin(companyId, '');
  };

  goToUser = (companyId: number) => (memberId: number) => () => {
    this.props.navigateAsCompanyAdmin(companyId, `/member/${memberId}/info`);
  };

  createOrUpdateCompanyGroup = (data, options) => {
    this.props.createOrUpdateCompanyGroup(data, {
      onSuccess: (...args) => {
        if (options && options.onSuccess) {
          this.props.fetchFranchise();
          this.props.fetchCompanyGroupList();
          options.onSuccess(...args);
        }
      },
      onError: options && options.onError,
    });
  };

  render() {
    const {
      companies,
      companiesById,
      classes,
      companyId,
      members,
      membersCount,
      establishmentsByLocation,
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.left}>
          <FranchiseCompanySearchList
            selectedCompanyId={companyId}
            asManager
            companies={companies}
            companyGroupList={this.props.companyGroupList}
            handleCompanySelected={this.handleCompanySelected}
            createOrUpdateCompanyGroup={this.createOrUpdateCompanyGroup}
          />
        </div>
        <div className={classes.right}>
          <FranchiseCompanyDetails
            companyId={companyId}
            companyName={companiesById?.[companyId]?.name}
            memberCounts={membersCount}
            members={members}
            establishmentsByLocation={establishmentsByLocation}
            page={this.state.page}
            handleChangePage={this.handleChangePage}
            goToCompany={this.goToCompany(companyId)}
            goToUser={this.goToUser(companyId)}
          />
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
      display: 'flex',
    },
    left: {
      flex: 1,
      marginRight: theme.spacing(4),
    },
    right: {
      flex: 1,
    },
  });

const connector = connect(
  (state: RootState) => ({
    companies: getFranchiseCompanies(state),
    companiesById: getFranchiseCompanyById(state),
    companyGroupList: getCompanyGroupList(state),
    members: getAllMembers(state),
    membersCount: getListCountMembers(state),
    associatedEstablishments: getAllAssociatedEstablishment(state),
    establishmentsByLocation: getAllAssociatedEstablishment(state)
      ?.map((associatedEstablishment) =>
        getEstablishment(state, associatedEstablishment?.establishment),
      )
      .reduce((acc, establishment) => {
        acc[establishment?.location?.address] = [
          ...(acc?.[establishment?.location?.address] ?? []),
          establishment,
        ];
        return acc;
      }, {} as Record<string, Establishment[]>),
  }),
  {
    fetchFranchise: fetchFranchiseAction,
    fetchCompanyGroupList,
    fetchFilteredMembers: (params: {
      [key: string]: number | boolean | string;
    }) => fetchFilteredMembersAction({ ...params, exclude_archived: true }),
    fetchAssociatedEstablishments: fetchAssociatedEstablishmentsAction,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    navigateAsCompanyAdmin: navigateAsCompanyAdminAction,
    push: pushAction,
    createOrUpdateCompanyGroup,
  },
);

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  withTranslation(['franchise']),
  withTitle(({ t }: { t: TFunction }) => t('companies.pageTitle')),
  withStyles(styles, { withTheme: true }),
  connector,
)(FranchiseCompanyList);
