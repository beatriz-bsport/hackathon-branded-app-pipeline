// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { getAllSmartList, getSmartList } from '../../libs/smart-list/selectors';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import {
  smartListDelete,
  fetchAllSmartLists,
  smartListCreate,
  smartListUpdate,
} from '../../libs/smart-list/actions';

import type SmartList from '../../libs/smart-list/types';
import SmartListListItem from '../../libs/smart-list/components/SmartListListItem.component';
// import { fetchDetails } from '../../libs/smart-list/api';
import SmartListEditDialog from '../../libs/smart-list/components/SmartListFormDialog.component';
import type { OptionCallback } from '../../state/types';
import SmartlistCard from '../../libs/smart-list/components/SmartlistCard.component';

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
  smartListUpdate: (id: number) => void,

  goToSmartlistList: () => void,
  smartlistSelected: ?Smartlist,
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

  selected = async (id) => {
    this.props.goToSelected(id);
  };

  render() {
    const { smartlists, classes } = this.props;
    return (
      <div>
        <Grid container direction="row" spacing={24}>
          <Grid item xs={12} md={6}>
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
                  />
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <SmartlistCard
              smartlist={this.props.smartlistSelected}
              onEdit={() => this.setState({ openEditDialog: true })}
              onConfigure={() =>
                this.props.goToEdit(this.props.smartlistSelected.id)
              }
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

const styles = () => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
  routerParamsToProps({ id: 'selectedId:number' }),
  withTitle(({ t }) => t('smart_list.list.title')),

  connect(
    (state, { selectedId }) => ({
      smartlists: getAllSmartList(state),
      smartlistSelected: getSmartList(state, selectedId),
      loading: state.smartList.isLoading,
      company_id: state.theme.theme.company,
    }),
    {
      fetchAllSmartLists,
      smartListUpdate,
      smartListDelete,
      smartListCreate,
      goToEdit: (id) => push(`/smart-list/${id}/member`),
      goToSelected: (id) => push(`/smart-list/${id}`),
      goToSmartlistList: () => push('/smart-list/'),
    },
  ),
)(SmartListList);
