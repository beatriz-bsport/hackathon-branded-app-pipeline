import React from 'react';

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
  useSensors,
  MouseSensor,
  TouchSensor,
  useSensor,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import CadenceListItem, {
  CadenceListItemLoading,
} from './CadenceListItem.component';

import type { Cadence } from '#libs/sequential_marketing/types';

type Props = {
  cadences: Cadence[];
  cadenceLoading: boolean;
  onClickItem?: (cadence: Cadence) => void;
  onShow?: (id: number) => void;
  onEdit?: (cadence: Cadence) => void;
  onDelete?: (cadence: Cadence) => void;
  onRestore?: (id: number) => void;
  archivedVersion?: boolean;
  selectedId?: number;
  updateCadencePriorityIndex?: (
    id: number,
    data: { priority_index: number },
  ) => void;
};

export const CadenceList: React.FC<Props> = ({
  cadences,
  cadenceLoading,
  onShow,
  onEdit,
  onDelete,
  onRestore,
  onClickItem,
  archivedVersion,
  selectedId,
  updateCadencePriorityIndex,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();
  const [collapseOpen, setCollapseOpen] = React.useState(false);

  const handleEditCadence = React.useCallback(
    (cadence: Cadence) => onEdit(cadence),
    [onEdit],
  );
  const handleShowCadence = React.useCallback(
    (cadence: Cadence) => onShow(cadence.id),
    [onShow],
  );
  const handleDeleteCadence = React.useCallback(
    (cadence: Cadence) => onDelete(cadence),
    [onDelete],
  );
  const handleRestoreCadence = React.useCallback(
    (cadence: Cadence) => onRestore(cadence.id),
    [onRestore],
  );
  const handleClickItem = React.useCallback(
    (cadence: Cadence) => onClickItem(cadence),
    [onClickItem],
  );
  const handleSwitchCollapseState = React.useCallback(
    () => setCollapseOpen(!collapseOpen),
    [setCollapseOpen, collapseOpen],
  );

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const cadenceSortableItems = React.useMemo(() => {
    return [...(cadences || [])]?.filter(
      (cadence) =>
        !!cadence &&
        !!cadence?.priority_index &&
        typeof cadence?.priority_index === 'number',
    );
  }, [cadences]);

  const handleDragEnd = React.useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      const activateCadenceId = active?.data.current?.cadence_id;
      const overCadenceIndex = over?.id;
      if (activateCadenceId && overCadenceIndex) {
        updateCadencePriorityIndex(activateCadenceId, {
          priority_index: parseInt(overCadenceIndex),
        });
      }
    },
    [updateCadencePriorityIndex],
  );

  if (cadenceLoading || !cadences) {
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
          <Typography variant="h5" color="textSecondary">
            {`${t('cadence.archive.archivedHeader')}${'\u00A0'}(${
              cadences?.length || 0
            })${'\u00A0'}`}
          </Typography>
        </ButtonBase>

        <Collapse in={collapseOpen}>
          <List>
            {cadences.map((cadence) => (
              <CadenceListItem
                key={`cadence_disabled${cadence.id}`}
                withoutIndex
                dense
                cadence={cadence}
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
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <List>
        <SortableContext
          items={cadenceSortableItems?.map((cadence) =>
            cadence.priority_index?.toString(),
          )}
          strategy={verticalListSortingStrategy}
        >
          {cadenceSortableItems.map((cadence) => (
            <CadenceListItem
              sortable
              key={`cadence_enabled${cadence.id}`}
              cadence={cadence}
              onClick={onClickItem && handleClickItem}
              onShow={onShow && handleShowCadence}
              onEdit={onEdit && handleEditCadence}
              onDelete={onDelete && handleDeleteCadence}
              onRestore={onRestore && handleRestoreCadence}
              selectedId={selectedId}
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
