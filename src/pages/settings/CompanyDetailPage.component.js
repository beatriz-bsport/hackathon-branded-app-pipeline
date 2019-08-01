// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';

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

const styles = (theme) => ({
  container: {
    margin: theme.spacing.unit * 3,
  },
});
export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      company: state.companies.company,
    }),
    {
      fetchCompany: companiesActions.fetchCompanies,
    },
  ),
)(CompanyDetailPage);
