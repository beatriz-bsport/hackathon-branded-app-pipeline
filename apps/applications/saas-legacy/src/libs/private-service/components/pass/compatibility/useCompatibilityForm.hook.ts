import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { PaymentPackCompatibilitiesData } from '#src/libs/payment-packs/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/libs/establishment/types';
import { SCT } from '#src/libs/category/types';

type PaymentPackCompatibilityValues = {
  metaActivities: MetaActivity[];
  establishments: Establishment[];
  SCTs: SCT[];
};

type Props = {
  paymentPackValues: PaymentPackCompatibilityValues;
  updatePassCompatibility: (data: PaymentPackCompatibilitiesData) => void;
  SCTList: SCT[];
  availableEstablishmentList: Array<Establishment>;
  metaActivityList: Array<MetaActivity>;
};

export const useCompatibilityForm = ({
  availableEstablishmentList,
  SCTList,
  metaActivityList,
  paymentPackValues,
  updatePassCompatibility,
}: Props) => {
  const formik = useFormik<PaymentPackCompatibilitiesData>({
    enableReinitialize: true,
    initialValues: {
      SCTs: paymentPackValues?.SCTs?.map((category) => category?.id) || [],
      establishments:
        paymentPackValues?.establishments?.map(
          (establishment) => establishment?.id,
        ) || [],
      metaActivities:
        paymentPackValues?.metaActivities?.map(
          (metaActivity) => metaActivity?.id,
        ) || [],
    },
    onSubmit: (values) => {
      updatePassCompatibility({
        SCTs: values?.SCTs,
        establishments: values?.establishments,
        metaActivities: values?.metaActivities,
      });
    },
  });

  const onSCTsChange = useCallback(
    (options: { label: string; value: number }[]) => {
      formik.setFieldValue(
        'SCTs',
        options?.map((option) => option.value),
      );
      formik.handleSubmit();
    },
    [formik],
  );
  const onEstablishmentChange = useCallback(
    (options: { label: string; value: number }[]) => {
      formik.setFieldValue(
        'establishments',
        options?.map((option) => option.value),
      );
      formik.handleSubmit();
    },
    [formik],
  );
  const onMetaActivitiesChange = useCallback(
    (options: { label: string; value: number }[]) => {
      formik.setFieldValue(
        'metaActivities',
        options?.map((option) => option.value),
      );
      formik.handleSubmit();
    },
    [formik],
  );

  const SCTsOptions = useMemo(
    () => [
      ...(SCTList ?? []).map((category) => ({
        label: category.name,
        value: category.id,
        parentCategory: category.id,
      })),
    ],
    [SCTList],
  );

  const establishmentsOptions = useMemo(
    () => [
      ...(availableEstablishmentList ?? []).map((establishment) => ({
        label: establishment.title,
        value: establishment.id,
        parentCategory: establishment.id,
      })),
    ],
    [availableEstablishmentList],
  );

  const metaActivitiesOptions = useMemo(
    () => [
      ...(metaActivityList ?? []).map((metaActivity) => ({
        label: metaActivity.name,
        value: metaActivity.id,
        parentCategory: metaActivity.id,
      })),
    ],
    [metaActivityList],
  );

  const SCTValues = useMemo(
    () =>
      paymentPackValues?.SCTs?.map((category) => ({
        label: category.name,
        value: category.id,
        parentCategory: category.SCS.id,
      })),
    [paymentPackValues?.SCTs],
  );

  const establishmentsValues = useMemo(
    () =>
      paymentPackValues?.establishments
        ?.map((establishment) => ({
          label: establishment?.title,
          value: establishment?.id,
        }))
        .filter((option) => !!option.value && !!option.label),
    [paymentPackValues?.establishments],
  );

  const metaActivitiesValues = useMemo(
    () =>
      (paymentPackValues?.metaActivities ?? []).map((meta: MetaActivity) => ({
        label: meta?.name,
        value: meta?.id,
      })),
    [paymentPackValues?.metaActivities],
  );

  return {
    onChangeHandlers: {
      SCTs: onSCTsChange,
      establishments: onEstablishmentChange,
      metaActivities: onMetaActivitiesChange,
    },
    options: {
      SCTs: SCTsOptions,
      establishments: establishmentsOptions,
      metaActivities: metaActivitiesOptions,
    },
    values: {
      SCTs: SCTValues,
      establishments: establishmentsValues,
      metaActivities: metaActivitiesValues,
    },
  };
};
