import React from 'react'
import { ValidationRollCallState } from "../constants";
import { ValidationRollCallText, Props } from "./ValidationRollCallText.component";
const GenericValidationRollCallTextTemplate = (args: Props) => <ValidationRollCallText {...args} />;

export const NotValidatedRollCallText = GenericValidationRollCallTextTemplate.bind({});

NotValidatedRollCallText.args = {
    validationRollCallState:ValidationRollCallState.NOT_VALIDATED,
};

export const ModifiedRollCallText = GenericValidationRollCallTextTemplate.bind({});

ModifiedRollCallText.args = {
    validationRollCallState:ValidationRollCallState.MODIFIED,
    lastValidatedRollCallDate: "12/01/2001"
};

export const ValidatedRollCallText = GenericValidationRollCallTextTemplate.bind({});

ValidatedRollCallText.args = {
    validationRollCallState:ValidationRollCallState.VALIDATED,
    lastValidatedRollCallDate: "12/01/2001"
};

export const NotValidatedSeveralRollCallText = GenericValidationRollCallTextTemplate.bind({});

NotValidatedSeveralRollCallText.args = {
    validationRollCallState:ValidationRollCallState.NOT_VALIDATED,
    severalRollCall:true,
    nbRemainingRollCall:2
};

export const ValidatedSeveralRollCallText = GenericValidationRollCallTextTemplate.bind({});

ValidatedSeveralRollCallText.args = {
    validationRollCallState:ValidationRollCallState.VALIDATED,
    severalRollCall:true
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