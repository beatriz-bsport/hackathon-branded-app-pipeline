import React from 'react';
import NoShowChip, { Props } from './NoShowChip.component';

const NoShowChipTemplate = (args: Props) => <NoShowChip {...args} />;

export const SimpleNoShowChip = NoShowChipTemplate.bind({});


export const MessageNoShowChip = NoShowChipTemplate.bind({});

MessageNoShowChip.args = {
  tooltipMessage: "hello"
};

export const SmallNoShowChip = NoShowChipTemplate.bind({});

SmallNoShowChip.args = {
  tooltipMessage: "hello",
  small: true
};

export default {
    title:'Offer/Components/RollCall/NoShowChip', 
    component:NoShowChip,
    parameters: {
        docs: {
            page: null
        }
    }
};