import { makeStyles } from '@material-ui/core';
import { QuicksaleSectionCardStyle } from '../../constants';

const useStyle = makeStyles((theme) => ({
  sectionListContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0%',
    backgroundColor: theme.palette.grey[50],
  },
  sectionContainer: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
    overflow: 'auto',
    margin: 0,
    height: 'fit-content',
  },
  sectionItem: {
    height: 'fit-content',
  },
  addSectionIconButton: {
    minWidth: QuicksaleSectionCardStyle.minWidth,
    minHeight: QuicksaleSectionCardStyle.minHeight,
    aspectRatio: QuicksaleSectionCardStyle.aspectRatio.toString(),
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
  iconSelectorContainer: {
    paddingLeft: theme.spacing(0.875),
    paddingTop: theme.spacing(1.5),
    paddingRight: theme.spacing(1.75),
  },
  iconGrid: {
    '&::-webkit-scrollbar': {
      left: theme.spacing(42),
      top: theme.spacing(6.75),
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c4c4c4',
      height: '66px',
      borderRadius: theme.spacing(11.25),
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#b0b0b0',
    },
  },
  iconButton: {
    '&:hover': { backgroundColor: '#e7e7e7' },
  },
  icon: {
    height: '40px',
    width: '40px',
  },
}));

export default useStyle;
