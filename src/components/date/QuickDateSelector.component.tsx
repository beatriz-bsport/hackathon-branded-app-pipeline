import React from 'react';
import { useTranslation } from 'react-i18next';
import { MuiThemeProvider, createTheme } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { QUICK_DATE_SELECTIONS } from '#src/components/date/constants';

type Props = {
  initialTimePeriod: string;
  onChange: (timePeriod: string) => void;
  type: 'single' | 'range';
};

const QuickDateSelector: React.FC<Props> = ({
  initialTimePeriod,
  onChange,
  type,
}) => {
  const { t } = useTranslation('reporting');
  const [timePeriod, setTimePeriod] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (initialTimePeriod) {
      setTimePeriod(initialTimePeriod);
    }
  }, [initialTimePeriod]);

  const handleChange = React.useCallback(
    (event) => {
      const selectedTimePeriod = event.target.value;
      setTimePeriod(selectedTimePeriod);
      onChange(selectedTimePeriod);
    },
    [onChange],
  );

  const handleSelectState = React.useCallback(
    (bool: boolean) => () => {
      setIsOpen(bool);
    },
    [],
  );

  return (
    <MuiThemeProvider theme={QuickDateSelectorTheme}>
      <Select
        autoWidth
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          getContentAnchorEl: null,
        }}
        onChange={handleChange}
        onClose={handleSelectState(false)}
        onOpen={handleSelectState(true)}
        open={isOpen}
        value={timePeriod}
        variant="outlined"
      >
        {QUICK_DATE_SELECTIONS.filter(
          (selection) => selection.type === type,
        ).map((selection) => (
          <MenuItem
            key={selection.timePeriod}
            divider={selection.withBottomDivider}
            value={selection.timePeriod}
          >
            <Typography>
              {t(`header.quickDateSelector.${selection.timePeriod}`)}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </MuiThemeProvider>
  );
};
const defaultTheme = createTheme();

const QuickDateSelectorTheme = createTheme({
  overrides: {
    MuiSelect: {
      root: {
        padding: defaultTheme.spacing(1, 2),
        '& > *:first-child': {
          paddingRight: defaultTheme.spacing(2),
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiMenu: {
      list: {
        padding: defaultTheme.spacing(1),
      },
    },
  },
});

export default React.memo(QuickDateSelector);
