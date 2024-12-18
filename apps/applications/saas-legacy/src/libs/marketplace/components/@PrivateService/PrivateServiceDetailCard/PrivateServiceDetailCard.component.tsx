import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

type Props = {
  privateServiceCover: string;
  privateServiceName: string;
  privateServiceDescription: string;
};

const PrivateServiceDetailCard: React.FC<Props> = ({
  privateServiceCover,
  privateServiceName,
  privateServiceDescription,
}) => {
  const classes = useStyles();
  return (
    <Card variant="outlined">
      {privateServiceCover && (
        <CardMedia
          className={classes.cover}
          component="img"
          image={privateServiceCover}
        />
      )}
      {privateServiceDescription && privateServiceName && (
        <CardContent>
          <Typography variant="body1">{privateServiceName}</Typography>
          <Typography color="textSecondary" variant="subtitle2">
            {privateServiceDescription}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  cover: {
    float: 'left',
    maxWidth: 150,
    maxHeight: 150,
    padding: theme.spacing(2),
  },
}));

export default React.memo(PrivateServiceDetailCard);
