import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  TextField,
  SwitchField,
  // @ts-expect-error
} from '#src/components/forms';
import { Button, Grid, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import InfoIcon from '@material-ui/icons/Info';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import KeyIcon from '@material-ui/icons/VpnKey';
import WarningIcon from '@material-ui/icons/Warning';
import { Alert } from '@material-ui/lab';
import { FieldArray, useFormikContext } from 'formik';
import { FormValues, PrivatePassDetailsForms } from '../types';
import { FeatureList } from '#src/libs/company/types';
import {
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
  UPSELL_IDENTIFIER_KISI_INTEGRATION,
} from '#src/libs/platform-billing/upsell-identifiers';
import { hasAnyUpsell } from '#src/libs/platform-billing/utils';
import type {
  PrivateServiceWithSlots,
  ServiceCompatibilityPass,
} from '#src/libs/private-service/types';
import { filterPrivateService } from '#src/libs/private-service/utils';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { PrivateServiceListItem } from '#src/libs/private-service/components/service/PrivateServiceListItem.component';
import { PrivateServiceSelector } from '#src/libs/private-service/components/service/PrivateServiceSelector.component';
import { PrivateSlotSelectionDialog } from '#src/libs/private-service/components/slot/PrivateSlotSelectionDialog.component';
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc.js';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { SCT } from '#src/libs/category/types';
import { getDecimalCreditHelperText } from '#src/libs/theme/utils';
import {
  getExcludedSlots,
  getIncludedSlots,
} from '#src/libs/private-service/components/pass/private-pass-form/PrivatePassFormDetailsAndRestrictionsStep.component';

type Props = {
  isContractNotEditable: boolean;
  isContractFromFranchise: boolean;

  initialPrivatePassDetails: PrivatePassDetailsForms;

  compatibleServicePass?: Array<ServiceCompatibilityPass>;

  privateServices: Array<PrivateServiceWithSlots>;

  establishmentList: Establishment[];
  metaActivityList: MetaActivity[];
  categoryList: SCT[];
};

export const PrivatePassDetailsForm = (props: Props) => {
  const {
    initialPrivatePassDetails,
    compatibleServicePass,
    privateServices,
    isContractNotEditable,
    isContractFromFranchise,
  } = props;
  const [selectedService, setSelectedService] =
    useState<PrivateServiceWithSlots | null>(null);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<
    number | null
  >(null);
  const [openDeleteCompatibilityDialog, setOpenDeleteCompatibilityDialog] =
    useState(false);

  const { t } = useTranslation('privateService');
  const classes = useStyles();

  const { values, setFieldValue } = useFormikContext<FormValues>();

  const handleGrantsDoorAccessChange = useCallback(() => {
    const newValue = !values.private_pass_details.grants_door_access;
    setFieldValue('private_pass_details.grants_door_access', newValue);
    if (newValue) {
      setFieldValue('private_pass_details.only_vod_access', false);
    }
  }, [setFieldValue, values.private_pass_details.grants_door_access]);

  const creditHelperText = React.useMemo(
    () =>
      getDecimalCreditHelperText(
        values.private_pass_details.credits,
        'privatePass.form.credits.decimalCredit.helperText',
        t,
        t('privatePass.form.credits.helperText'),
      ),
    [values.private_pass_details.credits, t],
  );

  const isCreatingPass = !initialPrivatePassDetails?.id;

  const isSharedFromFranchise =
    !!initialPrivatePassDetails?.template_instance || isContractFromFranchise;

  const setServiceAndIndex = (ps: PrivateServiceWithSlots, index: number) => {
    setSelectedService(ps);
    setSelectedServiceIndex(index);
  };

  const updateSlotData = React.useCallback(
    (
      data: {
        excluded_slot_ids: number[];
      },
      replace: { (index: number, value: any): void },
    ) => {
      replace(selectedServiceIndex, {
        private_service: selectedService?.id,
        excluded_slot_ids: data.excluded_slot_ids,
      });
      setServiceAndIndex(null, null);
    },
    [selectedService, selectedServiceIndex],
  );

  const onEditSomething = React.useCallback(
    (ps: PrivateServiceWithSlots) => {
      if (props.compatibleServicePass) {
        const psListForIndex: number[] =
          values.private_pass_details.compatibility?.map(
            (p_s: { private_service: any }) => p_s.private_service,
          );
        setServiceAndIndex(ps, psListForIndex.indexOf(ps.id));
      }
    },
    [props.compatibleServicePass, values.private_pass_details.compatibility],
  );

  return (
    <>
      {isSharedFromFranchise && (
        <div className={classes.row}>
          <WarningIcon color="error" />
          <Typography color="error" variant="body1">
            {t('privatePass.form.franchise')}
          </Typography>
        </div>
      )}
      <div
        className={classes.categoryBlock}
        id="private-pass-form-general-section"
      >
        <div className={classes.flexRowCenter}>
          <InfoIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.info')}
          </Typography>
        </div>

        <div className={classes.fieldBlock}>
          <TextField
            fullWidth
            disabled={isContractNotEditable || isSharedFromFranchise}
            helperText={creditHelperText}
            id="private-pass-credit-field"
            label={t('privatePass.form.credits.label')}
            name="private_pass_details.credits"
            type="number"
          />
        </div>
        <div
          className={`${classes.fieldBlock} ${classes.flexColumn}`}
          id="private-pass-switch-fields-container"
        >
          <SwitchField
            label={t('privatePass.form.full_vod_access.label')}
            name="private_pass_details.full_vod_access"
          />
          <SwitchField
            helperText={t('privatePass.form.appliesForPayroll.helperText')}
            label={t('privatePass.form.appliesForPayroll.label')}
            name="private_pass_details.applies_for_payroll"
          />
          <SwitchField
            helperText={t('privatePass.form.onBehalfOfTeacher.helperText')}
            label={t('privatePass.form.onBehalfOfTeacher.label')}
            name="private_pass_details.on_behalf_of_teacher"
          />
        </div>
      </div>

      <Divider className={classes.divider} />
      <FeatureListProvider featureList={['privatePassAccessControl']}>
        {(featureList: FeatureList) => {
          const hasAccessControlUpsell = hasAnyUpsell(featureList, [
            UPSELL_IDENTIFIER_KISI_INTEGRATION,
            UPSELL_IDENTIFIER_ACCESS_MONITORING,
          ]);

          return (
            hasAccessControlUpsell && (
              <>
                <div className={classes.formContainer}>
                  <Grid
                    container
                    id="private-pass-form-access-control-section"
                    spacing={2}
                  >
                    <Grid item xs={12}>
                      <div className={classes.infoText}>
                        <KeyIcon className={classes.icon} />
                        <Typography variant="h6">
                          {t('privatePass.form.accessControl.doorAccess')}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>
                        {t('privatePass.form.accessControl.accessControlInfo')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity="info">
                        {t(
                          'privatePass.form.accessControl.accessControlBetaAlert',
                        )}
                      </Alert>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.row}>
                        <SwitchField
                          label={t(
                            'privatePass.form.accessControl.enableAccessControl',
                          )}
                          name="private_pass_details.grants_door_access"
                          onChange={handleGrantsDoorAccessChange}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </>
            )
          );
        }}
      </FeatureListProvider>
      <Divider className={classes.divider} />

      <div
        className={classes.categoryBlock}
        id="private-pass-form-compatibility-section"
      >
        <div className={classes.flexRowCenter}>
          <DoneAllIcon className={classes.iconLeft} />
          <Typography variant="h6">
            {t('privatePass.form.categoryTitle.compatibility')}
          </Typography>
        </div>

        <div className={classes.fieldBlock}>
          <FieldArray {...props} name="private_pass_details.compatibility">
            {({ remove, push, replace }) => {
              return (
                <>
                  <ObjectLevelPermissionProviderComponent requiredPermission="product.privatePass.allowed_actions.compatibility">
                    {(canEditCompatibilities: boolean) => (
                      <>
                        {(canEditCompatibilities || isCreatingPass) && (
                          <div className={classes.privateServiceSelector}>
                            <PrivateServiceSelector
                              onChange={(e: any) =>
                                push({
                                  private_service: e,
                                  excluded_slot_ids: [],
                                })
                              }
                              placeholder={t(
                                'privatePass.form.selector.privateService',
                              )}
                              privateServices={privateServices
                                .filter((ps: PrivateServiceWithSlots) =>
                                  filterPrivateService(
                                    ps,
                                    values?.private_pass_details.compatibility,
                                    false,
                                  ),
                                )
                                .filter((ps) => ps.available)}
                            />
                          </div>
                        )}
                        <List>
                          {!!values?.private_pass_details.compatibility
                            ?.length &&
                            privateServices
                              .filter((ps: PrivateServiceWithSlots) =>
                                filterPrivateService(
                                  ps,
                                  values?.private_pass_details.compatibility,
                                  true,
                                ),
                              )
                              .filter((ps) => ps.available)
                              .map((ps) => (
                                <PrivateServiceListItem
                                  key={ps.id}
                                  hideSecondary
                                  excluded_slots={getExcludedSlots(
                                    ps,
                                    values?.private_pass_details.compatibility,
                                  )}
                                  included_slots={getIncludedSlots(
                                    ps,
                                    values?.private_pass_details.compatibility,
                                  )}
                                  isEditable={
                                    canEditCompatibilities || isCreatingPass
                                  }
                                  onDelete={() => {
                                    const psArray: number[] =
                                      initialPrivatePassDetails &&
                                      initialPrivatePassDetails.compatibility
                                        ?.length
                                        ? initialPrivatePassDetails.compatibility.map(
                                            (p_s) => p_s.private_service,
                                          )
                                        : [];
                                    const psListForIndex: number[] =
                                      values?.private_pass_details.compatibility?.map(
                                        (p_s: { private_service: any }) =>
                                          p_s.private_service,
                                      );
                                    if (
                                      initialPrivatePassDetails &&
                                      psArray.includes(ps.id)
                                    ) {
                                      setSelectedServiceIndex(
                                        psListForIndex.indexOf(ps.id),
                                      );
                                      setOpenDeleteCompatibilityDialog(true);
                                    } else {
                                      remove(psListForIndex.indexOf(ps.id));
                                    }
                                  }}
                                  onEdit={() => onEditSomething(ps)}
                                  privateService={ps}
                                />
                              ))}

                          {!values?.private_pass_details.compatibility
                            .length && (
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
                                      {t(
                                        'privatePass.compatibleServices.isEmpty',
                                      )}
                                    </Typography>
                                    <Typography variant="body2">
                                      {t(
                                        'privatePass.compatibleServices.unusable',
                                      )}
                                    </Typography>
                                  </div>
                                }
                              />
                            </ListItem>
                          )}
                        </List>
                      </>
                    )}
                  </ObjectLevelPermissionProviderComponent>
                  <PrivateSlotSelectionDialog
                    compatibility={values?.private_pass_details.compatibility}
                    compatibleServicePass={compatibleServicePass}
                    onCancel={() => setServiceAndIndex(null, null)}
                    onSubmit={(data: { excluded_slot_ids: number[] }) =>
                      updateSlotData(data, replace)
                    }
                    privateServices={privateServices}
                    // @ts-expect-error - Legacy typing issue
                    selectedService={selectedService}
                  />
                  <Dialog open={!!openDeleteCompatibilityDialog}>
                    <DialogTitle>
                      {t('privateServiceCompatibility.delete.title')}
                    </DialogTitle>
                    <DialogContent>
                      {t('privateServiceCompatibility.delete.explain')}
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          setSelectedServiceIndex(null);
                          setOpenDeleteCompatibilityDialog(false);
                        }}
                      >
                        {t('privateServiceCompatibility.delete.cancel')}
                      </Button>
                      <Button
                        onClick={() => {
                          remove(selectedServiceIndex);
                          setSelectedServiceIndex(null);
                          setOpenDeleteCompatibilityDialog(false);
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
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fieldBlock: {
    marginBottom: theme.spacing(2),
  },
  fieldBlockFlex: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItem: 'center',
    flexDirection: 'column',
  },
  buttonContainer: {
    marginTop: -theme.spacing(2),
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
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
    height: 2,
    color: '#C6C6C6',
  },
  formContainer: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
  categoryBlock: {
    paddingBottom: theme.spacing(2),
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
  flexRow: {
    display: 'flex',
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: theme.spacing(4),

    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  helperTextError: {
    color: theme.palette.error.main,
  },
  infoText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));
export default PrivatePassDetailsForm;
