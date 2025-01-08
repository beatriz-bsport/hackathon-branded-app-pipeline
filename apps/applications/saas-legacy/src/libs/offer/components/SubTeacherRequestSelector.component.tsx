import React, { CSSProperties } from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import { colors } from '@bsport/common/colors.js';
import Select from 'react-select';
import type { ValueType } from 'react-select/lib/types';

export type Props = {
  selectedFilter: string;
  selectSubTeacherRequestFilter: (
    value: ValueType<{
      value: string;
      label: string;
    }>,
  ) => void;
};

const SubTeacherRequestSelector: React.FC<Props> = ({
  selectSubTeacherRequestFilter,
  selectedFilter,
}) => {
  const { t } = useTranslation('offer');
  const options = React.useMemo(
    () => [
      { value: 'false', label: t('subTeacherRequestFilter.false') },
      { value: 'true', label: t('subTeacherRequestFilter.true') },
    ],
    [t],
  );
  const value = options.filter((option) => option.value === selectedFilter);
  return (
    <div style={{ zIndex: 9999 }}>
      <Select
        isClearable
        menuPortalTarget={document.querySelector('body')}
        onChange={selectSubTeacherRequestFilter}
        options={options}
        placeholder={t('subTeacherRequestFilter.placeholder')}
        styles={subTeacherRequestSelectorStyles}
        value={value}
      />
    </div>
  );
};

// These styles are copied paste from other selectors to harmonize the colors
const subTeacherRequestSelectorStyles = {
  control: (styles: CSSProperties) => ({ ...styles, backgroundColor: 'white' }),
  menuPortal: (base: CSSProperties) => ({ ...base, zIndex: 9999 }),
  option: (
    styles: CSSProperties,
    {
      isDisabled,
      isFocused,
      isSelected,
    }: { isDisabled: boolean; isFocused: boolean; isSelected: boolean },
  ) => {
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
        // @ts-expect-error
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : color.alpha(0.3).css()),
      },
    };
  },
};

export default React.memo(SubTeacherRequestSelector);
