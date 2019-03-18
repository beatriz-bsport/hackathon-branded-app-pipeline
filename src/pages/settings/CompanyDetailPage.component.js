// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, CircularProgress } from '@material-ui/core';

import { companies as companiesActions } from '../../actions';
import CompanyDetail from '../../components/companies/CompanyDetail.component';

type Props = {
  company: *,
  fetchCompany: () => void,
  classes: Object,
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

const styles = (theme) => ({
  container: {
    margin: theme.spacing.unit * 3,
  },
});
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CompanyDetailPage),
);
