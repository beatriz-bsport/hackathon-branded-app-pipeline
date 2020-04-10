// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import SlotSearcherForm from './SlotSearcherForm.component';
import SlotSearcherResult from './SlotSearcherResult.component';

type Props = {
  t: TFunction,
};
export const SlotSearcher = (props: Props) => {
  return (
    <div>
      <SlotSearcherForm
        bookable_slots={props.bookable_slots}
        private_services={props.private_services}
        searchAvailableSlots={props.searchAvailableSlots}
        onPrivateServiceChange={props.onPrivateServiceChange}
        onPrivateSlotChange={props.onPrivateSlotChange}
        onCoachChange={props.onCoachChange}
        onEstablishmentChange={props.onEstablishmentChange}
        onDateChange={() => {}}
      />
      <SlotSearcherResult
        bookable_slots={props.bookable_slots}
        loading={props.searchLoading}
        onDateClick={(...args) =>
          props.goToPrivateBookingPage(...args, this.props.companyId)
        }
      />
    </div>
  );
};

const styles = (theme) => ({
  container: {},
});

export default compose(
  withNamespaces(),
  withStyles(styles),
)(SlotSearcher);
