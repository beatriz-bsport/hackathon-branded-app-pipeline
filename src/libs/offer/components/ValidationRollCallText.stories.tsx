import React from 'react'

import { ValidationRollCallText, Props } from "./ValidationRollCallText.component";
const GenericValidationRollCallTextTemplate = (args: Props) => <ValidationRollCallText {...args} />;

export const NotValidatedRollCallText = GenericValidationRollCallTextTemplate.bind({});

NotValidatedRollCallText.args = {
    nbRollCallsLeftToValidate: 1,
};

export const ModifiedRollCallText = GenericValidationRollCallTextTemplate.bind({});

ModifiedRollCallText.args = {
    nbRollCallsLeftToValidate: 1,
    lastValidatedRollCallDate: "12/01/2001"
};

export const ValidatedRollCallText = GenericValidationRollCallTextTemplate.bind({});

ValidatedRollCallText.args = {
    nbRollCallsLeftToValidate: 0,
    lastValidatedRollCallDate: "12/01/2001"
};

export const NotValidatedListRollCallsText = GenericValidationRollCallTextTemplate.bind({});

NotValidatedListRollCallsText.args = {
    isSeveralRollCallsPage:true,
    nbRollCallsLeftToValidate:2
};

export const ValidatedListRollCallsText = GenericValidationRollCallTextTemplate.bind({});

ValidatedListRollCallsText.args = {
    nbRollCallsLeftToValidate: 0,
    isSeveralRollCallsPage:true
};

export default {
    title:'Offer/Components/RollCall/Text', 
    component:ValidationRollCallText,
    parameters: {
        docs: {
            page: null
        }
    }
};
