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
  FormHelperText,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import EditIcon from '@material-ui/icons/Edit';
import { DatatypeFilterConfigSchemaWithRequiredGroups } from '#src/libs/datatype-filtering/validation_schema';

import type {
  DatatypeFilterConfigGroupOperand,
  DatatypeFilterConfigGroup,
} from '#src/libs/datatype-filtering/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
// @ts-expect-error
import { Submit, DelayTextField } from '#src/components/forms';

import {
  DATATYPE_FILTERABLE_BY_ID_IN,
  GROUP_AND_OPERAND,
} from '#src/libs/datatype-filtering/constants';
import {
  generateNewGroup,
  generateNewFilterItem,
} from '#src/libs/datatype-filtering/utils';

import OperandSelect from '#src/libs/datatype-filtering/components/OperandSelect.component';
import DatatypeFilterConfigGroupRow from '#src/libs/datatype-filtering/components/DatatypeFilterConfigGroupRow.component';
import type { handleGetDynamicDataForFiltersType } from '#src/libs/datatype-filtering/dynamic-data-hoc';
import { getFilterableColumns } from '#src/libs/reporting/common/utils';
import type { OptionCallback } from '#src/state/types';
import NestedAlertError from './NestedAlertError.component';
import type {
  ReportFilterConfig,
  ReportMetadataColumn,
} from '#src/libs/reporting/common/types';
import { getCreditFactor } from '#src/libs/theme/selectors';
import {
  CREDIT_COLUMNS,
  REPORT_RIGHT_DRAWER_WIDTH,
} from '#src/libs/reporting/common/constants';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

type Values = {
  name: string;
  config: {
    group_operand: DatatypeFilterConfigGroupOperand;
    groups: DatatypeFilterConfigGroup[];
  };
};

export type OuterProps = {
  open: boolean;
  columns: ReportMetadataColumn[];
  // eslint-disable-next-line react/no-unused-prop-types
  initial?: ReportFilterConfig;
  isPreview?: boolean;
  onClose?: () => void;
  handleGetDynamicDataForReport: handleGetDynamicDataForFiltersType;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (props: {
    id: number;
    valuesHandledByDrawer: Omit<ReportFilterConfig, 'id'>;
    options: OptionCallback<ReportFilterConfig>;
  }) => void;
  isFranchisor: boolean;
  reportCategory: ReportCategoryEnum;
};

const ReportFilterConfigFormDrawerSchema = Yup.object().shape({
  name: Yup.string().required(),
  config: DatatypeFilterConfigSchemaWithRequiredGroups,
});

const ReportFilterConfigFormDrawer: React.FC<
  OuterProps & FormikProps<Values>
> = ({
  open,
  isSubmitting,
  isValid,
  values,
  columns,
  isPreview: isPreviewProps,
  setFieldValue,
  onClose,
  resetForm,
  handleGetDynamicDataForReport,
  isFranchisor,
  reportCategory,
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
    // @ts-expect-error
    () => getFilterableColumns(values.config.groups, columns, isFranchisor),
    [columns, values.config.groups, isFranchisor],
  );

  const reportColumns = useMemo(() => {
    return columns.filter((c) => c.is_filterable).map((c) => c.identifier);
  }, [columns]);

  const showDecimalCreditHelperText: boolean = useMemo(() => {
    // Get the list of identifiers of the filters currently selected by the user in the Filtered view
    const filterListIdentifiers = values.config.groups.reduce((acc, group) => {
      const identifiers = group.filters_data.map(
        (filter_data) => filter_data.identifier,
      );
      return acc.concat(identifiers);
    }, []);

    return (
      getCreditFactor() !== 1 &&
      CREDIT_COLUMNS.some((column: string) =>
        filterListIdentifiers.includes(column),
      )
    );
  }, [values.config.groups]);

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
    (uuid: string) => () => {
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
      withoutPadding
      onClose={onClose}
      open={open}
      title={t('filter.form.title')}
      width={REPORT_RIGHT_DRAWER_WIDTH}
    >
      <div className={classes.main}>
        <Form className={classes.form}>
          <div className={classes.container}>
            {!isPreview && (
              <>
                <div className={classes.innerContainer}>
                  <DelayTextField
                    fullWidth
                    required
                    label={t('filter.form.name')}
                    name="name"
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
                  isPreview={isPreview}
                  name="config.group_operand"
                />
              </div>
              <Typography className={classes.helper} color="textSecondary">
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
                  {showDecimalCreditHelperText && (
                    <FormHelperText className={classes.decimalCreditHelperText}>
                      {t('filter.form.decimalCredit.filterViewHelperText', {
                        creditFactor: String(getCreditFactor()),
                      })}
                    </FormHelperText>
                  )}
                  <div className={classes.verticalRows}>
                    {values.config.groups.map((filterGroup, indexGroup) => (
                      <DatatypeFilterConfigGroupRow
                        key={filterGroup.uuid}
                        addFilter={handleAddFilterInGroup(indexGroup)}
                        checkOtherRowExist={checkOtherRowExist}
                        consumableColumns={consumableColumns}
                        filterGroup={filterGroup}
                        getDataByType={handleGetDynamicDataForReport}
                        groupOperand={values.config.group_operand}
                        hidePrefix={indexGroup === 0}
                        isPreview={isPreview}
                        onDelete={handleDeleteFilter}
                        prefix={`config.groups[${indexGroup}]`}
                        reportCategory={reportCategory}
                        reportColumns={reportColumns}
                        setFieldValue={setFieldValue}
                      />
                    ))}
                  </div>
                  <NestedAlertError name="config.groups[0].filters_data">
                    {(error_msg: string) => (
                      <Typography color="error" variant="caption">
                        {t(`${error_msg}`)}
                      </Typography>
                    )}
                  </NestedAlertError>
                  <NestedAlertError name="config.groups">
                    {(error_msg: string) => (
                      <Typography color="error" variant="caption">
                        {t(`${error_msg}`)}
                      </Typography>
                    )}
                  </NestedAlertError>
                  {consumableColumns?.length > 0 && !isPreview && (
                    <ButtonBase
                      ref={buttonRef}
                      className={classes.buttonAdd}
                      color="primary"
                      onClick={handleOpenMenu}
                    >
                      <AddIcon color="primary" />
                      {t('filter.form.add')?.toUpperCase()}
                    </ButtonBase>
                  )}
                  <Menu
                    anchorEl={buttonRef.current}
                    className={classes.menu}
                    onClose={handleCloseMenu}
                    open={isMenuOpen}
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
              <Submit color="primary" disabled={isSubmitting || !isValid}>
                {isSubmitting ? <CircularProgress /> : t('filter.form.submit')}
              </Submit>
            </div>
          )}
          {isPreview && (
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                onClick={handleEditView}
                variant="contained"
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
    paddingTop: theme.spacing(2),
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
  decimalCreditHelperText: {
    marginBottom: theme.spacing(2),
  },
}));

export default compose<any, OuterProps>(
  withFormik<OuterProps, Values>({
    // @ts-expect-error
    mapPropsToValues: ({ initial, columns, isFranchisor }) => {
      if (initial) {
        return {
          name: initial.name,
          config: initial.config,
        };
      }

      const column = columns
        .filter((c) => c.is_filterable)
        // For franchisors, we only allow the 'company' datatype among DATATYPE_FILTERABLE_BY_ID_IN
        .filter(
          (c) =>
            !isFranchisor ||
            !DATATYPE_FILTERABLE_BY_ID_IN.includes(c.datatype) ||
            c.datatype === 'company',
        )?.[0];

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
        // @ts-expect-error
        valuesHandledByDrawer: {
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
