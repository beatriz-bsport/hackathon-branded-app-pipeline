// @ts-nocheck
import type { Cadence } from '#libs/sequential_marketingDEPRECATED/types';
import type { SmartList } from '#libs/smart-list/types';

export type BaseFormComponentProps = {
  cadence?: Cadence;
  smartlists: SmartList[];
  initial?: Cadence;
  toExit?: boolean;
  viewMode?: boolean;
};
