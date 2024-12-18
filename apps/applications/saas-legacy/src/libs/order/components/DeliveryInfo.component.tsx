import React from 'react';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import type { OrderWithProducts } from '#src/libs/order/types';

import { ALLOWED_COUNTRIES_FOR_STATES } from '#src/libs/member/constants';
import { Member } from '#src/libs/member/types';

type Props = {
  order: OrderWithProducts<Member>;
  companyCountry?: string;
};

export const DeliveryInfo: React.FC<Props> = ({ order, companyCountry }) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.nameContainer}>
        <Typography className={classes.horizontalElement} variant="subtitle1">
          {order.first_name}
        </Typography>
        <Typography variant="subtitle1">{order.last_name}</Typography>
      </div>
      <div>
        <Typography variant="subtitle1">{order.address_line_1}</Typography>
        <Typography color="textSecondary" variant="subtitle1">
          {order.address_line_2}
        </Typography>
        <div className={classes.cityContainer}>
          {ALLOWED_COUNTRIES_FOR_STATES.includes(companyCountry) &&
            order.address_state && (
              <Typography
                className={classes.horizontalElement}
                variant="subtitle1"
              >
                {order.address_state}
              </Typography>
            )}
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

const useStyles = makeStyles((theme: Theme) => ({
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
    paddingRight: theme.spacing(2),
  },
}));

export default DeliveryInfo;
