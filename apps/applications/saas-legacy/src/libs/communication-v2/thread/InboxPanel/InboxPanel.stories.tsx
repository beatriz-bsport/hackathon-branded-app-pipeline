import React, { useState } from 'react';

import InboxPanel, { Props } from './InboxPanel.component';
import { MemberFactory } from '#src/libs/member/factories/Member';
import { smartlistFactory } from '#src/libs/smart-list/factories';
import { generateRandomInt } from '../../../../utils/factories';
import FactoryBotTag from '../../../tag/factory';
import { FILTERS_ROOTS } from '@bsport/common/lib/master-data/smart-list.js';
import { offerFactory } from '#src/libs/offer/factory';
import { BookingListFactory } from '#src/libs/booking/factories';
import {
  MemberThread,
  OfferThread,
  SmartListThread,
} from '#src/libs/communication-v2/factories/CommunicationThread';

// --- Member Props ---
const memberProps = MemberFactory({ number_tags: 3 }, false);

// Tags
const randomIncludedTagsForSmartlist = FactoryBotTag.Tag.create(5);
const randomExcludedTagsForSmartlist = FactoryBotTag.Tag.create(5);

// Filters
const filter_list: number[] = Object.keys(FILTERS_ROOTS).map((filter) =>
  parseInt(filter),
);
const filters = [...filter_list].sort(() => 0.5 - Math.random());
const randomSmartlistFilters = filters.slice(0, generateRandomInt(5));

// --- Offer Props ---

const offer = offerFactory();
const effectif = offer.effectif;
const idList = Array.from(Array(effectif).keys()).map((_item, _index) =>
  generateRandomInt(1000),
);
const bookings = BookingListFactory(generateRandomInt(effectif), idList);

const CustomTemplate = (args: Props) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <InboxPanel
      isPanelOpen={isPanelOpen}
      setIsPanelOpen={setIsPanelOpen}
      {...args}
    />
  );
};

export const MemberPanel = CustomTemplate.bind({});
MemberPanel.args = {
  thread: MemberThread(),
  member: MemberFactory({ number_tags: 3 }, false),
  goToMemberPage: () => {},
  unpaidInvoicesCount: 3,
  tags: memberProps.tags,
};

export const SmartlistPanel = CustomTemplate.bind({});
SmartlistPanel.args = {
  thread: SmartListThread(),
  smartlist: smartlistFactory(),
  memberInSmartlistCount: generateRandomInt(1000),
  filtersSmartlist: randomSmartlistFilters,
  includedTagsForSmartlist: randomIncludedTagsForSmartlist,
  excludedTagsForSmartlist: randomExcludedTagsForSmartlist,
  goToSmartlistPage: () => {},
};

export const OfferPanel = CustomTemplate.bind({});
OfferPanel.args = {
  thread: OfferThread(),
  offer,
  bookings,
  goToOfferPage: () => {},
};

export default {
  title: 'Library/Communication-V2/InboxPanel',
  component: InboxPanel,
  parameters: {
    docs: {
      page: null,
    },
  },
};
