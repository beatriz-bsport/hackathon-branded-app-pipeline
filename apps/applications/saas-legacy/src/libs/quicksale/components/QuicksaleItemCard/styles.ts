import { Theme, makeStyles } from '@material-ui/core';
import { QuicksaleItemCardStyle, QuicksaleItemColor } from '../../constants';
import {
  determinePropertyFromBrightness,
  getBorderColorFromBackgroundColor,
} from '../../utils';

const useStyle = makeStyles<
  Theme,
  { color: QuicksaleItemColor; isClickable: boolean }
>((theme) => ({
  container: ({ color, isClickable }) => ({
    minWidth: QuicksaleItemCardStyle.minWidth,
    minHeight: QuicksaleItemCardStyle.minHeight,
    aspectRatio: QuicksaleItemCardStyle.aspectRatio.toString(),
    border: `1px solid ${getBorderColorFromBackgroundColor(color)}`,
    padding: theme.spacing(1.375),
    containerType: 'inline-size',
    ...(isClickable ? { cursor: 'pointer' } : {}),
  }),
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    gap: theme.spacing(1),
  },
  dragIconButton: ({ color }) => ({
    padding: 0,
    paddingTop: theme.spacing(0.25),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    ...determinePropertyFromBrightness(color, {}, { color: 'white' }),
  }),
  cardTitleAndSubtitle: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cardTitle: {
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      whiteSpace: 'nowrap',
    },
    [theme.breakpoints.up('sm')]: {
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
  },
  cardSubtitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
  },
  cardFooter: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  priceAndRecurrence: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  cardPrice: {
    fontWeight: 500,
  },
  cardRecurrence: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  restrictionIcons: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
  restrictionIcon: ({ color }) => ({
    color: determinePropertyFromBrightness(
      color,
      theme.palette.action.active,
      'white',
    ),
  }),
}));

export default useStyle;
