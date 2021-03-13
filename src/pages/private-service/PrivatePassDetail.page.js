// @flow
import React, { Component } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
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
import { push as pushRouter } from 'connected-react-router';
import themeSelectors from '../../libs/theme/selectors';
import { snackbarSuccess } from '../../actions/snackbar.actions';

import withTitle from '../../hocs/with-title.hoc';
import {
  getPrivatePass,
  withServices,
  withAvailable,
  getCompatibilityPassWithService as getCompatibleServicePass,
} from '../../libs/private-service/selectors/private-pass';
import {
  getPrivateConsumerPassByPrivatePass,
  withMember,
} from '../../libs/private-service/selectors/private-consumer-pass';
import { getPrivateServices } from '../../libs/private-service/selectors/private-service';
import {
  fetchPrivatePassRetrieve,
  fetchByPrivatePass,
  fetchAllPrivateServices,
  createOrUpdatePrivatePass as createOrUpdatePrivatePassAction,
  deleteCompatibleServicePass,
  createCompatibleServicePass as createCompatibleServicePassAction,
  updateCompatibleServicePass,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAction,
  fetchAllPrivateSlots,
  deletePrivatePass as deletePrivatePassAction,
  updatePrivateConsumerPassCredits as updatePrivatePassCredit,
  resetByPrivatePass as resetByPrivatePassAction,
  updatePrivateConsumerPassCredits,
} from '../../libs/private-service/actions';
import { fetchFilteredMembers as fetchFilteredMembersActions } from '../../libs/member/actions';
import PrivatePassDetail from '../../libs/private-service/components/pass/PrivatePassDetail.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PaginatedConsumerPrivatePass from '../../libs/private-service/components/pass/PaginatedConsumerPrivatePass.component';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import type {
  privateConsumerPass,
  ServiceCompatibilityPass,
} from '../../libs/private-service/types';
import PrivatePassForm from '../../libs/private-service/components/pass/PrivatePassForm.component';
import PrivateConsumerPassFilters from '../../libs/private-service/components/pass/PrivateConsumerPassFilters.component';

type Props = {
  t: TFunction,
  setOpenEditForm: (boolean) => void,
  openEditForm: boolean,
  fetchPrivatePass: (id: number) => void,
  fetchAllPrivateServices: () => void,
  privatePass: PrivatePass,
  private_services: Array<PrivateService>,
  theme: Theme,
  deleteCompatibleServicePass: (id: number) => void,
  createCompatibleServicePass: (any) => void,
  compatibleServicePass: Array<ServiceCompatibilityPass>,
  fetchCompatibleServicePasses: () => void,
  updateCompatibleServicePass: (
    passId: number,
    serviceId: number,
    data: any,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  createOrUpdatePrivatePass: (
    data: any,
    id: ?number,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,
  setOpenDeletePassDialog: (id: number) => void,
  snackbarSuccess: (string) => void,
  openDeletePassDialog: number,
  deletePrivatePass: (id: number) => void,
  id: Number,
  classes: Object,

  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  goToConsumerPrivatePassDetail: (memberId: number, passId: number) => void,
  onSubmit: (data) => void,

  consumerPass: {
    items: Array<privateConsumerPass>,
    count: number,
    loading: boolean,
    page: number,
    updating: Array<number>,
  },
  resetConsumerPrivatePass: () => void,

  fetchConsumerPrivatePassWithMember: (
    page: number,
    pageSize: number,
    options: OptionCallback,
  ) => void,
  updatePrivateConsumerPassCredits: (...any) => void,

  filters: any,
  open: any,
  setOpenValue: (name: string) => void,
  setFilterValue: (name: string, bool: Boolean) => void,
};

const CONSUMER_PrivatePass_PAGINATION_SIZE = 7;

export class PrivatePassDetails extends Component<Props, State> {
  componentWillMount() {
    this.props.resetConsumerPrivatePass();
  }

  componentDidMount() {
    this.props.fetchAllPrivateServices();
    this.props.fetchPrivatePass(this.props.id);
    this.props.fetchCompatibleServicePasses();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filters !== this.props.filters) {
      this.props.fetchConsumerPrivatePassWithMember(
        1,
        CONSUMER_PrivatePass_PAGINATION_SIZE,
      );
    }
  }

  checkExcludedSlotAvailable = () => {
    if (this.props.compatibleServicePass) {
      return !!this.props.compatibleServicePass.filter(
        (c) => c.excluded_slot_ids,
      ).length;
    }
    return false;
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
            updateCompatibleServicePass={this.props.updateCompatibleServicePass}
            compatibleServicePass={
              this.checkExcludedSlotAvailable()
                ? this.props.compatibleServicePass
                : null
            }
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
      </Grid>
    );
  }
}

const styles = (theme) => ({
  emptyContainer: {
    padding: theme.spacing(2),
  },
  privatePassDetail: {
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing(4),
    },
  },
});

// ajouter des HOC
export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(['privateService']),
  withStyles(styles),
  withState('filters', 'setFilters', {}),
  withState('open', 'setOpen', {}),
  withState('openDeletePassDialog', 'setOpenDeletePassDialog', null),
  withState('openEditForm', 'setOpenEditForm', false),
  connect(
    (state, { id }) => ({
      privatePass: withAvailable(withServices(getPrivatePass))(state, id),
      private_services: getPrivateServices(state),
      compatibleServicePass: getCompatibleServicePass(state),
      theme: themeSelectors.getTheme(state),
      consumerPass: {
        items: withMember(getPrivateConsumerPassByPrivatePass)(state),
        count: state.privateService.privateConsumerPass.byPrivatePass.count,
        loading: state.privateService.privateConsumerPass.byPrivatePass.loading,
        page: state.privateService.privateConsumerPass.byPrivatePass.page,
        updating: state.privateService.privateConsumerPass.updatingConsumerPass,
      },
    }),
    {
      fetchPrivatePass: fetchPrivatePassRetrieve,
      fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
      createOrUpdatePrivatePass: createOrUpdatePrivatePassAction,
      createCompatibleServicePass: createCompatibleServicePassAction,
      deleteCompatibleServicePass,
      updateCompatibleServicePass,
      fetchCompatibleServicePassList: fetchCompatibleServicePassListAction,
      fetchPrivateSlotsByService: fetchAllPrivateSlots,
      updatePrivateConsumerPassCredits,
      deletePrivatePass: deletePrivatePassAction,
      snackbarSuccess,
      incrementCredit: (consumerPassId) =>
        updatePrivatePassCredit(consumerPassId, 1),
      decrementCredit: (consumerPassId) =>
        updatePrivatePassCredit(consumerPassId, -1),
      goToConsumerPrivatePassDetail: (memberId, passId) =>
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
    },
  ),
  withTitle(
    ({ t, privatePass }) =>
      (privatePass && privatePass.name) || t('pageTitles.passList'),
  ),
  withHandlers({
    setOpenValue: ({ setOpen, open }) => (name: string) => {
      setOpen({
        ...open,
        [name]: !open[name],
      });
    },
    setFilterValue: ({ setFilters, filters }) => (name: string, value) => {
      if (value === null) {
        setFilters(omit(filters, name));
      } else {
        setFilters({
          ...filters,
          [name]: value,
        });
      }
    },
    deletePrivatePass: ({
      deletePrivatePass,
      setOpenDeletePassDialog,
      goToPrivatePassList,
    }) => (pass) => {
      deletePrivatePass(pass, {
        onSuccess: () => {
          setOpenDeletePassDialog(null);
          goToPrivatePassList();
        },
      });
    },
    onSubmit: ({ createOrUpdatePrivatePass, setOpenEditForm, id }) => (data) =>
      createOrUpdatePrivatePass(data, id, {
        onSuccess: () => {
          setOpenEditForm(false);
        },
      }),
    fetchConsumerPrivatePassWithMember: ({
      id,
      fetchConsumerPrivatePass,
      fetchFilteredMembers,
      filters,
    }) => (page: number, pageSize: number) =>
      fetchConsumerPrivatePass(id, page, pageSize, filters, {
        onSuccess: (cpps) =>
          fetchFilteredMembers({
            id__in: cpps.map((b) => b.member),
          }),
      }),
    createCompatibleServicePass: ({
      createCompatibleServicePass,
      fetchPrivateSlotsByService,
      fetchCompatibleServicePassList,
    }) => (passId: number, serviceId: number) =>
      createCompatibleServicePass(passId, serviceId, {
        onSuccess: () => {
          fetchPrivateSlotsByService({ private_service: serviceId });
          fetchCompatibleServicePassList(passId);
        },
      }),
    fetchCompatibleServicePasses: ({
      id,
      fetchCompatibleServicePassList,
      fetchPrivateSlotsByService,
    }) => () =>
      fetchCompatibleServicePassList(id, {
        onSuccess: (csps) =>
          fetchPrivateSlotsByService({
            private_service__in: csps.map((c) => c.private_service),
          }),
      }),
  }),
)(PrivatePassDetails);
