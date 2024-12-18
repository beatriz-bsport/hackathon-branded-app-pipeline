import memoize from 'memoize-one';
import { Theme, makeStyles } from '@material-ui/core';
import { QuicksaleItemColor, QuicksaleSectionColor } from './constants';
import { determinePropertyFromBrightness } from './utils';

const useGlobalStyle = memoize((isMobile: boolean) =>
  makeStyles<
    Theme,
    {
      admin: boolean;
      color: QuicksaleItemColor | QuicksaleSectionColor;
    }
  >((theme) => ({
    quicksaleCardContainer: ({ admin, color }) => ({
      borderRadius: theme.spacing(1.5),
      color: determinePropertyFromBrightness(color, 'black', 'white'),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      ...(admin
        ? {
            '&:hover': {
              backgroundColor: color,
              background:
                'linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.25) 100%)',
              '&>*:last-child': {
                visibility: 'visible',
              },
            },
            ...(isMobile
              ? {
                  backgroundColor: color,
                  background:
                    'linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.25) 100%)',
                  '&>*:last-child': {
                    visibility: 'visible',
                  },
                }
              : {}),
          }
        : {}),
      backgroundColor: color,
    }),
    quicksaleCardActions: {
      padding: 0,
      visibility: 'hidden',
      position: 'absolute',
      bottom: theme.spacing(0.875),
      right: theme.spacing(0.875),
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(1.5),
    },
    quicksaleCardAction: {
      width: '32px',
      height: '32px',
      backgroundColor: 'white',
      borderRadius: theme.spacing(1),
      padding: theme.spacing(0.75),
      '&:hover': {
        backgroundColor: 'white',
      },
    },
    quicksaleCardColorPickerButton: ({ color }) => ({
      width: '20px',
      height: '20px',
      borderRadius: theme.spacing(0.5),
      backgroundColor: color,
    }),
    quicksaleCardDeleteIcon: {
      color: theme.palette.action.active,
      width: '20px',
      height: '20px',
    },
  })),
);

export default useGlobalStyle;
