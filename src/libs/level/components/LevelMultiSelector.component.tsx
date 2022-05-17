import React from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';

import { Level } from '../types';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import { LevelMenuItem } from './LevelMenuItem.component';
import LevelComponent from './Level.component';
import { getGroupOptionsForSelect } from '../utils';

export type Props = {
  customLevels: Level[];
  selectedLevels: number[] | null;
  inScrollBar?: boolean;
  error?: boolean;
  onSelect: (levelId: number[]) => void;
};

export const LevelMultiSelector: React.FC<Props> = ({
  customLevels = [],
  selectedLevels,
  inScrollBar = false,
  onSelect,
}) => {
  const { t } = useTranslation(['offer']);

  const groupedOption = getGroupOptionsForSelect(customLevels ?? [], t);
  return (
    <MaterialUISelector
      value={
        selectedLevels
          ? customLevels
              .map((level) => ({ value: level.id, label: level.name }))
              .filter((l) => selectedLevels?.includes(l.value))
          : []
      }
      isMenuListPaddingDisabled
      placeholder={t('levels.select.placeholder')}
      itemRenderer={(itemProps) => {
        return (
          <LevelMenuItem
            level={customLevels?.find(
              (level) => level.id === itemProps.data.value,
            )}
            isSelected={itemProps.isSelected}
          />
        );
      }}
      chipsRenderer={({ data, onDelete }) => {
        return (
          <LevelComponent
            customLevel={customLevels.find((l) => l.id === data.value)}
            isChip
            showVoid
            onRemove={onDelete}
          />
        );
      }}
      options={groupedOption}
      onChange={(options: { value: number; label: string }[]) => {
        onSelect(options.map((o) => o.value));
      }}
      inScrollBar={inScrollBar}
      isMulti
      // Temporarly until the selector is uniform
      classes={{
        control: {
          height: 22,
        },
        placeholder: {
          fontSize: 14,
          color: '#808080',
        },
      }}
    />
  );
};

export default pure(LevelMultiSelector);
