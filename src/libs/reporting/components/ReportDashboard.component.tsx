// @ts-nocheck
import React, { useState } from 'react';

import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { createStyles, Theme } from '@material-ui/core';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import { ReportConfiguration, ReportMetadataValue } from '../types';

import ModalConfirm from '#components/ModalConfirm.component';
import ReportCategorySelector from './ReportCategorySelector.component';
import ReportList from './ReportList.component';
import ReportListItem from './ReportListItem.component';
import ReportConfigurationForm from './ReportConfigurationForm.component';
import { OptionCallback } from '../../../state/types';
import FuzzySearch from '#components/search/FuzzySearch.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Report,
);
type OwnProps = {
  metadata: ReportMetadataValue[];
  reportConfigurations: ReportConfiguration[];
  upsertReportConfiguration: (value: {
    reportId: number;
    data: ReportConfiguration;
    options: OptionCallback;
  }) => void;
  onReportDetail: (r: number) => void;
  onDeleteReport: (value: { reportId: number }) => void;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export function ReportDashboard(props: Props) {
  const {
    metadata,
    reportConfigurations,
    classes,
    upsertReportConfiguration,
    onReportDetail,
    onDeleteReport,
    t,
  } = props;

  const [selectedCategory, setSelectedCategory] =
    useState<ReportCategoryEnum | null>(null);
  const [reportConfiguration, setReportConfigurationToEdit] =
    useState<ReportConfiguration | null>(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] =
    useState<ReportConfiguration | null>(null);

  const configurations = selectedCategory
    ? reportConfigurations.filter((c) => c.category === selectedCategory)
    : reportConfigurations;

  const onConfirmDeletion = () => {
    onDeleteReport({ reportId: selectedForDeletion.id });
    setSelectedForDeletion(null);
  };

  const onCancelDeletion = () => {
    setSelectedForDeletion(null);
  };

  const itemProps = {
    onEdit: (report: ReportConfiguration) => {
      setReportConfigurationToEdit(report);
      setShowModalAdd(true);
      trackFormAdd(report?.id, { category: report.category });
    },
    onDetail: onReportDetail,
    onDelete: (r: ReportConfiguration) => setSelectedForDeletion(r),
  };

  return (
    <div className={classes.root}>
      {reportConfigurations.length ? (
        <>
          <FuzzySearch
            items={reportConfigurations}
            placeholder={t('search')}
            searchFields={['name']}
            itemRenderer={(report) => (
              <ReportListItem
                key={report.id}
                report={report}
                onEdit={() => {
                  setReportConfigurationToEdit(report);
                  setShowModalAdd(true);
                  trackFormAdd(report?.id, { category: report.category });
                }}
                onDetail={() => onReportDetail(report.id)}
                onDelete={() => setSelectedForDeletion(report)}
              />
            )}
            className={classes.search}
          />
          <ReportCategorySelector
            categories={metadata?.map((c) => c.category) ?? []}
            onSelect={setSelectedCategory}
            selected={selectedCategory}
          />
          <div>
            <ReportList
              items={configurations}
              className={classes.list}
              itemProps={itemProps}
            />
            <ModalConfirm
              open={!!selectedForDeletion}
              close={onCancelDeletion}
              options={{
                title: 'report.delete',
                Content: () =>
                  t('report.delete_message', {
                    name: selectedForDeletion && selectedForDeletion.name,
                  }),
              }}
              handleConfirm={onConfirmDeletion}
              handleCancel={onCancelDeletion}
            />
          </div>
        </>
      ) : (
        <div className={classes.messageNoReports}>
          <Typography variant="body1">{t('list.empty')}</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setReportConfigurationToEdit(null);
              setShowModalAdd(true);
              trackFormAdd(reportConfiguration?.id);
            }}
            className={classes.buttonNew}
          >
            {t('list.button_new')}
          </Button>
        </div>
      )}
      <Fab
        color="primary"
        className={classes.fabAdd}
        onClick={() => {
          setReportConfigurationToEdit(null);
          setShowModalAdd(true);
          trackFormAdd(reportConfiguration?.id);
        }}
      >
        <AddIcon />
      </Fab>
      {showModalAdd ? (
        <GenericResponsiveDialog open maxWidth="sm">
          <DialogTitle>
            {reportConfiguration?.name ?? t('form.title')}
          </DialogTitle>
          <DialogContent>
            <ReportConfigurationForm
              metadata={metadata}
              initial={reportConfiguration || { category: selectedCategory }}
              onClose={() => {
                setShowModalAdd(false);
                trackFormCancel(reportConfiguration?.id);
              }}
              trackintent={() => {
                trackFormSubmitIntent(reportConfiguration?.id);
              }}
              onSubmit={(data: ReportConfiguration) => {
                upsertReportConfiguration({
                  reportId: reportConfiguration?.id,
                  data,
                  options: {
                    onSuccess: (response) => {
                      setShowModalAdd(false);
                      onReportDetail(reportConfiguration?.id || response?.id);
                      trackFormSuccess(
                        reportConfiguration?.id,
                        data?.category && { category: data?.category },
                      );
                    },
                  },
                });
              }}
            />
          </DialogContent>
        </GenericResponsiveDialog>
      ) : null}
    </div>
  );
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
    list: {
      marginTop: theme.spacing(2),
    },
    fabAdd: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    messageNoReports: {
      textAlign: 'center',
      paddingTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
    },
    buttonNew: {
      marginTop: theme.spacing(1),
    },
    search: {
      marginBottom: theme.spacing(2),
    },
  });

export default compose<any, OwnProps>(
  withTranslation(['reporting']),
  withStyles(styles),
)(ReportDashboard);
