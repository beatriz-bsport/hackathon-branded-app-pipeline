import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  makeStyles,
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { MarketplacePassData } from '../../../marketplace/types';
import { PaymentPackCategory } from '../../../payment-packs/types';
import { PrivatePassCategory } from '#libs/private-service/types';

interface Props {
  config?: MarketplacePassData;
  paymentPackCategories: Array<PaymentPackCategory>;
  privatePassCategories: Array<PrivatePassCategory>;
  onChange: (config: MarketplacePassData) => void;
}

const defaultConfig = {
  hidePaymentPack: false,
  hidePrivatePass: false,
  hidePaymentCombo: false,
};

const MarketplacePassSettingsForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.flexCol}>
      {props.paymentPackCategories && (
        <Autocomplete
          multiple
          options={[...props.paymentPackCategories]}
          getOptionLabel={(cat) => cat.name}
          value={[
            ...props.paymentPackCategories.filter(
              (cat) =>
                props.config.paymentPackCategories &&
                props.config.paymentPackCategories.includes(cat.id),
            ),
          ]}
          onChange={(e, cat) =>
            props.onChange({
              ...props.config,
              paymentPackCategories: cat.map((c) => c.id),
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t('paymentPack:category.category')}
              placeholder={t('paymentPack:category.category')}
            />
          )}
        />
      )}
      {props.privatePassCategories && (
        <Autocomplete
          className={classes.selector}
          multiple
          options={[...props.privatePassCategories]}
          getOptionLabel={(cat) => cat.name}
          value={[
            ...props.privatePassCategories.filter(
              (cat) =>
                props.config.privatePassCategories &&
                props.config.privatePassCategories.includes(cat.id),
            ),
          ]}
          onChange={(e, cat) =>
            props.onChange({
              ...props.config,
              privatePassCategories: cat.map((c) => c.id),
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t('privateService:categoryTitle')}
              placeholder={t('privateService:categoryTitle')}
            />
          )}
        />
      )}
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
          label={t('settings:marketplaceSettings.createDialog.hidePaymentPack')}
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
          label={t('settings:marketplaceSettings.createDialog.hidePrivatePass')}
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
          label={t(
            'settings:marketplaceSettings.createDialog.hidePaymentCombo',
          )}
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
    marginTop: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(4),
  },
  selector: {
    marginTop: theme.spacing(2),
  },
}));

export default MarketplacePassSettingsForm;
