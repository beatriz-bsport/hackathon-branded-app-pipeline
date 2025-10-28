import type { FormikProps } from 'formik';

import type { Tag, TagGroup } from '#src/libs/tag/types';
import type { BookkeepingAccount } from '#src/libs/payment/types';
import type { OptionCallback } from '#src/state/types';

import type { Giftcard, GiftcardTemplate, GiftcardDataAPI } from '../../types';

export type OuterProps = {
  open: boolean;
  onClose: () => void;
  initial?: Giftcard | GiftcardTemplate;
  tagList?: Array<Tag<TagGroup>>;
  bookkeepingAccounts?: BookkeepingAccount[];
  bookkeepingAccountById?: Record<number, BookkeepingAccount>;
  onSubmit: (
    data: GiftcardDataAPI,
    options: OptionCallback<Giftcard | GiftcardTemplate>,
  ) => void;
};

export type GiftcardFormValues = {
  name: string;
  cover?: string;
  description: string;
  price: number;
  manager_only: boolean;
  unlimited: boolean;
  available_payment_method_identifiers: number[];
  expiration_days: number | null;
  tags_on_consumer_item_creation: number[];
  bookkeeping_account?: number;
  is_shared_giftcard?: boolean | null;
};

export type GiftcardFormDrawerProps = OuterProps &
  FormikProps<GiftcardFormValues>;
