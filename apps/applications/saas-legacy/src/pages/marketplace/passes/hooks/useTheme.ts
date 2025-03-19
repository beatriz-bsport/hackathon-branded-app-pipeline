import { useSelector } from 'react-redux';
import { getTheme } from '#src/libs/theme/selectors';

/**
 * Temporary hook to access the theme from Redux state.
 * This is needed because it's currently not possible to directly access Redux from components.
 *
 */
export const useTheme = () => {
  const theme = useSelector(getTheme);
  return theme;
};
