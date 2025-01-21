// @flow
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';

import { useTranslation } from 'react-i18next';

import Popover from '@material-ui/core/Popover';
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import clsx from 'clsx';
import Tooltip from '../../../components/Tooltip.component';

import { MIN_HEIGHT_DURATION_SELECTOR } from '../constant';

function ValueLabelComponent(props: { children: any, value: string }) {
  const { children, value } = props;
  return (
    <Tooltip open placement="bottom" title={value}>
      {children}
    </Tooltip>
  );
}

type Props = {
  durationSecondRange?: string,
  onChange: (value?: string) => void,
  shouldSetMinHeight?: boolean,
};

const DurationSelector = (props: Props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 180]);
  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const valueLabelFormat = (v: any) => {
    return `${v} min`;
  };
  const { t } = useTranslation(['video']);
  let min = 0;
  let max = 180;
  try {
    [min, max] = props.durationSecondRange.split(',');
    // eslint-disable-next-line
  } catch {}
  return (
    <div>
      <ButtonBase
        onClick={(ev) => setAnchorMenu(ev.currentTarget)}
        style={{ width: '100%', backgroundColor: 'white' }}
      >
        <ThemeProvider theme={theme}>
          <TextField
            fullWidth
            InputProps={{
              classes: {
                input: clsx(classes.multilineColor, {
                  [classes.inputMinHeight]: props.shouldSetMinHeight,
                }),
              },
              endAdornment:
                min !== 0 || max !== 180 ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Clear search"
                      component="div"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setValue([0, 180]);
                        props.onChange(null);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
            }}
            size="small"
            value={
              !props.durationSecondRange
                ? t('video.filter.duration.all')
                : t('video.filter.duration.explain', { min, max })
            }
            variant="outlined"
          />
        </ThemeProvider>
      </ButtonBase>
      <Popover
        anchorEl={anchorMenu}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        onClose={() => setAnchorMenu(null)}
        onExited={() => {
          props.onChange(value);
        }}
        open={!!anchorMenu}
      >
        <div style={{ margin: 12 }}>
          <Typography>
            {t('video.filter.duration.explain', {
              min: value[0],
              max: value[1],
            })}
          </Typography>
          <Slider
            marks
            aria-labelledby="discrete-duration-slider"
            defaultValue={[parseInt(min, 10), parseInt(max, 10)]}
            getAriaValueText={valueLabelFormat}
            max={180}
            min={0}
            onChange={handleChange}
            step={10}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8',
              margin: 16,
              width: 300,
            }}
            value={value}
            ValueLabelComponent={ValueLabelComponent}
            valueLabelDisplay="on"
            valueLabelFormat={valueLabelFormat}
          />
        </div>
      </Popover>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  multilineColor: {
    color: 'grey',
  },
  inputMinHeight: {
    minHeight: MIN_HEIGHT_DURATION_SELECTOR,
  },
}));

const theme = createTheme({
  palette: {
    primary: blue,
  },
});

export default DurationSelector;
