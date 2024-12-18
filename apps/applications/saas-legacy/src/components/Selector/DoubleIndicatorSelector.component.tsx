import React, { useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { ButtonBase } from '@material-ui/core';
import MaterialUISelector, {
  MuiSelectProps,
} from '#src/components/Selector/MaterialUISelector.component';

const DoubleIndicatorSelector: React.FC<MuiSelectProps<any>> = ({
  options,
  value,
  onChange,
  ...rest
}) => {
  const classes = useStyles();
  const index = useMemo(
    () => options.findIndex((opt) => opt?.value === value?.value),
    [options, value?.value],
  );

  const handleClickBack = useCallback(() => {
    if (index > 0) {
      onChange(options[index - 1]);
      return;
    }
    onChange(options[options.length - 1]);
  }, [index, onChange, options]);

  const handleClickNext = useCallback(() => {
    if (index < options.length - 1) {
      onChange(options[index + 1]);
      return;
    }
    onChange(options[0]);
  }, [index, onChange, options]);

  return (
    <div className={classes.container}>
      <ButtonBase className={classes.leftButton} onClick={handleClickBack}>
        <ChevronLeftIcon />
      </ButtonBase>
      <div className={classes.select}>
        <MaterialUISelector
          removeIndicator
          className={classes.control}
          isMulti={false}
          onChange={onChange}
          options={options}
          value={value}
          {...rest}
        />
      </div>
      <ButtonBase className={classes.rightButton} onClick={handleClickNext}>
        <ChevronRightIcon />
      </ButtonBase>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 200,
  },
  control: {
    flex: 1,
    "& [class*='control']": {
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: 0,
    },
  },
  leftButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'hsl(0,0%,80%)',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderRightWidth: 0,
    padding: 6,

    backgroundImage:
      'linear-gradient(to bottom, #fff 22.5%, hsl(0, 0%, 80%) 22.6%, hsl(0, 0%, 80%) 77.5%, #fff 77.6%, #fff 100%)',
    backgroundPosition: 'top right',
    backgroundSize: '1px 36px',
    backgroundRepeat: 'no-repeat',
  },
  rightButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'hsl(0,0%,80%)',
    padding: 6,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderLeftWidth: 0,

    backgroundImage:
      'linear-gradient(to bottom, #fff 22.5%, hsl(0, 0%, 80%) 22.6%, hsl(0, 0%, 80%) 77.5%, #fff 77.6%, #fff 100%)',
    backgroundPosition: 'top left',
    backgroundSize: '1px 36px',
    backgroundRepeat: 'no-repeat',
  },
  select: {
    flex: 1,
  },
}));

export default React.memo(DoubleIndicatorSelector);
