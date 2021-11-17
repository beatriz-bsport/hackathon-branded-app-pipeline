// @flow

import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose, withHandlers } from 'recompose';
import { push } from 'connected-react-router';

import {
  attachExternalAccount as attachExternalAccountAction,
  retrieveMyCompanySetup as retrieveMyCompanySetupAction,
} from '../../libs/company/actions';
import { CompanySetup } from '../../libs/company/types';
import CompanyDetail from '../../components/companies/CompanyDetail.component';
import withTitle from '../../hocs/with-title.hoc';
import { RootState } from '../../reducers';

import type { OptionCallback } from '../../state/types';

type OwnProps = {
  companySetup: CompanySetup | null;
  retrieveMyCompanySetup: () => void;
  attachExternalAccount: (data: any, options: OptionCallback) => void;
  updateCompanyDetail: () => void;
};

type Props = OwnProps & WithStyles & ConnectedProps<typeof connector>;

export class CompanyDetailPage extends Component<Props> {
  componentWillMount() {
    this.props.retrieveMyCompanySetup();
  }

  render() {
    const { companySetup, classes } = this.props;
    return (
      <div className={classes.container}>
        {companySetup ? (
          <CompanyDetail
            attachExternalAccount={this.props.attachExternalAccount}
            updateCompanyDetail={this.props.updateCompanyDetail}
            company={companySetup}
            currency={companySetup.currency}
          />
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    margin: theme.spacing(3),
  },
});

const connector = connect(
  (state: RootState) => ({
    companySetup: state.company.setup,
  }),
  {
    retrieveMyCompanySetup: retrieveMyCompanySetupAction,
    updateCompanyDetail: () => push('/settings/company_onboarding'),
    attachExternalAccount: attachExternalAccountAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['settings']),
  withTitle(({ t }) => t('tab.company')),
  connector,
  withHandlers({
    attachExternalAccount: ({
      attachExternalAccount,
      retrieveMyCompanySetup,
    }) => (data, options) => {
      attachExternalAccount(data, {
        onSuccess: () => {
          retrieveMyCompanySetup({
            onError: options && options.onError,
            onSuccess: (setup: CompanySetup) => {
              if (options && options.onSuccess) options.onSuccess(setup);
            },
          });
        },
        onError: options && options.onError,
      });
    },
  }),
)(CompanyDetailPage);
