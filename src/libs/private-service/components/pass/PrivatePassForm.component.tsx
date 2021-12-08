// @flow
import React from 'react';
import { Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import { compose, withState } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import PaymentIcon from '@material-ui/icons/Payment';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import InfoIcon from '@material-ui/icons/Info';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { CB } from '@bsport/common/lib/master-data/payment-methods';

import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
} from '@bsport/common/lib/master-data/payment-pack';

import * as Yup from 'yup';
import { Form, withFormik, FieldArray } from 'formik';
import PaymentMethodSelectorField from '../../../payment/components/PaymentMethodSelectorField.component';

import {
  IntegerField,
  TextField,
  PercentField,
  SwitchField,
  PriceField,
  Submit,
  RadioGroupField,
} from '../../../../components/forms';
import {
  PrivatePassCategory,
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
  PrivateSlot,
  PrivateService,
  PrivatePassWithCompatibility,
  CompatiblePrivateService,
} from '../../types';
import { getValidityInfo } from '../../utils';
import PrivatePassCategorySelector from '../../../payment-packs/components/category/PaymentPackCategorySelector.component';
import { PrivateServiceListItem } from '../service/PrivateServiceListItem.component';
import { PrivateServiceSelector } from '../service/PrivateServiceSelector.component';
import { PrivateSlotSelectionDialog } from '../slot/PrivateSlotSelectionDialog.component';

type Props = {
  isSubmitting: boolean;
  onCancel: () => void;
  values: any;
  initial?: PrivatePassWithCompatibility;
  privatePassCategories: Array<PrivatePassCategory>;
  setFieldValue: (field_identifier: string, value: string | null) => void;

  privateServices: Array<PrivateServiceWithSlots>;
  compatibleServicePass?: Array<ServiceCompatibilityPass>;

  selectedService: PrivateService;
  setSelectedService: (ps: PrivateService) => void;
  selectedServiceIndex: number;
  setSelectedServiceIndex: (index: number) => void;
  openCompatibleServiceForm: boolean;
  setOpenCompatibleServiceForm: (open: boolean) => void;
  openDeleteCompatibilityDialog: boolean;
  setOpenDeleteCompatibilityDialog: (open: boolean) => void;
};

const filterPrivateService = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService>,
  include: boolean,
): boolean => {
  if (cps?.length) {
    const cpsById: number[] = cps.map(
      (s: CompatiblePrivateService) => s.private_service,
    );
    return include ? cpsById.includes(ps.id) : !cpsById.includes(ps.id);
  }
  return !include;
};

const getExcludedSlots = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService>,
): number[] => {
  const ps_cps: CompatiblePrivateService = cps.find(
    (cps_elt) => cps_elt.private_service === ps.id,
  );
  return ps_cps.excluded_slot_ids;
};

const getIncludedSlots = (
  ps: PrivateServiceWithSlots,
  cps: Array<CompatiblePrivateService>,
): PrivateSlot[] => {
  const excluded_slots = getExcludedSlots(ps, cps);
  return excluded_slots?.length
    ? ps.slots.filter((slot) => !excluded_slots.includes(slot.id))
    : ps.slots;
};

export const PrivatePassForm = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  const { isSubmitting, privateServices } = props;

  const setServiceAndIndex = (ps: PrivateService, index: number) => {
    props.setSelectedService(ps);
    props.setSelectedServiceIndex(index);
  };

  const updateSlotData = (
    data: Object,
    replace: { (index: number, value: any): void },
  ) => {
    replace(props.selectedServiceIndex, {
      private_service: props.selectedService.id,
      excluded_slot_ids: data.excluded_slot_ids,
    });
    setServiceAndIndex(null, null);
  };

  return (
    <Form className={classes.container}>
      <div className={classes.categoryBlock}>
        <div className={classes.flexRowCenter}>
          <InfoIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.info')}
          </Typography>
        </div>

        <TextField
          name="name"
          fullWidth
          label={`${t('privatePass.form.name.label')}*`}
          helperText={t('privatePass.form.name.helperText')}
        />
        <div className={classes.fieldBlock}>
          <PrivatePassCategorySelector
            packPackCategoryList={props.privatePassCategories}
            value={props.values.category}
            nullCurrentValue={!!props.values.category}
            onChange={(item: { value: number; label: string }) =>
              props.setFieldValue('category', item ? item.value : null)
            }
            isClearable
            closeMenuOnSelect
            noMulti
          />
        </div>
        <div className={classes.fieldBlock}>
          <IntegerField
            name="credits"
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            label={t('privatePass.form.credits.label')}
            helperText={t('privatePass.form.credits.helperText')}
          />
        </div>
        <div className={`${classes.fieldBlock} ${classes.flexRowCenter}`}>
          <PriceField
            name="price"
            fullWidth
            label={t('privatePass.form.price.label')}
            className={classes.priceField}
            helperText={t('privatePass.form.price.helperText')}
          />
          <PercentField
            name="tax"
            fullWidth
            label={t('privatePass.form.tax.label')}
            type="number"
            required
            max={100}
            InputProps={{
              inputProps: { min: 0, max: 100, step: 0.005 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            className={classes.taxField}
          />
        </div>

        <div className={`${classes.fieldBlock} ${classes.flexColumn}`}>
          <SwitchField
            name="manager_only"
            label={t('privatePass.form.managerOnly.label')}
          />
          <SwitchField
            name="new_member_only"
            label={t('privatePass.form.new_member_only.label')}
          />
          <SwitchField
            name="full_vod_access"
            label={t('privatePass.form.full_vod_access.label')}
          />
        </div>
      </div>

      <Divider className={classes.divider} />

      <div className={classes.categoryBlock}>
        <div className={classes.flexRowCenter}>
          <PaymentIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.paymentMeans')}
          </Typography>
        </div>
        <div className={classes.fieldBlock}>
          <Typography
            variant="body2"
            className={classes.paymentMeansHelpertext}
          >
            {t(
              'privatePass.form.available_payment_method_identifiers.helperText',
            )}
          </Typography>
          <div
            className={
              props.values.manager_only ? classes.paymentMethodSelector : ''
            }
          >
            <div
              className={`${classes.paymentMethodMeansInfo} ${classes.flexRowCenter}`}
            >
              <ReportProblemOutlinedIcon
                className={`${classes.leftIcon} ${classes.yellowIcon}`}
              />
              <Typography variant="caption">
                {t(
                  'privatePass.form.available_payment_method_identifiers.warning',
                )}
              </Typography>
            </div>
            <PaymentMethodSelectorField
              name="available_payment_method_identifiers"
              disabled={props.values.manager_only}
            />
          </div>
        </div>
      </div>

      <Divider className={classes.divider} />

      <div className={classes.categoryBlock}>
        <div className={classes.flexRowCenter}>
          <DateRangeIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.validity')}
          </Typography>
        </div>
        <div className={`${classes.durationNbBlock} ${classes.flexRowCenter}`}>
          <IntegerField
            name="duration_days"
            label={t('privatePass.form.durationDays.label')}
            InputProps={{ min: 0, max: 30, step: 1 }}
            fullWidth
            disabled={props.initial && props.initial.editable === false}
            style={{ alignSelf: 'flex-start' }}
          />
          <AddIcon className={classes.greyIcon} />
          <IntegerField
            name="duration_months"
            label={t('privatePass.form.durationMonths.label')}
            helperText={t('privatePass.form.durationMonths.helperText')}
            InputProps={{ min: 0, max: 24, step: 1 }}
            fullWidth
            disabled={props.initial && props.initial.editable === false}
          />
          <AddIcon className={classes.greyIcon} />
          <IntegerField
            name="duration_years"
            label={t('privatePass.form.durationYears.label')}
            helperText={t('privatePass.form.durationYears.helperText')}
            InputProps={{ min: 0, max: 30, step: 1 }}
            fullWidth
            disabled={props.initial && props.initial.editable === false}
          />
        </div>
        <Typography variant="caption">
          {getValidityInfo(props.values, t, true, true)}
        </Typography>
        <div style={{ paddingBottom: 16 }}>
          <Typography variant="body1" className={classes.startDate}>
            {t('privatePass.form.startDate')}
          </Typography>
          <RadioGroupField
            name="start_date_method"
            disabled={props.initial && props.initial.editable === false}
            choices={[
              {
                label: t('privatePass.form.start_date_method.on_purchase'),
                value: START_ON_PURCHASE,
              },
              {
                label: t('privatePass.form.start_date_method.on_booking'),
                value: START_ON_FIRST_BOOKING,
              },
            ]}
          />
          <Collapse
            in={props.values.start_date_method !== `${START_ON_PURCHASE}`}
          >
            <TextField
              name="expiration_days_before_first_use"
              label={t('privatePass.form.expirationDaysBeforeFirstUse.label')}
              disabled={props.initial && props.initial.editable === false}
              helperText={t(
                'privatePass.form.expirationDaysBeforeFirstUse.helperText',
              )}
              type="number"
              fullWidth
              className={classes.firstBooking}
            />
          </Collapse>
        </div>
      </div>

      <Divider className={classes.divider} />

      <div className={classes.categoryBlock}>
        <div className={classes.flexRowCenter}>
          <DoneAllIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.compatibility')}
          </Typography>
        </div>

        <div className={classes.fieldBlock}>
          <FieldArray {...props} name="compatibility">
            {({ remove, push, replace }) => {
              return (
                <>
                  <div className={classes.privateServiceSelector}>
                    <PrivateServiceSelector
                      privateServices={privateServices
                        .filter((ps: PrivateServiceWithSlots) =>
                          filterPrivateService(
                            ps,
                            props.values.compatibility,
                            false,
                          ),
                        )
                        .filter((ps) => ps.available)}
                      onChange={(e: any) =>
                        push({ private_service: e, excluded_slot_ids: [] })
                      }
                      t={t}
                    />
                  </div>
                  <List>
                    {!!props.values.compatibility?.length &&
                      privateServices
                        .filter((ps: PrivateServiceWithSlots) =>
                          filterPrivateService(
                            ps,
                            props.values.compatibility,
                            true,
                          ),
                        )
                        .filter((ps) => ps.available)
                        .map((ps) => (
                          <PrivateServiceListItem
                            hideSecondary
                            privateService={ps}
                            key={ps.id}
                            onDelete={() => {
                              const psArray: number[] =
                                props.initial &&
                                props.initial.compatibility?.length
                                  ? props.initial.compatibility.map(
                                      (p_s) => p_s.private_service,
                                    )
                                  : [];
                              const psListForIndex: number[] =
                                props.values.compatibility?.map(
                                  (p_s) => p_s.private_service,
                                );
                              if (props.initial && psArray.includes(ps.id)) {
                                props.setSelectedServiceIndex(
                                  psListForIndex.indexOf(ps.id),
                                );
                                props.setOpenDeleteCompatibilityDialog(true);
                              } else {
                                remove(psListForIndex.indexOf(ps.id));
                              }
                            }}
                            classes={classes}
                            t={t}
                            onEdit={() => {
                              if (props.compatibleServicePass) {
                                const psListForIndex: number[] =
                                  props.values.compatibility?.map(
                                    (p_s) => p_s.private_service,
                                  );
                                setServiceAndIndex(
                                  ps,
                                  psListForIndex.indexOf(ps.id),
                                );
                              }
                            }}
                            excluded_slots={getExcludedSlots(
                              ps,
                              props.values.compatibility,
                            )}
                            included_slots={getIncludedSlots(
                              ps,
                              props.values.compatibility,
                            )}
                          />
                        ))}

                    {!props.values.compatibility.length && (
                      <ListItem
                        divider
                        alignItems="center"
                        className={classes.emptyListItem}
                      >
                        <ReportProblemIcon
                          className={classes.reportProblemIcon}
                        />
                        <ListItemText
                          primary={
                            <div>
                              <Typography variant="subtitle2">
                                {t('privatePass.compatibleServices.isEmpty')}
                              </Typography>
                              <Typography variant="body2">
                                {t('privatePass.compatibleServices.unusable')}
                              </Typography>
                            </div>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                  <PrivateSlotSelectionDialog
                    compatibleServicePass={props.compatibleServicePass}
                    compatibility={props.values.compatibility}
                    onSubmit={(data: Object) => updateSlotData(data, replace)}
                    onCancel={() => setServiceAndIndex(null, null)}
                    selectedService={props.selectedService}
                    privateServices={props.privateServices}
                  />
                  <Dialog open={!!props.openDeleteCompatibilityDialog}>
                    <DialogTitle>
                      {t('privateServiceCompatibility.delete.title')}
                    </DialogTitle>
                    <DialogContent>
                      {t('privateServiceCompatibility.delete.explain')}
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          props.setSelectedServiceIndex(null);
                          props.setOpenDeleteCompatibilityDialog(false);
                        }}
                      >
                        {t('privateServiceCompatibility.delete.cancel')}
                      </Button>
                      <Button
                        onClick={() => {
                          remove(props.selectedServiceIndex);
                          props.setSelectedServiceIndex(null);
                          props.setOpenDeleteCompatibilityDialog(false);
                        }}
                      >
                        {t('privateServiceCompatibility.delete.submit')}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              );
            }}
          </FieldArray>
        </div>
      </div>

      <Divider className={classes.divider} />

      <div className={`${classes.buttonContainer} ${classes.flexRowCenter}`}>
        <Button onClick={props.onCancel}>
          {t('privatePass.form.actions.cancel')}
        </Button>
        <Submit disabled={isSubmitting}>
          {t('privatePass.form.actions.submit')}
        </Submit>
      </div>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fieldBlock: {
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    justifyContent: 'flex-end',
    padding: theme.spacing(4),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  iconLeft: {
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  priceField: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  taxField: {
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    height: 2,
    width: '100%',
    color: '#C6C6C6',
  },
  categoryBlock: {
    padding: theme.spacing(4),
  },
  paymentMeansHelpertext: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  yellowIcon: {
    color: '#FFA71D',
  },
  durationNbBlock: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  startDate: {
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: theme.spacing(3),
  },
  greyIcon: {
    color: '#868686',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRowCenter: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  firstBooking: {
    marginTop: theme.spacing(2),
  },
  reportProblemIcon: {
    color: '#E35D4D',
    fontSize: 32,
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(2),
  },
  emptyListItem: {
    borderLeft: '5px solid',
    borderLeftColor: '#E35D4D',
    boxShadow: '0px 1px 3px 0.3px rgba(0, 0, 0, 0.25)',
  },
  paymentMethodMeansInfo: {
    backgroundColor: 'white',
    position: 'relative',
    zIndex: 5,
    top: theme.spacing(7.5),
    marginLeft: theme.spacing(5),
    marginTop: -theme.spacing(4),
    visibility: 'hidden',
  },
  paymentMethodSelector: {
    marginTop: theme.spacing(1),
    '&:hover': {
      '& $paymentMethodMeansInfo': {
        visibility: 'visible',
      },
    },
  },
  privateServiceSelector: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    maxWidth: 600,
  },
}));

export const PrivatePassSchema = Yup.object().shape({
  name: Yup.string().required(),
  tax: Yup.number().required(),
  category: Yup.number().nullable(true),
  price: Yup.number().required(),
  manager_only: Yup.boolean().required(),
  new_member_only: Yup.boolean().required(),
  full_vod_access: Yup.boolean().required(),
  duration_days: Yup.number().required().integer().min(0),
  duration_months: Yup.number().required().integer().min(0),
  duration_years: Yup.number().required().integer().min(0),
  start_date_method: Yup.number().required().integer().min(0).max(2),
  expiration_days_before_first_use: Yup.number(),
  available_payment_method_identifiers: Yup.array().of(Yup.number().integer()),
  compatibility: Yup.array().of(
    Yup.object().shape({
      private_service: Yup.number(),
      excluded_slot_ids: Yup.array().of(Yup.number()),
    }),
  ),
});

export const PrivatePassFormikHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial && initial.id)
      return {
        ...initial,
        start_date_method: `${initial.start_date_method}`,
        new_member_only: initial.new_member_only,
      };

    return {
      name: null,
      category: null,
      tax: 0,
      credits: 1,
      price: 0,
      manager_only: false,
      new_member_only: false,
      full_vod_access: true,
      duration_days: 0,
      duration_months: 0,
      duration_years: 1,
      available_payment_method_identifiers: [CB.id],
      start_date_method: `${START_ON_PURCHASE}`,
      expiration_days_before_first_use: 365,
      compatibility: [],
    };
  },
  enableReinitialize: true,
  validationSchema: PrivatePassSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const newValues = {
      ...values,
      available_payment_method_identifiers:
        values.available_payment_method_identifiers.length === 0
          ? [CB.id]
          : values.available_payment_method_identifiers,
    };
    onSubmit(newValues, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  PrivatePassFormikHOC,
  withState(
    'openCompatibleServiceForm',
    'setOpenCreateCompatibleServiceForm',
    false,
  ),
  withState(
    'openDeleteCompatibilityDialog',
    'setOpenDeleteCompatibilityDialog',
    false,
  ),
  withState('selectedService', 'setSelectedService', null),
  withState('selectedServiceIndex', 'setSelectedServiceIndex', null),
)(PrivatePassForm);
