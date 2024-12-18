import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { Chip, Paper, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import SCTChip from '#src/libs/category/components/SCTChip.component';
import { SCT } from '#src/libs/category/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { PaymentPackCompatibilitiesData } from '#src/libs/payment-packs/types';
import { useCompatibilityForm } from './useCompatibilityForm.hook';

export type Props = {
  SCTList: SCT[];
  availableEstablishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
  updatePassCompatibility: (data: PaymentPackCompatibilitiesData) => void;
  paymentPackValues: {
    metaActivities: MetaActivity[];
    establishments: Establishment[];
    SCTs: SCT[];
  };
};

const CompatibilityForm: React.FC<Props> = ({
  SCTList,
  availableEstablishmentList,
  metaActivityList,
  updatePassCompatibility,
  paymentPackValues,
}) => {
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();

  const { onChangeHandlers, options, values } = useCompatibilityForm({
    availableEstablishmentList,
    SCTList,
    metaActivityList,
    paymentPackValues,
    updatePassCompatibility,
  });

  return (
    <ObjectLevelPermissionProvider requiredPermission="product.paymentPack.allowed_actions.compatibility">
      {(canEditCompatibilities: boolean) => (
        <Paper className={classes.container}>
          <div className={classes.detailCategory}>
            <DoneAllIcon className={classes.leftIcon} />
            <Typography variant="h6">
              {t('detailTitles.compatibility')}
            </Typography>
          </div>
          <div className={classes.titleAndSelector}>
            <Typography variant="subtitle1">
              {t('addPaymentPack.categories')}
            </Typography>
            <MaterialUISelector
              inScrollBar
              isMenuListPaddingDisabled
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
              isDisabled={!canEditCompatibilities}
              onChange={onChangeHandlers.SCTs}
              options={options.SCTs}
              placeholder={t('addPaymentPack.letBlank')}
              value={values.SCTs}
            />
          </div>
          <div className={classes.titleAndSelector}>
            <Typography variant="subtitle1">
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
              isDisabled={!canEditCompatibilities}
              menuPosition="fixed"
              onChange={onChangeHandlers.establishments}
              options={options.establishments}
              placeholder={t('addPaymentPack.letBlank')}
              value={values.establishments}
            />
          </div>
          <div className={classes.titleAndSelector}>
            <Typography variant="subtitle1">
              {t('addPaymentPack.activities')}
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
                <Chip
                  color="primary"
                  label={chipProps.data.label}
                  onDelete={chipProps.onDelete}
                />
              )}
              defaultNumberShown={3}
              id="activities-selector"
              isDisabled={!canEditCompatibilities}
              onChange={onChangeHandlers.metaActivities}
              options={options.metaActivities}
              placeholder={t('addPaymentPack.letBlank')}
              value={values.metaActivities}
            />
          </div>
          <div className={classes.warning}>
            <WarningIcon color="primary" />
            <Typography variant="body2">
              {t('addPaymentPack.compatibility')}
            </Typography>
          </div>
        </Paper>
      )}
    </ObjectLevelPermissionProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
  },
  titleAndSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  detailCategory: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  leftIcon: { height: theme.spacing(3), width: theme.spacing(3) },
  warning: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

export const CompatibilityFormForStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof CompatibilityForm>>()(
    CompatibilityForm,
  );

export default React.memo(CompatibilityForm);
