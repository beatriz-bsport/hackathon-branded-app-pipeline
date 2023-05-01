import React from 'react';
import { useMediaQuery, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AddCircle from '@material-ui/icons/AddCircle';
import Popover from '@material-ui/core/Popover';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useTranslation } from 'react-i18next';
import AutoSizer from 'react-virtualized-auto-sizer';
import { QuicksaleSection } from '../../types';
import QuicksaleSectionCard from '../QuicksaleSectionCard';
import FuzzySearchIcon from '#components/search/FuzzySearchIcon.component';
import MuiIcon from '#components/MuiIcon.component';
import muiIconNames from '#components/input/muiIcon/muiIconNames';
import { EditableQuicksaleSectionKey } from '../../constants';
import useStyle from './hook';
import QuicksaleSectionCardSkeleton from './QuicksaleSectionCardSkeleton';

const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();

type Props = {
  sectionList?: Array<QuicksaleSection>;
  loading?: boolean;
  onSectionClick: (sectionId: string) => void;
  onSectionEdit: (
    sectionId: string,
    key: EditableQuicksaleSectionKey,
    value: string,
  ) => void;
  archiveSection: (sectionId: string) => void;
  openColorModal: (sectionId: string) => void;
  addSection: () => void;
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

  const classes = useStyle();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  const iconSelectorItemRenderer = React.useCallback(
    (data: { icon: string }) => {
      return (
        <>
          {data?.icon ? (
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
                <MuiIcon icon={data?.icon} className={classes.icon} />
              </div>
            </ButtonBase>
          ) : (
            <div />
          )}
        </>
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
      data-testid="quicksale-section-list"
      className={classes.sectionListContainer}
    >
      <AutoSizer>
        {(autoSizerProps: { height: number; width: number }) => (
          <Grid
            container
            spacing={isMobile ? 2 : 3}
            className={classes.sectionContainer}
            style={{
              maxHeight: autoSizerProps.height,
              width: autoSizerProps.width,
            }}
          >
            {loading ? (
              <>
                {[...Array(12).keys()].map((index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <QuicksaleSectionCardSkeleton />
                  </Grid>
                ))}
              </>
            ) : (
              <>
                {sectionList.map((section) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={4}
                    key={section.section_id}
                    className={classes.sectionItem}
                  >
                    <QuicksaleSectionCard
                      section={section}
                      openSection={onSectionClick}
                      onSectionEdit={onSectionEdit}
                      archiveSection={archiveSection}
                      openColorModal={openColorModal}
                      getMapRefInAdminView={getRefMap}
                      openIconSelector={setEditedSectionId}
                      adminView
                      isIconBeingEdited={editedSectionId === section.section_id}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={6} lg={4}>
                  <div
                    onClick={addSection}
                    className={classes.addSectionIconButton}
                    role="button"
                    tabIndex={0}
                    onKeyDown={stopPropagation}
                  >
                    <AddCircle className={classes.addSectionIcon} />
                  </div>
                </Grid>
              </>
            )}
          </Grid>
        )}
      </AutoSizer>
      <Popover
        open={sectionToEdit !== null}
        anchorEl={sectionToEdit}
        onClose={closeIconSelector}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
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
            itemRenderer={iconSelectorItemRenderer}
            startWithAll
            items={iconList}
            placeholder={t('iconSelector.searchPlaceholder')}
            searchFields={['icon']}
            customClasses={{ iconGrid: classes.iconGrid }}
            numberOfColumns={isMobile ? 3 : 6}
            gridWidth={isMobile ? 300 : 550}
          />
        </Paper>
      </Popover>
    </div>
  );
};

export default React.memo(QuicksaleConfigurationSectionList);
