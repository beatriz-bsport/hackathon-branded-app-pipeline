// @flow
import React from 'react';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  children: any;
};

export const VaccinationBadge = (props: Props) => {
  const classes = useStyles();
  console.log('yo');
  return (
    <div className={classes.container}>
      {props.children}
      <div className={classes.badge}>
        <LocalHospitalIcon color="primary" />
      </div>
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
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
}));

export default VaccinationBadge;
