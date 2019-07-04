// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import type { OrderWithProducts } from '../types';

type Props = {
  order: OrderWithProducts,
  classes: Object,
};

export const DeliveryInfo = (props: Props) => {
  const { classes, order } = props;
  return (
    <div>
      <div className={classes.nameContainer}>
        <Typography className={classes.horizontalElement} variant="subtitle1">
          {order.first_name}
        </Typography>
        <Typography variant="subtitle1">{order.last_name}</Typography>
      </div>
      <div className={classes.addressContainer}>
        <Typography variant="subtitle1">{order.address_line_1}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {order.address_line_2}
        </Typography>
        <div className={classes.cityContainer}>
          <Typography className={classes.horizontalElement} variant="subtitle1">
            {order.zipcode}
          </Typography>
          <Typography variant="subtitle1">{order.city}</Typography>
        </div>
        <Typography variant="subtitle1">{order.country}</Typography>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cityContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  horizontalElement: {
    paddingRight: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(DeliveryInfo);
