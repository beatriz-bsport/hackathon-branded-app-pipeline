import React from 'react';
import uniq from 'lodash/uniq';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import List from '@material-ui/core/List';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type { Cadence } from '#src/libs/sequential_marketing/types';
import CadenceListItem, {
  CadenceListItemLoading,
} from './CadenceListItem.component';

type Props = {
  cadences: Cadence[];
  cadenceLoading: boolean;
  archivedVersion?: boolean;
  selectedId?: number;
  onOpen?: (cadence: Cadence) => void;
  onClickItem?: (cadence: Cadence) => void;
  onDelete?: (cadence: Cadence) => void;
  onDuplicate?: (cadence: Cadence) => void;
  onEdit?: (cadence: Cadence) => void;
  onRestore?: (id: number) => void;
  updateCadencePriorityIndex?: (
    id: number,
    data: { priority_index: number },
  ) => void;
};

export const CadenceList: React.FC<Props> = ({
  cadences,
  cadenceLoading,
  archivedVersion,
  selectedId,
  onOpen,
  onClickItem,
  onDelete,
  onDuplicate,
  onEdit,
  onRestore,
  updateCadencePriorityIndex,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [cadenceUpdatedList, setCadenceUpdatedList] = React.useState<Cadence[]>(
    [],
  );

  const handleRestoreCadence = React.useCallback(
    (cadence: Cadence) => onRestore(cadence.id),
    [onRestore],
  );

  const handleSwitchCollapseState = React.useCallback(
    () => setCollapseOpen(!collapseOpen),
    [setCollapseOpen, collapseOpen],
  );

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const cadenceSortableItems = React.useMemo(() => {
    return [...(cadences ?? [])]?.filter(
      (cadence) =>
        !!cadence &&
        !!cadence?.priority_index &&
        typeof cadence?.priority_index === 'number',
    );
  }, [cadences]);

  const cadenceSortableIndexes = React.useMemo(
    () =>
      cadenceSortableItems?.map((cadence) =>
        cadence.priority_index?.toString(),
      ),
    [cadenceSortableItems],
  );

  const priorityIndexLoading =
    cadenceSortableIndexes?.length !== uniq(cadenceSortableIndexes)?.length;

  const getUpdatedCadenceList = React.useCallback(
    (
      activeCadenceId: number,
      oldPriorityIndex: number,
      newPriorityIndex: number,
    ) => {
      return cadenceSortableItems
        .map((cadence) => {
          if (newPriorityIndex > oldPriorityIndex) {
            if (cadence.id === activeCadenceId) {
              return { ...cadence, priority_index: newPriorityIndex };
            }
            if (
              cadence.priority_index >= oldPriorityIndex + 1 &&
              cadence.priority_index <= newPriorityIndex
            ) {
              return { ...cadence, priority_index: cadence.priority_index - 1 };
            }
          } else if (newPriorityIndex < oldPriorityIndex) {
            if (cadence.id === activeCadenceId) {
              return { ...cadence, priority_index: newPriorityIndex };
            }
            if (
              cadence.priority_index >= newPriorityIndex &&
              cadence.priority_index <= oldPriorityIndex - 1
            ) {
              return { ...cadence, priority_index: cadence.priority_index + 1 };
            }
          }
          return cadence;
        })
        ?.sort((a, b) => a.priority_index - b.priority_index);
    },
    [cadenceSortableItems],
  );

  const handleDragEnd = React.useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;

      if (over?.id !== active?.id) {
        const activeCadenceId = parseInt(active.id);
        const activeCadenceIndex = active.data?.current?.cadencePriorityIndex;
        const overCadenceIndex = over.data?.current?.cadencePriorityIndex;
        if (activeCadenceId && overCadenceIndex) {
          setCadenceUpdatedList(
            getUpdatedCadenceList(
              activeCadenceId,
              activeCadenceIndex,
              overCadenceIndex,
            ),
          );
          updateCadencePriorityIndex(activeCadenceId, {
            priority_index: overCadenceIndex,
          });
        }
      }
    },
    [getUpdatedCadenceList, updateCadencePriorityIndex],
  );

  const capitalizedArchivedTitle = React.useMemo(() => {
    const archivedTitle = `${t('audience.archive.archivedHeader')} (${
      cadences?.length || 0
    })`;
    return archivedTitle.charAt(0).toUpperCase() + archivedTitle.slice(1);
  }, [cadences?.length, t]);

  React.useEffect(() => {
    !priorityIndexLoading && setCadenceUpdatedList(cadenceSortableItems);
  }, [cadenceSortableItems, priorityIndexLoading]);

  if (
    !archivedVersion &&
    (cadenceLoading || !cadences) &&
    !cadenceUpdatedList?.length
  ) {
    return (
      <>
        {(cadences?.map((item) => item?.id) || [1, 2, 3]).map((_idx) => (
          <CadenceListItemLoading key={`cadence_item_loading${_idx}`} />
        ))}
      </>
    );
  }

  if (archivedVersion) {
    return (
      <div className={classes.whiteSection}>
        <ButtonBase
          className={classes.buttonTitle}
          onClick={handleSwitchCollapseState}
        >
          {collapseOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          <Typography color="textSecondary" variant="h5">
            {capitalizedArchivedTitle}
          </Typography>
        </ButtonBase>

        <Collapse in={collapseOpen}>
          <List>
            {cadences.map((cadence) => (
              <CadenceListItem
                key={`cadence_disabled${cadence.id}`}
                archived
                dense
                withoutIndex
                cadence={cadence}
                hasInvalidPaths={cadence.has_disabled_finer_grained_items}
                onRestore={onRestore && handleRestoreCadence}
              />
            ))}
          </List>
        </Collapse>
      </div>
    );
  }

  return (
    <DndContext
      autoScroll={false}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <List>
        <SortableContext
          items={cadenceUpdatedList?.map((cadence) =>
            cadence?.id?.toString(10),
          )}
          strategy={verticalListSortingStrategy}
        >
          {cadenceUpdatedList?.map((cadence) => (
            <CadenceListItem
              key={`cadence_enabled${cadence.id}`}
              sortable
              cadence={cadence}
              hasInvalidPaths={cadence.has_disabled_finer_grained_items}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onEdit={onEdit}
              onOpen={onOpen}
              onRestore={onRestore && handleRestoreCadence}
              onSelect={onClickItem}
              selected={cadence.id === selectedId}
            />
          ))}
        </SortableContext>
      </List>
    </DndContext>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-Start',
    width: '100%',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    gap: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  whiteSection: {
    backgroundColor: 'white',
    borderRadius: theme.spacing(1),
  },
}));

export default React.memo(CadenceList);
