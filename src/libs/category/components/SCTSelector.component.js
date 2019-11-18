// @flow
import React from 'react';
import { withNamespaces } from 'react-i18next';
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
        parentCategory={data.data.SCS.id}
        SCTName={data.data.name}
        isSelected={isSelected}
        isFocused={isFocused}
        noDivider
        button
        dense
        paddingLeft
      />
    </div>
  );
}

function SingleValue(props: OptionProps) {
  const { data, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <Sport
        parentCategory={data.data.SCS.id}
        SCTName={data.data.name}
        noDivider
        dense
        paddingLeft
      />
    </div>
  );
}

export default withNamespaces(['category'])(
  ({ t, scts, value, placeholder, isDisabled, selectOption }) => {
    return (
      <Selector
        placeholder={placeholder || t('sct.selector.placeholder')}
        suggestions={getSCTOptions(asMutable(scts))}
        onChange={selectOption}
        isDisabled={isDisabled}
        selected={value}
        searchIcon={!value}
        components={{ Option: sctOption, SingleValue }}
      />
    );
  },
);
