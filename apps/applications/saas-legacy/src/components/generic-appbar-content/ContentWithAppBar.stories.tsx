import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ContentWithAppBar from './ContentWithAppBar.component';

export default {
  title: 'Components/Commons/ContentWithAppBar',
  component: ContentWithAppBar,
  parameters: {
    docs: {
      page: null,
    },
  },
} as ComponentMeta<typeof ContentWithAppBar>;

const ContentWithAppBarTemplate: ComponentStory<typeof ContentWithAppBar> = (
  args: React.ComponentProps<typeof ContentWithAppBar>,
) => <ContentWithAppBar {...args} />;

export const AppBarWithContent = ContentWithAppBarTemplate.bind({});
AppBarWithContent.args = {
  tab: '',
  pageHeight: 488,
  tabsData: [
    { label: 'profile', value: '1' },
    { label: 'schedule', value: '2' },
    { label: 'other', value: '3' },
    { label: 'help', value: '4' },
  ],
  children: (
    <body>
      <div
        style={{
          maxHeight: 2000,
          backgroundColor: 'blue',
          padding: 52,
          paddingBottom: 100,
          margin: 30,
          color: 'white',
        }}
      >
        Hello !
        <div style={{ paddingTop: 100 }}>
          Here you can scroll down and the appbar remains sticky !
        </div>
        <div style={{ paddingTop: 100 }}>
          <div>You can also change the tab value !</div>
          <div>
            If it is a value of tabsData (1,2,3,4), it will select the
            corresponding tab.
          </div>
          <div>
            If not, it will select the first tab which is the default tab.
          </div>
        </div>
        {Array.from({ length: 4 }, () => (
          <div style={{ paddingTop: 100 }}>...</div>
        ))}
        <div style={{ paddingTop: 100 }}>END</div>
      </div>
    </body>
  ),
};

export const AppBarWithoutContent = ContentWithAppBarTemplate.bind({});
AppBarWithoutContent.args = {
  tab: '',
  pageHeight: 488,
  tabsData: [
    { label: 'profile', value: '1' },
    { label: 'schedule', value: '2' },
    { label: 'other', value: '3' },
    { label: 'help', value: '4' },
  ],
};
