import React from 'react'
import { RollCallState } from "../constants";
import { ValidationRollCallText, Props } from "./ValidationRollCallText.component";
const GenericValidationRollCallTextTemplate = (args: Props) => <ValidationRollCallText {...args} />;

export const NotValidatedRollCallText = GenericValidationRollCallTextTemplate.bind({});

NotValidatedRollCallText.args = {
    validationRollCallState:RollCallState.NOT_VALIDATED,
};

export const ModifiedRollCallText = GenericValidationRollCallTextTemplate.bind({});

ModifiedRollCallText.args = {
    validationRollCallState:RollCallState.MODIFIED,
    lastValidatedRollCallDate: "12/01/2001"
};

export const ValidatedRollCallText = GenericValidationRollCallTextTemplate.bind({});

ValidatedRollCallText.args = {
    validationRollCallState:RollCallState.VALIDATED,
    lastValidatedRollCallDate: "12/01/2001"
};

export const NotValidatedListRollCallsText = GenericValidationRollCallTextTemplate.bind({});

NotValidatedListRollCallsText.args = {
    validationRollCallState:RollCallState.NOT_VALIDATED,
    isSeveralRollCallsPage:true,
    nbRollCallsLeftToValidate:2
};

export const ValidatedListRollCallsText = GenericValidationRollCallTextTemplate.bind({});

ValidatedListRollCallsText.args = {
    validationRollCallState:RollCallState.VALIDATED,
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