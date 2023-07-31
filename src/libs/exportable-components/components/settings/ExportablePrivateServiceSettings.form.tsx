import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  TextField,
  FormHelperText,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  PrivateService,
  PrivateServiceGroup,
} from '../../../private-service/types';

interface Props {
  privateServices: PrivateService[];
  serviceGroupList: PrivateServiceGroup[];
  error?: string;
  config: any;
  onChange: (config: any) => void;
}

const MarketplacePrivateServiceSettingsForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('settings');

  let typeValue = props.config.type;

  if (!typeValue) {
    if (typeof props.config.serviceId === 'number') {
      typeValue = 'detail';
    } else {
      typeValue = 'list';
    }
  }

  const onPrivateGroupChange = (e: any, newValue: PrivateServiceGroup[]) => {
    props.onChange({
      ...props.config,
      privateGroups: newValue.map((group) => group.id),
    });
  };

  return (
    <div className={classes.flexCol}>
      <FormControl className={classes.marginTop}>
        <InputLabel>
          {t('marketplaceSettings.createDialog.selectPrivateServiceType')}
        </InputLabel>
        <Select
          value={typeValue}
          onChange={(ev: any) => props.onChange({ type: ev.target.value })}
        >
          <MenuItem value="list">
            {t('marketplaceSettings.createDialog.selectPrivateServiceTypeList')}
          </MenuItem>
          <MenuItem value="detail">
            {t(
              'marketplaceSettings.createDialog.selectPrivateServiceTypeDetail',
            )}
          </MenuItem>
        </Select>
      </FormControl>

      {typeValue === 'list' && (
        <Autocomplete
          className={classes.marginTop}
          multiple
          options={[...props.serviceGroupList]}
          getOptionLabel={(option) => option.name}
          value={[
            ...props.serviceGroupList.filter(
              (group) =>
                props.config.privateGroups &&
                props.config.privateGroups.includes(group.id),
            ),
          ]}
          onChange={onPrivateGroupChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t('privateService:serviceGroup.selector.placeholder')}
              placeholder={t(
                'privateService:serviceGroup.selector.placeholder',
              )}
            />
          )}
        />
      )}

      {typeValue === 'detail' && (
        <FormControl className={classes.marginTop}>
          <InputLabel>
            {t('marketplaceSettings.createDialog.selectPrivateService')}
          </InputLabel>
          <Select
            required
            value={props.config.serviceId || -1}
            onChange={(ev: any) =>
              props.onChange({ type: typeValue, serviceId: ev.target.value })
            }
          >
            <MenuItem value={null}>---</MenuItem>
            {props.privateServices.map((privateService) => (
              <MenuItem key={privateService.id} value={privateService.id}>
                {privateService.name}
              </MenuItem>
            ))}
          </Select>
          {props.error && (
            <FormHelperText error>{t(props.error)}</FormHelperText>
          )}
        </FormControl>
      )}
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
