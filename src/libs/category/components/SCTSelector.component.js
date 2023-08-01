// @flow
import React from 'react';
import { withTranslation } from 'react-i18next';
import Immutable from 'seamless-immutable';

import Selector from '../../../components/Selector.component';
import Sport from './SCT.component';

const asMutable = (stuff) => {
  if (Immutable.isImmutable(stuff)) {
    return stuff.asMutable();
  }
  return stuff;
};

const getSCTOptions = (scts: Array<SCT>) => {
  scts.sort((c, c_) => {
    if (c.name.toUpperCase() < c_.name.toUpperCase()) {
      return -1;
    }
    return 1;
  });
  return scts.map((c) => ({
    value: c.id,
    label: c.name,
    data: c,
  }));
};

function sctOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <Sport
        button
        dense
        noDivider
        paddingLeft
        isFocused={isFocused}
        isSelected={isSelected}
        parentCategory={data.data.SCS.id}
        SCTName={data.data.name}
      />
    </div>
  );
}

function SingleValue(props: OptionProps) {
  const { data, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <Sport
        dense
        noDivider
        paddingLeft
        parentCategory={data.data.SCS.id}
        SCTName={data.data.name}
      />
    </div>
  );
}

export default withTranslation(['category'])(
  ({ t, scts, value, placeholder, isDisabled, selectOption, id, onChange }) => {
    return (
      <Selector
        components={{ Option: sctOption, SingleValue }}
        id={id}
        isDisabled={isDisabled}
        onChange={selectOption || onChange}
        placeholder={placeholder || t('sct.selector.placeholder')}
        searchIcon={!value}
        selected={value}
        suggestions={getSCTOptions(asMutable(scts))}
      />
    );
  },
);
