import React from 'react';
import {Props, ConfirmationRollCallDialog} from './ConfirmationRollCallDialog.component';
import { OptionCallback } from 'src/state/types';

const GenericConfirmationRollCallDialogTemplate = (args: Props)=> <ConfirmationRollCallDialog {...args}/>;

export const GenericConfirmationRollCallDialog = GenericConfirmationRollCallDialogTemplate.bind({});

GenericConfirmationRollCallDialog.args = {
    open:true,
    nbRollCallsLeftToValidate:1,
    onConfirm:(options?:OptionCallback)=>{console.log("hello");
    options?.onSuccess?.();    
    },
    isLoading:false
}

export const GenericListConfirmationRollCallsDialog = GenericConfirmationRollCallDialogTemplate.bind({});

GenericListConfirmationRollCallsDialog.args = {
    open:true,
    nbRollCallsLeftToValidate:2,
    onConfirm:(options?:OptionCallback)=>{console.log("hello");
    options?.onSuccess?.();    
    },
    isLoading:false
}

export const LoadingConfirmationRollCallDialog = GenericConfirmationRollCallDialogTemplate.bind({});

LoadingConfirmationRollCallDialog.args = {
    open:true,
    nbRollCallsLeftToValidate:1,
    onConfirm:(options?:OptionCallback)=>{console.log("hello");
    options?.onSuccess?.();
    },
    isLoading:true
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