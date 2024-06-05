import React, { useMemo, useCallback } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';

interface Props {
  source: string[];
  value: string;
  onChange: (type: string) => void;
  error?: string;
}

const ExportableComponentSelector = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation('settings');
  const { value, onChange, error } = props;
  const options = useMemo(
    () =>
      props.source.map((component) => ({
        label: t(`marketplaceSettings.componentType.${component}`),
        value: component,
      })),
    [props.source, t],
  );

  const selected = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const onSelect = useCallback(
    (option) => {
      onChange(option.value);
    },
    [onChange],
  );

  return (
    <div className={classes.fullWidth}>
      <Typography variant="caption">
        {t('marketplaceSettings.createDialog.selectComponent')}
      </Typography>
      <MaterialUISelector
        onChange={onSelect}
        options={options}
        value={selected}
      />
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default ExportableComponentSelector;

const useStyles = makeStyles(() => ({
  fullWidth: {
    width: '100%',
  },
}));
