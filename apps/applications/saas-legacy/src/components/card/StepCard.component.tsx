import React, { useCallback, useEffect, useState } from 'react';
import Immutable from 'seamless-immutable';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import {
  CARD_HEIGHT_IF_EMPTY,
  CARD_MAX_WIDTH,
  CARD_MIN_HEIGHT,
  CARD_MIN_WIDTH,
  CONTENT_FONT_SIZE,
  CONTENT_MIN_HEIGHT,
  HEADER_FONT_SIZE,
  HEADER_MIN_HEIGHT,
} from '#src/libs/sequential_marketing/constants/steps';
import MenuSelectorCustomButton from '#src/components/menu/custom';
import ToolTip from '#src/components/Tooltip.component';

import type { MenuAction } from '#src/components/menu/types';
import { StepMemberCountChip } from '#src/libs/sequential_marketing/components/graph/chips/StepMemberCountChip.component';

const DEFAULT_ADD_BUTTON_COLOR = '#777';

type StepCardStylesProps = {
  color?: string;
  selectedColor?: string;
  withShadow?: boolean;
  maxWidth?: boolean;
  heightSize?: string;
  selected?: boolean;
};

export type StepCardProps = {
  header: React.ReactElement;
  content?: React.ReactElement;
  addButtonActionList?: Immutable.ImmutableArray<MenuAction>;
  actionListColor?: string;
  actionListLabel?: string;
  addButtonColor?: string;
  addButtonLabel?: string;
  disabled?: boolean;
  disableRipple?: boolean;
  forceSelection?: boolean;
  isDivided?: boolean;
  isEmpty?: boolean;
  isSelected?: boolean;
  minHeight?: boolean;
  stepMemberCount?: number;
  onCardClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
} & Omit<StepCardStylesProps, 'heightSize' | 'selected'>;

type Props = {
  children: React.ReactElement;
};

const StepCardHeader: React.FC<Props> = React.memo(({ children }) => {
  const classes = useStylesHeaderAndContent();

  return <div className={classes.header}>{children}</div>;
});

const StepCardContent: React.FC<Props> = React.memo(({ children }) => {
  const classes = useStylesHeaderAndContent();

  return <div className={classes.content}>{children}</div>;
});

const StepCard: React.FC<StepCardProps> = ({
  actionListColor,
  actionListLabel,
  addButtonActionList,
  addButtonColor,
  addButtonLabel,
  color,
  content,
  disabled,
  disableRipple,
  header,
  isDivided,
  isEmpty,
  isSelected,
  forceSelection,
  maxWidth,
  minHeight,
  selectedColor,
  withShadow,
  stepMemberCount,
  onCardClick,
}) => {
  const [selected, setSelected] = useState(false);

  const classes = useStyles({
    color,
    selectedColor,
    selected,
    withShadow,
    maxWidth,
    heightSize:
      (isEmpty && CARD_HEIGHT_IF_EMPTY) || (minHeight && CARD_MIN_HEIGHT),
  });

  useEffect(() => {
    setSelected((isSelected && !disabled) || forceSelection);
  }, [isSelected, disabled, forceSelection]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      setSelected(true);
      onCardClick?.(event);
    },
    [onCardClick],
  );

  const handleClickAway = useCallback(
    (event: React.MouseEvent<Document, MouseEvent>) => {
      event.stopPropagation();
      event.preventDefault();
      !disabled && !forceSelection && setSelected(false);
    },
    [disabled, forceSelection],
  );

  return (
    <div className={classes.stepCard}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <ButtonBase
          className={classes.container}
          disabled={disabled}
          disableRipple={disableRipple}
          onClick={handleClick}
        >
          <div className={classes.stepbox}>
            <div className={classes.stepContent}>
              <div className={classes.card}>
                <StepCardHeader>{header}</StepCardHeader>
                {!!isDivided && <div className={classes.divider} />}
                {!!content && <StepCardContent>{content}</StepCardContent>}
              </div>
            </div>
            {disabled && (!!stepMemberCount || stepMemberCount === 0) && (
              <div className={classes.stepMemberCount}>
                <StepMemberCountChip isVisible count={stepMemberCount} />
              </div>
            )}
          </div>
        </ButtonBase>
      </ClickAwayListener>
      {!!addButtonActionList && (
        <div
          className={classes.addButtonContainer}
          style={{ color: addButtonColor || DEFAULT_ADD_BUTTON_COLOR }}
        >
          <ToolTip title={addButtonLabel || ''}>
            <MenuSelectorCustomButton
              actionList={addButtonActionList}
              customHoverBackgroundColor={actionListColor}
              informationText={actionListLabel}
            >
              <IconButton color="inherit" disabled={disabled} size="small">
                <AddCircleIcon fontSize="small" />
              </IconButton>
            </MenuSelectorCustomButton>
          </ToolTip>
        </div>
      )}
    </div>
  );
};

const useStylesHeaderAndContent = makeStyles<Theme>((theme) => ({
  header: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: HEADER_MIN_HEIGHT,
    fontSize: HEADER_FONT_SIZE,
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: CONTENT_MIN_HEIGHT,
    fontSize: CONTENT_FONT_SIZE,
    paddingLeft: theme.spacing(2),
    padding: theme.spacing(1),
    width: '100%',
  },
}));

const useStyles = makeStyles<Theme, StepCardStylesProps>((theme) => ({
  stepCard: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  container: {
    borderRadius: theme.spacing(1),
    position: 'relative',
  },
  card: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: CARD_MIN_WIDTH,
    maxWidth: CARD_MAX_WIDTH,
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
    border: '2px solid',
    width: ({ maxWidth }) => (maxWidth ? CARD_MAX_WIDTH : 'auto'),
    height: ({ heightSize }) => heightSize ?? 'auto',
    borderColor: ({ color, selectedColor, selected }) =>
      selected
        ? selectedColor || theme.palette.primary.light
        : color || lighten(theme.palette.primary.light, 0.75),
    boxShadow: ({ withShadow }) =>
      withShadow &&
      `${theme.spacing(0)}px ${theme.spacing(0.5)}px ${theme.spacing(
        1,
      )}px ${theme.spacing(0.5)}px #00000005`,
    '&:hover': {
      overflow: ({ withShadow }) => withShadow && 'visible',
      boxShadow: ({ withShadow }) =>
        withShadow &&
        `${theme.spacing(0)}px ${theme.spacing(0.5)}px ${theme.spacing(
          2,
        )}px ${theme.spacing(0.5)}px #00000010`,
    },
  },
  divider: {
    display: 'flex',
    height: 1,
    width: '100%',
    backgroundColor: ({ color }) =>
      color || lighten(theme.palette.primary.light, 0.75),
  },
  addButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepbox: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    alignItems: 'center',
  },
  stepContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stepMemberCount: {
    display: 'flex',
    position: 'absolute',
    transform: 'translateY(50%)',
    bottom: 0,
  },
}));

export default React.memo(StepCard);
