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
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import SCTChip from '#libs/category/components/SCTChip.component';
import { SCT } from '#libs/category/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';

import { FormikValues } from '#libs/private-service/components/pass/private-pass-form/PrivatePassForm.component';

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
    <div className={classes.outterContainer}>
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
              options={
                [
                  ...(categoryList || [])?.map((category) => ({
                    label: category.name,
                    value: category.id,
                    parentCategory: category.SCS.id,
                  })),
                ] || []
              }
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
                  parentCategory={chipProps.data.parentCategory}
                  SCTName={chipProps.data.label}
                  onDelete={chipProps.onDelete}
                  color="primary"
                />
              )}
              value={values?.linked_payment_pack_categories?.map((id) => ({
                label: categoryList.find((category) => category.id === id)
                  ?.name,
                value: id,
                parentCategory: categoryList.find(
                  (category) => category.id === id,
                )?.SCS.id,
              }))}
              onChange={(options) => {
                setFieldValue(
                  'linked_payment_pack_categories',
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
              menuPosition="fixed"
              options={
                [
                  ...(establishmentList || [])?.map((establishment) => ({
                    label: establishment.title,
                    value: establishment.id,
                  })),
                ] || []
              }
              isMulti
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
              value={values?.linked_payment_pack_establishments?.map((id) => ({
                label: establishmentList.find(
                  (establishment) => establishment.id === id,
                )?.title,
                value: id,
              }))}
              onChange={(options) => {
                setFieldValue(
                  'linked_payment_pack_establishments',
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
              options={[
                ...(metaActivityList || [])?.map((metaActivity) => ({
                  label: metaActivity.name,
                  value: metaActivity.id,
                })),
              ]}
              isMulti
              chipsRenderer={(chipProps: { data; onDelete: () => void }) => (
                <Chip
                  label={chipProps.data.label}
                  onDelete={chipProps.onDelete}
                  color="primary"
                />
              )}
              value={values?.linked_payment_pack_metaActivities?.map((id) => ({
                label: metaActivityList.find(
                  (metaActivity) => metaActivity.id === id,
                )?.name,
                value: id,
              }))}
              onChange={(options) => {
                setFieldValue(
                  'linked_payment_pack_metaActivities',
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
      </Grid>
    </div>
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
