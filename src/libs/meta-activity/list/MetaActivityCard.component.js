// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

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

import {
  MetaActivityCover,
  ActivityStats,
  MetaActivityBasicInfo,
} from '../components';
import type { MetaActivity } from '../../../api/types';

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
  goToEdit: (metaActivityId: number) => void,
  goToDetail: (metaActivityId: number) => void,
};

export class ActivityCard extends Component<Props> {
  render() {
    const { metaActivity, t, stats, classes } = this.props;
    const { etablissements } = metaActivity;

    return (
      <Card>
        <MetaActivityCover metaActivity={metaActivity} />
        <CardContent>
          <MetaActivityBasicInfo metaActivity={metaActivity} />
        </CardContent>
        {stats ? (
          <CardContent className={classes.unPaddedHorizontal}>
            <ActivityStats metaActivity={metaActivity} stats={stats} />
          </CardContent>
        ) : null}
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
          <Button
            size="small"
            color="primary"
            onClick={() => this.props.goToDetail(metaActivity.id)}
          >
            {t('common.seeMore')}
          </Button>
          <Button
            size="small"
            color="secondary"
            onClick={() => this.props.goToEdit(metaActivity.id)}
          >
            {t('common.edit')}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(withNamespaces()(ActivityCard));
