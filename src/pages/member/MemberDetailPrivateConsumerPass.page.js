// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import omit from 'lodash/omit';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';
import { getInvoice } from '../../libs/invoice/selectors';
import PaginatedListStateful from '../../components/PaginatedListStateful.component';
import { getMember } from '../../libs/member/selectors';
import { fetchMember } from '../../libs/member/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  deletePrivateBooking,
  disablePrivateBooking as disablePrivateBookingAction,
  fetchPrivateConsumerPassList,
  fetchPrivateBookings,
  fetchPrivateConsumerPass,
  updatePrivateConsumerPassCredits,
  fetchPrivateConsumerPassExtensionList,
  createPrivateConsumerPassExtension,
  deletePrivateConsumerPassExtension,
} from '../../libs/private-service/actions';
import {
  getPrivateConsumerPassList,
  getPrivateConsumerPass,
} from '../../libs/private-service/selectors/private-consumer-pass';
import { getPrivateBookingListBase } from '../../libs/private-service/selectors/private-booking';
import PrivateConsumerPassBookerListItem from '../../libs/private-service/components/booking-module/PrivateConsumerPassBookerListItem.component';
import PrivateConsumerPassExtensionCreateDialog from '../../libs/private-service/components/consumer-pass/PrivateConsumerPassExtensionCreateDialog.component';
import PrivateConsumerPassDetail from '../../libs/private-service/components/consumer-pass/PrivateConsumerPassDetail.component';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction } from '../../libs/invoice/actions';
import PrivateConsumerPassFilters from '../../libs/private-service/components/pass/PrivateConsumerPassFilters.component';

type Props = {
  fetchPrivateConsumerPassList: (filters: any, params: any) => void,
  id: number,
  fetchMember: (id: number) => void,
  privateConsumerPassId: ?number,
  fetchPrivateBookings: (params: any) => void,
  fetchPrivateConsumerPassExtensionList: (
    privateConsumerPassId: number,
  ) => void,
  fetchInvoiceByInvoiceItem: (
    buyable_item_identifier: number,
    object_id: number,
  ) => void,
  privateConsumerPassInvoice: ?Invoice,
  onInvoiceClick: (uuid: string) => void,
  privateBookingsLoading: boolean,
  privateConsumerPassSelected: ?PrivateConsumerPass,
  setOpenCreateExtension: (boolean) => void,
  openCreateExtension: () => void,
  createExtension: (data: any) => void,
  private_consumer_pass_list: Array<PrivateConsumerPass>,
  privateConsumerPassExtensionList: Array<PrivateConsumerPassExtension>,
  private_booking_list: Array<PrivateBooking>,
  updatePrivateConsumerPassCredits: (...any) => void,

  deletePrivateConsumerPassExtension: (number, OptionCallback) => void,
  privateConsumerPassExtensionLoading: boolean,

  disablePrivateBooking: (
    id: number,
    data: any,
    options: {
      onSuccess?: (PrivateBooking) => void,
      onError?: (Error) => void,
    },
  ) => void,
  deletePrivateBooking: (
    id: number,
    data: any,
    options: {
      onSuccess?: (PrivateBooking) => void,
      onError?: (Error) => void,
    },
  ) => void,
  goToPrivateConsumerPass: (memberId: number, consumerPassId: number) => void,
  goToPrivateBooking: (memberId: number, privateBookingId: number) => void,
  fetchPrivateConsumerPass: (params: any) => void,

  filters: any,
  open: any,
  setOpenValue: (name: string) => void,
  setFilterValue: (name: string, bool: Boolean) => void,
};

export class MemberDetailPrivateConsumerPass extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateConsumerPassList({
      ...this.props.filters,
      member: this.props.id,
    });
    this.props.fetchMember(this.props.id);
    if (this.props.privateConsumerPassId) {
      this.fetchPrivateConsumerPassDetail();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filters !== this.props.filters) {
      this.props.fetchPrivateConsumerPassList({
        ...this.props.filters,
        member: this.props.id,
      });
      this.props.fetchMember(this.props.id);
    }
    if (
      this.props.privateConsumerPassId &&
      (!prevProps.privateConsumerPassId ||
        prevProps.privateConsumerPassId !== this.props.privateConsumerPassId)
    ) {
      this.fetchPrivateConsumerPassDetail();
    }
  }

  fetchPrivateConsumerPassDetail = () => {
    this.props.fetchPrivateBookings({
      private_consumer_pass: this.props.privateConsumerPassId,
    });
    this.props.fetchPrivateConsumerPassExtensionList(
      this.props.privateConsumerPassId,
    );
    this.props.fetchInvoiceByInvoiceItem(
      BUYABLE_ITEM_PRIVATE_PASS,
      this.props.privateConsumerPassId,
    );
  };

  render() {
    return (
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <PrivateConsumerPassFilters
              setOpenValue={this.props.setOpenValue}
              setFiltersValue={this.props.setFilterValue}
              open={this.props.open}
              filters={this.props.filters}
            />
            <Divider />
            <PaginatedListStateful
              itemPerPage={5}
              loading={this.props.privateBookingsLoading}
              listProps={{ disablePadding: true }}
              items={this.props.private_consumer_pass_list}
              renderItem={(pcp) => (
                <PrivateConsumerPassBookerListItem
                  divider
                  selected={this.props.privateConsumerPassId === pcp.id}
                  key={pcp.id}
                  private_consumer_pass={pcp}
                  onUpdateCredit={this.props.updatePrivateConsumerPassCredits}
                  onClick={() =>
                    this.props.goToPrivateConsumerPass(this.props.id, pcp.id)
                  }
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.props.privateConsumerPassId ? (
            <PrivateConsumerPassDetail
              private_booking_list={this.props.private_booking_list}
              privateBookingsLoading={this.props.privateBookingsLoading}
              private_consumer_pass={this.props.privateConsumerPassSelected}
              disablePrivateBooking={this.props.disablePrivateBooking}
              extensions={this.props.privateConsumerPassExtensionList}
              extensionsLoading={this.props.privateConsumerPassExtensionLoading}
              onCreateExtension={() => this.props.setOpenCreateExtension(true)}
              deletePrivateBooking={this.props.deletePrivateBooking}
              deleteConsumerPass={(id) => {
                this.props.deletePrivateConsumerPassExtension(id, {
                  onSuccess: () => {
                    this.props.fetchPrivateConsumerPass(
                      this.props.privateConsumerPassId,
                    );
                  },
                });
              }}
              fetchPrivateConsumerPass={this.props.fetchPrivateConsumerPass}
              invoice={this.props.privateConsumerPassInvoice}
              onInvoiceClick={this.props.onInvoiceClick}
              goToPrivateBooking={(privateBookingId) =>
                this.props.goToPrivateBooking(this.props.id, privateBookingId)
              }
            />
          ) : null}
        </Grid>
        <PrivateConsumerPassExtensionCreateDialog
          open={this.props.openCreateExtension}
          onClose={() => this.props.setOpenCreateExtension(false)}
          privateConsumerPass={this.props.privateConsumerPassSelected}
          onSubmit={(data) => {
            this.props.createExtension(
              {
                ...data,
                private_consumer_pass: this.props.privateConsumerPassId,
              },
              {
                onSuccess: () => {
                  this.props.fetchPrivateConsumerPass(
                    this.props.privateConsumerPassId,
                  );
                  this.props.setOpenCreateExtension(false);
                },
              },
            );
          }}
        />
      </Grid>
    );
  }
}

export default compose(
  routerParamsToProps({
    id: 'id:number',
    privateConsumerPassId: 'privateConsumerPassId:number',
  }),
  withState('relatedInvoice', 'setRelatedInvoice', null),
  withState('filters', 'setFilters', {}),
  withState('open', 'setOpen', {}),
  connect(
    (state, { id, privateConsumerPassId, relatedInvoice }) => ({
      member: getMember(state, id),
      private_consumer_pass_list: getPrivateConsumerPassList(state),
      private_booking_list: getPrivateBookingListBase(state),
      privateConsumerPassInvoice: getInvoice(state, relatedInvoice),
      privateConsumerPassExtensionList:
        state.privateService.privateConsumerPass.extension.items,
      privateConsumerPassExtensionLoading:
        state.privateService.privateConsumerPass.extension.loading,
      privateConsumerPassLoading:
        state.privateService.privateConsumerPass.loading,
      privateBookingsLoading: state.privateService.privateBooking.loading,
      privateConsumerPassSelected: getPrivateConsumerPass(
        state,
        privateConsumerPassId,
      ),
    }),
    {
      fetchPrivateConsumerPassList,
      fetchPrivateBookings,
      fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
      fetchPrivateConsumerPass,
      fetchPrivateConsumerPassExtensionList,
      updatePrivateConsumerPassCredits,
      deletePrivateConsumerPassExtension,
      deletePrivateBooking,
      disablePrivateBooking: disablePrivateBookingAction,
      createExtension: createPrivateConsumerPassExtension,
      fetchMember,
      onInvoiceClick: (uuid: string) => push(`/invoice/${uuid}`),
      goToPrivateBooking: (memberId, privateBookingId) =>
        push(`/member/${memberId}/private-booking/${privateBookingId}`),
      goToPrivateConsumerPass: (memberId, privateConsumerPassId) =>
        push(
          `/member/${memberId}/private-consumer-pass/${privateConsumerPassId}`,
        ),
    },
  ),
  withState('openCreateExtension', 'setOpenCreateExtension', false),
  withTranslation(['privateService']),
  withHandlers({
    fetchInvoiceByInvoiceItem: ({
      fetchInvoiceByInvoiceItem,
      setRelatedInvoice,
    }) => (uuid, stuff) => {
      fetchInvoiceByInvoiceItem(uuid, stuff, {
        onSuccess: (inv) => setRelatedInvoice(inv.uuid),
      });
    },
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
  }),
)(MemberDetailPrivateConsumerPass);
