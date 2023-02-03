import React from 'react';
import RollCallDrawer, { Props } from './RollCallDrawer.component';
import MembersFactory from '#libs/member/factories/Member';
import { BookingListFactory } from "../../booking/factories"
import { RollCallState } from '../constants';

const RollCallDrawerTemplate = (args:Props) => <RollCallDrawer {...args}/>

function randomInt(max: number) {
    return Math.floor(Math.random() * max);
}

const idList = Array.from(Array(5).keys()).map((item, index) => (
    randomInt(1000)
));

export const NotValidatedRollCallDrawer = RollCallDrawerTemplate.bind({});

NotValidatedRollCallDrawer.args = {
    open: true,
    offerName: 'Yoga',
    date: '02/17/2023 12:48',
    members: MembersFactory(5,true, idList), 
    bookings: BookingListFactory(5, idList),
    validationRollCallState: RollCallState.NOT_VALIDATED,
    isLoading: false
};

export const ValidatedRollCallDrawer = RollCallDrawerTemplate.bind({});

ValidatedRollCallDrawer.args = {
    open: true,
    offerName: 'Yoga',
    date: '02/17/2023 12:48',
    members: MembersFactory(5,true, idList), 
    bookings: BookingListFactory(5, idList),
    validationRollCallState: RollCallState.VALIDATED,
    isLoading: false
};


export default {
    title: 'Offer/Components/RollCall/Drawer', 
    component: RollCallDrawer,
    parameters: {
        docs: {
            page: null
        }
    }
};