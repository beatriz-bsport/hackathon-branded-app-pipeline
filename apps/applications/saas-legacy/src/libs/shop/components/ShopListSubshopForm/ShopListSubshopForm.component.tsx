import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Formik, Form, FormikProps } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';

import type { SubShop } from '#src/libs/shop/types';
import type { ShopListSubshopFormValues } from './types';

type Props = {
  initial?: SubShop;
  onCancel: () => void;
  onSubmit: (values: ShopListSubshopFormValues) => void;
};

const ShopListSubshopForm: React.FC<Props> = ({
  initial,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation('shop');

  const classes = useStyles();

  const initialValues = useMemo(
    () => ({
      id: initial?.id ?? null,
      name: initial?.name ?? '',
    }),
    [initial?.id, initial?.name],
  );

  const handleSubmit = useCallback(
    (values: ShopListSubshopFormValues) => onSubmit(values),
    [onSubmit],
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ handleChange }: FormikProps<ShopListSubshopFormValues>) => (
        <Form className={classes.container}>
          <Grid container alignItems="center" direction="row">
            <Grid item>
              <TextField
                autoFocus
                required
                name="name"
                onChange={handleChange}
                placeholder={t('shopList.tab.products.subshopForm.field.name')}
              />
            </Grid>

            <Grid item>
              <IconButton color="primary" type="submit">
                <SaveIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton color="secondary" onClick={onCancel}>
                <CancelIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

export default React.memo(ShopListSubshopForm);
