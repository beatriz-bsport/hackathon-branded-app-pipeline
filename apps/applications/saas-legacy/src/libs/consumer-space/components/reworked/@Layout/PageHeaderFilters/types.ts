type TabFilter = {
  className?: string;
  hasBadge: boolean;
  type: string;
  label: string;
  onClick: () => void;
  value?: number;
};

export { TabFilter };
