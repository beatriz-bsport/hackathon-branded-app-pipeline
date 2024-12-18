import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  searchBarContainer: {
    width: '100%',
  },
  popper: {
    zIndex: 999,
  },
  textBar: {
    borderRadius: theme.spacing(1.5),
    height: '40px',
    background: 'white',
  },
  resultListContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '300px',
    overflow: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    alignItems: 'center',
  },
  listItemContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  listItemInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItemIconButton: {
    padding: 0,
  },
  listItemIcon: {
    height: '32px',
    width: '32px',
    borderRadius: theme.spacing(1),
  },
}));

export default useStyles;
