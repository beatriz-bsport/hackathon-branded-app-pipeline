// @flow
import React, { Component } from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Button,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import LocationOn from '@material-ui/icons/LocationOn';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import MetaActivityCover from './MetaActivityCover.component';
import ActivityStats from './ActivityStats.component';
import MetaActivityBasicInfo from './MetaActivityBasicInfo.component';
import type { MetaActivity } from '../../api/types';

const styles = (theme) => ({
  unPaddedHorizontal: {
    marginLeft: -theme.spacing.unit * 3,
    marginRight: -theme.spacing.unit * 3,
  },
});

type Props = {
  metaActivity: MetaActivity,
  stats: Object,
  t: (x: string) => string,
  classes: Object,
};
export class ActivityCard extends Component<Props> {
  render() {
    const { metaActivity, t, stats, classes } = this.props;
    const { id, etablissements } = metaActivity;

    return (
      <Card>
        <MetaActivityCover metaActivity={metaActivity} />
        <CardContent>
          <MetaActivityBasicInfo metaActivity={metaActivity} />
        </CardContent>
        <CardContent className={classes.unPaddedHorizontal}>
          <ActivityStats metaActivity={metaActivity} stats={stats} />
        </CardContent>
        <CardContent>
          <List>
            {etablissements.map((e) => (
              <ListItem key={e.id}>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText
                  primary={e.title}
                  secondary={e.location.address}
                />
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

export default withStyles(styles)(translate()(ActivityCard));
