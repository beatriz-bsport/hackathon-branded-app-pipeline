// @flow

import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import ImageUploader169 from '../../../components/input/ImageUploader169.component';
import ColorInput from '../../../components/input/ColorInput.component';
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

function CompanyCoverPreview(props: { previewURL: string }) {
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
      this.state.theme.instagramURL === this.props.theme.instagramURL &&
      this.state.theme.general_terms_and_conditions ===
        this.props.theme.general_terms_and_conditions &&
      this.state.theme.facebookURL === this.props.theme.facebookURL
    );
  };

  handleCoverChange = (cover: ?File) => {
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
      'gtmId',
      'instagramURL',
      'general_terms_and_conditions',
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
              onChange={(color) => this.handleChange('primary_color')(color)}
              color={this.state.theme.primary_color}
            />
          </div>
          <div className={classes.horizontalInput}>
            <ColorInput
              onChange={(color) => this.handleChange('secondary_color')(color)}
              label={t('forms.secondary_color.label')}
              helperText={t('forms.secondary_color.helperText')}
              color={this.state.theme.secondary_color}
            />
          </div>
        </div>
        <div className={classes.inputContainer}>
          <TextField
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
        <div className={classes.inputContainer}>
          <TextField
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
        <div className={classes.inputContainer}>
          <TextField
            variant="outlined"
            placeholder={t('forms.gtmId.placeholder')}
            label={t('forms.gtmId.label')}
            value={this.state.theme.gtmId}
            onChange={(ev) => this.handleChange('gtmId')(ev.target.value)}
          />
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
  },
  progress: {
    marginLeft: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['theme']),
)(ThemeForm);
