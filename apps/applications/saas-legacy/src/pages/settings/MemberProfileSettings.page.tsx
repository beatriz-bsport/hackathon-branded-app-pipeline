import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import {
  Theme,
  withStyles,
  WithStyles,
  createStyles,
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import themeSelectors from '#src/libs/theme/selectors';
import {
  updateCompanyTheme as updateCompanyThemeAction,
  fetchCompanyTheme as fetchCompanyThemeAction,
} from '#src/libs/theme/actions';
import type { RootState } from '#src/reducers';
import MemberProfileSettingsForm from '#src/libs/theme/components/MemberProfileSettingsForm';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

type Props = ConnectedProps<typeof connector> & WithStyles<typeof styles>;

const MemberProfileSettings: React.FC<Props> = React.memo(
  ({
    fetchCompanyTheme,
    classes,
    companyTheme,
    companyThemeLoading,
    companyThemeProcessing,
    submitTheme,
  }) => {
    useEffect(() => {
      fetchCompanyTheme();
    }, [fetchCompanyTheme]);

    if (companyThemeLoading) {
      return <LinearProgress />;
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <MemberProfileSettingsForm
            companyTheme={companyTheme}
            companyThemeProcessing={companyThemeProcessing}
            onSubmit={submitTheme}
          />
        </Paper>
      </div>
    );
  },
);

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
    },
    paper: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: theme.spacing(0.5),
    },
  });

const mapStateToProps = (state: RootState) => ({
  companyTheme: themeSelectors.getTheme(state),
  companyThemeLoading: state.theme.loading,
  companyThemeProcessing: state.theme.createOrUpdate.loading,
  companyId: state.theme.theme.company,
});

const mapDispatchToProps = {
  fetchCompanyTheme: fetchCompanyThemeAction,
  submitTheme: updateCompanyThemeAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<{}, Props>(
  connector,
  withStyles(styles),
)(MemberProfileSettings);
