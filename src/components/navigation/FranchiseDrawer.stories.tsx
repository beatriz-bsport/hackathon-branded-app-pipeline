import React from 'react';
import FranchiseDrawer from './FranchiseDrawer.component';
import type { TempPasswordState } from '../../libs/login/types';
import FactoryBot from '../../libs/franchise/factories/Franchise';
import { Theme } from '@material-ui/core';

interface argTypes {
    children: React.ReactNode
    theme: Theme,
    location: Location;
    tempPasswordState: TempPasswordState;
    disconnect: () => void;
    generateTempPassword: () => void;
    fetchTempPassword: () => void;
}

const CustomTemplate = (args: argTypes) => (
    <FranchiseDrawer {...args} />
);

export const CompleteInitialState = CustomTemplate.bind({});

const franchise = FactoryBot.Franchise.createOne();

CompleteInitialState.args = {
    children: <div>Content</div>,
    theme: {},
    title: 'Title',
    location: {
        pathname: '',
    },
    tempPasswordState: {},
    disconnect: () => {},
    generateTempPassword: () => {},
    fetchTempPassword: () => {},
};

export default {
    title: 'Pages/Franchise/Navigation',
    component: FranchiseDrawer,
    parameters: {
        docs: {
            page: null
        }
    },
};
