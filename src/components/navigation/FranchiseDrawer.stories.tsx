import React from 'react';
import FranchiseDrawer from './FranchiseDrawer.component';
import { FranchiseTheme } from '../../libs/franchise/types';
import type { TempPasswordState } from '../../libs/login/types';
import FactoryBot from '../../libs/franchise/factories/FranchiseThemeFactory';

interface argTypes {
    children: React.ReactNode
    theme: FranchiseTheme,
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

const theme = FactoryBot.FranchiseTheme.createOne();

CompleteInitialState.args = {
    children: <div>Content</div>,
    theme: theme,
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
    title: 'Franchise/Navigation',
    component: FranchiseDrawer,
    parameters: {
        docs: {
            page: null
        }
    },
};