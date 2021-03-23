import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme as MaterialTheme } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import ImageUploader169 from '../../../components/input/ImageUploader169.component';
import ColorInput from '../../../components/input/ColorInput.component';
import type { Theme } from '../types';
import AnalyticsDialog from './AnalyticsDialog.component';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  theme: Theme;
  onSubmit: (id: number, data: any) => void;
  processing: boolean;
  openAnalyticsUsage: boolean;
  setOpenAnalyticsUsage: (open: boolean) => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  theme: Theme;
};

function CompanyCoverPreview(props: { previewURL?: string }) {
  if (!props.previewURL) {
    return (
      <div
        style={{
          backgroundColor: '#F2F2F2',
          borderRadius: 35,
          height: '100%',
          width: '100%',
        }}
      />
    );
  }
  return (
    <img
      alt="company logo"
      style={{ height: '100%', width: '100%', borderRadius: 35 }}
      src={props.previewURL}
    />
  );
}

export class ThemeForm extends Component<Props, State> {
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
      this.state.theme.primary_color === this.props.theme.primary_color &&
      this.state.theme.secondary_color === this.props.theme.secondary_color &&
      this.state.theme.cover === this.props.theme.cover &&
      this.state.theme.websiteURL === this.props.theme.websiteURL &&
      this.state.theme.scheduleURL === this.props.theme.scheduleURL &&
      this.state.theme.gtmId === this.props.theme.gtmId &&
      this.state.theme.android_app_url === this.props.theme.android_app_url &&
      this.state.theme.ios_app_url === this.props.theme.ios_app_url &&
      this.state.theme.instagramURL === this.props.theme.instagramURL &&
      this.state.theme.general_terms_and_conditions ===
        this.props.theme.general_terms_and_conditions &&
      this.state.theme.facebookURL === this.props.theme.facebookURL &&
      this.state.theme.general_terms_of_use ===
        this.props.theme.general_terms_of_use &&
      this.state.theme.facebookPixelId === this.props.theme.facebookPixelId &&
      this.state.theme.waiver === this.props.theme.waiver
    );
  };

  handleCoverChange = (cover?: File) => {
    if (cover && typeof cover !== 'string') {
      this.handleChange('cover')(cover);
    }
  };

  onSubmit = () => {
    const data = new FormData();
    [
      'primary_color',
      'secondary_color',
      'websiteURL',
      'scheduleURL',
      'facebookURL',
      'ios_app_url',
      'android_app_url',
      'gtmId',
      'facebookPixelId',
      'instagramURL',
      'general_terms_and_conditions',
      'general_terms_of_use',
      'waiver',
      // @ts-ignore
    ].map((key) => data.append(key, this.state.theme[key]));
    if (this.state.theme.cover && typeof this.state.theme.cover !== 'string') {
      data.append('cover', this.state.theme.cover);
    }

    this.props.onSubmit(this.props.theme.company, data);
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <Typography variant="h6" className={this.props.classes.idContainer}>
          {`BSPORT ID: ${this.props.theme ? this.props.theme.company : ' - '}`}
        </Typography>

        <div className={classes.inputContainer}>
          <ImageUploader169
            label={t('forms.cover.label')}
            helperText={t('forms.cover.helperText')}
            onChange={this.handleCoverChange}
            initial={this.state.theme.cover}
          >
            <CompanyCoverPreview />
          </ImageUploader169>
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.horizontalInput}>
            <ColorInput
              label={t('forms.primary_color.label')}
              helperText={t('forms.primary_color.helperText')}
              onChange={(color: any) =>
                this.handleChange('primary_color')(color)
              }
              color={this.state.theme.primary_color}
            />
          </div>
          <div className={classes.horizontalInput}>
            <ColorInput
              onChange={(color: any) =>
                this.handleChange('secondary_color')(color)
              }
              label={t('forms.secondary_color.label')}
              helperText={t('forms.secondary_color.helperText')}
              color={this.state.theme.secondary_color}
            />
          </div>
        </div>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.textfield}
            variant="outlined"
            placeholder={t('forms.websiteURL.placeholder')}
            helperText={t('forms.websiteURL.helperText')}
            label={t('forms.websiteURL.label')}
            value={this.state.theme.websiteURL}
            onChange={(ev) => this.handleChange('websiteURL')(ev.target.value)}
          />
        </div>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.textfield}
            variant="outlined"
            placeholder={t('forms.scheduleURL.placeholder')}
            helperText={t('forms.scheduleURL.helperText')}
            label={t('forms.scheduleURL.label')}
            value={this.state.theme.scheduleURL}
            onChange={(ev) => this.handleChange('scheduleURL')(ev.target.value)}
          />
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.horizontalInput}>
            <TextField
              variant="outlined"
              className={classes.textfield}
              placeholder={t('forms.android_app_url.placeholder')}
              helperText={t('forms.android_app_url.helperText')}
              label={t('forms.android_app_url.label')}
              value={this.state.theme.android_app_url}
              onChange={(ev) =>
                this.handleChange('android_app_url')(ev.target.value)
              }
            />
          </div>
          <div className={classes.horizontalInput}>
            <TextField
              className={classes.textfield}
              variant="outlined"
              placeholder={t('forms.ios_app_url.placeholder')}
              helperText={t('forms.ios_app_url.helperText')}
              label={t('forms.ios_app_url.label')}
              value={this.state.theme.ios_app_url}
              onChange={(ev) =>
                this.handleChange('ios_app_url')(ev.target.value)
              }
            />
          </div>
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.horizontalInput}>
            <TextField
              className={classes.textfield}
              variant="outlined"
              placeholder={t('forms.instagramURL.placeholder')}
              helperText={t('forms.instagramURL.helperText')}
              label={t('forms.instagramURL.label')}
              value={this.state.theme.instagramURL}
              onChange={(ev) =>
                this.handleChange('instagramURL')(ev.target.value)
              }
            />
          </div>
          <div className={classes.horizontalInput}>
            <TextField
              className={classes.textfield}
              variant="outlined"
              placeholder={t('forms.facebookURL.placeholder')}
              helperText={t('forms.facebookURL.helperText')}
              label={t('forms.facebookURL.label')}
              value={this.state.theme.facebookURL}
              onChange={(ev) =>
                this.handleChange('facebookURL')(ev.target.value)
              }
            />
          </div>
        </div>
        <div className={classes.textField}>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={5}
            placeholder={t('forms.general_terms_and_conditions.placeholder')}
            helperText={t('forms.general_terms_and_conditions.helperText')}
            label={t('forms.general_terms_and_conditions.label')}
            value={this.state.theme.general_terms_and_conditions}
            onChange={(ev) =>
              this.handleChange('general_terms_and_conditions')(ev.target.value)
            }
          />
        </div>
        <div className={classes.textField}>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={5}
            placeholder={t('forms.general_terms_of_use.placeholder')}
            helperText={t('forms.general_terms_of_use.helperText')}
            label={t('forms.general_terms_of_use.label')}
            value={this.state.theme.general_terms_of_use}
            onChange={(ev) =>
              this.handleChange('general_terms_of_use')(ev.target.value)
            }
          />
        </div>
        <div className={classes.textField}>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={5}
            placeholder={t('forms.waiver.placeholder')}
            helperText={t('forms.waiver.helperText')}
            label={t('forms.waiver.label')}
            value={this.state.theme.waiver}
            onChange={(ev) => this.handleChange('waiver')(ev.target.value)}
          />
        </div>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.textfield}
            variant="outlined"
            placeholder={t('forms.gtmId.placeholder')}
            label={t('forms.gtmId.label')}
            value={this.state.theme.gtmId}
            onChange={(ev) => this.handleChange('gtmId')(ev.target.value)}
          />
        </div>

        <div className={classes.inputContainer}>
          <TextField
            className={classes.textfield}
            variant="outlined"
            placeholder={t('forms.facebookPixelId.placeholder')}
            label={t('forms.facebookPixelId.label')}
            value={this.state.theme.facebookPixelId}
            onChange={(ev) =>
              this.handleChange('facebookPixelId')(ev.target.value)
            }
          />
        </div>

        <div className={classes.buttonContainer}>
          <Button
            onClick={() => this.props.setOpenAnalyticsUsage(true)}
            color="primary"
          >
            {t('analytics.showAnalyticsInformation')}
          </Button>
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

        <AnalyticsDialog
          open={this.props.openAnalyticsUsage}
          onCancel={() => this.props.setOpenAnalyticsUsage(false)}
        />
      </div>
    );
  }
}

const styles = (theme: MaterialTheme) => ({
  textfield: {
    minWidth: 480,
  },
  horizontalInput: {
    marginRight: theme.spacing(3),
  },
  idContainer: {
    marginBottom: theme.spacing(3),
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(3),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  progress: {
    marginLeft: theme.spacing(1),
  },
  textField: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(3),
    width: '90%',
    maxWidth: 400,
  },
});

export default compose(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['theme']),
  withState('openAnalyticsUsage', 'setOpenAnalyticsUsage', false),
)(ThemeForm);
