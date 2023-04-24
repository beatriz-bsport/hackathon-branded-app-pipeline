// @ts-nocheck
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { pure } from 'recompose';
import uniq from 'lodash/uniq';

import {
  IconButton,
  ListItem,
  ListItemText,
  Button,
  ButtonBase,
  makeStyles,
  Theme,
} from '@material-ui/core';
import FilterIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import ModalConfirm from '#components/ModalConfirm.component';

import ReportFilterConfigFormDrawer from './ReportFilterConfigDrawer';

import { OptionCallback } from '../../../state/types';
import { ReportFilterConfig, ReportMetadataColumn } from '../types';
import { DynamicFilterDataType } from '#libs/datatype-filtering/types';
import HoverableWarning from '#components/HoverableWarning.component';
import ReportFilterChip from './ReportFilterConfigDrawer/ReportFilterChip.component';

export type Props = {
  reportFilterConfigs: ReportFilterConfig[];
  selectedFilter: number | null;
  error?: boolean;
  columnsMetadata: ReportMetadataColumn[];
  fetchReportFilterConfigsList: () => void;
  onCreateReportFilterConfigs: (
    values: Omit<ReportFilterConfig, 'id'>,
    options: OptionCallback<ReportFilterConfig>,
  ) => void;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Omit<ReportFilterConfig, 'id'>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  onDeleteReportFilterConfigs: (reportFilterConfigsId: number) => void;
  onSelect: (reportFilterConfigsId: number | null) => void;
  handleGetDynamicDataForReport: (type: DynamicFilterDataType) => any[];
  fetchReportFilterConfigList: () => void;
  isFranchisor: boolean;
};

const ReportFilterConfigSelector: React.FC<Props> = ({
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
}) => {
  const { t } = useTranslation(['reporting']);
  const classes = useStyles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFilterId, setEditFilterId] = useState<number>(null);
  const [deleteFilterId, setDeletefilterId] = useState<number>(null);

  const containerRef = useRef(null);

  const handleModalSubmit = useCallback(
    ({
      id,
      values,
      options,
    }: {
      id?: number;
      values: Omit<ReportFilterConfig, 'id'>;
      options: OptionCallback<ReportFilterConfig>;
    }) => {
      if (id) {
        editReportFilterConfig(id, values, {
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
          ...values,
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
      ...reportFilterConfigs.map((rf) => ({
        value: rf.id,
        label: rf.name,
        hasError: rf?.config?.groups
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

  const uniqsDataTypeForSelectedFilter = selectedFilter
    ? uniq(
        reportFilterConfigs
          .find((rfc) => rfc.id === selectedFilter)
          ?.config?.groups.flatMap((group) => group.filters_data)
          ?.map((row) => row.datatype) ?? [],
      )
    : [];

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
                value={
                  options.find((o) => o.value === selectedFilter) || options[0]
                }
                isMenuListPaddingDisabled
                placeholder={t('filter.emptyFilter')}
                itemRenderer={(itemProps) => {
                  return (
                    <ListItem
                      className={classes.list}
                      dense
                      button
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
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                setEditFilterId(itemProps.data.value);
                                setIsModalOpen(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                setDeletefilterId(itemProps.data.value);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </ListItem>
                  );
                }}
                chipsRenderer={({ data }) => (
                  <div className={classes.warningSelect}>
                    <div>{data.label}</div>
                    {data.hasError && (
                      <HoverableWarning
                        id="warning"
                        text={t('filter.form.columnError')}
                        containerPortal={containerRef?.current}
                      />
                    )}
                  </div>
                )}
                options={options}
                onChange={(option: { value: number; label: string }) =>
                  onSelect(option.value)
                }
                error={error}
              />
            </div>
          )}
          <Button
            color="primary"
            onClick={handleOpenModal}
            className={classes.button}
          >
            <FilterIcon className={classes.icon} />
            {t('filter.createFilter')?.toUpperCase()}
          </Button>
        </div>
        {selectedFilter && (
          <ButtonBase
            onClick={() => {
              setEditFilterId(selectedFilter);
              setIsModalOpen(true);
            }}
            className={classes.chipList}
          >
            {uniqsDataTypeForSelectedFilter.map((datatype) => (
              <ReportFilterChip datatype={datatype} key={datatype} />
            ))}
            {!!uniqsDataTypeForSelectedFilter.length && (
              <IconButton size="small" variant="contained">
                <AddIcon color="primary" />
              </IconButton>
            )}
          </ButtonBase>
        )}
      </div>

      {isModalOpen && (
        <ReportFilterConfigFormDrawer
          open
          columns={columnsMetadata}
          initial={reportFilterConfigs.find((r) => r.id === editFilterId)}
          onClose={handleCloseModal}
          handleGetDynamicDataForReport={handleGetDynamicDataForReport}
          onSubmit={handleModalSubmit}
          isFranchisor={isFranchisor}
        />
      )}
      {deleteFilterId && (
        <ModalConfirm
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
          handleConfirm={handleDelete}
          handleCancel={() => setDeletefilterId(null)}
        />
      )}
    </>
  );
};

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

export default pure(ReportFilterConfigSelector);
