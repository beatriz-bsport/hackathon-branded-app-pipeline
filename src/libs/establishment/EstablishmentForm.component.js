// @flow

import React, { Component } from 'react';

import type { TFunction } from 'react-i18next';

import { translate } from 'react-i18next';
import {
  CircularProgress,
  Paper,
  Grid,
  withStyles,
  Button,
} from '@material-ui/core';

import {
  FormField,
  LocationInput,
  ImageUploader,
} from '../../components/input';
import MultipleImageUploader from '../../components/MultipleImageUploader.component';
import type { Establishment as EstablishmentType } from '../../api/types';

import ImageList from '../../components/ImageList.component';

type Props = {
  processing: boolean,
  initial: $Shape<EstablishmentType>,
  onSubmit: ($Shape<EstablishmentType>) => void,
  t: TFunction,
  classes: { [string]: string },
  imageUploader: ?{
    onAddImage: (image) => void,
    onRemoveImage: (image) => void,
  },
};
type State = {
  title: ?string,
  specific_info: ?string,
  location: ?{ x: number, y: number },
  address: ?string,
  cover: ?string,
};

export class EstablishmentForm extends Component<Props, State> {
  state = {};

  constructor(props: Props) {
    super(props);

    if (props.initial) {
      this.state.title = props.initial.title;
      this.state.specific_info = props.initial.specific_info;
      this.state.address = props.initial.location.address;
      this.state.location = {
        x: props.initial.location.longitude,
        y: props.initial.location.latitude,
      };
      this.state.cover = props.initial.cover;
    }
  }

  onSubmit = (e: Object) => {
    e.preventDefault();

    const { title, specific_info, location, address, cover } = this.state;
    const data = {
      title,
      specific_info,
      x: location && location.x,
      y: location && location.y,
      address,
    };
    if (cover && typeof cover !== 'string') {
      data.cover = cover;
    }

    this.props.onSubmit(data);
  };

  onFormFieldChange = (id: string) => (value) => {
    if (id === 'location') {
      this.setState({ location: value.location, address: value.address });
    } else {
      this.setState({ [id]: value });
    }
  };

  renderButton = () => {
    if (this.props.processing) {
      return <CircularProgress />;
    }
    return (
      <Grid container item direction="row" justify="flex-end" spacing={16}>
        <Button variant="contained" color="primary" type="submit">
          {this.props.t('form.send')}
        </Button>
      </Grid>
    );
  };

  render() {
    const { t, classes, imageUploader } = this.props;
    const images = (this.props.initial || {}).images || [];
    return (
      <form onSubmit={this.onSubmit}>
        <Paper className={classes.paperContainer}>
          <ImageUploader
            onChange={this.onFormFieldChange('cover')}
            initial={this.state.cover}
          />
          <div className={classes.container}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <FormField
                  id="title"
                  required
                  value={this.state.title}
                  onChange={this.onFormFieldChange}
                />
              </Grid>
              {imageUploader ? (
                <Grid item xs={12} style={{ marginTop: 20 }}>
                  <label>Carousel</label>
                  <MultipleImageUploader
                    initial={images}
                    onAddImage={imageUploader.onAddImage}
                    onRemoveImage={imageUploader.onRemoveImage}
                  />
                  {images.length ? (
                    <ImageList
                      images={images}
                      onRemoveImage={imageUploader.onRemoveImage}
                    />
                  ) : null}
                </Grid>
              ) : (
                <p>
                  {t('establishment.update.imageUploaderRequireEditMessage')}
                </p>
              )}
              <Grid item xs={12}>
                <FormField
                  id="specific_info"
                  multiline
                  required
                  value={this.state.specific_info}
                  onChange={this.onFormFieldChange}
                />
              </Grid>
              <Grid item xs={12}>
                <LocationInput
                  id="location"
                  value={{
                    address: this.state.address,
                    location: this.state.location,
                  }}
                  onChange={this.onFormFieldChange('location')}
                />
              </Grid>
              <Grid item>{this.renderButton()}</Grid>
            </Grid>
          </div>
        </Paper>
      </form>
    );
  }
}

const styles = (theme) => ({
  paperContainer: {
    maxWidth: 800,
    margin: '0 auto',
  },
  container: {
    padding: theme.spacing.unit * 3,
  },
});
export default withStyles(styles)(translate()(EstablishmentForm));
