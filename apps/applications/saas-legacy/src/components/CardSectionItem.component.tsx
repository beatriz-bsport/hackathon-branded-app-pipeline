import React from 'react';

import clsx from 'clsx';

import {
  Card,
  Typography,
  CardActionArea,
  makeStyles,
} from '@material-ui/core';

type Props = { title: string; description: string; onCardClick?: () => void };

const CardSectionItem: React.FC<Props> = ({
  title,
  description,
  onCardClick,
}) => {
  const classes = useStyles();

  if (!onCardClick) {
    return (
      <Card className={classes.withPadding} variant="outlined">
        <Typography color="textPrimary" variant="body1">
          <strong>{title}</strong>
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {description}
        </Typography>
      </Card>
    );
  }

  return (
    <Card className={classes.flex} variant="outlined">
      <CardActionArea
        className={clsx(classes.withPadding, classes.cardActionArea)}
        onClick={onCardClick}
      >
        <Typography color="textPrimary" variant="body1">
          <strong>{title}</strong>
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  withPadding: { padding: theme.spacing(2) },
  cardActionArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  flex: { display: 'flex' },
}));

export default React.memo(CardSectionItem);
