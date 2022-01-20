import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MarketplacePaymentPackTemplateData } from '../../../marketplace/types';

import { PaymentPackTemplate } from '#libs/payment-packs/types';

interface Props {
  paymentPackTemplateListAvailable: Array<PaymentPackTemplate>;
  config?: MarketplacePaymentPackTemplateData;
  onChange: (config: MarketplacePaymentPackTemplateData) => void;
  error?: string;
}

const ExportablePaymentPackTemplateSettings: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('paymentPack');
  const { paymentPackTemplateListAvailable, config } = props;
  if (!config) {
    return null;
  }
  return (
    <div className={classes.marginTop}>
      <Autocomplete
        multiple
        options={[...paymentPackTemplateListAvailable]}
        getOptionLabel={(option) => option.name?.slice(0, 25)}
        value={[
          ...paymentPackTemplateListAvailable.filter((paymentPackTemplate) =>
            config.paymentPackTemplateList?.includes(paymentPackTemplate.id),
          ),
        ]}
        onChange={(e, values) =>
          props.onChange({
            paymentPackTemplateList: values.map(
              (paymentPackTemplate) => paymentPackTemplate.id,
            ),
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={t('paymentPackTemplate.widget.choose')}
            placeholder={t('paymentPackTemplate.widget.choose')}
          />
        )}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(1),
  },
}));

export default ExportablePaymentPackTemplateSettings;
