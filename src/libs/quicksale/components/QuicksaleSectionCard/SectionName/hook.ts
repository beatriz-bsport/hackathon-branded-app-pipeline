import { Theme, makeStyles } from '@material-ui/core';
import {
  QuicksaleSectionCardStyle,
  QuicksaleSectionColor,
} from '../../../constants';
import { determinePropertyFromBrightness } from '../../../utils';

const useStyle = makeStyles<
  Theme,
  { admin: boolean; color: QuicksaleSectionColor }
>((theme) => ({
  cardTitleContainer: ({ color }) => ({
    height: theme.spacing(5),
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    '&:hover': {
      background: determinePropertyFromBrightness(
        color,
        QuicksaleSectionCardStyle.darkHoverBackground,
        QuicksaleSectionCardStyle.lightHoverBackground,
      ),
    },
  }),
  cardTitle: ({ admin }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...(!admin ? { marginLeft: theme.spacing(1) } : {}),
  }),
  nameInput: ({ color }) => ({
    color: determinePropertyFromBrightness(color, 'black', 'white'),
    width: '100%',
    marginRight: theme.spacing(6.5),
  }),
  nameInputUnderline: ({ color }) => ({
    borderBottom: determinePropertyFromBrightness(
      color,
      '1px solid black',
      '1px solid white',
    ),
    '&:before': {
      borderBottom: 'none',
      transition: 'none',
      content: 'none',
    },
    '&:after': {
      borderBottom: 'none',
    },
  }),
  confirmNameChangeIconButton: ({ color }) => ({
    padding: 0,
    color: determinePropertyFromBrightness(color, 'black', 'white'),
  }),
}));

export default useStyle;
