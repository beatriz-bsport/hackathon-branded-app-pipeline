// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import MultipleImageUploader from '../../components/MultipleImageUploader.component';
import ImageList from '../../components/ImageList.component';
import { FormField, ImageUploader } from '../../components/input';

type Props = {
  initial: *,
  SCTs: *[],
  onSubmit: (*) => void,
  classes: Object,
  metaActivityNames: Array<string>,
  initial: ?MetaActivity,
  t: (x: string) => string,
  imageUploader: ?{
    onAddImage: (image) => void,
    onRemoveImage: (image) => void,
  },
};

type State = {
  name: ?string,
  SCT: ?number,
  description: ?string,
  default_last_booking_minutes: ?number,
  default_last_discard_minutes: ?number,
  customer_enabled: ?boolean,
};

export class MetaActivityForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      default_last_booking_minutes: 0,
      default_last_discard_minutes: 0,
      customer_enabled: true,
    };
    const { initial } = this.props;
    if (initial) {
      this.state.name = initial.name;
      this.state.default_last_booking_minutes = initial.last_booking_minutes;
      this.state.customer_enabled = initial.customer_enabled;
      this.state.SCT = initial.category_id;
      this.state.cover_main = initial.cover_main;
      this.state.description = initial.description;
    }
  }

  onSubmit = (event: Object) => {
    event.preventDefault();
    const {
      name,
      SCT,
      description,
      default_last_booking_minutes,
      default_last_discard_minutes,
      customer_enabled,
      cover_main,
    } = this.state;
    const { t, metaActivityNames } = this.props;

    if (metaActivityNames.find((n) => n.toUpperCase() === name.toUpperCase())) {
      alert(t('form.metaActivity.cantAddSameName'));
      return;
    }

    const formData = new FormData();
    if (cover_main && typeof cover_main !== 'string') {
      formData.append('cover_main', cover_main);
    }
    formData.append('name', name);
    formData.append('SCT', SCT);
    formData.append('description', description);
    formData.append(
      'default_last_booking_minutes',
      default_last_booking_minutes,
    );
    formData.append(
      'default_last_discard_minutes',
      default_last_discard_minutes,
    );
    formData.append('customer_enabled', customer_enabled);
    this.props.onSubmit(formData);
  };

  onFormFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  render() {
    const { SCTs, classes, t, imageUploader, loading } = this.props;
    const images = (this.props.initial || {}).images || [];
    return (
      <form onSubmit={this.onSubmit}>
        <Paper className={classes.paperContainer}>
          <ImageUploader
            onChange={this.onFormFieldChange('cover_main')}
            initial={this.state.cover_main}
          />
          <div className={classes.container}>
            <Grid container direction="column" spacing={16}>
              <Grid item>
                <FormField
                  id="name"
                  name="name"
                  required
                  value={this.state.name}
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
                  {t('metaActivity.update.imageUploaderRequireEditMessage')}
                </p>
              )}
              <Grid item>
                <FormField
                  id="SCT"
                  name="SCT"
                  required
                  value={this.state.SCT}
                  choices={SCTs}
                  onChange={this.onFormFieldChange}
                />
              </Grid>
              <Grid item>
                <FormField
                  id="description"
                  name="description"
                  required
                  multiline
                  fullWidth
                  value={this.state.description}
                  onChange={this.onFormFieldChange}
                />
              </Grid>
              <Grid item>
                <FormField
                  id="default_last_booking_minutes"
                  required
                  value={this.state.default_last_booking_minutes}
                  onChange={this.onFormFieldChange}
                />
              </Grid>
              <Grid item>
                <FormField
                  id="default_last_discard_minutes"
                  required
                  value={this.state.default_last_discard_minutes}
                  onChange={this.onFormFieldChange}
                />
              </Grid>
              <Grid item>
                <FormField
                  id="customer_enabled"
                  required
                  onChange={this.onFormFieldChange}
                />
              </Grid>
            </Grid>
            <Grid container direction="row" justify="flex-end">
              <Grid item>
                <Link to="/activity" style={{ textDecoration: 'none' }}>
                  <Button>{t('form.discard')}</Button>
                </Link>
              </Grid>
              <Grid item>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Button variant="contained" color="primary" type="submit">
                    {t('form.send')}
                  </Button>
                )}
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
    padding: theme.spacing.unit * 3,
  },
});

export default withStyles(styles)(translate()(MetaActivityForm));
