import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AddCircle from '@material-ui/icons/AddCircle';
import Popover from '@material-ui/core/Popover';
import ButtonBase from '@material-ui/core/ButtonBase';
import FuzzySearchIcon from '#src/components/search/FuzzySearchIcon.component';
import MuiIcon from '#src/components/MuiIcon.component';
import muiIconNames from '#src/components/input/muiIcon/muiIconNames';
import { EditableQuicksaleSectionKey } from '../../constants';
import useStyle from './styles';
import QuicksaleSectionCard from '../QuicksaleSectionCard';
import QuicksaleSectionCardSkeleton from './QuicksaleSectionCardSkeleton';
import type { QuicksaleSection } from '../../types';
import DragAndDrop from '../DragAndDrop';

const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();

type Props = {
  sectionList?: Array<QuicksaleSection>;
  loading?: boolean;
  onSectionClick: (sectionId: string) => void;
  onSectionEdit?: (
    sectionId: string,
    key: EditableQuicksaleSectionKey,
    value: string,
  ) => void;
  archiveSection?: (sectionId: string) => void;
  openColorModal?: (sectionId: string) => void;
  addSection?: () => void;
  isQuicksaleInterfaceView?: boolean;
  onSectionReorder: (
    draggedItemIndex: number,
    dropzoneIndex: number,
  ) => (event?: React.DragEvent) => void;
};

const QuicksaleConfigurationSectionList: React.FC<Props> = (props) => {
  const {
    sectionList,
    loading,
    onSectionClick,
    onSectionEdit,
    archiveSection,
    openColorModal,
    addSection,
    isQuicksaleInterfaceView,
    onSectionReorder,
  } = props;
  const { t } = useTranslation(['quicksale']);

  const [editedSectionId, setEditedSectionId] = useState('');
  const iconSelectorRef = useRef<Map<string, HTMLButtonElement> | null>(null);

  const getRefMap = useCallback((): Map<string, HTMLButtonElement> => {
    if (!iconSelectorRef.current) iconSelectorRef.current = new Map();
    return iconSelectorRef.current;
  }, []);

  const closeIconSelector = useCallback(() => setEditedSectionId(''), []);

  const sectionToEdit = useMemo(() => {
    const refMap = getRefMap();
    return refMap.get(editedSectionId) || null;
  }, [editedSectionId, getRefMap]);

  const classes = useStyle({ isQuicksaleInterfaceView });
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  const iconSelectorItemRenderer = useCallback(
    (data: { icon: string }) => {
      if (!onSectionEdit) return <></>;

      return data?.icon ? (
        <ButtonBase
          className={classes.iconButton}
          onClick={() => {
            onSectionEdit(
              editedSectionId,
              EditableQuicksaleSectionKey.icon,
              data?.icon,
            );
            closeIconSelector();
          }}
        >
          <div>
            <MuiIcon className={classes.icon} icon={data?.icon} />
          </div>
        </ButtonBase>
      ) : (
        <div />
      );
    },
    [
      classes.icon,
      classes.iconButton,
      closeIconSelector,
      editedSectionId,
      onSectionEdit,
    ],
  );

  const iconList = useMemo(
    () =>
      Object.keys(muiIconNames).map((icon) => ({
        icon,
        key: icon,
      })),
    [],
  );

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const onDragStart = (id: string) => () => {
    setTimeout(() => {
      setDraggedItemIndex(Number(id));
    }, 0);
  };

  const onDragEnd = () => () => {
    setDraggedItemIndex(null);
  };

  const handleDrop = useCallback(
    (draggedId: string, dropTargetId: string) => () => {
      if (!onSectionReorder || !sectionList) return;

      const fromIndex = parseInt(draggedId, 10);
      let insertionIndex: number;

      if (dropTargetId.startsWith('before-')) {
        insertionIndex = parseInt(dropTargetId.replace('before-', ''), 10);
      } else if (dropTargetId.startsWith('after-')) {
        insertionIndex = parseInt(dropTargetId.replace('after-', ''), 10) + 1;
      } else if (dropTargetId === 'end') {
        insertionIndex = sectionList.length;
      } else {
        // Fallback
        insertionIndex = parseInt(dropTargetId, 10);
      }

      // Calculate the final position considering the item removal
      let finalIndex = insertionIndex;
      if (fromIndex < insertionIndex) {
        finalIndex = insertionIndex - 1;
      }

      // Ensure we don't go out of bounds
      finalIndex = Math.max(0, Math.min(finalIndex, sectionList.length - 1));

      onSectionReorder(fromIndex, finalIndex)();
      setDraggedItemIndex(null);
    },
    [onSectionReorder, sectionList],
  );

  const spacing = isMobile ? 2 : 3;

  return (
    <div
      className={classes.sectionListContainer}
      data-testid="quicksale-configuration-section-list"
    >
      <AutoSizer>
        {(autoSizerProps: { height: number; width: number }) => (
          <>
            {loading ? (
              <Grid
                container
                className={classes.sectionContainer}
                spacing={spacing}
                style={{
                  maxHeight: autoSizerProps.height,
                  width: autoSizerProps.width,
                }}
              >
                {[...Array(12).keys()].map((index) => (
                  <Grid key={index} item lg={4} sm={6} xs={12}>
                    <QuicksaleSectionCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <DragAndDrop
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
                onDrop={handleDrop}
              >
                <Grid
                  container
                  className={classes.sectionContainer}
                  spacing={spacing}
                  style={{
                    maxHeight: autoSizerProps.height,
                    width: autoSizerProps.width,
                  }}
                >
                  {(sectionList ?? []).map((section, index) => (
                    <Grid
                      key={section.section_id}
                      item
                      className={classes.sectionItem}
                      lg={4}
                      sm={6}
                      style={{ position: 'relative' }}
                      xs={12}
                    >
                      {/* Left drop zone (before) */}
                      {draggedItemIndex !== null &&
                        draggedItemIndex !== index && (
                          <DragAndDrop.DropZone
                            id={`before-${index}`}
                            style={{
                              position: 'absolute',
                              left: '-2px',
                              top: spacing * 2,
                              width: '50%',
                              height: `calc(100% - ${spacing * 4}px)`,
                              zIndex: 10,
                              backgroundColor: 'transparent',
                            }}
                          >
                            {({ activeDropTarget }) => (
                              <>
                                {activeDropTarget === `before-${index}` && (
                                  <div className={classes.leftDropIndicator}>
                                    <div className={classes.verticalDropLine} />
                                  </div>
                                )}
                              </>
                            )}
                          </DragAndDrop.DropZone>
                        )}

                      {/* Right drop zone (after) */}
                      {draggedItemIndex !== null &&
                        draggedItemIndex !== index && (
                          <DragAndDrop.DropZone
                            id={`after-${index}`}
                            style={{
                              position: 'absolute',
                              right: '-2px',
                              top: spacing * 2,
                              width: '50%',
                              height: `calc(100% - ${spacing * 4}px)`,
                              zIndex: 10,
                              backgroundColor: 'transparent',
                            }}
                          >
                            {({ activeDropTarget }) => (
                              <>
                                {activeDropTarget === `after-${index}` && (
                                  <div className={classes.rightDropIndicator}>
                                    <div className={classes.verticalDropLine} />
                                  </div>
                                )}
                              </>
                            )}
                          </DragAndDrop.DropZone>
                        )}

                      {/* The actual draggable section card */}
                      <DragAndDrop.Item id={index.toString()}>
                        {({ isDragged }) =>
                          !isDragged && (
                            <QuicksaleSectionCard
                              adminView={!isQuicksaleInterfaceView}
                              archiveSection={archiveSection}
                              getMapRefInAdminView={getRefMap}
                              isIconBeingEdited={
                                editedSectionId === section.section_id
                              }
                              onSectionEdit={onSectionEdit}
                              openColorModal={openColorModal}
                              openIconSelector={setEditedSectionId}
                              openSection={onSectionClick}
                              section={section}
                            />
                          )
                        }
                      </DragAndDrop.Item>
                    </Grid>
                  ))}
                  {!isQuicksaleInterfaceView && (
                    <Grid item lg={4} sm={6} xs={12}>
                      <div
                        className={classes.addSectionIconButton}
                        onClick={addSection}
                        onKeyDown={stopPropagation}
                        role="button"
                        tabIndex={0}
                      >
                        <AddCircle className={classes.addSectionIcon} />
                      </div>
                    </Grid>
                  )}
                </Grid>
              </DragAndDrop>
            )}
          </>
        )}
      </AutoSizer>
      <Popover
        anchorEl={sectionToEdit}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={closeIconSelector}
        open={sectionToEdit !== null}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper
          className={classes.iconSelectorContainer}
          id="section-icon-selector"
        >
          <FuzzySearchIcon
            iconRender
            startWithAll
            customClasses={{ iconGrid: classes.iconGrid }}
            gridWidth={isMobile ? 300 : 550}
            itemRenderer={iconSelectorItemRenderer}
            items={iconList}
            numberOfColumns={isMobile ? 3 : 6}
            placeholder={t('iconSelector.searchPlaceholder')}
            searchFields={['icon']}
          />
        </Paper>
      </Popover>
    </div>
  );
};

export default React.memo(QuicksaleConfigurationSectionList);
