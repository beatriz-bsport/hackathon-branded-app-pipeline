// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import { companies as companiesActions } from '../actions';
import CompanyDetail from '../components/companies/CompanyDetail.component';

type Props = {
  company: *,
  fetchCompany: () => void,
};
type State = {};

export class CompanyDetailPage extends Component<Props, State> {
  state = {};

  componentWillMount() {
    this.props.fetchCompany();
  }

  render() {
    const { company } = this.props;
    return (
      <div className="company-detail-page">
        {company ? <CompanyDetail company={company} /> : <CircularProgress />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.companies.company,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchCompany() {
      dispatch(companiesActions.fetchCompanies());
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompanyDetailPage);
