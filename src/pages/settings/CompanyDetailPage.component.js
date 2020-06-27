// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';

import { companies as companiesActions } from '../../actions';
import CompanyDetail from '../../components/companies/CompanyDetail.component';
import withTitle from '../../hocs/with-title.hoc';

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
    },
  ),
)(CompanyDetailPage);
