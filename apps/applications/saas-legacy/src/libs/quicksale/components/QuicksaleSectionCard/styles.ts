import { makeStyles, Theme } from '@material-ui/core/styles';
import { determinePropertyFromBrightness } from '#src/libs/quicksale/utils';
import { QuicksaleSectionCardStyle } from '#src/libs/quicksale/constants';

const useStyle = makeStyles<
  Theme,
  { color: string; isIconBeingEdited: boolean }
>((theme) => ({
  container: {
    minWidth: QuicksaleSectionCardStyle.minWidth,
    minHeight: QuicksaleSectionCardStyle.minHeight,
    aspectRatio: QuicksaleSectionCardStyle.aspectRatio.toString(),
    padding: theme.spacing(1.5),
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
  },
  dragIconButton: ({ color }) => ({
    padding: 0,
    color: determinePropertyFromBrightness(color, 'black', 'white'),
    '&:hover': {
      backgroundColor: 'transparent',
    },
  }),
  sectionIconButton: ({ color, isIconBeingEdited }) => ({
    height: '40px',
    width: '40px',
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      background: determinePropertyFromBrightness(
        color,
        QuicksaleSectionCardStyle.darkHoverBackground,
        QuicksaleSectionCardStyle.lightHoverBackground,
      ),
    },
    ...(isIconBeingEdited
      ? {
          background: determinePropertyFromBrightness(
            color,
            QuicksaleSectionCardStyle.darkActiveBackground,
            QuicksaleSectionCardStyle.lightActiveBackground,
          ),
        }
      : {}),
  }),
  sectionIcon: ({ color }) => ({
    color: determinePropertyFromBrightness(color, 'black', 'white'),
  }),
}));

export default useStyle;
