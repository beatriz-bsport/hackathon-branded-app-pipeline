import React, { useCallback } from 'react';

import { useFormikContext } from 'formik';
import { Creatable } from 'react-select';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import type { ShopItemFormValues, ShopItemVariantOption } from './types';

type Props = {
  handlePreviousStep?: () => void;
  onCancel?: () => void;
};

const ShopItemFormVariantStep: React.FC<Props> = ({
  handlePreviousStep,
  onCancel,
}) => {
  const { t } = useTranslation('shop');

  const classes = useStyles();

  const { values, errors, setFieldValue } =
    useFormikContext<ShopItemFormValues>();

  const handleSetColors = useCallback(
    (value: ShopItemVariantOption[]) => setFieldValue('colors', value),
    [setFieldValue],
  );

  const handleSetSizes = useCallback(
    (value: ShopItemVariantOption[]) => setFieldValue('sizes', value),
    [setFieldValue],
  );

  const hasColorError = errors.colors?.length > 0;

  const hasSizeError = errors.sizes?.length > 0;

  return (
    <>
      <Grid
        container
        alignContent="flex-start"
        className={classes.gridContainer}
        spacing={4}
      >
        <Grid item xs={12}>
          <Typography variant="body2">
            {t('shopitem.form.variantHelperText')}
          </Typography>
        </Grid>
        <Grid item className={classes.gridItemContainer} xs={12}>
          <Creatable
            isClearable
            isMulti
            name="colors"
            onChange={handleSetColors}
            options={values.colors}
            placeholder={t('shopitem.form.colors.title')}
            value={values.colors}
          />
          <Typography
            color={hasColorError ? 'error' : 'initial'}
            variant="caption"
          >
            {hasColorError
              ? t('shopitem.form.error.colorSize')
              : t('shopitem.form.colors.helperText')}
          </Typography>
        </Grid>
        <Grid item className={classes.gridItemContainer} xs={12}>
          <Creatable
            isClearable
            isMulti
            name="sizes"
            onChange={handleSetSizes}
            options={values.sizes}
            placeholder={t('shopitem.form.sizes.title')}
            value={values.sizes}
          />
          <Typography
            color={hasSizeError ? 'error' : 'initial'}
            variant="caption"
          >
            {hasSizeError
              ? t('shopitem.form.error.colorSize')
              : t('shopitem.form.sizes.helperText')}
          </Typography>
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        {!!handlePreviousStep && (
          <Button onClick={handlePreviousStep}>{t('common:back')}</Button>
        )}
        {!!onCancel && <Button onClick={onCancel}>{t('common:cancel')}</Button>}
        <Button color="primary" type="submit" variant="contained">
          {t('common:save')}
        </Button>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    height: '100%',
  },
  gridItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
    gap: theme.spacing(1),
  },
}));

export default React.memo(ShopItemFormVariantStep);
