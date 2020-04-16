// @flow

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import React from 'react';

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

import PrivateServiceFormDialog from '../../libs/private-service/components/PrivateServiceFormDialog.component';
import { getAvailablePrivateServices } from '../../libs/private-service/selectors/private-service';
import { getAllEstablishmentsWithAssociatedId } from '../../libs/establishment/selectors';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import {
  fetchEstablishments,
  fetchAssociatedEstablishments,
} from '../../libs/establishment/actions';
import {
  fetchAllPrivateServices,
  fetchPrivateService,
  createOrUpdatePrivateService,
  deletePrivateService,
} from '../../libs/private-service/actions';
import type { PrivateService } from '../../libs/private-service/types';
import PrivateServiceListItem from '../../libs/private-service/components/PrivateServiceListItem.component';

type Props = {
  privateServices: Array<PrivateService>,
  fetchAllPrivateServices: () => void,
  createOrUpdatePrivateService: (
    data: *,
    options: { onSuccess: () => void },
  ) => void,
  goToPrivateService: (id: number) => void,
  deletePrivateService: (id: number) => void,
  fetchAssociatedCoachesList: () => void,
  fetchEstablishments: () => void,
  setOpenEditForm: (data: any) => void,
  selectedPrivateService: ?PrivateService,
  availableEstablishments: Array<Establishment>,
  openEditForm: any,
  availableCoaches: Array<AssociatedCoach>,
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
    this.props.fetchAssociatedCoachesList();
    this.props.fetchEstablishments();
    this.props.fetchAssociatedEstablishments();
  }

  closeForm = () => {
    this.props.setOpenEditForm(null);
    this.props.setOpenCreateForm(false);
  };

  createOrUpdatePrivateService = (data: *) => {
    this.props.createOrUpdatePrivateService(data, {
      onSuccess: (service) => {
        this.props.setOpenEditForm(null);
        this.props.setOpenCreateForm(false);
        this.props.fetchAllPrivateServices();
        this.props.goToPrivateService(service.id);
      },
    });
  };

  render() {
    const { classes, t, selectedPrivateService } = this.props;

    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        <Paper>
          {this.props.privateServices.map((ps) => (
            <PrivateServiceListItem
              key={ps.id}
              privateService={ps}
              selected={
                selectedPrivateService && ps.id === selectedPrivateService.id
              }
              onClick={this.props.goToPrivateService}
              onEdit={() => this.props.setOpenEditForm(ps)}
              onDelete={() => this.props.deletePrivateService(ps.id)}
            />
          ))}
        </Paper>
        {this.props.openEditForm || this.props.openCreateForm ? (
          <PrivateServiceFormDialog
            initial={this.props.openEditForm}
            open={this.props.openEditForm || this.props.openCreateForm}
            onCancel={this.closeForm}
            onSubmit={this.createOrUpdatePrivateService}
            coaches={this.props.availableCoaches}
            establishments={this.props.availableEstablishments}
          />
        ) : null}
        <Fab
          className={classes.addButton}
          variant="extended"
          color="primary"
          onClick={() => this.props.setOpenCreateForm(true)}
        >
          <AddIcon className={classes.leftIcon} />
          {t('service.form.createButton')}
        </Fab>
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
      goToPrivateService: (id) =>
        push(`/private-service/service/${id}/general`),
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
