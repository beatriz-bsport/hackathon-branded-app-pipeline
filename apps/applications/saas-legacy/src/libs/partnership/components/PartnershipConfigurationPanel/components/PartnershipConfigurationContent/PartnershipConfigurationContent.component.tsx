import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import InformationIcon from '#src/components/InformationIcon';
import PartnershipVenueTable from './PartnershipVenueTable.component';
import {
  PartnershipDisplayConfig,
  PartnershipVenue,
} from '#src/libs/partnership/types';

type Props = {
  displayConfig: PartnershipDisplayConfig;
  partnershipVenues: PartnershipVenue[];
  loading: boolean;
  onDeleteVenue: (partnershipVenue: PartnershipVenue) => void;
  onEditVenue: (partnershipVenue: PartnershipVenue) => void;
};

const PartnershipConfigurationContent: React.FC<Props> = ({
  displayConfig,
  partnershipVenues,
  loading,
  onDeleteVenue,
  onEditVenue,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();
  return (
    <div className={classes.content}>
      <div className={classes.header}>
        <Typography variant="h6">
          {t(
            `${displayConfig.partnershipIdentifier}.configuration.panel.content.title`,
          )}
        </Typography>
        {displayConfig.helperTextKey && (
          <InformationIcon text={t(displayConfig.helperTextKey)} />
        )}
      </div>
      <PartnershipVenueTable
        displayConfig={displayConfig}
        loading={loading}
        onDeleteVenue={onDeleteVenue}
        onEditVenue={onEditVenue}
        partnershipVenues={partnershipVenues}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  header: {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

export default React.memo(PartnershipConfigurationContent);
