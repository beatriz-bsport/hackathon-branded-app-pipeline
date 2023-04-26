import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import QuicksaleSectionCard from '.';
import createQuicksaleSection from '../../factories/QuicksaleSection';
import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const actionsData = {
  openColorModal: action('openColorModal'),
  archiveSection: action('archiveSection'),
  onSectionEdit: action('onSectionEdit'),
  openIconSelector: action('openIconSelector'),
  openSection: action('openSection'),
};

export default {
  title: 'Components/Quicksale/QuicksaleSectionCard',
  component: QuicksaleSectionCard,
  argTypes: {
    openColorModal: actionsData.openColorModal,
    archiveSection: actionsData.archiveSection,
    onSectionEdit: actionsData.onSectionEdit,
    openIconSelector: actionsData.openIconSelector,
    openSection: actionsData.openSection,
  },
  args: {
    section: createQuicksaleSection(),
    adminView: true,
    isIconBeingEdited: false,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '40%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof QuicksaleSectionCard>;

const QuicksaleSectionCardTemplate: ComponentStory<
  typeof QuicksaleSectionCard
> = (args) => <QuicksaleSectionCard {...args} />;

export const QuicksaleSectionCardDefault = QuicksaleSectionCardTemplate.bind(
  {},
);
QuicksaleSectionCardDefault.args = {
  adminView: false,
};

export const QuicksaleSectionCardAdminView = QuicksaleSectionCardTemplate.bind(
  {},
);

export const QuicksaleSectionCardNameEditionInteractionTest =
  QuicksaleSectionCardTemplate.bind({});

QuicksaleSectionCardNameEditionInteractionTest.play = async ({
  canvasElement,
  args,
}: {
  canvasElement: HTMLElement;
  args: React.ComponentProps<typeof QuicksaleSectionCard>;
}) => {
  const canvas = within(canvasElement);
  const container = await canvas.findByTestId(
    'section-card-container',
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );

  // Check that the name is displayed and that the edition input is not
  const cardTitle = container.querySelector(
    `#card-title-${args.section.section_id}`,
  );
  expect(cardTitle).toHaveTextContent(args.section.section_name);

  const invisibleCardTitleInput = container.querySelector(
    `#card-title-input-${args.section.section_id}`,
  );
  expect(invisibleCardTitleInput).toBeNull();

  // Click on title to trigger edition
  const cardTitleButton = container.querySelector(
    `#editable-card-title-${args.section.section_id}`,
  );
  await userEvent.click(cardTitleButton);
  const cardTitleInput = container.querySelector(
    `#card-title-input-${args.section.section_id}`,
  );
  expect(cardTitleInput).not.toBeNull();

  // Edit name and validate with enter
  await userEvent.clear(cardTitleInput);
  await userEvent.type(cardTitleInput, 'New name');
  await userEvent.type(cardTitleInput, '{enter}');

  const newCardTitle = container.querySelector(
    `#card-title-${args.section.section_id}`,
  );
  expect(newCardTitle).toHaveTextContent('New name');
  expect(
    container.querySelector(`#card-title-input-${args.section.section_id}`),
  ).toBeNull();

  // Edit another time and validate by clicking on check icon
  // Click on title to trigger edition
  const newCardTitleButton = container.querySelector(
    `#editable-card-title-${args.section.section_id}`,
  );
  await userEvent.click(newCardTitleButton);
  const newCardTitleInput = container.querySelector(
    `#card-title-input-${args.section.section_id}`,
  );
  await userEvent.clear(newCardTitleInput);
  await userEvent.type(newCardTitleInput, 'Another name');

  const checkIcon = container.querySelector(
    `#card-title-check-icon-${args.section.section_id}`,
  );
  await userEvent.click(checkIcon);

  expect(
    container.querySelector(`#card-title-${args.section.section_id}`),
  ).toHaveTextContent('Another name');
  expect(
    container.querySelector(`#card-title-input-${args.section.section_id}`),
  ).toBeNull();
};
