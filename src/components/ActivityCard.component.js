import React, { Component } from 'react';
import {
  withStyles,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import SPORTS from 'bsport-commons/lib/master-data/sports';
import {
  ActivityCover,
  ActivityStats,
  ActivityBasicInfo,
  Level,
  CoachThumbnail,
} from '../components';
import api from '../api';

export class ActivityCard extends Component<{}> {
  render() {
    const { activity, t, classes, stats } = this.props;
    const {
      id,
      parent_category,
      name,
      level_id,
      cover_thumbnail,
      coach,
      etablissement,
    } = activity;

    return (
      <Card>
        <ActivityCover activity={activity} />
        <CardContent>
          <ActivityBasicInfo activity={activity} />
        </CardContent>
        <CardContent>
          <ActivityStats activity={activity} stats={stats} />
        </CardContent>
        <CardActions>
          <Link to={`/activity/${id}`} style={{ textDecoration: 'none' }}>
            <Button size="small" color="primary">
              {t('common.seeMore')}
            </Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

export default translate()(withStyles()(ActivityCard));
