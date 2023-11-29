import React from 'react';
import Immutable from 'seamless-immutable';

import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import type { MenuAction } from '#components/menu/types';

type Props = {
  anchorElement: HTMLDivElement | null;
  actionList: Immutable.ImmutableArray<MenuAction> | MenuAction[];
  customColor?: string;
  customHoverBackgroundColor?: string;
  informationText?: string;
  onClose?: (event: React.MouseEvent) => void;
};

const MenuSelectorOnly: React.FC<Props> = ({
  anchorElement,
  actionList,
  customColor,
  customHoverBackgroundColor,
  informationText,
  onClose,
}) => {
  const classes = useStyles({ customHoverBackgroundColor });

  return (
    <div className={classes.container}>
      <Menu
        anchorEl={anchorElement}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        getContentAnchorEl={null}
        id="action-menu"
        onClose={onClose}
        open={!!anchorElement}
        PaperProps={{
          style: {
            marginLeft: 4,
          },
        }}
      >
        <div>
          {!!informationText && (
            <>
              <MenuItem key="text-info" disabled className={classes.labelInfo}>
                <Typography variant="body1">{informationText}</Typography>
              </MenuItem>
              <Divider />
            </>
          )}
          {actionList.map((action, index) => (
            <MenuItem
              key={`${index}-${action.label}`}
              className={classes.menuItem}
              onClick={action.onClick}
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

export default React.memo(MenuSelectorOnly);
