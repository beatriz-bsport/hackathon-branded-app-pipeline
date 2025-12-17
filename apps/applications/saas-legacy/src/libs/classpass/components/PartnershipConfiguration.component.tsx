import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ClassPassLogo from '#src/libs/classpass/components/ClassPassLogo.component';
import ClassPassTable from './ClassPassTable.component';

type Props = {
  activitiesVenueEstablishmentList: {
    venueId: number;
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

      <div className={classes.subtitleAndButton}>
        <Typography className={classes.bold} variant="subtitle1">
          {t('parameters.partnerId', { company: companyId })}
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
