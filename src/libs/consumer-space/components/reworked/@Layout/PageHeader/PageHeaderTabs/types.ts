interface PageHeaderTabsType extends Record<string, boolean> {}

type TabData<T extends PageHeaderTabsType> = {
  type: keyof T;
  label: string;
  onClick: () => void;
  hidden: boolean;
};

export { PageHeaderTabsType, TabData };
