import React from 'react';
import RollCallDrawer, { Props } from './RollCallDrawer.component';
import MembersFactory from '#src/libs/member/factories/Member';
import { BookingListFactory } from '../../booking/factories';
import { offerFactory } from '../factory';

const RollCallDrawerTemplate = (args: Props) => <RollCallDrawer {...args} />;

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const idList = Array.from(Array(5).keys()).map((item, index) =>
  randomInt(1000),
);

export const NotValidatedRollCallDrawer = RollCallDrawerTemplate.bind({});

NotValidatedRollCallDrawer.args = {
  open: true,
  offer: offerFactory(),
  members: MembersFactory(5, true, idList),
  bookings: BookingListFactory(5, idList),
  isLoading: false,
  isRollCallMandatory: true,
};

export const ModifiedRollCallDrawer = RollCallDrawerTemplate.bind({});

ModifiedRollCallDrawer.args = {
  open: true,
  offer: offerFactory(),
  members: MembersFactory(5, true, idList),
  bookings: BookingListFactory(5, idList),
  isLoading: false,
  isRollCallMandatory: true,
};

export const ValidatedRollCallDrawer = RollCallDrawerTemplate.bind({});

ValidatedRollCallDrawer.args = {
  open: true,
  offer: offerFactory(),
  members: MembersFactory(5, true, idList),
  bookings: BookingListFactory(5, idList),
  isLoading: false,
  isRollCallMandatory: true,
};

export default {
  title: 'Offer/Components/RollCall/Drawer',
  component: RollCallDrawer,
  parameters: {
    docs: {
      page: null,
    },
  },
};
