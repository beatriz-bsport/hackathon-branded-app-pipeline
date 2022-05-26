import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { alpha } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { Member } from '#libs/member/types';
import AppBarNavigationBetweenRelations from './AppBarNavigationBetweenRelations.component';

type ProfileMenuProps = {
  auth?: Object;
  anchorEl: HTMLElement;
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  photo?: string;
  isWidget?: boolean;
  goToUserSpace?: () => void;
  disconnect?: () => void;
  controlableMemberList?: Array<Member>;
  navigateToRelationAccount?: (memberId: number) => void;
  isRelationNavigation?: boolean;
  navigateBackToMasterRelation?: () => void;
};

const AppBarProfileMenu: React.FC<ProfileMenuProps> = ({
  auth,
  anchorEl,
  isMenuOpen,
  setIsMenuOpen,
  photo,
  isWidget,
  goToUserSpace,
  disconnect,
  controlableMemberList,
  navigateBackToMasterRelation,
  isRelationNavigation,
  navigateToRelationAccount,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['translation', 'consumerSpace']);

  if (auth.authenticated) {
    return (
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        classes={{ paper: classes.popoverAccount }}
      >
        {photo ? (
          <Avatar src={photo} classes={{ root: classes.profilePicTall }} />
        ) : (
          <AccountCircleIcon
            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
            aria-haspopup="true"
            color="disabled"
            classes={{ root: classes.noProfilePicTall }}
          />
        )}
        <Typography className={classes.menuNameTypo} variant="subtitle1">
          {auth.name !== ' ' ? auth.name : auth.username}
        </Typography>
        {auth.name !== ' ' && (
          <Typography variant="body2" className={classes.menuUsernameTypo}>
            {auth.username}
          </Typography>
        )}
        {!isWidget && (
          <Button onClick={goToUserSpace} className={classes.profileButton}>
            {t('consumerSpace:appbar.profile')}
          </Button>
        )}
        <Divider className={classes.dividerProfile} />
        <AppBarNavigationBetweenRelations
          controlableMemberList={controlableMemberList}
          navigateBackToMasterRelation={navigateBackToMasterRelation}
          isRelationNavigation={isRelationNavigation}
          navigateToRelationAccount={navigateToRelationAccount}
        />
        <Button onClick={disconnect} className={classes.disconnectButton}>
          {t('consumerSpace:appbar.logout')}
        </Button>
      </Popover>
    );
  }
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={() => setIsMenuOpen(false)}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  popoverAccount: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '18%',
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(4),
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      minWidth: '25%',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '40%',
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '90%',
    },
  },
  profilePicTall: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  noProfilePicTall: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderRadius: '50%',
  },
  menuNameTypo: {
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
    textAlign: 'center',
  },
  menuUsernameTypo: {
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
    color: theme.palette.grey[600],
    textAlign: 'center',
  },
  profileButton: {
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.8),
    },
    borderRadius: theme.spacing(3),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    margin: theme.spacing(2),
    marginBottom: 0,
  },
  dividerProfile: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  disconnectButton: {
    color: theme.palette.primary.main,
    border: 'solid',
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    borderRadius: theme.spacing(3),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    margin: theme.spacing(2),
  },
}));

export default AppBarProfileMenu;
