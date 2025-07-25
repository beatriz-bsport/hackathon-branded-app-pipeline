import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  link: {
    color: '#666',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  categoryLabel: {
    fontWeight: 'bold',
    color: '#202020',
  },
}));

export default useStyles;
