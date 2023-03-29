import React from 'react';
import classNames from 'classnames';
import Fab from '@material-ui/core/Fab';
import { Theme, makeStyles } from '@material-ui/core';
import {
  BottomActionButtonBaseList,
  Props as ButtonBaseListProps,
} from './BottomActionsButton.component';
import ExtendedFabBadge from '#components/ExtendedFabBadge.component';

type OwnProps = {
  buttonsProperties: Array<{
    onClick: (e: React.MouseEvent) => void;
    text?: string;
    icon?: any;
    color?: 'primary' | 'secondary';
    fabVariant?: 'extended' | 'circular' | 'round';
    disabled?: boolean;
    keepTextUnderSelectedMinWidth?: boolean;
    badgeValue?: number | string;
  }>;
  minWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

type ButtonProperties = {
  onClick: (e: React.MouseEvent) => void;
  text?: string;
  icon?: any;
  color?: 'primary' | 'secondary';
  fabVariant?: 'extended' | 'circular' | 'round';
  disabled?: boolean;
  keepTextUnderSelectedMinWidth?: boolean;
  badgeValue?: number | string;
};

type Props = OwnProps & ButtonBaseListProps;

export const BottomActionsButtonCustom: React.FC<Props> = (props: Props) => {
  const minWidth = props.minWidth || 'xs';
  const classes = useStyles({ minWidth });
  return (
    <div className={classes.buttonContainer}>
      {props.buttonsProperties?.map(
        (button: ButtonProperties, index: number) => (
          <Fab
            key={`bottom_action_${index}`}
            variant={button.fabVariant ?? 'extended'}
            color={button.color ?? 'primary'}
            className={classes.actionButton}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            <ExtendedFabBadge badgeValue={button.badgeValue} />
            {!!button.icon && button.icon}
            {button.text && (
              <div
                className={classNames(classes.rightText, {
                  [classes.hiddenText]: !button.keepTextUnderSelectedMinWidth,
                })}
              >
                {button.text}
              </div>
            )}
          </Fab>
        ),
      )}
      <BottomActionButtonBaseList {...props} />
    </div>
  );
};

const useStyles = makeStyles<
  Theme,
  { minWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }
>((theme) => ({
  buttonContainer: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  hiddenText: ({ minWidth }) => ({
    [theme.breakpoints.down(minWidth)]: {
      display: 'none',
    },
  }),
  rightText: {
    marginLeft: theme.spacing(1),
  },
}));

export default React.memo(BottomActionsButtonCustom);
