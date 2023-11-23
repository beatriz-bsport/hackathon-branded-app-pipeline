import Immutable from 'seamless-immutable';

export type MenuAction = {
  label: string;
  icon: string;
  onClick: () => void;
  customColor?: string;
};

export type NestedMenuAction = MenuAction & {
  actionList?: Immutable.ImmutableArray<MenuAction>;
};
