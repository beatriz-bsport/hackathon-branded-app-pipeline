import Button from '#src/components/css-only/Fabrique/ButtonV2';
import ListItem from '#src/components/css-only/Fabrique/ListItem';
import List from '#src/components/css-only/Fabrique/List';
import { ListItemTypeEnum } from '#src/components/css-only/Fabrique/ListItem/constants';
import Typography from '#src/components/css-only/Fabrique/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Door, GeolocationCoordinates } from '../types';
import { useFetchDoors } from '../hooks/useFetchDoors';
import { CircularProgress, makeStyles } from '@material-ui/core';
import useUnlockDoor from '../hooks/useUnlockDoor';
import { ValidationIcon } from '#src/components/icons/ValidationIcon.component';
import { ErrorIcon } from '#src/components/icons/ErrorIcon.component';

type Props = {
  companyId: number;
  userLocation: GeolocationCoordinates;
};

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(4),
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '50vh',
    minHeight: theme.spacing(30),
  },
  doorListWrapper: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
  },
  doorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  unlockButton: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
    flexShrink: 0,
  },
  statusArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(4),
  },
}));

export default function DoorSelection({ companyId, userLocation }: Props) {
  const { t } = useTranslation(['b2c_accessControl']);
  const classes = useStyles();
  const { doors, loading: loadingDoors } = useFetchDoors(
    companyId,
    userLocation,
  );
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);
  const {
    error,
    success,
    unlockDoor,
    loading: loadingUnlock,
  } = useUnlockDoor(companyId);

  const handleUnlock = async () => {
    if (selectedDoorId) {
      await unlockDoor(selectedDoorId);
    }
  };

  useEffect(() => {
    if (doors) {
      setSelectedDoorId(doors[0].id);
    }
  }, [doors]);

  if (loadingDoors || loadingUnlock) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
        <Typography align="center" variant="body-md">
          {loadingDoors && t('openDoorButton.loading.doors')}
          {loadingUnlock && t('openDoorButton.loading.unlock')}
        </Typography>
      </div>
    );
  }

  if (success) {
    return (
      <div className={classes.statusArea}>
        <ValidationIcon />
        <Typography align="center" color="success" variant="body-lg">
          {t('openDoorButton.status.success')}
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.statusArea}>
        <ErrorIcon />
        <Typography align="center" color="error" variant="body-lg">
          {error}
        </Typography>
      </div>
    );
  }

  if (!doors || doors.length === 0) {
    return (
      <div className={classes.statusArea}>
        <Typography align="center" variant="title-md">
          {t('openDoorButton.status.noDoors.title')}
        </Typography>
        <Typography align="center" variant="body-md">
          {t('openDoorButton.status.noDoors.description')}
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.doorListWrapper}>
        <List className={classes.doorList}>
          {doors?.map((door: Door) => (
            <ListItem
              key={door.id}
              captionText={door.description}
              inputId={`door-${door.id}`}
              isSelected={door.id === selectedDoorId}
              label={door.name}
              onClick={() => setSelectedDoorId(door.id)}
              type={ListItemTypeEnum.RADIO}
            />
          ))}
        </List>
      </div>
      <div className={classes.unlockButton}>
        <Button
          isDisabled={selectedDoorId === null}
          onClick={handleUnlock}
          size="lg"
        >
          {t('openDoorButton.button.unlockDoor')}
        </Button>
      </div>
    </div>
  );
}
