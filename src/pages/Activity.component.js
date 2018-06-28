import React, { Component } from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Typography,
  Paper,
  TextField,
  Input,
} from '@material-ui/core';

import SPORTS from 'bsport-commons/lib/master-data/sports';

import api from '../api';
import {
  Sport,
  ActivityCover,
  ActivityBasicInfo,
  ActivityStats,
} from '../components';

type Props = {};

const styles = (theme) => ({
  inner: {
    margin: theme.spacing.unit * 4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

/** * * * * * * * * * * * *
 *
 *
 * TO REWRITE COMPLETELY THIS IS JUST FOR "FUN" SOMEHOW
 *
 * * * * * * * * * * * * * *
 */

export class Activity extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      data: [],
      sportCategories: [],
    };
  }

  componentWillMount() {
    this.activityId = parseInt(this.props.match.params.id, 10);
  }

  async componentDidMount() {
    const response = await api.category.getSCT();
    const sportCategories = response.data;
    this.setState({ sportCategories });
  }

  onEditToogle = () => {
    this.setState({ editable: !this.state.editable });
  };
  onEdit = () => {};

  getById = (array, id) => {
    // used to object from store collection on each render, default to {}
    return (array.filter((a) => a.id === id) || [{}])[0];
  };

  handleChange = (fieldName) => {
    return (event) => {
      const { data } = this.state;
      data[fieldName] = event.target.value;
      this.setState({ data });
    };
  };

  getHeader = (activity) => {
    const { classes, t } = this.props;
    const { editable, data } = this.state;

    let name = null;
    let category = null;
    if (editable) {
      name = data['name'] || activity.name;
      category = data['category'] || activity.category_id;
    } else {
      name = activity.name;
      category = activity.category_id;
    }

    const categorySelectedName =
      (
        this.state.sportCategories.filter(
          (s) => s.id === activity.category_id,
        )[0] || {}
      ).name || category;

    return editable ? (
      <div>
        <TextField
          id="name"
          label={t('activity.name')}
          className={classes.textField}
          value={name}
          onChange={this.handleChange('name')}
          margin="normal"
        />
        <FormControl noValidate className={classes.formControl}>
          <InputLabel htmlFor="age-simple">{t('common.sport')}</InputLabel>
          <Select
            value={categorySelectedName}
            input={<Input id="category" />}
            renderValue={(e) => e}
            onChange={this.handleChange('category')}
          >
            {this.state.sportCategories.map((sport) => (
              <MenuItem value={sport.id} key={sport.id}>
                {sport.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    ) : (
      <Typography variant="title">{name}</Typography>
    );
  };

  render() {
    const activity = this.getById(this.props.activities, this.activityId);
    const stats = this.getById(this.props.stats, this.activityId);

    const { classes, t } = this.props;

    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12} md={6}>
          <Paper>
            <Grid container spacing={16} direction="column">
              <Grid item>
                <ActivityCover activity={activity} />
              </Grid>
              <Grid item>
                <ActivityStats activity={activity} stats={stats} />
              </Grid>
              <Grid item className={classes.inner}>
                <Grid container justify="space-between">
                  <Grid item>{this.getHeader(activity)}</Grid>
                </Grid>
                <Grid item>
                  <Button
                    onClick={this.onEditToogle}
                    variant="raised"
                    color="primary"
                  >
                    {t('common.edit')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    activities: state.activity.all,
    stats: state.stats.activities,
  };
}

export default connect(mapStateToProps)(
  withStyles(styles)(translate()(Activity)),
);
