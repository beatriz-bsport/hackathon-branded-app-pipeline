// @flow
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Sport from '../../libs/category/components/SCT.component';
import type { MetaActivity } from '../../api/types';

const styles = (theme) => ({
  text: {
    marginLeft: theme.spacing(1),
  },
});

type Props = {
  metaActivity: MetaActivity,
  classes: Object,
  onClick: () => void,
  t: TFunction,
};

// prettier-disable-next-line
export function MetaActivityMinimalSummary(props: Props) {
  const { classes, metaActivity, onClick } = props;
  if (!metaActivity) {
    return (
      <ListItem divider dense className={classes.listItem}>
        <CircularProgress />
        <ListItemText primary={props.t('common.loading')} />
      </ListItem>
    );
  }
  const { name, id, parent_category } = metaActivity;

  return (
    <ListItem
      divider
      key={id}
      dense
      button={!!onClick}
      className={classes.listItem}
      onClick={onClick}
    >
      <Sport parentCategory={parent_category} noname />
      <ListItemText className={classes.text} primary={name} />
    </ListItem>
  );
}

export default withTranslation()(
  withStyles(styles)(MetaActivityMinimalSummary),
);
