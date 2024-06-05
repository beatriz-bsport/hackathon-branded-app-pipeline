import React, { useCallback, useMemo } from 'react';

import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';
import { Formik, Form, FormikProps } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import type { ShopSupplier } from '#src/libs/shop/types';
import type { ShopListSettingsSupplierValues } from './types';

import shopListSettingsSupplierSchema from './shopListSettingsSupplierSchema';

type Props = {
  open?: boolean;
  initial?: ShopSupplier;
  handleCancel: () => void;
  handleSubmit: (
    values: ShopListSettingsSupplierValues,
    hasInitial?: boolean,
  ) => void;
};

const ShopListSettingsSupplierModal: React.FC<Props> = ({
  open,
  initial,
  handleCancel,
  handleSubmit,
}) => {
  const classes = useStyles();

  const { t } = useTranslation(['common', 'shop']);

  const initialValues = useMemo(
    () => ({
      id: initial?.id ?? null,
      name: initial?.name ?? '',
      description: initial?.description ?? '',
    }),
    [initial?.description, initial?.id, initial?.name],
  );

  const onSubmit = useCallback(
    (values: ShopListSettingsSupplierValues) => handleSubmit(values, !!initial),
    [handleSubmit, initial],
  );

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={handleCancel} open={open}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={shopListSettingsSupplierSchema}
      >
        {({
          handleChange,
          values,
          errors,
        }: FormikProps<ShopListSettingsSupplierValues>) => (
          <Form>
            <>
              <DialogTitle>
                {initial
                  ? t(
                      'shop:shopList.tab.settings.section.suppliers.modal.titleUpdate',
                    )
                  : t(
                      'shop:shopList.tab.settings.section.suppliers.modal.titleCreate',
                    )}
              </DialogTitle>
              <DialogContent>
                <Grid container className={classes.fieldsContainer} spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus
                      className={classes.field}
                      error={!!errors.name}
                      helperText={!!errors.name && t(errors.name)}
                      label={t(
                        'shop:shopList.tab.settings.section.suppliers.modal.field.name',
                      )}
                      name="name"
                      onChange={handleChange}
                      value={values.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      multiline
                      className={classes.field}
                      error={!!errors.description}
                      helperText={!!errors.description && t(errors.description)}
                      label={t(
                        'shop:shopList.tab.settings.section.suppliers.modal.field.description',
                      )}
                      minRows={5}
                      name="description"
                      onChange={handleChange}
                      value={values.description}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel}>{t('common:cancel')}</Button>
                <Button
                  color="primary"
                  disabled={isEqual(values, initial)}
                  type="submit"
                >
                  {t('common:save')}
                </Button>
              </DialogActions>
            </>
          </Form>
        )}
      </Formik>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles(() => ({
  fieldsContainer: {
    overflow: 'initial',
  },
  field: {
    width: '100%',
  },
}));

export default React.memo(ShopListSettingsSupplierModal);
