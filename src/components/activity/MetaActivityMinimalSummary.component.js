// @flow
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation, TFunction } from 'react-i18next';

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
      <ListItem dense divider className={classes.listItem}>
        <CircularProgress />
        <ListItemText primary={props.t('common.loading')} />
      </ListItem>
    );
  }
  const { name, id, parent_category } = metaActivity;

  return (
    <ListItem
      key={id}
      dense
      divider
      button={!!onClick}
      className={classes.listItem}
      onClick={onClick}
    >
      <Sport noname parentCategory={parent_category} />
      <ListItemText className={classes.text} primary={name} />
    </ListItem>
  );
}

export default withTranslation()(
  withStyles(styles)(MetaActivityMinimalSummary),
);
