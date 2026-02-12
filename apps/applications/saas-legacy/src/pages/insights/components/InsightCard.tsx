import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
  },
  cardActionArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
  },
}));

type Props = {
  title: React.ReactNode;
  description: React.ReactNode;
  onClick: () => void;
};

const InsightCard: React.FC<Props> = ({ title, description, onClick }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} variant="outlined">
      <CardActionArea className={classes.cardActionArea} onClick={onClick}>
        <Typography color="textPrimary" variant="body1">
          {title}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default InsightCard;
