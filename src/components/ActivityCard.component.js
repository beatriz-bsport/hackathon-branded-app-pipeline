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
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { LocationOn } from '@material-ui/icons';
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
    const { activity, t, stats } = this.props;
    const {
      id,
      parent_category,
      name,
      level_id,
      cover_thumbnail,
      coach,
      etablissements,
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
        <CardContent>
          <List>
            {etablissements.map((e) => (
              <ListItem>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body1">{e.title}</Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
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

export default translate()(ActivityCard);
