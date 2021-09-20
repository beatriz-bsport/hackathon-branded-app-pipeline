// @flow
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import moment from 'moment';
import {
  Event as EventIcon,
  Room as RoomIcon,
  Phone as PhoneIcon,
  AlternateEmail as AlternateEmailIcon,
  LocalHospital as LocalHospitalIcon,
} from '@material-ui/icons';
import {
  Avatar,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { FranchiseUser } from '../types';
import { addressToReadableAddress } from '../utils';

export type OwnProps = {
  user: FranchiseUser;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

const FranchiseMemberDetailsCard = (props: Props) => {
  const { user, classes, t } = props;

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <Avatar className={classes.avatar} alt={user.name} src={user.photo} />
        <div className={classes.headerTitle}>
          <Typography variant="h5">{user.name}</Typography>
        </div>
      </div>
      <Typography className={classes.row} variant="body1">
        <EventIcon className={classes.icon} />
        {user.birthday ? moment(user.birthday).format('L') : '-'}
      </Typography>
      <Typography className={classes.row} variant="body1">
        <RoomIcon className={classes.icon} />
        {addressToReadableAddress(user.address)}
      </Typography>
      <Typography className={classes.row} variant="body1">
        <PhoneIcon className={classes.icon} />
        {user?.phone ?? '-'}
      </Typography>
      <Typography className={classes.row} variant="body1">
        <AlternateEmailIcon className={classes.icon} />
        {user?.email ?? '-'}
      </Typography>
      <Typography className={classes.row} variant="body1">
        <LocalHospitalIcon className={classes.icon} color="error" />
        {user.vaccination_status ? t('member.isVaccinated') : '-'}
      </Typography>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    card: {
      backgroundColor: theme.palette.common.white,
      borderRadius: 5,
      boxShadow: theme.shadows[2],
      padding: theme.spacing(2),
    },
    header: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      height: theme.spacing(8),
      width: theme.spacing(8),
    },
    headerTitle: {
      marginLeft: theme.spacing(2),
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    icon: {
      marginRight: theme.spacing(2),
    },
  });

export default compose(
  withStyles(styles),
  withTranslation(['franchise']),
)(FranchiseMemberDetailsCard);
