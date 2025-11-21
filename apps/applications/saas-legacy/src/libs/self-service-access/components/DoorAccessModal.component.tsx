import React from 'react';
import { useTranslation } from 'react-i18next';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';
import { PortalContainer } from '#Fabrique/PortalContainer';
import Typography from '#src/components/css-only/Fabrique/Typography';
import { CircularProgress, makeStyles } from '@material-ui/core';
import DoorSelection from './DoorSelection.component';
import { useGeolocation } from '../hooks/useGeolocation';
import { ErrorIcon } from '#src/components/icons/ErrorIcon.component';

type Props = {
  companyId: number;
  onClose: () => void;
};

type WrapperProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const useStyles = makeStyles((theme) => ({
  modal: {
    width: '600px',
    [theme.breakpoints.down(600)]: {
      width: '100vw',
    },
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(4),
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
  statusArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(4),
  },
}));

const DoorAccessModalWrapper = ({ children, onClose }: WrapperProps) => {
  const { t } = useTranslation(['consumerSpace']);
  const classes = useStyles();

  return (
    <PortalContainer wrapperId="bs-door-access-portal-container">
      <Blanket className="bs-portals-blanket" isOpen={true}>
        <ModalDialog
          className={classes.modal}
          onClose={onClose}
          title={t('consumerSpace:reworked.selfServiceAccess.modal.title')}
        >
          {children}
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

const DoorAccessModalContent = ({ companyId }: Pick<Props, 'companyId'>) => {
  const { t } = useTranslation(['consumerSpace']);
  const classes = useStyles();
  const { loading, error, userLocation } = useGeolocation();

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
        <Typography align="center" variant="body-md">
          {t('consumerSpace:reworked.selfServiceAccess.loading.geolocation')}
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.statusArea}>
        <ErrorIcon />
        <Typography align="center" color="error" variant="body-lg">
          {error.message}
        </Typography>
      </div>
    );
  }

  return <DoorSelection companyId={companyId} userLocation={userLocation} />;
};

export default function DoorAccessModal({ companyId, onClose }: Props) {
  return (
    <DoorAccessModalWrapper onClose={onClose}>
      <DoorAccessModalContent companyId={companyId} />
    </DoorAccessModalWrapper>
  );
}
