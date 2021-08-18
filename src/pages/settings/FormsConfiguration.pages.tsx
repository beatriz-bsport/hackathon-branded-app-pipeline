import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { TFunction } from 'i18next';
import withTitle from '../../hocs/with-title.hoc';
import {
  fetchSignFormUpConfiguration,
  updateSignUpFormConfiguration,
} from '../../libs/sign-up-form/actions';
import { RootState } from '../../reducers';
import { getSignUpFormConfiguration } from '../../libs/sign-up-form/selectors';
import themeSelectors from '../../libs/theme/selectors';
import SignUpConfigurationForm from '../../libs/sign-up-form/components/SignUpConfigurationForm.component';
import { MaterialStyleType } from '../../utils/types';
import type { SignUpFormConfig } from '../../libs/sign-up-form/types';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

type OwnProps = {
  isSubmitting: boolean;
  updateSignUpFormConfiguration: (
    id: number,
    data: SignUpFormConfig,
    options?: any,
  ) => void;
  initial: SignUpFormConfig;
};
type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export class FormsConfiguration extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchSignFormUpConfiguration();
  }

  render() {
    const { classes, loading } = this.props;
    return (
      <div className={classes.container}>
        {loading ? (
          <BackofficeLinearProgress />
        ) : (
          <Paper className={classes.paperContainer}>
            <SignUpConfigurationForm
              initial={this.props.signupFormConfig}
              onSubmit={this.props.updateSignUpFormConfiguration}
              isSubmitting={this.props.isSubmitting}
              theme={this.props.theme}
            />
          </Paper>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  paperContainer: {
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState) => ({
  loading: state.poll.signUpForm.loading || state.theme.loading,
  signupFormConfig: getSignUpFormConfiguration(state),
  theme: themeSelectors.getTheme(state),
});
const mapDispatchToProps = {
  fetchSignFormUpConfiguration,
  updateSignUpFormConfigurationAction: updateSignUpFormConfiguration,
};
export default compose(
  withStyles(styles),
  withTranslation(['theme']),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    updateSignUpFormConfiguration: ({
      updateSignUpFormConfigurationAction,
    }) => (configId: number, data: any, options: object) => {
      updateSignUpFormConfigurationAction(configId, data, options);
    },
  }),
  withTitle(({ t }: { t: TFunction }) => t('theme:signUpForm.title')),
)(FormsConfiguration);
