import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ConnectedProps, connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import LinearProgress from '@material-ui/core/LinearProgress';

import { RoleType } from '@bsport/common/lib/master-data/user-role';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

// @ts-expect-error
import { TextField } from '#components/forms';
import { RootState } from '../../../reducers';
import {
  createStaffUser,
  fetchCompanyUserRoles,
  deleteStaffUser,
} from '#libs/role/actions';
import { getRoleStateLoading, getUsers } from '#libs/role/selectors';
import { UserRole } from '#libs/role/types';
import PasswordInput from '#components/input/PasswordInput.component';
import { NO_RESULT_ALERT_BACKGROUND_COLOR } from '#libs/quicksale/constants';

type QuicksaleAccess = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

const AccessSchema = Yup.object().shape({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

type FormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: QuicksaleAccess) => void;
};

const AccessForm: React.FC<FormProps> = React.memo(
  ({ open, onClose, onSubmit }) => {
    const { t } = useTranslation('quicksale');

    const [password, setPassword] = React.useState('');

    return (
      <GenericResponsiveDialog maxWidth="sm" open={open} onClose={onClose}>
        <DialogTitle disableTypography>
          <Typography variant="h6">{t('rolePage.modalTitle')}</Typography>
        </DialogTitle>

        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            email: '',
            password: '',
          }}
          validationSchema={AccessSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
              <DialogContent>
                <TextField
                  placeholder={t('rolePage.firstName')}
                  name="first_name"
                  fullWidth
                  label={t('rolePage.firstName')}
                />
                <TextField
                  placeholder={t('rolePage.lastName')}
                  name="last_name"
                  fullWidth
                  label={t('rolePage.lastName')}
                />
                <TextField
                  placeholder={t('rolePage.email')}
                  name="email"
                  fullWidth
                  label={`${t('rolePage.email')} *`}
                />
                <PasswordInput
                  fullWidth
                  helperText=""
                  label={`${t('rolePage.password')} *`}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setPassword(e.target.value);
                    formik.setFieldValue('password', e.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>{t('rolePage.cancel')}</Button>
                <Button
                  onClick={() => {
                    formik.handleSubmit();
                    setPassword('');
                  }}
                  color="primary"
                >
                  {t('rolePage.submit')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </GenericResponsiveDialog>
    );
  },
);

type RowProps = {
  user: UserRole;
  removeAccess: (userId: number) => void;
};

const Row: React.FC<RowProps> = React.memo(({ user, removeAccess }) => {
  const classes = useStyles();

  const removeUser = React.useCallback(
    () => removeAccess(user.id),
    [removeAccess, user.id],
  );

  return (
    <TableRow>
      <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell align="right">
        <IconButton
          onClick={removeUser}
          className={classes.removeAccessIconButton}
        >
          <RemoveCircle className={classes.removeAccessIcon} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

type OwnProps = {};

type Props = OwnProps & ConnectedProps<typeof connector>;

const QuicksaleRoleConfiguration: React.FC<Props> = ({
  authorizedUsers,
  loading,
  createAccess,
  fetchAccesses,
  removeAccess,
}) => {
  const { t } = useTranslation('quicksale');

  const classes = useStyles();

  React.useEffect(() => {
    fetchAccesses({ role__in: [RoleType.USER_ROLE_QUICKSALE] });
  }, [fetchAccesses]);

  const [showAccessCreationModal, setShowAccessCreationModal] =
    React.useState(false);

  const openAccessCreationModal = React.useCallback(
    () => setShowAccessCreationModal(true),
    [],
  );

  const closeAccessCreationModal = React.useCallback(
    () => setShowAccessCreationModal(false),
    [],
  );

  const createQuicksaleAccess = React.useCallback(
    (data: QuicksaleAccess) => {
      createAccess({
        ...data,
        role: RoleType.USER_ROLE_QUICKSALE,
        coaches_in_role_ids: [],
      });
      closeAccessCreationModal();
    },
    [closeAccessCreationModal, createAccess],
  );

  return (
    <>
      <div className={classes.container}>
        <Typography variant="h6">{t('rolePage.title')}</Typography>

        <Alert severity="info" className={classes.alertInfo}>
          {t('rolePage.subtitle')}
        </Alert>

        <div className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('rolePage.staffColumn')}</TableCell>
                <TableCell>{t('rolePage.emailColumn')}</TableCell>
                <TableCell align="right">
                  {t('rolePage.actionColumn')}
                </TableCell>
              </TableRow>
            </TableHead>
            {!loading && authorizedUsers?.length > 0 && (
              <TableBody>
                {authorizedUsers.map((user) => (
                  <Row key={user.id} user={user} removeAccess={removeAccess} />
                ))}
              </TableBody>
            )}
          </Table>
          {loading && <LinearProgress className={classes.linearProgress} />}
          {!loading && authorizedUsers?.length === 0 && (
            <Alert severity="info" className={classes.emptyResultAlert}>
              {t('rolePage.noResult')}
            </Alert>
          )}
        </div>

        <Button
          variant="outlined"
          color="primary"
          onClick={openAccessCreationModal}
          className={classes.addAccessButton}
        >
          <Add className={classes.addAccessIcon} />
          {t('rolePage.addAccess')}
        </Button>
      </div>

      <AccessForm
        open={showAccessCreationModal}
        onClose={closeAccessCreationModal}
        onSubmit={createQuicksaleAccess}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    background: 'white',
    margin: theme.spacing(2),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    padding: theme.spacing(2),
    height: 'auto',
  },
  addAccessButton: {
    width: 'fit-content',
  },
  addAccessIcon: {
    marginRight: theme.spacing(1),
  },
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  tableContainer: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  removeAccessIconButton: {
    padding: 0,
  },
  removeAccessIcon: {
    color: theme.palette.error.main,
  },
  emptyResultAlert: {
    marginTop: theme.spacing(1),
    borderRadius: '32px',
    width: 'fit-content',
    color: 'black',
    backgroundColor: NO_RESULT_ALERT_BACKGROUND_COLOR,
    '& > *:first-child': {
      color: 'black',
    },
  },
  linearProgress: {
    width: '100%',
  },
}));

const connector = connect(
  (state: RootState) => ({
    authorizedUsers: getUsers(state),
    loading: getRoleStateLoading(state),
  }),
  {
    createAccess: createStaffUser,
    fetchAccesses: fetchCompanyUserRoles,
    removeAccess: deleteStaffUser,
  },
);

export default compose(connector, React.memo)(QuicksaleRoleConfiguration);
