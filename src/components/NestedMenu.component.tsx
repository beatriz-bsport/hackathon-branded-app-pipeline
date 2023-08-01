import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { ChevronRight } from '@material-ui/icons';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';

type NestedListProps = {
  dataRecord: Record<string, Array<string>>;
  onItemClick?: (itemValue: any) => void;
  anchorElMenu?: Element;
  handleCloseMenu: () => void;
  forTagsSelector?: boolean;
};

const NestedMenu = (props: NestedListProps) => {
  const { anchorElMenu, forTagsSelector } = props;
  const [toggledMenu, setToggledMenu] = useState<Record<string, Element>>({});
  const dataRecord = props.dataRecord ?? {};
  const numberLists = Object.keys(dataRecord).length;
  const handleToggle = (i: string) => (event: React.MouseEvent) => {
    const newToggledMenu = {
      [i]: toggledMenu?.[i] ? null : event.currentTarget,
    };
    setToggledMenu(newToggledMenu);
  };
  const handleClose = () => {
    setToggledMenu({});
  };
  const handleCloseMenu = () => {
    handleClose();
    props.handleCloseMenu();
  };
  const onItemClick = (itemValue: any) => {
    props.onItemClick(itemValue);
    handleCloseMenu();
  };
  const { t } = useTranslation(['notificationRule']);

  return (
    <Menu
      keepMounted
      anchorEl={anchorElMenu}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      getContentAnchorEl={null}
      id="nested-menu"
      MenuListProps={{
        disablePadding: true,
      }}
      onClose={handleCloseMenu}
      open={Boolean(anchorElMenu)}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      {Object.keys(dataRecord).map((sublistName) => (
        <NestedItem
          key={sublistName}
          categoryName={sublistName}
          forTagsSelector={forTagsSelector}
          handleClose={handleClose}
          handleToggle={handleToggle(sublistName)}
          listData={dataRecord[sublistName]}
          name={forTagsSelector ? t(`tag.${sublistName}.name`) : sublistName}
          onItemClick={onItemClick}
          target={toggledMenu[sublistName]}
          withDivider={
            Object.keys(dataRecord).indexOf(sublistName) < numberLists - 1
          }
        />
      ))}
    </Menu>
  );
};

type NestedItemProps = {
  name: string;
  categoryName: string;
  listData: string[];
  handleToggle: (event: React.MouseEvent) => void;
  handleClose: () => void;
  onItemClick: (value: any) => void;
  target: Element;
  withDivider: boolean;
  forTagsSelector?: boolean;
};

const NestedItem = (props: NestedItemProps) => {
  const classes = useStyles();
  const {
    name,
    listData,
    target,
    handleToggle,
    handleClose,
    onItemClick,
    withDivider,
    forTagsSelector,
    categoryName,
  } = props;
  const { t } = useTranslation('notificationRule');
  return (
    <div className={classes.listItemContainer}>
      <ListItem
        key={categoryName}
        // onClick={handleToggle} --> On Mobile, the onPointerEnter seems to trigger it too (on browser)
        button
        className={classes.listItem}
        disabled={listData.length === 0}
        onPointerEnter={handleToggle}
      >
        <ListItemText>{name}</ListItemText>
        <ListItemIcon className={classes.listItemIcon}>
          <ChevronRight />
        </ListItemIcon>
      </ListItem>
      {withDivider && <Divider variant="fullWidth" />}
      <Popper
        transition
        anchorEl={target}
        className={classes.menuContainer}
        disablePortal={false}
        onPointerLeave={handleClose}
        open={Boolean(target)}
        placement="right-end"
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'left bottom' }}>
            <Paper>
              <MenuList id={`menu-${categoryName}`} variant="menu">
                {listData.map((itemName) => (
                  <MenuItem
                    onClick={() => {
                      onItemClick(itemName);
                      handleClose();
                    }}
                  >
                    {forTagsSelector
                      ? t(`tag.${categoryName}.tags.${itemName}`)
                      : itemName}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(1),
  },
  listItemIcon: {
    justifyContent: 'flex-end',
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuContainer: {
    marginLeft: theme.spacing(0.5),
    zIndex: 1500,
  },
}));

export default NestedMenu;
