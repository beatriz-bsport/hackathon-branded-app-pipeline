const RadioButtonSizeType = ['sm', 'lg'] as const;

export type RadioButtonSize = (typeof RadioButtonSizeType)[number];
