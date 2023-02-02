import React from 'react'
import { ValidationRollCallButton, Props } from "./ValidationRollCallButton.component";

const GenericValidationRollCallButtonTemplate = (args: Props) => <ValidationRollCallButton {...args} />;

export const NoNeedValidationRollCallButton = GenericValidationRollCallButtonTemplate.bind({});

NoNeedValidationRollCallButton.args = {
    nbRemainingRollCall:0
};

export const NeedValidationRollCallButton = GenericValidationRollCallButtonTemplate.bind({});

NeedValidationRollCallButton.args = {
    nbRemainingRollCall:1
};

export const NeedValidationsRollCallButton = GenericValidationRollCallButtonTemplate.bind({});

NeedValidationsRollCallButton.args = {
    nbRemainingRollCall:2
};

export const NoNeedValidationRollCallButtonOutlined = GenericValidationRollCallButtonTemplate.bind({});

NoNeedValidationRollCallButtonOutlined.args = {
    nbRemainingRollCall:0,
    outlined:true
};

export const NeedValidationRollCallButtonOutlined = GenericValidationRollCallButtonTemplate.bind({});

NeedValidationRollCallButtonOutlined.args = {
    nbRemainingRollCall:1,
    outlined:true
};

export const NeedValidationsRollCallButtonOutlined = GenericValidationRollCallButtonTemplate.bind({});

NeedValidationsRollCallButtonOutlined.args = {
    nbRemainingRollCall:2,
    outlined:true
};

export default {
    title:'Offer/Components/RollCall/Button', 
    component:ValidationRollCallButton,
    parameters: {
        docs: {
            page: null
        }
    }
};