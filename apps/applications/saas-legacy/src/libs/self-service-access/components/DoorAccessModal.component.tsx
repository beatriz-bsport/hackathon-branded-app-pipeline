import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';
import { PortalContainer } from '#Fabrique/PortalContainer';
import AppDownloadModalContent from './AppDownloadModalContent.component';
import GeolocationDoorSelection from './GeolocationDoorSelection.component';

type Props = {
  companyId: number;
  proximityProofProtectionEnabled: boolean;
  iosAppUrl: string;
  androidAppUrl: string;
  onClose: () => void;
};

const useStyles = makeStyles((theme) => ({
  modal: {
    width: '600px',
    [theme.breakpoints.down(600)]: {
      width: '100vw',
    },
  },
}));

export default function DoorAccessModal({
  companyId,
  proximityProofProtectionEnabled,
  iosAppUrl,
  androidAppUrl,
  onClose,
}: Props) {
  const { t } = useTranslation(['b2c_accessControl']);
  const classes = useStyles();

  return (
    <PortalContainer wrapperId="bs-door-access-portal-container">
      <Blanket className="bs-portals-blanket" isOpen={true}>
        <ModalDialog
          className={classes.modal}
          onClose={onClose}
          title={t('openDoorButton.modal.title')}
        >
          {proximityProofProtectionEnabled ? (
            <AppDownloadModalContent
              androidAppUrl={androidAppUrl}
              companyId={companyId}
              iosAppUrl={iosAppUrl}
            />
          ) : (
            <GeolocationDoorSelection companyId={companyId} />
          )}
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
}
