import { useCallback, useEffect, useState } from 'react';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';

import { SmartListSelectOption } from '#src/libs/communication-v2/types';

export const useSmartlistHandler = (
  contextSelected: ChatThreadKinds,
  fetchAllSmartLists: () => void,
) => {
  const [smartlistSelected, setSmartlistSelected] = useState<number>(null);

  const handleSmartlistSelect = useCallback(
    (smartlist: SmartListSelectOption) => {
      if (!smartlist) {
        return;
      }
      setSmartlistSelected(smartlist.value);
    },
    [],
  );

  useEffect(() => {
    if (contextSelected === ChatThreadKinds.Smartlist) {
      fetchAllSmartLists();
    }
  }, [contextSelected, fetchAllSmartLists]);
  return [smartlistSelected, handleSmartlistSelect, fetchAllSmartLists];
};
