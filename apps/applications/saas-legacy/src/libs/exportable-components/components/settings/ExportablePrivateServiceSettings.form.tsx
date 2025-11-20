import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  TextField,
  FormHelperText,
  LinearProgress,
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

  if (!props.config) return <LinearProgress />;

  let typeValue = props.config?.type;

  if (!typeValue) {
    if (typeof props.config?.serviceId === 'number') {
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
          onChange={(ev: any) => props.onChange({ type: ev.target.value })}
          value={typeValue}
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
          multiple
          className={classes.marginTop}
          getOptionLabel={(option) => option.name}
          onChange={onPrivateGroupChange}
          options={[...props.serviceGroupList]}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('privateService:serviceGroup.selector.placeholder')}
              placeholder={t(
                'privateService:serviceGroup.selector.placeholder',
              )}
              variant="standard"
            />
          )}
          value={[
            ...props.serviceGroupList.filter(
              (group) =>
                props.config.privateGroups &&
                props.config.privateGroups.includes(group.id),
            ),
          ]}
        />
      )}

      {typeValue === 'detail' && (
        <FormControl className={classes.marginTop}>
          <InputLabel>
            {t('marketplaceSettings.createDialog.selectPrivateService')}
          </InputLabel>
          <Select
            required
            onChange={(ev: any) =>
              props.onChange({ type: typeValue, serviceId: ev.target.value })
            }
            value={props.config.serviceId || -1}
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
