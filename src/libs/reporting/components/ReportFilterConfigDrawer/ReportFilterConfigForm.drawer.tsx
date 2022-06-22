import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps } from 'formik';

import {
  Button,
  ButtonBase,
  CircularProgress,
  Divider,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import EditIcon from '@material-ui/icons/Edit';

import {
  DynamicFilterDataType,
  ReportFilterConfig,
  ReportFilterConfigGroup,
  ReportFilterConfigGroupOperand,
  ReportMetadataColumn,
} from '../../types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { Submit, DelayTextField } from '#components/forms';

import {
  DATATYPE_FILTERABLE_BY_FLOAT_RANGE,
  DATATYPE_FILTERABLE_BY_ID_IN,
  DATE_SUBDATA_TYPE,
  FILTER_IN_OPERAND,
  GROUP_AND_OPERAND,
  HOUR_SUBDATA_TYPE,
} from '../../constants';
import {
  getComparatorsByDataType,
  checkColumnAlreadyExist,
  generateNewGroup,
  generateNewFilterItem,
} from './utils';

import NestedAlertError from './NestedAlertError.component';
import OperandSelect from './OperandSelect.component';
import ReportFilterConfigGroupRow from './ReportFilterConfigGroupRow.component';

type Values = {
  name: string;
  config: {
    group_operand: ReportFilterConfigGroupOperand;
    groups: ReportFilterConfigGroup[];
  };
};

export type OuterProps = {
  open: boolean;
  columns: ReportMetadataColumn[];
  initial?: ReportFilterConfig;
  isPreview?: boolean;
  onClose?: () => void;
  handleGetDynamicDataForReport: (datatype: DynamicFilterDataType) => any[];
  onSubmit: (props: {
    id: number;
    values: Omit<ReportFilterConfig, 'id'>;
  }) => void;
};

const ReportFilterConfigFormDrawerSchema = Yup.object().shape({
  name: Yup.string().required(),
  config: Yup.object().shape({
    group_operand: Yup.number().required(),
    groups: Yup.array()
      .of(
        Yup.object().shape({
          inner_operand: Yup.number().required(),
          filters_data: Yup.array()
            .of(
              Yup.lazy((filer_data) => {
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
                        ).includes(item);
                      },
                    ),
                };

                if (filer_data.datatype === 'boolean') {
                  return Yup.object().shape({
                    ...defaultSchema,
                    value: Yup.boolean().required('filter.form.error.required'),
                  });
                }

                if (
                  DATATYPE_FILTERABLE_BY_FLOAT_RANGE.includes(
                    filer_data.datatype,
                  )
                ) {
                  if (filer_data.comparator === FILTER_IN_OPERAND) {
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
                          function CheckOrder(item) {
                            return item[0] < item[1];
                          },
                        ),
                    });
                  }

                  if (
                    DATATYPE_FILTERABLE_BY_ID_IN.includes(filer_data.datatype)
                  ) {
                    return Yup.object().shape({
                      ...defaultSchema,
                      value: Yup.array().of(Yup.number()).required().min(1),
                    });
                  }
                }

                if (filer_data.datatype === 'date') {
                  if (filer_data.comparator === FILTER_IN_OPERAND) {
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
                          function CheckOrder(item) {
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

                if (filer_data.datatype === 'time') {
                  if (filer_data.comparator === FILTER_IN_OPERAND) {
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
                          function CheckOrder(item) {
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

                if (filer_data.datatype === 'datetime') {
                  if (filer_data.comparator === FILTER_IN_OPERAND) {
                    return Yup.object().shape({
                      ...defaultSchema,
                      sub_datatype: Yup.number().oneOf([
                        DATE_SUBDATA_TYPE,
                        HOUR_SUBDATA_TYPE,
                      ]),
                      time_period:
                        filer_data.sub_datatype !== HOUR_SUBDATA_TYPE
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
                          function CheckOrder(item) {
                            return item[0] < item[1];
                          },
                        ),
                    });
                  }

                  if (filer_data.sub_datatype === DATE_SUBDATA_TYPE) {
                    return Yup.object().shape({
                      ...defaultSchema,
                      time_period: Yup.string().required(),
                      sub_datatype: Yup.number().oneOf([DATE_SUBDATA_TYPE]),
                      value: Yup.number().required(),
                    });
                  }

                  if (filer_data.sub_datatype === HOUR_SUBDATA_TYPE) {
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
      )
      .required()
      .min(1)
      .test(
        'Is byId duplicate',
        'filter.form.error.byIdDuplicate',
        function CheckAmout(item) {
          const allDatatypes = item.flatMap((fg) =>
            fg.filters_data.map((data) => data.datatype),
          );
          const datatypesCount = allDatatypes.reduce((acc, datatype) => {
            if (!acc[datatype]) {
              acc[datatype] = 0;
            }
            acc[datatype] += 1;
            return acc;
          }, {});

          return !DATATYPE_FILTERABLE_BY_ID_IN.some(
            (datatype) => datatypesCount[datatype] > 1,
          );
        },
      ),
  }),
});

const ReportFilterConfigFormDrawer: React.FC<
  OuterProps & FormikProps<Values>
> = ({
  open,
  initial,
  isSubmitting,
  isValid,
  values,
  columns,
  isPreview: isPreviewProps,
  setFieldValue,
  onClose,
  resetForm,
  handleGetDynamicDataForReport,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(isPreviewProps);
  const buttonRef = useRef(null);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const handleEditView = () => {
    setIsPreview(false);
  };

  //
  // Columns management
  //
  const consumableColumns = useMemo(
    () =>
      columns.filter((d) => {
        if (!d.is_filterable) return false;
        // by Id filter sould be uniq across the filter as a product decision
        if (
          DATATYPE_FILTERABLE_BY_ID_IN.includes(d.datatype) &&
          checkColumnAlreadyExist(d.datatype, values.config.groups)
        )
          return false;
        return true;
      }),
    [columns, values.config.groups],
  );

  const reportColumns = useMemo(() => {
    return columns.filter((c) => c.is_filterable).map((c) => c.identifier);
  }, [columns]);

  const checkOtherRowExist = useCallback(
    (uuid) =>
      values.config.groups.some((fg) =>
        fg.filters_data.some((fd) => fd.uuid !== uuid),
      ),
    [values.config.groups],
  );

  //
  // Handlers
  //
  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAddFilter = () => {
    setIsMenuOpen(false);
    setFieldValue(`config.groups`, [
      ...values.config.groups,
      generateNewGroup(consumableColumns[0], true),
    ]);
  };

  const handleAddFilterGroup = () => {
    setIsMenuOpen(false);
    setFieldValue(`config.groups`, [
      ...values.config.groups,
      generateNewGroup(consumableColumns[0]),
    ]);
  };

  const handleDeleteFilter = useCallback(
    (uuid: number) => () => {
      const groupsWithoutFilter = values.config.groups.map((g) => ({
        ...g,
        filters_data: g.filters_data.filter((d) => d.uuid !== uuid),
      }));

      const groupsWithoutEmptys = groupsWithoutFilter.filter(
        (g) => g.filters_data.length > 0,
      );

      setIsMenuOpen(false);
      setFieldValue(`config.groups`, [...groupsWithoutEmptys]);
    },
    [setFieldValue, values.config.groups],
  );

  const handleAddFilterInGroup = useCallback(
    (index: number) => () => {
      const newGroups = [...values.config.groups];
      newGroups[index] = {
        ...newGroups[index],
        filters_data: [
          ...newGroups[index].filters_data,
          generateNewFilterItem(consumableColumns[0]),
        ],
      };

      setFieldValue(`config.groups`, [...newGroups]);
    },
    [consumableColumns, setFieldValue, values.config.groups],
  );

  return (
    <GenericResponsiveDrawer
      open={open}
      onClose={onClose}
      title={t('filter.form.title')}
      subtitle={initial?.name || null}
      width="1000px"
      withoutPadding
    >
      <div className={classes.main}>
        <Form className={classes.form}>
          <div className={classes.container}>
            {!isPreview && (
              <>
                <div className={classes.innerContainer}>
                  <div className={classes.row}>
                    <InfoIcon color="disabled" />
                    <Typography variant="h6">
                      {t('filter.form.information')}
                    </Typography>
                  </div>
                  <DelayTextField
                    fullWidth
                    name="name"
                    required
                    label={t('filter.form.name')}
                  />
                </div>
                <Divider className={classes.divider} />
              </>
            )}
            <div className={classes.innerContainer}>
              <div className={classNames(classes.row, classes.formTitle)}>
                <FilterListIcon color="disabled" />
                <Typography variant="h6">{t('filter.form.filter')}</Typography>
              </div>
              <div className={classes.groupOperand}>
                <OperandSelect
                  name="config.group_operand"
                  isPreview={isPreview}
                />
              </div>
              <Typography color="textSecondary" className={classes.helper}>
                {t(
                  `filter.form.groupOperandHelperText.${values.config.group_operand}`,
                )}
              </Typography>
              {reportColumns?.length === 0 && (
                <Typography color="error">
                  {t('filter.form.emptyState')}
                </Typography>
              )}
              {reportColumns?.length > 0 && (
                <>
                  <div className={classes.verticalRows}>
                    {values.config.groups.map((filterGroup, indexGroup) => (
                      <ReportFilterConfigGroupRow
                        filterGroup={filterGroup}
                        key={filterGroup.uuid}
                        consumableColumns={consumableColumns}
                        reportColumns={reportColumns}
                        groupOperand={values.config.group_operand}
                        prefix={`config.groups[${indexGroup}]`}
                        setFieldValue={setFieldValue}
                        hidePrefix={indexGroup === 0}
                        addFilter={handleAddFilterInGroup(indexGroup)}
                        checkOtherRowExist={checkOtherRowExist}
                        onDelete={handleDeleteFilter}
                        getDataByType={handleGetDynamicDataForReport}
                        isPreview={isPreview}
                      />
                    ))}
                  </div>
                  <NestedAlertError name="config.groups[0].filters_data">
                    {(error_msg: string) => (
                      <Typography variant="caption" color="error">
                        {t(`${error_msg}`)}
                      </Typography>
                    )}
                  </NestedAlertError>
                  <NestedAlertError name="config.groups">
                    {(error_msg: string) => (
                      <Typography variant="caption" color="error">
                        {t(`${error_msg}`)}
                      </Typography>
                    )}
                  </NestedAlertError>
                  {consumableColumns?.length > 0 && !isPreview && (
                    <ButtonBase
                      color="primary"
                      onClick={handleOpenMenu}
                      className={classes.buttonAdd}
                      ref={buttonRef}
                    >
                      <AddIcon color="primary" />
                      {t('filter.form.add')?.toUpperCase()}
                    </ButtonBase>
                  )}
                  <Menu
                    anchorEl={buttonRef.current}
                    open={isMenuOpen}
                    onClose={handleCloseMenu}
                    className={classes.menu}
                  >
                    <MenuItem
                      className={classes.menuItem}
                      onClick={handleAddFilter}
                    >
                      <AddIcon />
                      <Typography>
                        {t('filter.form.addFilterOption')}
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className={classes.menuItem}
                      onClick={handleAddFilterGroup}
                    >
                      <AddToPhotosIcon />
                      <Typography>{t('filter.form.addGroupOption')}</Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </div>
          {!isPreview && (
            <div className={classes.buttonContainer}>
              <Button onClick={onClose}>{t('filter.form.cancel')}</Button>
              <Submit disabled={isSubmitting || !isValid} color="primary">
                {isSubmitting ? <CircularProgress /> : t('filter.form.submit')}
              </Submit>
            </div>
          )}
          {isPreview && (
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditView}
              >
                <EditIcon className={classes.editIcon} />
                {t('filter.form.edit')}
              </Button>
            </div>
          )}
        </Form>
      </div>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingBottom: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  innerContainer: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  groupOperand: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  helper: { marginTop: theme.spacing(1), marginBottom: theme.spacing(2) },
  verticalRows: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
  buttonAdd: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
  },
  menu: {
    marginTop: theme.spacing(6),
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  formTitle: {
    marginBottom: theme.spacing(2),
  },
  editIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default compose<any, OuterProps>(
  withFormik<OuterProps, Values>({
    mapPropsToValues: ({ initial, columns }) => {
      if (initial) {
        return {
          name: initial.name,
          config: initial.config,
        };
      }

      const column = columns.filter((c) => c.is_filterable)?.[0];

      return {
        name: '',
        config: {
          group_operand: GROUP_AND_OPERAND,
          groups: [generateNewGroup(column, true)],
        },
      };
    },
    validationSchema: ReportFilterConfigFormDrawerSchema,
    handleSubmit: (values, { props: { onSubmit, initial }, setSubmitting }) => {
      const { id, ...restInitial } = initial ?? {};

      onSubmit({
        id,
        values: {
          ...(restInitial ?? {}),
          ...values,
        },
        options: {
          onSuccess: () => {
            setSubmitting(false);
          },
          onError: () => {
            setSubmitting(false);
          },
        },
      });
    },
  }),
)(ReportFilterConfigFormDrawer);
