import { Theme, makeStyles } from '@material-ui/core';
import { QuicksaleSectionCardStyle } from '../../constants';

const useStyle = makeStyles<Theme, { isQuicksaleInterfaceView?: boolean }>(
  (theme) => ({
    sectionListContainer: ({ isQuicksaleInterfaceView }) => ({
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0%',
      backgroundColor: theme.palette.grey[50],
      ...(isQuicksaleInterfaceView
        ? {
            marginLeft: -theme.spacing(1.5),
            marginRight: -theme.spacing(1.5),
            [theme.breakpoints.down('xs')]: {
              marginLeft: -theme.spacing(1),
              marginRight: -theme.spacing(1),
            },
          }
        : {}),
    }),
    sectionContainer: ({ isQuicksaleInterfaceView }) => ({
      borderRadius: theme.spacing(1),
      ...(!isQuicksaleInterfaceView ? { padding: theme.spacing(1.5) } : {}),
      overflow: 'auto',
      margin: 0,
      height: 'fit-content',
    }),
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
    leftDropIndicator: {
      position: 'absolute',
      top: '0',
      bottom: '0',
      width: '4px',
      backgroundColor: '#1976d2',
      borderRadius: '2px',
      boxShadow: '0 0 8px rgba(25, 118, 210, 0.5)',
      zIndex: 1000,
    },
    rightDropIndicator: {
      position: 'absolute',
      right: '0',
      top: '0',
      bottom: '0',
      width: '4px',
      backgroundColor: '#1976d2',
      borderRadius: '2px',
      boxShadow: '0 0 8px rgba(25, 118, 210, 0.5)',
      zIndex: 1000,
    },
    verticalDropLine: {
      width: '100%',
      height: '100%',
      backgroundColor: 'inherit',
      borderRadius: 'inherit',
    },
    endDropIndicator: {
      width: '100%',
      height: '200px', // Match your card height
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #1976d2',
      borderRadius: '8px',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
    },
    dropPlaceholder: {
      color: '#1976d2',
      fontSize: '16px',
      fontWeight: 500,
    },
  }),
);

export default useStyle;
