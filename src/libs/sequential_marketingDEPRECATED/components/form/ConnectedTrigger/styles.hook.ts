import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';

const useConnectedTriggerFormStyles = makeStyles((theme: Theme) => ({
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  stepperContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));

export default useConnectedTriggerFormStyles;
