import { Theme, makeStyles } from '@material-ui/core';
import { QuicksaleItemCardStyle } from '../../constants';

const useStyle = makeStyles<Theme, { isQuicksaleInterfaceView?: boolean }>(
  (theme) => ({
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
    autoSizerContainer: ({ isQuicksaleInterfaceView }) => ({
      flex: '1 1 0%',
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
      height: '200px',
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
