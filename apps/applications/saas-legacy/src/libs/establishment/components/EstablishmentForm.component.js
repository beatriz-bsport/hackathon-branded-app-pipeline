// @flow

import React, { Component } from 'react';

import { TFunction, withTranslation } from 'react-i18next';

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { ALLOWED_COUNTRIES_FOR_STATES_LONG_NAMES } from '../constants';

import {
  FormField,
  LocationInput,
  ImageUploader,
} from '../../../components/input';
import MultipleImageUploader from '../../../components/MultipleImageUploader.component';
import { Establishment as EstablishmentType } from '../../../api/types';

import ImageList from '../../../components/ImageList.component';

const { trackFormAdd, trackFormSubmitIntent } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Establishment,
  );

const addressParser = (location: Location) => {
  return location.address_line_1
    .concat(location.address_line_2 ? ' ' : '', location.address_line_2 || '')
    .concat(', ', location.zipcode || '')
    .concat(
      ALLOWED_COUNTRIES_FOR_STATES_LONG_NAMES.includes(location.country)
        ? ` ${location.state}`
        : '',
    )
    .concat(' ', location.city || '')
    .concat(', ', location.country || '');
};

type Props = {
  processing: boolean,
  initial: $Shape<EstablishmentType>,
  onSubmit: (data: $Shape<EstablishmentType>) => void,
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
    state: string,
    city: string,
    country: string,
    geometry: any,
    geocoded_data: any,
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
          state: props.initial.location.state,
          city: props.initial.location.city,
          country: props.initial.location.country,
          geometry: {
            x: props.initial.location.latitude,
            y: props.initial.location.longitude,
          },
          geocoded_data: props.initial.location.geocoded_data,
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
          state: '',
          city: '',
          country: '',
          geometry: {
            x: 0,
            y: 0,
          },
          geocoded_data: {},
        },
        capacity: 30,
        cover: '',
      };
    }
  }

  componentDidMount() {
    trackFormAdd(this.props.initial?.id);
  }

  onSubmit = (e: SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    const { title, specific_info, practical_info, location, cover, capacity } =
      this.state;
    const data = {
      title,
      specific_info,
      capacity,
      practical_info,
      location: location && {
        address: addressParser(location),
        address_line_1: location.address_line_1,
        address_line_2: location.address_line_2,
        state: location.state,
        city: location.city,
        country: location.country,
        zipcode: location.zipcode,
        geometry: location.geometry,
        geocoded_data: location.geocoded_data,
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
          color="primary"
          disabled={
            !!this.state.location.geometry &&
            (!this.state.location.geometry.x || !this.state.location.geometry.y)
          }
          onClick={() => {
            trackFormSubmitIntent(this.props.initial?.id);
          }}
          type="submit"
          variant="contained"
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
            initial={this.state.cover}
            onChange={this.onFormFieldChange('cover')}
          />
          <div className={classes.container}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormField
                  required
                  id="title"
                  onChange={this.onFormFieldChange}
                  value={this.state.title}
                />
              </Grid>
              {imageUploader ? (
                <Grid item style={{ marginTop: 20 }} xs={12}>
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
                  multiline
                  required
                  id="specific_info"
                  onChange={this.onFormFieldChange}
                  value={this.state.specific_info}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  helperText={t('establishment:practical_info.helperText')}
                  label={t('establishment:practical_info.label')}
                  onChange={(ev) =>
                    this.onFormFieldChange('practical_info')(ev.target.value)
                  }
                  placeholder={t('establishment:practical_info.placeholder')}
                  rows={3}
                  value={this.state.practical_info}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  helperText={t('establishment:capacity.helperText')}
                  label={t('establishment:capacity.label')}
                  onChange={(ev) =>
                    this.onFormFieldChange('capacity')(
                      parseInt(ev.target.value || 0, 10),
                    )
                  }
                  placeholder={t('establishment:capacity.placeholder')}
                  type="numeric"
                  value={this.state.capacity}
                />
              </Grid>
              <Grid item xs={12}>
                <LocationInput
                  required
                  id="location"
                  onChange={(data, geocoded_data) => {
                    this.setState({ location: { ...data, geocoded_data } });
                  }}
                  t={this.props.t}
                  value={
                    this.state.location &&
                    this.state.location.address && {
                      ...this.state.location,
                    }
                  }
                />
              </Grid>
              <Grid container item justify="flex-start">
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
