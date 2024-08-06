import React from 'react';
import classNames from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { withFormik, FormikProps, Form, ErrorMessage } from 'formik';
import type { withDatatypeDynamicDataProps } from '#src/libs/datatype-filtering/dynamic-data-hoc';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useCheckIsNameAlreadyUsed } from '#src/libs/reporting/v2/hooks';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';

import FilterListIcon from '@material-ui/icons/FilterList';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import AddIcon from '@material-ui/icons/Add';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';

import {
  GROUP_AND_OPERAND,
  GROUP_OR_OPERAND,
} from '#src/libs/datatype-filtering/constants';
import {
  REPORT_NAME_MAX_LENGTH,
  REPORT_RIGHT_DRAWER_WIDTH,
} from '#src/libs/reporting/common/constants';

import {
  generateNewGroup,
  generateNewFilterItem,
} from '#src/libs/datatype-filtering/utils';
import { getFilterableColumns } from '#src/libs/reporting/common/utils';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import OperandSelect from '#src/libs/datatype-filtering/components/OperandSelect.component';
import DatatypeFilterConfigGroupRow from '#src/libs/datatype-filtering/components/DatatypeFilterConfigGroupRow.component';
import SecondaryActionButton from '#src/components/button/SecondaryActionButton.component';

import type {
  ReportConfiguration,
  ReportFilterConfig,
  ReportFilterConfigConfig,
  ReportMetadataValue,
} from '#src/libs/reporting/common/types';
import type { DynamicFilterDataType } from '#src/libs/datatype-filtering/types';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

type Props = {
  categoryName: ReportCategoryEnum;
  // dynamicDataHasBeenLoaded unused: just to rerender component when data has been loaded
  // eslint-disable-next-line react/no-unused-prop-types
  dynamicDataHasBeenLoaded: Record<DynamicFilterDataType, boolean>;
  handleDrawerClosing: () => void;
  isDrawerOpen: boolean;
  isFranchisor?: boolean;
  report: ReportConfiguration;
  reportCategoryMetadata: ReportMetadataValue;
} & Pick<withDatatypeDynamicDataProps, 'handleGetDynamicDataForFilters'>;

type FormikHOCProps = {
  advancedReportFilterConfig: ReportFilterConfig;
  onSubmit: (data: {
    config: ReportFilterConfigConfig;
    report: { columns: string[]; name: string };
  }) => void;
};

type InitialValues = {
  name: string;
  config: ReportFilterConfigConfig;
  columnIdentifiers: string[];
};

const ReportDetailDrawer: React.FC<Props & FormikProps<InitialValues>> = ({
  categoryName,
  handleDrawerClosing,
  handleGetDynamicDataForFilters,
  handleSubmit,
  isDrawerOpen,
  isFranchisor,
  report,
  reportCategoryMetadata,
  setFieldValue,
  values,
  isValid,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleMenuState = React.useCallback(
    (bool: boolean) => () => {
      setIsMenuOpen(bool);
    },
    [],
  );

  const isSelectAllChecked = React.useMemo(
    () =>
      values.columnIdentifiers.length ===
      reportCategoryMetadata?.columns.length,
    [reportCategoryMetadata?.columns, values.columnIdentifiers],
  );

  const handleSelectAll = React.useCallback(
    () =>
      isSelectAllChecked
        ? setFieldValue('columnIdentifiers', [])
        : setFieldValue(
            'columnIdentifiers',
            reportCategoryMetadata?.columns?.map(
              (columnMetadata) => columnMetadata.identifier,
            ),
          ),
    [isSelectAllChecked, reportCategoryMetadata, setFieldValue],
  );

  const handleChange = React.useCallback(
    (columnIdentifier: string) => () =>
      setFieldValue(
        'columnIdentifiers',
        values.columnIdentifiers.includes(columnIdentifier)
          ? values.columnIdentifiers.filter(
              (identifier) => identifier !== columnIdentifier,
            )
          : [...values.columnIdentifiers, columnIdentifier],
      ),
    [values.columnIdentifiers, setFieldValue],
  );

  const checkOtherRowExist = React.useCallback(
    (uuid: string) =>
      values.config.groups.some((fg) =>
        fg.filters_data.some((filterData) => filterData.uuid !== uuid),
      ),
    [values.config.groups],
  );

  const filterableColumns = React.useMemo(
    () =>
      getFilterableColumns(
        values.config.groups,
        // @ts-expect-error TODO: harmonize ReportMetadataColumn,DataSourceFieldMetadata,DataSourceMetadata
        reportCategoryMetadata?.columns,
        isFranchisor,
      ),
    [values.config.groups, reportCategoryMetadata?.columns, isFranchisor],
  );

  const handleAddFilter = React.useCallback(() => {
    setIsMenuOpen(false);
    setFieldValue(`config.groups`, [
      ...values.config.groups,
      generateNewGroup(filterableColumns[0], true),
    ]);
  }, [filterableColumns, values.config.groups, setFieldValue]);

  const handleAddFilterGroup = React.useCallback(() => {
    setIsMenuOpen(false);
    setFieldValue(`config.groups`, [
      ...values.config.groups,
      generateNewGroup(filterableColumns[0]),
    ]);
  }, [filterableColumns, values.config.groups, setFieldValue]);

  const handleDeleteFilter = React.useCallback(
    (uuid: string) => () => {
      const groupsWithoutFilter = values.config.groups.map((group) => ({
        ...group,
        filters_data: group.filters_data.filter(
          (filterItem) => filterItem.uuid !== uuid,
        ),
      }));

      const groupsWithoutEmptys = groupsWithoutFilter.filter(
        (group) => group.filters_data?.length > 0,
      );

      setIsMenuOpen(false);
      setFieldValue(`config.groups`, [...groupsWithoutEmptys]);
    },
    [setFieldValue, values.config.groups],
  );

  const handleAddFilterInGroup = React.useCallback(
    (index: number) => () => {
      const newGroups = [...values.config.groups];
      newGroups[index] = {
        ...newGroups[index],
        filters_data: [
          ...newGroups[index].filters_data,
          generateNewFilterItem(filterableColumns[0]),
        ],
      };

      setFieldValue(`config.groups`, [...newGroups]);
    },
    [filterableColumns, setFieldValue, values.config.groups],
  );

  const handleMessageRendering = React.useCallback(
    (message: string) => (
      <Typography color="error" variant="body2">
        {t(message)}
      </Typography>
    ),
    [t],
  );

  // This warning is displayed when a filter is applied on a view where the column is not present.
  const displayFilterWarning = React.useMemo(
    () =>
      values.config.groups?.find((group) =>
        group.filters_data.find(
          (filterItem) =>
            !values.columnIdentifiers.includes(filterItem.identifier),
        ),
      ),
    [values.config.groups, values.columnIdentifiers],
  );

  const { isNameChecking, handleOnChange } = useCheckIsNameAlreadyUsed(
    'name',
    categoryName,
    report?.id,
  );

  return (
    <GenericResponsiveDrawer
      withoutPadding
      customClasses={{
        header: classes.drawerHeader,
        topCancel: classes.topCancel,
        cancelButton: classes.cancelButton,
      }}
      onClose={handleDrawerClosing}
      open={isDrawerOpen}
      title={t('reportEditLabel')}
      width={REPORT_RIGHT_DRAWER_WIDTH}
    >
      <Form className={classes.root} onSubmit={handleSubmit}>
        <div className={classes.root}>
          <div className={classNames(classes.section, classes.directionColumn)}>
            <TextField
              fullWidth
              required
              disabled={report?.is_category_default}
              label={t('reportNameLabel')}
              name="name"
              onChange={handleOnChange}
              placeholder={t('reportNameLabel')}
              value={values.name}
              variant="outlined"
            />
            <ErrorMessage name="name" render={handleMessageRendering} />
          </div>
          <Divider className={classes.sectionDivider} />
          <div
            className={classNames(
              classes.section,
              classes.advancedFilterSection,
            )}
          >
            <div>
              <div className={classes.sectionName}>
                <FilterListIcon color="action" />
                <Typography variant="h6">
                  {t('reportDetailDrawer.advancedFilterTitle')}
                </Typography>
              </div>
              <Typography color="textSecondary" variant="body2">
                {t('reportDetailDrawer.advancedFilterSubtitle')}
              </Typography>
            </div>
            <div className={classes.groupOperand}>
              <OperandSelect isPreview={false} name="config.group_operand" />
            </div>
            <div className={classes.filters}>
              {values.config.groups?.length > 0 ? (
                values.config.groups.map((filterGroup, indexGroup) => (
                  <DatatypeFilterConfigGroupRow
                    key={filterGroup.uuid}
                    noHideDelete
                    addFilter={handleAddFilterInGroup(indexGroup)}
                    checkOtherRowExist={checkOtherRowExist}
                    consumableColumns={filterableColumns}
                    displayPopperWarning={false}
                    filterGroup={filterGroup}
                    getDataByType={handleGetDynamicDataForFilters}
                    groupOperand={values.config.group_operand}
                    hidePrefix={indexGroup === 0}
                    isPreview={false}
                    onDelete={handleDeleteFilter}
                    prefix={`config.groups[${indexGroup}]`}
                    reportColumns={values.columnIdentifiers}
                    setFieldValue={setFieldValue}
                  />
                ))
              ) : (
                <Typography variant="body1">
                  {t('reportDetailDrawer.emptyAdvancedFilters')}
                </Typography>
              )}
            </div>

            {filterableColumns?.length > 0 && (
              <div>
                <Button
                  ref={addButtonRef}
                  color="primary"
                  onClick={handleMenuState(true)}
                >
                  <AddIcon color="primary" />
                  {t('filter.form.add')?.toUpperCase()}
                </Button>
                {displayFilterWarning && (
                  <Alert severity="warning">
                    {t('reportDetailDrawer.filterNotApplied')}
                  </Alert>
                )}
              </div>
            )}

            <Menu
              anchorEl={addButtonRef.current}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              onClose={handleMenuState(false)}
              open={isMenuOpen}
            >
              <MenuItem onClick={handleAddFilter}>
                <AddIcon />
                <Typography>{t('filter.form.addFilterOption')}</Typography>
              </MenuItem>
              <MenuItem onClick={handleAddFilterGroup}>
                <AddToPhotosIcon />
                <Typography>{t('filter.form.addGroupOption')}</Typography>
              </MenuItem>
            </Menu>
          </div>
          <Divider className={classes.sectionDivider} />
          <div className={classNames(classes.section, classes.directionColumn)}>
            <div>
              <div className={classes.sectionName}>
                <ViewColumnIcon color="action" />
                <Typography variant="h6">
                  {t('reportDetailDrawer.displayedColumnsTitle')}
                </Typography>
              </div>
              <Typography color="textSecondary" variant="body2">
                {t('reportDetailDrawer.displayedColumnsSubtitle')}
              </Typography>
            </div>
            <FormGroup className={classes.gappedContainer}>
              <FormControlLabel
                control={
                  <Checkbox checked={isSelectAllChecked} color="primary" />
                }
                label={
                  isSelectAllChecked
                    ? t(`columns.unSelectAll`)
                    : t(`columns.selectAll`)
                }
                onChange={handleSelectAll}
              />
              <Divider />
              <div className={classes.columnsContainer}>
                {(reportCategoryMetadata?.columns || []).map((column) => (
                  <FormControlLabel
                    key={column.identifier}
                    control={
                      <Checkbox
                        checked={values.columnIdentifiers.includes(
                          column.identifier,
                        )}
                        color="primary"
                      />
                    }
                    label={t(`columns.${column.identifier}`)}
                    onChange={handleChange(column.identifier)}
                  />
                ))}
                <ErrorMessage
                  name="columnIdentifiers"
                  render={handleMessageRendering}
                />
              </div>
            </FormGroup>
          </div>
        </div>
        <div className={classes.buttonSection}>
          <SecondaryActionButton onClick={handleDrawerClosing} variant="text">
            {t('form.cancel')}
          </SecondaryActionButton>
          <Button
            color="primary"
            disabled={!isValid || isNameChecking}
            type="submit"
            variant="contained"
          >
            {t('form.saveAndGenerate')}
          </Button>
        </div>
      </Form>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  drawerHeader: {
    padding: theme.spacing(3, 4),
    margin: 0,
    gap: theme.spacing(2),
  },
  cancelButton: { padding: 0 },
  topCancel: { margin: 0 },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  sectionDivider: { marginTop: theme.spacing(2) },
  section: {
    display: 'flex',
    padding: theme.spacing(2, 3),
  },
  advancedFilterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  directionColumn: {
    flexDirection: 'column',
  },
  sectionName: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  columnsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  gappedContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
  },
  buttonSection: {
    alignSelf: 'flex-end',
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: 'auto',
    padding: theme.spacing(3, 4),
  },

  groupOperand: { display: 'flex' },
  filters: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const ReportDetailDrawerSchema = Yup.object().shape({
  name: Yup.string()
    .required('reportCreateModal.error')
    .max(REPORT_NAME_MAX_LENGTH, 'reportCreateModal.maxLength'),
  config: Yup.object()
    .shape({
      group_operand: Yup.number()
        .oneOf([GROUP_AND_OPERAND, GROUP_OR_OPERAND])
        .nullable(),
      groups: Yup.object()
        .shape({
          inner_operand: Yup.number().oneOf([
            GROUP_AND_OPERAND,
            GROUP_OR_OPERAND,
          ]),
          filters_data: Yup.array(),
          uuid: Yup.string(),
          display_has_single: Yup.boolean(),
        })
        .nullable(),
    })
    .nullable(),
  columnIdentifiers: Yup.array()
    .of(Yup.string())
    .min(1, 'reportDetailDrawer.columnIdentifiersError'),
});

const ReportFormHOC = withFormik<Props & FormikHOCProps, InitialValues>({
  enableReinitialize: true,
  mapPropsToValues: ({
    report,
    advancedReportFilterConfig,
    reportCategoryMetadata,
  }) => {
    const defaultAdvancedReportFilterConfig: ReportFilterConfigConfig = {
      group_operand: GROUP_AND_OPERAND,
      groups: [],
    };
    if (report && advancedReportFilterConfig) {
      return {
        name: report.name,
        config:
          advancedReportFilterConfig.config.groups?.length > 0
            ? advancedReportFilterConfig.config
            : defaultAdvancedReportFilterConfig,
        columnIdentifiers: report.columns,
      };
    }

    if (report && !advancedReportFilterConfig) {
      return {
        name: report.name,
        config: defaultAdvancedReportFilterConfig,
        columnIdentifiers: report.columns,
      };
    }

    return {
      name: '',
      config: defaultAdvancedReportFilterConfig,
      columnIdentifiers:
        reportCategoryMetadata?.columns?.map(
          (columnMetadata) => columnMetadata.identifier,
        ) || [],
    };
  },
  validationSchema: ReportDetailDrawerSchema,
  handleSubmit: (values, { props: { onSubmit } }) => {
    const sanitizedData = {
      config: values.config.groups?.length > 0 ? values.config : {},
      report: { columns: values.columnIdentifiers, name: values.name },
    };
    onSubmit(sanitizedData);
  },
});

export default React.memo(ReportFormHOC(ReportDetailDrawer));
