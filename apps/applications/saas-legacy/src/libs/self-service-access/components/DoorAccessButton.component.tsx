import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDoorAccessProvider } from '../hooks/useDoorAccessProvider';
import { Key01 } from '#src/components/untitledui';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import DoorAccessModal from './DoorAccessModal.component';
import Skeleton from '#src/components/css-only/Skeleton';
import { makeStyles } from '@material-ui/core';

type Props = {
  companyId: number;
};

const useStyles = makeStyles({
  loadingSkeleton: {
    // Using '&&' here to make the selector more specific to take priority
    '&&': {
      borderRadius: 'var(--bs-border-radius-pill)',
      height: 'var(--bs-component-height-button-md)',
      width: '100%',
    },
  },
});

export default function DoorAccessButton({ companyId }: Props) {
  const { t } = useTranslation(['b2c_accessControl']);
  const classes = useStyles();
  const { error, loading, isAvailable } = useDoorAccessProvider(companyId);
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return <Skeleton className={classes.loadingSkeleton} variant="rectangle" />;
  }

  if (!isAvailable || error) {
    return <></>;
  }

  return (
    <>
      <Button
        leftIcon={<Key01 stroke="currentColor" />}
        onClick={() => setIsOpen(true)}
        size="md"
      >
        {t('openDoorButton.button.openDoor')}
      </Button>
      {isOpen && (
        <DoorAccessModal
          companyId={companyId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
