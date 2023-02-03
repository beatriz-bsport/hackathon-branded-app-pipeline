import React from 'react';
import RollCallChip, {Props} from './RollCallChip.component';

const RollCallChipTemplate = (args: Props) => <RollCallChip {...args} />;

export const NotValidatedRollCallChip = RollCallChipTemplate.bind({});

NotValidatedRollCallChip.args = {
    isValidated:false
};

export const ValidatedRollCallChip = RollCallChipTemplate.bind({});

ValidatedRollCallChip.args = {
    isValidated:true
};

export default {
    title:'Offer/Components/RollCall/Chip', 
    component:RollCallChip,
    parameters: {
        docs: {
            page: null
        }
    }
};