import React from 'react';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';

import { SmartListSelectOption } from '../types';

export const useSmartlistHandler = (
  contextSelected: ChatThreadKinds,
  fetchAllSmartLists: () => void,
) => {
  const [smartlistSelected, setSmartlistSelected] =
    React.useState<number>(null);

  const handleSmartlistSelect = React.useCallback(
    (smartlist: SmartListSelectOption) => {
      if (!smartlist) {
        return;
      }
      setSmartlistSelected(smartlist.value);
    },
    [],
  );

  React.useEffect(() => {
    if (contextSelected === ChatThreadKinds.Smartlist) {
      fetchAllSmartLists();
    }
  }, [contextSelected, fetchAllSmartLists]);
  return [smartlistSelected, handleSmartlistSelect, fetchAllSmartLists];
};
