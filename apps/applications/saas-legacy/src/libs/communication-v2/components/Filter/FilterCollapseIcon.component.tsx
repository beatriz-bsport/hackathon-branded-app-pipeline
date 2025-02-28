import React from 'react';
import { IconButton } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { useCommunicationFilterContext } from '#src/libs/communication-v2/context/CommunicationFilter.context';
import { useTranslation } from 'react-i18next';

type FilterCollapseIconProps = {
  hasFilters: boolean;
  showFilterModal: boolean;
};

const FilterCollapseIcon: React.FC<FilterCollapseIconProps> = ({
  hasFilters,
  showFilterModal,
}: FilterCollapseIconProps) => {
  const { resetFilters } = useCommunicationFilterContext();
  const { t } = useTranslation('communication');
  if (showFilterModal) {
    return (
      <IconButton aria-label={t('accessibilityText.expandRow')} size="small">
        <KeyboardArrowUp />
      </IconButton>
    );
  }
  if (hasFilters) {
    return (
      <IconButton
        aria-label={t('accessibilityText.expandRow')}
        onClick={resetFilters}
        size="small"
      >
        <Close />
      </IconButton>
    );
  }
  return (
    <IconButton aria-label={t('accessibilityText.expandRow')} size="small">
      <KeyboardArrowDown />
    </IconButton>
  );
};

export default React.memo(FilterCollapseIcon);
