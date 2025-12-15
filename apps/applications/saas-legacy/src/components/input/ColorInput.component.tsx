import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { SketchPicker, ColorResult } from 'react-color';
import Popover from '@material-ui/core/Popover';
import clsx from 'clsx';
import { Theme, makeStyles } from '@material-ui/core';
// @ts-expect-error
import { getTheme } from '../../theme';

type ColorInputProps = {
  label?: string;
  color: string;
  onChange: (color: string) => void;
  buttonStyle?: string;
  fullWidth?: boolean;
  id?: string;
  withAlpha?: boolean;
  transparentColorAvailable?: boolean;
  defaultCompanyThemeColor?: boolean;
  helperText?: string;
};

const ColorInput: React.FC<ColorInputProps> = ({
  label,
  color,
  onChange,
  buttonStyle = '',
  fullWidth = true,
  id,
  withAlpha,
  transparentColorAvailable,
  defaultCompanyThemeColor,
  helperText,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const theme = getTheme() as Theme;
  const classes = useStyles();
  const { t } = useTranslation('common');

  const onColorChange = useCallback(
    (newColor: ColorResult) => {
      const { hex, rgb } = newColor;

      if (hex === 'transparent') {
        onChange('transparent');
        return;
      }

      if (typeof rgb.a === 'number' && rgb.a !== 1) {
        const opacityInHexa = Math.round(255 * rgb.a)
          .toString(16)
          .padStart(2, '0');
        onChange(`${hex}${opacityInHexa}`);
        return;
      }

      onChange(hex);
    },
    [onChange],
  );

  const deleteColor = useCallback(() => {
    if (transparentColorAvailable) {
      onChange('');
      setPickerOpen(!pickerOpen);
    }
    if (defaultCompanyThemeColor) {
      onChange(theme.palette.primary.main);
      setPickerOpen(!pickerOpen);
    }
  }, [
    onChange,
    setPickerOpen,
    theme,
    pickerOpen,
    transparentColorAvailable,
    defaultCompanyThemeColor,
  ]);

  const togglePicker = useCallback(() => {
    setPickerOpen(!pickerOpen);
  }, [setPickerOpen, pickerOpen]);

  return (
    <FormControl fullWidth={fullWidth}>
      <FormLabel>{label}</FormLabel>
      <ButtonBase
        className={clsx(buttonStyle, classes.button)}
        onClick={togglePicker}
      >
        <div
          ref={buttonRef}
          className={color ? classes.colorBlock : classes.emptyColorBlock}
          style={{
            backgroundColor: color,
          }}
        />
        <Typography color="textSecondary" id={id}>
          {color ? color : t('colorPicker.noColor')}
        </Typography>
      </ButtonBase>
      <Popover
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={togglePicker}
        open={pickerOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <SketchPicker
          color={color}
          disableAlpha={!withAlpha}
          onChangeComplete={onColorChange}
        />
        {transparentColorAvailable || defaultCompanyThemeColor ? (
          <div className={classes.buttonContainer}>
            <Button className={classes.buttons} onClick={deleteColor}>
              {t('colorPicker.delete')}
            </Button>
            <Button className={classes.buttons} onClick={togglePicker}>
              {t('colorPicker.validate')}
            </Button>
          </div>
        ) : null}
      </Popover>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default React.memo(ColorInput);

const useStyles = makeStyles((theme) => ({
  buttons: {
    padding: '3px',
    marginLeft: '10px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '5px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'white',
    marginTop: '-5px',
  },
  button: {
    borderRadius: theme.spacing(1),
    border: '1px solid #C1C1C1',
    padding: theme.spacing(1),
    backgroundColor: '#F8F8F8',
    marginTop: theme.spacing(1),
  },
  colorBlock: {
    height: 24,
    width: 24,
    marginRight: 12,
    textDecoration: 'none',
  },
  emptyColorBlock: {
    height: 0,
    width: 0,
  },
}));
