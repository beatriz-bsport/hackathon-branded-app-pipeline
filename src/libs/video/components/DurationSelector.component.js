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
import Tooltip from '../../../components/Tooltip.component';

function ValueLabelComponent(props: { children: any, value: string }) {
  const { children, value } = props;
  return (
    <Tooltip open placement="bottom" title={value}>
      {children}
    </Tooltip>
  );
}

type Props = {
  durationSecondRange: ?string,
  onChange: (?string) => void,
};

const DurationSelector = (props: Props) => {
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
        style={{ width: '100%', backgroundColor: 'white' }}
        onClick={(ev) => setAnchorMenu(ev.currentTarget)}
      >
        <TextField
          fullWidth
          disabled
          size="small"
          value={
            !props.durationSecondRange
              ? t('video.filter.duration.all')
              : t('video.filter.duration.explain', { min, max })
          }
          variant="outlined"
          InputProps={{
            endAdornment:
              min !== 0 || max !== 180 ? (
                <InputAdornment position="end">
                  <IconButton
                    component="div"
                    aria-label="Clear search"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      props.onChange(null);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
          }}
        />
      </ButtonBase>
      <Popover
        open={!!anchorMenu}
        anchorEl={anchorMenu}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        onClose={() => setAnchorMenu(null)}
        onExited={() => {
          props.onChange(value);
        }}
      >
        <div style={{ margin: 12 }}>
          <Typography>
            {t('video.filter.duration.explain', {
              min: value[0],
              max: value[1],
            })}
          </Typography>
          <Slider
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8',
              margin: 16,
              width: 300,
            }}
            value={value}
            defaultValue={[parseInt(min, 10), parseInt(max, 10)]}
            onChange={handleChange}
            aria-labelledby="discrete-duration-slider"
            getAriaValueText={valueLabelFormat}
            valueLabelFormat={valueLabelFormat}
            valueLabelDisplay="on"
            ValueLabelComponent={ValueLabelComponent}
            step={10}
            marks
            min={0}
            max={180}
          />
        </div>
      </Popover>
    </div>
  );
};

export default DurationSelector;
