import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';

import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import useSmartlistContext, {
  type SmartlistOption,
} from '../hooks/useSmartlistContext.hook';

import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';

export type Props = {
  trigger: ConnectedTrigger;
  smartlists: Immutable.ImmutableArray<SmartList>;
  updateValue: (trigger: ConnectedTrigger) => void;
};

const SmartlistForm: React.FC<Props> = ({
  trigger,
  smartlists,
  updateValue,
}) => {
  const { t } = useTranslation('marketing');

  const {
    smartlistSelected,
    selectSmartlist,
    getSmartlistName,
    SMARTLIST_OPTIONS,
  } = useSmartlistContext(smartlists);

  React.useEffect(() => {
    const smartlistId = trigger?.filtering_config?.smartlist_pk;

    if (smartlistId) {
      selectSmartlist({
        label: getSmartlistName(smartlistId),
        value: smartlistId,
      });
    }
  }, [getSmartlistName, selectSmartlist, t, trigger]);

  const handleSelectSmartlist = React.useCallback(
    (option: SmartlistOption) => {
      const updatedTrigger = {
        ...trigger,
        filtering_config: {
          ...trigger?.filtering_config,
          smartlist_pk: option?.value,
        },
      };
      selectSmartlist(option);
      updateValue?.(updatedTrigger);
    },
    [selectSmartlist, updateValue, trigger],
  );

  return (
    <MaterialUISelector
      isClearable
      onChange={handleSelectSmartlist}
      options={SMARTLIST_OPTIONS}
      placeholder={t('cadence.form.trigger.selectSmartlist')}
      value={smartlistSelected}
    />
  );
};

export default React.memo(SmartlistForm);
