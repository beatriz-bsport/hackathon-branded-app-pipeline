import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import { useFormikContext, FormikProps } from 'formik';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import SCTChip from '#src/libs/category/components/SCTChip.component';
import { SCT } from '#src/libs/category/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';

import { PrivatePassFormValues as FormikValues } from '#src/libs/private-service/components/pass/private-pass-form/PrivatePassForm.component';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

type Props = {
  categoryList: Array<SCT>;
  establishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
};
export const UniversalPassFormPaymentPackCompatibility = (props: Props) => {
  const { categoryList, establishmentList, metaActivityList } = props;
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();

  const { values, setFieldValue }: FormikProps<FormikValues> =
    useFormikContext();
  return (
    <ObjectLevelPermissionProviderComponent requiredPermission="product.paymentPack.allowed_actions.compatibility">
      {(canEditCompatibilities: boolean) => (
        <div
          className={classes.outterContainer}
          id="universal-pass-compatibility"
        >
          <div className={classes.flexRowCenter}>
            <DoneIcon className={classes.iconLeft} />
            <Typography variant="h6">
              {t('detailTitles.compatibilityPaymentPack')}
            </Typography>
          </div>

          <Grid container spacing={2}>
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
                      // @ts-expect-error
                      color="primary"
                      onDelete={chipProps.onDelete}
                      parentCategory={chipProps.data.parentCategory}
                      SCTName={chipProps.data.label}
                    />
                  )}
                  isDisabled={!canEditCompatibilities}
                  onChange={(options) => {
                    setFieldValue(
                      'linked_payment_pack_categories',
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
                  value={values?.linked_payment_pack_categories?.map((id) => ({
                    label: categoryList.find((category) => category.id === id)
                      ?.name,
                    value: id,
                    parentCategory: categoryList.find(
                      (category) => category.id === id,
                    )?.SCS.id,
                  }))}
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
                  isDisabled={!canEditCompatibilities}
                  menuPosition="fixed"
                  onChange={(options) => {
                    setFieldValue(
                      'linked_payment_pack_establishments',
                      // @ts-expect-error
                      options?.map((option) => option.value),
                    );
                  }}
                  options={[
                    ...(establishmentList ?? [])?.map((establishment) => ({
                      label: establishment.title,
                      value: establishment.id,
                    })),
                  ]}
                  placeholder={t('addPaymentPack.letBlank')}
                  value={values?.linked_payment_pack_establishments?.map(
                    (id) => ({
                      label: establishmentList.find(
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
                  isDisabled={!canEditCompatibilities}
                  onChange={(options) => {
                    setFieldValue(
                      'linked_payment_pack_metaActivities',
                      options?.map((option) => option.value),
                    );
                  }}
                  options={[
                    ...(metaActivityList ?? [])?.map((metaActivity) => ({
                      label: metaActivity.name,
                      value: metaActivity.id,
                    })),
                  ]}
                  placeholder={t('addPaymentPack.letBlank')}
                  value={values?.linked_payment_pack_metaActivities?.map(
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
            <Grid item className={classes.warningItem} xs={6}>
              <div className={classes.warning}>
                <WarningIcon color="primary" />
                <Typography variant="body2">
                  {t('addPaymentPack.compatibility')}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </ObjectLevelPermissionProviderComponent>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  outterContainer: {
    padding: theme.spacing(4),
  },
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
  iconLeft: {
    marginRight: theme.spacing(2),
    color: '#868686',
  },
  flexRowCenter: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
}));
export default UniversalPassFormPaymentPackCompatibility;
