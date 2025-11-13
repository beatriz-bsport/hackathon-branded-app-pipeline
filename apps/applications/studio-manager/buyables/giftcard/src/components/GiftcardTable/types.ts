export type GiftcardHandler = ({
  giftcardId,
  giftcardName,
}: {
  giftcardId: number;
  giftcardName: string;
}) => void;

export type GetTableColumnsParams = {
  handleArchive?: GiftcardHandler;
  handleDuplicate?: GiftcardHandler;
  handleRestore?: GiftcardHandler;
  mode: "archived" | "active";
};

export type EmptyConfig = {
  title: string;
  subtitle?: string;
  ctaButtonConfig?: {
    label: string;
    iconLeft: "plus";
    onClick?: () => void;
  };
};
