import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { pure } from 'recompose';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames';

import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import ModalConfirm from '#components/ModalConfirm.component';
import CreateLevelModalDialog from './CreateLevelModal.dialog';
import { LevelMenuItem } from './LevelMenuItem.component';
import LevelComponent from './Level.component';
import { getGroupOptionsForSelect } from '../utils';

import { OptionCallback } from '../../../state/types';
import { Level } from '../types';

export type Props = {
  id?: string;
  customLevels: Level[];
  memoryLevels?: Level[];
  selectedLevel: number | null;
  inScrollBar?: boolean;
  error?: boolean;
  isDisabled?: boolean;
  name?: string;
  selectorClass?: string;
  noLabel?: boolean;
  containerStyle?: string;
  buttonContainerStyle?: string;
  fetchLevelList: () => void;
  onCreateLevel: (
    values: Omit<Level, 'id'>,
    options: OptionCallback<Level>,
  ) => void;
  onEditLevel: (
    id: number,
    values: Omit<Level, 'id'>,
    options: OptionCallback<Level>,
  ) => void;
  onDeleteLevel: (levelId: number) => void;
  onSelect: (levelId: number | null) => void;
};

export const LevelSelector: React.FC<Props> = ({
  id,
  customLevels = [],
  memoryLevels = [],
  selectedLevel,
  inScrollBar = false,
  error = false,
  isDisabled = false,
  name,
  selectorClass,
  noLabel,
  containerStyle,
  buttonContainerStyle,
  fetchLevelList,
  onCreateLevel,
  onEditLevel,
  onDeleteLevel,
  onSelect,
}) => {
  const { t } = useTranslation(['offer']);
  const classes = useStyles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLevelId, setEditLevelId] = useState<number>(null);
  const [deleteLevelId, setDeleteLevelId] = useState<number>(null);

  const handleModalSubmit = useCallback(
    ({
      values,
      options,
    }: {
      values: Omit<Level, 'id'>;
      options: OptionCallback<Level>;
    }) => {
      // @ts-expect-error
      if (values.id) {
        // @ts-expect-error
        onEditLevel(values.id, values, {
          onSuccess: () => {
            setEditLevelId(null);
            setIsModalOpen(false);

            fetchLevelList();
            options.onSuccess();
          },
          onError: options.onError,
        });
        return;
      }

      onCreateLevel(
        {
          ...values,
        },
        {
          onSuccess: (data) => {
            setEditLevelId(null);
            setIsModalOpen(false);
            onSelect(data.id);
            fetchLevelList();
            options.onSuccess();
          },
          onError: options.onError,
        },
      );
    },
    [fetchLevelList, onCreateLevel, onEditLevel, onSelect],
  );

  const handleConfirm = useCallback(() => {
    onDeleteLevel(deleteLevelId);
    setIsModalOpen(false);
    setDeleteLevelId(null);
  }, [deleteLevelId, onDeleteLevel]);

  const handleChange = useCallback(
    (option: { value: number; label: string }) => onSelect(option.value),
    [onSelect],
  );

  const handleEditLevel = useCallback((levelId) => {
    setEditLevelId(levelId);
    setIsModalOpen(true);
  }, []);

  const handleDeleteLevel = useCallback((levelId) => {
    setDeleteLevelId(levelId);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const getLevelitem = useCallback(
    (value) => {
      return customLevels?.find((level) => level?.id === value);
    },
    [customLevels],
  );

  const renderLevelItem = useCallback(
    (itemProps) => {
      return (
        <LevelMenuItem
          withEdit
          isSelected={itemProps.isSelected}
          level={getLevelitem(itemProps.data.value)}
          onDeleteLevel={handleDeleteLevel}
          onEditLevel={handleEditLevel}
        />
      );
    },
    [getLevelitem, handleDeleteLevel, handleEditLevel],
  );

  const groupedOption = getGroupOptionsForSelect(customLevels ?? [], t);

  return (
    <>
      <div className={classNames(containerStyle)}>
        {!noLabel && (
          <FormLabel className={classes.label}>
            {`${t('offer:levels.select.title')} *`}
          </FormLabel>
        )}

        <MaterialUISelector
          // dirty trick to close selector on click for popup edit/create/delete
          key={`${editLevelId}-${deleteLevelId}-${isModalOpen ? 'y' : 'n'}`}
          isMenuListPaddingDisabled
          chipsRenderer={() => {
            return (
              <LevelComponent
                isChip
                showVoid
                customLevel={[...customLevels, ...memoryLevels].find(
                  (l) => l.id === selectedLevel,
                )}
              />
            );
          }}
          className={classNames(selectorClass)}
          error={error}
          headerListRenderer={() => (
            <div className={classes.buttonSelectWrapper}>
              <Button
                className={classNames(
                  classes.buttonSelect,
                  buttonContainerStyle,
                )}
                color="primary"
                onClick={handleOpenModal}
                size="small"
              >
                <AddIcon className={classes.icon} />
                {t('levels.select.add')}
              </Button>
              <Divider />
            </div>
          )}
          id={id}
          inScrollBar={inScrollBar}
          isDisabled={isDisabled}
          itemRenderer={renderLevelItem}
          name={name}
          onChange={handleChange}
          options={groupedOption}
          placeholder={t('offer:levels.select.placeholder')}
          value={
            selectedLevel
              ? [...customLevels, ...memoryLevels]
                  .map((level) => ({ value: level.id, label: level.name }))
                  .find((l) => l.value === selectedLevel)
              : null
          }
        />
        {!isDisabled && (
          <Button
            className={classNames(
              buttonContainerStyle,
              classes.fitContentOnMobile,
              {
                [classes.button]: !buttonContainerStyle,
              },
            )}
            color="primary"
            onClick={handleOpenModal}
            size="small"
          >
            <AddIcon className={classes.icon} />
            {t('levels.select.add')}
          </Button>
        )}
      </div>

      {isModalOpen && (
        <CreateLevelModalDialog
          initial={
            editLevelId ? customLevels.find((l) => l.id === editLevelId) : null
          }
          onClose={() => {
            setIsModalOpen(false);
            setEditLevelId(null);
          }}
          // @ts-expect-error
          onSubmit={handleModalSubmit}
          open={isModalOpen}
        />
      )}
      {deleteLevelId && (
        <ModalConfirm
          handleCancel={() => setDeleteLevelId(null)}
          handleConfirm={handleConfirm}
          open={!!deleteLevelId}
          options={{
            title: 'offer:levels.deleteModal.title',
            Content: () => (
              <div>
                <div>{t('offer:levels.deleteModal.content')}</div>
                <div>{t('offer:levels.deleteModal.content2')}</div>
              </div>
            ),
            isDeletion: true,
          }}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    fontSize: 12,
  },
  buttonSelect: {
    color: theme.palette.primary.main,
    backgroundColor: chroma(theme.palette.primary.main).brighten(1.5).hex(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      alignSelf: 'stretch',
      display: 'flex',
    },
  },
  buttonSelectWrapper: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  button: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  icon: {
    fill: theme.palette.primary.main,
    scrollMarginRight: theme.spacing(1),
  },
  fitContentOnMobile: {
    [theme.breakpoints.down('xs')]: {
      width: 'fit-content',
    },
  },
}));

export default pure(LevelSelector);
