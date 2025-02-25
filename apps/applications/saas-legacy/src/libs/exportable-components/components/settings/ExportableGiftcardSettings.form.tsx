import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MarketplaceGiftcardData } from '../../../marketplace/types';

import { Giftcard } from '#src/libs/giftcard/types';

interface Props {
  giftcards: Array<Giftcard>;
  config?: MarketplaceGiftcardData;
  onChange: (config: MarketplaceGiftcardData) => void;
  error?: string;
}

const MarketplaceGiftcardSettingsForm: React.FC<Props> = ({
  onChange,
  giftcards,
  config,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('giftcard');

  const value = React.useMemo(
    () => [
      ...(giftcards ?? []).filter((giftcard) =>
        config?.giftcards?.includes(giftcard.id),
      ),
    ],
    [giftcards, config?.giftcards],
  );

  const handleChange = React.useCallback(
    (e, values: Giftcard[]) => onChange({ giftcards: values.map((g) => g.id) }),
    [onChange],
  );

  if (!config) {
    return null;
  }

  return (
    <div className={classes.flexContainer}>
      <div className={classes.marginTop}>
        <Autocomplete
          multiple
          getOptionLabel={(option) => option.name.slice(0, 25)}
          onChange={handleChange}
          options={[...giftcards]}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('widget')}
              placeholder={t('widget')}
              variant="standard"
            />
          )}
          value={value}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
}));

export default MarketplaceGiftcardSettingsForm;
