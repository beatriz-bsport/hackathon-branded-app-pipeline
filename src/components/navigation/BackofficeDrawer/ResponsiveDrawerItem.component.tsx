// @ts-nocheck
import React from 'react';
import { pure } from 'recompose';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Collapse from '@material-ui/core/Collapse';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { colors } from '@bsport/common/lib/colors';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import type { DrawerItem } from './ResponsiveDrawer.component';
import { checkRequiredPermissionsForPath } from '../../../libs/role/utils';
import { RolePermission } from '#libs/role/types';
import DrawerListItem from './ResponsiveDrawerListItem.component';
import ResponsiveDrawerListItemIcon from './DrawerListItemIcon.component';

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
          className={item.className || ''}
          style={{ textDecoration: 'none' }}
          to={item.to}
        >
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  }
}

type Props = {
  item: DrawerItem;
  i: number;
  isNested?: boolean;
  permissions: RolePermission;
  location: Location;
  handleToggle: (idx: number, item: DrawerItem) => void;

  toggledMenu: Record<number, boolean>;
  onMenuItemClick: () => void;
  nbTutorialAlerting: number;
  userAcknowlegdePlatformTutorial: boolean | undefined;
  updateUserAcknowlegdeTutorial?: () => void;
  tutorialDialogOpen: boolean;
  iconsOnly: boolean;
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
  iconsOnly,
}) => {
  const classes = useStyles({ iconsOnly });

  const currentPath = location.pathname;
  const hasAnActiveNestedItem = item?.nestedItems?.some((_item) =>
    currentPath.startsWith(_item.to),
  );

  // We want this effect to only run once when the component is mounted in order to
  // toggle the correct item if the current path refers to a nested item.
  React.useEffect(() => {
    if (hasAnActiveNestedItem) handleToggle(i, item)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const isActive = currentPath.startsWith(item.to) || hasAnActiveNestedItem;

  if (item.type === 'nested') {
    return (
      <React.Fragment key={item.text}>
        <ListItem
          button
          dense={item?.dense || isNested}
          id="button_menu_item"
          onClick={handleToggle(i, item)}
          selected={isActive}
        >
          <ResponsiveDrawerListItemIcon
            iconsOnly={iconsOnly}
            isNested={isNested}
            item={item}
            nbTutorialAlerting={nbTutorialAlerting}
          />

          {!iconsOnly && (
            <>
              <ListItemText
                id={item?.id}
                primary={item?.text}
                secondary={item?.subtext}
                secondaryTypographyProps={{
                  style: { color: colors.primaryDark },
                }}
              />
              {toggledMenu[i] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </>
          )}
        </ListItem>
        <Collapse
          key={`${i}-collapse`}
          unmountOnExit
          in={toggledMenu[i]}
          timeout="auto"
        >
          <List disablePadding className={classes.nestedList}>
            {item?.nestedItems.map((subitem: DrawerItem, subi: number) => (
              <DrawerItemComponent
                key={`responsive_drawer_item_nested${subi}`}
                isNested
                handleToggle={handleToggle}
                i={subi}
                iconsOnly={iconsOnly}
                item={subitem}
                location={location}
                nbTutorialAlerting={nbTutorialAlerting}
                onMenuItemClick={onMenuItemClick}
                permissions={permissions}
                toggledMenu={toggledMenu}
                tutorialDialogOpen={tutorialDialogOpen}
                updateUserAcknowlegdeTutorial={updateUserAcknowlegdeTutorial}
                userAcknowlegdePlatformTutorial={
                  userAcknowlegdePlatformTutorial
                }
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
    <Wrapper key={item.text} i={i} item={item}>
      <DrawerListItem
        iconsOnly={iconsOnly}
        isActive={isActive}
        isNested={isNested}
        item={item}
        nbTutorialAlerting={nbTutorialAlerting}
        onMenuItemClick={onMenuItemClick}
        toggledMenu={toggledMenu}
        tutorialDialogOpen={tutorialDialogOpen}
        updateUserAcknowlegdeTutorial={updateUserAcknowlegdeTutorial}
        userAcknowlegdePlatformTutorial={userAcknowlegdePlatformTutorial}
      />
    </Wrapper>
  );
};

const useStyles = makeStyles<Theme, { iconsOnly: boolean }>((theme: Theme) => ({
  nestedList: {
    backgroundColor: '#F8F8F8',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  nestedItem: {
    width: '100%',
  },
}));
export default pure(DrawerItemComponent);
