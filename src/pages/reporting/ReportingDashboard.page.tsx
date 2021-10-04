// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import { Theme } from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push } from 'connected-react-router';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fuse, { FuseOptions } from 'fuse.js';
import withTitle from '../../hocs/with-title.hoc';
import { bindSubmitHandlers } from '../../components/forms';
import ModalConfirm from '../../components/ModalConfirm.component';
import ReportDashboard from '../../libs/reporting/ReportDashboard.component';
import ReportConfigurationForm from '../../libs/reporting/ReportConfigurationForm.component';
import ReportList from '../../libs/reporting/ReportList.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import FuzeSearch from '../../components/FuzeSearch.component';
import {
  ReportMetadata,
  ReportConfiguration,
} from '../../libs/reporting/types';
import { MaterialStyleType } from '../../utils/types';
import {
  reportMetadata,
  reports as reportsRes,
} from '../../resources/reporting';

type OwnProps = {
  metadata: ReportMetadata;
  reports: Array<ReportConfiguration>;
  fetchReportMetadata: () => void;
  fetchReports: () => void;
  goToReport: (arg: ReportConfiguration) => void;
  upsertReport: (arg: ReportConfiguration) => void;
  deleteReport: (arg: ReportConfiguration) => void;
  setSelectedForDeletion: (arg?: ReportConfiguration) => void;
  t: TFunction;
  classes: Object;
  setReportConfigurationToEdit: (arg: ReportConfiguration) => void;
  setShowModalAdd: (arg: boolean) => void;
  onCancelDeletion: () => void;
  onConfirmDeletion: () => void;
  selectedForDeletion?: ReportConfiguration;
  showModalAdd: boolean;
  reportConfiguration: ReportConfiguration;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  searchText: string;
  searchResult: Array<ReportConfiguration>;
};
export class ReportingDashboard extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentWillMount() {
    this.props.fetchReports();
    this.props.fetchReportMetadata();
  }

  changeSearch = (
    fuse: Fuse<ReportConfiguration, FuseOptions<ReportConfiguration>>,
  ) => (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  render() {
    const {
      reports,
      reportConfiguration,
      upsertReport,
      goToReport,
      metadata,
      deleteReport,
      t,
      classes,
      setReportConfigurationToEdit,
      setShowModalAdd,
      setSelectedForDeletion,
      onCancelDeletion,
      onConfirmDeletion,
      selectedForDeletion,
      showModalAdd,
    } = this.props;
    const itemProps = {
      onEdit: (report: ReportConfiguration) => {
        setReportConfigurationToEdit(report);
        setShowModalAdd(true);
      },
      onDetail: goToReport,
      onDelete: (r: ReportConfiguration) => setSelectedForDeletion(r),
    };
    if (metadata.loading || !metadata.value) {
      return <LinearProgress />;
    }

    return (
      <div>
        <div className={classes.search}>
          <FuzeSearch
            searchText={this.state.searchText}
            clearSearch={this.clearSearch}
            changeSearch={this.changeSearch}
            items={reports}
            placeholder={t('search')}
            searchFields={['name']}
            searchResult={this.state.searchResult}
          />

          <Paper
            className={
              this.state.searchResult.length > 0 && this.state.searchText !== ''
                ? classes.searchPaperDisplayed
                : classes.searchPaperHidden
            }
          >
            <Collapse
              in={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
              }
            />
            <div>
              <ReportList
                items={this.state.searchResult}
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
          </Paper>
        </div>
        <ReportDashboard
          metadata={metadata.value}
          reportConfigurations={reports}
          upsertReportConfiguration={upsertReport}
          onDeleteReport={deleteReport}
          onReportDetail={goToReport}
        />

        <Dialog open={showModalAdd}>
          <DialogTitle>
            {reportConfiguration?.name || t('form.title')}
          </DialogTitle>
          <DialogContent>
            <ReportConfigurationForm
              metadata={metadata.value}
              initial={reportConfiguration}
              onClose={() => setShowModalAdd(false)}
              onSubmit={bindSubmitHandlers(upsertReport, {
                onSuccess: (report: ReportConfiguration) => {
                  setShowModalAdd(false);
                  goToReport(report);
                },
              })}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  search: {
    marginBottom: theme.spacing(2),
  },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
    boderBottom: '0px',
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      metadata: reportMetadata.selectors.get(state),
      reports: reportsRes.selectors.all(state),
    }),
    {
      fetchReportMetadata: reportMetadata.effects.get,
      fetchReports: reportsRes.effects.fetchAll,
      upsertReport: reportsRes.effects.upsert,
      deleteReport: reportsRes.effects.delete,
      goToReport: (r: ReportConfiguration) => push(`/reporting/${r.id}`),
    },
  ),
  withTranslation(['reporting']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:dashboard.reportingDashboard'),
  ),

  withState('selectedCategory', 'setSelectedCategory', null),
  withState('reportConfiguration', 'setReportConfigurationToEdit', null),

  withState('showModalAdd', 'setShowModalAdd', false),
  withState('selectedForDeletion', 'setSelectedForDeletion', null),
  withProps(
    ({ selectedForDeletion, deleteReport, setSelectedForDeletion }) => ({
      onConfirmDeletion: () => {
        deleteReport(selectedForDeletion.id);
        setSelectedForDeletion(null);
      },
      onCancelDeletion: () => setSelectedForDeletion(null),
    }),
  ),
)(ReportingDashboard);
