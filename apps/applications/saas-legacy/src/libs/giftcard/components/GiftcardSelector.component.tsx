import React, { type FC } from 'react';
import clsx from 'clsx';
import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

import GiftcardListItem from './GiftcardListItem.component';
// @ts-expect-error
import Selector from '../../../components/Selector.component';

import type { Giftcard } from '../types';
import { GIFTCARD_TYPES } from '../constants';

type Props = {
  classes: any;
  giftcardList: Array<Giftcard>;
  onChange: (id: number | null) => void;
  helperText: string;
  nullCurrentValue?: boolean;
  value: number | null;
  selectorClass: string;
  autofocus: boolean;
};

type OptionData = {
  giftcard: Giftcard;
  label: string;
  value: number;
};

type OptionProps = {
  data: OptionData;
  innerRef: any;
  innerProps: any;
  isSelected: boolean;
  isFocused: boolean;
  autofocus: boolean;
  searchIcon: any;
  nullCurrentValue: boolean;
  selected: number;
  className: any;
  components: any;
  placeholder: string;
  onChange: (ev: any) => void;
};

const isCustomAmountGiftcard = (giftcard: Giftcard) =>
  giftcard?.card_type === GIFTCARD_TYPES.CUSTOM;

const GiftcardSelectorItem: FC<OptionProps> = (props) => {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;

  return (
    <div ref={innerRef} {...innerProps}>
      <GiftcardListItem
        disabled={isCustomAmountGiftcard(data.giftcard)}
        giftcard={data.giftcard}
        isFocused={isFocused}
        selected={isSelected}
      />
    </div>
  );
};

export function GiftcardSelector(props: Props) {
  const {
    value,
    onChange,
    giftcardList,
    selectorClass,
    helperText,
    nullCurrentValue,
    autofocus,
    classes,
  } = props;

  const { t } = useTranslation('b2b_giftcard');
  const suggestions = [...(giftcardList ?? [])]
    .sort((giftcard1, giftcard2) => {
      const name1 = giftcard1?.name ?? '';
      const name2 = giftcard2?.name ?? '';
      return name1.localeCompare(name2);
    })
    .map((giftcard) => ({
      value: giftcard.id,
      label: giftcard.name,
      giftcard,
    }));

  const hasSomeCustomAmountGiftcard = (giftcardList ?? []).some((giftcard) =>
    isCustomAmountGiftcard(giftcard),
  );

  return (
    <>
      <Selector
        searchIcon
        autofocus={autofocus}
        className={clsx(classes, selectorClass)}
        components={{ Option: GiftcardSelectorItem }}
        nullCurrentValue={nullCurrentValue}
        onChange={(item: OptionData) => {
          if (isCustomAmountGiftcard(item.giftcard)) {
            console.warn(
              '[Giftcard] Can not add a custom amount GC to the invoice',
            );
            return;
          }
          onChange(item.value);
        }}
        placeholder={helperText}
        selected={value}
        suggestions={suggestions}
      />
      {hasSomeCustomAmountGiftcard && (
        <Alert severity="info">{t('customAmount.featureBlocked')}</Alert>
      )}
    </>
  );
}

export default GiftcardSelector;
