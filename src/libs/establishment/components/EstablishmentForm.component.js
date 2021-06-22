// @flow

import React, { Component } from 'react';

import type { TFunction } from 'react-i18next';

import { withTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  FormField,
  LocationInput,
  ImageUploader,
} from '../../../components/input';
import MultipleImageUploader from '../../../components/MultipleImageUploader.component';
import type { Establishment as EstablishmentType } from '../../../api/types';

import ImageList from '../../../components/ImageList.component';

type Props = {
  processing: boolean,
  initial: $Shape<EstablishmentType>,
  onSubmit: ($Shape<EstablishmentType>) => void,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
  imageUploader: ?{
    onAddImage: (image: File) => void,
    onRemoveImage: (image: File) => void,
  },
};

type State = {
  title: string,
  specific_info: string,
  practical_info: string,
  location: {
    address: string,
    address_line_1: string,
    address_line_2: string,
    zipcode: string,
    city: string,
    country: string,
    geometry: object,
  },
  cover: ?string,
  capacity: number,
};

export class EstablishmentForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
        title: props.initial.title,
        specific_info: props.initial.specific_info,
        practical_info: props.initial.practical_info,
        location: {
          address: props.initial.location.address,
          address_line_1: props.initial.location.address_line_1,
          address_line_2: props.initial.location.address_line_2,
          zipcode: props.initial.location.zipcode,
          city: props.initial.location.city,
          country: props.initial.location.country,
          geometry: {
            x: props.initial.location.latitude,
            y: props.initial.location.longitude,
          },
        },
        capacity: props.initial.capacity,
        cover: props.initial.cover,
      };
    } else {
      this.state = {
        title: '',
        specific_info: '',
        practical_info: '',
        location: {
          address: '',
          address_line_1: '',
          address_line_2: '',
          zipcode: '',
          city: '',
          country: '',
          geometry: {
            x: 0,
            y: 0,
          },
        },
        capacity: 30,
        cover: '',
      };
    }
  }

  onSubmit = (e: SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    const {
      title,
      specific_info,
      practical_info,
      location,
      cover,
      capacity,
    } = this.state;
    const data = {
      title,
      specific_info,
      capacity,
      practical_info,
      location: location && {
        address: location.address_line_1
          .concat(' ', location.address_line_2 || '')
          .concat(', ', location.zipcode || '')
          .concat(' ', location.city || '')
          .concat(', ', location.country || ''),
        address_line_1: location.address_line_1,
        address_line_2: location.address_line_2,
        city: location.city,
        country: location.country,
        zipcode: location.zipcode,
        geometry: location.geometry,
      },
    };
    if (cover && typeof cover !== 'string') {
      data.cover = cover;
    }
    this.props.onSubmit(data);
  };

  onFormFieldChange = (id: string) => (value: any) => {
    if (id === 'location') {
      this.setState({
        location: { ...value },
      });
    } else {
      this.setState({ [id]: value });
    }
  };

  renderButton = () => {
    if (this.props.processing) {
      return <CircularProgress />;
    }
    return (
      <div className={this.props.classes.buttonsContainer}>
        <Button onClick={this.props.onCancel}>
          {this.props.t('form.discard')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            !!this.state.location.geometry &&
            (!this.state.location.geometry.x || !this.state.location.geometry.y)
          }
        >
          {this.props.t('form.send')}
        </Button>
      </div>
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
            <Grid container spacing={2}>
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
                  {t('establishment:update.imageUploaderRequireEditMessage')}
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
                <TextField
                  multiline
                  rows={3}
                  value={this.state.practical_info}
                  onChange={(ev) =>
                    this.onFormFieldChange('practical_info')(ev.target.value)
                  }
                  label={t('establishment:practical_info.label')}
                  placeholder={t('establishment:practical_info.placeholder')}
                  helperText={t('establishment:practical_info.helperText')}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="numeric"
                  value={this.state.capacity}
                  onChange={(ev) =>
                    this.onFormFieldChange('capacity')(
                      parseInt(ev.target.value || 0, 10),
                    )
                  }
                  label={t('establishment:capacity.label')}
                  placeholder={t('establishment:capacity.placeholder')}
                  helperText={t('establishment:capacity.helperText')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <LocationInput
                  id="location"
                  required
                  value={
                    this.state.location &&
                    this.state.location.address && {
                      ...this.state.location,
                    }
                  }
                  onChange={(data) => {
                    this.setState({ location: { ...data } });
                  }}
                  t={this.props.t}
                />
              </Grid>
              <Grid item container justify="flex-start">
                {this.renderButton()}
              </Grid>
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
    padding: theme.spacing(3),
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
export default withStyles(styles)(withTranslation()(EstablishmentForm));
