// @flow

import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Switch from '@material-ui/core/Switch';
import Config from '../../../config';

import type { Theme } from '../types';

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

export class ThemePersonalize extends Component<Props, State> {
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
      this.state.theme.show_offers_filling ===
        this.props.theme.show_offers_filling &&
      this.state.theme.last_name_label === this.props.theme.last_name_label &&
      this.state.theme.first_name_label === this.props.theme.first_name_label
    );
  };

  handleCoverChange = (cover: ?File) => {
    if (cover && typeof cover !== 'string') {
      this.handleChange('cover')(cover);
    }
  };

  onSubmit = () => {
    const data = new FormData();
    ['show_offers_filling', 'first_name_label', 'last_name_label'].map((key) =>
      data.append(key, this.state.theme[key]),
    );
    if (this.state.theme.cover && typeof this.state.theme.cover !== 'string') {
      data.append('cover', this.state.theme.cover);
    }
    this.props.onSubmit(this.props.theme.company, data);
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <Typography className={classes.namesHeader}>
          {t('forms.themePersonalization.names_label_info')}
        </Typography>
        <div className={classes.inputContainer}>
          <div className={classes.horizontalInput}>
            <TextField
              variant="outlined"
              placeholder={t(
                'forms.themePersonalization.first_name_label.placeholder',
              )}
              helperText={t(
                'forms.themePersonalization.first_name_label.helperText',
              )}
              label={t('forms.themePersonalization.first_name_label.label')}
              value={this.state.theme.first_name_label}
              onChange={(ev) =>
                this.handleChange('first_name_label')(ev.target.value)
              }
            />
          </div>
          <div className={classes.horizontalInput}>
            <TextField
              variant="outlined"
              placeholder={t(
                'forms.themePersonalization.last_name_label.placeholder',
              )}
              helperText={t(
                'forms.themePersonalization.last_name_label.helperText',
              )}
              label={t('forms.themePersonalization.last_name_label.label')}
              value={this.state.theme.last_name_label}
              onChange={(ev) =>
                this.handleChange('last_name_label')(ev.target.value)
              }
            />
          </div>
        </div>
        {Config.NODE_ENV === 'staging' || Config.NODE_ENV === 'development' ? (
          <div>
            <Typography className={classes.namesHeader}>
              {t('forms.themePersonalization.calendar.title')}
            </Typography>
            <div className={classes.inputContainer}>
              <div className={classes.horizontalInput}>
                <TextField
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder={t(
                    'forms.themePersonalization.calendar.columns.placeholder',
                  )}
                  helperText={t(
                    'forms.themePersonalization.calendar.columns.helperText',
                  )}
                  label={t('forms.themePersonalization.calendar.columns.label')}
                />
              </div>
              <div className={classes.horizontalInput}>
                <TextField
                  rows={3}
                  multiline
                  variant="outlined"
                  placeholder={t(
                    'forms.themePersonalization.calendar.offerCard.placeholder',
                  )}
                  helperText={t(
                    'forms.themePersonalization.calendar.offerCard.helperText',
                  )}
                  label={t(
                    'forms.themePersonalization.calendar.offerCard.label',
                  )}
                />
              </div>
            </div>
            <div className={classes.inputContainer}>
              <div className={classes.horizontalInput}>
                <TextField
                  rows={3}
                  multiline
                  variant="outlined"
                  placeholder={t(
                    'forms.themePersonalization.calendar.bookButton.placeholder',
                  )}
                  helperText={t(
                    'forms.themePersonalization.calendar.bookButton.helperText',
                  )}
                  label={t(
                    'forms.themePersonalization.calendar.bookButton.label',
                  )}
                />
              </div>
              <div className={classes.horizontalInput}>
                <TextField
                  rows={3}
                  multiline
                  variant="outlined"
                  placeholder={t(
                    'forms.themePersonalization.calendar.police.placeholder',
                  )}
                  helperText={t(
                    'forms.themePersonalization.calendar.police.helperText',
                  )}
                  label={t('forms.themePersonalization.calendar.police.label')}
                />
              </div>
            </div>
          </div>
        ) : null}
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.show_offers_filling}
            onChange={() =>
              this.handleChange('show_offers_filling')(
                !this.state.theme.show_offers_filling,
              )
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <Typography>
            {t('forms.themePersonalization.offersFilling')}
          </Typography>
        </div>

        <div className={classes.buttonContainer}>
          <Button
            onClick={() => this.onSubmit(this.state.theme)}
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
      </div>
    );
  }
}

const styles = (theme) => ({
  namesHeader: { marginBottom: theme.spacing.unit * 2 },
  horizontalInput: {
    marginRight: theme.spacing.unit * 3,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing.unit * 3,
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    marginLeft: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['theme']),
)(ThemePersonalize);
