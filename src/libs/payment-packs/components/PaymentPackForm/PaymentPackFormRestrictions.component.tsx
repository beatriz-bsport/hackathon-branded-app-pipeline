// @ts-nocheck
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  ButtonBase,
  Chip,
  Collapse,
  Grid,
  Typography,
} from '@material-ui/core';
import { useFormikContext, FormikProps } from 'formik';
import CancelIcon from '@material-ui/icons/Cancel';
import WarningIcon from '@material-ui/icons/Warning';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { PaymentPack, PaymentPackFormValues } from '../../types';
import {
  TextFieldEnhancedLabelWithError,
  SwitchField,
} from '../../../../components/forms';
import { SCT } from '#libs/category/types';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { CheckboxField } from '#libs/custom-form/components/GenericFormik.input';
import SCTChip from '#libs/category/components/SCTChip.component';
import type { PrivatePass } from '#libs/private-service/types';
import { getCurrencyDisplay } from '#libs/theme/selectors';

type Props = {
  categoryList: Array<SCT>;
  availableEstablishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
  initial: PaymentPack<PrivatePass>;
  disabledUniversalPassFields: boolean;
  allowGuestMaster: boolean;
};
export const PaymentPackFormRestrictions = (props: Props) => {
  const {
    categoryList,
    availableEstablishmentList,
    metaActivityList,
    initial,
    disabledUniversalPassFields,
    allowGuestMaster,
  } = props;
  const { t } = useTranslation('paymentPack');
  const [openVodOptions, setOpenVodOptions] = useState<boolean>(
    !!initial?.full_vod_access,
  );
  const classes = useStyles();

  const { values, setFieldValue }: FormikProps<PaymentPackFormValues> =
    useFormikContext();
  return (
    <>
      <Grid container spacing={2} id="paymentpack-form-restrictions-section">
        <Grid item xs={12}>
          <div className={classes.infoText}>
            <CancelIcon className={classes.icon} />
            <Typography variant="h6">
              {t('addPaymentPack.restriction')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            id="max-bookings-per-day"
            fullWidth
            type="number"
            name="max_bookings_per_day"
            label={t('addPaymentPack.maxUseDay')}
            helperText={t('addPaymentPack.maxUseHelper')}
            disabled={
              disabledUniversalPassFields || !!initial?.template_instance
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            id="max-bookings-per-week"
            fullWidth
            type="number"
            name="max_bookings_per_week"
            label={t('addPaymentPack.maxUseWeek')}
            helperText={t('addPaymentPack.maxUseHelper')}
            disabled={
              disabledUniversalPassFields || !!initial?.template_instance
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            id="max-bookings-per-month"
            fullWidth
            type="number"
            name="max_bookings_per_month"
            label={t('addPaymentPack.maxUseMonth')}
            helperText={t('addPaymentPack.maxUseHelper')}
            disabled={
              disabledUniversalPassFields || !!initial?.template_instance
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            id="max-purchase-per-member"
            fullWidth
            type="number"
            name="max_purchase_per_member"
            label={t('addPaymentPack.maxUseMember')}
            helperText={t('addPaymentPack.maxUseHelper')}
            disabled={!!initial?.template_instance}
          />
        </Grid>
        <Grid item xs={12} id="restrictions-switchfields-grid">
          <div className={classes.switch}>
            <div className={classes.row}>
              <SwitchField
                name="new_member_only"
                label={t('addPaymentPack.newClientOnly')}
                disabled={values.manager_only || !!initial?.template_instance}
                helperText={t('member:forms.newMemberOnlyHelperText', {
                  currency: getCurrencyDisplay(),
                })}
              />
            </div>
            <div className={classes.row}>
              <SwitchField
                name="manager_only"
                disabled={!!initial?.template_instance}
              />
              <Typography>{t('addPaymentPack.notForSell')}</Typography>
            </div>
            <div className={classes.row}>
              <SwitchField
                name="onsite_payment_available"
                disabled={values.manager_only || !!initial?.template_instance}
              />
              <Typography>{t('addPaymentPack.inShopPayment')}</Typography>
            </div>
            <div className={classes.row}>
              <SwitchField
                name="unusable_by_staff"
                disabled={!!initial?.template_instance}
              />
              <Typography>{t('addPaymentPack.unusableByStaff')}</Typography>
            </div>
            {allowGuestMaster && (
              <div className={classes.row}>
                <SwitchField name="allow_guest_pass" />
                <Typography>{t('addPaymentPack.allowGuest')}</Typography>
              </div>
            )}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.titleAndSelector}>
            <Typography className={classes.title}>
              {t('addPaymentPack.categories')}
            </Typography>
            <MaterialUISelector
              id="categories-selector"
              options={
                [
                  ...categoryList?.map((category) => ({
                    label: category.name,
                    value: category.id,
                    parentCategory: category.SCS.id,
                  })),
                ] || []
              }
              isMulti
              defaultNumberShown={3}
              chipsRenderer={(chipProps: {
                data: {
                  label: string;
                  value: number;
                  parentCategory: number;
                };
                onDelete: () => void;
              }) => (
                <SCTChip
                  parentCategory={chipProps.data.parentCategory}
                  SCTName={chipProps.data.label}
                  onDelete={chipProps.onDelete}
                  color="primary"
                />
              )}
              value={values?.categories?.map((id) => ({
                label: categoryList.find((category) => category.id === id)
                  ?.name,
                value: id,
                parentCategory: categoryList.find(
                  (category) => category.id === id,
                )?.SCS.id,
              }))}
              onChange={(options) => {
                setFieldValue(
                  'categories',
                  options?.map((option) => option.value),
                );
              }}
              placeholder={t('addPaymentPack.letBlank')}
              inScrollBar
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.titleAndSelector}>
            <Typography className={classes.title}>
              {t('addPaymentPack.room')}
            </Typography>
            <MaterialUISelector
              id="establishments-selector"
              menuPosition="fixed"
              options={
                [
                  ...availableEstablishmentList?.map((establishment) => ({
                    label: establishment.title,
                    value: establishment.id,
                  })),
                ] || []
              }
              isMulti
              defaultNumberShown={3}
              chipsRenderer={(chipProps: {
                data: { label: string; value: number };
                onDelete: () => void;
              }) => (
                <Chip
                  label={chipProps.data.label}
                  onDelete={chipProps.onDelete}
                  color="primary"
                />
              )}
              value={values?.establishments?.map((id) => ({
                label: availableEstablishmentList.find(
                  (establishment) => establishment.id === id,
                )?.title,
                value: id,
              }))}
              onChange={(options) => {
                setFieldValue(
                  'establishments',
                  options?.map((option) => option.value),
                );
              }}
              placeholder={t('addPaymentPack.letBlank')}
              inScrollBar
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.titleAndSelector}>
            <Typography className={classes.title}>
              {t('addPaymentPack.activities')}
            </Typography>
            <MaterialUISelector
              id="activities-selector"
              options={[
                ...metaActivityList?.map((metaActivity) => ({
                  label: metaActivity.name,
                  value: metaActivity.id,
                })),
              ]}
              isMulti
              defaultNumberShown={3}
              chipsRenderer={(chipProps: { data; onDelete: () => void }) => (
                <Chip
                  label={chipProps.data.label}
                  onDelete={chipProps.onDelete}
                  color="primary"
                />
              )}
              value={values?.metaActivities?.map((id) => ({
                label: metaActivityList.find(
                  (metaActivity) => metaActivity.id === id,
                )?.name,
                value: id,
              }))}
              onChange={(options) => {
                setFieldValue(
                  'metaActivities',
                  options?.map((option) => option.value),
                );
              }}
              placeholder={t('addPaymentPack.letBlank')}
              inScrollBar
            />
          </div>
        </Grid>
        <Grid item xs={6} className={classes.warningItem}>
          <div className={classes.warning}>
            <WarningIcon color="primary" />
            <Typography variant="body2">
              {t('addPaymentPack.compatibility')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <ButtonBase onClick={() => setOpenVodOptions(!openVodOptions)}>
            <Typography variant="h6">{t('addPaymentPack.vod')}</Typography>
            {openVodOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ButtonBase>
          <Collapse in={openVodOptions}>
            <div className={classes.switch}>
              <CheckboxField
                name="full_vod_access"
                label={t('addPaymentPack.vodAccessCard')}
                disabled={!!initial?.template_instance}
              />
              <Collapse in={values.full_vod_access}>
                <CheckboxField
                  name="only_vod_access"
                  label={t('addPaymentPack.only_vod_access')}
                  disabled={
                    disabledUniversalPassFields || !!initial?.template_instance
                  }
                />
              </Collapse>
            </div>
          </Collapse>
        </Grid>
      </Grid>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  infoText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  switch: {
    display: 'flex',
    flexDirection: 'column',
  },
  warning: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  row: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  establishmentSelector: {
    height: theme.spacing(10),
  },
  titleAndSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  title: {
    fontWeight: 500,
    color: '#000',
  },
  warningItem: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    color: '#868686',
  },
}));
export default PaymentPackFormRestrictions;
