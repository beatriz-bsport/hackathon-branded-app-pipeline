export type MaterialStyleType<S> = {
  classes: Record<keyof S, string>;
};

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType[number];

export type WithHandlerType<
  T extends { [key: string]: (...args: any) => void },
> = {
  [K in keyof T]: ReturnType<T[K]>;
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
