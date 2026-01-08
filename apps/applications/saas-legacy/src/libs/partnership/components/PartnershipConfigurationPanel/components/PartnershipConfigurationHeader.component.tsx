import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { PartnershipDisplayConfig } from '#src/libs/partnership/types';

type Props = {
  displayConfig: PartnershipDisplayConfig;
};

const PartnershipConfigurationHeader: React.FC<Props> = ({ displayConfig }) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();
  return (
    <div className={classes.header}>
      {displayConfig.icon}
      <Typography color="textSecondary" variant="subtitle1">
        {t(
          `${displayConfig.partnershipIdentifier}.configuration.panel.header.subtitle`,
        )}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export default React.memo(PartnershipConfigurationHeader);
