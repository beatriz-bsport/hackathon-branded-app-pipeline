export type ValueStepConfig = {
  value: any;
  color: string;
  icon?: string;
  iconColor?: string;
};
export type RangeStepConfig = {
  range: [number, number];
  color: string;
  icon?: string;
  iconColor?: string;
};

export type StepConfig = ValueStepConfig | RangeStepConfig;

export type StepperConfig = {
  low: StepConfig;
  lmed?: StepConfig;
  medium: StepConfig;
  high: StepConfig;
  defaultRange: 'low' | 'lmed' | 'medium' | 'high';
};
