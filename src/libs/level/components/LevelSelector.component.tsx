// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { pure } from 'recompose';

import {
  ButtonBase,
  Divider,
  FormLabel,
  makeStyles,
  Theme,
} from '@material-ui/core';
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
      if (values.id) {
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

  const handleDelete = useCallback(() => {
    onDeleteLevel(deleteLevelId);
    setIsModalOpen(false);
    setDeleteLevelId(null);
  }, [deleteLevelId, onDeleteLevel]);

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
          id={id}
          key={`${editLevelId}-${deleteLevelId}-${isModalOpen ? 'y' : 'n'}`}
          value={
            selectedLevel
              ? [...customLevels, ...memoryLevels]
                  .map((level) => ({ value: level.id, label: level.name }))
                  .find((l) => l.value === selectedLevel)
              : null
          }
          isMenuListPaddingDisabled
          placeholder={t('offer:levels.select.placeholder')}
          headerListRenderer={() => (
            <div className={classes.buttonSelectWrapper}>
              <ButtonBase
                color="primary"
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className={classes.buttonSelect}
              >
                <AddIcon className={classes.icon} />
                {t('levels.select.add')}
              </ButtonBase>
              <Divider />
            </div>
          )}
          itemRenderer={(itemProps) => {
            return (
              <LevelMenuItem
                level={customLevels?.find(
                  (level) => level.id === itemProps.data.value,
                )}
                isSelected={itemProps.isSelected}
                onEditLevel={(levelId) => {
                  setEditLevelId(levelId);
                  setIsModalOpen(true);
                }}
                onDeleteLevel={(levelId) => {
                  setDeleteLevelId(levelId);
                }}
                withEdit
              />
            );
          }}
          chipsRenderer={() => {
            return (
              <LevelComponent
                customLevel={[...customLevels, ...memoryLevels].find(
                  (l) => l.id === selectedLevel,
                )}
                isChip
                showVoid
              />
            );
          }}
          options={groupedOption}
          onChange={(option: { value: number; label: string }) =>
            onSelect(option.value)
          }
          inScrollBar={inScrollBar}
          error={error}
          isDisabled={isDisabled}
          name={name}
          className={classNames(selectorClass)}
        />
        {!isDisabled && (
          <ButtonBase
            color="primary"
            onClick={() => {
              setIsModalOpen(true);
            }}
            className={classNames(
              {
                [classes.button]: !buttonContainerStyle,
                buttonContainerStyle,
              },
              classes.fitContentOnMobile,
            )}
          >
            <AddIcon className={classes.icon} />
            {t('levels.select.add')}
          </ButtonBase>
        )}
      </div>

      {isModalOpen && (
        <CreateLevelModalDialog
          initial={
            editLevelId ? customLevels.find((l) => l.id === editLevelId) : null
          }
          open={isModalOpen}
          onSubmit={handleModalSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditLevelId(null);
          }}
        />
      )}
      {deleteLevelId && (
        <ModalConfirm
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
          handleConfirm={handleDelete}
          handleCancel={() => setDeleteLevelId(null)}
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
