const TextFieldSizeTypes = ['sm', 'lg'] as const;

const TextFieldTypes = ['text', 'email', 'tel', 'password', 'date'] as const;

export type TextFieldSize = (typeof TextFieldSizeTypes)[number];
export type TextFieldType = (typeof TextFieldTypes)[number];
