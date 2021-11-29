// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';

import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';

import FuzeSearch from '../../components/FuzeSearch.component';
import { getAllSmartList, getSmartList } from '../../libs/smart-list/selectors';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import {
  smartListDelete,
  fetchAllSmartLists,
  smartListCreate,
  smartListUpdate,
  fetchSmartListDetail,
  copySmartList as copySmartListAction,
} from '../../libs/smart-list/actions';

import type SmartList from '../../libs/smart-list/types';
import SmartListListItem from '../../libs/smart-list/components/SmartListListItem.component';
import SmartListEditDialog from '../../libs/smart-list/components/SmartListFormDialog.component';
import type { OptionCallback } from '../../state/types';
import SmartListCard from '../../libs/smart-list/components/SmartlistCard.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

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
  smartlistSelected: ?Smartlist,
  loading: boolean,
};

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
  }

  addNewSmartList = (data) => {
    const smartlist = data;
    smartlist.company = this.props.company_id;
    this.props.smartListCreate(data, {
      onSuccess: (data_) => this.props.goToEdit(data_.id),
    });
    this.setState({ openCreateDialog: false });
  };

  updateSmartList = (smartlist) => {
    this.setState({ openEditDialog: false });
    this.props.smartListUpdate(this.props.selectedId, smartlist);
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

  render() {
    const { smartlists, classes } = this.props;

    return (
      <div>
        {this.props.smartlists.length === 0 && !this.props.loading && (
          <IsEmptyList
            text={this.props.t('noSmartLists')}
            button={this.props.t('smart_list.add')}
            onCreate={() => this.setState({ openCreateDialog: true })}
          />
        )}
        {!!this.props.loading && <BackofficeLinearProgress />}
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={6}>
            {smartlists.length > 0 ? (
              <div className={this.props.classes.search}>
                <FuzeSearch
                  searchText={this.state.searchText}
                  clearSearch={this.clearSearch}
                  changeSearch={this.changeSearch}
                  items={smartlists}
                  placeholder={this.props.t('search')}
                  searchFields={['name', 'description']}
                  searchResult={this.state.searchResult}
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
                      component="nav"
                      disablePadding
                      className={classes.list}
                    >
                      {this.state.searchResult.map((smartlist) => (
                        <SmartListListItem
                          key={smartlist.id}
                          onClick={(id) => {
                            this.selected(id);
                          }}
                          onClickEdit={this.props.goToEdit}
                          onClickDelete={(id) =>
                            this.props.smartListDelete(id, {
                              onSuccess: this.props.goToSmartlistList,
                            })
                          }
                          selected={
                            this.props.smartlistSelected &&
                            smartlist.id === this.props.smartlistSelected.id
                          }
                          smartlist={smartlist}
                          onClickDuplicate={(id) =>
                            this.props.onClickDuplicate(id, {
                              onSuccess: (newId) =>
                                this.props.goToSelected(newId),
                            })
                          }
                        />
                      ))}
                    </List>
                  </Collapse>
                </Paper>
              </div>
            ) : null}
            <Paper>
              <List component="nav" disablePadding className={classes.list}>
                {smartlists.map((smartlist) => (
                  <SmartListListItem
                    key={smartlist.id}
                    onClick={(id) => {
                      this.selected(id);
                    }}
                    onClickEdit={this.props.goToEdit}
                    onClickDelete={(id) =>
                      this.props.smartListDelete(id, {
                        onSuccess: this.props.goToSmartlistList,
                      })
                    }
                    selected={
                      this.props.smartlistSelected &&
                      smartlist.id === this.props.smartlistSelected.id
                    }
                    smartlist={smartlist}
                    onClickDuplicate={(id) =>
                      this.props.onClickDuplicate(id, {
                        onSuccess: (newId) => this.props.goToSelected(newId),
                      })
                    }
                  />
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <SmartListCard
              smartlist={this.props.smartlistSelected}
              onEdit={() => this.setState({ openEditDialog: true })}
              onClickConfigure={this.props.goToEdit}
              onClickCampaign={this.props.goToSelectedCampaign}
            />
          </Grid>
        </Grid>
        <SmartListEditDialog
          open={this.state.openEditDialog || this.state.openCreateDialog}
          smartlist={
            this.state.openEditDialog ? this.props.smartlistSelected : null
          }
          updateSmartList={
            this.state.openEditDialog
              ? this.updateSmartList
              : this.addNewSmartList
          }
          onCancel={() =>
            this.setState({ openEditDialog: false, openCreateDialog: false })
          }
          fullScreen
        />
        <BottomActionButtons
          onCreateLabel={this.props.t('smart_list.add')}
          onCreate={() => this.setState({ openCreateDialog: true })}
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

  connect(
    (state, { selectedId }) => ({
      smartlists: getAllSmartList(state),
      smartlistSelected: getSmartList(state, selectedId),
      loading: state.smartList.loading,
      company_id: state.theme.theme.company,
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
    },
  ),
)(SmartListList);
