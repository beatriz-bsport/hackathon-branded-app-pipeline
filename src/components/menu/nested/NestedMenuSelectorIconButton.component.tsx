import React, { useCallback, useState } from 'react';
import chroma from 'chroma-js';
import Immutable from 'seamless-immutable';
import classNames from 'classnames';

import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import ListItem from '@material-ui/core/ListItem';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';

import { MULTIPLE_ACTION_BUTTON_MAX_SIZE } from '#components/menu/constants';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import Tooltip from '#components/Tooltip.component';

import type { MenuAction, NestedMenuAction } from '#components/menu/types';

type StylesProps = { color: string; open: boolean };

type Props = {
  actionList: Immutable.ImmutableArray<NestedMenuAction>;
  customColor?: string;
  customIcon?: string;
  noTextWrap?: boolean;
  tooltipText?: string;
  optionOnClick?: () => void;
};

const NestedMenuSelectorIconButton: React.FC<Props> = ({
  actionList,
  customIcon,
  customColor,
  noTextWrap,
  tooltipText,
  optionOnClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorNestedMenu, setAnchorNestedMenu] = useState<null | HTMLElement>(
    null,
  );

  const classes = useStyles({ color: customColor, open: !!anchorEl });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const current = event.currentTarget;
      event.stopPropagation();
      event.preventDefault();
      optionOnClick?.();
      setAnchorEl(current);
    },
    [optionOnClick],
  );

  const handleRightClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      optionOnClick?.();
    },
    [optionOnClick],
  );

  const handleClickAway = useCallback(
    (event: React.MouseEvent<Document, MouseEvent>) => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(null);
      setAnchorNestedMenu(null);
    },
    [],
  );

  const handleOnClickAction = useCallback(
    (onClick: () => void) => (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();
      onClick?.();
    },
    [],
  );

  const handleOpenNestedMenu = useCallback(
    (nestedActions: Immutable.ImmutableArray<MenuAction>) =>
      (event: React.PointerEvent<HTMLElement>) => {
        const current = event.currentTarget;
        if (nestedActions) {
          setAnchorNestedMenu(current);
        } else setAnchorNestedMenu(null);
      },
    [],
  );

  const handleCloseNestedMenu = useCallback(
    () => setAnchorNestedMenu(null),
    [],
  );

  return (
    <div className={classes.container}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Tooltip title={tooltipText}>
          <ButtonBase
            className={classes.button}
            onClick={handleClick}
            onContextMenu={handleRightClick}
          >
            <CustomMuiIcon
              defaultBackGround
              customColor={customColor || 'black'}
              icon={customIcon || 'MoreVert'}
              withBackground={false}
            />
          </ButtonBase>
        </Tooltip>
      </ClickAwayListener>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        className={classes.menu}
        getContentAnchorEl={null}
        id="main-selector-menu"
        onClose={handleClickAway}
        open={!!anchorEl}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {(actionList ?? ([] as NestedMenuAction[])).map((mainAction, index) => (
          <div>
            <ListItem
              key={`${index}-${mainAction.label}`}
              button
              disabled={actionList.length === 0}
              onClick={handleOnClickAction(mainAction.onClick)}
              onContextMenu={handleRightClick}
              onPointerEnter={handleOpenNestedMenu(mainAction.actionList)}
            >
              <CustomMuiIcon
                defaultBackGround
                customColor={mainAction.customColor || customColor}
                icon={mainAction.icon}
                withBackground={false}
              />
              <Typography
                className={classNames(
                  classes.label,
                  noTextWrap && classes.noTextWrap,
                )}
                variant="body1"
              >
                {mainAction.label}
              </Typography>
              {!!mainAction.actionList && <ChevronRight />}
            </ListItem>
            <Popper
              transition
              anchorEl={anchorNestedMenu}
              className={classes.menuContainer}
              disablePortal={false}
              onPointerLeave={handleCloseNestedMenu}
              open={!!anchorNestedMenu}
              placement="right-start"
            >
              {({ TransitionProps }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: 'left top' }}
                >
                  <Paper elevation={3}>
                    <MenuList id="nested-menu-choices" variant="menu">
                      {!!mainAction.actionList &&
                        (mainAction.actionList ?? []).map(
                          (nestedAction, idx) => (
                            <MenuItem
                              key={`${idx}-${nestedAction.label}`}
                              onClick={handleOnClickAction(
                                nestedAction.onClick,
                              )}
                            >
                              <CustomMuiIcon
                                defaultBackGround
                                customColor={
                                  nestedAction.customColor || customColor
                                }
                                icon={nestedAction.icon}
                                withBackground={false}
                              />
                              <Typography
                                className={classes.label}
                                variant="body1"
                              >
                                {nestedAction.label}
                              </Typography>
                            </MenuItem>
                          ),
                        )}
                    </MenuList>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        ))}
      </Menu>
    </div>
  );
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  container: {
    display: 'flex',
    borderRadius: theme.spacing(1),
  },
  button: {
    display: 'absolute',
    borderRadius: theme.spacing(1),
    width: MULTIPLE_ACTION_BUTTON_MAX_SIZE,
    height: MULTIPLE_ACTION_BUTTON_MAX_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ({ open, color }) =>
      open &&
      chroma(color || 'black')
        .alpha(0.15)
        .hex(),
    '&:hover': {
      backgroundColor: ({ color }) =>
        chroma(color || 'black')
          .alpha(0.06)
          .hex(),
    },
  },
  label: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  noTextWrap: {
    textWrap: 'nowrap',
  },
  menuContainer: {
    marginLeft: theme.spacing(0.5),
    zIndex: 1500,
  },
  menu: {
    marginTop: '4px',
  },
}));

export default React.memo(NestedMenuSelectorIconButton);
