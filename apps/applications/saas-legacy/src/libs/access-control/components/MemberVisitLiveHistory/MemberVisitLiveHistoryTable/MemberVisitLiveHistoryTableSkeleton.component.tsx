import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Skeleton from '@material-ui/lab/Skeleton';
import classNames from 'classnames';

const MemberVisitLiveHistoryTableSkeleton: React.FC = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <List>
        <ListItem dense className={classes.listItem} divider>
          <Skeleton variant="rect" className={classes.skeleton} width={80} />
          <Skeleton variant="rect" className={classes.skeleton} width={80} />
          <Skeleton variant="rect" className={classes.skeleton} width={80} />
          <Skeleton variant="rect" className={classes.skeleton} width={80} />
        </ListItem>
        {Array.from({ length: 3 }).map((_, index) => (
          <ListItem
            key={index}
            divider={index !== 2}
            className={classNames(classes.listItem, classes.padding2)}
          >
            {Array.from({ length: 4 }).map((__, subIndex) => (
              <Skeleton
                key={subIndex}
                variant="rect"
                className={classNames(classes.skeleton, classes.flex1)}
              />
            ))}
            <Skeleton variant="rect" className={classes.skeleton} width={80} />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    borderColor: theme.palette.grey[300],
    borderRadius: 2 * theme.shape.borderRadius,
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  listItem: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(2),
  },
  skeleton: {
    borderRadius: theme.shape.borderRadius,
  },
  flex1: {
    flex: 1,
  },
  padding2: {
    padding: theme.spacing(2),
  },
}));

export default React.memo(MemberVisitLiveHistoryTableSkeleton);
