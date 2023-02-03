import React from 'react';
import {Props, ConfirmationRollCallDialog} from './ConfirmationRollCallDialog.component';
import { OptionCallback } from 'src/state/types';

const GenericConfirmationRollCallDialogTemplate = (args: Props)=> <ConfirmationRollCallDialog {...args}/>;

export const GenericConfirmationRollCallDialog = GenericConfirmationRollCallDialogTemplate.bind({});

GenericConfirmationRollCallDialog.args = {
    open:true,
    nbRemainingRollCall:1,
    initialValidatedRollCall:false,
    onConfirm:(options?:OptionCallback)=>{console.log("hello");
    options?.onSuccess?.();    
    },
    isLoading:false
}

export const GenericSeveralConfirmationRollCallDialog = GenericConfirmationRollCallDialogTemplate.bind({});

GenericSeveralConfirmationRollCallDialog.args = {
    open:true,
    nbRemainingRollCall:2,
    initialValidatedRollCall:false,
    onConfirm:(options?:OptionCallback)=>{console.log("hello");
    options?.onSuccess?.();    
    },
    isLoading:false
}

export const LoadingConfirmationRollCallDialog = GenericConfirmationRollCallDialogTemplate.bind({});

LoadingConfirmationRollCallDialog.args = {
    open:true,
    nbRemainingRollCall:1,
    initialValidatedRollCall:false,
    onConfirm:(options?:OptionCallback)=>{console.log("hello");
    options?.onSuccess?.();
    },
    isLoading:true
}

export const ValidatedConfirmationRollCallDialog = GenericConfirmationRollCallDialogTemplate.bind({});

ValidatedConfirmationRollCallDialog.args = {
    open:true,
    nbRemainingRollCall:1,
    initialValidatedRollCall:true,
    onConfirm:()=>{console.log("hello");},
    isLoading:false
}
export default {
    title:'Offer/Components/RollCall/Dialog', 
    component:ConfirmationRollCallDialog,
    parameters: {
        docs: {
            page: null
        }
    }
};