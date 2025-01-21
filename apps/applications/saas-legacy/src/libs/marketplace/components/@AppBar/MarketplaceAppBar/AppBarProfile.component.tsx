import React from 'react';

import Hidden from '@material-ui/core/Hidden';
import ButtonBase from '@material-ui/core/ButtonBase';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { alpha } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';

import clsx from 'clsx';

import AppBarAuth from './AppBarAuth.component';

type ProfileProps = {
  photo?: string;
  isWidget?: boolean;
  isMenuOpen: boolean;
  handleProfileMenuOpen: (event: React.SyntheticEvent<HTMLElement>) => void;
  auth?: Object;
};

const AppBarProfile: React.FC<ProfileProps> = ({
  photo,
  isWidget,
  isMenuOpen,
  handleProfileMenuOpen,
  auth,
}) => {
  const classes = useStyles();

  return (
    <ButtonBase className={classes.loginButton} onClick={handleProfileMenuOpen}>
      {photo ? (
        <Avatar
          classes={{
            root: clsx(classes.profilePicSmall, 'ppBorderOnHover'),
          }}
          src={photo}
        />
      ) : (
        <AccountCircleIcon
          aria-haspopup="true"
          aria-owns={isMenuOpen ? 'material-appbar' : undefined}
          className={clsx(classes.noProfilePic, 'noPpBorderOnHover')}
          color="disabled"
        />
      )}
      {isWidget ? (
        <AppBarAuth auth={auth} />
      ) : (
        <Hidden smDown>
          <AppBarAuth auth={auth} />
        </Hidden>
      )}
    </ButtonBase>
  );
};

const useStyles = makeStyles((theme) => ({
  loginButton: {
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.05),
      '& .ppBorderOnHover': {
        [theme.breakpoints.up('md')]: {
          margin: 0,
          height: theme.spacing(5),
          width: theme.spacing(5),
          borderWidth: theme.spacing(0.5),
          borderColor: 'white',
          borderStyle: 'solid',
          borderRadius: '50%',
        },
      },
      '& .noPpBorderOnHover': {
        [theme.breakpoints.up('md')]: {
          backgroundColor: 'white',
        },
      },
    },
    borderRadius: theme.spacing(4.5),
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(1),
      padding: theme.spacing(1),
      borderRadius: '50%',
    },
  },
  profilePicSmall: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    margin: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  noProfilePic: {
    height: theme.spacing(5),
    width: theme.spacing(5),
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
      margin: -theme.spacing(0.5),
    },
  },
}));

export default AppBarProfile;
