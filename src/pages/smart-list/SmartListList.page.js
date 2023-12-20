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
import Collapse from '@material-ui/core/Collapse';

import FuzeSearch from '../../components/FuzeSearch.component';
import {
  getAllSmartList,
  getSmartList,
  getCadencesUsingSmartlist,
  getCadenceIdsUsingSmartlistLoading,
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

import type { SmartList } from '../../libs/smart-list/types';
import SmartListListItem from '../../libs/smart-list/components/SmartListListItem.component';
import SmartListEditDialog from '../../libs/smart-list/components/SmartListFormDialog.component';
import type { OptionCallback } from '../../state/types';
import SmartListCard from '../../libs/smart-list/components/SmartlistCard.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import { isSequentialMarketingAuthorized } from '../../libs/sequential_marketing/utils';
import type {
  Cadence,
  CadenceQueryParams,
} from '../../libs/sequential_marketing/types';
import { getTheme } from '../../libs/theme/selectors';

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
  goToSmartlistList: () => void,
  smartlistSelected: ?SmartList,
  loading: boolean,
  fetchCadencesUsingSmartlist: (
    id: number,
    options: OptionCallback<number[]>,
  ) => void,
  getCadences: (id: number) => Cadence[],
  cadencesLoading: boolean,
  fetchCadenceList: (params: CadenceQueryParams) => void,
  hasSequentialMarketingUpsell: boolean,
} & WithRouterProps;

type State = {
  openCreateDialog: boolean,
  openEditDialog: boolean,
};

export class SmartListList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openCreateDialog: false,
      openEditDialog: false,
      searchText: '',
      searchResult: [],
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

  changeSearch = (fuse) => (ev) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  handleDeleteSmartlist = (id: number) => {
    this.props.smartListDelete(id, {
      onSuccess: this.props.goToSmartlistList,
    });
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
                <FuzeSearch
                  changeSearch={this.changeSearch}
                  clearSearch={this.clearSearch}
                  items={smartlists}
                  placeholder={this.props.t('search')}
                  searchFields={['name', 'description']}
                  searchResult={this.state.searchResult}
                  searchText={this.state.searchText}
                />
                <Paper
                  className={
                    this.state.searchResult.length > 0 &&
                    this.state.searchText !== ''
                      ? this.props.classes.searchPaperDisplayed
                      : this.props.classes.searchPaperHiden
                  }
                >
                  <Collapse
                    in={
                      this.state.searchResult.length > 0 &&
                      this.state.searchText !== ''
                    }
                  >
                    <List
                      disablePadding
                      className={classes.list}
                      component="nav"
                    >
                      {this.state.searchResult.map((smartlist) => (
                        <SmartListListItem
                          key={smartlist.id}
                          cadencesLoading={this.props.cadencesLoading}
                          fetchCadences={this.fetchCadences}
                          getCadences={this.props.getCadences}
                          isSequentialMarketingAuthorized={isSequentialMarketingAuthorized(
                            this.props.company_id,
                            this.props.hasSequentialMarketingUpsell,
                          )}
                          onClick={(id) => {
                            this.selected(id);
                          }}
                          onClickDelete={this.handleDeleteSmartlist}
                          onClickDuplicate={(id) =>
                            this.props.onClickDuplicate(id, {
                              onSuccess: (newId) =>
                                this.props.goToSelected(newId),
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
                  </Collapse>
                </Paper>
              </div>
            ) : null}
            <Paper>
              <List disablePadding className={classes.list} component="nav">
                {smartlists.map((smartlist) => (
                  <SmartListListItem
                    key={smartlist.id}
                    cadencesLoading={this.props.cadencesLoading}
                    fetchCadences={this.fetchCadences}
                    getCadences={this.props.getCadences}
                    isSequentialMarketingAuthorized={isSequentialMarketingAuthorized(
                      this.props.company_id,
                      this.props.hasSequentialMarketingUpsell,
                    )}
                    onClick={(id) => {
                      this.selected(id);
                    }}
                    onClickDelete={this.handleDeleteSmartlist}
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
  withRouter,
  withQueryParams([['create'], 'queryParams', 'setQueryParams']),
  connect(
    (state, { selectedId }) => ({
      smartlists: getAllSmartList(state),
      smartlistSelected: getSmartList(state, selectedId),
      getCadences: (id: number) => getCadencesUsingSmartlist(state, id),
      cadencesLoading: getCadenceIdsUsingSmartlistLoading(state),
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
      goToSmartlistList: () => push('/smart-list/'),
      fetchCadencesUsingSmartlist,
      fetchCadenceList,
    },
  ),
)(SmartListList);
