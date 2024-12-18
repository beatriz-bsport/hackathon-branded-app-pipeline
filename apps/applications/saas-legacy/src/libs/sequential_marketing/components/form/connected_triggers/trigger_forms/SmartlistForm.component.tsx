import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import type { ConnectedTrigger } from '#src/libs/sequential_marketing/types';
import type { SmartList } from '#src/libs/smart-list/types';
import useSmartlistContext, {
  type SmartlistOption,
} from '../hooks/useSmartlistContext.hook';
import { DEFAULT_REACT_SELECT_MAX_HEIGHT } from './constants';

type Props = {
  isFromMUIPopover: boolean;
  trigger: ConnectedTrigger;
  smartlists: Immutable.ImmutableArray<SmartList>;
  updateValue: (trigger: ConnectedTrigger) => void;
};

const SmartlistForm: React.FC<Props> = ({
  isFromMUIPopover,
  trigger,
  smartlists,
  updateValue,
}) => {
  const { t } = useTranslation('marketing');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const {
    smartlistSelected,
    selectSmartlist,
    getSmartlistName,
    SMARTLIST_OPTIONS,
  } = useSmartlistContext(smartlists);

  const handleCloseMenu = React.useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleOnMenuClick = React.useCallback(() => {
    setIsMenuOpen((prevState) => !prevState);
  }, []);

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

  if (isFromMUIPopover) {
    return (
      <div
        style={{ paddingLeft: 1 }} // needed to fully display the left border when selected
      >
        <Select
          isClearable
          menuPlacement="auto"
          menuPosition="fixed"
          minMenuHeight={DEFAULT_REACT_SELECT_MAX_HEIGHT}
          onChange={handleSelectSmartlist}
          options={SMARTLIST_OPTIONS}
          placeholder={t('cadence.form.trigger.selectSmartlist')}
          value={smartlistSelected}
        />
      </div>
    );
  }

  return (
    <ClickAwayListener onClickAway={handleCloseMenu}>
      <div
        onClick={handleOnMenuClick}
        onKeyDown={handleOnMenuClick}
        role="button"
        style={{ paddingLeft: 1 }} // needed to fully display the left border when selected
        tabIndex={0}
      >
        <Select
          menuIsOpen={isMenuOpen}
          menuPlacement="auto"
          menuPortalTarget={document.body}
          minMenuHeight={DEFAULT_REACT_SELECT_MAX_HEIGHT}
          onBlur={handleCloseMenu}
          onChange={handleSelectSmartlist}
          options={SMARTLIST_OPTIONS}
          placeholder={t('cadence.form.trigger.selectSmartlist')}
          value={smartlistSelected}
        />
      </div>
    </ClickAwayListener>
  );
};

export default React.memo(SmartlistForm);
