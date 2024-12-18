import Immutable from 'seamless-immutable';

export type MenuAction = {
  label: string;
  icon: string;
  onClick: () => void;
  customColor?: string;
  isDisabled?: boolean;
};

export type NestedMenuAction = MenuAction & {
  actionList?: Immutable.ImmutableArray<MenuAction>;
};
