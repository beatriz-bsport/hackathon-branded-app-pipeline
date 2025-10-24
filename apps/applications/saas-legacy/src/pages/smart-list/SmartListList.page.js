// @flow

import React, { Component } from 'react';
import uniq from 'lodash/uniq';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { withRouter } from 'react-router';

import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';

import ModalConfirm from '../../components/ModalConfirm.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import {
  getAllSmartList,
  getSmartList,
  getCadencesUsingSmartlist,
} from '../../libs/smart-list/selectors';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withQueryParams from '../../hocs/with-query-params.hoc';
import withTitle from '../../hocs/with-title.hoc';
import { fetchCadenceList } from '../../libs/sequential_marketing/actions';
import {
  smartListDelete,
  fetchAllSmartLists,
  smartListCreate,
  smartListUpdate,
  fetchSmartListDetail,
  copySmartList as copySmartListAction,
  fetchCadencesUsingSmartlist,
} from '../../libs/smart-list/actions';
import SmartlistCannotBeDeletedDialog from '../../libs/smart-list/components/SmartListCannotBeDeletedDialog.component';
import type { SmartList } from '../../libs/smart-list/types';
import SmartListListItem from '../../libs/smart-list/components/SmartListListItem.component';
import SmartListEditDialog from '../../libs/smart-list/components/SmartListFormDialog.component';
import type { OptionCallback } from '../../state/types';
import SmartListCard from '../../libs/smart-list/components/SmartlistCard.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import type {
  Cadence,
  CadenceQueryParams,
} from '../../libs/sequential_marketing/types';
import { getTheme } from '../../libs/theme/selectors';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

type SmartlistOption = {
  label: string,
  onClick: (id: number) => void,
  onClickDelete: (smartlist: Smartlist) => void,
  onClickDuplicate: (id: number) => void,
  onClickEdit: (id: number) => void,
  selected: boolean,
  value: number,
};

const Option: React.FC<OptionPropsWithData<SmartlistOption>> = (props) => (
  <SmartListListItem divider {...props.data} />
);

type Props = {
  smartlists: Array<SmartList>,
  t: TFunction,
  fetchAllSmartLists: () => void,
  smartListCreate: (data: SmartList, options: OptionCallback) => void,
  company_id: number,
  classes: Object,
  goToEdit: (id: number) => void,
  smartListDelete: (id: number, options: OptionCallback) => void,
  selectedId: number,
  goToSelected: (id: number) => void,
  goToSelectedCampaign: (id: number) => void,
  smartListUpdate: (id: number) => void,
  onClickDuplicate: (id: number, options: any) => void,
  smartlistSelected?: SmartList,
  loading: boolean,
  fetchCadencesUsingSmartlist: (
    id: number,
    options: OptionCallback<number[]>,
  ) => void,
  getCadences: (id: number) => Cadence[],
  fetchCadenceList: (params: CadenceQueryParams) => void,
  hasSequentialMarketingUpsell: boolean,
} & WithRouterProps &
  WithObjectSearch;

type State = {
  openCreateDialog: boolean,
  openEditDialog: boolean,
  smartlistIdToDelete: number,
  isSmartlistCannotBeDeletedDialogOpen: boolean,
};

export class SmartListList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openCreateDialog: false,
      openEditDialog: false,
      smartlistIdToDelete: null,
      isSmartlistCannotBeDeletedDialogOpen: false,
    };
  }

  componentDidMount() {
    this.props.fetchAllSmartLists();

    if (this.props.queryParams.create === 'true') {
      this.setState({ openCreateDialog: true });
    }
  }

  addNewSmartList = (data, options?: OptionCallback) => {
    const smartlist = data;
    smartlist.company = this.props.company_id;
    this.props.smartListCreate(data, {
      onSuccess: (data_) => {
        if (options && options.onSuccess) options.onSuccess();
        this.props.goToEdit(data_.id);
      },
    });
    this.setState({ openCreateDialog: false });
    this.props.setQueryParams('create')(false);
  };

  updateSmartList = (smartlist: SmartList, options?: OptionCallback) => {
    this.setState({ openEditDialog: false });
    this.props.smartListUpdate(this.props.selectedId, smartlist, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
      },
    });
  };

  selected = (id) => {
    if (id === this.props.selectedId) {
      this.props.goToEdit(id);
    } else {
      this.props.goToSelected(id);
    }
  };

  smartlistOptionsFormatter = (smartlists: SmartList[]): SmartlistOption[] =>
    smartlists.map((smartlist) => {
      return {
        label: smartlist.name,
        onClick: (id) => {
          this.selected(id);
        },
        onClickDelete: this.handleDeleteClick,
        onClickDuplicate: (id) =>
          this.props.onClickDuplicate(id, {
            onSuccess: (newId) => this.props.goToSelected(newId),
          }),
        onClickEdit: this.props.goToEdit,
        selected:
          this.props.smartlistSelected &&
          smartlist.id === this.props.smartlistSelected.id,
        smartlist,
        value: smartlist.id,
      };
    });

  handleDeleteClick = (smartlist: SmartList) => {
    this.setState({ smartlistIdToDelete: smartlist.id });
  };

  handleCancelDelete = () => {
    this.setState({ smartlistIdToDelete: null });
  };

  handleCancelIsSmartlistCannotBeDeletedDialogOpen = () =>
    this.setState({
      isSmartlistCannotBeDeletedDialogOpen: false,
      smartlistIdToDelete: null,
    });

  handleDeleteSmartlist = () => {
    if (this.props.hasSequentialMarketingUpsell) {
      this.fetchCadences(this.state.smartlistIdToDelete);
    } else {
      this.props.smartListDelete(this.state.smartlistIdToDelete, {
        onSuccess: () => {
          this.props.refreshOptions('smart_list');
        },
      });
      this.setState({ smartlistIdToDelete: null });
    }
  };

  handleOpenSmartlistCreateDialog = () => {
    this.setState({ openCreateDialog: true });
    this.props.setQueryParams('create')(true);
  };

  fetchCadences = (id: number) => {
    this.props.fetchCadencesUsingSmartlist(id, {
      onSuccess: (cadence_ids) => {
        const uniq_ids = uniq(cadence_ids ?? []);
        if (uniq_ids?.length !== 0) {
          this.props.fetchCadenceList({ id__in: cadence_ids });
          this.setState({ isSmartlistCannotBeDeletedDialogOpen: true });
        } else {
          this.props.smartListDelete(id, {
            onSuccess: () => {
              this.props.refreshOptions('smart_list');
            },
          });
          this.setState({ smartlistIdToDelete: null });
        }
      },
    });
  };

  render() {
    const { smartlists, classes } = this.props;

    return (
      <div>
        {this.props.smartlists.length === 0 && !this.props.loading && (
          <IsEmptyList
            button={this.props.t('smart_list.add')}
            onCreate={this.handleOpenSmartlistCreateDialog}
            text={this.props.t('noSmartLists')}
          />
        )}
        {!!this.props.loading && <BackofficeLinearProgress />}
        <Grid container direction="row" spacing={3}>
          <Grid item md={6} xs={12}>
            {smartlists.length > 0 ? (
              <div className={this.props.classes.search}>
                <ObjectSearchComponent
                  components={{ Option }}
                  optionsFormatter={this.smartlistOptionsFormatter}
                  placeholder={this.props.t('search')}
                  searchedObjectType="smart_list"
                  variant="underlined"
                />
              </div>
            ) : null}
            <Paper>
              <List disablePadding className={classes.list} component="nav">
                {smartlists.map((smartlist) => (
                  <SmartListListItem
                    key={smartlist.id}
                    onClick={(id) => {
                      this.selected(id);
                    }}
                    onClickDelete={this.handleDeleteClick}
                    onClickDuplicate={(id) =>
                      this.props.onClickDuplicate(id, {
                        onSuccess: (newId) => this.props.goToSelected(newId),
                      })
                    }
                    onClickEdit={this.props.goToEdit}
                    selected={
                      this.props.smartlistSelected &&
                      smartlist.id === this.props.smartlistSelected.id
                    }
                    smartlist={smartlist}
                  />
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item md={6} xs={12}>
            <SmartListCard
              onClickCampaign={this.props.goToSelectedCampaign}
              onClickConfigure={this.props.goToEdit}
              onEdit={() => this.setState({ openEditDialog: true })}
              smartlist={this.props.smartlistSelected}
            />
          </Grid>
        </Grid>
        {(this.state.openEditDialog || this.state.openCreateDialog) && (
          <SmartListEditDialog
            fullScreen
            onCancel={() => {
              this.setState({
                openEditDialog: false,
                openCreateDialog: false,
              });
              this.props.setQueryParams('create')(false);
            }}
            open={this.state.openEditDialog || this.state.openCreateDialog}
            smartlist={
              this.state.openEditDialog ? this.props.smartlistSelected : null
            }
            updateSmartList={
              this.state.openEditDialog
                ? this.updateSmartList
                : this.addNewSmartList
            }
          />
        )}
        <ModalConfirm
          handleCancel={this.handleCancelDelete}
          handleConfirm={this.handleDeleteSmartlist}
          open={this.state.smartlistIdToDelete}
          options={{
            title: 'smartList:modal.delete.title',
            cancel: 'smartList:modal.delete.cancel',
            confirm: 'smartList:modal.delete.confirm',
            Content: ({ t }: { t: TFunction }) => (
              <p>{t('smartList:modal.delete.content')}</p>
            ),
          }}
        />
        {this.props.hasSequentialMarketingUpsell && (
          <SmartlistCannotBeDeletedDialog
            cadences={this.props.getCadences(this.state.smartlistIdToDelete)}
            onCancel={this.handleCancelIsSmartlistCannotBeDeletedDialogOpen}
            open={this.state.isSmartlistCannotBeDeletedDialogOpen}
          />
        )}
        <BottomActionButtons
          onCreate={this.handleOpenSmartlistCreateDialog}
          onCreateLabel={this.props.t('smart_list.add')}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  emptysmartLists: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    color: 'bleu',
    fontSize: 'larger',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    border: '2px solid #E2E2E2',
    borderRadius: theme.spacing(1),
    textAlign: 'center',
    width: '400px',
    marginLeft: '200px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  search: { marginBottom: theme.spacing(2) },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
    boderBottom: '0px',
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
  routerParamsToProps({ id: 'selectedId:number' }),
  withTitle(({ t }) => t('smart_list.list.title')),
  withObjectSearch,
  withRouter,
  withQueryParams([['create'], 'queryParams', 'setQueryParams']),
  connect(
    (state, { selectedId }) => ({
      smartlists: getAllSmartList(state),
      smartlistSelected: getSmartList(state, selectedId),
      getCadences: (id: number) => getCadencesUsingSmartlist(state, id),
      loading: state.smartList.loading,
      company_id: getTheme(state).company,
      hasSequentialMarketingUpsell:
        getTheme(state).is_sequential_marketing_active,
    }),
    {
      fetchAllSmartLists,
      smartListUpdate,
      fetchSmartListDetail,
      onClickDuplicate: copySmartListAction,
      smartListDelete,
      smartListCreate,
      goToEdit: (id) => push(`/smart-list/${id}/member`),
      goToSelected: (id) => push(`/smart-list/${id}`),
      goToSelectedCampaign: (id) => push(`/smart-list/${id}/campaign`),
      fetchCadencesUsingSmartlist,
      fetchCadenceList,
    },
  ),
)(SmartListList);
