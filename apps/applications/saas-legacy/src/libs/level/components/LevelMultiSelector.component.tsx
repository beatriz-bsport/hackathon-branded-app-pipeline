import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';

import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import { Level } from '../types';
import { LevelMenuItem } from './LevelMenuItem.component';
import LevelComponent from './Level.component';
import { getGroupOptionsForSelect } from '../utils';

export type Props = {
  customLevels: Level[];
  selectedLevels: number[];
  inScrollBar?: boolean;
  onSelect: (levelId: number[]) => void;
  className?: string;
};

const ChipRendererComponent = React.memo(
  ({
    customLevels,
    data,
    onDelete,
  }: {
    customLevels: Level[];
    data: { value: number; label: string };
    onDelete: () => void;
  }) => {
    const customLevel = useMemo(
      () => customLevels.find((level) => level.id === data.value),
      [customLevels, data],
    );

    return (
      <LevelComponent
        isChip
        showVoid
        customLevel={customLevel}
        onRemove={onDelete}
      />
    );
  },
);

const ItemsRendererComponent = React.memo(
  ({
    customLevels,
    data,
    isSelected,
  }: {
    customLevels: Level[];
    data: { value: number; label: string };
    isSelected: boolean;
  }) => {
    const customLevel = useMemo(
      () => customLevels.find((level) => level.id === data.value),
      [customLevels, data],
    );

    return <LevelMenuItem isSelected={isSelected} level={customLevel} />;
  },
);

export const LevelMultiSelector: React.FC<Props> = ({
  customLevels = [],
  selectedLevels,
  inScrollBar = false,
  onSelect,
  className,
}) => {
  const { t } = useTranslation(['offer']);

  const handleChange = useCallback(
    (options: { value: number; label: string }[]) => {
      onSelect(options.map((option) => option.value));
    },
    [onSelect],
  );

  const value = useMemo(
    () =>
      selectedLevels
        ? customLevels
            .map((level) => ({ value: level.id, label: level.name }))
            .filter((level) => selectedLevels?.includes(level.value))
        : [],
    [customLevels, selectedLevels],
  );

  const chipRenderer = useCallback(
    ({ data, onDelete }) => {
      return (
        <ChipRendererComponent
          customLevels={customLevels}
          data={data}
          onDelete={onDelete}
        />
      );
    },
    [customLevels],
  );

  const itemRenderer = useCallback(
    ({ data, isSelected }) => (
      <ItemsRendererComponent
        customLevels={customLevels}
        data={data}
        isSelected={isSelected}
      />
    ),
    [customLevels],
  );

  const groupedOption = getGroupOptionsForSelect(customLevels ?? [], t);

  return (
    <MaterialUISelector
      isMenuListPaddingDisabled
      isMulti
      chipsRenderer={chipRenderer}
      classes={{
        control: {
          height: 22,
        },
        placeholder: {
          fontSize: 14,
          color: '#808080',
        },
      }}
      className={className}
      inScrollBar={inScrollBar}
      itemRenderer={itemRenderer}
      onChange={handleChange}
      // @ts-expect-error
      options={groupedOption}
      placeholder={t('levels.select.placeholder')}
      // Temporarly until the selector is uniform
      value={value}
    />
  );
};

export default pure(LevelMultiSelector);
