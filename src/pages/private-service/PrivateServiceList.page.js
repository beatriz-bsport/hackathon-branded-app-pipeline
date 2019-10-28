// @flow

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import React from 'react';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose, withProps, withState } from 'recompose';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import { getAvailablePrivateServices } from '../../libs/private-service/selectors/private-service';
import { getAllEstablishmentsWithAssociatedId } from '../../libs/establishment/selectors';
import {
  getAllCoaches,
  getActiveCoaches,
} from '../../libs/associated-coach/selectors';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import {
  fetchEstablishments,
  fetchAssociatedEstablishments,
} from '../../libs/establishment/actions';
import {
  fetchAllPrivateServices,
  fetchPrivateService,
  createOrUpdatePrivateService,
  createPrivateCoach,
  deletePrivateCoach,
  createPrivateEstablishment,
  deletePrivateEstablishment,
  fetchPrivateSlotList,
  createOrUpdatePrivateSlot,
  deletePrivateSlot,
  deletePrivateService,
} from '../../libs/private-service/actions';
import type { PrivateService } from '../../libs/private-service/types';
import PrivateServiceListItem from '../../libs/private-service/components/PrivateServiceListItem.component';
import PrivateServiceForm from '../../libs/private-service/components/PrivateServiceForm.component';
import PrivateServiceDetail from '../../libs/private-service/components/PrivateServiceDetail.component';

type Props = {
  fullScreen: boolean,
  privateServices: Array<PrivateService>,
  fetchAllPrivateServices: () => void,
  createOrUpdatePrivateService: (
    data: *,
    options: { onSuccess: () => void },
  ) => void,
  goToPrivateService: (id: number) => void,
  fetchPrivateSlotList: (privateServiceId: number) => void,
  createOrUpdatePrivateSlot: (any) => void,
  deletePrivateSlot: (privateServiceId: number, privateSlotId: number) => void,
  deletePrivateService: (id: number) => void,
  privateServiceId: number,
  fetchAssociatedCoachesList: () => void,
  fetchEstablishments: () => void,
  setOpenEditForm: (data: any) => void,
  createPrivateCoach: (
    associatedCoachId: number,
    privateServiceId: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  deletePrivateEstablishment: (
    associatedEstablishmentId: number,
    privateServiceId: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  fetchPrivateService: (id: number) => void,
  selectedPrivateService: ?PrivateService,
  availableEstablishments: Array<Establishment>,
  openEditForm: any,
  availableCoaches: Array<AssociatedCoach>,
  deletePrivateCoach: (
    associatedCoachId: number,
    privateServiceId: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  createPrivateEstablishment: (
    associatedEstablishmentId: number,
    privateServiceId: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  fetchEstablishments: () => void,
  fetchAssociatedEstablishments: () => void,

  openCreateForm: boolean,
  loading: boolean,
  setOpenCreateForm: (boolean) => void,
  t: TFunction,
  classes: Object,
};

export class PrivateServiceList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllPrivateServices();
    this.props.fetchPrivateSlotList(this.props.privateServiceId);
    this.props.fetchAssociatedCoachesList();
    this.props.fetchEstablishments();
    this.props.fetchAssociatedEstablishments();
  }

  closeCreateForm = () => this.props.setOpenCreateForm(false);

  closeEditForm = () => this.props.setOpenEditForm(null);

  createOrUpdatePrivateService = (data: *) => {
    this.props.createOrUpdatePrivateService(data, {
      onSuccess: () => {
        this.props.setOpenEditForm(null);
        this.props.setOpenCreateForm(false);
        this.props.fetchAllPrivateServices();
      },
    });
  };

  createPrivateCoach = (
    associatedCoachId: number,
    privateServiceId: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => {
    this.props.createPrivateCoach(associatedCoachId, privateServiceId, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
        this.props.fetchPrivateService(privateServiceId);
      },
      onError: options ? options.onError : null,
    });
  };

  deletePrivateCoach = (
    associatedCoachId: number,
    privateServiceId: number,
  ) => {
    this.props.deletePrivateCoach(associatedCoachId, privateServiceId, {
      onSuccess: () => {
        this.props.fetchPrivateService(privateServiceId);
      },
    });
  };

  createPrivateEstablishment = (
    associatedEstablishmentId: number,
    privateServiceId: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => {
    this.props.createPrivateEstablishment(
      associatedEstablishmentId,
      privateServiceId,
      {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          this.props.fetchPrivateService(privateServiceId);
        },
        onError: options ? options.onError : null,
      },
    );
  };

  deletePrivateEstablishment = (
    associatedEstablishmentId: number,
    privateServiceId: number,
  ) => {
    this.props.deletePrivateEstablishment(
      associatedEstablishmentId,
      privateServiceId,
      {
        onSuccess: () => {
          this.props.fetchPrivateService(privateServiceId);
        },
      },
    );
  };

  render() {
    const { classes, t, selectedPrivateService } = this.props;
    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        <Grid container direction="row">
          <Grid item xs={12} md={6}>
            <div className={classes.leftPanel}>
              <List disablePadding>
                <Paper>
                  {this.props.privateServices.map((ps) => (
                    <PrivateServiceListItem
                      key={ps.id}
                      privateService={ps}
                      selected={
                        selectedPrivateService &&
                        ps.id === selectedPrivateService.id
                      }
                      onClick={this.props.goToPrivateService}
                    />
                  ))}
                </Paper>
              </List>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            {this.props.selectedPrivateService ? (
              <PrivateServiceDetail
                coaches={this.props.availableCoaches}
                onDelete={this.props.deletePrivateService}
                establishments={this.props.availableEstablishments}
                privateService={selectedPrivateService}
                createPrivateCoach={this.createPrivateCoach}
                deletePrivateCoach={this.deletePrivateCoach}
                createPrivateEstablishment={this.createPrivateEstablishment}
                deletePrivateEstablishment={this.deletePrivateEstablishment}
                deletePrivateSlot={this.props.deletePrivateSlot}
                createOrUpdatePrivateSlot={this.props.createOrUpdatePrivateSlot}
                onEdit={() =>
                  this.props.setOpenEditForm(selectedPrivateService)
                }
              />
            ) : null}
          </Grid>
          <Dialog
            fullScreen={this.props.fullScreen}
            open={!!this.props.openCreateForm}
          >
            <DialogTitle>{this.props.t('service.form.title')}</DialogTitle>
            <DialogContent>
              <PrivateServiceForm
                onSubmit={this.createOrUpdatePrivateService}
                onCancel={this.closeCreateForm}
                coaches={this.props.availableCoaches}
                establishments={this.props.availableEstablishments}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            fullScreen={this.props.fullScreen}
            open={!!this.props.openEditForm}
          >
            <DialogTitle>{this.props.t('service.form.title')}</DialogTitle>
            <DialogContent>
              <PrivateServiceForm
                onSubmit={this.createOrUpdatePrivateService}
                onCancel={this.closeEditForm}
                initial={this.props.openEditForm}
                coaches={this.props.availableCoaches}
                establishments={this.props.availableEstablishments}
              />
            </DialogContent>
          </Dialog>
          <Fab
            className={classes.addButton}
            variant="extended"
            color="primary"
            onClick={() => this.props.setOpenCreateForm(true)}
          >
            <AddIcon className={classes.leftIcon} />
            {t('service.form.createButton')}
          </Fab>
        </Grid>
      </div>
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
  withMobileDialog(),
  withStyles(styles),
  routerParamsToProps({ privateServiceId: 'privateServiceId:number' }),
  withNamespaces(['privateService']),
  withTitle(({ t }) => t('pageTitles.serviceList')),
  connect(
    (state) => ({
      privateServices: getAvailablePrivateServices(state),
      loading:
        state.privateService.privateService.loading ||
        state.establishment.loading ||
        state.coach.loading,
      allCoaches: getAllCoaches(state),
      allEstablishments: getAllEstablishmentsWithAssociatedId(state),
      availableCoaches: getActiveCoaches(state),
      availableEstablishments: getAllEstablishmentsWithAssociatedId(state),
    }),
    {
      fetchAllPrivateServices,
      fetchPrivateService,
      fetchAssociatedCoachesList,
      fetchEstablishments,
      fetchAssociatedEstablishments,
      createOrUpdatePrivateService,
      goToPrivateService: (id) => push(`/private-service/service/${id}/`),
      createPrivateCoach,
      deletePrivateCoach,
      createPrivateEstablishment,
      deletePrivateEstablishment,
      fetchPrivateSlotList,
      createOrUpdatePrivateSlot,
      deletePrivateSlot,
      deletePrivateService,
    },
  ),
  withState('openCreateForm', 'setOpenCreateForm', false),
  withState('openEditForm', 'setOpenEditForm', null),
  withProps(({ privateServiceId, privateServices }) => ({
    selectedPrivateService: privateServices.find(
      (ps) => ps.id === privateServiceId,
    ),
  })),
)(PrivateServiceList);
