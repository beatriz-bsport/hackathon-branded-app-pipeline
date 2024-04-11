import React from 'react';

import { Form, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import NumericInput from '#components/input/NumericInput.component';

import type { ShopItemUpdateProvisionFormValues } from './types';

type Props = {
  isLoading?: boolean;
  onClose: () => void;
};

const ShopItemUpdateProvisionForm: React.FC<Props> = ({
  isLoading,
  onClose,
}) => {
  const { t } = useTranslation(['common', 'shop']);

  const classes = useStyles();

  const { isValid, values, errors, handleChange } =
    useFormikContext<ShopItemUpdateProvisionFormValues>();

  return (
    <Form noValidate className={classes.formContainer}>
      <Typography variant="h6">{t('shop:provision.form.title')}</Typography>

      <div className={classes.fieldContainer}>
        <NumericInput
          fullWidth
          error={!!errors.quantity}
          helperText={t(
            errors?.quantity ?? 'shop:provision.form.quantityHelperText',
          )}
          label={t('shop:provision.form.quantityLabel')}
          name="quantity"
          onChange={handleChange}
          value={values.quantity}
          variant="outlined"
        />
      </div>

      <div className={classes.actionsContainer}>
        <Button color="secondary" onClick={onClose}>
          {t('common:cancel')}
        </Button>
        <Button color="primary" disabled={!isValid || isLoading} type="submit">
          {t('common:save')}
        </Button>
      </div>
    </Form>
  );
};

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    padding: theme.spacing(2),
    gap: theme.spacing(1),
  },
  fieldContainer: {
    paddingTop: theme.spacing(2),
    flex: 1,
  },
  actionsContainer: {
    alignSelf: 'flex-end',
  },
}));

export default React.memo(ShopItemUpdateProvisionForm);
