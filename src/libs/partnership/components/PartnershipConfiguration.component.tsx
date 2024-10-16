import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ClassPassLogo from '#src/libs/partnership/components/ClassPassLogo.component';
import ClassPassTable from './ClassPassTable.component';

type Props = {
  activitiesVenueEstablishmentList: {
    venueId: number;
    establishmentNames: string[];
  }[];
  appointmentsVenueEstablishmentList: {
    venueId: string;
    establishmentNames: string[];
  }[];
  companyId: number;
  isLoading: boolean;
  openPartnershipConfigurationForm: () => void;
  requestClasspassPartnership: () => void;
  shouldRequestClassPassPartnership: boolean;
};

const PartnershipConfiguration: React.FC<Props> = ({
  activitiesVenueEstablishmentList,
  appointmentsVenueEstablishmentList,
  companyId,
  isLoading,
  openPartnershipConfigurationForm,
  requestClasspassPartnership,
  shouldRequestClassPassPartnership,
}) => {
  const { t } = useTranslation('partnership');

  const classes = useStyles();

  if (shouldRequestClassPassPartnership) {
    return (
      <Paper className={classes.paper}>
        <div className={classes.subtitleAndButton}>
          <ClassPassLogo />
          <Button
            color="primary"
            onClick={requestClasspassPartnership}
            variant="outlined"
          >
            {t('actions.requestPartnership')}
          </Button>
        </div>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <ClassPassLogo />
      <Typography color="textSecondary" variant="subtitle1">
        {t('parameters.description')}
      </Typography>
      <Typography className={classes.bold} variant="subtitle1">
        {t('parameters.partnerId', { company: companyId })}
      </Typography>
      <div className={classes.subtitleAndButton}>
        <Typography variant="h6">
          {t('parameters.table.title.groupActivities')}
        </Typography>
        <Button
          color="primary"
          onClick={openPartnershipConfigurationForm}
          variant="outlined"
        >
          {t('parameters.editButton')}
        </Button>
      </div>
      <ClassPassTable
        isLoading={isLoading}
        venueEstablishmentList={activitiesVenueEstablishmentList}
      />
      <Typography variant="h6">
        {t('parameters.table.title.appointments')}
      </Typography>
      <ClassPassTable
        isLoading={isLoading}
        venueEstablishmentList={appointmentsVenueEstablishmentList}
      />
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: 500 },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
  subtitleAndButton: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default React.memo(PartnershipConfiguration);
