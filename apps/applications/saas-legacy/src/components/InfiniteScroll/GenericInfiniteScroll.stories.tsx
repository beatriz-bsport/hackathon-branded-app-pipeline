import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import GenericInfiniteScroll from './GenericInfiniteScroll.component';
import CircularProgress from '@material-ui/core/CircularProgress';

export default {
  title: 'Components/InfiniteScroll/InfiniteScroll',
  component: GenericInfiniteScroll,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Story to demonstrate the infinite scroll behavior.',
    },
  },
  argTypes: {
    endMessage: {
      control: 'object',
      description:
        'React element to render when all items are already displayed.',
    },
    height: {
      control: { type: 'number', step: 50 },
      description: 'Height of the infinite scroll element.',
    },
    loader: {
      control: 'object',
      description: 'React element to render during the loading of new items.',
    },
    loadingTime: {
      control: { type: 'range', min: 0, max: 10, step: 1 },
      description:
        'Duration for simulating a mock API request to fetch fresh items in seconds.',
    },
    pagination: {
      control: { type: 'range', min: 10, max: 100, step: 10 },
      description: 'Quantity of items retrieved at once.',
    },
    title: {
      control: 'text',
      description: 'Title of the story',
    },
    total: {
      control: 'number',
      description: 'Total number of items to retrieve.',
    },
    loadingRate: {
      control: { type: 'range', min: 10, max: 100, step: 10 },
      description:
        '[Optional] Default : 80%. Indicates that the next items will load when the user scrolls below 80% of the total height.',
    },
    isPullDownToRefreshActive: {
      control: 'boolean',
      description:
        '[Optional] Indicates whether Pull Down to Refresh feature is enabled.',
    },
    useScrollableTarget: {
      control: 'boolean',
      description:
        '[Optional] Indicates if the infinite scroll component is nested within a custom scroll target or not.',
    },
    pullDownToRefreshContent: {
      control: 'object',
      description: '[Optional] React element for pull-to-refresh indication.',
    },
    releaseToRefreshContent: {
      control: 'object',
      description:
        '[Optional] React element for release-to-refresh indication.',
    },
    pullDownToRefreshSize: {
      control: 'number',
      description:
        '[Optional] Default: 100. Minimum distance the user needs to pull down to trigger the refresh',
    },
    nextAction: {
      action: 'nextAction',
      description: 'Fetch additional data for display action.',
    },
    refreshAction: {
      action: 'refreshAction',
      description: 'Refesh data action.',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof GenericInfiniteScroll>;

const Template: ComponentStory<typeof GenericInfiniteScroll> = (
  args: React.ComponentProps<typeof GenericInfiniteScroll> & { title: string },
) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h1>{args.title}</h1>
    <br />
    <GenericInfiniteScroll {...args} />
  </div>
);

const CircularProgressNode = (
  <div
    style={{
      display: 'flex',
      margin: 10,
      justifyContent: 'center',
    }}
  >
    <CircularProgress size={25} />
  </div>
);

const getMessageNode = (message: string) => (
  <p style={{ textAlign: 'center' }}>
    <b>{message}</b>
  </p>
);

const EndMessageNode = getMessageNode('No more items to show');

export const TextLoading = Template.bind({});
TextLoading.args = {
  title: 'Demo: Infinite scroll in an element',
  height: 250,
  total: 60,
  pagination: 20,
  loadingTime: 1,
  loader: <h4>Loading...</h4>,
  endMessage: EndMessageNode,
};

export const CircularLoading = Template.bind({});
CircularLoading.args = {
  title: 'Demo: Infinite scroll in an element',
  height: 250,
  total: 60,
  pagination: 20,
  loadingTime: 1,
  loader: CircularProgressNode,
  endMessage: EndMessageNode,
};

export const LowLoadingRate = Template.bind({});
LowLoadingRate.args = {
  title: 'Demo: Infinite scroll with 10% loading rate',
  height: 400,
  total: 300,
  pagination: 20,
  loadingTime: 1,
  loader: CircularProgressNode,
  endMessage: EndMessageNode,
  loadingRate: 10,
};

export const NoHeightGiven = Template.bind({});
NoHeightGiven.args = {
  title: 'Demo: Infinite scroll with no height passed in props',
  total: 300,
  pagination: 20,
  loadingTime: 2,
  loader: CircularProgressNode,
  endMessage: EndMessageNode,
  loadingRate: 10,
};

export const NestedWithinDiv = Template.bind({});
NestedWithinDiv.args = {
  title: 'Demo: Infinite scroll with no height but nested within a div',
  total: 300,
  pagination: 20,
  loadingTime: 2,
  loader: CircularProgressNode,
  endMessage: EndMessageNode,
  loadingRate: 10,
  useScrollableTarget: true,
};

export const PullDownToRefresh = Template.bind({});
PullDownToRefresh.args = {
  title:
    'Demo: Infinite scroll with pull down to refresh functionality (on mobile)',
  total: 600,
  pagination: 20,
  loadingTime: 2,
  loader: CircularProgressNode,
  endMessage: EndMessageNode,
  isPullDownToRefreshActive: true,
  pullDownToRefreshContent: getMessageNode('Pull down to refresh'),
  releaseToRefreshContent: getMessageNode('Release to refresh'),
};

export const PullDownToRefreshWithHeight = Template.bind({});
PullDownToRefreshWithHeight.args = {
  title:
    'Demo: Infinite scroll with pull down to refresh functionality (on mobile)',
  total: 600,
  height: 400,
  pagination: 20,
  loadingTime: 2,
  loader: CircularProgressNode,
  endMessage: EndMessageNode,
  isPullDownToRefreshActive: true,
  pullDownToRefreshContent: getMessageNode('Pull down to refresh'),
  releaseToRefreshContent: getMessageNode('Release to refresh'),
};

export const PullDownToRefreshWithinDiv = Template.bind({});
PullDownToRefreshWithinDiv.args = {
  title:
    'Demo: Infinite scroll with pull down to refresh functionality (on mobile)',
  total: 600,
  pagination: 20,
  loadingTime: 2,
  loader: CircularProgressNode,
  endMessage: EndMessageNode,
  isPullDownToRefreshActive: true,
  pullDownToRefreshContent: getMessageNode('Pull down to refresh'),
  releaseToRefreshContent: getMessageNode('Release to refresh'),
  useScrollableTarget: true,
};
