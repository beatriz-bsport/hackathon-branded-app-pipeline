import * as Yup from 'yup';

import {
  DATATYPE_FILTERABLE_BY_FLOAT_RANGE,
  DATATYPE_FILTERABLE_BY_ID_IN,
  DATE_SUBDATA_TYPE,
  FILTER_IN_OPERAND,
  HOUR_SUBDATA_TYPE,
} from './constants';
import { getComparatorsByDataType } from './utils';
import type { DatatypeFilterConfigItem } from './types';

// groups is optional here
const BaseSchema = {
  group_operand: Yup.number().required(),
  groups: Yup.array().of(
    Yup.object().shape({
      inner_operand: Yup.number().required(),
      filters_data: Yup.array()
        .of(
          Yup.lazy((filter_data: DatatypeFilterConfigItem) => {
            const defaultSchema = {
              identifier: Yup.string().required(),
              datatype: Yup.string().required(),
              sub_datatype: Yup.number().nullable(true),
              time_period: Yup.string().nullable(true),
              comparator: Yup.number()
                .required()
                .test(
                  'Is Type allowed',
                  'filter.form.error.invalidTypeForColumns',
                  function CheckAmout(item) {
                    return getComparatorsByDataType(
                      this.parent.datatype,
                      // @ts-expect-error
                    ).includes(item);
                  },
                ),
            };

            if (filter_data.datatype === 'boolean') {
              return Yup.object().shape({
                ...defaultSchema,
                value: Yup.boolean().required('filter.form.error.required'),
              });
            }

            if (
              filter_data.datatype === 'products' ||
              filter_data.datatype === 'product_category'
            ) {
              return Yup.object().shape({
                ...defaultSchema,
                value: Yup.object()
                  .shape({
                    object_ids: Yup.array().of(Yup.number()).required().min(1),
                    buyable_item_identifier: Yup.number().required(),
                  })
                  .required(),
              });
            }

            if (
              DATATYPE_FILTERABLE_BY_FLOAT_RANGE.includes(filter_data.datatype)
            ) {
              if (filter_data.comparator === FILTER_IN_OPERAND) {
                return Yup.object().shape({
                  ...defaultSchema,
                  value: Yup.array()
                    .of(Yup.number().required())
                    .required()
                    .min(2)
                    .max(2)
                    .test(
                      'Is in rigth order',
                      'filter.form.error.wrongOrdering',
                      (item) => {
                        return item[0] < item[1];
                      },
                    ),
                });
              }

              if (DATATYPE_FILTERABLE_BY_ID_IN.includes(filter_data.datatype)) {
                return Yup.object().shape({
                  ...defaultSchema,
                  value: Yup.array().of(Yup.number()).required().min(1),
                });
              }
            }

            if (filter_data.datatype === 'date') {
              if (filter_data.comparator === FILTER_IN_OPERAND) {
                return Yup.object().shape({
                  ...defaultSchema,
                  time_period: Yup.string().required(),
                  value: Yup.array()
                    .of(Yup.number().required())
                    .required()
                    .min(2)
                    .max(2)
                    .test(
                      'Is in rigth order',
                      'filter.form.error.wrongOrdering',
                      (item) => {
                        return item[0] < item[1];
                      },
                    ),
                });
              }

              return Yup.object().shape({
                ...defaultSchema,
                time_period: Yup.string().required(),
                value: Yup.number().required(),
              });
            }

            if (filter_data.datatype === 'time') {
              if (filter_data.comparator === FILTER_IN_OPERAND) {
                return Yup.object().shape({
                  ...defaultSchema,
                  value: Yup.array()
                    .of(Yup.number().required())
                    .required()
                    .min(2)
                    .max(2)
                    .test(
                      'Is in rigth order',
                      'filter.form.error.wrongOrdering',
                      (item) => {
                        return item[0] < item[1];
                      },
                    ),
                });
              }

              return Yup.object().shape({
                ...defaultSchema,
                value: Yup.number().required(),
              });
            }

            if (filter_data.datatype === 'datetime') {
              if (filter_data.comparator === FILTER_IN_OPERAND) {
                return Yup.object().shape({
                  ...defaultSchema,
                  sub_datatype: Yup.number().oneOf([
                    DATE_SUBDATA_TYPE,
                    HOUR_SUBDATA_TYPE,
                  ]),
                  time_period:
                    filter_data.sub_datatype !== HOUR_SUBDATA_TYPE
                      ? Yup.string().required()
                      : Yup.string().nullable(),
                  value: Yup.array()
                    .of(Yup.number().required())
                    .required()
                    .min(2)
                    .max(2)
                    .test(
                      'Is in rigth order',
                      'filter.form.error.wrongOrdering',
                      (item) => {
                        return item[0] < item[1];
                      },
                    ),
                });
              }

              if (filter_data.sub_datatype === DATE_SUBDATA_TYPE) {
                return Yup.object().shape({
                  ...defaultSchema,
                  time_period: Yup.string().required(),
                  sub_datatype: Yup.number().oneOf([DATE_SUBDATA_TYPE]),
                  value: Yup.number().required(),
                });
              }

              if (filter_data.sub_datatype === HOUR_SUBDATA_TYPE) {
                return Yup.object().shape({
                  ...defaultSchema,
                  // time_period: Yup.string().nullable(true),
                  sub_datatype: Yup.number().oneOf([HOUR_SUBDATA_TYPE]),
                  value: Yup.number().required(),
                });
              }
            }

            return Yup.object().shape({
              ...defaultSchema,
              value: Yup.number().required(),
            });
          }),
        )
        .required('filter.form.error.needAtLeatOneFilter')
        .min(1),
    }),
  ),
  // .test(
  //   'Is byId duplicate',
  //   'filter.form.error.byIdDuplicate',
  //   function CheckAmout(item) {
  //     const allDatatypes = (item ?? []).flatMap((fg) =>
  //       fg.filters_data.map((data) => data.datatype),
  //     );
  //     const datatypesCount = allDatatypes.reduce((acc, datatype) => {
  //       if (!acc[datatype]) {
  //         acc[datatype] = 0;
  //       }
  //       acc[datatype] += 1;
  //       return acc;
  //     }, {});

  //     return !DATATYPE_FILTERABLE_BY_ID_IN.some(
  //       (datatype) => datatypesCount[datatype] > 1,
  //     );
  //   },
  // ),
};

// Dashboard use case: empty filter_config is allowed
export const DatatypeFilterConfigSchemaWithOptionalGroups = Yup.object().shape({
  ...BaseSchema,
});

// Report use case: empty filter_config is not allowed
export const DatatypeFilterConfigSchemaWithRequiredGroups = Yup.object().shape({
  ...BaseSchema,
  groups: BaseSchema.groups.required().min(1),
});
