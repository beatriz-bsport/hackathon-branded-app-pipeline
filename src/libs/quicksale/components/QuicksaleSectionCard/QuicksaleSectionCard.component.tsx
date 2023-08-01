import React from 'react';
import { Theme, useMediaQuery } from '@material-ui/core';
import DragIndicator from '@material-ui/icons/DragIndicator';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { QuicksaleSection } from '../../types';
import MuiIcon from '#components/MuiIcon.component';
import useGlobalStyle from '../../globalStyleHook';
import useStyle from './styles';
import SectionName from './SectionName';
import { EditableQuicksaleSectionKey } from '../../constants';

const stopEventPropagation = (e: React.MouseEvent | React.KeyboardEvent) =>
  e.stopPropagation();

type Props = {
  section: QuicksaleSection;
  openSection: (sectionId: string) => void;
  openColorModal?: (sectionId: string) => void;
  archiveSection?: (sectionId: string) => void;
  onSectionEdit?: (
    sectionId: string,
    key: EditableQuicksaleSectionKey,
    value: string,
  ) => void;
  getMapRefInAdminView?: () => Map<string, HTMLButtonElement>;
  openIconSelector?: (sectionId: string) => void;
  adminView?: boolean;
  isIconBeingEdited?: boolean;
};

const QuicksaleSectionCard: React.FC<Props> = (props) => {
  const {
    section,
    openColorModal,
    archiveSection,
    onSectionEdit,
    getMapRefInAdminView,
    openIconSelector,
    openSection,
    adminView,
    isIconBeingEdited,
  } = props;

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  const classes = useStyle({
    color: section.section_color,
    isIconBeingEdited,
  });
  const globalClasses = useGlobalStyle(isMobile)({
    color: section.section_color,
    admin: adminView,
  });

  const { t } = useTranslation(['quicksale']);

  const openCurrentSection = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      openSection?.(section.section_id);
    },
    [openSection, section.section_id],
  );

  const openColorModalForCurrentSection = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      openColorModal?.(section.section_id);
    },
    [openColorModal, section.section_id],
  );

  const openIconSelectorForCurrentSection = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      openIconSelector?.(section.section_id);
    },
    [openIconSelector, section.section_id],
  );

  const setCurrentSectionRef = React.useCallback(
    (currentNode: HTMLButtonElement) => {
      if (!getMapRefInAdminView) return;
      const map = getMapRefInAdminView();
      if (currentNode) {
        map.set(section.section_id, currentNode);
      } else {
        map.delete(section.section_id);
      }
    },
    [getMapRefInAdminView, section.section_id],
  );

  const archiveCurrentSection = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      archiveSection?.(section.section_id);
    },
    [archiveSection, section.section_id],
  );

  return (
    <div
      className={classNames(
        globalClasses.quicksaleCardContainer,
        classes.container,
      )}
      data-testid="section-card-container"
      onClick={openCurrentSection}
      onKeyDown={stopEventPropagation}
      role="button"
      tabIndex={0}
    >
      <div className={classes.cardHeader}>
        {adminView && (
          <IconButton disableRipple className={classes.dragIconButton}>
            <DragIndicator />
          </IconButton>
        )}

        {adminView ? (
          <IconButton
            ref={setCurrentSectionRef}
            disableRipple
            className={classes.sectionIconButton}
            id={`editable-card-icon-${section.section_id}`}
            onClick={openIconSelectorForCurrentSection}
          >
            <MuiIcon
              className={classes.sectionIcon}
              icon={section.section_icon}
            />
          </IconButton>
        ) : (
          <MuiIcon
            className={classes.sectionIcon}
            icon={section.section_icon}
          />
        )}

        <SectionName
          admin={adminView}
          color={section.section_color}
          onSectionEdit={onSectionEdit}
          sectionId={section.section_id}
          sectionName={section.section_name}
        />
      </div>

      <div className={classes.cardFooter}>
        <Typography variant="caption">
          {section.items.length}{' '}
          {t('sectionCard.item', { count: section.items.length })}
        </Typography>
      </div>

      <div className={globalClasses.quicksaleCardActions}>
        <IconButton
          disableRipple
          className={globalClasses.quicksaleCardAction}
          onClick={openColorModalForCurrentSection}
        >
          <div className={globalClasses.quicksaleCardColorPickerButton} />
        </IconButton>
        <IconButton
          disableRipple
          className={globalClasses.quicksaleCardAction}
          onClick={archiveCurrentSection}
        >
          <DeleteIcon className={globalClasses.quicksaleCardDeleteIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export default React.memo(QuicksaleSectionCard);
