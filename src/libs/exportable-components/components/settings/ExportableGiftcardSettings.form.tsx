import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MarketplaceGiftcardData } from '../../../marketplace/types';

import { Giftcard } from '../../../giftcard/types';

interface Props {
  giftcards: Array<Giftcard>;
  config?: MarketplaceGiftcardData;
  onChange: (config: MarketplaceGiftcardData) => void;
  error?: string;
}

const MarketplaceGiftcardSettingsForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('giftcard');

  if (!props.config) {
    return null;
  }

  return (
    <div className={classes.marginTop}>
      <Autocomplete
        multiple
        options={[...props.giftcards]}
        getOptionLabel={(option) => option.name.slice(0, 25)}
        value={[
          ...props.giftcards.filter((g) =>
            props.config.giftcards?.includes(g.id),
          ),
        ]}
        onChange={(e, values) =>
          props.onChange({ giftcards: values.map((g) => g.id) })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={t('widget')}
            placeholder={t('widget')}
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

export default MarketplaceGiftcardSettingsForm;
