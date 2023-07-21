import { makeStyles } from '@material-ui/core';
import { QuicksaleItemCardStyle } from '../../constants';

const useStyle = makeStyles((theme) => ({
  itemListContainer: {
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  itemContainer: {
    borderRadius: theme.spacing(1),
    overflow: 'auto',
    margin: 0,
    height: 'fit-content',
  },
  item: {
    height: 'fit-content',
  },
  addSectionIconButton: {
    minWidth: QuicksaleItemCardStyle.minWidth,
    minHeight: QuicksaleItemCardStyle.minHeight,
    aspectRatio: QuicksaleItemCardStyle.aspectRatio.toString(),
    borderRadius: theme.spacing(1.5),
    backgroundColor: theme.palette.grey[300],
    '&:hover': {
      backgroundColor: '#cccccc',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  addSectionIcon: {
    color: theme.palette.action.active,
    height: '40px',
    width: '40px',
  },
  itemListHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(3),
    paddingLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    marginLeft: 0,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  sectionInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  sectionTitle: {
    fontWeight: 500,
  },
  goBackButton: {
    color: theme.palette.grey[600],
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: theme.spacing(1.5),
    border: '1px solid #E0E0E0',
    height: '40px',
    background: 'white',
  },
  autoSizerContainer: {
    flex: '1 1 0%',
  },
}));

export default useStyle;
