// @ts-nocheck
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
      isMenuListPaddingDisabled
      isMulti
      chipsRenderer={({ data, onDelete }) => {
        return (
          <LevelComponent
            isChip
            showVoid
            customLevel={customLevels.find((l) => l.id === data.value)}
            onRemove={onDelete}
          />
        );
      }}
      classes={{
        control: {
          height: 22,
        },
        placeholder: {
          fontSize: 14,
          color: '#808080',
        },
      }}
      inScrollBar={inScrollBar}
      itemRenderer={(itemProps) => {
        return (
          <LevelMenuItem
            isSelected={itemProps.isSelected}
            level={customLevels?.find(
              (level) => level.id === itemProps.data.value,
            )}
          />
        );
      }}
      onChange={(options: { value: number; label: string }[]) => {
        onSelect(options.map((o) => o.value));
      }}
      options={groupedOption}
      placeholder={t('levels.select.placeholder')}
      // Temporarly until the selector is uniform
      value={
        selectedLevels
          ? customLevels
              .map((level) => ({ value: level.id, label: level.name }))
              .filter((l) => selectedLevels?.includes(l.value))
          : []
      }
    />
  );
};

export default pure(LevelMultiSelector);
