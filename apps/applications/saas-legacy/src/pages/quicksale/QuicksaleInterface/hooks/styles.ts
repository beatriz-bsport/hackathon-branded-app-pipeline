import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  leftContainer: {
    padding: theme.spacing(2),
    paddingRight: theme.spacing(1),
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  searchBarWithResults: {
    width: '100%',
    display: 'flex',
    gap: theme.spacing(2),
  },
  searchBarWithCategoryName: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  goBackButton: {
    color: theme.palette.grey[600],
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[300]}`,
    height: '40px',
    background: 'white',
  },
  searchResultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingRight: theme.spacing(2),
  },
  resultSectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  resultSectionInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  resultSectionTitle: {
    fontWeight: 500,
  },
  resultItem: {
    height: 'fit-content',
  },
  noMargin: {
    marginBottom: 0,
  },
  widthFull: {
    width: '100%',
  },
  width300px: {
    width: '30vw',
    minWidth: '250px',
  },
  itemListHeader: {
    padding: 0,
    margin: 0,
  },
  rightContainer: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    width: '100%',
    height: '100vh',
  },
  giftcardDialogTitle: {
    display: 'flex',
    justifyContent: 'end',
  },
  giftcardDialogCloseIcon: {
    width: 36,
    height: 36,
  },
  giftcardDialogCloseButton: {
    padding: 0,
  },
}));

export default useStyles;
