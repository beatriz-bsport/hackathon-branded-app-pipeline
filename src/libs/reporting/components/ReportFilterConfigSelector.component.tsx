import React, { useState, useCallback, useMemo, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { compose } from 'recompose';

import {
  IconButton,
  ListItem,
  ListItemText,
  Button,
  makeStyles,
  Theme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { withFormik } from 'formik';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import ModalConfirm from '#components/ModalConfirm.component';
import ReportFilterConfigFormDrawer from './ReportFilterConfigDrawer';
import { OptionCallback } from '../../../state/types';
import { ReportFilterConfig } from '../types';
import {
  DataSourceFieldMetadata,
  DatatypeFilterConfigGroup,
  DatatypeFilterConfigItem,
  DynamicFilterDataType,
} from '#libs/datatype-filtering/types';
import HoverableWarning from '#components/HoverableWarning.component';
import QuickReportFilterConfigColumnsMenu from './QuickReportFilterConfigColumnsMenu.component';

export type Props = {
  reportFilterConfigs: ReportFilterConfig[];
  selectedFilter: number | null;
  error?: boolean;
  columnsMetadata: DataSourceFieldMetadata[];
  fetchReportFilterConfigsList: () => void;
  onCreateReportFilterConfigs: (
    valuesHandledByDrawer: Omit<ReportFilterConfig, 'id'>,
    options: OptionCallback<ReportFilterConfig>,
  ) => void;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Omit<ReportFilterConfig, 'id'> | Pick<ReportFilterConfig, 'config'>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  onDeleteReportFilterConfigs: (reportFilterConfigsId: number) => void;
  onSelect: (reportFilterConfigsId: number | null) => void;
  handleGetDynamicDataForReport: (type: DynamicFilterDataType) => any[];
  fetchReportFilterConfigList: () => void;
  isFranchisor: boolean;
  reportQuickFilter: ReportFilterConfig;
};

type Values = {
  values: Omit<ReportFilterConfig, 'id'>;
};

const ReportFilterConfigSelector: React.FC<Props & Values> = memo(
  ({
    reportFilterConfigs,
    selectedFilter,
    error = false,
    columnsMetadata,
    fetchReportFilterConfigList,
    onCreateReportFilterConfigs,
    editReportFilterConfig,
    onDeleteReportFilterConfigs,
    onSelect,
    handleGetDynamicDataForReport,
    isFranchisor,
    values,
  }) => {
    const { t } = useTranslation(['reporting']);
    const classes = useStyles();
    const [selectedColumn, setSelectedColumn] =
      useState<DatatypeFilterConfigItem>();
    const [isQuickFilterModalOpen, setIsQuickFilterModalOpen] = useState(false);
    const [
      isQuickFilterConfigColumnModalOpen,
      setIsQuickFilterConfigColumnModalOpen,
    ] = useState(false);
    const [
      isQuickFilterConfigRowModalOpen,
      setIsQuickFilterConfigRowModalOpen,
    ] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editFilterId, setEditFilterId] = useState<number>(null);
    const [deleteFilterId, setDeletefilterId] = useState<number>(null);
    const [anchorEl, setAnchorEl] = useState<
      (EventTarget & HTMLButtonElement) | HTMLDivElement
    >(null);
    const containerRef = useRef(null);

    const handleModalSubmit = useCallback(
      ({
        id,
        valuesHandledByDrawer,
        options,
      }: {
        id?: number;
        valuesHandledByDrawer: Omit<ReportFilterConfig, 'id'>;
        options: OptionCallback<ReportFilterConfig>;
      }) => {
        if (id) {
          editReportFilterConfig(id, valuesHandledByDrawer, {
            onSuccess: () => {
              setEditFilterId(null);
              setIsModalOpen(false);
              onSelect(id);
              fetchReportFilterConfigList();
              options.onSuccess();
            },
            onError: options.onError,
          });
          return;
        }

        onCreateReportFilterConfigs(
          {
            ...valuesHandledByDrawer,
          },
          {
            onSuccess: (data) => {
              setEditFilterId(null);
              setIsModalOpen(false);
              onSelect(data.id);
              fetchReportFilterConfigList();
              options.onSuccess();
            },
            onError: options.onError,
          },
        );
      },
      [
        fetchReportFilterConfigList,
        onCreateReportFilterConfigs,
        editReportFilterConfig,
        onSelect,
      ],
    );

    const handleDelete = useCallback(() => {
      onDeleteReportFilterConfigs(deleteFilterId);
      setIsModalOpen(false);
      setDeletefilterId(null);
      onSelect(null);
    }, [deleteFilterId, onDeleteReportFilterConfigs, onSelect]);

    const columnIdentifiers = useMemo(
      () => columnsMetadata.map((c) => c?.identifier),
      [columnsMetadata],
    );

    const options = useMemo(
      () => [
        {
          label: t('reporting:filter.emptyFilter'),
          value: -1,
          hasError: false,
        },
        ...reportFilterConfigs
          .filter(
            (reportFilter) => reportFilter.is_quick_report_filter === false,
          )
          .map((reportFilter) => ({
            value: reportFilter.id,
            label: reportFilter.name,
            hasError: reportFilter?.config?.groups
              .flatMap((g) => g.filters_data.map((fd) => fd?.identifier))
              .some((column) => !columnIdentifiers?.includes(column)),
          })),
      ],
      [columnIdentifiers, reportFilterConfigs, t],
    );

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditFilterId(null);
    };

    const handleQuickFilterModalOpen = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsQuickFilterModalOpen(true);
        setIsQuickFilterConfigColumnModalOpen(true);
        setAnchorEl(event.currentTarget);
      },
      [],
    );

    const handleQuickFilterModalClose = useCallback(() => {
      setIsQuickFilterModalOpen(false);
      setIsQuickFilterConfigColumnModalOpen(false);
      setAnchorEl(null);
    }, []);

    // TYPING A FINIR SUR LA PARTIE 2 LIEES AUX CHIPS
    const columnsDataSelectedQuickFilter = useMemo(() => {
      return values.config.groups
        ? values.config.groups.flatMap((group: DatatypeFilterConfigGroup) =>
            group.filters_data.map((row: DatatypeFilterConfigItem) => ({
              identifier: row.identifier,
              value: row.value,
              comparator: row.comparator,
              datatype: row.datatype,
            })),
          )
        : [];
    }, [values.config.groups]);

    return (
      <>
        <div ref={containerRef} style={{ width: '100%' }}>
          <div className={classes.rowHeader}>
            {!!options?.filter((f) => f.value !== -1)?.length && (
              <div style={{ width: '100%', maxWidth: 340 }}>
                <MaterialUISelector
                  // dirty trick to close selector on click for popup edit/create/delete
                  key={`${editFilterId}-${deleteFilterId}-${
                    isModalOpen ? 'y' : 'n'
                  }`}
                  isMenuListPaddingDisabled
                  chipsRenderer={({ data }) => (
                    <div className={classes.warningSelect}>
                      <div>{data.label}</div>
                      {data.hasError && (
                        <HoverableWarning
                          containerPortal={containerRef?.current}
                          id="warning"
                          text={t('filter.form.columnError')}
                        />
                      )}
                    </div>
                  )}
                  error={error}
                  itemRenderer={(itemProps) => {
                    return (
                      <ListItem
                        button
                        dense
                        className={classes.list}
                        selected={itemProps.isSelected}
                      >
                        <div className={classes.listInner}>
                          <div className={classes.listText}>
                            <ListItemText
                              primaryTypographyProps={{
                                noWrap: true,
                              }}
                            >
                              {itemProps.data.label}
                            </ListItemText>
                          </div>
                          {itemProps.data.value > 0 && (
                            <div className={classes.row}>
                              {itemProps.data.hasError && (
                                <ReportProblemOutlinedIcon
                                  className={classes.warningIcon}
                                />
                              )}
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setEditFilterId(itemProps.data.value);
                                  setIsModalOpen(true);
                                }}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setDeletefilterId(itemProps.data.value);
                                }}
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          )}
                        </div>
                      </ListItem>
                    );
                  }}
                  onChange={(option: { value: number; label: string }) =>
                    onSelect(option.value)
                  }
                  options={options}
                  placeholder={t('filter.emptyFilter')}
                  value={
                    options.find((o) => o.value === selectedFilter) ||
                    options[0]
                  }
                />
              </div>
            )}
            <div className={classes.row}>
              {isQuickFilterModalOpen && (
                <QuickReportFilterConfigColumnsMenu
                  anchorEl={anchorEl}
                  columns={columnsMetadata}
                  columnsDataSelectedQuickFilter={
                    columnsDataSelectedQuickFilter
                  }
                  getDataByType={handleGetDynamicDataForReport}
                  handleOpenModal={handleOpenModal}
                  handleQuickFilterModalClose={handleQuickFilterModalClose}
                  isFranchisor={isFranchisor}
                  isQuickFilterConfigColumnModalOpen={
                    isQuickFilterConfigColumnModalOpen
                  }
                  isQuickFilterConfigRowModalOpen={
                    isQuickFilterConfigRowModalOpen
                  }
                  isQuickFilterModalOpen={isQuickFilterModalOpen}
                  selectedColumn={selectedColumn}
                  setIsQuickFilterConfigColumnModalOpen={
                    setIsQuickFilterConfigColumnModalOpen
                  }
                  setIsQuickFilterConfigRowModalOpen={
                    setIsQuickFilterConfigRowModalOpen
                  }
                  setIsQuickFilterModalOpen={setIsQuickFilterModalOpen}
                  setSelectedColumn={setSelectedColumn}
                />
              )}
              <Button
                className={classes.button}
                color="primary"
                onClick={handleQuickFilterModalOpen}
              >
                <AddIcon className={classes.icon} />
                {t('filter.form.addFilter').toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <ReportFilterConfigFormDrawer
            open
            columns={columnsMetadata}
            handleGetDynamicDataForReport={handleGetDynamicDataForReport}
            initial={reportFilterConfigs.find((r) => r.id === editFilterId)}
            isFranchisor={isFranchisor}
            onClose={handleCloseModal}
            onSubmit={handleModalSubmit}
          />
        )}
        {deleteFilterId && (
          <ModalConfirm
            handleCancel={() => setDeletefilterId(null)}
            handleConfirm={handleDelete}
            open={!!deleteFilterId}
            options={{
              title: t('filter.deleteModal.title'),
              Content: () => (
                <div>
                  <div>{t('filter.deleteModal.content')}</div>
                </div>
              ),
              isDeletion: true,
            }}
          />
        )}
      </>
    );
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    marginBottom: theme.spacing(2),
  },
  buttonSelect: {
    color: theme.palette.primary.main,
    backgroundColor: chroma(theme.palette.primary.main).brighten(1.5).hex(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  buttonSelectWrapper: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  button: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  list: {
    padding: 0,
  },
  listText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowHeader: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  listInner: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  warningSelect: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
  warningIcon: {
    fill: theme.palette.warning.main,
  },
  chipList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    borderRadius: 16,
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#efefef',
    },
  },
}));

export default compose<any, Props>(
  withFormik<Partial<Props>, ReportFilterConfig | {}>({
    enableReinitialize: true,
    mapPropsToValues: ({ reportQuickFilter }) => {
      /* The reportQuickFilter will always be given but when the component renders, reportQuickFilter is undefined
      so i have to give a initialValue */
      return reportQuickFilter || { config: {} };
    },
    // there is no submit here because the quickFilter gets updated everytime we step out of the popover
    handleSubmit: () => {},
  }),
)(ReportFilterConfigSelector);
