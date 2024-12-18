import { Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles<Theme, { isSelected?: boolean }>((theme) => ({
  container: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    display: 'flex',
    gap: theme.spacing(2.5),
    background: 'white',
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(1.5),
    alignItems: 'center',
  },
  addBasketButton: {
    background: theme.palette.grey[200],
    padding: theme.spacing(1),
    height: 40,
  },
  basketChipContainer: ({ isSelected }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    gap: theme.spacing(1),
    borderRadius: theme.spacing(1.5),
    cursor: 'pointer',
    ...(isSelected ? { backgroundColor: theme.palette.grey[200] } : {}),
  }),
  basketChipAvatar: ({ isSelected }) => ({
    height: 32,
    width: 32,
    ...(isSelected
      ? { border: `2px solid ${theme.palette.primary.main}` }
      : {}),
  }),
  basketInfo: {
    display: 'flex',
    flexDirection: 'column',
    whiteSpace: 'nowrap',
  },
  basketPrice: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  basketPriceWarning: {
    color: theme.palette.warning.main,
    height: 18,
  },
  basketListContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    overflowX: 'auto',
    // Safari, Chrom, Opera : hide scrollbar
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    // Ie and Edge : hide scrollbar
    '-ms-overflow-style': 'none',
    // Firefox : hide scrollbar
    scrollbarWidth: 'none',
  },
}));

export default useStyles;
