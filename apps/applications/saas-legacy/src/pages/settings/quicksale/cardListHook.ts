import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  sectionListContainer: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    padding: theme.spacing(2),
  },
  pageHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  mediumBold: {
    fontWeight: 500,
  },
  pageBody: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    flex: 'auto',
    [theme.breakpoints.down(1400)]: {
      flexDirection: 'column',
    },
  },
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up(1400)]: {
      order: 2,
      maxWidth: '25%',
    },
    height: 'fit-content',
  },
  actionList: {
    '& > li': {
      listStyleType: 'none',
    },
  },
  colorPicker: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  colorModalTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorModalCloseButton: {
    padding: 0,
  },
  archivedCategories: {
    marginTop: theme.spacing(2),
    height: 'auto',
  },
  archivedCategoriesTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
  },
  updateLoading: {
    height: '24px',
    width: '24px',
  },
}));

export default useStyles;
