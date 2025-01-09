import React from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import { colors } from '@bsport/common/lib/colors.js';
import memoize from 'memoize-one';
import Select from 'react-select';
import { TFunction } from 'i18next';

export type Props = {
  selectOption: any;
  selectedRollCallStatus: any;
};

const getRollCallOptions = memoize((t: TFunction) => [
  { value: 'false', label: t('rollCall.filter.validated') },
  { value: 'true', label: t('rollCall.filter.notValidated') },
]);

const RollCallSelector: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation('offer');
  const rollCallOptions = getRollCallOptions(t);
  const value = rollCallOptions.filter(
    (option) => option.value === props.selectedRollCallStatus,
  );
  return (
    <div style={{ zIndex: 9999 }}>
      <Select
        isClearable
        menuPortalTarget={document.querySelector('body')}
        onChange={props.selectOption}
        options={getRollCallOptions(t)}
        placeholder={t('rollCall.filter.placeholder')}
        styles={rollCallStyles}
        value={value}
      />
    </div>
  );
};

const rollCallStyles = {
  // @ts-expect-error
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  // @ts-expect-error
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  // @ts-expect-error
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma(colors.secondary);
    let backgroundColor = null;
    let textColor = null;
    if (!isDisabled) {
      if (isSelected) {
        backgroundColor = colors.secondary;
        if (chroma.contrast(color, 'white') > 2) {
          textColor = 'white';
        } else {
          textColor = 'black';
        }
      } else {
        textColor = colors.secondary;
        if (isFocused) {
          backgroundColor = color.alpha(0.1).css();
        }
      }
    } else {
      textColor = '#ccc';
    }
    return {
      ...styles,
      backgroundColor,
      color: textColor,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : color.alpha(0.3).css()),
      },
    };
  },
};

export default React.memo(RollCallSelector);
