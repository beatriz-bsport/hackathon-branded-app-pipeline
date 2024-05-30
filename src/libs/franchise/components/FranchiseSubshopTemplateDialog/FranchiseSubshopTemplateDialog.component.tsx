import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { Formik, Form, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import type { ShopListSubshopFormValues } from '#libs/shop/components/ShopListSubshopForm/types';
import type { SubshopTemplate } from '#libs/shop/types';

import { FranchiseSubshopTemplateDialogEnum } from './constants';

type FranchiseSubshopTemplateFormProps = Pick<
  Props,
  'dialogType' | 'handleClose'
>;

type Props = {
  isOpen?: boolean;
  dialogType: `${FranchiseSubshopTemplateDialogEnum}`;
  selectedSubshopTemplate?: SubshopTemplate;
  handleSubmit: (values: ShopListSubshopFormValues) => void;
  handleClose: () => void;
};

const franchiseShopListSubshopFormValidationSchema = Yup.object().shape({
  id: Yup.number().nullable(),
  name: Yup.string().required(),
});

const FranchiseSubshopTemplateForm: React.FC<
  FranchiseSubshopTemplateFormProps
> = ({ dialogType, handleClose }) => {
  const { t } = useTranslation(['shop', 'common']);

  const { handleChange, isValid, values } =
    useFormikContext<ShopListSubshopFormValues>();

  const classes = useStyles();

  const submitLabel = (() => {
    switch (dialogType) {
      case FranchiseSubshopTemplateDialogEnum.CREATE:
        return t('common:save');
      case FranchiseSubshopTemplateDialogEnum.UPDATE:
        return t('common:update');
      case FranchiseSubshopTemplateDialogEnum.DELETE:
        return t('common:delete');
      default:
        return '';
    }
  })();

  return (
    <Form noValidate>
      <DialogTitle>
        {t(`shop:shopList.tab.products.franchiseSubshopDialog.${dialogType}`)}
      </DialogTitle>

      <DialogContent>
        {(dialogType === FranchiseSubshopTemplateDialogEnum.CREATE ||
          dialogType === FranchiseSubshopTemplateDialogEnum.UPDATE) && (
          <div className={classes.fieldsContainer}>
            <TextField
              autoFocus
              fullWidth
              label={t(
                'shop:shopList.tab.products.franchiseSubshopDialog.inputPlaceholder',
              )}
              name="name"
              onChange={handleChange}
              size="small"
              value={values.name}
              variant="outlined"
            />

            <Alert severity="info">
              {t('shop:shopList.tab.products.franchiseSubshopDialog.info')}
            </Alert>
          </div>
        )}

        {dialogType === FranchiseSubshopTemplateDialogEnum.DELETE && (
          <Typography>
            {t('shop:shopList.tab.products.franchiseSubshopDialog.deleteInfo')}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>{t('common:close')}</Button>
        <Button color="primary" disabled={!isValid} type="submit">
          {submitLabel}
        </Button>
      </DialogActions>
    </Form>
  );
};

/** Component handling create/update/delete of a subshop template */
const FranchiseSubshopTemplateDialog: React.FC<Props> = ({
  isOpen,
  dialogType,
  selectedSubshopTemplate,
  handleSubmit,
  handleClose,
}) => {
  const onSubmit = useCallback(
    (values: ShopListSubshopFormValues) => handleSubmit(values),
    [handleSubmit],
  );

  const initialValues: ShopListSubshopFormValues = useMemo(
    () => ({
      id: selectedSubshopTemplate?.id ?? null,
      name: selectedSubshopTemplate?.name ?? '',
    }),
    [selectedSubshopTemplate],
  );

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={handleClose} open={isOpen}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={franchiseShopListSubshopFormValidationSchema}
      >
        <FranchiseSubshopTemplateForm
          dialogType={dialogType}
          handleClose={handleClose}
        />
      </Formik>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default React.memo(FranchiseSubshopTemplateDialog);
