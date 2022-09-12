import React from 'react';
import { pure } from 'recompose';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import classNames from 'classnames';
import Collapse from '@material-ui/core/Collapse';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { colors } from '@bsport/common/lib/colors';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { Alert } from '@material-ui/lab';
import Popper from '@material-ui/core/Popper';
import { Typography } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import type { DrawerItem } from './ResponsiveDrawer.component';
import { checkRequiredPermissionsForPath } from '../../../libs/role/utils';
import { Permission } from '#libs/role/types';
import TutorialIconWithAlertings from '#libs/platform-tutorial/components/TutorialIconWithAlertings.component';

type Props = {
  item: DrawerItem;
  i: number;
  isNested?: boolean;
  permissions: Permission;
  location: Location;
  handleToggle: (idx: number) => void;

  toggledMenu: Record<number, boolean>;
  onMenuItemClick: () => void;
  nbTutorialAlerting: number;
  userAcknowlegdePlatformTutorial: boolean | undefined;
  updateUserAcknowlegdeTutorial?: () => void;
  tutorialDialogOpen: boolean;
};

type WrapperProp = {
  item: DrawerItem;
  i: number;
};
class Wrapper extends React.PureComponent<WrapperProp> {
  render() {
    const { item, i, children } = this.props;

    if (item?.to) {
      return (
        <Link
          key={i}
          to={item.to}
          style={{ textDecoration: 'none' }}
          className={item.className || ''}
        >
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  }
}

type DrawerListItemProps = {
  item: DrawerItem;
  isNested?: boolean;
  onMenuItemClick: () => void;
  nbTutorialAlerting: number;
  isActive: boolean;
  toggledMenu: Record<number, boolean>;
  userAcknowlegdePlatformTutorial: boolean | undefined;
  updateUserAcknowlegdeTutorial?: () => void;
  tutorialDialogOpen: boolean;
};
const DrawerListItem: React.FC<DrawerListItemProps> = ({
  item,
  onMenuItemClick,
  isNested,
  nbTutorialAlerting,
  isActive,
  toggledMenu,
  userAcknowlegdePlatformTutorial,
  updateUserAcknowlegdeTutorial,
  tutorialDialogOpen,
}) => {
  const { t } = useTranslation('navigation');
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const itemRef = React.useRef(null);
  React.useEffect(() => {
    setAnchorEl(itemRef.current);
  }, [itemRef, toggledMenu, isActive]);
  const openPop = Boolean(anchorEl);

  const id = openPop ? 'simple-popover' : undefined;
  const handleUpdateUserAcknowlegdeTutorial = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.stopPropagation();
    updateUserAcknowlegdeTutorial();
  };
  return (
    <div
      className={classNames({
        [classes.relativeDiv]: item.icon === TutorialIconWithAlertings,
      })}
    >
      <ListItem
        button
        onClick={() => {
          item.action && item.action();
          onMenuItemClick();
        }}
        dense={item.dense || isNested}
        selected={isActive}
        className={classNames({
          [classes.nestedItem]: isNested,
        })}
        ref={item.icon === TutorialIconWithAlertings ? itemRef : null}
        aria-describedby={id}
      >
        {item.icon ? (
          <ListItemIcon
            className={classNames({ [classes.nestedIcon]: isNested })}
          >
            <item.icon nbTutorialAlerting={nbTutorialAlerting} />
          </ListItemIcon>
        ) : null}

        <ListItemText
          id={item.id}
          primary={item.text}
          primaryTypographyProps={{
            style: { color: 'initial' },
          }}
          secondary={item.subtext}
          secondaryTypographyProps={{ style: { color: colors.primaryDark } }}
        />
      </ListItem>
      <Hidden smDown>
        {item.icon === TutorialIconWithAlertings &&
        updateUserAcknowlegdeTutorial &&
        !tutorialDialogOpen ? (
          <Popper
            id={id}
            open={!userAcknowlegdePlatformTutorial}
            anchorEl={anchorEl}
            placement="right"
            className={classes.customPoper}
          >
            <Alert
              className={classNames(classes.alert, classes.customPoper)}
              variant="filled"
              severity="info"
            >
              <div className={classes.alertContent}>
                <Typography variant="body2">
                  {t('backofficeMenu.tutorialInfo')}
                </Typography>
                <IconButton onClick={handleUpdateUserAcknowlegdeTutorial}>
                  <ClearIcon className={classes.alertIcon} />
                </IconButton>
              </div>
            </Alert>
          </Popper>
        ) : null}
      </Hidden>
    </div>
  );
};

export const DrawerItemComponent: React.FC<Props> = ({
  item,
  i,
  isNested,
  permissions,
  location,
  handleToggle,
  toggledMenu,
  onMenuItemClick,
  nbTutorialAlerting,
  userAcknowlegdePlatformTutorial,
  updateUserAcknowlegdeTutorial,
  tutorialDialogOpen,
}) => {
  const classes = useStyles();

  const isActive = location.pathname.startsWith(item.to);

  if (!checkRequiredPermissionsForPath(item?.to, permissions)) {
    return null;
  }
  if (item?.nestedItems) {
    if (
      !item?.nestedItems.some(
        (_item) =>
          _item.to && checkRequiredPermissionsForPath(_item?.to, permissions),
      )
    ) {
      return null;
    }
  }

  if (item.type === 'nested') {
    return (
      <React.Fragment key={item.text}>
        <ListItem
          id="button_menu_item"
          button
          onClick={handleToggle(i)}
          selected={isActive}
        >
          {item?.icon && (
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
          )}
          <ListItemText
            id={item?.id}
            primary={item?.text}
            secondary={item?.subtext}
            secondaryTypographyProps={{
              style: { color: colors.primaryDark },
            }}
          />
          {toggledMenu[i] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse
          in={toggledMenu[i]}
          key={`${i}-collapse`}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding className={classes.nestedList}>
            {item?.nestedItems.map((subitem: DrawerItem, subi: number) => (
              <DrawerItemComponent
                key={`responsive_drawer_item_nested${subi}`}
                item={subitem}
                i={subi}
                permissions={permissions}
                location={location}
                handleToggle={handleToggle}
                toggledMenu={toggledMenu}
                onMenuItemClick={onMenuItemClick}
                nbTutorialAlerting={nbTutorialAlerting}
                userAcknowlegdePlatformTutorial={
                  userAcknowlegdePlatformTutorial
                }
                updateUserAcknowlegdeTutorial={updateUserAcknowlegdeTutorial}
                tutorialDialogOpen={tutorialDialogOpen}
              />
            ))}
          </List>
        </Collapse>
        {toggledMenu[i] ? <Divider key={`${i}-second-nestedDivider`} /> : null}
      </React.Fragment>
    );
  }
  if (item?.type === 'divider') {
    return <Divider key={i} className={item?.className} />;
  }

  return (
    <Wrapper item={item} i={i} key={item.text}>
      <DrawerListItem
        item={item}
        onMenuItemClick={onMenuItemClick}
        isNested={isNested}
        nbTutorialAlerting={nbTutorialAlerting}
        isActive={isActive}
        toggledMenu={toggledMenu}
        userAcknowlegdePlatformTutorial={userAcknowlegdePlatformTutorial}
        updateUserAcknowlegdeTutorial={updateUserAcknowlegdeTutorial}
        tutorialDialogOpen={tutorialDialogOpen}
      />
    </Wrapper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  scrollable: {
    overflow: 'auto',
    paddingRight: 50,
    marginRight: -50,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    justifyContent: 'space-between',
  },
  logo: {
    alignItems: 'center',
    justify: 'center',
  },
  nestedList: {
    backgroundColor: '#F8F8F8',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  nestedItem: {
    width: '100%',
  },
  nestedIcon: {
    marginLeft: theme.spacing(2),
  },
  menuMobile: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  relativeDiv: {
    position: 'relative',
  },
  redBackGround: {
    backgroundColor: 'red',
  },

  customPoper: {
    zIndex: 100000,
    paddingLeft: theme.spacing(2),
  },
  absoluteDiv: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  alert: {
    alignItems: 'center',
    width: '400px',
  },
  alertContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    color: 'white',
  },
}));
export default pure(DrawerItemComponent);
