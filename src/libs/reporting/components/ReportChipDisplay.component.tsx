// @ts-nocheck
import React from 'react';
import {
  createTheme,
  MuiThemeProvider,
  useTheme,
  alpha,
} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import {
  CheckCircle,
  Cancel,
  HourglassFull,
  Cached,
  Stop,
  Pause,
  Store,
  People,
  Edit,
  CloudUpload,
  Error,
  RemoveCircle,
  Warning,
} from '@material-ui/icons';

// TODO PROPER TYPING
type Props = {
  value: string;
  color: string;
  icon: string;
};

// WIP still have to implement tag color
const getColor = (color: string) => {
  let textColor;
  switch (color) {
    case 'red':
      textColor = '#E31B0C';
      break;
    case 'blue':
      textColor = '#0B79D0';
      break;
    case 'green':
      textColor = '#3B873E';
      break;
    case 'yellow':
      textColor = '#C77700';
      break;
    case 'orange':
      textColor = '#C94800';
      break;
    default:
      // grey
      textColor = '#212121';
  }
  const backgroundColor = alpha(textColor, 0.1);
  return { backgroundColor, textColor };
};

const getIcon = (icon: string) => {
  switch (icon) {
    case 'check':
      return <CheckCircle />;
    case 'cross':
      return <Cancel />;
    case 'hourglass':
      return <HourglassFull />;
    case 'arrows':
      return <Cached />;
    case 'stop':
      return <Stop />;
    case 'pause':
      return <Pause />;
    case 'market':
      return <Store />;
    case 'people':
      return <People />;
    case 'pen':
      return <Edit />;
    case 'cloud':
      return <CloudUpload />;
    case 'exclamation':
      return <Error />;
    case 'forbidden':
      return <RemoveCircle />;
    case 'warning':
      return <Warning />;
    default:
      return null;
  }
};
export const ReportChipDisplay = (props: Props) => {
  const { value, color, icon } = props;
  const defaultTheme = useTheme();
  const { backgroundColor, textColor } = getColor(color, defaultTheme);
  const iconUsed = getIcon(icon);
  const newTheme = createTheme({
    palette: {
      primary: {
        main: backgroundColor,
        contrastText: textColor,
      },
    },
  });
  const theme = backgroundColor ? newTheme : defaultTheme;
  return (
    <MuiThemeProvider theme={theme}>
      <Chip label={value} size="small" color="primary" icon={iconUsed} />
    </MuiThemeProvider>
  );
};

export default ReportChipDisplay;
