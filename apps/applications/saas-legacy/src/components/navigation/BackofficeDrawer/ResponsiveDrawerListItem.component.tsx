import React from 'react';
import { pure } from 'recompose';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import clsx from 'clsx';
import { colors } from '@bsport/common/lib/colors.js';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { Alert } from '@material-ui/lab';
import Popper from '@material-ui/core/Popper';
import { Typography } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import TutorialIconWithAlertings from '#src/libs/platform-tutorial/components/TutorialIconWithAlertings.component';
import { BADGE_STYLES } from './badge-styles';
import type {
  DrawerItem,
  DrawerItemDefault,
} from './ResponsiveDrawer.component';
import DrawerListItemIcon from './DrawerListItemIcon.component';

// Type guard for items with badges
const hasBadge = (
  item: DrawerItem,
): item is DrawerItemDefault & { badge: string } => {
  return (
    'badge' in item && typeof (item as DrawerItemDefault).badge === 'string'
  );
};

// Type guard for items with openInNewTab
const hasOpenInNewTab = (
  item: DrawerItem,
): item is DrawerItemDefault & { openInNewTab: true } => {
  return (
    'openInNewTab' in item && (item as DrawerItemDefault).openInNewTab === true
  );
};

type DrawerListItemProps = {
  item: DrawerItem;
  isNested?: boolean;
  onMenuItemClick: () => void;
  nbTutorialAlerting: number;
  isActive: boolean;
  toggledMenu: Record<number, boolean>;
  userAcknowlegdePlatformTutorial: boolean | undefined;
  updateUserAcknowlegdeTutorial?: () => void;
  tutorialDialogOpen: boolean;
  iconsOnly?: boolean;
};
const DrawerListItem: React.FC<DrawerListItemProps> = ({
  item,
  onMenuItemClick,
  isNested,
  nbTutorialAlerting,
  isActive,
  toggledMenu,
  userAcknowlegdePlatformTutorial,
  updateUserAcknowlegdeTutorial,
  tutorialDialogOpen,
  iconsOnly,
}) => {
  const { t } = useTranslation('navigation');
  const classes = useStyles({ iconsOnly: iconsOnly ?? false });
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const itemRef = React.useRef(null);
  React.useEffect(() => {
    setAnchorEl(itemRef.current);
  }, [itemRef, toggledMenu, isActive]);
  const openPop = Boolean(anchorEl);

  const id = openPop ? 'simple-popover' : undefined;
  const handleUpdateUserAcknowlegdeTutorial = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.stopPropagation();
    if (updateUserAcknowlegdeTutorial) {
      updateUserAcknowlegdeTutorial();
    }
  };
  return (
    <div
      className={clsx({
        // @ts-expect-error
        [classes.relativeDiv]: item.icon === TutorialIconWithAlertings,
      })}
    >
      <ListItem
        // @ts-expect-error
        ref={item.icon === TutorialIconWithAlertings ? itemRef : null}
        button
        aria-describedby={id}
        className={clsx({
          [classes.nestedItem]: isNested,
        })}
        // @ts-expect-error
        dense={item.dense || isNested}
        onClick={() => {
          // @ts-expect-error
          item.action && item.action();
          onMenuItemClick();
        }}
        selected={isActive}
      >
        <DrawerListItemIcon
          iconsOnly={iconsOnly ?? false}
          isNested={isNested ?? false}
          item={item}
          nbTutorialAlerting={nbTutorialAlerting}
        />

        {!iconsOnly && (
          <ListItemText
            id={(item as DrawerItemDefault).id}
            primary={
              <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                width="100%"
              >
                <span>{(item as DrawerItemDefault).text}</span>
                {hasBadge(item) && (
                  <Chip
                    label={item.badge}
                    size="small"
                    style={BADGE_STYLES.NEW_BADGE}
                  />
                )}
              </Box>
            }
            primaryTypographyProps={{
              style: { color: 'initial' },
            }}
            secondary={(item as DrawerItemDefault).subtext}
            secondaryTypographyProps={{ style: { color: colors.primaryDark } }}
          />
        )}

        {hasOpenInNewTab(item) && <OpenInNewIcon color="disabled" />}
      </ListItem>
      <Hidden smDown>
        {/* @ts-expect-error */}
        {item.icon === TutorialIconWithAlertings &&
        updateUserAcknowlegdeTutorial &&
        !tutorialDialogOpen ? (
          <Popper
            anchorEl={anchorEl}
            className={classes.customPoper}
            id={id}
            open={!userAcknowlegdePlatformTutorial}
            placement="right"
          >
            <Alert
              className={clsx(classes.alert, classes.customPoper)}
              severity="info"
              variant="filled"
            >
              <div className={classes.alertContent}>
                <Typography variant="body2">
                  {t('backofficeMenu.tutorialInfo')}
                </Typography>
                <IconButton onClick={handleUpdateUserAcknowlegdeTutorial}>
                  <ClearIcon className={classes.alertIcon} />
                </IconButton>
              </div>
            </Alert>
          </Popper>
        ) : null}
      </Hidden>
    </div>
  );
};

const useStyles = makeStyles<Theme, { iconsOnly: boolean }>((theme: Theme) => ({
  toolbar: theme.mixins.toolbar,
  nestedList: {
    backgroundColor: '#F8F8F8',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  nestedItem: {
    width: '100%',
  },
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
  relativeDiv: {
    position: 'relative',
  },
  customPoper: {
    zIndex: 100000,
    paddingLeft: theme.spacing(2),
  },
  alert: {
    alignItems: 'center',
    width: '400px',
  },
  alertContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    color: 'white',
  },
}));
export default pure(DrawerListItem);
