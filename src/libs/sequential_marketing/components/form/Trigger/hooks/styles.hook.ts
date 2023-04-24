// @ts-nocheck
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';

export const useCadenceFormStyles = makeStyles((theme: Theme) => ({
  flexVertical: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  paddingTop2: {
    paddingTop: theme.spacing(2),
  },
  paddingBottom2: {
    paddingBottom: theme.spacing(2),
  },
  paddingLeft2: {
    paddingLeft: theme.spacing(2),
  },
  titleWithIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  icon: {
    color: '#868686',
  },
  alertContainer: {
    paddingBottom: theme.spacing(2),
  },
  alert: {
    alignItems: 'center',
  },
  ruleEntrySelector: {
    paddingBottom: theme.spacing(2),
  },
  ruleBetweenEntry: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  flexDiv: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  operatorHelperText: {
    [theme.breakpoints.down('xs')]: {
      flex: '1 0 100%',
      justifyContent: 'flex-start',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),
    },
  },
  operatorSelector: {
    minWidth: '75px',
    [theme.breakpoints.down('xs')]: {
      flex: 1,
    },
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  marketingActionsContainer: {
    paddingBottom: theme.spacing(3),
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(4),
  },
  cardContainer: {
    position: 'relative',
  },
  cardOutter: {
    width: '100px',
    height: '100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    border: `1px solid #E0E0E0`,
    '&:hover': {
      boxShadow:
        'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 1px 2px',
    },
  },
  borderOutlined: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  strongElevation: {
    boxShadow:
      'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 8px 16px',
  },
  topRightIconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(50%, -50%)',
    zIndex: 1000,
  },
  cardInner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
  },
  stepLabel: {
    fontWeight: 500,
  },
  timeoutSection: {
    paddingBottom: theme.spacing(2),
  },
  timeoutSelectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  timeoutInput: {
    minWidth: '50px',
    flex: 1,
  },
  timeoutInpoutText: {
    flex: 9,
  },
  tagSelector: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(10),
  },
  selectorWithIcon: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
  },
}));

export default useCadenceFormStyles;
