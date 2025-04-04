type TagKind = {
  id: number;
  text: string;
};

export const TAG_KIND_MEMBER: TagKind = {
  id: 0,
  text: 'member',
};

export const TAG_KIND_PAYMENT_PACK: TagKind = {
  id: 1,
  text: 'payment_pack',
};

const TAG_KIND_CHOICES: Array<TagKind> = [
  TAG_KIND_MEMBER,
  TAG_KIND_PAYMENT_PACK,
];

export default TAG_KIND_CHOICES;
