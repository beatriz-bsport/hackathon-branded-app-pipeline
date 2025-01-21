import makeStyles from '@material-ui/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

type GraphStyles = { isFirstOutputConfiguration: boolean };

const useGraphStyles = makeStyles<Theme, GraphStyles>(() => ({
  blurDisabledOverLay: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(1px)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '50%',
    left: '50%',
    zIndex: ({ isFirstOutputConfiguration }) =>
      isFirstOutputConfiguration ? 800 : 600,
    transform: 'translate(-50%,-50%)',
    '-ms-transform': 'translate(-50%,-50%)',
  },
  clearDisabledOverLay: {
    backgroundColor: 'transparent',
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '50%',
    left: '50%',
    zIndex: 1000,
    transform: 'translate(-50%,-50%)',
    '-ms-transform': 'translate(-50%,-50%)',
  },
}));

export default useGraphStyles;
