import React, { useMemo, useCallback, useState, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import classNames from 'classnames';
import { compose } from 'recompose';
import { withFormik, Form, FormikProps } from 'formik';

import { Divider, makeStyles, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfoIcon from '@material-ui/icons/Info';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import FilterListIcon from '@material-ui/icons/FilterList';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/Add';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  DatatypeFilterConfigSchemaWithOptionalGroups,
  DatatypeFilterConfigSchemaWithRequiredGroups,
} from '#libs/datatype-filtering/validation_schema';
import OperandSelect from '#libs/datatype-filtering/components/OperandSelect.component';
import DatatypeFilterConfigGroupRow from '#libs/datatype-filtering/components/DatatypeFilterConfigGroupRow.component';
import NestedAlertError from '#libs/datatype-filtering/components/NestedAlertError.component';

import {
  MEMBER_GRAPH_IDENTIFIER,
  BOOKING_GRAPH_IDENTIFIER,
  PRIVATE_BOOKING_GRAPH_IDENTIFIER,
  CHART_COMPONENTS_CHOICES_PER_GRAPH_FAMILY,
} from '#libs/dashboard/constants';
import {
  generateNewGroup,
  generateNewGroupForDateRange,
  checkColumnAlreadyExist,
  generateNewFilterItem,
} from '#libs/datatype-filtering/utils';
import {
  getHelperTextForDrawerSelector,
  generateFilterConfigBookingStatusOk,
} from '#libs/dashboard/utils';

import {
  DataSourceDashboardGraphMetadata,
  DataSourceDashboardGraph,
} from '#libs/dashboard/types';

import { DynamicFilterDataType } from '#libs/datatype-filtering/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
// @ts-expect-error
import { Submit, DelayTextField, CheckboxField } from '#components/forms';
import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import DatatypeFilterConfigValueManager from '#libs/datatype-filtering/components/DatatypeFilterConfigValueManager.component';
import {
  DATATYPE_FILTERABLE_BY_ID_IN,
  GROUP_AND_OPERAND,
} from '#libs/datatype-filtering/constants';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import GraphParamTemporalForm from './GraphParamTemporalForm.component';
import GraphParamQualitativeForm from './GraphParamQualitativeForm.component';
import GraphParamTimeslotsForm from './GraphParamTimeslotsForm.component';

import { ChartComponentFieldInput } from './ChartComponentField.input';
import { OptionCallback } from '../../../state/types';

const { trackFormAdd, trackFormSuccess, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Dashboard,
  );

type Values = DataSourceDashboardGraph;

export type OuterProps = {
  open: boolean;
  graphMetadata: Array<DataSourceDashboardGraphMetadata>;
  initial?: DataSourceDashboardGraph;
  isPreview?: boolean;
  onClose?: () => void;
  handleGetDynamicDataForFilters: (datatype: DynamicFilterDataType) => any[];
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: (data: DataSourceDashboardGraph, options?: OptionCallback) => void;
  t: TFunction;
};

// @ts-expect-error
const onTrack = (initial, values, track) => {
  /**
   * track an event
   * @param intial initial object (null if create a new graph)
   * @param values values in the form to create a dashboard
   * @param track tracking
   */
  if (initial || track.name !== 'trackFormAdd') {
    // edit a dashboard or create one if tracking is not trackFormAdd

    // send all data generated when creating/updating the graph
    const dashboard_spec = { ...values };
    delete dashboard_spec.uuid;
    track(values.uuid, dashboard_spec);
  } else {
    track(values.uuid);
  }
};

const DashboardGraphFormDrawer: React.FC<OuterProps & FormikProps<Values>> = ({
  open,
  graphMetadata,
  isPreview,
  onClose,
  handleGetDynamicDataForFilters,
  values,
  setFieldValue,
  isSubmitting,
  isValid,
  initial,
  t,
}) => {
  // strack when graph creation/edition
  React.useEffect(() => {
    onTrack(initial, values, trackFormAdd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const classes = useStyles();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);

  // Function to call when 'graph_family' is updated
  // -> updates values for fields 'chart_component' and 'graph_params'
  const setNewGraphParamValues = useCallback(
    (
      newGraphFamilyValue: 'temporal' | 'qualitative' | 'week_timeslots',
      currentGraphMetadata: DataSourceDashboardGraphMetadata,
    ) => {
      setFieldValue(
        'chart_component',
        CHART_COMPONENTS_CHOICES_PER_GRAPH_FAMILY[newGraphFamilyValue][0],
      );
      const newGraphParams = {};
      for (const [key, value] of Object.entries(
        currentGraphMetadata.choices.graph_families[newGraphFamilyValue],
      )) {
        // @ts-expect-error
        newGraphParams[key] = value[0];
      }
      // @ts-expect-error
      newGraphParams.aggregation_function_name = 'sum';
      setFieldValue('graph_params', newGraphParams);
    },
    [setFieldValue],
  );

  // Get specific metadata of selected dashboard_graph_identifier
  const selectedGraphMetadata = useMemo(
    () =>
      graphMetadata.find(
        (m) =>
          m.dashboard_graph_identifier === values.dashboard_graph_identifier,
      ),
    [graphMetadata, values.dashboard_graph_identifier],
  );

  //
  // Handle dashboard_graph_identifier change
  // -> must update 'graph_family', 'date_filter_config', 'filter_config' and 'accumulate_data'
  //
  const handleDashboardGraphIdentifierChange = useCallback(
    ({ value }) => {
      setFieldValue('dashboard_graph_identifier', value);
      const newSelectedGraphMetadata = graphMetadata.find(
        (gm) => gm.dashboard_graph_identifier === value,
      );
      const newGraphFamily = Object.keys(
        newSelectedGraphMetadata.choices.graph_families,
      )[0];
      setFieldValue('graph_family', newGraphFamily);
      // @ts-expect-error
      setNewGraphParamValues(newGraphFamily, newSelectedGraphMetadata);

      const newDateIdentifierForFilter =
        newSelectedGraphMetadata.choices.filterable_date[0];
      setFieldValue('date_filter_config', {
        group_operand: GROUP_AND_OPERAND,
        groups: [
          generateNewGroupForDateRange(
            newSelectedGraphMetadata.metadata.find(
              (m) => m.identifier === newDateIdentifierForFilter,
            ),
            'year',
          ),
        ],
      });

      if (
        [BOOKING_GRAPH_IDENTIFIER, PRIVATE_BOOKING_GRAPH_IDENTIFIER].includes(
          value,
        )
      ) {
        setFieldValue('filter_config', generateFilterConfigBookingStatusOk());
      } else {
        setFieldValue('filter_config', {
          group_operand: GROUP_AND_OPERAND,
          groups: [],
        });
      }
    },
    [setFieldValue, graphMetadata, setNewGraphParamValues],
  );

  // Event handler passed to graph_family radio group input
  const handleGraphFamilyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setFieldValue('graph_family', value);
      // @ts-expect-error
      setNewGraphParamValues(value, selectedGraphMetadata);
    },
    [setFieldValue, setNewGraphParamValues, selectedGraphMetadata],
  );

  //
  // Filterable metadata management
  //
  const selectedGraphConsumableMetadata = useMemo(
    () =>
      selectedGraphMetadata.metadata.filter((m) => {
        if (!m.is_filterable) return false;
        // by Id filter sould be uniq across the filter as a product decision
        if (
          DATATYPE_FILTERABLE_BY_ID_IN.includes(m.datatype) &&
          checkColumnAlreadyExist(m.datatype, values.filter_config.groups)
        )
          return false;
        return true;
      }),
    [selectedGraphMetadata, values.filter_config.groups],
  );

  const filterableMetadata = useMemo(() => {
    return selectedGraphMetadata.metadata
      .filter((m) => m.is_filterable)
      .map((m) => m.identifier);
  }, [selectedGraphMetadata]);

  const checkOtherRowExist = useCallback(
    (uuid) =>
      values.filter_config.groups.some((fg) =>
        fg.filters_data.some((fd) => fd.uuid !== uuid),
      ),
    [values.filter_config.groups],
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
    setFieldValue(`filter_config.groups`, [
      ...values.filter_config.groups,
      generateNewGroup(selectedGraphConsumableMetadata[0], true),
    ]);
  };

  const handleAddFilterGroup = () => {
    setIsMenuOpen(false);
    setFieldValue(`filter_config.groups`, [
      ...values.filter_config.groups,
      generateNewGroup(selectedGraphConsumableMetadata[0]),
    ]);
  };

  const handleDeleteFilter = useCallback(
    (uuid: number) => () => {
      const groupsWithoutFilter = values.filter_config.groups.map((g) => ({
        ...g,
        // @ts-expect-error
        filters_data: g.filters_data.filter((d) => d.uuid !== uuid),
      }));

      const groupsWithoutEmptys = groupsWithoutFilter.filter(
        (g) => g.filters_data.length > 0,
      );

      setIsMenuOpen(false);
      setFieldValue(`filter_config.groups`, [...groupsWithoutEmptys]);
    },
    [setFieldValue, values.filter_config.groups],
  );

  const handleAddFilterInGroup = useCallback(
    (index: number) => () => {
      const newGroups = [...values.filter_config.groups];
      newGroups[index] = {
        ...newGroups[index],
        filters_data: [
          ...newGroups[index].filters_data,
          generateNewFilterItem(selectedGraphConsumableMetadata[0]),
        ],
      };

      setFieldValue(`filter_config.groups`, [...newGroups]);
    },
    [
      selectedGraphConsumableMetadata,
      setFieldValue,
      values.filter_config.groups,
    ],
  );

  // Available options for dashboard_graph_identifier selector
  const dashboardGraphIdentifierOptions = useMemo(
    () => [
      ...graphMetadata.map((gm) => ({
        value: gm.dashboard_graph_identifier,
        label: t(
          `graphFormDrawer.dashboardGraphIdentifier.${gm.dashboard_graph_identifier}`,
        ),
      })),
    ],
    [graphMetadata, t],
  );

  // Available options for graph_family selector
  const dashboardGraphFamilyOptions = useMemo(
    () => [
      ...Object.keys(selectedGraphMetadata.choices.graph_families).map(
        (gf) => ({
          value: gf,
          label: t(`graphFormDrawer.graphFamily.${gf}`),
        }),
      ),
    ],
    [selectedGraphMetadata, t],
  );

  // Available options for chart_component radio buttons
  const chartComponentOptions = useMemo(
    () => CHART_COMPONENTS_CHOICES_PER_GRAPH_FAMILY[values.graph_family],
    [values.graph_family],
  );

  // Available options for filterable_date (used in date_filter_config and eventually graph_paramm
  // when graph_family === 'temporal')
  const filterableDateOptions = useMemo(
    () => [
      ...selectedGraphMetadata.choices.filterable_date.map(
        (fieldIdentifier) => ({
          value: fieldIdentifier,
          label: t(`dataSourceIdentifiers.${fieldIdentifier}`),
        }),
      ),
    ],
    [selectedGraphMetadata, t],
  );

  // Get translated helper text if field / value requires it, else null
  const filterableDateHelperText = useMemo(
    () =>
      getHelperTextForDrawerSelector(
        values.dashboard_graph_identifier,
        values.date_filter_config.groups[0].filters_data[0].identifier,
        'filterable_date',
        null,
        t,
      ),
    [t, values.dashboard_graph_identifier, values.date_filter_config],
  );

  // Get translated helper text if field / value requires it, else null
  const graphParamHelperText = useMemo(
    () =>
      getHelperTextForDrawerSelector(
        values.dashboard_graph_identifier,
        values.graph_params.date_value,
        'date_value',
        values.graph_params.aggregation_function_name,
        t,
      ),
    [t, values.dashboard_graph_identifier, values.graph_params],
  );

  return (
    <GenericResponsiveDrawer
      withoutPadding
      onClose={() => {
        onTrack(initial, values, trackFormCancel);
        onClose();
      }}
      open={open}
      title={t(`graphFormDrawer.title.${initial ? 'edit' : 'create'}`)}
      width="1000px"
    >
      <div className={classes.main}>
        <Form className={classes.form}>
          <div className={classes.container}>
            <div className={classes.innerContainer}>
              <div className={classNames(classes.row, classes.formTitle)}>
                <InfoIcon className={classes.sectionIcon} />
                <Typography variant="h6">
                  {t('graphFormDrawer.sectionTitles.general')}
                </Typography>
              </div>
              <DelayTextField
                fullWidth
                required
                label={t('graphFormDrawer.labels.title')}
                name="title"
              />
            </div>
            <Divider className={classes.divider} />

            <div className={classes.innerContainer}>
              <div className={classNames(classes.row, classes.formTitle)}>
                <DataUsageIcon className={classes.sectionIcon} />
                <Typography variant="h6">
                  {t('graphFormDrawer.sectionTitles.dashboardGraphIdentifier')}
                </Typography>
              </div>
              <div className={classes.row}>
                <div>
                  <MaterialUiSingleSelectorField
                    inScrollBar
                    className={classes.selectInput}
                    name="dashboard_graph_identifier"
                    onChange={handleDashboardGraphIdentifierChange}
                    // @ts-expect-error
                    options={dashboardGraphIdentifierOptions}
                    placeholder={t(
                      'graphFormDrawer.placeholders.dashboardGraphIdentifier',
                    )}
                  />
                </div>
              </div>
            </div>
            <Divider className={classes.divider} />

            <div className={classes.innerContainer}>
              <div className={classNames(classes.row, classes.formTitle)}>
                <ShowChartIcon className={classes.sectionIcon} />
                <Typography variant="h6">
                  {t('graphFormDrawer.sectionTitles.graphFamily')}
                </Typography>
              </div>
              <div className={classes.row}>
                <div>
                  <RadioGroup
                    name="graph_family"
                    onChange={handleGraphFamilyChange}
                  >
                    {dashboardGraphFamilyOptions.map(({ value, label }) => (
                      <div key={value}>
                        <FormControlLabel
                          key={value}
                          control={
                            <Radio checked={values.graph_family === value} />
                          }
                          label={label}
                          value={value}
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <div className={classes.chartComponentContainer}>
                <ChartComponentFieldInput
                  name="chart_component"
                  // @ts-expect-error
                  options={chartComponentOptions}
                />
              </div>
              {values.dashboard_graph_identifier ===
                MEMBER_GRAPH_IDENTIFIER && (
                <>
                  <CheckboxField
                    label={t('graphFormDrawer.accumulate.total')}
                    name="graph_params.accumulate_total_data"
                  />
                  <Typography className={classes.helperText} variant="body2">
                    {t('graphFormDrawer.helperText.accumulateMembers')}
                  </Typography>
                </>
              )}
            </div>
            <Divider className={classes.divider} />

            <div className={classes.innerContainer}>
              <div className={classNames(classes.row, classes.formTitle)}>
                <MonetizationOnIcon className={classes.sectionIcon} />
                <Typography variant="h6">
                  {t('graphFormDrawer.sectionTitles.graphParams')}
                </Typography>
              </div>

              {values.graph_family === 'temporal' && (
                <GraphParamTemporalForm
                  currentGraphMetadata={selectedGraphMetadata}
                  date_value={values.graph_params.date_value}
                  helperText={graphParamHelperText}
                  setFieldValue={setFieldValue}
                />
              )}

              {values.graph_family === 'qualitative' && (
                <GraphParamQualitativeForm
                  currentGraphMetadata={selectedGraphMetadata}
                  helperText={graphParamHelperText}
                />
              )}

              {values.graph_family === 'week_timeslots' && (
                <GraphParamTimeslotsForm
                  currentGraphMetadata={selectedGraphMetadata}
                  // @ts-expect-error
                  helperText={graphParamHelperText}
                  setFieldValue={setFieldValue}
                />
              )}
            </div>
            <Divider className={classes.divider} />

            <div className={classes.innerContainer}>
              <div className={classNames(classes.row, classes.formTitle)}>
                <CalendarTodayIcon className={classes.sectionIcon} />
                <Typography variant="h6">
                  {t('graphFormDrawer.sectionTitles.timePeriod')}
                </Typography>
              </div>
              <div className={classes.row}>
                <div>
                  <DatatypeFilterConfigValueManager
                    inScrollBar
                    comparator={4}
                    filterItem={
                      values.date_filter_config.groups[0].filters_data[0]
                    }
                    getDataByType={() => []}
                    prefix="date_filter_config.groups[0].filters_data[0]"
                  />
                </div>
              </div>
              <Typography
                className={classNames(
                  classes.selectLabel,
                  classes.selectLabelMargin,
                )}
                variant="body1"
              >
                {t('graphFormDrawer.labels.dateFilterField')}
              </Typography>
              <div className={classes.row}>
                <div>
                  <MaterialUiSingleSelectorField
                    inScrollBar
                    className={classes.selectInput}
                    isDisabled={
                      filterableDateOptions.length === 1 ||
                      values.graph_family === 'week_timeslots'
                    }
                    name="date_filter_config.groups[0].filters_data[0].identifier"
                    // @ts-expect-error
                    options={filterableDateOptions}
                    placeholder={t(
                      'graphFormDrawer.placeholders.dashboardGraphIdentifier',
                    )}
                  />
                </div>
              </div>
              {filterableDateHelperText && (
                <Typography className={classes.helperText} variant="body2">
                  {filterableDateHelperText}
                </Typography>
              )}
            </div>
            <Divider className={classes.divider} />

            <div className={classes.innerContainer}>
              <div className={classNames(classes.row, classes.formTitle)}>
                <FilterListIcon className={classes.sectionIcon} />
                <Typography variant="h6">
                  {t('graphFormDrawer.sectionTitles.filterConfig')}
                </Typography>
              </div>
              <div className={classes.groupOperand}>
                <OperandSelect
                  isPreview={isPreview}
                  name="filter_config.group_operand"
                />
              </div>
              <Typography className={classes.helper} color="textSecondary">
                {t(
                  `reporting:filter.form.groupOperandHelperText.${values.filter_config.group_operand}`,
                )}
              </Typography>
              {filterableMetadata?.length === 0 && (
                <Typography color="error">
                  {t('reporting:filter.form.emptyState')}
                </Typography>
              )}
              {filterableMetadata?.length > 0 && (
                <>
                  <div className={classes.verticalRows}>
                    {values.filter_config.groups.map(
                      (filterGroup, indexGroup) => (
                        <DatatypeFilterConfigGroupRow
                          key={filterGroup.uuid}
                          dashboardTranslationNamespace
                          noHideDelete
                          addFilter={handleAddFilterInGroup(indexGroup)}
                          checkOtherRowExist={checkOtherRowExist}
                          consumableColumns={selectedGraphConsumableMetadata}
                          filterGroup={filterGroup}
                          getDataByType={handleGetDynamicDataForFilters}
                          groupOperand={values.filter_config.group_operand}
                          hidePrefix={indexGroup === 0}
                          isPreview={isPreview}
                          onDelete={handleDeleteFilter}
                          prefix={`filter_config.groups[${indexGroup}]`}
                          reportColumns={filterableMetadata}
                          setFieldValue={setFieldValue}
                        />
                      ),
                    )}
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
                  {selectedGraphConsumableMetadata?.length > 0 &&
                    !isPreview && (
                      <ButtonBase
                        ref={buttonRef}
                        className={classes.buttonAdd}
                        color="primary"
                        onClick={handleOpenMenu}
                      >
                        <AddIcon color="primary" />
                        <Typography className={classes.bold}>
                          {t('reporting:filter.form.add')?.toUpperCase()}
                        </Typography>
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
                        {t('reporting:filter.form.addFilterOption')}
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className={classes.menuItem}
                      onClick={handleAddFilterGroup}
                    >
                      <AddToPhotosIcon />
                      <Typography>
                        {t('reporting:filter.form.addGroupOption')}
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </div>

          <div className={classes.buttonContainer}>
            <Button
              onClick={() => {
                onTrack(initial, values, trackFormCancel);
                onClose();
              }}
            >
              {t('common:cancel')}
            </Button>
            <Submit color="primary" disabled={isSubmitting || !isValid}>
              {isSubmitting ? (
                <CircularProgress />
              ) : (
                t('common:colorPicker.validate')
              )}
            </Submit>
          </div>
        </Form>
      </div>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(6),
  },
  chartComponentContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
  selectInput: {
    minWidth: 290,
  },
  selectInputWithMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  selectInputWithDoubleMargin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  selectLabel: {
    color: theme.palette.grey[600],
    marginBottom: theme.spacing(1),
  },
  selectLabelMargin: {
    marginTop: theme.spacing(2),
  },
  helperText: {
    color: theme.palette.grey[600],
  },
  sectionIcon: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  bold: {
    fontWeight: 500,
  },
}));

const DashboardGraphFormSchema = Yup.object().shape({
  uuid: Yup.string().required(),
  title: Yup.string().required(),
  dashboard_graph_identifier: Yup.string().required(),
  filter_config: DatatypeFilterConfigSchemaWithOptionalGroups,
  date_filter_config: DatatypeFilterConfigSchemaWithRequiredGroups,
  graph_family: Yup.string().required(),
  graph_params: Yup.object().shape({
    date: Yup.string().when('graph_family', {
      is: 'temporal',
      then: Yup.string().required(),
    }),
    date_value: Yup.string().when('graph_family', {
      is: 'temporal',
      then: Yup.string().required(),
    }),
    aggregation_function_name: Yup.string()
      .when('graph_family', {
        is: 'temporal',
        then: Yup.string().required(),
      })
      .when('graph_family', {
        is: 'qualitative',
        then: Yup.string().required(),
      }),
    group_by: Yup.string().when('graph_family', {
      is: 'qualitative',
      then: Yup.string().required(),
    }),
    group_by_value: Yup.string().when('graph_family', {
      is: 'qualitative',
      then: Yup.string().required(),
    }),
    date_for_slots: Yup.string().when('graph_family', {
      is: 'week_timeslots',
      then: Yup.string().required(),
    }),
    ref_for_frequency: Yup.string().when('graph_family', {
      is: 'week_timeslots',
      then: Yup.string().required(),
    }),
    accumulate_total_data: Yup.boolean(),
  }),
  chart_component: Yup.string().required(),
});

export default compose(
  withTranslation('dashboard'),
  withFormik({
    mapPropsToValues: ({ initial, graphMetadata, t }: OuterProps) => {
      if (initial) {
        const processedInitial = { ...initial };
        if (!initial.filter_config.groups) {
          processedInitial.filter_config = {
            group_operand: GROUP_AND_OPERAND,
            groups: [],
          };
        }
        if (initial.title.length === 0) {
          processedInitial.title = t(initial.defaultTitle);
        }
        return processedInitial;
      }

      // Preset values with metadata
      const defaultSelectedGraph = graphMetadata[0];
      const defaultDateForFilter =
        defaultSelectedGraph.choices.filterable_date[0];

      const date_filter_config = {
        group_operand: GROUP_AND_OPERAND,
        groups: [
          generateNewGroupForDateRange(
            defaultSelectedGraph.metadata.find(
              (m) => m.identifier === defaultDateForFilter,
            ),
            'year',
          ),
        ],
      };

      const defaultFilterConfig = [
        BOOKING_GRAPH_IDENTIFIER,
        PRIVATE_BOOKING_GRAPH_IDENTIFIER,
      ].includes(defaultSelectedGraph.dashboard_graph_identifier)
        ? generateFilterConfigBookingStatusOk()
        : {
            group_operand: GROUP_AND_OPERAND,
            // @ts-expect-error
            groups: [],
          };

      const defaultGraphFamily = Object.keys(
        defaultSelectedGraph.choices.graph_families,
      )[0];

      const defaultGraphParams = {
        accumulate_total_data: false,
      };
      for (const [key, value] of Object.entries(
        // @ts-expect-error
        defaultSelectedGraph.choices.graph_families[defaultGraphFamily],
      )) {
        // @ts-expect-error
        defaultGraphParams[key] = value[0];
      }

      const defaultChartComponent =
        // @ts-expect-error
        CHART_COMPONENTS_CHOICES_PER_GRAPH_FAMILY[defaultGraphFamily][0];

      return {
        uuid: uuidv4(),
        title: '',
        dashboard_graph_identifier:
          defaultSelectedGraph.dashboard_graph_identifier,
        graph_family: defaultGraphFamily,
        date_filter_config,
        filter_config: defaultFilterConfig,
        graph_params: defaultGraphParams,
        chart_component: defaultChartComponent,
        accumulate_partial_data: false,
      };
    },
    validationSchema: DashboardGraphFormSchema,
    handleSubmit: (
      values,
      { props: { onSubmit, graphMetadata, initial }, setSubmitting },
    ) => {
      const selectedGraphMetadata = graphMetadata.find(
        (gm) =>
          gm.dashboard_graph_identifier === values.dashboard_graph_identifier,
      );

      const data = {
        uuid: values.uuid,
        title: values.title,
        dashboard_graph_identifier: values.dashboard_graph_identifier,
        graph_family: values.graph_family,
        chart_component: values.chart_component,
        date_filter_config: values.date_filter_config,
      };

      const filter_config =
        values.filter_config.groups.length > 0 ? values.filter_config : {};
      // @ts-expect-error
      data.filter_config = filter_config;

      const graph_params: any = {};

      // Case temporal
      if (values.graph_family === 'temporal') {
        graph_params.date =
          values.date_filter_config.groups[0].filters_data[0].identifier;
        // @ts-expect-error
        graph_params.date_value = values.graph_params.date_value;
        graph_params.accumulate_total_data =
          values.graph_params.accumulate_total_data;

        const matchingDateValueMetadata = selectedGraphMetadata.metadata.find(
          (m) => m.identifier === graph_params.date_value,
        );

        // If metadata is not summable and not averageable, set aggregation function to count
        // else, pick the selected value in aggregationSelector
        const aggregation_function_name =
          !matchingDateValueMetadata.summable &&
          !matchingDateValueMetadata.averageable
            ? 'count'
            : // @ts-expect-error
              values.graph_params.aggregation_function_name;
        graph_params.aggregation_function_name = aggregation_function_name;
      }

      // Case qualitative
      if (values.graph_family === 'qualitative') {
        // @ts-expect-error
        const { group_by, group_by_value } = values.graph_params;

        const aggregation_function_name = selectedGraphMetadata.metadata.find(
          (m) => m.identifier === group_by_value,
        )?.summable
          ? 'sum'
          : 'count';

        graph_params.group_by = group_by;
        graph_params.group_by_value = group_by_value;
        graph_params.aggregation_function_name = aggregation_function_name;
      }

      if (values.graph_family === 'week_timeslots') {
        // @ts-expect-error
        const { date_for_slots, ref_for_frequency } = values.graph_params;

        graph_params.date_for_slots = date_for_slots;
        graph_params.ref_for_frequency = ref_for_frequency;
      }
      // @ts-expect-error
      data.graph_params = graph_params;

      // @ts-expect-error
      onSubmit(data, {
        onSuccess: () => {
          onTrack(initial, values, trackFormSuccess);
          setSubmitting(false);
        },
        onError: () => setSubmitting(false),
      });
    },
  }),
)(DashboardGraphFormDrawer);
