import React, { useCallback, useState } from 'react';
import Immutable from 'seamless-immutable';

import { type Theme, makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import { Action } from './MultipleActionsButton.component';

export const MULTIPLE_ACTION_BUTTON_MAX_SIZE = '32px';

export type Props = {
  actionList: Immutable.ImmutableArray<Action>;
  children: React.ReactElement;
  customColor?: string;
  customHoverBackgrondColor?: string;
  informationText?: string;
  optionOnClick?: () => void;
};

const MultipleActionsRightButton: React.FC<Props> = ({
  actionList,
  children,
  customColor,
  customHoverBackgrondColor,
  informationText,
  optionOnClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const classes = useStyles({ customHoverBackgrondColor });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      optionOnClick?.();
      setAnchorEl(event.currentTarget);
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
      </Menu>
    </div>
  );
};

const useStyles = makeStyles<Theme, Pick<Props, 'customHoverBackgrondColor'>>(
  (theme) => ({
    container: {
      display: 'flex',
      borderRadius: theme.spacing(1),
    },
    menuItem: {
      display: 'flex',
      gap: theme.spacing(3),
      '&:hover': {
        backgroundColor: ({ customHoverBackgrondColor }) =>
          customHoverBackgrondColor,
      },
    },
    labelInfo: {
      opacity: '1 !important',
      paddingBottom: theme.spacing(1),
    },
  }),
);

export default React.memo(MultipleActionsRightButton);
