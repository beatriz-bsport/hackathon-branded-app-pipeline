import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MarketplacePageContent, { MarketplacePageContentStorybook } from '.';
import Typography from '#Fabrique/Typography';
import MarketplaceAppBar from '#src/libs/marketplace/components/@AppBar/MarketplaceAppBar';
import { marketplaceSettingsFactory } from '#src/libs/marketplace/factories';
import { basketFactory } from '#src/libs/checkout/factories';
import { Member } from '#src/libs/member/types';

import './styles-storybook.css';

const auth = {
  authenticated: true,
  username: faker.internet.email(),
  name: faker.person.fullName(),
};
const theme = { vod: false };
const appBarArgs = {
  auth: auth,
  controlableMemberList: [] as Member[],
  isRelationNavigation: false,
  hideAppBar: false,
  withNavigation: true,
  settings: marketplaceSettingsFactory(2),
  theme: theme,
  tabSelected: '0',
  logo: 'https://play-lh.googleusercontent.com/a6Z8ZNVyijwO-iFAAa4Uy0GBbkOOgNdFyT5FJUEodxNoisv1SCppMrHqW-sQXN3cPh8',
  currentBasket: basketFactory(5),
};

const PageContentTemplate: ComponentStory<typeof MarketplacePageContent> = (
  args,
) => (
  <>
    <MarketplaceAppBar {...appBarArgs} />
    <MarketplacePageContentStorybook {...args} />
  </>
);

export const Pagewithsmallcontent = PageContentTemplate.bind({});
Pagewithsmallcontent.args = {
  children: (
    <Typography variant="body-md">{faker.lorem.sentences(3)}</Typography>
  ),
};

export const Pagewithscrollablecontent = PageContentTemplate.bind({});
Pagewithscrollablecontent.args = {
  children: (
    <Typography variant="body-md">{faker.lorem.paragraphs(100)}</Typography>
  ),
};

export default {
  title: 'Components/CssOnly/MarketplacePageContent',
  component: MarketplacePageContent,
  argTypes: {
    className: {
      description: 'An optional class name passed to the root element',
    },
    classes: {
      description: 'Optional class name passed to children element container',
    },
    children: {
      description: 'The content element to show inside the container',
    },
  },
} as ComponentMeta<typeof MarketplacePageContent>;
