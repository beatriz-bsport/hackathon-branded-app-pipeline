import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';
import { QuicksaleItemColor, QuicksaleSectionColor } from './constants';

export type QuicksaleItem = {
  object_id: number;
  buyable_item_identifier: QuicksaleBasketItem;
  color: QuicksaleItemColor;
};

export type QuicksaleSection = {
  section_id: string;
  section_name: string;
  section_icon: string;
  section_color: QuicksaleSectionColor;
  items: Array<QuicksaleItem>;
  disabled: boolean;
};

export type QuicksaleCardInfo = {
  id: string; // `${buyable_item_identifier} ${object_id}`
  title: string;
  subtitle: string;
  price: number;
  recurrence?: string;
  color: QuicksaleItemColor;
  sectionId: string;
};
