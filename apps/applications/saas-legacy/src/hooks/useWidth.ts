import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  let finalBreakpoint = null;
  for (const breakpoint of keys) {
    /* eslint-disable-next-line react-hooks/rules-of-hooks  */
    const breakpointMatches = useMediaQuery(theme.breakpoints.up(breakpoint));
    if (!finalBreakpoint && breakpointMatches) {
      finalBreakpoint = breakpoint;
    }
  }
  // Return breakpoint after all hooks have been executed systematically in the same order
  return finalBreakpoint || 'xs';
}
