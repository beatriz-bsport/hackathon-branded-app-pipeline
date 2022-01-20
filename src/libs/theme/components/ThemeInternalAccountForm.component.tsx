// @flow

import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, WithTranslation } from 'react-i18next';

import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import RedButton from '#components/button/RedButton.component';

import { MaterialStyleType } from '../../../utils/types';
import type { CompanyTheme } from '../types';

type Props = {
  theme: CompanyTheme;
  onSubmit: (id: number, data: any) => void;
  processing: boolean;
} & MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  theme: CompanyTheme;
  openWarning: boolean;
};

export class ThemeInternalAccountForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      theme: props.theme,
      openWarning: false,
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.theme !== this.props.theme) {
      this.setState({ theme: this.props.theme });
    }

    if (
      !prevState.theme.allow_consumer_to_use_internal_account &&
      this.state.theme.allow_consumer_to_use_internal_account &&
      !this.state.openWarning
    ) {
      this.setState({ openWarning: true });
    }
  }

  handleChange = (key: string) => (value: any) =>
    this.setState((prevState) => ({
      theme: { ...prevState.theme, [key]: value },
    }));

  checkChange = () => {
    return (
      this.state.theme.consumer_regularize_debt ===
        this.props.theme.consumer_regularize_debt &&
      this.state.theme.allow_consumer_to_use_internal_account ===
        this.props.theme.allow_consumer_to_use_internal_account
    );
  };

  onSubmit = () => {
    const data = new FormData();
    ['consumer_regularize_debt', 'allow_consumer_to_use_internal_account'].map(
      (key) => data.append(key, this.state.theme[key]),
    );
    this.props.onSubmit(this.props.theme.company, data);
  };

  render() {
    const { t, classes } = this.props;
    if (!this.state.theme) {
      return null;
    }
    return (
      <>
        <Paper className={classes.paper}>
          <div className={classes.header}>
            <Typography variant="h6" component="h3">
              {t('forms.themePersonalization.internalAccount')}
            </Typography>
          </div>
          <div className={classes.inputContainer}>
            <Switch
              checked={this.state.theme.consumer_regularize_debt}
              onChange={() =>
                this.handleChange('consumer_regularize_debt')(
                  !this.state.theme.consumer_regularize_debt,
                )
              }
            />
            <Typography>
              {t('forms.themePersonalization.consumerRegularizeDebt')}
            </Typography>
          </div>
          <div className={classes.inputContainer}>
            <Switch
              checked={this.state.theme.allow_consumer_to_use_internal_account}
              onChange={() =>
                this.handleChange('allow_consumer_to_use_internal_account')(
                  !this.state.theme.allow_consumer_to_use_internal_account,
                )
              }
            />
            <div>
              <Typography>
                {t(
                  'forms.themePersonalization.allowConsumerToUseInternalAccount',
                )}
              </Typography>
              <Typography variant="caption">
                {t(
                  'forms.themePersonalization.internalAccountNotusableOnContract',
                )}
              </Typography>
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              onClick={() => this.onSubmit()}
              disabled={this.checkChange() || this.props.processing}
              variant="contained"
              color="primary"
            >
              {t('forms.submit')}
            </Button>
            {this.props.processing ? (
              <CircularProgress className={classes.progress} />
            ) : null}
          </div>
        </Paper>
        <Dialog
          open={this.state.openWarning}
          onClose={() => {
            this.handleChange('allow_consumer_to_use_internal_account')(false);
            this.setState({ openWarning: false });
          }}
        >
          <DialogContent>
            <div>
              <div className={classes.warningTitle}>
                <WarningIcon className={classes.changeWarningIcon} />
                <Typography variant="h5">
                  {t('forms.themePersonalization.internalAccountWarningTitle')}
                </Typography>
              </div>
              <div className={classes.warningContainer}>
                <Typography color="initial">
                  {t('forms.themePersonalization.internalAccountWarning1')}
                </Typography>
                <Typography style={{ paddingTop: '10px' }}>
                  {t('forms.themePersonalization.internalAccountWarning2')}
                </Typography>
                <div className={classes.goToReportRow}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => this.props.goToReports()}
                  >
                    <DoubleArrowIcon className={classes.leftIcon} />
                    {t('forms.themePersonalization.goToReports')}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(ev) => {
                ev.stopPropagation();
                this.handleChange('allow_consumer_to_use_internal_account')(
                  false,
                );
                this.setState({ openWarning: false });
              }}
            >
              {t('common:cancel')}
            </Button>
            <RedButton
              onClick={(
                ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ) => {
                ev.stopPropagation();
                this.handleChange('allow_consumer_to_use_internal_account')(
                  true,
                );
                this.setState({ openWarning: false });
              }}
              color="primary"
              delayBeforeActivation={5}
            >
              {t('common:confirm')}
            </RedButton>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

const styles = (theme: Theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(3),
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    marginLeft: theme.spacing(1),
  },
  warningTitle: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(2),
    color: 'black',
  },
  warningContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${red[600]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    flexDirection: 'column',
    color: 'black',
  },
  changeWarningIcon: {
    color: red[600],
    marginRight: theme.spacing(2),
  },
  goToReportRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['theme', 'common']),
)(ThemeInternalAccountForm);
