import React from 'react';
import { compose, withHandlers, withStateHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { replace as replaceRouter } from 'connected-react-router';
import { withRouter } from 'react-router';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import withTitle from '../../hocs/with-title.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';

import Config from '../../config';
import { buildUrlParams, parseQueryString } from '../../http';

import {
  updateCompanyTheme,
  fetchCompanyTheme,
} from '../../libs/theme/actions';
import {
  retrieveQuickbooksApp as retrieveQuickbooksAppAction,
  updateQuickbooksApp as updateQuickbooksAppAction,
  revokeQuickbooksApp as revokeQuickbooksAppAction,
  requestQuickBooksAccessToken as requestQuickBooksAccessTokenAction,
} from '../../libs/quickbooks/actions';
import themeSelectors from '../../libs/theme/selectors';
import { getQuickbooksApp } from '../../libs/quickbooks/selectors';
import { snackbarSuccess, snackbarError } from '../../libs/snackbar/actions';
import { showDeleteDialog } from '../../components/GenericDialog/CustomDialogs';
import QuickBooksConfigrationForm from '../../libs/quickbooks/components/QuickBooksConfigurationForm.component';
import { OptionCallback } from '../../state/types';

type StateHandlerInit = {};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {
  quickbooksCode: string;
  quickbooksRealmId: string;
};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
type State = {};
export class QuickBooks extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchCompanyTheme();
    this.props.retrieveQuickbooksApp(this.props.theme.company);
    if (this.props.quickbooksCode) {
      this.requestQuickboksConnect();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.quickbooksCode &&
      this.props.quickbooksRealmId &&
      !prevProps.quickbooksCode &&
      !prevProps.quickbooksRealmId
    ) {
      this.requestQuickboksConnect();
    }
  }

  requestQuickboksConnect = () => {
    this.props.requestQuickBooksAccessToken({
      onSuccess: () => this.onQuickbooksSuccess(),
      onError: () => this.onQuickbookserror(),
    });
  };

  connectQuickBooks = async () => {
    const res = await showDeleteDialog(
      this.props.t('quickbooks.confirmDialog.title'),
      this.props.t('quickbooks.confirmDialog.text'),
    );

    if (res) {
      window.location.href = `https://appcenter.intuit.com/app/connect/oauth2${buildUrlParams(
        {
          client_id: Config.REACT_APP_QUICKBOOKS_CLIENT_ID,
          scope: 'com.intuit.quickbooks.accounting',
          redirect_uri: window.location.href.includes('localhost')
            ? `https://bsport-hp.ngrok.io${window.location.pathname}`
            : window.location.origin + window.location.pathname,
          response_type: 'code',
          state: 'security_token',
        },
      )}`;
    }
  };

  onQuickbooksSuccess = () => {
    this.props.removeUrlCode();
    this.props.snackbarSuccess('quickbooks.create.success');
    this.props.retrieveQuickbooksApp(this.props.theme.company);
  };

  onQuickbookserror = () => {
    this.props.removeUrlCode();
    this.props.snackbarError('quickbooks.create.error');
    this.props.retrieveQuickbooksApp(this.props.theme.company);
  };

  revokeQuickBookApp = async () => {
    this.props.revokeQuickBookApp({
      onSuccess: () => this.revokeQuickbooksSuccess(),
      onError: () => this.revokeQuickbooksError(),
    });
  };

  revokeQuickbooksSuccess = () => {
    this.props.snackbarSuccess('quickbooks.revoke.success');
    this.props.retrieveQuickbooksApp(this.props.theme.company);
  };

  revokeQuickbooksError = () => {
    this.props.snackbarError('quickbooks.revoke.error');
  };

  onSubmitTheme = (is_quickbook_integration_enabled: string) => {
    const new_theme = new FormData();
    ['is_quickbook_integration_enabled'].map((key) =>
      new_theme.append(key, is_quickbook_integration_enabled),
    );
    this.props.submitTheme(this.props.theme.company, new_theme);
  };

  render() {
    const { classes } = this.props;
    if (this.props.loading) {
      <BackofficeLinearProgress />;
    }
    return (
      <div className={classes.container}>
        <QuickBooksConfigrationForm
          theme={this.props.theme}
          connectQuickbooks={this.connectQuickBooks}
          revokeQuickBooks={this.revokeQuickBookApp}
          processing={this.props.processing}
          quickbooksApp={this.props.quickbooksApp}
          onSubmitTheme={this.onSubmitTheme}
          loading={this.props.loading}
        />
      </div>
    );
  }
}
const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
  },
});
const mapStateToProps = (state: RootState) => ({
  theme: themeSelectors.getTheme(state),
  loading:
    state.theme.loading &&
    state.theme.createOrUpdate.loading &&
    state.quickbooks.loading,
  processing:
    state.theme.createOrUpdate.loading && state.quickbooks.update.loading,
  quickbooksApp: getQuickbooksApp(state),
});
const mapDispatchToProps = {
  fetchCompanyTheme,
  submitTheme: updateCompanyTheme,
  replace: replaceRouter,
  snackbarSuccess,
  snackbarError,
  retrieveQuickbooksApp: retrieveQuickbooksAppAction,
  updateQuickbooksApp: updateQuickbooksAppAction,
  revokeQuickbooksAppAction,
  requestQuickBooksAccessTokenAction,
};
const mapWithHandlers = {
  removeUrlCode: (props: OwnAndConnectedProps) => () => {
    props.replace(window.location.pathname);
  },
  revokeQuickBookApp:
    (props: OwnAndConnectedProps) => (options?: OptionCallback) => {
      props.revokeQuickbooksAppAction(props.theme.company, options);
    },
  requestQuickBooksAccessToken:
    (props: OwnAndConnectedProps) => (options?: OptionCallback) => {
      props.requestQuickBooksAccessTokenAction(
        {
          companyId: props.theme.company,
          code: props.quickbooksCode,
          realm_Id: props.quickbooksRealmId,
          redirect_uri: window.location.href,
        },
        options,
      );
    },
};
const withStateHandlersInit: StateHandlerInit = {};
const withStateHandlersSetter = {};
export default compose<any, OwnProps>(
  withRouter,
  withProps(({ location }) => ({
    quickbooksCode: parseQueryString(location.search).code,
    quickbooksRealmId: parseQueryString(location.search).realmId,
  })),
  withTranslation('theme'),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) => t('settings:quickbooks.title')),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(QuickBooks);
