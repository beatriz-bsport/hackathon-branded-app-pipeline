import React, { type FC } from 'react';
import clsx from 'clsx';

import GiftcardListItem from './GiftcardListItem.component';
// @ts-expect-error
import Selector from '../../../components/Selector.component';

import type { Giftcard } from '../types';

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

const GiftcardSelectorItem: FC<OptionProps> = (props) => {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;

  return (
    <div ref={innerRef} {...innerProps}>
      <GiftcardListItem
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

  return (
    <>
      <Selector
        searchIcon
        autofocus={autofocus}
        className={clsx(classes, selectorClass)}
        components={{ Option: GiftcardSelectorItem }}
        nullCurrentValue={nullCurrentValue}
        onChange={(item: OptionData) => {
          onChange(item.value);
        }}
        placeholder={helperText}
        selected={value}
        suggestions={suggestions}
      />
    </>
  );
}

export default GiftcardSelector;
