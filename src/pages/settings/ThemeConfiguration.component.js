// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';

import type { Theme } from '../../libs/theme/types';
import ThemeForm from '../../libs/theme/components/ThemeForm.component';
import {
  updateCompanyTheme,
  fetchCompanyTheme,
} from '../../libs/theme/actions';
import themeSelectors from '../../libs/theme/selectors';

type Props = {
  theme: Theme,
  loading: boolean,
  submitTheme: (companyId: number, data: *) => void,
  fetchCompanyTheme: () => void,
  classes: any,
};

export class ThemeConfiguration extends Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyTheme();
  }

  render() {
    const { classes } = this.props;
    if (this.props.loading) return <LinearProgress />;
    return (
      <div className={classes.container}>
        <Paper className={classes.paperContainer}>
          <ThemeForm
            theme={this.props.theme}
            onSubmit={this.props.submitTheme}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 2,
  },
  paperContainer: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
      loading: state.theme.loading,
    }),
    {
      fetchCompanyTheme,
      submitTheme: updateCompanyTheme,
    },
  ),
  withStyles(styles),
  withNamespaces(['theme']),
)(ThemeConfiguration);
