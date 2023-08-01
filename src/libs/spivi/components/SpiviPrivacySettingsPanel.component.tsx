import React from 'react';

import {
  Divider,
  Switch,
  Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { useTranslation } from 'react-i18next';
import ToolTip from '#components/Tooltip.component';
import { Member } from '../../member/types';

type Props = {
  member: Member;
  updateSpiviPrivacySettings: (memberId: number, value: boolean) => void;
  spiviPrivacySettingsLoading: boolean;
};

export const SpiviPrivacySettingsPanel = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation('consumerSpace');
  return (
    <div className={classes.spiviContainer}>
      <Typography className={classes.title} component="h2" variant="h6">
        {t('consumerSpace:spivi.settingsTitle')}
      </Typography>
      <Divider />
      <div className={classes.spiviRow}>
        <div className={classes.spiviSettings}>
          <Switch
            checked={props.member?.spivi_privacy_settings_accepted}
            color="primary"
            disabled={props.spiviPrivacySettingsLoading}
            onChange={(ev, value) => {
              props.updateSpiviPrivacySettings(props.member?.id, value);
            }}
          />
          <Typography>{t('consumerSpace:spivi.settings')}</Typography>
        </div>
        <ToolTip title={t('consumerSpace:spivi.settingsInfo')}>
          <InfoIcon color="disabled" />
        </ToolTip>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  spiviRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  spiviContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  spiviSettings: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

export default SpiviPrivacySettingsPanel;
