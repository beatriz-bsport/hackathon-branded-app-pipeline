import React from 'react';
import {
  makeStyles,
  FormControl,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { MarketplacePassData } from '../../types';

interface Props {
  config?: MarketplacePassData;
  onChange: (config: MarketplacePassData) => void;
}

const defaultConfig = {
  hidePaymentPack: false,
  hidePrivatePass: false,
  hidePaymentCombo: false,
};

const MarketplacePassSettingsForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('settings');

  return (
    <div className={classes.flexCol}>
      <FormControl className={classes.marginTop}>
        <FormControlLabel
          control={
            <Checkbox
              checked={props.config && props.config.hidePaymentPack}
              onChange={() =>
                props.onChange({
                  ...(props.config || defaultConfig),
                  hidePaymentPack: !(props.config || defaultConfig)
                    .hidePaymentPack,
                })
              }
              name="gilad"
            />
          }
          label={t('marketplaceSettings.createDialog.hidePaymentPack')}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={props.config && props.config.hidePrivatePass}
              onChange={() =>
                props.onChange({
                  ...(props.config || defaultConfig),
                  hidePrivatePass: !(props.config || defaultConfig)
                    .hidePrivatePass,
                })
              }
              name="gilad"
            />
          }
          label={t('marketplaceSettings.createDialog.hidePrivatePass')}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={props.config && props.config.hidePaymentCombo}
              onChange={() =>
                props.onChange({
                  ...(props.config || defaultConfig),
                  hidePaymentCombo: !(props.config || defaultConfig)
                    .hidePaymentCombo,
                })
              }
              name="gilad"
            />
          }
          label={t('marketplaceSettings.createDialog.hidePaymentCombo')}
        />
      </FormControl>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  marginTop: {
    marginTop: theme.spacing(4),
  },
}));

export default MarketplacePassSettingsForm;
