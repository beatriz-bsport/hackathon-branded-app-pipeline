// @flow
import React from 'react';
import { withTranslation } from 'react-i18next';

import Selector from '../../../../components/Selector.component';

const getGroupOptions = (scts: Array<SCT>) => {
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

export default withTranslation(['privateService'])(
  ({ t, serviceGroupList, value, placeholder, isDisabled, selectOption }) => {
    return (
      <Selector
        placeholder={placeholder || t('serviceGroup.selector.placeholder')}
        suggestions={getGroupOptions([...serviceGroupList])}
        onChange={selectOption}
        isClearable
        isDisabled={isDisabled}
        selected={value}
        searchIcon={!value}
      />
    );
  },
);
