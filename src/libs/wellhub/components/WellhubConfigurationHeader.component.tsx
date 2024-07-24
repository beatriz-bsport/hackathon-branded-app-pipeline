import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import WellhubIcon from '#src/components/icons/WellhubIcon.component';

type Props = {};

const WellhubConfigurationHeader: React.FC<Props> = () => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();
  return (
    <div className={classes.header}>
      <WellhubIcon />
      <Typography color="textSecondary" variant="subtitle1">
        {t('wellhub.configuration.panel.header.subtitle')}
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

export default React.memo(WellhubConfigurationHeader);
