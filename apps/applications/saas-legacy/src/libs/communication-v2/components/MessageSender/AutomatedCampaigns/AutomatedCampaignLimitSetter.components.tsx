import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { MenuItem, Select, Typography, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';

type AutomatedCampaignLimitSetterProps = {
  setLimit: (limit: number) => void;
  limit: number;
};

const AutomatedCampaignLimitSetter: React.FC<
  AutomatedCampaignLimitSetterProps
> = ({ setLimit, limit }) => {
  const { automatedCommunicationKind } = useCommunicationContext();
  const classes = useStyles();
  const { t } = useTranslation('communication');

  const handleSelectLimit = useCallback(
    // This is the definition required by the official documentation here : https://v4.mui.com/components/selects/#select
    // That is why I choosed to use unknown and then to assert the type so that I can avoid type errors
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const value = event?.target?.value;
      if (typeof value === 'number') setLimit(value);
    },
    [setLimit],
  );

  return (
    <>
      <div className={classes.limitSection}>
        <div className={classes.headerWithIcon}>
          <RemoveCircleIcon className={classes.leftIcon} />
          <Typography variant="h6">
            {t('campaign.automated.form.limitSection')}
          </Typography>
        </div>
        <div className={classes.selectContainer}>
          <Typography variant="caption">
            {t('campaign.automated.form.max_communications_sent_per_member')}
          </Typography>
          <Select onChange={handleSelectLimit} value={limit}>
            <MenuItem value={0}>
              <Typography>{t('campaign.automated.form.unlimited')}</Typography>
            </MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </div>
        <Alert className={classes.alert} severity="info" variant="outlined">
          {t(
            `campaign.automated.form.maxCommunicationSentHelperText.${automatedCommunicationKind}`,
          )}
        </Alert>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  selectContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  limitSection: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    gap: theme.spacing(2),
  },
  center: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  headerWithIcon: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  alert: {
    alignItems: 'center',
  },
  adornment: {
    paddingLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

export default React.memo(AutomatedCampaignLimitSetter);
