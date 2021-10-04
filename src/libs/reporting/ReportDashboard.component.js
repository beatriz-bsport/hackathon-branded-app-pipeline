// @flow

import React from 'react';

import { compose, withState, withProps } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import type {
  ReportConfiguration,
  ReportCategoryEnum,
  ReportMetadata,
} from './types';

import ModalConfirm from '../../components/ModalConfirm.component';
import { bindSubmitHandlers } from '../../components/forms';
import ReportCategorySelector from './ReportCategorySelector.component';
import ReportList from './ReportList.component';
import ReportConfigurationForm from './ReportConfigurationForm.component';

type ExternalProps = {
  reportConfigurations: ReportConfiguration[],
  upsertReportConfiguration: (ReportConfiguration) => void,
};
type Props = ExternalProps & {
  setSelectedCategory: (ReportCategoryEnum) => void,
  classes: { [string]: string },
  setShowModalAdd: (boolean) => void,
  showModalAdd: boolean,
  reportConfiguration: ReportConfiguration,
  onReportDetail: (ReportConfiguration) => void,
  metadata: ReportMetadata,
  setReportConfigurationToEdit: (ReportConfiguration) => void,
  t: TFunction,
  setSelectedForDeletion: (r: ?ReportConfiguration) => void,
  selectedForDeletion: ?ReportConfiguration,
  selectedCategory: ?ReportConfiguration,
  onCancelDeletion: () => void,
  onConfirmDeletion: () => void,
};

export function ReportDashboard(props: Props) {
  const {
    setSelectedCategory,
    reportConfigurations,
    classes,
    showModalAdd,
    setShowModalAdd,
    upsertReportConfiguration,
    reportConfiguration,
    onReportDetail,
    setReportConfigurationToEdit,
    metadata,
    selectedCategory,
    t,
    setSelectedForDeletion,
    selectedForDeletion,
    onCancelDeletion,
    onConfirmDeletion,
  } = props;
  const itemProps = {
    onEdit: (report: ReportConfiguration) => {
      setReportConfigurationToEdit(report);
      setShowModalAdd(true);
    },
    onDetail: onReportDetail,
    onDelete: (r) => setSelectedForDeletion(r),
  };
  const categories = metadata.map((c) => c.category);
  return (
    <div className={classes.root}>
      <ReportCategorySelector
        categories={categories}
        onSelect={setSelectedCategory}
        selected={selectedCategory}
      />
      {reportConfigurations.length ? (
        <div>
          <ReportList
            items={reportConfigurations}
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
            {reportConfiguration.name || t('form.title')}
          </DialogTitle>
          <DialogContent>
            <ReportConfigurationForm
              metadata={metadata}
              initial={reportConfiguration}
              onClose={() => setShowModalAdd(false)}
              onSubmit={bindSubmitHandlers(upsertReportConfiguration, {
                onSuccess: (report) => {
                  setShowModalAdd(false);
                  onReportDetail(report);
                },
              })}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

const styles = (theme) => ({
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
});

export default compose(
  withTranslation(['reporting']),
  withStyles(styles),
  withState('selectedCategory', 'setSelectedCategory', null),
  withState('reportConfiguration', 'setReportConfigurationToEdit', null),
  withProps(({ reportConfigurations, selectedCategory }) => ({
    reportConfigurations: selectedCategory
      ? reportConfigurations.filter((c) => c.category === selectedCategory)
      : reportConfigurations,
  })),
  withState('showModalAdd', 'setShowModalAdd', false),
  withState('selectedForDeletion', 'setSelectedForDeletion', null),
  withProps(
    ({ selectedForDeletion, onDeleteReport, setSelectedForDeletion }) => ({
      onConfirmDeletion: () => {
        onDeleteReport(selectedForDeletion.id);
        setSelectedForDeletion(null);
      },
      onCancelDeletion: () => setSelectedForDeletion(null),
    }),
  ),
)(ReportDashboard);
