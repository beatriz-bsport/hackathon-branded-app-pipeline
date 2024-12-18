import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useEstablishmentSelection from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks/establishmentSelection.hook';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import SessionList from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SessionList';
import type { SessionSelectorProps } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/types';

const SessionSelectorReworked: React.FC<SessionSelectorProps> = ({
  coaches,
  coachDisplay,
  duration,
  onSessionSelect,
}) => {
  const { t } = useTranslation('privateService');

  const classes = useStyles();

  const { activeEstablishment } = useContext(SlotSelectorContext);

  const {
    availableEstablishments,
    handleSelectEstablishment,
    showEstablishmentSelector,
  } = useEstablishmentSelection();

  return (
    <div className={classes.container}>
      <Typography variant="subtitle2">{t('slotSearcher.pickASlot')}</Typography>
      <Paper className={classes.container2}>
        {showEstablishmentSelector && (
          <Tabs
            centered
            indicatorColor="primary"
            onChange={handleSelectEstablishment}
            textColor="primary"
            value={activeEstablishment?.id ?? ''}
            variant="scrollable"
          >
            {availableEstablishments.map((establishment) => (
              <Tab
                key={establishment.id}
                label={establishment.title}
                value={establishment.id}
              />
            ))}
          </Tabs>
        )}
        <div className={classes.sessionsContainer}>
          <SessionList
            coachDisplay={coachDisplay}
            coaches={coaches}
            duration={duration}
            onSessionSelect={onSessionSelect}
          />
        </div>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  sessionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(SessionSelectorReworked);
