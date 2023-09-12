import React from 'react';
import classNames from 'classnames';
import Fab from '@material-ui/core/Fab';
import { Theme, makeStyles } from '@material-ui/core';
import {
  BottomActionButtonBaseList,
  Props as ButtonBaseListProps,
} from './BottomActionsButton.component';
import ExtendedFabBadge from '#components/ExtendedFabBadge.component';

import PopOver from '#components/Popover';

type OwnProps = {
  buttonsProperties?: ButtonProperties[];
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
  popOverTitle?: string;
};

type Props = OwnProps & ButtonBaseListProps;

export const BottomActionsButtonCustom: React.FC<Props> = (props: Props) => {
  const minWidth = props.minWidth || 'xs';
  const classes = useStyles({ minWidth });
  return (
    <div className={classes.buttonContainer}>
      {props.buttonsProperties?.map(
        (button: ButtonProperties, index: number) => (
          <PopOver hide={!button.popOverTitle} title={button.popOverTitle}>
            <Fab
              key={`bottom_action_${index}`}
              className={classes.actionButton}
              color={button.color ?? 'primary'}
              disabled={button.disabled}
              onClick={button.onClick}
              variant={button.fabVariant ?? 'extended'}
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
          </PopOver>
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
