import React, { useCallback, useEffect, useState } from 'react';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ButtonBase from '@material-ui/core/ButtonBase';
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
} from '#libs/sequential_marketing/constants/steps';

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
  isSelected?: boolean;
  isDivided?: boolean;
  disabled?: boolean;
  isEmpty?: boolean;
  minHeight?: boolean;
  disableRipple?: boolean;
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
  header,
  content,
  color,
  selectedColor,
  isSelected,
  isDivided,
  disabled,
  withShadow,
  isEmpty,
  maxWidth,
  minHeight,
  disableRipple,
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
    setSelected(isSelected && !disabled);
  }, [isSelected, disabled]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      setSelected(true);
    },
    [],
  );

  const handleClickAway = useCallback(
    (event: React.MouseEvent<Document, MouseEvent>) => {
      event.stopPropagation();
      event.preventDefault();
      setSelected(false);
    },
    [],
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <ButtonBase
        onClick={handleClick}
        className={classes.container}
        disabled={disabled}
        disableRipple={disableRipple}
      >
        <div className={classes.card}>
          <StepCardHeader>{header}</StepCardHeader>
          {!!isDivided && <div className={classes.divider} />}
          {!!content && <StepCardContent>{content}</StepCardContent>}
        </div>
      </ButtonBase>
    </ClickAwayListener>
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
      `${theme.spacing(0)} ${theme.spacing(0.5)} ${theme.spacing(
        1,
      )} ${theme.spacing(0.5)} #00000010`,
    '&:hover': {
      overflow: ({ withShadow }) => withShadow && 'visible',
      boxShadow: ({ withShadow }) =>
        withShadow &&
        `${theme.spacing(0)} ${theme.spacing(0.5)} ${theme.spacing(
          2,
        )} ${theme.spacing(0.5)} #00000010`,
    },
  },
  divider: {
    display: 'flex',
    height: 1,
    width: '100%',
    backgroundColor: ({ color }) =>
      color || lighten(theme.palette.primary.light, 0.75),
  },
}));

export default React.memo(StepCard);
