import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  breakSpaces: {
    whiteSpace: 'break-spaces',
  },
  fieldContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  choiceField: {
    marginLeft: theme.spacing(1.5),
    marginTop: theme.spacing(1.75),
  },
  flex: {
    display: 'flex',
  },
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(1) },

  rowContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },

  select: {
    minWidth: theme.spacing(20),
  },
  integerField: {
    width: theme.spacing(10),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    color: '#868686',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
