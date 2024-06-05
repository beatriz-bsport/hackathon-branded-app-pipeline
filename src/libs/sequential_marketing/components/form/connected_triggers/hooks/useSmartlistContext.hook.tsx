import React from 'react';
import Immutable from 'seamless-immutable';
import type { SmartList } from '#src/libs/smart-list/types';

export type SmartlistOption = { label: string; value: number };

const useSmartlistContext = (
  smartlists: Immutable.ImmutableArray<SmartList>,
) => {
  const [smartlistSelected, setSmartlistSelected] =
    React.useState<SmartlistOption | null>(null);

  const selectSmartlist = React.useCallback(
    (option: SmartlistOption) => setSmartlistSelected(option),
    [],
  );

  const getSmartlistName = React.useCallback(
    (smartlistId: number) =>
      smartlists.find((smartlist) => smartlist.id === smartlistId)?.name,
    [smartlists],
  );

  const SMARTLIST_OPTIONS = React.useMemo(
    () =>
      (smartlists?.asMutable() || []).map(
        (smartlist: Immutable.ImmutableObject<SmartList>) => ({
          label: smartlist.name,
          value: smartlist.id,
        }),
      ),
    [smartlists],
  );

  return {
    smartlistSelected,
    selectSmartlist,
    getSmartlistName,
    SMARTLIST_OPTIONS,
  };
};

export default useSmartlistContext;
