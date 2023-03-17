import React from 'react';
import { pure } from 'recompose';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import classNames from 'classnames';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import type { DrawerItem } from './ResponsiveDrawer.component';
import ToolTip from '#components/Tooltip.component';

type ItemWithIconProps = {
  item: DrawerItem;
  iconsOnly: boolean;
  isNested: boolean;
  nbTutorialAlerting: number;
};

const DrawerItemIcon: React.FC<ItemWithIconProps> = ({
  item,
  iconsOnly,
  isNested,
  nbTutorialAlerting,
}) => {
  const classes = useStyles({ iconsOnly });
  if (item?.icon) {
    if (!iconsOnly) {
      return (
        <ListItemIcon
          className={classNames({
            [classes.nestedIcon]: isNested,
            [classes.disabledIconPadding]: iconsOnly,
          })}
        >
          <item.icon {...(nbTutorialAlerting ? { nbTutorialAlerting } : {})} />
        </ListItemIcon>
      );
    }
    return (
      <ToolTip title={item.text} placement="right-start">
        <ListItemIcon
          className={classNames(classes.disabledIconPadding, {
            [classes.nestedIcon]: isNested,
          })}
        >
          <item.icon {...(nbTutorialAlerting ? { nbTutorialAlerting } : {})} />
        </ListItemIcon>
      </ToolTip>
    );
  }
  return null;
};

const useStyles = makeStyles<Theme, { iconsOnly: boolean }>((theme: Theme) => ({
  nestedIcon: {
    marginLeft: ({ iconsOnly }) =>
      iconsOnly ? theme.spacing(0) : theme.spacing(2),
  },
  disabledIconPadding: {
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
}));
export default pure(DrawerItemIcon);
