import React, { useCallback } from 'react';
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
import type {
  DrawerItem,
  DrawerItemDefault,
  DrawerItemDivider,
  DrawerItemNested,
} from './ResponsiveDrawer.component';
import { checkRequiredPermissionsForPath } from '#libs/role/utils';
import { RolePermission, ProtectedUrls } from '#libs/role/types';
import DrawerListItem from './ResponsiveDrawerListItem.component';
import ResponsiveDrawerListItemIcon from './DrawerListItemIcon.component';

type WrapperProp = {
  item: DrawerItemDefault;
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
  handleToggle: (idx: number, item: DrawerItem) => () => void;

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

  const currentPath = location?.pathname ?? '';

  /**
   * Determines if a given DrawerItem should be highlighted as active based on the current URL path.
   * If the DrawerItem has inner tabs, the last part of the URL path is removed before checking.
   *
   * For example, if the current URL path is `<url>/booking/1234`, and the DrawerItem has
   * inner tabs, it will be highlighted as active since its `to` property starts with `<url>/booking`.
   *
   * @param _item The DrawerItem to check.
   * @returns A boolean indicating whether the DrawerItem should be highlighted as active.
   */
  const urlPatternMatch = useCallback(
    (_item: DrawerItemDefault) => {
      const pattern = _item?.hasInnerTabs
        ? _item.to.replace(/\/[^/]+$/g, '')
        : _item.to;
      return currentPath.startsWith(pattern);
    },
    [currentPath],
  );

  const hasAnActiveNestedItem = (item as DrawerItemNested)?.nestedItems?.some(
    (_item) => urlPatternMatch(_item),
  );

  // We want this effect to only run once when the component is mounted in order to
  // toggle the correct item if the current path refers to a nested item.
  React.useEffect(() => {
    if (hasAnActiveNestedItem) handleToggle(i, item)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    !checkRequiredPermissionsForPath(
      (item as DrawerItemDefault)?.to as ProtectedUrls,
      permissions,
    )
  ) {
    return null;
  }
  if ((item as DrawerItemNested)?.nestedItems) {
    if (
      !(item as DrawerItemNested)?.nestedItems.some(
        (_item) =>
          _item.to &&
          checkRequiredPermissionsForPath(
            _item.to as ProtectedUrls,
            permissions,
          ),
      )
    ) {
      return null;
    }
  }

  const isActive =
    urlPatternMatch(item as DrawerItemDefault) || hasAnActiveNestedItem;

  if ((item as DrawerItemNested).type === 'nested') {
    return (
      <React.Fragment key={(item as DrawerItemNested).text}>
        <ListItem
          button
          dense={isNested}
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
                id={(item as DrawerItemDefault)?.id}
                primary={(item as DrawerItemDefault | DrawerItemNested)?.text}
                secondary={
                  (item as DrawerItemDefault | DrawerItemNested)?.subtext
                }
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
            {(item as DrawerItemNested)?.nestedItems.map(
              (subitem, subi: number) => (
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
              ),
            )}
          </List>
        </Collapse>
        {toggledMenu[i] ? <Divider key={`${i}-second-nestedDivider`} /> : null}
      </React.Fragment>
    );
  }
  if ((item as DrawerItemDivider)?.type === 'divider') {
    return <Divider key={i} className={item?.className} />;
  }

  return (
    <Wrapper
      key={(item as DrawerItemDefault).text}
      i={i}
      item={item as DrawerItemDefault}
    >
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
