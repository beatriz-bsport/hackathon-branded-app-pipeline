// @flow

import _ from 'lodash';
import React from 'react';
import { compose } from 'recompose';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik, Form } from 'formik';
import Icon from '@material-ui/core/Icon';

import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddIcon from '@material-ui/icons/Add';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpoandLessIcon from '@material-ui/icons/ExpandLess';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import {
  START_ON_PURCHASE,
  START_ON_FIRST_BOOKING,
  START_ON_FIRST_ATTENDANCE,
} from '@bsport/common/lib/master-data/payment-pack';
import Config from '../../../config';

import { Moment } from '../../../i18n';
import { DATE_FORMAT } from '../../../utils/datetime';
import type { PaymentPackCategory } from '../types';
import {
  PriceField,
  TextField,
  DateField,
  MultipleCheckboxField,
  RadioGroupField,
  Actions,
  Submit,
  SwitchField,
  CheckboxField,
  IntegerField,
  AlertError,
} from '../../../components/forms';
import PaymentPackCategorySelector from './category/PaymentPackCategorySelector.component';
import TagSelector from '../../tag/components/TagSelector.selector';

type Props = {
  categories: *[],
  metaActivities: *[],
  establishments: *[],
  isSubmitting: boolean,
  t: TFunction,
  values: *,
  initial: *,
  classes: { [string]: string },
  onCancel: ?() => void,
  onCancelText: ?string,
  paymentPackCategories: Array<PaymentPackCategory>,
  setFieldValue: (field_indentifier: string, value: string | null) => void,
  allTagsWithTagGroup: Array<Tag>,
};

/*
 * VALID_BY_DURATION:
 * the pack will be active on the specified
 * number of days after the consumer bought it
 *
 * VALID_BY_DATERANGE:
 *  the pack is valid on a fixed daterange
 */
const VALID_BY_DURATION = 'VALID_BY_DURATION';
const VALID_BY_DATERANGE = 'VALID_BY_DATERANGE';

const PENALTY_KIND_BLOCK_CPP = 0;
const PENALTY_KIND_NEGATIVE_ACCOUNT = 1;

export function PaymentPackForm(props: Props) {
  const [openAdvancedOptions, setOpenAdvancedOptions] = React.useState(false);
  const {
    t,
    categories,
    metaActivities,
    establishments,
    values,
    isSubmitting,
    initial,
    classes,
    paymentPackCategories,
  } = props;
  const {
    manager_only,
    unlimited,
    editable,
    start_date_method,
    timeType,
    penalty_active,
    penalty_nb_late_cancellations,
    penalty_nb_days,
    penalty_kind,
    penalty_days_blocked,
    penalty_account_value,
    full_vod_access,
    category,
  } = values;
  return (
    <div className={classes.formContainer}>
      <Form className={classes.content}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              name="name"
              id="textfield_pass_title"
              label={t('form.paymentPack.name.label')}
              required
              fullWidth
              helperText={t('form.paymentPack.name.helperText')}
            />
          </Grid>
          <Grid item xs={12}>
            <PaymentPackCategorySelector
              packPackCategoryList={paymentPackCategories}
              value={props.values.category}
              nullCurrentValue={!!category}
              onChange={(item: { value: number, label: string }) =>
                props.setFieldValue('category', item ? item.value : null)
              }
              isClearable
              closeMenuOnSelect
              noMulti
            />
          </Grid>
          {!editable && (
            <Grid item xs={12} className={classes.row}>
              <Typography color="error">
                {t('form.paymentPack.notEditable')}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <PriceField
              name="price"
              id="textfield_pass_price"
              label={t('form.paymentPack.priceIncludingTax.label')}
              required
              fullWidth
              helperText={t('form.paymentPack.priceIncludingTax.helperText')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="tax"
              id="textfield_pass_VAT"
              label={t('form.paymentPack.tax.label')}
              type="number"
              required
              fullWidth
              max={100}
              InputProps={{
                inputProps: { min: 0, max: 100, step: 0.01 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>
          {values.credits &&
            !!initial &&
            values.credits !== initial.credits &&
            initial.id && (
              <div className={classes.row}>
                <WarningIcon
                  fontSize="small"
                  color="error"
                  className={classes.leftIcon}
                />
                <Typography variant="caption" color="error">
                  {t('form.paymentPack.credits.bewareChange')}
                </Typography>
              </div>
            )}
          <Grid item xs={6}>
            <TextField
              name="credits"
              id="textfield_pass_credits"
              label={t('form.paymentPack.credits.label')}
              type="number"
              fullWidth
              disabled={unlimited || !editable}
              helperText={t('form.paymentPack.credits.helperText')}
            />
          </Grid>
          <Grid item xs={6} id="checkbox_pass_unlimitedoption">
            <CheckboxField
              name="unlimited"
              disabled={!editable}
              label={t('form.paymentPack.unlimited')}
            />
          </Grid>
          <Grid item xs={12}>
            <PriceField
              name="theorical_margin_value"
              label={t('form.paymentPack.theoricalMarginValue.label')}
              type="number"
              fullWidth
              disabled={!unlimited}
              helperText={t('form.paymentPack.theoricalMarginValue.helperText')}
            />
          </Grid>
        </Grid>
        {unlimited && (
          <fieldset className={classes.fieldset} id="pass_penalty">
            <legend className={classes.legend}>
              {t('form.paymentPack.penalty.title')}
            </legend>
            <CheckboxField
              name="penalty_active"
              disabled={!editable}
              label={t('form.paymentPack.penalty.checkbox')}
            />
            {penalty_active && (
              <>
                <Typography className={classes.penaltyExplain}>
                  {t('form.paymentPack.penalty.explain', {
                    nb_cancellations: penalty_nb_late_cancellations,
                    nb_days: penalty_nb_days,
                  })}
                </Typography>
                <div className={classes.paramContainer}>
                  <div className={classes.inlineIntegerField}>
                    <Typography variant="caption">
                      {t('form.paymentPack.penalty.nb_cancellations')}
                    </Typography>
                    <IntegerField
                      className={classes.integerField}
                      name="penalty_nb_late_cancellations"
                    />
                  </div>
                  <div className={classes.inlineIntegerField}>
                    <Typography variant="caption">
                      {t('form.paymentPack.penalty.nb_days')}
                    </Typography>
                    <IntegerField
                      className={classes.integerField}
                      name="penalty_nb_days"
                    />
                  </div>
                </div>
                <Typography>
                  {t('form.paymentPack.penalty.kind.label')}
                </Typography>
                <RadioGroupField
                  name="penalty_kind"
                  choices={[
                    {
                      label: t('form.paymentPack.penalty.kind.block'),
                      value: PENALTY_KIND_BLOCK_CPP,
                    },
                    {
                      label: t('form.paymentPack.penalty.kind.account'),
                      value: PENALTY_KIND_NEGATIVE_ACCOUNT,
                    },
                  ]}
                />
                {parseInt(penalty_kind, 10) === PENALTY_KIND_BLOCK_CPP && (
                  <TextField
                    name="penalty_days_blocked"
                    label={t('form.paymentPack.penalty.block.label')}
                    helperText={t('form.paymentPack.penalty.block.helperText', {
                      nb_days: penalty_days_blocked,
                    })}
                    type="number"
                    fullWidth
                  />
                )}
                {parseInt(penalty_kind, 10) ===
                  PENALTY_KIND_NEGATIVE_ACCOUNT && (
                  <PriceField
                    name="penalty_account_value"
                    label={t('form.paymentPack.penalty.account.label')}
                    helperText={t(
                      'form.paymentPack.penalty.account.helperText',
                      {
                        value: penalty_account_value,
                      },
                    )}
                    fullWidth
                  />
                )}
              </>
            )}
          </fieldset>
        )}

        <fieldset className={classes.fieldset} id="pass_availability">
          <legend className={classes.legend}>
            {t('form.paymentPack.timeSettingsTitle')}
          </legend>
          <Grid container>
            <Grid item xs={12} md={6}>
              <RadioGroupField
                name="timeType"
                disabled={!editable}
                choices={[
                  {
                    label: t('form.paymentPack.validByDuration'),
                    value: VALID_BY_DURATION,
                  },
                  {
                    label: t('form.paymentPack.validByDaterange'),
                    value: VALID_BY_DATERANGE,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Collapse in={timeType === VALID_BY_DURATION}>
                <div className={classes.durationNbBlock}>
                  <div className={classes.row}>
                    <Icon className={classes.leftIcon} />
                    <TextField
                      name="duration_days"
                      label={t('form.paymentPack.durationDays.label')}
                      helperText={t('form.paymentPack.durationDays.helperText')}
                      type="number"
                      disabled={!editable}
                      fullWidth
                    />
                  </div>
                  <div className={classes.row}>
                    <AddIcon className={classes.leftIcon} />
                    <TextField
                      name="duration_months"
                      label={t('form.paymentPack.durationMonths.label')}
                      disabled={!editable}
                      helperText={t(
                        'form.paymentPack.durationMonths.helperText',
                      )}
                      type="number"
                      fullWidth
                    />
                  </div>
                  <div className={classes.row}>
                    <AddIcon className={classes.leftIcon} />
                    <TextField
                      name="duration_years"
                      disabled={!editable}
                      label={t('form.paymentPack.durationYears.label')}
                      helperText={t(
                        'form.paymentPack.durationYears.helperText',
                      )}
                      type="number"
                      fullWidth
                    />
                  </div>
                </div>
                <div style={{ paddingBottom: 24 }}>
                  <RadioGroupField
                    name="start_date_method"
                    disabled={!editable}
                    choices={[
                      {
                        label: t(
                          'form.paymentPack.start_date_method.on_purchase',
                        ),
                        value: START_ON_PURCHASE,
                      },
                      {
                        label: t(
                          'form.paymentPack.start_date_method.on_booking',
                        ),
                        value: START_ON_FIRST_BOOKING,
                      },
                      {
                        label: t(
                          'form.paymentPack.start_date_method.on_attendance',
                        ),
                        value: START_ON_FIRST_ATTENDANCE,
                      },
                    ]}
                  />
                  <AlertError name="start_date_method" />
                </div>
                <Collapse in={start_date_method !== `${START_ON_PURCHASE}`}>
                  <TextField
                    name="expiration_days_before_first_use"
                    disabled={!editable}
                    label={t(
                      'form.paymentPack.expirationDaysBeforeFirstUse.label',
                    )}
                    helperText={t(
                      'form.paymentPack.expirationDaysBeforeFirstUse.helperText',
                    )}
                    type="number"
                    fullWidth
                  />
                </Collapse>
              </Collapse>
              <Collapse in={timeType === VALID_BY_DATERANGE}>
                <DateField
                  label={t('form.paymentPack.from')}
                  fullWidth
                  disabled={!editable}
                  name="lower_date"
                />
                <DateField
                  label={t('form.paymentPack.until')}
                  fullWidth
                  disabled={!editable}
                  name="upper_date"
                />
              </Collapse>
            </Grid>
          </Grid>
        </fieldset>
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            {t('form.paymentPack.restrictionsTitle')}
          </legend>
          <Grid container>
            <Grid item xs={12} id="full_vod_access">
              <CheckboxField
                name="full_vod_access"
                label={t('form.paymentPack.full_vod_access')}
              />
            </Grid>
            {full_vod_access && (
              <Grid item xs={12} id="only_vod_access">
                <CheckboxField
                  name="only_vod_access"
                  label={t('form.paymentPack.only_vod_access')}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                id="textfield_restrictions_monthlymaxuser"
                label={t('form.paymentPack.maxBookingPerMonth.label')}
                type="number"
                fullWidth
                name="max_bookings_per_month"
                helperText={t('form.paymentPack.maxBookingPerMonth.helperText')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="textfield_restrictions_maxuser"
                label={t('form.paymentPack.maxBookingPerWeek.label')}
                type="number"
                fullWidth
                name="max_bookings_per_week"
                helperText={t('form.paymentPack.maxBookingPerWeek.helperText')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="textfield_restrictions_dailymaxuse"
                label={t('form.paymentPack.maxBookingPerDay.label')}
                type="number"
                fullWidth
                name="max_bookings_per_day"
                helperText={t('form.paymentPack.maxBookingPerDay.helperText')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="textfield_restrictions_maxpurchase"
                label={t('form.paymentPack.maxPurchasePerMember.label')}
                type="number"
                fullWidth
                name="max_purchase_per_member"
                helperText={t(
                  'form.paymentPack.maxPurchasePerMember.helperText',
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <SwitchField
                name="new_member_only"
                disabled={manager_only}
                label={t('form.paymentPack.newMemberOnly')}
              />
            </Grid>
            <Grid item xs={12}>
              <SwitchField
                name="manager_only"
                label={t('form.paymentPack.managerOnly')}
              />
            </Grid>
            <Grid item xs={12}>
              <SwitchField
                name="onsite_payment_available"
                label={t('form.paymentPack.onsitePaymentAvailable')}
                disabled={manager_only}
              />
            </Grid>
            <Grid item xs={12} md={4} id="select_pass_category">
              <MultipleCheckboxField
                name="categories"
                id="select_pass_category"
                label={t('form.paymentPack.sports')}
                helperText={t('form.paymentPack.noneMeansAll')}
                choices={categories.map((cat) => ({
                  id: cat.id,
                  optionLabel: cat.name,
                }))}
              />
            </Grid>
            <Grid item xs={12} md={4} id="select_activity_category">
              <MultipleCheckboxField
                name="metaActivities"
                id="select_activity_category"
                label={t('form.paymentPack.activities')}
                helperText={t('form.paymentPack.noneMeansAll')}
                choices={metaActivities.map((metaActivity) => ({
                  id: metaActivity.id,
                  optionLabel: metaActivity.name,
                }))}
              />
            </Grid>
            <Grid item xs={12} md={4} id="select_establishment_category">
              <MultipleCheckboxField
                name="establishments"
                id="select_establishment_category"
                label={t('form.paymentPack.establishments')}
                helperText={t('form.paymentPack.noneMeansAll')}
                choices={establishments.map((establishment) => ({
                  id: establishment.id,
                  optionLabel: establishment.title,
                }))}
              />
            </Grid>
          </Grid>
        </fieldset>
        {Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' && (
          <Grid item xs={12} className={classes.advancedOptionsSection}>
            <ButtonBase
              onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
              className={classes.advancedOptionsHeader}
            >
              <Typography variant="h6">
                {t('form.paymentPack.advancedOptions.header')}
              </Typography>
              {openAdvancedOptions ? <ExpoandLessIcon /> : <ExpandMoreIcon />}
            </ButtonBase>
            <Collapse in={openAdvancedOptions}>
              <div className={classes.tagSection}>
                <div className={classes.tagSectionHeader}>
                  <Typography variant="h6">
                    {t('form.paymentPack.advancedOptions.tag.header')}
                  </Typography>
                  <Typography variant="caption" className={classes.helperText}>
                    {t('form.paymentPack.advancedOptions.tag.helperText')}
                  </Typography>
                </div>
                <div className={classes.tagSelector}>
                  <div className={classes.tagSelectorLabel}>
                    <CheckIcon className={classes.tagSelectorLabelIcon} />
                    <Typography variant="subtitle1">
                      {t('form.paymentPack.advancedOptions.tag.allowed')}
                    </Typography>
                  </div>
                  <TagSelector
                    allTagsWithTagGroup={
                      props.allTagsWithTagGroup?.filter(
                        (tag) =>
                          !props.values?.blacklist_tags?.includes(tag.id),
                      ) || []
                    }
                    placeholder={t(
                      'form.paymentPack.advancedOptions.tag.doNotSelectToAllowAllMembers',
                    )}
                    onChange={(
                      items: Array<{
                        item: Tag & { label: string, value: number },
                      }>,
                    ) => {
                      return props.setFieldValue('whitelist_tags', [
                        ...items.map((item) => item.value),
                      ]);
                    }}
                    onDeleteTag={(itemId: number) =>
                      props.setFieldValue(
                        'whitelist_tags',
                        props?.values?.whitelist_tags.filter(
                          (tagId) => tagId !== itemId,
                        ),
                      )
                    }
                    selectedTags={props.values.whitelist_tags}
                    isClearable
                    closeMenuOnSelect
                  />
                </div>
                <div className={classes.tagSelector}>
                  <div className={classes.tagSelectorLabel}>
                    <BlockIcon className={classes.tagSelectorLabelIcon} />
                    <Typography variant="subtitle1">
                      {t('form.paymentPack.advancedOptions.tag.notAllowed')}
                    </Typography>
                  </div>
                  <TagSelector
                    allTagsWithTagGroup={
                      props.allTagsWithTagGroup?.filter(
                        (tag) =>
                          !props.values?.whitelist_tags?.includes(tag.id),
                      ) || []
                    }
                    placeholder={t(
                      'form.paymentPack.advancedOptions.tag.doNotSelectToAllowAllMembers',
                    )}
                    onChange={(
                      items: Array<{
                        item: Tag & { label: string, value: number },
                      }>,
                    ) => {
                      return props.setFieldValue('blacklist_tags', [
                        ...items.map((item) => item.value),
                      ]);
                    }}
                    onDeleteTag={(itemId: number) =>
                      props.setFieldValue(
                        'blacklist_tags',
                        props?.values?.blacklist_tags.filter(
                          (tagId) => tagId !== itemId,
                        ),
                      )
                    }
                    selectedTags={props.values.blacklist_tags}
                    isClearable
                    closeMenuOnSelect
                  />
                </div>
              </div>
            </Collapse>
          </Grid>
        )}
        <Actions>
          {props.onCancel ? (
            <Button onClick={props.onCancel}>
              {props.onCancelText || t('form.paymentPack.actions.cancel')}
            </Button>
          ) : null}
          <Submit disabled={isSubmitting} id="button_payment_pack_onsubmit">
            {initial && initial.id
              ? t('form.paymentPack.actions.edit')
              : t('form.paymentPack.actions.create')}
          </Submit>
        </Actions>
      </Form>
      <LinearProgress
        style={{ visibility: isSubmitting ? 'visible' : 'hidden' }}
      />
    </div>
  );
}

const PackSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number().min(0),
  tax: Yup.number().min(0),
  credits: Yup.number().min(0).nullable(),
  timeType: Yup.string().required(),
  expiration_days_before_first_use: Yup.number(),
  unlimited: Yup.boolean(),
  theorical_margin_value: Yup.number(),
  start_date_method: Yup.number()
    .required('paymentPack:form.paymentPack.error.start_date_method_type')
    .typeError('paymentPack:form.paymentPack.error.start_date_method_type'),
  duration_days: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  duration_months: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  duration_years: Yup.number().when('timeType', {
    is: VALID_BY_DURATION,
    then: Yup.number().min(0).required(),
    otherwise: Yup.number().min(0).nullable(),
  }),
  max_bookings_per_month: Yup.number().min(0).nullable(),
  max_bookings_per_week: Yup.number().min(0).nullable(),
  max_purchase_per_member: Yup.number().min(0).nullable(),
  max_bookings_per_day: Yup.number().min(0).nullable(),
  lower_date: Yup.date().when('timeType', {
    is: VALID_BY_DATERANGE,
    then: Yup.date().required(),
    otherwise: Yup.date().nullable(),
  }),
  upper_date: Yup.date().when('timeType', {
    is: VALID_BY_DATERANGE,
    then: Yup.date().required(),
    otherwise: Yup.date().nullable(),
  }),
  new_member_only: Yup.boolean(),
  manager_only: Yup.boolean(),
  onsite_payment_available: Yup.boolean(),
  categories: Yup.array().of(Yup.number()),
  establishments: Yup.array().of(Yup.number()),
  metaActivities: Yup.array().of(Yup.number()),
  penalty_active: Yup.boolean(),
  penalty_nb_late_cancellations: Yup.number().min(1),
  penalty_nb_days: Yup.number().min(1),
  penalty_kind: Yup.number(),
  penalty_days_blocked: Yup.number().min(1),
  penalty_account_value: Yup.number(),
  only_vod_access: Yup.boolean(),
  whitelist_tags: Yup.array().of(Yup.number()),
  blacklist_tags: Yup.array().of(Yup.number()),
});

const styles = (theme) => ({
  formContainer: {
    marginBottom: '20vh',
  },
  content: { padding: theme.spacing(2), paddingBottom: 0 },
  legend: { margin: 0 },
  fieldset: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  durationNbBlock: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    marginBottom: theme.spacing(3),
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  inlineIntegerField: {
    display: 'flex',
    alignItems: 'baseline',
  },
  integerField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4),
    width: 45,
  },
  paramContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
  penaltyExplain: {
    paddingTop: theme.spacing(2),
  },
  advancedOptionsHeader: {
    alignItems: 'center',
    textTransform: 'none',
    paddingLeft: theme.spacing(1),
  },
  advancedOptionsSection: {
    paddingTop: theme.spacing(2),
  },
  tagSection: {
    padding: theme.spacing(1),
  },
  tagSectionHeader: {
    paddingBottom: theme.spacing(1),
  },
  helperText: {
    color: theme.palette.grey[800],
  },
  tagSelectorLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
  },
  tagSelectorLabelIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.grey[1000],
  },
  tagSelector: {
    paddingBottom: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentPack']),
  withFormik({
    mapPropsToValues: ({ initial }) =>
      Object.assign(
        {
          name: '',
          price: 0,
          tax: 0,
          credits: 1,
          timeType: `${VALID_BY_DURATION}`,
          duration_days: 0,
          duration_months: 1,
          duration_years: 0,
          max_bookings_per_month: null,
          max_bookings_per_week: null,
          max_purchase_per_member: null,
          max_bookings_per_day: null,
          lower_date: Moment(),
          upper_date: Moment().add('months', 1),
          new_member_only: false,
          manager_only: false,
          onsite_payment_available: false,
          full_vod_access: true,
          only_vod_access: false,
          start_date_method: `${START_ON_PURCHASE}`,
          expiration_days_before_first_use: 365,
          unlimited: false,
          theorical_margin_value: 0,
          categories: [],
          metaActivities: [],
          editable: true,
          establishments: [],
          penalty_active: false,
          penalty_nb_late_cancellations: 3,
          penalty_nb_days: 7,
          penalty_kind: PENALTY_KIND_BLOCK_CPP,
          penalty_days_blocked: 7,
          penalty_account_value: 10,
        },
        (initial && {
          ...initial,
          start_date_method: `${initial.start_date_method}`,
          categories: initial.categories || [],
          establishments: initial.establishments || [],
          timeType: initial.validity_daterange
            ? VALID_BY_DATERANGE
            : VALID_BY_DURATION,
          lower_date: initial.validity_daterange
            ? Moment(JSON.parse(initial.validity_daterange).lower)
            : Moment(),
          upper_date: initial.validity_daterange
            ? Moment(JSON.parse(initial.validity_daterange).upper)
            : Moment().add('days', 365),
        }) ||
          {},
      ),
    validationSchema: PackSchema,
    handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
      const keys = [
        'name',
        'price',
        'tax',
        'theorical_margin_value',
        'unlimited',
        'credits',
        'max_bookings_per_day',
        'max_bookings_per_week',
        'max_bookings_per_month',
        'max_purchase_per_member',
        'id',
        'new_member_only',
        'manager_only',
        'onsite_payment_available',
        'full_vod_access',
        'only_vod_access',
        'expiration_days_before_first_use',
        'start_date_method',
        'categories',
        'metaActivities',
        'establishments',
        'penalty_active',
        'penalty_nb_late_cancellations',
        'penalty_nb_days',
        'penalty_kind',
        'penalty_days_blocked',
        'penalty_account_value',
        'category',
        'whitelist_tags',
        'blacklist_tags',
      ];
      const data = _.pick(values, keys);

      if (values.timeType === VALID_BY_DATERANGE) {
        data.duration_days = null;
        data.duration_months = null;
        data.duration_years = null;
        data.validity_daterange = {
          lower: Moment(values.lower_date).format(DATE_FORMAT),
          upper: Moment(values.upper_date).format(DATE_FORMAT),
        };
      } else {
        data.duration_days = values.duration_days;
        data.duration_months = values.duration_months;
        data.duration_years = values.duration_years;
        data.validity_daterange = null;
      }
      if (!values.unlimited) {
        data.penalty_active = false;
      }
      if (!values.full_vod_access) {
        data.only_vod_access = false;
      }
      onSubmit(data, {
        onSuccess: () => setSubmitting(false),
        onError: () => setSubmitting(false),
      });
    },
  }),
)(PaymentPackForm);
