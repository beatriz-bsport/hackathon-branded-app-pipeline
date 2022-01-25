import React from 'react';

import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';

import { Button, Divider, LinearProgress } from '@material-ui/core';

import {
  PaymentCombo,
  ShopItem,
} from '@bsport/common/lib/master-data/available-payment.type';
import { OptionCallback } from '../../../state/types';
import { InstalmentPaymentApi } from '../types';
import { MONTHLY } from '../constants';

import { PaymentPack } from '#libs/payment-packs/types';
import { Giftcard } from '#libs/giftcard/types';
import InstalmentPaymentCompabilityForm from './InstalmentPaymentConfigurationCompability.form';
import InstalmentPaymentGeneralInfoForm from './InstalmentPaymentConfigurationGeneralInfo.form';
import { PrivatePass } from '#libs/private-service/types';
import InstalmentPaymentAdvancedForm from './InstalmentPaymentConfigurationAdvanced.form';

type OwnProps = {
  submit: (
    instalmentPayment: InstalmentPaymentApi,
    options?: OptionCallback<InstalmentPaymentApi>,
  ) => void;
  initial?: InstalmentPaymentApi;
  closeDialog?: () => void;
  resetInitial?: () => void;
  paymentPackList: Array<PaymentPack>;
  privatePassList: Array<PrivatePass>;
  comboList: Array<PaymentCombo>;
  shopItemList: Array<ShopItem>;
  giftcardList: Array<Giftcard>;
};
type Props = OwnProps;

export const InstalmentPaymentForm = (props: Props) => {
  const {
    initial,
    closeDialog,
    resetInitial,
    submit,
    paymentPackList,
    privatePassList,
    comboList,
    shopItemList,
    giftcardList,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation('instalmentPayment');
  const initialValues = initial;

  return (
    <div>
      <Formik
        enableReinitialize
        validationSchema={instalmentPaymentSchema}
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          submit(values, {
            onSuccess: () => {
              actions.setSubmitting(false);
              closeDialog && closeDialog();
              resetInitial && resetInitial();
            },
            onError: () => {
              actions.setSubmitting(false);
              closeDialog && closeDialog();
              resetInitial && resetInitial();
            },
          });
        }}
      >
        {(formikProps: FormikProps<InstalmentPaymentApi>) => {
          return (
            <form onSubmit={formikProps.handleSubmit}>
              <div className={classes.container}>
                <InstalmentPaymentGeneralInfoForm
                  recurrency={formikProps.values.recurrency}
                  frequency={formikProps.values.frequency}
                  number_of_billing={formikProps.values.number_of_billing}
                  hideFee
                />
                <Divider />
                <InstalmentPaymentCompabilityForm
                  setFieldValue={formikProps.setFieldValue}
                  paymentPackList={paymentPackList}
                  giftcardList={giftcardList}
                  comboList={comboList}
                  shopItemList={shopItemList}
                  privatePassList={privatePassList}
                  is_available_on_all_payment_pack={
                    formikProps.values.is_available_on_all_payment_pack
                  }
                  is_available_on_all_giftcard={
                    formikProps.values.is_available_on_all_giftcard
                  }
                  is_available_on_all_payment_combo={
                    formikProps.values.is_available_on_all_payment_combo
                  }
                  is_available_on_all_private_pass={
                    formikProps.values.is_available_on_all_private_pass
                  }
                  is_available_on_all_shop_item={
                    formikProps.values.is_available_on_all_shop_item
                  }
                />
                <Divider />
                <InstalmentPaymentAdvancedForm />
                <Divider />
                <div className={classes.action}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      closeDialog && closeDialog();
                      resetInitial && resetInitial();
                    }}
                  >
                    {t('form.cancel')}
                  </Button>
                  <Button color="primary" type="submit" variant="contained">
                    {t('form.save')}
                  </Button>
                </div>
              </div>
              {formikProps.isSubmitting ? <LinearProgress /> : null}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

InstalmentPaymentForm.defaultProps = {
  initial: {
    id: null,
    name: '',
    recurrency: MONTHLY,
    frequency: 1,
    number_of_billing: 12,
    fee: 0,
    minimum_amount: 0,
    is_only_available_when_all_items_are_compatible: true,
    payment_pack_list: [],
    is_available_on_all_payment_pack: false,
    private_pass_list: [],
    is_available_on_all_private_pass: false,
    payment_combo_list: [],
    is_available_on_all_payment_combo: false,
    giftcard_list: [],
    is_available_on_all_giftcard: false,
    shop_item_list: [],
    is_available_on_all_shop_item: false,
  } as InstalmentPaymentApi,
};

const useStyles = makeStyles<Theme>((theme) => ({
  action: {
    padding: theme.spacing(4),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
export default InstalmentPaymentForm;
const instalmentPaymentSchema = Yup.object().shape({
  name: Yup.string().required('common:form.requiredField'),
});
