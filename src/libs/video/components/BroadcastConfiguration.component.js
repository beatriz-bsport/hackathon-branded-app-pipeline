// @flow

import React, { Component } from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { Theme } from '../../theme/types';

type Props = {
  theme: Theme,
  onSubmit: (id: number, data: *) => void,
  processing: boolean,
  t: TFunction,
  classes: Object,
};

type State = {
  theme: Theme,
};

export class BroadcastConfigurationForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      theme: props.theme,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.theme !== this.props.theme) {
      this.setState({ theme: this.props.theme });
    }
  }

  handleChange = (key: string) => (value: any) =>
    this.setState((prevState) => ({
      theme: { ...prevState.theme, [key]: value },
    }));

  checkChange = () => {
    return (
      this.state.theme.is_whereby_integration_enabled ===
      this.props.theme.is_whereby_integration_enabled
    );
  };

  onSubmit = () => {
    const data = new FormData();
    ['is_whereby_integration_enabled'].map((key) =>
      data.append(key, this.state.theme[key]),
    );
    this.props.onSubmit(this.props.theme.company, data);
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.is_whereby_integration_enabled}
            disabled={!this.props.theme.is_whereby_integration_allowed}
            value={this.state.theme.is_whereby_integration_enabled}
            onChange={(ev) => {
              this.handleChange('is_whereby_integration_enabled')(
                ev.target.checked,
              );
            }}
          />
          <Typography
            color={
              this.props.theme.is_whereby_integration_allowed
                ? 'inherit'
                : 'textSecondary'
            }
          >
            {t('broadcast.is_whereby_integration_enabled.label')}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          <Typography>{this.props.t('broadcast.explainEnabled')}</Typography>
        </div>
        <div className={classes.inputContainer}>
          <Typography>{this.props.t('broadcast.explainDisabled')}</Typography>
          <IconButton
            color="primary"
            onClick={() => {
              window.open(
                'https://intercom.help/bsport-helpcenter/fr/articles/3830979',
              );
            }}
          >
            <HelpIcon />
          </IconButton>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            onClick={() => this.onSubmit(this.state.theme)}
            disabled={this.checkChange() || this.props.processing}
            variant="contained"
            color="primary"
          >
            {t('broadcast.submit')}
          </Button>
          {this.props.processing ? (
            <CircularProgress className={classes.progress} />
          ) : null}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  horizontalInput: {
    marginRight: theme.spacing(3),
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  progress: {
    marginLeft: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['settings']),
)(BroadcastConfigurationForm);
