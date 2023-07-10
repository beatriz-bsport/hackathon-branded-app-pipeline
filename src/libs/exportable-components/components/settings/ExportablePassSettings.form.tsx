import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { MarketplacePassData } from '#libs/marketplace/types';
import { PaymentPackCategory } from '#libs/payment-packs/types';
import { PrivatePassCategory } from '#libs/private-service/types';

interface Props {
  config?: MarketplacePassData;
  paymentPackCategories: PaymentPackCategory[];
  privatePassCategories: PrivatePassCategory[];
  onChange: (config: MarketplacePassData) => void;
}

type DefaultConfig = {
  hideFilters: boolean;
  hidePaymentPack: boolean;
  hidePrivatePass: boolean;
  hidePaymentCombo: boolean;
};

const defaultConfig: DefaultConfig = {
  hideFilters: false,
  hidePaymentPack: false,
  hidePrivatePass: false,
  hidePaymentCombo: false,
};

const ExportablePassSettingsForm: React.FC<Props> = React.memo(
  ({ paymentPackCategories, privatePassCategories, config, onChange }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const handleChangePaymentPackCategories = useCallback(
      (
        _event: React.ChangeEvent<HTMLSelectElement>,
        categories: PaymentPackCategory[],
      ) => {
        onChange({
          ...config,
          paymentPackCategories: categories.map((category) => category.id),
        });
      },
      [config, onChange],
    );

    const handleChangePrivatePassCategories = useCallback(
      (
        _event: React.ChangeEvent<HTMLSelectElement>,
        categories: PrivatePassCategory[],
      ) => {
        onChange({
          ...config,
          privatePassCategories: categories.map((category) => category.id),
        });
      },
      [config, onChange],
    );

    const handleChangeConfigSetting = useCallback(
      (configKey: keyof DefaultConfig) => {
        onChange({
          ...(config || defaultConfig),
          [configKey]: !(config || defaultConfig)[configKey],
        });
      },
      [config, onChange],
    );

    const handleToggleHidePaymentPack = useCallback(() => {
      handleChangeConfigSetting('hidePaymentPack');
    }, [handleChangeConfigSetting]);

    const handleToggleHidePrivatePass = useCallback(() => {
      handleChangeConfigSetting('hidePrivatePass');
    }, [handleChangeConfigSetting]);

    const handleToggleHidePaymentCombo = useCallback(() => {
      handleChangeConfigSetting('hidePaymentCombo');
    }, [handleChangeConfigSetting]);

    const handleToggleHideFilters = useCallback(() => {
      handleChangeConfigSetting('hideFilters');
    }, [handleChangeConfigSetting]);

    const getOptionLabel = useCallback(
      (category: PaymentPackCategory) => category.name,
      [],
    );

    const selectedPaymentPackCategories = useMemo(
      () => [
        ...paymentPackCategories.filter(
          (category) =>
            config?.paymentPackCategories &&
            config?.paymentPackCategories.includes(category.id),
        ),
      ],
      [config?.paymentPackCategories, paymentPackCategories],
    );

    const selectedPrivatePassCategories = useMemo(
      () => [
        ...privatePassCategories.filter(
          (category) =>
            config?.privatePassCategories &&
            config?.privatePassCategories.includes(category.id),
        ),
      ],
      [config?.privatePassCategories, privatePassCategories],
    );

    return (
      <div className={classes.flexCol}>
        {paymentPackCategories && (
          <Autocomplete
            multiple
            options={paymentPackCategories}
            getOptionLabel={getOptionLabel}
            value={selectedPaymentPackCategories}
            onChange={handleChangePaymentPackCategories}
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
        {privatePassCategories && (
          <Autocomplete
            className={classes.selector}
            multiple
            options={privatePassCategories}
            getOptionLabel={getOptionLabel}
            value={selectedPrivatePassCategories}
            onChange={handleChangePrivatePassCategories}
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
                checked={config && config.hidePaymentPack}
                onChange={handleToggleHidePaymentPack}
              />
            }
            label={t(
              'settings:marketplaceSettings.createDialog.hidePaymentPack',
            )}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={config && config.hidePrivatePass}
                onChange={handleToggleHidePrivatePass}
              />
            }
            label={t(
              'settings:marketplaceSettings.createDialog.hidePrivatePass',
            )}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={config && config.hidePaymentCombo}
                onChange={handleToggleHidePaymentCombo}
              />
            }
            label={t(
              'settings:marketplaceSettings.createDialog.hidePaymentCombo',
            )}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={config && config.hideFilters}
                onChange={handleToggleHideFilters}
              />
            }
            label={t('settings:marketplaceSettings.createDialog.hideFilters')}
          />
        </FormControl>
      </div>
    );
  },
);

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

export default ExportablePassSettingsForm;
