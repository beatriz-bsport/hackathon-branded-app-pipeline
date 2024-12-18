import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { ObjectSearchForStorybook } from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { ObjectSearchProps } from '#src/libs/fuzzy-search/types';
import { Typography } from '@material-ui/core';
import MockObjectSearchWrapper from '#src/libs/fuzzy-search/components/MockObjectSearchWrapper';

const SearchTemplate: ComponentStory<typeof ObjectSearchForStorybook> = (
  props: ObjectSearchProps,
) => (
  <MockObjectSearchWrapper>
    <ObjectSearchForStorybook {...props} />
  </MockObjectSearchWrapper>
);

const multipleSearchTemplate: ComponentStory<any> = (props: {
  allProps: ObjectSearchProps[];
}) => {
  return (
    <MockObjectSearchWrapper>
      {props.allProps.map((prop) => (
        <>
          <Typography variant="h6">{prop.searchedObjectType}</Typography>
          <ObjectSearchForStorybook {...prop} />
        </>
      ))}
    </MockObjectSearchWrapper>
  );
};

const baseProps: ObjectSearchProps = {
  searchedObjectType: 'coupon',
};

const multipleProps: { allProps: ObjectSearchProps[] } = {
  allProps: [
    { searchedObjectType: 'coupon' },
    { searchedObjectType: 'coach_payment_rules' },
  ],
};

ObjectSearchForStorybook.displayName = 'ObjectSearch';

export const SingleObjectSearch = SearchTemplate.bind({});
SingleObjectSearch.args = baseProps;

export const MultiObjectSearch = SearchTemplate.bind({});
MultiObjectSearch.args = { ...baseProps, isMulti: true };

export const MultipleSearch = multipleSearchTemplate.bind({});
MultipleSearch.args = multipleProps;

const componentMeta: ComponentMeta<typeof ObjectSearchForStorybook> = {
  title: 'ObjectSearch',
  component: ObjectSearchForStorybook,
};

export default componentMeta;
