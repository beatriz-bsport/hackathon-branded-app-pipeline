import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

type ColoredButtonProps = {
  color: string;
  selectedColor: string;
  changeColor: (color: string) => void;
};

const ColoredButton: React.FC<ColoredButtonProps> = ({
  color,
  selectedColor,
  changeColor,
}) => {
  const classes = useStyle();
  const setColor = React.useCallback(
    () => changeColor(color),
    [changeColor, color],
  );
  return (
    <Button
      className={classNames(classes.colorButton, {
        [classes.colorButtonActivated]: selectedColor === color,
      })}
      onClick={setColor}
    >
      <div
        className={classes.colorButtonBackground}
        style={{ background: color }}
      />
    </Button>
  );
};

type Props = {
  colorChoices: Array<string>;
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
};

const ColorPicker: React.FC<Props> = ({
  colorChoices,
  selectedColor,
  onColorChange,
  className,
}) => {
  const classes = useStyle();

  return (
    <div className={classNames(classes.colorContainer, className)}>
      {colorChoices.map((color) => (
        <ColoredButton
          key={color}
          changeColor={onColorChange}
          color={color}
          selectedColor={selectedColor}
        />
      ))}
    </div>
  );
};

const useStyle = makeStyles((theme) => ({
  colorContainer: {
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  colorButton: {
    height: '40px',
    width: '40px',
    minWidth: 0,
    borderRadius: theme.spacing(1),
    padding: 0,
  },
  colorButtonActivated: {
    border: `2px solid ${theme.palette.action.active}`,
  },
  colorButtonBackground: {
    height: '32px',
    width: '32px',
    borderRadius: theme.spacing(0.5),
  },
}));

export default React.memo(ColorPicker);
