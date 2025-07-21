import React from 'react';
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
  } = props;
  const { t } = useTranslation(['quicksale']);

  const [editedSectionId, setEditedSectionId] = React.useState('');
  const iconSelectorRef = React.useRef(null);

  const getRefMap = React.useCallback((): Map<string, HTMLButtonElement> => {
    if (!iconSelectorRef.current) iconSelectorRef.current = new Map();
    return iconSelectorRef.current;
  }, []);

  const closeIconSelector = React.useCallback(() => setEditedSectionId(''), []);

  const sectionToEdit = React.useMemo(() => {
    const refMap = getRefMap();
    return refMap.get(editedSectionId) || null;
  }, [editedSectionId, getRefMap]);

  const classes = useStyle({ isQuicksaleInterfaceView });
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  const iconSelectorItemRenderer = React.useCallback(
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

  const iconList = React.useMemo(
    () =>
      Object.keys(muiIconNames).map((icon) => ({
        icon,
        key: icon,
      })),
    [],
  );

  return (
    <div
      className={classes.sectionListContainer}
      data-testid="quicksale-configuration-section-list"
    >
      <AutoSizer>
        {(autoSizerProps: { height: number; width: number }) => (
          <Grid
            container
            className={classes.sectionContainer}
            spacing={isMobile ? 2 : 3}
            style={{
              maxHeight: autoSizerProps.height,
              width: autoSizerProps.width,
            }}
          >
            {loading ? (
              [...Array(12).keys()].map((index) => (
                <Grid key={index} item lg={4} sm={6} xs={12}>
                  <QuicksaleSectionCardSkeleton />
                </Grid>
              ))
            ) : (
              <>
                {(sectionList ?? []).map((section) => (
                  <Grid
                    key={section.section_id}
                    item
                    className={classes.sectionItem}
                    sm={6}
                    xs={12}
                    {...(isQuicksaleInterfaceView ? { md: 4 } : { lg: 4 })}
                  >
                    <QuicksaleSectionCard
                      adminView={!isQuicksaleInterfaceView}
                      archiveSection={archiveSection}
                      getMapRefInAdminView={getRefMap}
                      isIconBeingEdited={editedSectionId === section.section_id}
                      onSectionEdit={onSectionEdit}
                      openColorModal={openColorModal}
                      openIconSelector={setEditedSectionId}
                      openSection={onSectionClick}
                      section={section}
                    />
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
              </>
            )}
          </Grid>
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
