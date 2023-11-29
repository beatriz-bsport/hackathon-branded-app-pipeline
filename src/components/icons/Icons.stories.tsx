import React, { SVGProps } from 'react';
import { ComponentMeta } from '@storybook/react';

import CalendarIcon from './CalendarIcon.component';
import FemaleIcon, { FemaleIconProps } from './FemaleIcon.component';
import MaleIcon, { MaleIconProps } from './MaleIcon.component';
import IntercomIcon from './IntercomIcon.component';
import StripeIcon from './StripeIcon.component';
import SuccessIcon from './SuccessIcon.component';
import StopBuildIcon from './StopBuildIcon.component';
import EmailIcon from './EmailIcon.component';
import ValidationIcon from './ValidationIcon.component';
import SadSmileyIcon from './SadSmileyIcon.component';
import ErrorIcon from './ErrorIcon.component';
import UpdateIcon from './UpdateIcon.component';
import CardRefusedIcon, {
  CardRefusedIconProps,
} from './CardRefusedIcon.component';
import WarningIcon from './WarningIcon.component';
import TriggeredPersonIcon from './TriggeredPersonIcon.component';
import WarningIconRounded from './WarningIconRounded.component';
import WorkflowIcon from './WorkflowIcon.component';
import SwitchVerticalIcon from './SwitchVerticalIcon.component';
import SwitchHorizontalIcon from './SwitchHorizontalIcon.component';
import SwitchHorizontalShadowIcon from './SwitchHorizontalShadowIcon.component';
import SwitchHorizontalSquareFramedIcon from './SwitchHorizontalSquareFramedIcon.component';
import SwitchHorizontalDiamondFramedIcon from './SwitchHorizontalDiamondFramedIcon.component';
import type { SvgIconProps } from '@material-ui/core/SvgIcon';
import { CustomStarIcon } from './CustomStarIcon.component';
import TrophyIcon from './TrophyIcon.component';

const FILL_CONTROL = { fill: { control: 'color' } };

const CalendarTemplate = (args: SVGProps<SVGElement>) => (
  <CalendarIcon {...args} />
);
export const Calendar = CalendarTemplate.bind({});
Calendar.argTypes = FILL_CONTROL;

const FemaleTemplate = (args: FemaleIconProps) => <FemaleIcon {...args} />;
export const Female = FemaleTemplate.bind({});
Female.argTypes = { ...FILL_CONTROL, isMobile: { control: 'boolean' } };

const MaleTemplate = (args: MaleIconProps) => <MaleIcon {...args} />;
export const Male = MaleTemplate.bind({});
Male.argTypes = { ...FILL_CONTROL, isMobile: { control: 'boolean' } };

const IntercomTemplate = (args: SVGProps<SVGElement>) => (
  <IntercomIcon {...args} />
);
export const Intercom = IntercomTemplate.bind({});
Intercom.argTypes = FILL_CONTROL;

const StripeTemplate = (args: SVGProps<SVGElement>) => <StripeIcon {...args} />;
export const Stripe = StripeTemplate.bind({});
Stripe.argTypes = FILL_CONTROL;

const SuccessTemplate = (args: SVGProps<SVGElement>) => (
  <SuccessIcon {...args} />
);
export const Success = SuccessTemplate.bind({});
Success.argTypes = FILL_CONTROL;

const StopBuildTemplate = () => <StopBuildIcon />;
export const StopBuild = StopBuildTemplate.bind({});

const TriggeredPersonTemplate = (args: SVGProps<SVGElement>) => (
  <TriggeredPersonIcon {...args} />
);
export const TriggeredPerson = TriggeredPersonTemplate.bind({});
TriggeredPerson.argTypes = FILL_CONTROL;

const ValidationTemplate = (args: { color?: string }) => (
  <ValidationIcon {...args} />
);
export const Validation = ValidationTemplate.bind({});
Validation.argTypes = { color: { control: 'color' } };

const SadSmileyTemplate = () => <SadSmileyIcon />;
export const SadSmiley = SadSmileyTemplate.bind({});

const ErrorTemplate = (args: SVGProps<SVGElement>) => <ErrorIcon {...args} />;
export const Error = ErrorTemplate.bind({});
Error.argTypes = FILL_CONTROL;

const CardRefusedTemplate = (args: CardRefusedIconProps) => (
  <CardRefusedIcon {...args} />
);
export const CardRefused = CardRefusedTemplate.bind({});
CardRefused.argTypes = { color: { control: 'color' } };

const UpdateTemplate = (args: { color?: string }) => <UpdateIcon {...args} />;
export const Update = UpdateTemplate.bind({});
Update.argTypes = { color: { control: 'color' } };

const WarningTemplate = (args: { color?: string }) => <WarningIcon {...args} />;
export const Warning = WarningTemplate.bind({});
Warning.argTypes = { color: { control: 'color' } };

const EmailTemplate = (args: SVGProps<SVGElement>) => <EmailIcon {...args} />;
export const Email = EmailTemplate.bind({});
Email.argTypes = FILL_CONTROL;

const WarningIconRoundedTemplate = (args: SVGProps<SVGElement>) => (
  <WarningIconRounded {...args} />
);
export const WarningRounded = WarningIconRoundedTemplate.bind({});
WarningRounded.args = {
  fill: '#FF9800',
};

const WorkflowTemplate = () => <WorkflowIcon />;
export const Workflow = WorkflowTemplate.bind({});

const SwitchVerticalTemplate = (args: SvgIconProps) => (
  <SwitchVerticalIcon {...args} />
);
export const SwitchVertical = SwitchVerticalTemplate.bind({});
SwitchVertical.argTypes = { fill: { control: 'color' } };

const SwitchHorizontalTemplate = (args: SvgIconProps) => (
  <SwitchHorizontalIcon {...args} />
);
export const SwitchHorizontal = SwitchHorizontalTemplate.bind({});
SwitchHorizontal.argTypes = { fill: { control: 'color' } };

const SwitchHorizontalShadowTemplate = (args: SvgIconProps) => (
  <SwitchHorizontalShadowIcon {...args} />
);
export const SwitchHorizontalShadow = SwitchHorizontalShadowTemplate.bind({});
SwitchHorizontalShadow.argTypes = { fill: { control: 'color' } };

const SwitchHorizontalSquareFramedTemplate = () => (
  <SwitchHorizontalSquareFramedIcon />
);
export const SwitchHorizontalSquareFramed =
  SwitchHorizontalSquareFramedTemplate.bind({});

const SwitchHorizontalDiamondFramedTemplate = (args: SvgIconProps) => (
  <SwitchHorizontalDiamondFramedIcon {...args} />
);
export const SwitchHorizontalDiamondFramed =
  SwitchHorizontalDiamondFramedTemplate.bind({});
SwitchHorizontalDiamondFramed.argTypes = {
  displayBackgroundColor: { control: 'boolean' },
};

const CustomStarIconTemplate = () => <CustomStarIcon />;
export const CustomStar = CustomStarIconTemplate.bind({});

const TrophyTemplate = (args: SvgIconProps) => <TrophyIcon {...args} />;
export const Trophy = TrophyTemplate.bind({});
Trophy.argTypes = { fill: { control: 'color' } };

export default {
  title: 'Components/Icons',
  parameters: {
    docs: {
      page: null,
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
} as ComponentMeta<React.FC>;
