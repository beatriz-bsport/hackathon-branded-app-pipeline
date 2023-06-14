import React from 'react';
import { StepperConfig } from '#components/chip/types';
import { CustomChip } from './CustomChip.component';

type Props = { config: StepperConfig; value: any; displayedValue: string };

const NumberChip: React.FC<Props> = ({ config, value, displayedValue }) => {
  let mainColor = null;
  let icon = null;
  let iconColor = null;

  if (
    config.low &&
    (('value' in config.low && value === config.low?.value) ||
      ('range' in config.low &&
        value > config.low?.range[0] &&
        value <= config.low?.range[1]))
  ) {
    mainColor = config.low.color;
    icon = config.low.icon;
    iconColor = config.low.iconColor;
  } else if (
    config.lmed &&
    (('value' in config.lmed && value === config.lmed?.value) ||
      ('range' in config.lmed &&
        value > config.lmed?.range[0] &&
        value <= config.lmed?.range[1]))
  ) {
    mainColor = config.lmed.color;
    icon = config.lmed.icon;
    iconColor = config.lmed.iconColor;
  } else if (
    config.medium &&
    (('value' in config.medium && value === config.medium?.value) ||
      ('range' in config.medium &&
        value > config.medium?.range[0] &&
        value <= config.medium?.range[1]))
  ) {
    mainColor = config.medium.color;
    icon = config.medium.icon;
    iconColor = config.medium.iconColor;
  } else if (
    config.high &&
    (('value' in config.high && value === config.high?.value) ||
      ('range' in config.high &&
        value > config.high?.range[0] &&
        value <= config.high?.range[1]))
  ) {
    mainColor = config.high.color;
    icon = config.high.icon;
    iconColor = config.high.iconColor;
  } else {
    const step = config.defaultRange;
    mainColor = config[step].color;
    icon = config[step].icon;
    iconColor = config[step].iconColor;
  }
  return (
    <CustomChip
      displayedValue={displayedValue}
      mainColor={mainColor}
      icon={icon}
      iconColor={iconColor}
    />
  );
};

export default NumberChip;
