import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme as MaterialTheme, Typography, Dialog } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';

import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
// @ts-expect-error
import tinycolor from 'tinycolor2';
import clsx from 'clsx';
import RedButton from '#src/components/button/RedButton.component';
// @ts-expect-error
import ImageUploader169 from '../../../components/input/ImageUploader169.component';
import ColorInput from '../../../components/input/ColorInput.component';
import AnalyticsInfoModal from './AnalyticsInfoModal.component';
import type { Theme } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { MAX_COLOR_BRIGHTNESS } from '../utils';
import { VALIDATION_DELAY } from '#src/libs/constants';

type OwnProps = {
  theme: Theme;
  onSubmit: (id: number, data: any) => void;
  processing: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  theme: Theme;
  isWarningDialogOpen: boolean;
  isAnalyticsInfoModalOpen: boolean;
};

const regexHTTP = /https?:\/\//;

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
      src={props.previewURL}
      style={{ height: '100%', width: '100%', borderRadius: 35 }}
    />
  );
}

export class ThemeForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      theme: props.theme,
      isWarningDialogOpen: false,
      isAnalyticsInfoModalOpen: false,
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
      this.state.theme.extra_info === this.props.theme.extra_info &&
      this.state.theme.waiver === this.props.theme.waiver
    );
  };

  handleCoverChange = (cover?: File) => {
    if (cover && typeof cover !== 'string') {
      this.handleChange('cover')(cover);
    }
  };

  onSubmit = (ignoreColorWarning?: boolean) => {
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
      'extra_info',
      'instagramURL',
      'general_terms_and_conditions',
      'general_terms_of_use',
      'waiver',
      // @ts-expect-error
    ].map((key) => data.append(key, this.state.theme[key]));

    if (this.state.theme.cover && typeof this.state.theme.cover !== 'string') {
      data.append('cover', this.state.theme.cover);
    }

    const brightnessPrimaryColor = tinycolor(
      this.state.theme.primary_color,
    ).getBrightness();

    const brightnessSecondaryColor = tinycolor(
      this.state.theme.secondary_color,
    ).getBrightness();

    if (
      (brightnessPrimaryColor > MAX_COLOR_BRIGHTNESS ||
        brightnessSecondaryColor > MAX_COLOR_BRIGHTNESS) &&
      !ignoreColorWarning
    ) {
      this.openWarningDialog();
    } else {
      this.props.onSubmit(this.props.theme.company, data);
    }
  };

  openWarningDialog = () => {
    this.setState({ isWarningDialogOpen: true });
  };

  closeWarningDialog = () => {
    this.setState({ isWarningDialogOpen: false });
  };

  openAnalyticsInfoModal = () => {
    this.setState({ isAnalyticsInfoModalOpen: true });
  };

  closeAnalyticsInfoModal = () => {
    this.setState({ isAnalyticsInfoModalOpen: false });
  };

  confirmColorDialog = () => {
    this.onSubmit(true);
    this.closeWarningDialog();
  };

  render() {
    const { t, classes } = this.props;
    const hasErrorInURL = !(
      this.state.theme.websiteURL === '' ||
      regexHTTP.test(this.state.theme.websiteURL)
    );
    return (
      <div>
        <Dialog open={this.state.isWarningDialogOpen}>
          <DialogTitle>
            {/* @ts-expect-error */}
            <Typography className={classes.bold} variant="h6">
              {t('forms.warningColorBrightness.title')}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {t('forms.warningColorBrightness.text')}
          </DialogContent>
          <DialogActions>
            <Button className={classes.grey} onClick={this.closeWarningDialog}>
              {t('forms.warningColorBrightness.cancel')}
            </Button>
            <RedButton
              color="primary"
              delayBeforeActivation={VALIDATION_DELAY}
              onClick={this.confirmColorDialog}
              variant="contained"
            >
              {t('forms.warningColorBrightness.save')}
            </RedButton>
          </DialogActions>
        </Dialog>
        <Typography className={this.props.classes.idContainer} variant="h6">
          {`BSPORT ID: ${this.props.theme ? this.props.theme.company : ' - '}`}
        </Typography>
        <div className={classes.inputContainer}>
          <ImageUploader169
            helperText={t('forms.cover.helperText')}
            initial={this.state.theme.cover}
            label={t('forms.cover.label')}
            onChange={this.handleCoverChange}
          >
            <CompanyCoverPreview />
          </ImageUploader169>
        </div>
        <div className={classes.inputContainer}>
          <div className={clsx(classes.horizontalInput, classes.alignItems)}>
            <ColorInput
              color={this.state.theme?.primary_color}
              helperText={t('forms.primary_color.helperText')}
              label={t('forms.primary_color.label')}
              onChange={(color: any) =>
                this.handleChange('primary_color')(color)
              }
            />
            <Button
              className={classes.exampleButton}
              style={{
                color: this.state.theme.primary_color,
                borderColor: this.state.theme.primary_color,
              }}
              variant="outlined"
            >
              {t('forms.warningColorBrightness.example')}
            </Button>
          </div>
          <div className={clsx(classes.horizontalInput, classes.alignItems)}>
            <ColorInput
              color={this.state.theme?.secondary_color}
              helperText={t('forms.secondary_color.helperText')}
              label={t('forms.secondary_color.label')}
              onChange={(color: any) =>
                this.handleChange('secondary_color')(color)
              }
            />
            <Button
              className={classes.exampleButton}
              style={{
                color: this.state.theme.secondary_color,
                borderColor: this.state.theme.secondary_color,
              }}
              variant="outlined"
            >
              {t('forms.warningColorBrightness.example')}
            </Button>
          </div>
        </div>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.textfield}
            error={hasErrorInURL}
            helperText={
              hasErrorInURL
                ? t('forms.websiteURL.errorText')
                : t('forms.websiteURL.helperText')
            }
            label={t('forms.websiteURL.label')}
            onChange={(ev) => this.handleChange('websiteURL')(ev.target.value)}
            placeholder={t('forms.websiteURL.placeholder')}
            value={this.state.theme.websiteURL}
            variant="outlined"
          />
        </div>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.textfield}
            helperText={t('forms.scheduleURL.helperText')}
            label={t('forms.scheduleURL.label')}
            onChange={(ev) => this.handleChange('scheduleURL')(ev.target.value)}
            placeholder={t('forms.scheduleURL.placeholder')}
            value={this.state.theme.scheduleURL}
            variant="outlined"
          />
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.horizontalInput}>
            <TextField
              className={classes.textfield}
              helperText={t('forms.android_app_url.helperText')}
              label={t('forms.android_app_url.label')}
              onChange={(ev) =>
                this.handleChange('android_app_url')(ev.target.value)
              }
              placeholder={t('forms.android_app_url.placeholder')}
              value={this.state.theme.android_app_url}
              variant="outlined"
            />
          </div>
          <div className={classes.horizontalInput}>
            <TextField
              className={classes.textfield}
              helperText={t('forms.ios_app_url.helperText')}
              label={t('forms.ios_app_url.label')}
              onChange={(ev) =>
                this.handleChange('ios_app_url')(ev.target.value)
              }
              placeholder={t('forms.ios_app_url.placeholder')}
              value={this.state.theme.ios_app_url}
              variant="outlined"
            />
          </div>
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.horizontalInput}>
            <TextField
              className={classes.textfield}
              helperText={t('forms.instagramURL.helperText')}
              label={t('forms.instagramURL.label')}
              onChange={(ev) =>
                this.handleChange('instagramURL')(ev.target.value)
              }
              placeholder={t('forms.instagramURL.placeholder')}
              value={this.state.theme.instagramURL}
              variant="outlined"
            />
          </div>
          <div className={classes.horizontalInput}>
            <TextField
              className={classes.textfield}
              helperText={t('forms.facebookURL.helperText')}
              label={t('forms.facebookURL.label')}
              onChange={(ev) =>
                this.handleChange('facebookURL')(ev.target.value)
              }
              placeholder={t('forms.facebookURL.placeholder')}
              value={this.state.theme.facebookURL}
              variant="outlined"
            />
          </div>
        </div>
        <div className={classes.textField}>
          <TextField
            fullWidth
            multiline
            helperText={t('forms.general_terms_and_conditions.helperText')}
            label={t('forms.general_terms_and_conditions.label')}
            onChange={(ev) =>
              this.handleChange('general_terms_and_conditions')(ev.target.value)
            }
            placeholder={t('forms.general_terms_and_conditions.placeholder')}
            rows={5}
            value={this.state.theme.general_terms_and_conditions}
            variant="outlined"
          />
        </div>
        <div className={classes.textField}>
          <TextField
            fullWidth
            multiline
            helperText={t('forms.general_terms_of_use.helperText')}
            label={t('forms.general_terms_of_use.label')}
            onChange={(ev) =>
              this.handleChange('general_terms_of_use')(ev.target.value)
            }
            placeholder={t('forms.general_terms_of_use.placeholder')}
            rows={5}
            value={this.state.theme.general_terms_of_use}
            variant="outlined"
          />
        </div>
        <div className={classes.textField}>
          <TextField
            fullWidth
            multiline
            helperText={t('forms.waiver.helperText')}
            label={t('forms.waiver.label')}
            onChange={(ev) => this.handleChange('waiver')(ev.target.value)}
            placeholder={t('forms.waiver.placeholder')}
            rows={5}
            value={this.state.theme.waiver}
            variant="outlined"
          />
        </div>
        <div className={classes.textField}>
          <TextField
            fullWidth
            multiline
            label={t('forms.extra_info.label')}
            onChange={(ev) => this.handleChange('extra_info')(ev.target.value)}
            rows={5}
            value={this.state.theme.extra_info}
            variant="outlined"
          />
        </div>

        <div className={classes.inputContainer}>
          <TextField
            className={classes.textfield}
            label={t('forms.gtmId.label')}
            onChange={(ev) => this.handleChange('gtmId')(ev.target.value)}
            placeholder={t('forms.gtmId.placeholder')}
            value={this.state.theme.gtmId}
            variant="outlined"
          />
        </div>

        <div className={classes.inputContainer}>
          <TextField
            className={classes.textfield}
            label={t('forms.facebookPixelId.label')}
            onChange={(ev) =>
              this.handleChange('facebookPixelId')(ev.target.value)
            }
            placeholder={t('forms.facebookPixelId.placeholder')}
            value={this.state.theme.facebookPixelId}
            variant="outlined"
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button color="primary" onClick={this.openAnalyticsInfoModal}>
            {t('analytics.openAnalyticsModalButton')}
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            color="primary"
            disabled={
              this.checkChange() || this.props.processing || hasErrorInURL
            }
            onClick={() => this.onSubmit()}
            variant="contained"
          >
            {t('forms.submit')}
          </Button>
          {hasErrorInURL && (
            <Typography
              className={classes.messageErrorURL}
              color="error"
              variant="caption"
            >
              {t('forms.themePersonalization.errorURL')}
            </Typography>
          )}
          {this.props.processing ? (
            <CircularProgress className={classes.progress} />
          ) : null}
        </div>
        <AnalyticsInfoModal
          isOpen={this.state.isAnalyticsInfoModalOpen}
          onClose={this.closeAnalyticsInfoModal}
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
  alignItems: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  messageErrorURL: {
    marginLeft: theme.spacing(1),
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
  exampleButton: {
    height: 'fit-content',
    marginLeft: theme.spacing(2),
  },
  grey: {
    color: theme.palette.text.secondary,
  },
});

export default compose(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['theme']),
)(ThemeForm);
