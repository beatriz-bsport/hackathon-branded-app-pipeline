// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose, withHandlers } from 'recompose';
import { push } from 'connected-react-router';

import { companies as companiesActions } from '../../actions';
import { attachExternalAccount as attachExternalAccountAction } from '../../libs/company/actions';
import CompanyDetail from '../../components/companies/CompanyDetail.component';
import withTitle from '../../hocs/with-title.hoc';

import type { OptionCallback } from '../../state/types.ts';

type Props = {
  company: *,
  fetchCompany: () => void,
  classes: Object,
  attachExternalAccount: (data: any, options: OptionCallback) => void,
  updateCompanyDetail: () => void,
};
type State = {};

export class CompanyDetailPage extends Component<Props, State> {
  state = {};

  componentWillMount() {
    this.props.fetchCompany();
  }

  render() {
    const { company, classes } = this.props;
    return (
      <div className={classes.container}>
        {company ? (
          <CompanyDetail
            attachExternalAccount={this.props.attachExternalAccount}
            updateCompanyDetail={this.props.updateCompanyDetail}
            company={company}
          />
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing(3),
  },
});
export default compose(
  withStyles(styles),
  withTranslation(['settings']),
  withTitle(({ t }) => t('tab.company')),
  connect(
    (state) => ({
      company: state.companies.company,
    }),
    {
      fetchCompany: companiesActions.fetchCompanies,
      updateCompanyDetail: () => push('/settings/company_onboarding'),
      attachExternalAccount: attachExternalAccountAction,
    },
  ),
  withHandlers({
    attachExternalAccount: ({ attachExternalAccount, fetchCompany }) => (
      data,
      options,
    ) => {
      attachExternalAccount(data, {
        onSuccess: (...args) => {
          fetchCompany();
          if (options && options.onSuccess) options.onSuccess(...args);
        },
        onError: options && options.onError,
      });
    },
  }),
)(CompanyDetailPage);
