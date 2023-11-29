import React, { useCallback, useState } from 'react';
import Immutable from 'seamless-immutable';

import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import type { MenuAction } from '#components/menu/types';

export type Props = {
  actionList: Immutable.ImmutableArray<MenuAction> | MenuAction[];
  children: React.ReactElement;
  customColor?: string;
  customHoverBackgroundColor?: string;
  informationText?: string;
  optionOnClick?: () => void;
};

const MenuSelectorCustomButton: React.FC<Props> = ({
  actionList,
  children,
  customColor,
  customHoverBackgroundColor,
  informationText,
  optionOnClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const classes = useStyles({ customHoverBackgroundColor });

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

  return (
    <div className={classes.container}>
      <ClickAwayListener onClickAway={handleClickAway}>
        {React.cloneElement(children, { onClick: handleClick })}
      </ClickAwayListener>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        getContentAnchorEl={null}
        id="action-menu"
        onClose={handleClickAway}
        open={!!anchorEl}
        PaperProps={{
          style: {
            marginLeft: 4,
          },
        }}
      >
        <div>
          {!!informationText && informationText.length > 0 && (
            <>
              <MenuItem key="text-info" disabled className={classes.labelInfo}>
                <Typography variant="body1">{informationText}</Typography>
              </MenuItem>
              <Divider />
            </>
          )}
          {actionList.map((action, index) => (
            <MenuItem
              key={`${index}${action.label}`}
              className={classes.menuItem}
              onClick={handleOnClickAction(action.onClick)}
              onContextMenu={handleRightClick}
              value={action.label}
            >
              <CustomMuiIcon
                defaultBackGround
                customColor={action.customColor || customColor}
                icon={action.icon}
                withBackground={false}
              />
              <Typography variant="body1">{action.label}</Typography>
            </MenuItem>
          ))}
        </div>
      </Menu>
    </div>
  );
};

const useStyles = makeStyles<Theme, Pick<Props, 'customHoverBackgroundColor'>>(
  (theme) => ({
    container: {
      display: 'flex',
      borderRadius: theme.spacing(1),
    },
    menuItem: {
      display: 'flex',
      gap: theme.spacing(3),
      '&:hover': {
        backgroundColor: ({ customHoverBackgroundColor }) =>
          customHoverBackgroundColor,
      },
    },
    labelInfo: {
      opacity: '1 !important',
      paddingBottom: theme.spacing(1),
    },
  }),
);

export default React.memo(MenuSelectorCustomButton);
