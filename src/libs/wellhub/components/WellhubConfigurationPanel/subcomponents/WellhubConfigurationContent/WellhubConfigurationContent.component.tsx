import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import InformationIcon from '#src/components/InformationIcon';
import WellhubGymTable from './WellhubGymTable.component';
import type { WellhubGym } from '#src/libs/wellhub/types';

type Props = { wellhubGyms: WellhubGym[] };

const WellhubConfigurationContent: React.FC<Props> = ({ wellhubGyms }) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();
  return (
    <div className={classes.content}>
      <div className={classes.header}>
        <Typography variant="h6">
          {t('wellhub.configuration.panel.content.title')}
        </Typography>
        <InformationIcon
          text={t('wellhub.configuration.panel.content.helperText')}
        />
      </div>
      <WellhubGymTable wellhubGyms={wellhubGyms} />
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

export default React.memo(WellhubConfigurationContent);
