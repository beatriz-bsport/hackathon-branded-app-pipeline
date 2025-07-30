export type FormattedMember = {
  id: string;
  avatar: {
    src?: string;
    alt: string;
    initials: string;
  };
  name: string;
  email?: string;
  phone?: string;
  tags: number[];
  onClick: () => void;
};

export type TagConfig = {
  categoryName?: string;
  tagName: string;
  color: string;
};

export type TagsMap = Map<number, TagConfig>;

export type ItemSharedProps = {
  navigate?: (to: string) => void;
  tagsTooltip: string;
  toastPhoneCopied: string;
  toastEmailCopied: string;
  tagsMap: TagsMap;
};

export type ListItemProps = FormattedMember & ItemSharedProps;
