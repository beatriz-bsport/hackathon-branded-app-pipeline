import React from 'react';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { MenuItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { ImmutableArray } from 'seamless-immutable';

export type ActionOption = {
  menuItemComponent?: any;
  iconButtonComponent?: any;
  onClick?: () => void;
  label: string;
  color?: 'primary' | 'secondary' | 'inherit';
  icon?: any;
  disabled?: boolean;
};

type Props = {
  actions: ImmutableArray<ActionOption> | ActionOption[];
};

// ------------------------ Menu handler ---------------------

export const ListItemResponsiveAction: React.FC<Props> = ({ actions }) => {
  const filteredActions = actions?.filter((action) => !!action) ?? [];

  if (filteredActions.length === 0) {
    return null;
  }

  if (filteredActions.length === 1) {
    return <ShortMenu actions={filteredActions} />;
  }

  return (
    <div>
      <Hidden xsDown>
        <ShortMenu actions={filteredActions} />
      </Hidden>
      <Hidden smUp>
        <HiddenShortMenu actions={filteredActions} />
      </Hidden>
    </div>
  );
};

// ------------------------ Explicit Menu --------------------------------------

const ShortMenu: React.FC<Props> = React.memo(({ actions }) => {
  const clickableActionsWithoutButtonComponent = React.useMemo(() => {
    return (
      actions?.filter(
        (action) => !!action.onClick && !action.iconButtonComponent,
      ) ?? []
    );
  }, [actions]);

  const clickableActionsWithButtonComponent = React.useMemo(() => {
    return (
      actions?.filter(
        (action) => !!action.onClick && !!action.iconButtonComponent,
      ) ?? []
    );
  }, [actions]);
  return (
    <div
      id="shortMenuContainer"
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      {clickableActionsWithoutButtonComponent.map((option) => (
        <ShortMenuIconButton action={option} />
      ))}
      {clickableActionsWithButtonComponent.map((option) => (
        <ShortMenuCustomButton action={option} />
      ))}
    </div>
  );
});

const ShortMenuIconButton: React.FC<{ action: ActionOption }> = React.memo(
  ({ action }) => {
    const handleClick = React.useCallback(
      (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ev.stopPropagation();
        ev.preventDefault();
        action.onClick();
      },
      [action],
    );
    return (
      <IconButton
        key={action.label}
        color={action.color}
        disabled={action.disabled}
        onClick={handleClick}
      >
        <action.icon />
      </IconButton>
    );
  },
);

const ShortMenuCustomButton: React.FC<{ action: ActionOption }> = React.memo(
  ({ action }) => {
    const handleClick = React.useCallback(() => {
      action.onClick();
    }, [action]);
    return (
      <action.iconButtonComponent
        key={action.label}
        color={action.color}
        disabled={action.disabled}
        onClick={handleClick}
      />
    );
  },
);

// ------------------------Hidden  Menu -----------------------------
const ITEM_HEIGHT = 48;

const HiddenShortMenuItem: React.FC<{
  action: ActionOption;
  setAnchorEl: React.Dispatch<React.SetStateAction<EventTarget & HTMLElement>>;
}> = React.memo(({ action, setAnchorEl }) => {
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();
      action.onClick();
      setAnchorEl(null);
    },
    [action, setAnchorEl],
  );
  return (
    <MenuItem
      key={action.label}
      disabled={action.disabled}
      onClick={handleClick}
    >
      {!!action.icon && (
        <ListItemIcon>
          <action.icon color={action.color} />
        </ListItemIcon>
      )}
      <Typography>{action.label}</Typography>
    </MenuItem>
  );
});

const HiddenShortMenuActionItem: React.FC<{
  action: ActionOption;
  setAnchorEl: React.Dispatch<React.SetStateAction<EventTarget & HTMLElement>>;
}> = React.memo(({ action, setAnchorEl }) => {
  const handleClick = React.useCallback(() => {
    action.onClick();
    setAnchorEl(null);
  }, [action, setAnchorEl]);

  return (
    <action.menuItemComponent color={action.color} onClick={handleClick} />
  );
});

export const HiddenShortMenu: React.FC<Props> = React.memo(({ actions }) => {
  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & HTMLElement) | null
  >(null);
  const open = Boolean(anchorEl);

  const handleClickOnIconButton = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleClose = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(null);
    },
    [],
  );

  if (
    !actions.filter((action) => !!action.onClick || !!action.menuItemComponent)
      .length
  ) {
    return null;
  }
  return (
    <div>
      <IconButton
        aria-controls="long-menu"
        aria-haspopup="true"
        aria-label="more"
        onClick={handleClickOnIconButton}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        id="short-menu"
        onClose={handleClose}
        open={open}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {actions
          .filter((action) => !!action.onClick && !action.menuItemComponent)
          .map((option) => (
            <HiddenShortMenuItem action={option} setAnchorEl={setAnchorEl} />
          ))}
        {actions
          .filter((action) => !!action.menuItemComponent)
          .map((option) => (
            <HiddenShortMenuActionItem
              action={option}
              setAnchorEl={setAnchorEl}
            />
          ))}
      </Menu>
    </div>
  );
});

export default React.memo(ListItemResponsiveAction);
