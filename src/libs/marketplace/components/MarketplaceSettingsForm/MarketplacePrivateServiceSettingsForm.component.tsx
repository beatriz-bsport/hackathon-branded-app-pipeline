import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { MarketplacePrivateServiceData } from '../../types';
import { PrivateService } from '../../../private-service/types';

interface Props {
  privateServices: PrivateService[];
  config: MarketplacePrivateServiceData;
  onChange: (config: MarketplacePrivateServiceData) => void;
}

const MarketplacePrivateServiceSettingsForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('settings');

  return (
    <div className={classes.flexCol}>
      <FormControl className={classes.marginTop}>
        <InputLabel>
          {t('marketplaceSettings.createDialog.selectPrivateService')}
        </InputLabel>
        <Select
          value={props.config.serviceId || -1}
          onChange={(ev: any) => props.onChange({ serviceId: ev.target.value })}
        >
          <MenuItem value={null}>---</MenuItem>
          {props.privateServices.map((privateService) => (
            <MenuItem key={privateService.id} value={privateService.id}>
              {
                props.privateServices.find((ps) => ps.id === privateService.id)
                  .name
              }
            </MenuItem>
          ))}
        </Select>
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

export default MarketplacePrivateServiceSettingsForm;
