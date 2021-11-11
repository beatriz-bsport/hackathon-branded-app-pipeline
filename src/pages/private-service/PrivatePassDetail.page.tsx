// @flow
import React, { Component } from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import omit from 'lodash/omit';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { CircularProgress, Theme, Typography } from '@material-ui/core';
import { push as pushRouter } from 'connected-react-router';
import themeSelectors from '../../libs/theme/selectors';
import { snackbarSuccess } from '../../libs/snackbar/actions';

import withTitle from '../../hocs/with-title.hoc';
import {
  getPrivatePass,
  withServices,
  withAvailable,
} from '../../libs/private-service/selectors/private-pass';
import {
  getPrivateConsumerPassByPrivatePass,
  getPrivateConsumerPassMassExtension,
  withMember,
} from '../../libs/private-service/selectors/private-consumer-pass';
import { getPrivateServices } from '../../libs/private-service/selectors/private-service';
import {
  fetchPrivatePassRetrieve,
  fetchByPrivatePass,
  fetchAllPrivateServices,
  createOrUpdatePrivatePass as createOrUpdatePrivatePassAction,
  deleteCompatibleServicePass,
  createCompatibleServicePass,
  deletePrivatePass as deletePrivatePassAction,
  updatePrivateConsumerPassCredits as updatePrivatePassCredit,
  resetByPrivatePass as resetByPrivatePassAction,
  updatePrivateConsumerPassCredits,
  fetchPrivatePassMassExtensionList,
  createPrivatePassMassExtension,
  deletePrivatePassMassExtension,
} from '../../libs/private-service/actions';
import { fetchFilteredMembers as fetchFilteredMembersActions } from '../../libs/member/actions';
import PrivatePassDetail from '../../libs/private-service/components/pass/PrivatePassDetail.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PaginatedConsumerPrivatePass from '../../libs/private-service/components/pass/PaginatedConsumerPrivatePass.component';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import PrivatePassForm from '../../libs/private-service/components/pass/PrivatePassForm.component';
import PrivateConsumerPassFilters from '../../libs/private-service/components/pass/PrivateConsumerPassFilters.component';
import PrivatePassMassExtensionList from '../../libs/private-service/components/consumer-pass/PrivatePassMassExtensionList.component';
import { RootState } from '../../reducers';
import { OptionCallback } from '../../state/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import PaymentPackMassExtensionDialog from '../../libs/payment-packs/components/PaymentPackMassExtensionDialog.component';
import { PrivateConsumerPassMassExtension } from '../../libs/private-service/types';

type OwnProps = {
  id: number;
};

type ConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type WithStateProps = ConnectedProps & StateHandlerType;

type Props = WithStateProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

const CONSUMER_PrivatePass_PAGINATION_SIZE = 7;
const MASS_EXTENSION_PAGINATION_SIZE = 5;

export class PrivatePassDetails extends Component<Props> {
  componentWillMount() {
    this.props.resetConsumerPrivatePass();
  }

  componentDidMount() {
    this.props.fetchPrivatePass(this.props.id);
    this.props.fetchAllPrivateServices();

    this.props.fetchPrivatePassMassExtensionList({
      privatePass: this.props.id,
      page: 1,
      page_size: MASS_EXTENSION_PAGINATION_SIZE,
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filters !== this.props.filters) {
      this.props.fetchConsumerPrivatePassWithMember(
        1,
        CONSUMER_PrivatePass_PAGINATION_SIZE,
      );
    }
  }

  createMassExtension = (data: {
    minDate: string;
    maxDate: string;
    nbDays: number;
    note: string;
  }) => {
    const { minDate, maxDate, nbDays, note } = data;

    this.props.setLoadingMassExtension(true);
    this.props.createPrivatePassMassExtension(
      {
        private_pass: this.props.id,
        min_ending_date: minDate,
        max_ending_date: maxDate,
        nb_days: nbDays,
        note,
      },
      {
        onSuccess: () => {
          this.props.setLoadingMassExtension(false);
          this.props.fetchPrivatePassMassExtensionList({
            privatePass: this.props.id,
            page: 1,
            page_size: MASS_EXTENSION_PAGINATION_SIZE,
          });
        },
      },
    );

    this.props.setOpenMassExtensionDialog(false);
  };

  onDeleteMassExtension = (massExtension: PrivateConsumerPassMassExtension) => {
    this.props.deletePrivatePassMassExtension(massExtension.id, {
      onSuccess: () => {
        this.props.fetchPrivatePassMassExtensionList({
          privatePass: this.props.id,
          page: 1,
          page_size: MASS_EXTENSION_PAGINATION_SIZE,
        });
      },
    });
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6} className={classes.privatePassDetail}>
          <PrivatePassDetail
            private_services={this.props.private_services}
            theme={this.props.theme}
            snackbarSuccess={this.props.snackbarSuccess}
            updatePrivatePass={this.props.createOrUpdatePrivatePass}
            onDelete={() => this.props.setOpenDeletePassDialog(this.props.id)}
            deleteCompatibleServicePass={this.props.deleteCompatibleServicePass}
            createCompatibleServicePass={this.props.createCompatibleServicePass}
            pass={this.props.privatePass}
          />
        </Grid>
        <BottomActionsButton
          onEdit={() => this.props.setOpenEditForm(true)}
          onDelete={() => this.props.setOpenDeletePassDialog(this.props.id)}
        />
        <Grid item xs={12} md={6}>
          <Paper>
            <PrivateConsumerPassFilters
              setOpenValue={this.props.setOpenValue}
              setFiltersValue={this.props.setFilterValue}
              open={this.props.open}
              filters={this.props.filters}
            />
            <Divider />
            <PaginatedConsumerPrivatePass
              privatePass={this.props.privatePass}
              incrementCredit={this.props.incrementCredit}
              decrementCredit={this.props.decrementCredit}
              items={this.props.consumerPass.items}
              updatePrivateConsumerPassCredits={
                this.props.updatePrivateConsumerPassCredits
              }
              nbItems={this.props.consumerPass.count}
              onClick={(cpp) => {
                this.props.goToConsumerPrivatePassDetail(cpp.member.id, cpp.id);
              }}
              loading={this.props.consumerPass.loading}
              page={this.props.consumerPass.page}
              consumerPrivatePassUpdating={this.props.consumerPass.updating}
              itemPerPage={CONSUMER_PrivatePass_PAGINATION_SIZE}
              onPageRequested={(page: number, pageSize: number) =>
                this.props.fetchConsumerPrivatePassWithMember(page, pageSize)
              }
            />
          </Paper>

          <div className={classes.massExtensionContainer}>
            {!!(
              this.props.massExtension.items &&
              this.props.massExtension.items.length
            ) && (
              <React.Fragment>
                <Typography variant="h5">
                  {this.props.t('paymentPack:section.massExtension')}
                </Typography>
                <Divider className={this.props.classes.divider} />
                <PrivatePassMassExtensionList
                  items={this.props.massExtension.items}
                  nbItems={this.props.massExtension.count}
                  firstLoadDone={this.props.massExtension.firstLoadDone}
                  loading={this.props.massExtension.loading}
                  page={this.props.massExtension.page}
                  itemPerPage={MASS_EXTENSION_PAGINATION_SIZE}
                  onPageRequested={(page, page_size) => {
                    this.props.fetchPrivatePassMassExtensionList({
                      privatePass: this.props.id,
                      page,
                      page_size,
                    });
                  }}
                  onDelete={this.onDeleteMassExtension}
                />
              </React.Fragment>
            )}
            <div className={classes.buttonContainerCenter}>
              {this.props.loadingMassExtension ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => this.props.setOpenMassExtensionDialog(true)}
                >
                  {this.props.t('paymentPack:massExtension.title')}
                </Button>
              )}
            </div>
          </div>
        </Grid>
        <Dialog open={this.props.openEditForm}>
          <DialogTitle>{this.props.t('privatePass.form.title')}</DialogTitle>
          <DialogContent>
            <PrivatePassForm
              initial={this.props.privatePass}
              onSubmit={(data) => this.props.onSubmit(data)}
              onCancel={() => this.props.setOpenEditForm(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={this.props.openDeletePassDialog}>
          <DialogTitle>{t('privatePass.delete.title')}</DialogTitle>
          <DialogContent>{t('privatePass.delete.explain')}</DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.setOpenDeletePassDialog(null)}>
              {t('privatePass.delete.cancel')}
            </Button>
            <Button
              onClick={() => {
                this.props.deletePrivatePass(this.props.openDeletePassDialog);
              }}
            >
              {t('privatePass.delete.submit')}
            </Button>
          </DialogActions>
        </Dialog>

        <PaymentPackMassExtensionDialog
          open={this.props.openMassExtensionDialog}
          onClose={() => this.props.setOpenMassExtensionDialog(false)}
          onSubmit={this.createMassExtension}
        />
      </Grid>
    );
  }
}

const styles = (theme: Theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
  },
  privatePassDetail: {
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing(4),
    },
  },
  massExtensionContainer: {
    paddingTop: theme.spacing(2),
  },
  buttonContainerCenter: {
    paddingTop: theme.spacing(2),
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState, { id }: { id: number }) => ({
  privatePass: withAvailable(withServices(getPrivatePass))(state, id),
  private_services: getPrivateServices(state),
  theme: themeSelectors.getTheme(state),
  consumerPass: {
    items: withMember(getPrivateConsumerPassByPrivatePass)(state),
    count: state.privateService.privateConsumerPass.byPrivatePass.count,
    loading: state.privateService.privateConsumerPass.byPrivatePass.loading,
    page: state.privateService.privateConsumerPass.byPrivatePass.page,
    updating: state.privateService.privateConsumerPass.updatingConsumerPass,
  },
  massExtension: {
    items: getPrivateConsumerPassMassExtension(state),
    count: state.privateService.privateConsumerPass.massExtension.count,
    loading: state.privateService.privateConsumerPass.massExtension.loading,
    firstLoadDone:
      state.privateService.privateConsumerPass.massExtension.firstLoadDone,
    page: state.privateService.privateConsumerPass.massExtension.page,
  },
});

const mapDispatchToProps = {
  fetchPrivatePass: fetchPrivatePassRetrieve,
  fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
  createOrUpdatePrivatePass: createOrUpdatePrivatePassAction,
  createCompatibleServicePass,
  deleteCompatibleServicePass,
  updatePrivateConsumerPassCredits,
  deletePrivatePass: deletePrivatePassAction,
  snackbarSuccess,
  incrementCredit: (consumerPassId: number) =>
    updatePrivatePassCredit(consumerPassId, 1),
  decrementCredit: (consumerPassId: number) =>
    updatePrivatePassCredit(consumerPassId, -1),
  goToConsumerPrivatePassDetail: (memberId: number, passId: number) =>
    pushRouter(`/member/${memberId}/private-consumer-pass/${passId}`),
  fetchConsumerPrivatePass: (
    privatePassId: number,
    page: number,
    pageSize: number,
    filters: any,
    options: OptionCallback,
  ) => fetchByPrivatePass(privatePassId, page, pageSize, options, filters),
  fetchFilteredMembers: fetchFilteredMembersActions,
  resetConsumerPrivatePass: resetByPrivatePassAction,
  goToPrivatePassList: () => pushRouter('/private-service/pass/'),
  fetchPrivatePassMassExtensionList,
  createPrivatePassMassExtension,
  deletePrivatePassMassExtension,
};

const mapWithHandlers = {
  setOpenValue: (props: WithStateProps) => (name: string) => {
    props.setOpen({
      ...props.open,
      [name]: !props.open[name],
    });
  },
  setFilterValue: (props: WithStateProps) => (name: string, value: any) => {
    if (value === null) {
      props.setFilters(omit(props.filters, name));
    } else {
      props.setFilters({
        ...props.filters,
        [name]: value,
      });
    }
  },
  deletePrivatePass: (props: WithStateProps) => (pass: number) => {
    props.deletePrivatePass(pass, {
      onSuccess: () => {
        props.setOpenDeletePassDialog(null);
        props.goToPrivatePassList();
      },
    });
  },
  onSubmit: (props: WithStateProps) => (data: any) =>
    props.createOrUpdatePrivatePass(data, props.id, {
      onSuccess: () => {
        props.setOpenEditForm(false);
      },
    }),
  fetchConsumerPrivatePassWithMember:
    (props: WithStateProps) => (page: number, pageSize: number) =>
      props.fetchConsumerPrivatePass(props.id, page, pageSize, props.filters, {
        onSuccess: (cpps) =>
          props.fetchFilteredMembers({
            id__in: cpps.map((b) => b.member),
          }),
      }),
};

type StateHandlerInit = {
  filters: any;
  open: any;
  openDeletePassDialog: number | null;
  openEditForm: boolean;
  openMassExtensionDialog: boolean;
  loadingMassExtension: boolean;
};

const withStateHandlersInit: StateHandlerInit = {
  filters: {},
  open: {},
  openDeletePassDialog: null,
  openEditForm: false,
  openMassExtensionDialog: false,
  loadingMassExtension: false,
};

const withStateHandlersSetter = {
  setFilters: () => (filters: any) => {
    return { filters };
  },
  setOpen: () => (open: boolean) => {
    return { open };
  },
  setOpenDeletePassDialog: () => (openDeletePassDialog: number | null) => {
    return { openDeletePassDialog };
  },
  setOpenEditForm: () => (openEditForm: boolean) => {
    return { openEditForm };
  },
  setOpenMassExtensionDialog: () => (openMassExtensionDialog: boolean) => {
    return { openMassExtensionDialog };
  },
  setLoadingMassExtension: () => (loadingMassExtension: boolean) => {
    return { loadingMassExtension };
  },
};

// ajouter des HOC
export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(['privateService']),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withTitle(
    ({ t, privatePass }: Props) =>
      (privatePass && privatePass.name) || t('pageTitles.passList'),
  ),
  withHandlers(mapWithHandlers),
)(PrivatePassDetails);
