// @flow

import React from 'react';
import { withNamespaces } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocationOn from '@material-ui/icons/LocationOn';
import type { TFunction } from 'react-i18next';

import MetaActivityCover from './MetaActivityCover.component';
import MetaActivityBasicInfo from './MetaActivityBasicInfo.component';
import type { MetaActivity } from '../../../api/types';

const styles = (theme) => ({
  unPaddedHorizontal: {
    marginLeft: -theme.spacing.unit * 3,
    marginRight: -theme.spacing.unit * 3,
  },
});

type Props = {
  metaActivity: MetaActivity,
  t: TFunction,
  goToEdit: (metaActivityId: number) => void,
  goToDetail: (metaActivityId: number) => void,
};

export const MetaActivityCard = (props: Props) => {
  const { metaActivity, t } = props;
  const { etablissements } = metaActivity;

  return (
    <Card>
      <MetaActivityCover metaActivity={metaActivity} />
      <CardContent>
        <MetaActivityBasicInfo metaActivity={metaActivity} />
      </CardContent>
      <CardContent>
        <List>
          {etablissements.map((e) => (
            <ListItem key={e.id}>
              <ListItemIcon>
                <LocationOn />
              </ListItemIcon>
              <ListItemText primary={e.title} secondary={e.location.address} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => props.goToDetail(metaActivity.id)}
        >
          {t('common.seeMore')}
        </Button>
        <Button
          size="small"
          color="secondary"
          onClick={() => props.goToEdit(metaActivity.id)}
        >
          {t('common.edit')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default withStyles(styles)(withNamespaces()(MetaActivityCard));
