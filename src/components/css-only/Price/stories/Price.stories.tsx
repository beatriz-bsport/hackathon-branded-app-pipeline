import React from 'react';

import Price, { Props } from '../';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import './stories.styles.css'

const PriceTemplate = (args: Props) => (
    <Price {...args} />
);

const PriceWithIconTemplate = (args: Props) => (
    <Price {...args}>
        <div className='icon'>
            <ShoppingCartIcon fontSize='small'/>
        </div>
    </Price>
);

const defaultArgs = {
    amount : "250.50"
}

export const JustPrice = PriceTemplate.bind({});
JustPrice.args = defaultArgs

export const PriceWithIcon = PriceWithIconTemplate.bind({})
PriceWithIcon.args = defaultArgs

export default {
    title: 'Components/CssOnly/Price',
    component: Price,
    parameters: {
        docs: {
            page: null,
        },
    },
};
