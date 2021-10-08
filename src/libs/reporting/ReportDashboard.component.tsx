import React, { useState } from 'react';

import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { createStyles, Theme } from '@material-ui/core';

import {
  ReportCategoryEnum,
  ReportConfiguration,
  ReportMetadataValue,
} from './types';

import ModalConfirm from '../../components/ModalConfirm.component';
import ReportCategorySelector from './ReportCategorySelector.component';
import ReportList from './ReportList.component';
import ReportListItem from './ReportListItem.component';
import ReportConfigurationForm from './ReportConfigurationForm.component';
import { OptionCallback } from '../../state/types';
import FuzzySearch from '../../components/search/FuzzySearch.component';

type OwnProps = {
  metadata: ReportMetadataValue[];
  reportConfigurations: ReportConfiguration[];
  upsertReportConfiguration: (value: {
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

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<ReportCategoryEnum | null>(null);
  const [
    reportConfiguration,
    setReportConfigurationToEdit,
  ] = useState<ReportConfiguration | null>(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [
    selectedForDeletion,
    setSelectedForDeletion,
  ] = useState<ReportConfiguration | null>(null);

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
    },
    onDetail: onReportDetail,
    onDelete: (r: ReportConfiguration) => setSelectedForDeletion(r),
  };

  const categories = metadata.map((c) => c.category) ?? [];

  return (
    <div className={classes.root}>
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
            }}
            onDetail={() => onReportDetail(report.id)}
            onDelete={() => setSelectedForDeletion(report)}
          />
        )}
        className={classes.search}
      />
      <ReportCategorySelector
        categories={categories}
        onSelect={setSelectedCategory}
        selected={selectedCategory}
      />
      {reportConfigurations.length ? (
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
      ) : (
        <div className={classes.messageNoReports}>
          <Typography variant="body1">{t('list.empty')}</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setReportConfigurationToEdit(null);
              setShowModalAdd(true);
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
        }}
      >
        <AddIcon />
      </Fab>
      {showModalAdd ? (
        <Dialog open>
          <DialogTitle>
            {reportConfiguration?.name ?? t('form.title')}
          </DialogTitle>
          <DialogContent>
            <ReportConfigurationForm
              metadata={metadata}
              initial={reportConfiguration}
              onClose={() => setShowModalAdd(false)}
              onSubmit={(data: ReportConfiguration) => {
                upsertReportConfiguration({
                  data,
                  options: {
                    onSuccess: (response) => {
                      setShowModalAdd(false);
                      onReportDetail(data?.id || response?.id);
                    },
                  },
                });
              }}
            />
          </DialogContent>
        </Dialog>
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
