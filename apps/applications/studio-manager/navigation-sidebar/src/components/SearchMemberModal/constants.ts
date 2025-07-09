export const MEMBER_FIXTURE = {
  id: 1,
  first_name: "David",
  last_name: "Bretaud",
  name: "David Bretaud",
  photo: undefined,
  email: "david.bretaud@bsport.io",
  phone: "+33990000000",
  tags: [1, 2, 3],
};

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
};

export type ItemSharedProps = {
  navigate?: (to: string) => void;
  tagsTooltip: string;
  toastPhoneCopied: string;
  toastEmailCopied: string;
};

export type ListItemProps = FormattedMember & ItemSharedProps;
