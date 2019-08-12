// @flow

import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import ImageUploader from '../../../components/input/ImageUploader.component';
import ColorInput from '../../../components/input/ColorInput.component';
import type { Theme } from '../types';

type Props = {
  theme: Theme,
  onSubmit: (id: number, data: *) => void,
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
          height: 70,
          width: 70,
        }}
      />
    );
  }
  return (
    <CardMedia
      style={{ height: 70, width: 70, borderRadius: 35 }}
      image={
        // prettier-ignore
        props.previewURL
      }
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
      this.state.theme.website === this.props.theme.website
    );
  };

  handleCoverChange = (cover) => {
    if (cover && typeof cover !== 'string') {
      this.handleChange('cover')(cover);
    }
  };

  onSubmit = () => {
    const data = new FormData();
    ['primary_color', 'secondary_color', 'website'].map((key) =>
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
        <div className={classes.inputContainer}>
          <ImageUploader
            onChange={this.handleCoverChange}
            initial={this.state.theme.cover}
          >
            <CompanyCoverPreview />
          </ImageUploader>
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.colorPicker}>
            <ColorInput
              label={t('forms.primary_color.label')}
              helperText={t('forms.primary_color.helperText')}
              onChange={(color) => this.handleChange('primary_color')(color)}
              color={this.state.theme.primary_color}
            />
          </div>
          <div className={classes.colorPicker}>
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
            placeholder={t('forms.website.placeholder')}
            helperText={t('forms.website.helperText')}
            label={t('forms.website.label')}
            value={this.state.theme.website}
            onChange={(ev) => this.handleChange('website')(ev.target.value)}
          />
        </div>
        <Button
          onClick={() => this.onSubmit(this.state.theme)}
          disabled={this.checkChange()}
          variant="contained"
          color="primary"
        >
          {t('forms.submit')}
        </Button>
      </div>
    );
  }
}

const styles = (theme) => ({
  colorPicker: {
    marginRight: theme.spacing.unit * 3,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing.unit * 3,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['theme']),
)(ThemeForm);
