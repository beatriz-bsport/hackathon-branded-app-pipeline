// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';

import type { CompanyTheme } from '../../libs/theme/types';
import ThemePersonalizeForm from '../../libs/theme/components/ThemePersonalizeForm.component';
import CommunicationPersonalizeForm from '#libs/communication-v2/components/CommunicationPersonalizeForm.component';
import {
  updateCompanyTheme as updateCompanyThemeAction,
  fetchCompanyTheme as fetchCompanyThemeAction,
} from '../../libs/theme/actions';
import {
  fetchCommunicationProviderSettings as fetchCommunicationProviderSettingsAction,
  updateCommunicationProviderSettings as updateCommunicationProviderSettingsAction,
} from '#libs/communication-v2/actions';
import { CommunicationProviderSettings } from '#libs/communication-v2/types';
import themeSelectors from '../../libs/theme/selectors';
import withTitle from '../../hocs/with-title.hoc';
import { getIsTwoWayEmailActivated } from '#libs/communication-v2/selectors';
import Config from '../../config';

type Props = {
  theme: CompanyTheme,
  themeLoading: boolean,
  themeProcessing: boolean,
  submitTheme: (companyId: number, data: *) => void,
  fetchCompanyTheme: () => void,
  classes: any,
  isTwoWayEmailActivated: boolean,
  fetchCommunicationProviderSettings: (kind: string) => void,
  updateCommunicationProviderSettings: (
    kind: string,
    data: CommunicationProviderSettings,
  ) => void,
  communicationProviderSettingsLoading: boolean,
  companyId: number,
};

export class ThemePersonalize extends Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyTheme();
    this.props.fetchCommunicationProviderSettings('email');
  }

  render() {
    const {
      classes,
      theme,
      submitTheme,
      themeProcessing,
      updateCommunicationProviderSettings,
      fetchCompanyTheme,
      isTwoWayEmailActivated,
      communicationProviderSettingsLoading,
      companyId,
    } = this.props;

    const isCommunicationPersonalizeFormDisplayed =
      Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' || companyId === 498;

    return (
      <>
        {this.props.themeLoading && <LinearProgress />}
        <div className={classes.container}>
          <Paper className={classes.paper}>
            <ThemePersonalizeForm
              theme={theme}
              onSubmit={submitTheme}
              processing={themeProcessing}
            />
          </Paper>
          {isCommunicationPersonalizeFormDisplayed &&
            !communicationProviderSettingsLoading && (
              <Paper className={classes.paper}>
                <CommunicationPersonalizeForm
                  updateCommunicationProviderSettingsAction={
                    updateCommunicationProviderSettings
                  }
                  fetchCompanyTheme={fetchCompanyTheme}
                  is_two_way_email_activated={isTwoWayEmailActivated}
                  companyId={theme.company}
                />
              </Paper>
            )}
        </div>
      </>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: '20vh',
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 12,
  },
});

export default compose(
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
      themeLoading: state.theme.loading,
      themeProcessing: state.theme.createOrUpdate.loading,
      companyId: state.theme.theme.company,
      isTwoWayEmailActivated: getIsTwoWayEmailActivated(state),
      communicationProviderSettingsLoading:
        state.communicationV2.company_communication_provider.email.loading,
    }),
    {
      fetchCompanyTheme: fetchCompanyThemeAction,
      submitTheme: updateCompanyThemeAction,
      fetchCommunicationProviderSettings:
        fetchCommunicationProviderSettingsAction,
      updateCommunicationProviderSettings:
        updateCommunicationProviderSettingsAction,
    },
  ),
  withStyles(styles),
  withTranslation(['theme']),
  withTitle(({ t }) => t('pageTitles.personalization')),
)(ThemePersonalize);
