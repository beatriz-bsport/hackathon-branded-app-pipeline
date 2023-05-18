import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { v4 as uuid } from 'uuid';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { push } from 'connected-react-router';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme, useMediaQuery } from '@material-ui/core';

import { QuicksaleSection } from '#libs/quicksale/types';
import QuicksaleConfigurationSectionList, {
  ArchivedSectionListItem,
} from '#libs/quicksale/components/QuicksaleConfigurationSectionList';
import {
  DEFAULT_SECTION_ICON,
  EditableQuicksaleSectionKey,
  QuicksaleSectionColor,
} from '#libs/quicksale/constants';
import {
  getLoading,
  getSectionList,
  getUpdateLoading,
} from '#libs/quicksale/selectors';
import ColorPicker from '#libs/quicksale/components/ColorPicker';
import {
  fetchQuicksaleConfiguration as fetchQuicksaleConfigurationAction,
  updateQuicksaleConfiguration,
} from '#libs/quicksale/actions';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { bottomSnackbarInfo } from '#libs/snackbar/actions';

import { Dispatch } from '../../../../state/types';
import { RootState } from '../../../../reducers';
import PromptOnPageLeave from '#components/Prompt';
import useStyle from './hook';

enum ReducerActionType {
  SET_SECTIONS = 'SET_SECTIONS',
  ADD_SECTION = 'ADD_SECTION',
  EDIT_SECTION = 'EDIT_SECTION',
  TOGGLE_DISABLE_SECTION = 'TOGGLE_DISABLE_SECTION',
}

type ReducerAction =
  | { type: ReducerActionType.SET_SECTIONS; payload: QuicksaleSection[] }
  | { type: ReducerActionType.ADD_SECTION }
  | {
      type: ReducerActionType.EDIT_SECTION;
      payload: {
        sectionId: string;
        key: EditableQuicksaleSectionKey;
        value: string;
      };
    }
  | {
      type: ReducerActionType.TOGGLE_DISABLE_SECTION;
      payload: { sectionId: string; disabled: boolean };
    };

type OwnProps = {
  sectionList: QuicksaleSection[];
  openInfoSnackbar: (message: string) => (dispatch: Dispatch) => Promise<void>;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const QuicksaleSectionList: React.FC<Props> = ({
  sectionList,
  openInfoSnackbar,
  fetchQuicksaleConfiguration,
  saveConfiguration,
  pushRouter,
  loading,
  updateLoading,
}) => {
  const { t } = useTranslation(['quicksale']);

  const classes = useStyle();

  const [isSaveNeeded, setIsSaveNeeded] = React.useState(false);

  const [showDisabledSections, setShowDisabledSections] = React.useState(false);

  const toggleDisabledSections = React.useCallback(
    () =>
      setShowDisabledSections(
        (prevShowDisabledSections) => !prevShowDisabledSections,
      ),
    [],
  );
  const toggleDisabledSectionsWithoutPropagation = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleDisabledSections();
    },
    [toggleDisabledSections],
  );
  const newSectionsCount = React.useRef(-1);

  // ==================== Helper alert 'see more' ====================
  const [showFullHelperAlert, setShowFullHelperAlert] = React.useState(false);
  const toggleShowFullHelperAlert = React.useCallback(
    () =>
      setShowFullHelperAlert(
        (prevShowFullHelperAlert) => !prevShowFullHelperAlert,
      ),
    [],
  );
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  const reducer = React.useCallback(
    (state: QuicksaleSection[], action: ReducerAction): QuicksaleSection[] => {
      switch (action.type) {
        case ReducerActionType.SET_SECTIONS:
          return isSaveNeeded ? state : action.payload;
        case ReducerActionType.ADD_SECTION:
          return [
            ...state,
            {
              section_id: uuid(),
              section_name: `${t('cardListPage.newSection')}${
                newSectionsCount && newSectionsCount.current > 0
                  ? ` (${newSectionsCount.current})`
                  : ''
              }`,
              section_icon: DEFAULT_SECTION_ICON,
              section_color: QuicksaleSectionColor.Gray,
              items: [],
              disabled: false,
            },
          ];
        case ReducerActionType.EDIT_SECTION:
          return state.map((section) => {
            if (section.section_id === action.payload.sectionId)
              return {
                ...section,
                [action.payload.key]: action.payload.value,
              };
            return section;
          });
        case ReducerActionType.TOGGLE_DISABLE_SECTION:
          return state.map((section) => {
            if (section.section_id === action.payload.sectionId)
              return {
                ...section,
                disabled: action.payload.disabled,
              };
            return section;
          });
        default:
          return state;
      }
    },
    [isSaveNeeded, t],
  );

  const [unsavedSectionList, dispatch] = React.useReducer(reducer, sectionList);

  // Set sections in reducer when sectionList changes
  React.useEffect(() => {
    dispatch({ type: ReducerActionType.SET_SECTIONS, payload: sectionList });
  }, [sectionList]);

  // Set isSaveNeeded when unsavedSectionList changes
  React.useEffect(() => {
    // the .map is used to remove the items array from the comparison
    // since the items comparison is done in the items page directly
    setIsSaveNeeded(
      unsavedSectionList.length > 0 &&
        !isEqual(
          unsavedSectionList.map((section) => ({ ...section, items: [] })),
          sectionList.map((section) => ({ ...section, items: [] })),
        ),
    );
  }, [sectionList, unsavedSectionList]);

  const unsavedEnabledSectionList = React.useMemo(
    () => unsavedSectionList.filter((section) => !section.disabled),
    [unsavedSectionList],
  );

  const unsavedDisabledSectionList = React.useMemo(
    () => unsavedSectionList.filter((section) => section.disabled),
    [unsavedSectionList],
  );

  const onSectionEdit = React.useCallback(
    (sectionId: string, key: EditableQuicksaleSectionKey, value: string) => {
      dispatch({
        type: ReducerActionType.EDIT_SECTION,
        payload: { sectionId, key, value },
      });
    },
    [],
  );

  const onSectionDisable = React.useCallback(
    (sectionId: string) => {
      dispatch({
        type: ReducerActionType.TOGGLE_DISABLE_SECTION,
        payload: { sectionId, disabled: true },
      });
      openInfoSnackbar('quicksale:cardListPage.categoryArchivedSnackbar');
    },
    [openInfoSnackbar],
  );

  const onSectionEnable = React.useCallback((sectionId: string) => {
    dispatch({
      type: ReducerActionType.TOGGLE_DISABLE_SECTION,
      payload: { sectionId, disabled: false },
    });
  }, []);

  const addSection = React.useCallback(() => {
    newSectionsCount.current += 1;
    dispatch({ type: ReducerActionType.ADD_SECTION });
  }, []);

  const onSectionClick = React.useCallback(
    (sectionId: string) => {
      pushRouter(`/settings/quicksale/configuration/${sectionId}`);
    },
    [pushRouter],
  );

  // ==================== Color management ====================
  const [sectionWhoseColorIsEdited, setSectionWhoseColorIsEdited] =
    React.useState('');

  const relatedSection = React.useMemo(
    () =>
      unsavedSectionList.find(
        (section) => section.section_id === sectionWhoseColorIsEdited,
      ),
    [sectionWhoseColorIsEdited, unsavedSectionList],
  );

  const openColorModal = React.useCallback(
    (sectionId: string) => setSectionWhoseColorIsEdited(sectionId),
    [],
  );

  const closeColorModal = React.useCallback(
    () => setSectionWhoseColorIsEdited(''),
    [],
  );

  const onColorSelect = React.useCallback(
    (color: string) => {
      onSectionEdit(
        sectionWhoseColorIsEdited,
        EditableQuicksaleSectionKey.color,
        color,
      );
      closeColorModal();
    },
    [closeColorModal, onSectionEdit, sectionWhoseColorIsEdited],
  );

  const availableColors = React.useMemo(
    () => Object.values(QuicksaleSectionColor),
    [],
  );

  // ==================== Fetch configuration ====================
  React.useEffect(() => {
    fetchQuicksaleConfiguration();
  }, [fetchQuicksaleConfiguration]);

  // ==================== Save configuration ====================
  const saveQuicksaleConfiguration = React.useCallback(
    () => saveConfiguration(unsavedSectionList),
    [saveConfiguration, unsavedSectionList],
  );

  return (
    <>
      <div className={classes.sectionListContainer}>
        <div className={classes.pageHeader}>
          <Typography variant="h6" className={classes.mediumBold}>
            {t('cardListPage.preview')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={!isSaveNeeded || updateLoading}
            onClick={saveQuicksaleConfiguration}
          >
            {updateLoading ? (
              <CircularProgress size={24} />
            ) : (
              <>{t('cardListPage.save')}</>
            )}
          </Button>
        </div>

        <div className={classes.pageBody}>
          <Alert severity="info" className={classes.alertInfo}>
            {!isMobile || showFullHelperAlert ? (
              <>{t('cardListPage.possibleActionsFull')}</>
            ) : (
              <>
                {t('cardListPage.possibleActionsShort')}
                <Button onClick={toggleShowFullHelperAlert}>
                  {t('cardListPage.seeMore')}
                </Button>
              </>
            )}
            {(!isMobile || showFullHelperAlert) && (
              <>
                <ul className={classes.actionList}>
                  <li>{t('cardListPage.editIcon')}</li>
                  <li>{t('cardListPage.editName')}</li>
                  <li>{t('cardListPage.editColor')}</li>
                  <li>{t('cardListPage.moveTile')}</li>
                  <li>{t('cardListPage.archiveSection')}</li>
                </ul>
                {t('cardListPage.addSection')}
              </>
            )}
            {isMobile && showFullHelperAlert && (
              <Button onClick={toggleShowFullHelperAlert}>
                {t('cardListPage.seeLess')}
              </Button>
            )}
          </Alert>

          <QuicksaleConfigurationSectionList
            sectionList={unsavedEnabledSectionList}
            loading={loading}
            onSectionClick={onSectionClick}
            onSectionEdit={onSectionEdit}
            archiveSection={onSectionDisable}
            openColorModal={openColorModal}
            addSection={addSection}
          />
        </div>
      </div>

      {unsavedDisabledSectionList.length > 0 && (
        <div
          className={classNames(
            classes.sectionListContainer,
            classes.archivedCategories,
          )}
        >
          <div
            className={classes.archivedCategoriesTitle}
            onClick={toggleDisabledSections}
            role="button"
            tabIndex={0}
            onKeyDown={undefined}
          >
            <Typography variant="h6">
              {`${t('cardListPage.archivedCategories')} (${
                unsavedDisabledSectionList.length
              })`}
            </Typography>
            <IconButton onClick={toggleDisabledSectionsWithoutPropagation}>
              {showDisabledSections ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </div>
          <Collapse in={showDisabledSections} unmountOnExit>
            {unsavedDisabledSectionList.map((section, index) => (
              <ArchivedSectionListItem
                key={section.section_id}
                section={section}
                onSectionRestore={onSectionEnable}
                t={t}
                dividerAbove={index === 0}
              />
            ))}
          </Collapse>
        </div>
      )}

      <GenericResponsiveDialog
        maxWidth="sm"
        open={sectionWhoseColorIsEdited !== ''}
        onClose={closeColorModal}
        noFullScreen
      >
        <DialogTitle disableTypography className={classes.colorModalTitle}>
          <Typography variant="h6">
            {t('cardListPage.categoryModalTitle')}
          </Typography>
          <IconButton
            onClick={closeColorModal}
            className={classes.colorModalCloseButton}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t('cardListPage.categoryModalSubtitle')}
          </Typography>
          <ColorPicker
            colorChoices={availableColors}
            selectedColor={relatedSection?.section_color ?? ''}
            onColorChange={onColorSelect}
            className={classes.colorPicker}
          />
        </DialogContent>
      </GenericResponsiveDialog>

      <PromptOnPageLeave
        openPromptOnPageLeave={isSaveNeeded}
        title={t('pageLeavePrompt.title')}
        description={t('pageLeavePrompt.description')}
        leaveWithoutSavingText={t('pageLeavePrompt.discard')}
        leaveWithSavingText={t('pageLeavePrompt.save')}
        onLeaveWithSaving={saveQuicksaleConfiguration}
        noFullScreen
      />
    </>
  );
};

const connector = connect(
  (state: RootState) => ({
    sectionList: getSectionList(state),
    loading: getLoading(state),
    updateLoading: getUpdateLoading(state),
  }),
  {
    openInfoSnackbar: bottomSnackbarInfo,
    fetchQuicksaleConfiguration: fetchQuicksaleConfigurationAction,
    saveConfiguration: updateQuicksaleConfiguration,
    pushRouter: push,
  },
);

export default compose(connector, React.memo)(QuicksaleSectionList);
