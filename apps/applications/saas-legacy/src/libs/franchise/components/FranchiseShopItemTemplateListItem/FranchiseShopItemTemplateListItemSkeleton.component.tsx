import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Skeleton from '@material-ui/lab/Skeleton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const FranchiseShopItemTemplateListItemSkeleton: React.FC = () => {
  const classes = useStyles();
  return (
    <ListItem className={classes.container}>
      <Skeleton height={40} variant="circle" width={40} />

      <div className={classes.textContainer}>
        <Skeleton height={18} variant="rect" width={320} />
        <Skeleton height={12} variant="rect" width={140} />
      </div>

      <ListItemSecondaryAction className={classes.listItemSecondaryActions}>
        <Skeleton height={24} variant="rect" width={80} />
        <Skeleton height={40} variant="circle" width={40} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  listItemSecondaryActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export default React.memo(FranchiseShopItemTemplateListItemSkeleton);
