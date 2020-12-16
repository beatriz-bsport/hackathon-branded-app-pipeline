// @flow
import memoize from 'memoize-one';
import type { State } from '../../state/types.ts';

export const getPartnershipByIdentifier = memoize(
  (state: State, identifier: string) => {
    return Object.values(state.partnership.byId).find(
      (p) => p.identifier === identifier,
    );
  },
);
