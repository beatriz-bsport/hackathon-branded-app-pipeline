import { Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles<
  Theme,
  { selected?: boolean; showMemberCreateForm?: boolean }
>((theme) => ({
  dialogTitle: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 500,
  },
  closeIcon: {
    padding: 0,
  },
  dialogContent: ({ showMemberCreateForm }) => ({
    padding: showMemberCreateForm
      ? 0
      : `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  }),
  searchBarAndNewMember: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  addMemberButton: {
    padding: 0,
    color: theme.palette.primary.main,
    '&:hover': {
      background: 'transparent',
    },
  },
  addMemberIcon: {
    height: 36,
    width: 36,
  },
  dialogActions: {
    padding: theme.spacing(2),
    textAlign: 'right',
    display: 'flex',
    gap: theme.spacing(1.25),
  },
  confirmButton: {
    borderRadius: theme.spacing(1.5),
  },
  listItemContainer: ({ selected }) => ({
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cusros: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
    ...(selected ? { backgroundColor: theme.palette.grey[200] } : {}),
  }),
  listItemInfo: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  avatar: {
    height: 32,
    width: 32,
  },
  memberInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  memberEmailAndPhone: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  smallListItemChip: {
    display: 'flex',
    padding: `${theme.spacing(0.375)}px ${theme.spacing(0.5)}px`,
    alignItems: 'center',
    gap: theme.spacing(0.75),
    borderRadius: theme.spacing(0.5),
    background: theme.palette.grey[300],
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
  },
  alert: {
    alignItems: 'center',
    width: '100%',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 1),
  },
  spinner: {
    color: theme.palette.grey[300],
  },
}));

export default useStyles;
