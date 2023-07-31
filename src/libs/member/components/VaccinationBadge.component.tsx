// @flow
import React from 'react';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

type Props = {
  children: any;
  status: boolean | null;
  topRightIcon: boolean;
};

export const VaccinationBadge = (props: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {props.children}
      {props.status && (
        <div
          className={classNames(classes.badge, {
            [classes.topRightCorner]: props.topRightIcon,
          })}
        >
          <LocalHospitalIcon color="primary" />
        </div>
      )}
      {!props.status && props.status !== null && (
        <div
          className={classNames(classes.badge, {
            [classes.topRightCorner]: props.topRightIcon,
          })}
        >
          <LocalHospitalIcon color="error" />
        </div>
      )}
    </div>
  );
};
const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
    position: 'absolute',
    borderRadius: '50%',
    fontSize: 14,
    top: 0,
    left: 0,
  },
  topRightCorner: {
    left: 'inherit',
    right: '10%',
  },
}));

export default VaccinationBadge;
