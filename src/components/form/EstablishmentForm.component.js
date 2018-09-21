// @flow

import React, { Component } from 'react';

import type { TFunction } from 'react-i18next';

import { translate } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Paper, Grid, withStyles, Typography, Button } from '@material-ui/core';

import { FormField, LocationInput, ImageUploader } from '../input';

type Props = {
  initial: EstablishmentType,
  onSubmit: (EstablishmentType) => void,
  easyAccesses: EasyAccessType[],
  t: TFunction,
  classes: { [string]: string },
};
type State = {};

export class EstablishmentForm extends Component<Props, State> {
  state = {};

  constructor(props) {
    super(props);

    Object.keys(props.initial || {}).forEach((key) => {
      this.state[key] = props.initial[key];
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const {
      title,
      specific_info,
      location,
      easy_access,
      address,
      cover,
    } = this.state;

    this.props.onSubmit({
      title,
      specific_info,
      location,
      easy_access,
      address,
      cover,
    });
  };

  onFormFieldChange = (id) => (value) => {
    if (id === 'location') {
      this.setState({ location: value.location, address: value.address });
    } else {
      this.setState({ [id]: value });
    }
  };

  render() {
    const { t, classes, easyAccesses } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperContainer}>
            <form onSubmit={this.onSubmit}>
              <Typography variant="title" className="my-4" spacing={8}>
                {t('establishment.form.new.title')}
              </Typography>
              <Grid container spacing={16}>
                <Grid item xs={12} style={{ marginTop: 20 }}>
                  <label>Couverture</label>
                  <ImageUploader onChange={this.onFormFieldChange('cover')}>
                    <EstablishmentCardPreview />
                  </ImageUploader>
                </Grid>
                <Grid item xs={12}>
                  <FormField
                    id="title"
                    required
                    value={this.state.title}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormField
                    id="specific_info"
                    required
                    value={this.state.specific_info}
                    onChange={this.onFormFieldChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocationInput
                    id="location"
                    value={this.state.location}
                    onChange={this.onFormFieldChange('location')}
                  />
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    spacing={16}
                  >
                    <Grid item>
                      <Button variant="raised" color="primary" type="submit">
                        {t('form.send')}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

function EstablishmentCardPreview(props: { previewURL: string }) {
  return (
    <CardMedia
      style={{ height: 300 }}
      image={
        props.previewURL ||
        'https://images.pexels.com/photos/137611/pexels-photo-137611.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      }
    />
  );
}

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
});
export default withStyles(styles)(translate()(EstablishmentForm));
