// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withTitle from '../../hocs/with-title.hoc';
import { getPrivatePassListWithPrivateService } from '../../libs/private-service/selectors/private-pass';
import { getPrivateServices } from '../../libs/private-service/selectors/private-service';
import {
  fetchPrivatePassList,
  fetchAllPrivateServices,
  createOrUpdatePrivatePass,
  deleteCompatibleServicePass,
  createCompatibleServicePass,
} from '../../libs/private-service/actions';
import PrivatePassListItem from '../../libs/private-service/components/PrivatePassListItem.component';
import PrivatePassDetail from '../../libs/private-service/components/PrivatePassDetail.component';
import PrivatePassForm from '../../libs/private-service/components/PrivatePassForm.component';
import type {
  PrivatePass,
  PrivateService,
} from '../../libs/private-service/types';

type Props = {
  fetchPrivatePassList: () => void,
  fetchAllPrivateServices: () => void,
  privatePassList: Array<PrivatePass>,
  private_services: Array<PrivateService>,
  selectedPassId: number,
  deleteCompatibleServicePass: (id: number) => void,
  createCompatibleServicePass: (any) => void,
  openCreateForm: boolean,
  setOpenCreateForm: (boolean) => void,
  createOrUpdatePrivatePass: (
    data: any,
    id: ?number,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,
  setSelectedPass: (id: number) => void,

  classes: Object,
  t: TFunction,
};

export class PrivatePassList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivatePassList();
    this.props.fetchAllPrivateServices();
  }

  createOrUpdatePass = (data: any, id: number) => {
    this.props.createOrUpdatePrivatePass(data, id, {
      onSuccess: () => {
        this.props.setOpenCreateForm(false);
        this.props.fetchPrivatePassList();
      },
    });
  };

  render() {
    return (
      <Grid container>
        <Grid item xs={12} md={6}>
          <div className={this.props.classes.leftPanel}>
            <Paper>
              <List disablePadding>
                {this.props.privatePassList.map((pass) => (
                  <PrivatePassListItem
                    pass={pass}
                    key={pass.id}
                    onClick={() => this.props.setSelectedPass(pass.id)}
                  />
                ))}
              </List>
            </Paper>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          {this.props.selectedPassId ? (
            <PrivatePassDetail
              private_services={this.props.private_services}
              updatePrivatePass={this.props.createOrUpdatePrivatePass}
              deleteCompatibleServicePass={
                this.props.deleteCompatibleServicePass
              }
              createCompatibleServicePass={
                this.props.createCompatibleServicePass
              }
              pass={this.props.privatePassList.find(
                (p) => p.id === this.props.selectedPassId,
              )}
            />
          ) : null}
        </Grid>
        <Dialog open={this.props.openCreateForm}>
          <DialogTitle>{this.props.t('privatePass.form.title')}</DialogTitle>
          <DialogContent>
            <PrivatePassForm
              onSubmit={this.createOrUpdatePass}
              onCancel={() => this.props.setOpenCreateForm(false)}
            />
          </DialogContent>
        </Dialog>
        <Fab
          className={this.props.classes.addButton}
          variant="extended"
          color="primary"
          onClick={() => this.props.setOpenCreateForm(true)}
        >
          <AddIcon className={this.props.classes.leftIcon} />
          {this.props.t('privatePass.list.createButton')}
        </Fab>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  addButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  leftPanel: {
    paddingBottom: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing.unit * 2,
    },
  },
});

export default compose(
  withNamespaces(['privateService']),
  withTitle(({ t }) => t('pageTitles.passList')),
  withStyles(styles),
  connect(
    (state) => ({
      privatePassList: getPrivatePassListWithPrivateService(state),
      private_services: getPrivateServices(state),
    }),
    {
      fetchPrivatePassList,
      fetchAllPrivateServices,
      createOrUpdatePrivatePass,
      createCompatibleServicePass,
      deleteCompatibleServicePass,
    },
  ),
  withState('openCreateForm', 'setOpenCreateForm', false),
  withState('selectedPassId', 'setSelectedPass', null),
)(PrivatePassList);
