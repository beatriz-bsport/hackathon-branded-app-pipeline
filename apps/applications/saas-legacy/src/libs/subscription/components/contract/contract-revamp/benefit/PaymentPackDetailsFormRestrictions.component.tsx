import React, { useCallback, useState } from 'react';
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
import { useFormikContext } from 'formik';
import CancelIcon from '@material-ui/icons/Cancel';
import WarningIcon from '@material-ui/icons/Warning';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import type { SCT } from '#src/libs/category/types';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import { CheckboxField } from '#src/libs/custom-form/components/GenericFormik.input';
import SCTChip from '#src/libs/category/components/SCTChip.component';
import OffPeakTimeSlotGroup from '#src/libs/payment-packs/components/PaymentPackForm/PaymentPackOffPeak.component';
import { offPeakGroupDefault } from '#src/libs/payment-packs/utils';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import {
  TextFieldEnhancedLabelWithError,
  SwitchField,
  // @ts-expect-error importing from a JS file
} from '#src/components/forms';
import type { FormValues, PaymentPackDetailsForms } from '../types';
import { emptyPaymentPackDetailsForms } from '../constants';

type Props = {
  categoryList: Array<SCT>;
  availableEstablishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
  initial: PaymentPackDetailsForms;
  allowGuestMaster: boolean;
};

export const PaymentPackDetailsFormRestrictions: React.FC<Props> = (
  props: Props,
) => {
  const {
    categoryList,
    availableEstablishmentList,
    metaActivityList,
    initial,
    allowGuestMaster,
  } = props;
  const { t } = useTranslation('paymentPack');
  const [openVodOptions, setOpenVodOptions] = useState<boolean>(
    !!initial?.full_vod_access,
  );
  const classes = useStyles();
  const { values, setFieldValue } = useFormikContext<FormValues>();
  const paymentPackDetailsValues =
    values?.payment_pack_details ?? emptyPaymentPackDetailsForms;
  const isSharedInstance = !!initial?.template_instance;
  const hasMultipleGroups =
    (paymentPackDetailsValues.off_peak_schedule ?? []).length > 1;

  const handleAddGroupTimeSlot = useCallback(() => {
    const newGroup = offPeakGroupDefault();
    setFieldValue(`payment_pack_details.off_peak_schedule`, [
      ...(paymentPackDetailsValues.off_peak_schedule ?? []),
      newGroup,
    ]);
  }, [setFieldValue, paymentPackDetailsValues.off_peak_schedule]);

  const handleDeleteGroup = useCallback(
    (indexGroup: number) => () => {
      const currentSchedule = paymentPackDetailsValues.off_peak_schedule ?? [];
      const newSchedule = currentSchedule.filter((_, i) => i !== indexGroup);
      setFieldValue('payment_pack_details.off_peak_schedule', newSchedule);
    },
    [setFieldValue, paymentPackDetailsValues.off_peak_schedule],
  );

  const addGroupTimeSlotLabel = t(
    'addPaymentPack.offPeak.addGroupTimeSlot',
  )?.toUpperCase();

  const isCreatingPass = !initial?.id;

  const disableVodOnlyAccessCheckbox =
    isSharedInstance || !!paymentPackDetailsValues.grants_door_access;

  return (
    <>
      <Grid container id="paymentpack-form-restrictions-section" spacing={2}>
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
            fullWidth
            disabled={isSharedInstance}
            helperText={t('addPaymentPack.maxUseHelper')}
            id="max-bookings-per-day"
            label={t('addPaymentPack.maxUseDay')}
            name="payment_pack_details.max_bookings_per_day"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            fullWidth
            disabled={isSharedInstance}
            helperText={t('addPaymentPack.maxUseHelper')}
            id="max-bookings-per-week"
            label={t('addPaymentPack.maxUseWeek')}
            name="payment_pack_details.max_bookings_per_week"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextFieldEnhancedLabelWithError
            fullWidth
            disabled={isSharedInstance}
            helperText={t('addPaymentPack.maxUseHelper')}
            id="max-bookings-per-month"
            label={t('addPaymentPack.maxUseMonth')}
            name="payment_pack_details.max_bookings_per_month"
            type="number"
          />
        </Grid>
        <Grid item id="restrictions-switchfields-grid" xs={12}>
          <div className={classes.switch}>
            {allowGuestMaster && (
              <div className={classes.row}>
                <SwitchField name="payment_pack_details.allow_guest_pass" />
                <Typography>{t('addPaymentPack.allowGuest')}</Typography>
              </div>
            )}
            <div className={classes.row}>
              <SwitchField
                disabled={isSharedInstance}
                name="payment_pack_details.off_peak_active"
              />
              <Typography>{t('addPaymentPack.offPeak.label')}</Typography>
            </div>
            {paymentPackDetailsValues && (
              <div>
                <Collapse in={paymentPackDetailsValues.off_peak_active}>
                  {paymentPackDetailsValues.off_peak_schedule?.map(
                    (group, index) => (
                      <OffPeakTimeSlotGroup
                        key={`offPeakGroup-${index}`}
                        baseName="payment_pack_details"
                        disabled={isSharedInstance}
                        group={group}
                        hasMultipleGroups={hasMultipleGroups}
                        index={index}
                        onGroupDelete={handleDeleteGroup(index)}
                        setFieldValue={setFieldValue}
                      />
                    ),
                  )}
                  <ButtonBase
                    className={classes.buttonAdd}
                    color="primary"
                    disabled={isSharedInstance}
                    onClick={handleAddGroupTimeSlot}
                  >
                    <AddIcon color="primary" />
                    <Typography className={classes.bold}>
                      {addGroupTimeSlotLabel}
                    </Typography>
                  </ButtonBase>
                </Collapse>
              </div>
            )}
          </div>
        </Grid>
        <ObjectLevelPermissionProvider requiredPermission="product.paymentPack.allowed_actions.compatibility">
          {(canEditCompatibilities: boolean) => (
            <>
              <Grid item xs={6}>
                <div className={classes.titleAndSelector}>
                  <Typography className={classes.title}>
                    {t('addPaymentPack.categories')}
                  </Typography>
                  <MaterialUISelector
                    inScrollBar
                    isMulti
                    chipsRenderer={(chipProps: {
                      data: {
                        label: string;
                        value: number;
                        parentCategory: number;
                      };
                      onDelete: () => void;
                    }) => (
                      <SCTChip
                        onDelete={chipProps.onDelete}
                        parentCategory={chipProps.data.parentCategory}
                        SCTName={chipProps.data.label}
                      />
                    )}
                    defaultNumberShown={3}
                    id="categories-selector"
                    isDisabled={!canEditCompatibilities && !isCreatingPass}
                    onChange={(options) => {
                      setFieldValue(
                        'payment_pack_details.categories',
                        // @ts-expect-error
                        options?.map((option) => option.value),
                      );
                    }}
                    options={[
                      ...(categoryList ?? []).map((category) => ({
                        label: category.name,
                        value: category.id,
                        parentCategory: category.SCS.id,
                      })),
                    ]}
                    placeholder={t('addPaymentPack.letBlank')}
                    value={(paymentPackDetailsValues.categories ?? []).map(
                      (id) => {
                        const category = categoryList.find(
                          (cat) => cat.id === id,
                        );
                        return {
                          label: category?.name ?? '',
                          value: id,
                          parentCategory: category?.SCS.id,
                        };
                      },
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className={classes.titleAndSelector}>
                  <Typography className={classes.title}>
                    {t('addPaymentPack.room')}
                  </Typography>
                  <MaterialUISelector
                    inScrollBar
                    isMulti
                    chipsRenderer={(chipProps: {
                      data: { label: string; value: number };
                      onDelete: () => void;
                    }) => (
                      <Chip
                        color="primary"
                        label={chipProps.data.label}
                        onDelete={chipProps.onDelete}
                      />
                    )}
                    defaultNumberShown={3}
                    id="establishments-selector"
                    isDisabled={!canEditCompatibilities && !isCreatingPass}
                    menuPosition="fixed"
                    onChange={(options) => {
                      setFieldValue(
                        'payment_pack_details.establishments',
                        // @ts-expect-error
                        options?.map((option) => option.value),
                      );
                    }}
                    options={[
                      ...(availableEstablishmentList ?? []).map(
                        (establishment) => ({
                          label: establishment.title,
                          value: establishment.id,
                        }),
                      ),
                    ]}
                    placeholder={t('addPaymentPack.letBlank')}
                    value={paymentPackDetailsValues.establishments?.map(
                      (id) => ({
                        label: availableEstablishmentList.find(
                          (establishment) => establishment.id === id,
                        )?.title,
                        value: id,
                      }),
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className={classes.titleAndSelector}>
                  <Typography className={classes.title}>
                    {t('addPaymentPack.activities')}
                  </Typography>
                  <MaterialUISelector
                    inScrollBar
                    isMulti
                    chipsRenderer={(chipProps: {
                      // @ts-expect-error
                      data;
                      onDelete: () => void;
                    }) => (
                      <Chip
                        color="primary"
                        label={chipProps.data.label}
                        onDelete={chipProps.onDelete}
                      />
                    )}
                    defaultNumberShown={3}
                    id="activities-selector"
                    isDisabled={!canEditCompatibilities && !isCreatingPass}
                    onChange={(options) => {
                      setFieldValue(
                        'payment_pack_details.metaActivities',
                        options?.map((option) => option.value),
                      );
                    }}
                    options={(metaActivityList ?? []).map((metaActivity) => ({
                      label: metaActivity.name,
                      value: metaActivity.id,
                    }))}
                    placeholder={t('addPaymentPack.letBlank')}
                    value={paymentPackDetailsValues.metaActivities?.map(
                      (id) => ({
                        label: metaActivityList.find(
                          (metaActivity) => metaActivity.id === id,
                        )?.name,
                        value: id,
                      }),
                    )}
                  />
                </div>
              </Grid>
            </>
          )}
        </ObjectLevelPermissionProvider>
        <Grid item className={classes.warningItem} xs={6}>
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
                disabled={isSharedInstance}
                label={t('addPaymentPack.vodAccessCard')}
                name="payment_pack_details.full_vod_access"
              />
              <Collapse in={paymentPackDetailsValues.full_vod_access}>
                <CheckboxField
                  disabled={disableVodOnlyAccessCheckbox}
                  label={t('addPaymentPack.only_vod_access')}
                  name="payment_pack_details.only_vod_access"
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
  infoIcon: { marginLeft: theme.spacing(3) },
  inputLabelExpirationDate: { marginTop: theme.spacing(1), fontSize: 12 },
  buttonAdd: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(3.5),
  },
  bold: {
    fontWeight: 500,
    fontSize: theme.spacing(1.75),
  },
}));
