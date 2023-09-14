import React from 'react';

import { ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';
import EditIcon from '@material-ui/icons/Edit';
import PersonAdd from '@material-ui/icons/PersonAdd';
import i18n from 'i18next';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';

import { MuiThemeToCssVarsHOC } from '#hocs/marketplace-css.hoc';
import Button, { ButtonColor, ButtonVariant } from '#Fabrique/Button';
import Tooltip, { type Props } from '.';

import './styles-storybook.css';

const ButtonTooltipTemplate = (args: Props) => (
  <div className="bs-tooltip-storybook">
    <Tooltip {...args}>
      <Button
        color={ButtonColor.PRIMARY}
        onClick={() => {}}
        variant={ButtonVariant.ICON}
      >
        <EditIcon />
      </Button>
    </Tooltip>
  </div>
);

const InviteGuestTooltipTemplate = (args: Props) => (
  <div className="bs-tooltip-storybook">
    <Tooltip {...args}>
      <Button
        classes={{
          root: 'bs-tooltip-storybook-add-guest-button__container',
          text: 'bs-tooltip-storybook-add-guest-button__text',
        }}
        onClick={() => {}}
        variant={ButtonVariant.ICON}
      >
        <PersonAdd />
      </Button>
    </Tooltip>
  </div>
);

export const ButtonWithTooltip = ButtonTooltipTemplate.bind({});
ButtonWithTooltip.args = {
  text: faker.lorem.words(3),
};

export const InviteGuestButton = InviteGuestTooltipTemplate.bind({});
InviteGuestButton.args = {
  text: i18n.t(
    `booking:offer.bookingForAGuest.bookingStatus.${OFFER_BOOKABLE_STATUS_BOOKABLE}`,
  ),
};

export default {
  title: 'Components/CssOnly/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <MuiThemeToCssVarsHOC>
        <Story />
      </MuiThemeToCssVarsHOC>
    ),
  ],
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
} as ComponentMeta<typeof Tooltip>;
