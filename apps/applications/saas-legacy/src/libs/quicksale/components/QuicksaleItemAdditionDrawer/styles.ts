import { makeStyles } from '@material-ui/core';
import { NO_RESULT_ALERT_BACKGROUND_COLOR } from '../../constants';

const useStyle = makeStyles((theme) => ({
  drawerHeader: {
    marginBottom: theme.spacing(3),
  },
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  drawerTitleTypography: {
    fontSize: '24px',
  },
  resultListContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: theme.spacing(37.5),
    overflow: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    alignItems: 'center',
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  justifySelfEnd: {
    justifySelf: 'flex-end',
    textAlign: 'end',
  },
  popper: {
    zIndex: 9999,
  },
  objectGroupButton: {
    fontWeight: 500,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(1),
  },
  noResultAlert: {
    height: theme.spacing(5),
    width: theme.spacing(22.25),
    alignItems: 'center',
    borderRadius: theme.spacing(4.25),
    color: '#000',
    backgroundColor: NO_RESULT_ALERT_BACKGROUND_COLOR,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  dialogActions: {
    margin: theme.spacing(4),
    padding: 0,
  },
  formSectionIconContainer: {
    height: theme.spacing(5.5),
    width: theme.spacing(5.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(32, 157, 130, 0.1)',
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(1.25),
  },
}));

export default useStyle;
