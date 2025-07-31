import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import QuicksaleInterfaceSearchBar from './QuicksaleInterfaceSearchBar.component';
import { isNotQuicksaleCardInfoList } from '#src/libs/quicksale/utils';

import type { QuicksaleCardInfo } from '#src/libs/quicksale/types';
import type { FuseOptions } from 'fuse.js';
import { action } from '@storybook/addon-actions';
import createQuicksaleCardInfo from '#src/libs/quicksale/factories/QuicksaleCardInfo';

const actionData = {
  onItemClick: action('onItemClick'),
  onSearchIconClick: action('onSearchIconClick'),
};

export default {
  title: 'Components/Quicksale/QuicksaleInterfaceSearchBar',
  component: QuicksaleInterfaceSearchBar,
  argTypes: {
    onItemClick: actionData.onItemClick,
    onSearchIconClick: actionData.onSearchIconClick,
  },
} as ComponentMeta<typeof QuicksaleInterfaceSearchBar>;

const Template: ComponentStory<typeof QuicksaleInterfaceSearchBar> = (args) => {
  const [searchText, setSearchText] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<QuicksaleCardInfo[]>(
    [],
  );

  const onSearchTextChange = React.useCallback(
    (fuse: Fuse<QuicksaleCardInfo, FuseOptions<QuicksaleCardInfo>>) =>
      (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchText(ev.target.value);
        const results = fuse.search(ev.target.value);
        if (isNotQuicksaleCardInfoList(results))
          setSearchResults(results.map((result) => result.item));
        else setSearchResults(results);
      },
    [],
  );

  const clearSearch = React.useCallback(() => {
    setSearchText('');
    setSearchResults([]);
  }, []);

  return (
    <QuicksaleInterfaceSearchBar
      {...args}
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchResults={searchResults}
      clearSearch={clearSearch}
      openPopper={searchText !== '' && searchResults.length > 0}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  searchItems: createQuicksaleCardInfo(20),
};
