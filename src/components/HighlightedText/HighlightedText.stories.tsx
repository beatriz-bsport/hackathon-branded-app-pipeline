import faker from 'faker';
import React from 'react';
import HighlitedText, { OwnProps } from './HighlightedText.component';

const CustomTemplate = (args: OwnProps) => (
    <HighlitedText {...args} />
);

export const NoMatchState = CustomTemplate.bind({});

const text = faker.lorem.word(5);

NoMatchState.args = {
  text,
  highlight: '',
};

export const MatchState = CustomTemplate.bind({});

MatchState.args = {
  text,
  highlight: text.split(' ')[0],
};


export default {
    title: 'General/HighlitedText',
    component: HighlitedText,
    parameters: {
        docs: {
            page: null
        }
    },
};