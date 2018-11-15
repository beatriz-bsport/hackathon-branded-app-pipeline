// @flow
import React, { Component } from 'react';

import {
  Grid,
  Paper,
  Typography,
  Button,
  withStyles,
  CardMedia,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { FormField, ImageUploader } from '../input';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
});

type Props = {
  initial: *,
  coaches: *[],
  establishments: *[],
  SCTs: *[],
  onSubmit: (*) => void,
  classes: Object,
  metaActivityNames: Array<string>,
  t: (x: string) => string,
};

type State = {
  name: ?string,
  SCT: ?number,
  description: ?string,
  coach: ?number,
  establishment: ?number,
  default_waiting_list_max_size: number,
  default_price: ?number,
  default_credits: ?number,
  default_last_booking_minutes: ?number,
  default_last_discard_minutes: ?number,
  default_duration_minutes: ?number,
  customer_enabled: ?boolean,
};

export class MetaActivityForm extends Component<Props, State> {
  state = {
    default_waiting_list_max_size: 0,
    default_last_booking_minutes: 30,
    default_last_discard_minutes: 30,
    default_duration_minutes: 30,
    customer_enabled: 0,
  };

  constructor(props: Props) {
    super(props);

    Object.keys(props.initial || {}).forEach((key) => {
      this.state[key] = props.initial[key];
    });
  }

  onSubmit = (event: Object) => {
    event.preventDefault();
    const {
      name,
      SCT,
      description,
      coach,
      establishment,
      default_waiting_list_max_size,
      default_price,
      default_credits,
      default_last_booking_minutes,
      default_last_discard_minutes,
      default_duration_minutes,
      customer_enabled,
      cover,
    } = this.state;
    const { t, metaActivityNames } = this.props;

    if (metaActivityNames.find((n) => n.toUpperCase() === name.toUpperCase())) {
      alert(t('form.metaActivity.cantAddSameName'));
      return;
    }

    const formData = new FormData();
    cover && formData.append('cover', cover);
    formData.append('name', name);
    formData.append('SCT', SCT);
    formData.append('description', description);
    formData.append('coach', coach);
    formData.append('establishment', establishment);
    formData.append(
      'default_waiting_list_max_size',
      default_waiting_list_max_size,
    );
    formData.append('default_price', default_price);
    formData.append('default_credits', default_credits);
    formData.append(
      'default_last_booking_minutes',
      default_last_booking_minutes,
    );
    formData.append(
      'default_last_discard_minutes',
      default_last_discard_minutes,
    );
    formData.append('default_duration_minutes', default_duration_minutes);
    formData.append('customer_enabled', customer_enabled);

    this.props.onSubmit(formData);
  };

  onFormFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  render() {
    const { SCTs, coaches, establishments, classes, t } = this.props;
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperContainer}>
            <form onSubmit={this.onSubmit}>
              <Grid container direction="column" spacing={16}>
                <Grid item>
                  <Typography variant="title">
                    {t('form.newMetaActivity')}
                  </Typography>
                </Grid>
                <Grid item>
                  <label>Photo</label>
                  <ImageUploader onChange={this.onFormFieldChange('cover')}>
                    <MetaActivityCoverPreview />
                  </ImageUploader>
                </Grid>
                <Grid item>
                  <FormField
                    id="name"
                    required
                    value={this.state.name}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="SCT"
                    required
                    value={this.state.SCT}
                    choices={SCTs}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item>
                  <FormField
                    id="description"
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
                    id="default_waiting_list_max_size"
                    required
                    value={this.state.default_waiting_list_max_size}
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
                  <Button variant="raised" color="primary" type="submit">
                    {t('form.send')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

function MetaActivityCoverPreview(props: { previewURL: string }) {
  return (
    <CardMedia
      style={{ height: 250 }}
      image={
        props.previewURL ||
        'https://images.pexels.com/photos/137611/pexels-photo-137611.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      }
    />
  );
}

export default withStyles(styles)(translate()(MetaActivityForm));
