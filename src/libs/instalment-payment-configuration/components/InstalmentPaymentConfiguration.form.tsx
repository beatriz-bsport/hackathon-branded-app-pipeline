import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as Yup from 'yup';
import { Formik, FormikHelpers, FormikProps } from 'formik';

import { Button, Divider, LinearProgress } from '@material-ui/core';

import { ShopItem } from '@bsport/common/lib/master-data/available-payment.type';

import { PaymentCombo } from '#libs/payment-combo/types';
import { OptionCallback } from '../../../state/types';
import { InstalmentPaymentApi } from '../types';
import {
  CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT,
  CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT,
  MONTHLY,
} from '#libs/instalment-payment-configuration/constants';

import { PaymentPack } from '#libs/payment-packs/types';
import { Giftcard } from '#libs/giftcard/types';
import InstalmentPaymentCompabilityForm from './InstalmentPaymentConfigurationCompability.form';
import InstalmentPaymentGeneralInfoForm from './InstalmentPaymentConfigurationGeneralInfo.form';
import { PrivatePass } from '#libs/private-service/types';
import InstalmentPaymentAdvancedForm from './InstalmentPaymentConfigurationAdvanced.form';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.InstalmentPayment,
);

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
  isInDrawer: boolean;
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
    isInDrawer,
    comboList,
    shopItemList,
    giftcardList,
  } = props;
  React.useEffect(() => {
    trackFormAdd(initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();
  const { t } = useTranslation('instalmentPayment');
  const initialValues = initial;

  const handleSumit = useCallback(
    (
      values: InstalmentPaymentApi,
      actions: FormikHelpers<InstalmentPaymentApi>,
    ) => {
      const formattedData = { ...values };

      if (values.partial_payment_enabled) formattedData.number_of_billing = 1;

      if (
        values.custom_first_instalment_type.toString() !==
        CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT.toString()
      ) {
        formattedData.custom_first_instalment_amount = 20;
      }

      if (
        values.custom_first_instalment_type.toString() !==
        CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT.toString()
      ) {
        formattedData.custom_first_instalment_percent = 20;
      }

      submit(formattedData, {
        onSuccess: () => {
          trackFormSuccess(initial?.id);
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
    },
    [submit, initial?.id, closeDialog, resetInitial],
  );

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSumit}
        validationSchema={instalmentPaymentSchema}
      >
        {(formikProps: FormikProps<InstalmentPaymentApi>) => {
          return (
            <form onSubmit={formikProps.handleSubmit}>
              <div className={classes.container}>
                <InstalmentPaymentGeneralInfoForm />
                <Divider className={classes.divider} />
                <InstalmentPaymentCompabilityForm
                  comboList={comboList}
                  giftcardList={giftcardList}
                  is_available_on_all_giftcard={
                    formikProps.values.is_available_on_all_giftcard
                  }
                  is_available_on_all_payment_combo={
                    formikProps.values.is_available_on_all_payment_combo
                  }
                  is_available_on_all_payment_pack={
                    formikProps.values.is_available_on_all_payment_pack
                  }
                  is_available_on_all_private_pass={
                    formikProps.values.is_available_on_all_private_pass
                  }
                  is_available_on_all_shop_item={
                    formikProps.values.is_available_on_all_shop_item
                  }
                  isInDrawer={isInDrawer}
                  paymentPackList={paymentPackList}
                  privatePassList={privatePassList}
                  setFieldValue={formikProps.setFieldValue}
                  shopItemList={shopItemList}
                />
                <Divider className={classes.divider} />
                <InstalmentPaymentAdvancedForm />
                <Divider className={classes.divider} />
                <div className={classes.action}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      trackFormCancel(initial?.id);
                      closeDialog && closeDialog();
                      resetInitial && resetInitial();
                    }}
                  >
                    {t('form.cancel')}
                  </Button>
                  <Button
                    color="primary"
                    disabled={!formikProps.isValid || formikProps.isSubmitting}
                    onClick={() => {
                      trackFormSubmitIntent(initial?.id);
                    }}
                    type="submit"
                    variant="contained"
                  >
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
    custom_first_instalment_enabled: false,
    custom_first_instalment_type: 0,
    custom_first_instalment_percent: 20,
    custom_first_instalment_amount: 20,
    partial_payment_enabled: false,
  } as InstalmentPaymentApi,
};

const useStyles = makeStyles<Theme>((theme) => ({
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
  },
  column: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  divider: {
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
  },
}));
export default InstalmentPaymentForm;
const instalmentPaymentSchema = Yup.object().shape({
  name: Yup.string().required('common:form.requiredField'),
  frequency: Yup.number().min(1),
  custom_first_instalment_amount: Yup.number().test(
    'amountGreaterThan1',
    'instalmentPayment:validation.amountMin',
    function test(item) {
      if (
        (this.parent.custom_first_instalment_enabled ||
          this.parent.partial_payment_enabled) &&
        this.parent.custom_first_instalment_type.toString() ===
          CUSTOM_FIRST_INSTALMENT_TYPE_AMOUNT.toString()
      ) {
        return item >= 1;
      }
      return true;
    },
  ),
  custom_first_instalment_percent: Yup.number().test(
    'percentBetween1And100',
    'instalmentPayment:validation.percentRange',
    function test(item) {
      if (
        (this.parent.custom_first_instalment_enabled ||
          this.parent.partial_payment_enabled) &&
        this.parent.custom_first_instalment_type.toString() ===
          CUSTOM_FIRST_INSTALMENT_TYPE_PERCENT.toString()
      ) {
        return item >= 1 && item < 100;
      }
      return true;
    },
  ),
  number_of_billing: Yup.number().when('custom_first_instalment_enabled', {
    is: true,
    then: Yup.number().min(2),
  }),
});
