import makeStyles from '@material-ui/styles/makeStyles';

export const useGraphStyles = makeStyles(() => ({
  disabledOverLay: {
    backgroundColor: 'rgba(255, 255, 255, .5)',
    backdropFilter: 'blur(0.5px)',
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
