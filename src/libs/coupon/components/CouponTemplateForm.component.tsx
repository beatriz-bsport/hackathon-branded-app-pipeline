import React from 'react';
import { withState, compose } from 'recompose';
import * as Yup from 'yup';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Form, withFormik, FormikProps } from 'formik';
import { InfoOutlined } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { DateTime } from 'luxon';
import Button from '@material-ui/core/Button';
import {
  VOUCHER_TYPE_PERCENT,
  VOUCHER_TYPE_AMOUNT,
} from '@bsport/common/lib/master-data/coupon';
import {
  COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE,
  COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE,
  COUPON_SUBSCRIPTION_MODE_ALL_INVOICES,
  COUPON_SUBSCRIPTION_MODE_NONE,
} from '@bsport/common/lib/master-data/coupon-subscription-mode';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items';
import { CircularProgress } from '@material-ui/core';
import { OptionCallback } from '../../../state/types';
import CouponTemplateUpdateWarningDialog from '#libs/coupon/components/CouponTemplateUpdateWarningDialog.component';
import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';
import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import PrivatePassListItem from '../../private-service/components/pass/PrivatePassListItem.component';
// @ts-expect-error
import PrivatePassSelector from '../../private-service/components/pass/PrivatePassSelector.component';
import {
  PriceField,
  TextField,
  CheckboxField,
  RadioGroupField,
  DateField,
  // @ts-expect-error
} from '../../../components/forms';

import type { PaymentPackTemplate } from '#libs/payment-packs/types';
import type { PrivatePassTemplate } from '#libs/private-service/types';
import type { CouponTemplate } from '#libs/coupon/types';

const ALL_BUYABLES = 100;

type InitialValues = {
  id?: number;
  name: string;
  code: string;
  voucher_type: string;
  amount_off: number;
  percent_off: number;
  applies_to: string;
  only_on_objects: Array<number>;
  is_active: boolean;
  with_expiration_date: boolean;
  expiration_date: string;
  usage_per_member: number;
  usage_total: number;
  only_on_first_checkout: boolean;
  combinable: boolean;
  subscription_mode: string;
  minimum_amount: number;
};

type WithStateProps = {
  warningDialogOpen: boolean;
  setWarningDialogOpen: (b: boolean) => void;
  dataToSubmit: any;
};

type OwnProps = {
  paymentPackTemplateList: Array<PaymentPackTemplate>;
  privatePassTemplateList: Array<PrivatePassTemplate>;
  onClose: () => void;
  onSubmit: (data: any, options?: OptionCallback) => void;
};
type Props = OwnProps & FormikProps<InitialValues> & WithStateProps;

const useStyles = makeStyles((theme: Theme) => {
  return {
    reductionInputs: {
      width: '50%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    fullWidth: { width: '100%' },
    radioField: {
      marginBottom: theme.spacing(1),
    },
    checkboxField: {
      marginBottom: theme.spacing(2),
    },
    formSection: {
      marginBottom: theme.spacing(4),
    },
    fieldGroup: {
      marginTop: theme.spacing(2),
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: theme.spacing(4),
      width: '100%',
      '& button': {
        marginLeft: theme.spacing(2),
      },
    },
    disclaimerContainer: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.palette.info.main,
      borderRadius: '5px',
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    redLeftIcon: {
      color: theme.palette.info.main,
      marginRight: theme.spacing(2),
    },
    darkBlue: {
      color: '#0B79D0',
    },
  };
});

export const CouponTemplateForm = (props: Props) => {
  const { values } = props;
  const { t } = useTranslation('coupon');
  const classes = useStyles();

  const onDeletePackOrPass = (id: number) => {
    const newObjects = props.values.only_on_objects.filter((ido) => ido !== id);
    props.setFieldValue('only_on_objects', newObjects);
  };

  return (
    <>
      <Form>
        <div className={classes.formSection}>
          <Typography variant="h6">{t('form.section.general')}</Typography>
          <TextField
            fullWidth
            required
            label={t('form.name.label')}
            name="name"
          />
          <TextField
            fullWidth
            required
            helperText={t('form.code.helperTextFranchise')}
            label={t('form.code.label')}
            name="code"
          />
        </div>

        <div className={classes.formSection}>
          <Typography variant="h6">
            {t('form.section.voucherConfig')}
          </Typography>
          <div className={classes.fieldGroup}>
            <div className={classes.radioField}>
              <RadioGroupField
                choices={[
                  {
                    label: t('form.voucher_type.percent'),
                    value: VOUCHER_TYPE_PERCENT.toString(),
                  },
                  {
                    label: t('form.voucher_type.amount'),
                    value: VOUCHER_TYPE_AMOUNT.toString(),
                  },
                ]}
                name="voucher_type"
              />
            </div>
            {values.voucher_type === VOUCHER_TYPE_PERCENT.toString() && (
              <div className={classes.reductionInputs}>
                <TextField
                  fullWidth
                  required
                  InputProps={{
                    inputProps: { min: 0, max: 100, step: 0.005 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  label={t('form.percent_off.label')}
                  max={100}
                  name="percent_off"
                  type="number"
                />
              </div>
            )}
            {values.voucher_type === VOUCHER_TYPE_AMOUNT.toString() && (
              <div className={classes.reductionInputs}>
                <PriceField
                  fullWidth
                  required
                  label={t('form.amount_off.label')}
                  name="amount_off"
                />
              </div>
            )}
          </div>
        </div>

        <div className={classes.formSection}>
          <Typography variant="h6">{t('form.section.applies_to')}</Typography>
          <div className={classes.disclaimerContainer}>
            <InfoOutlined className={classes.redLeftIcon} />
            <Typography className={classes.darkBlue} variant="body1">
              {t('couponTemplate.formDisclaimer')}
            </Typography>
          </div>
          <div className={classes.fieldGroup}>
            <RadioGroup
              name="applies_to"
              onChange={(ev) => {
                if (
                  [
                    BUYABLE_ITEM_PASS,
                    BUYABLE_ITEM_FEE,
                    BUYABLE_ITEM_PRIVATE_PASS,
                    ALL_BUYABLES,
                  ].includes(parseInt(ev.target.value, 10))
                ) {
                  props.setFieldValue('only_on_objects', []);
                  props.setFieldValue('applies_to', ev.target.value);
                }
              }}
              value={values.applies_to}
            >
              <FormControlLabel
                className={classes.radioField}
                control={
                  <Radio
                    checked={values.applies_to === BUYABLE_ITEM_PASS.toString()}
                  />
                }
                label={t(
                  `form.applies_to.choicesFranchise.${BUYABLE_ITEM_PASS}`,
                )}
                value={BUYABLE_ITEM_PASS.toString()}
              />
              <div className={classes.fullWidth}>
                <PaymentPackSelector
                  nullCurrentValue
                  helperText={t('form.selectorPlaceholder.paymentPack')}
                  onChange={(id) => {
                    let newObjects = [...values.only_on_objects];
                    if (values.applies_to !== BUYABLE_ITEM_PASS.toString()) {
                      props.setFieldValue(
                        'applies_to',
                        BUYABLE_ITEM_PASS.toString(),
                      );
                      newObjects = [];
                    }
                    newObjects.push(id);
                    props.setFieldValue('only_on_objects', newObjects);
                  }}
                  paymentPacks={props.paymentPackTemplateList
                    .filter((ppt) => !ppt.disabled)
                    .filter((ppt) => !values.only_on_objects.includes(ppt.id))}
                />
                {values.applies_to === BUYABLE_ITEM_PASS.toString()
                  ? values.only_on_objects.map((id, i) => (
                      <PaymentPackListItem
                        key={`${id}-${i}`}
                        onDelete={() => onDeletePackOrPass(id)}
                        // @ts-expect-error
                        pack={props.paymentPackTemplateList.find(
                          (ppt) => ppt.id === id,
                        )}
                      />
                    ))
                  : null}
              </div>
              <FormControlLabel
                className={classes.radioField}
                control={
                  <Radio
                    checked={
                      values.applies_to === BUYABLE_ITEM_PRIVATE_PASS.toString()
                    }
                  />
                }
                label={t(
                  `form.applies_to.choicesFranchise.${BUYABLE_ITEM_PRIVATE_PASS}`,
                )}
                value={BUYABLE_ITEM_PRIVATE_PASS.toString()}
              />
              <div className={classes.fullWidth}>
                <PrivatePassSelector
                  nullCurrentValue
                  helperText={t('form.selectorPlaceholder.privatePass')}
                  onChange={(id: number) => {
                    let newObjects = [...values.only_on_objects];
                    if (
                      values.applies_to !== BUYABLE_ITEM_PRIVATE_PASS.toString()
                    ) {
                      props.setFieldValue(
                        'applies_to',
                        BUYABLE_ITEM_PRIVATE_PASS.toString(),
                      );
                      newObjects = [];
                    }
                    newObjects.push(id);
                    props.setFieldValue('only_on_objects', newObjects);
                  }}
                  privatePassList={props.privatePassTemplateList
                    .filter((ppt) => !ppt.disabled)
                    .filter((ppt) => !values.only_on_objects.includes(ppt.id))}
                />
                {values.applies_to === BUYABLE_ITEM_PRIVATE_PASS.toString()
                  ? values.only_on_objects.map((id, i) => (
                      <PrivatePassListItem
                        key={`${id}-${i}`}
                        dense
                        onDelete={() => onDeletePackOrPass(id)}
                        // @ts-expect-error
                        pass={props.privatePassTemplateList.find(
                          (ppt) => ppt.id === id,
                        )}
                      />
                    ))
                  : null}
              </div>
              <FormControlLabel
                className={classes.radioField}
                control={
                  <Radio
                    checked={values.applies_to === BUYABLE_ITEM_FEE.toString()}
                  />
                }
                label={t(`form.applies_to.choices.${BUYABLE_ITEM_FEE}`)}
                value={BUYABLE_ITEM_FEE.toString()}
              />
              <FormControlLabel
                className={classes.radioField}
                control={
                  <Radio
                    checked={values.applies_to === ALL_BUYABLES.toString()}
                  />
                }
                label={t('form.applies_to.choices.all')}
                value={ALL_BUYABLES.toString()}
              />
            </RadioGroup>
          </div>
        </div>

        <div className={classes.formSection}>
          <Typography variant="h6">{t('form.section.availability')}</Typography>
          <CheckboxField
            helperText={t('form.is_active.helperText')}
            label={t('form.is_active.label')}
            name="is_active"
          />
          <CheckboxField
            label={t('form.with_expiration_date.label')}
            name="with_expiration_date"
          />
          <div className={classes.fieldGroup}>
            <DateField
              disabled={!values.with_expiration_date}
              label={t('form.expiration_date.label')}
              name="expiration_date"
            />
          </div>
        </div>

        <div className={classes.formSection}>
          <Typography variant="h6">{t('form.section.usability')}</Typography>
          <div className={classes.fieldGroup}>
            <TextField
              fullWidth
              label={t('form.usage_per_member.label')}
              name="usage_per_member"
            />
            <TextField
              fullWidth
              label={t('form.usage_total.label')}
              name="usage_total"
            />
          </div>
        </div>

        <div className={classes.formSection}>
          <Typography variant="h6">{t('form.section.subscription')}</Typography>
          <div className={classes.fieldGroup}>
            <RadioGroupField
              choices={[
                {
                  label: t(
                    `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE}`,
                  ),
                  value: COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE.toString(),
                },
                {
                  label: t(
                    `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE}`,
                  ),
                  value: COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE.toString(),
                },
                {
                  label: t(
                    `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_ALL_INVOICES}`,
                  ),
                  value: COUPON_SUBSCRIPTION_MODE_ALL_INVOICES.toString(),
                },
                {
                  label: t(
                    `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_NONE}`,
                  ),
                  value: COUPON_SUBSCRIPTION_MODE_NONE.toString(),
                },
              ]}
              name="subscription_mode"
            />
          </div>
        </div>

        <div className={classes.formSection}>
          <Typography variant="h6">{t('form.section.advanced')}</Typography>

          <div className={classes.fieldGroup}>
            <div className={classes.checkboxField}>
              <CheckboxField
                label={t('form.only_on_first_checkout.label')}
                name="only_on_first_checkout"
              />
            </div>
            <div className={classes.checkboxField}>
              <CheckboxField
                label={t('form.combinable.label')}
                name="combinable"
              />
            </div>
            <PriceField
              fullWidth
              label={t('form.minimum_amount.label')}
              name="minimum_amount"
            />
          </div>
        </div>

        <div className={classes.buttonContainer}>
          <Button disabled={props.isSubmitting} onClick={props.onClose}>
            {t('form.actions.cancel')}
          </Button>
          {props.isSubmitting ? (
            <CircularProgress />
          ) : (
            <Button color="primary" type="submit" variant="contained">
              {t('form.actions.submit')}
            </Button>
          )}
        </div>
      </Form>
      {props.warningDialogOpen && (
        <CouponTemplateUpdateWarningDialog
          onClose={() => props.setWarningDialogOpen(false)}
          onSubmit={() =>
            props.onSubmit({ ...props.dataToSubmit, reset_instances: true })
          }
        />
      )}
    </>
  );
};

const CouponTemplateValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  code: Yup.string().required().max(32),
  voucher_type: Yup.string().required(),
  amount_off: Yup.number().min(0),
  percent_off: Yup.number().min(0).max(100),
  applies_to: Yup.string().required(),
  only_on_objects: Yup.array().of(Yup.number()),
  is_active: Yup.boolean().required(),
  with_expiration_date: Yup.boolean().required(),
  expiration_date: Yup.string().required(),
  usage_per_member: Yup.number().min(1).required(),
  usage_total: Yup.number().min(1).required(),
  only_on_first_checkout: Yup.boolean().required(),
  combinable: Yup.boolean().required(),
  minimum_amount: Yup.number().min(0).required(),
  subscription_mode: Yup.string().required(),
});

export const couponTemplateFormikHOC = withFormik<
  Props & {
    initial?: CouponTemplate;
    setDataToSubmit: (data: any) => void;
  },
  any
>({
  mapPropsToValues: ({ initial }) =>
    Object.assign(
      {
        name: '',
        code: '',
        voucher_type: VOUCHER_TYPE_PERCENT.toString(),
        amount_off: 0,
        percent_off: 0,
        applies_to: BUYABLE_ITEM_PASS.toString(),
        only_on_objects: [],
        is_active: true,
        with_expiration_date: false,
        expiration_date: DateTime.now().plus({ months: 6 }).toISODate(),
        usage_per_member: 1,
        usage_total: 1000,
        only_on_first_checkout: false,
        combinable: false,
        minimum_amount: 0,
        subscription_mode: COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE.toString(),
      },
      (initial && {
        ...initial,
        voucher_type: initial.voucher_type.toString(),
        applies_to: initial.applies_to
          ? initial.applies_to.toString()
          : ALL_BUYABLES.toString(),
        with_expiration_date: !!initial.expiration_date,
        expiration_date:
          initial.expiration_date ||
          DateTime.now().plus({ months: 6 }).toISODate(),
        amount_off: initial.amount_off || 0,
        percent_off: initial.percent_off || 0,
        subscription_mode: initial.subscription_mode.toString(),
      }) ||
        {},
    ),

  validationSchema: CouponTemplateValidationSchema,
  handleSubmit: (
    values,
    {
      props: { onSubmit, initial, setDataToSubmit, setWarningDialogOpen },
      setSubmitting,
    },
  ) => {
    const data = {
      id: values.id,
      name: values.name,
      code: values.code,
      voucher_type: parseInt(values.voucher_type, 10),
      only_on_objects: values.only_on_objects,
      is_active: values.is_active,
      expiration_date: null,
      usage_per_member: values.usage_per_member,
      usage_total: values.usage_total,
      only_on_first_checkout: values.only_on_first_checkout,
      combinable: values.combinable,
      minimum_amount: values.minimum_amount,
      subscription_mode: parseInt(values.subscription_mode, 10),
      amount_off: values.amount_off,
    } as any;

    if (data.voucher_type === VOUCHER_TYPE_PERCENT) {
      data.percent_off = values.percent_off;
      data.amount_off = 0;
    } else {
      data.voucher_type = VOUCHER_TYPE_AMOUNT;
      data.percent_off = 0;
      data.amount_off = values.amount_off;
    }

    if (values.applies_to !== ALL_BUYABLES.toString()) {
      data.applies_to = parseInt(values.applies_to, 10);
    } else {
      data.applies_to = null;
    }

    if (values.with_expiration_date) {
      data.expiration_date = DateTime.fromISO(
        values.expiration_date,
      ).toISODate();
    }

    // If user wants to update 'applies_to' or 'only_on_objects' field, we don't submit the form
    // right away, but we display a warning dialog and if he accepts, we submit the updated
    // couponTemplate data along with a 'reset_instances' param that will tell the backend to
    // disable every coupon template instances
    if (
      initial?.coupon_template_instances?.length &&
      [BUYABLE_ITEM_PASS, BUYABLE_ITEM_PRIVATE_PASS].includes(
        data.applies_to,
      ) &&
      data.only_on_objects.length > 0 &&
      (data.applies_to !== initial.applies_to ||
        data.only_on_objects !== initial.only_on_objects)
    ) {
      setDataToSubmit(data);
      setWarningDialogOpen(true);
      setSubmitting(false);
      return;
    }

    onSubmit(data, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  withState('warningDialogOpen', 'setWarningDialogOpen', false),
  withState('dataToSubmit', 'setDataToSubmit', {}),
  couponTemplateFormikHOC,
  // @ts-expect-error
)(CouponTemplateForm);
