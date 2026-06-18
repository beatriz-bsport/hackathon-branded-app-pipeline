export type MemberDetailContactItem = {
  id: string;
  icon: "phone-02" | "mail-01";
  value: string;
  optedIn?: boolean;
};

export type MemberDetailTagItem = {
  id: number;
  label: string;
  color?: string;
};

export type MemberDetailNoteItem = {
  id: number;
  date: string;
  text: string;
};

export type MemberDetailPanelProps = {
  name: string;
  joinedLabel: string;
  birthdayLabel?: string;
  isBirthdayToday: boolean;
  contactItems: MemberDetailContactItem[];
  unpaidInvoicesCount: number;
  creditAccountBalanceLabel: string;
  tags: MemberDetailTagItem[];
  notes: MemberDetailNoteItem[];
};
