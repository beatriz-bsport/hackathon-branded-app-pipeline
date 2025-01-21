import React from 'react';
import { pure } from 'recompose';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import clsx from 'clsx';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ToolTip from '#src/components/Tooltip.component';
import type { DrawerItem } from './ResponsiveDrawer.component';

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
  // @ts-expect-error
  if (item?.icon) {
    if (!iconsOnly) {
      return (
        <ListItemIcon
          className={clsx({
            [classes.nestedIcon]: isNested,
            [classes.disabledIconPadding]: iconsOnly,
          })}
        >
          {/* @ts-expect-error */}
          <item.icon {...(nbTutorialAlerting ? { nbTutorialAlerting } : {})} />
        </ListItemIcon>
      );
    }
    return (
      // @ts-expect-error
      <ToolTip placement="right-start" title={item.text}>
        <ListItemIcon
          className={clsx(classes.disabledIconPadding, {
            [classes.nestedIcon]: isNested,
          })}
        >
          {/* @ts-expect-error */}
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
