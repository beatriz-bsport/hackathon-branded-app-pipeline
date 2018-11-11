// @flow
import React from 'react';

import { Icon, ListItem, ListItemText, withStyles } from '@material-ui/core';

import { translate } from 'react-i18next';

import { Sport } from '../category';
import type { MetaActivity } from '../../api/types';

const styles = () => ({
  listItem: {
    width: '100%',
  },
});

type Props = {
  metaActivity: MetaActivity,
  classes: Object,
};

// prettier-disable-next-line
export function MetaActivityMinimalSummary(props: Props) {
  const { classes, metaActivity } = props;
  const { name, id, parent_category } = metaActivity;

  return (
    <ListItem divider key={id} dense button className={classes.listItem}>
      <Icon>
        <Sport parentCategory={parent_category} noname />
      </Icon>
      <ListItemText primary={name} />
    </ListItem>
  );
}

export default translate()(withStyles(styles)(MetaActivityMinimalSummary));
