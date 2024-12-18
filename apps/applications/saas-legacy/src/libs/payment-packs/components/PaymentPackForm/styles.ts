import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  actionButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  divider: {
    backgroundColor: '#C6C6C6',
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
  formContainer: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
  firstFormContainer: {
    paddingBottom: theme.spacing(4),
  },
  actionContainer: {
    padding: theme.spacing(2),
  },
  infoText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  icon: {
    color: '#868686',
  },
  formikContainer: {
    paddingTop: theme.spacing(3),
  },
}));
