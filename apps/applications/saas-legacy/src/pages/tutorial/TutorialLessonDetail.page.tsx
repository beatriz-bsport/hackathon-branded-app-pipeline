import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { push } from 'connected-react-router';
import { withRouter } from 'react-router';

import {
  withStyles,
  WithStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { CircularProgress } from '@material-ui/core';

import {
  getTutorialLesson,
  withLessons,
  getUserTutorialStatistics,
  getUserTutorialCompletion,
  getTutorialSection,
  translateSectionsWithLessons,
  translateLesson,
  getTutorialLessonLoadingState,
} from '#src/libs/platform-tutorial/selectors';
import { getPermissions } from '#src/libs/role/selectors';

import {
  updateTutorialLessonViewedStatus as updateTutorialLessonViewedStatusAction,
  updateTutorialLessonCompletedStatus as updateTutorialLessonCompletedStatusAction,
  fetchListTutorialLessons as fetchListTutorialLessonsAction,
  fetchListTutorialSections as fetchListTutorialSectionsAction,
  fetchUserTutorialCompletion as fetchUserTutorialCompletionAction,
  retrieveTutorialSection as retrieveTutorialSectionAction,
  retrieveTutorialLesson as retrieveTutorialLessonAction,
  updateUserAcknowlegdeTutorial,
} from '#src/libs/platform-tutorial/actions';
import {
  fetchUpsellPackage as fetchUpsellPackageAction,
  requestUpsellPackage as requestUpsellPackageAction,
  subscribeUpsellPackage as subscribeUpsellPackageAction,
} from '#src/libs/platform-billing/actions';

import { checkRequiredPermissions } from '#src/libs/role/utils';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import TutorialLessonHeader from '#src/libs/platform-tutorial/components/TutorialLessonHeader.component';
import TutorialLessonContent from '#src/libs/platform-tutorial/components/TutorialLessonContent.component';
import FeatureRequestDialog from '#src/libs/platform-billing/components/FeatureRequestDialog.component';
import TutorialGenericDialog from '#src/libs/platform-tutorial/components/TutorialGenericDialog.component';

import {
  TutorialLesson,
  TutorialSection,
} from '#src/libs/platform-tutorial/types';

import {
  ALL_TUTORIAL_LESSONS_FINISH_DIALOG_OPEN_QUERY_PARAMS,
  TUTORIAL_GENERIC_DIALOG_SECTION_FINISH,
} from '#src/libs/platform-tutorial/constant';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
// @ts-expect-error
import { getLanguage } from '../../i18n';

type OwnProps = {
  id: number;
  section: TutorialSection;
  selectedLesson: TutorialLesson;
  sectionId: string;
  lessonId: string;
  sectionRestricted: boolean;
  lessonRestricted: boolean;
  selectedLanguage: 'en' | 'fr' | 'es' | 'nl' | 'de' | 'it' | 'pt' | 'cs';
  checkTutorialPermission: boolean;
};

type State = {
  openSectionFinishDialog: boolean;
  setOpenSectionFinishDialog: (open: boolean) => void;
  openFeatureRequest: boolean;
  setOpenFeatureRequest: (open: boolean) => void;
  isLessonLoading: boolean;
};
type OwnAndConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation &
  WithStyles &
  State;

type ComponentState = {};

class TutorialLessonDetail extends React.Component<Props, ComponentState> {
  state: ComponentState = {};

  componentDidMount(): void {
    this.props.updateUserAcknowlegdeTutorial();
    if (this.props.lessonRestricted) {
      if (this.props.checkTutorialPermission) {
        this.props.fetchListTutorialLessons({ lesson_restricted: true });
      } else {
        this.props.retrieveTutorialLesson({
          uuid: this.props.lessonId,
          lesson_restricted: true,
        });
      }
      this.props.retrieveTutorialSection({
        uuid: this.props.sectionId,
        section_restricted: true,
      });
      this.props.fetchUserTutorialCompletion({ lesson_restricted: true });
    } else if (this.props.sectionRestricted) {
      this.props.retrieveTutorialSection({
        uuid: this.props.sectionId,
        section_restricted: true,
      });
      this.props.fetchListTutorialLessons({ section_restricted: true });
      this.props.fetchUserTutorialCompletion({ section_restricted: true });
    } else {
      this.props.fetchListTutorialLessons();
      this.props.fetchListTutorialSections();
      this.props.fetchUserTutorialCompletion();
    }
    if (this.props.selectedLesson?.upsell_identifiers?.[0]) {
      this.props.fetchUpsellPackage(
        this.props.selectedLesson?.upsell_identifiers[0],
      );
    }
  }

  componentDidUpdate(prevProps: Props): void {
    if (
      (!prevProps.section && this.props.section) ||
      (!prevProps.selectedLesson && this.props.selectedLesson)
    ) {
      if (this.props.lessonRestricted) {
        this.props.retrieveTutorialLesson({
          uuid: this.props.lessonId,
          lesson_restricted: true,
        });
        this.props.retrieveTutorialSection({
          uuid: this.props.sectionId,
          section_restricted: true,
        });
        this.props.fetchUserTutorialCompletion({ lesson_restricted: true });
      } else if (this.props.sectionRestricted) {
        this.props.retrieveTutorialSection({
          uuid: this.props.sectionId,
          section_restricted: true,
        });
        this.props.fetchListTutorialLessons({ section_restricted: true });
        this.props.fetchUserTutorialCompletion({ section_restricted: true });
      } else {
        this.props.fetchListTutorialLessons();
        this.props.fetchListTutorialSections();
        this.props.fetchUserTutorialCompletion();
      }
    }
    if (
      !prevProps.selectedLesson?.upsell_identifiers &&
      this.props.selectedLesson?.upsell_identifiers?.[0]
    ) {
      this.props.fetchUpsellPackage(
        this.props.selectedLesson?.upsell_identifiers[0],
      );
    }
  }

  completeAndGoToLesson = (
    sectionId: number,
    currentId: number,
    nextId: number,
    firstFinish?: boolean,
  ) => {
    this.props.updateTutorialLessonCompletedStatus(
      {
        lesson_id: currentId,
        lesson_restricted: this.props.lessonRestricted,
        section_restricted: this.props.sectionRestricted,
      },
      {
        onSuccess: () => {
          if (
            firstFinish &&
            ((this.props.statistics ?? [])[sectionId] ?? [])[2] === 100
          ) {
            this.props.setOpenSectionFinishDialog(true);
          } else {
            this.props.goToLesson(sectionId, nextId);
          }
        },
      },
    );
  };

  goToMenu = () => {
    !this.props.checkTutorialPermission
      ? this.props.goToDefault()
      : this.props.goToMenuPermitted();
  };

  goToMenuWithAllFinishDialog = () => {
    !this.props.checkTutorialPermission
      ? this.props.goToDefault()
      : this.props.goToMenuWithAllFinishDialogPermitted();
  };

  completeAndGoToMenu = (
    currentId: number,
    sectionId?: number,
    firstFinish?: boolean,
  ) => {
    this.props.updateTutorialLessonCompletedStatus(
      {
        lesson_id: currentId,
        lesson_restricted: this.props.lessonRestricted,
        section_restricted: this.props.sectionRestricted,
      },
      {
        onSuccess: () => {
          if (firstFinish) {
            if (((this.props.statistics || {}).all ?? [])[2] === 100) {
              this.goToMenuWithAllFinishDialog();
            } else if (
              ((this.props.statistics || {})[sectionId] ?? [])[2] === 100
            ) {
              this.props.setOpenSectionFinishDialog(true);
            }
          } else {
            this.goToMenu();
          }
        },
      },
    );
  };

  onCloseSectionFinishDialog = () => {
    this.props.setOpenSectionFinishDialog(false);
    this.goToMenu();
  };

  render() {
    const { classes, t } = this.props;
    const lessonsId = this.props.section?.lessons?.map((lesson) => lesson.id);
    const selectedLessonId = lessonsId?.indexOf(this.props.selectedLesson?.id);
    const previousLessonId =
      selectedLessonId && lessonsId && selectedLessonId > 0
        ? lessonsId[selectedLessonId - 1]
        : null;
    const nextLessonId =
      selectedLessonId && lessonsId && selectedLessonId < lessonsId.length - 1
        ? lessonsId[selectedLessonId + 1]
        : null;
    if (this.props.isLessonLoading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    }
    return (
      <div className={classes.container}>
        {this.props.checkTutorialPermission && (
          <Button
            className={classes.button}
            onClick={() => this.goToMenu()}
            startIcon={<ArrowBackIcon />}
          >
            {t('lessonHeader.backToList')}
          </Button>
        )}
        <TutorialLessonHeader
          goToLesson={this.props.goToLesson}
          onKnowMore={this.props.onRequestUpsell}
          section={this.props.section}
          selectedLesson={this.props.selectedLesson}
          tutorial_completion={this.props.tutorial_completion}
        />
        <TutorialLessonContent
          completeAndGoToLesson={this.completeAndGoToLesson}
          completeAndGoToMenu={this.completeAndGoToMenu}
          goToLesson={this.props.goToLesson}
          lesson_restricted={
            this.props.lessonRestricted && !this.props.checkTutorialPermission
          }
          nextLessonId={nextLessonId}
          previousLessonId={previousLessonId}
          selectedLesson={this.props.selectedLesson}
          tutorial_completion={this.props.tutorial_completion}
        />
        <TutorialGenericDialog
          identifier={TUTORIAL_GENERIC_DIALOG_SECTION_FINISH}
          onClose={this.onCloseSectionFinishDialog}
          open={this.props.openSectionFinishDialog}
        />
        <FeatureRequestDialog
          onClose={() => this.props.setOpenFeatureRequest(false)}
          open={this.props.openFeatureRequest}
        />
      </div>
    );
  }
}

const styles = createStyles((theme: Theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  button: {
    marginRight: 'auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  responsiveDrawerHeader: {
    marginBottom: theme.spacing(3),
  },
  responsiveDrawerContent: {
    padding: 0,
  },
}));

const mapStateToProps = (
  state: RootState,
  { sectionId, lessonId, selectedLanguage }: OwnProps,
) => {
  const selectedLesson = translateLesson(
    getTutorialLesson(lessonId)(state),
    selectedLanguage,
  );
  return {
    selectedLesson,
    section: translateSectionsWithLessons(
      withLessons(getTutorialSection(sectionId)),
    )(state, selectedLanguage),
    statistics: getUserTutorialStatistics(state),
    tutorial_completion: getUserTutorialCompletion(state),
    permissions: getPermissions(state),
    isLessonLoading: getTutorialLessonLoadingState(state),
  };
};

const mapDispatchToProps = {
  fetchListTutorialLessons: fetchListTutorialLessonsAction,
  fetchListTutorialSections: fetchListTutorialSectionsAction,
  fetchUserTutorialCompletion: fetchUserTutorialCompletionAction,
  retrieveTutorialSection: retrieveTutorialSectionAction,
  retrieveTutorialLesson: retrieveTutorialLessonAction,
  updateTutorialLessonCompletedStatus:
    updateTutorialLessonCompletedStatusAction,
  updateTutorialLessonViewedStatus: updateTutorialLessonViewedStatusAction,
  pushToLesson: (sectionId: number | string, lessonId: number | string) =>
    push(`/tutorial/${sectionId}/${lessonId}`),
  goToDefault: () => push(``),
  goToMenuPermitted: () => push(`/tutorial`),
  goToMenuWithAllFinishDialogPermitted: () =>
    push(`/tutorial/?${ALL_TUTORIAL_LESSONS_FINISH_DIALOG_OPEN_QUERY_PARAMS}`),
  updateUserAcknowlegdeTutorial,
  requestUpsellPackage: requestUpsellPackageAction,
  fetchUpsellPackage: fetchUpsellPackageAction,
  subscribeUpsellPackage: subscribeUpsellPackageAction,
};

const mapWithHandlers = {
  goToLesson:
    (props: OwnAndConnectedProps) =>
    (sectionId: number | string, lessonId: number | string) => {
      props.updateTutorialLessonViewedStatus(
        {
          lesson_id: lessonId,
          lesson_restricted: props.lessonRestricted,
          section_restricted: props.sectionRestricted,
        },
        {
          onSuccess: () => {
            props.pushToLesson(sectionId, lessonId);
          },
        },
      );
    },
  onRequestUpsell:
    ({
      requestUpsellPackage,
      setOpenFeatureRequest,
    }: OwnAndConnectedProps & State) =>
    (upsell_identifier: number) => {
      setOpenFeatureRequest(true);
      requestUpsellPackage(upsell_identifier);
    },
};

// Tells if :sectionId and lessonId of url are id or uuid, by checking if it can be converted into number
const isUuid = (objectId: number | string) => Number.isNaN(Number(objectId));

export default compose(
  withStyles(styles),
  withTranslation('tutorial'),
  routerParamsToProps({
    sectionId: 'sectionId:string',
    lessonId: 'lessonId:string',
  }),
  withState('openSectionFinishDialog', 'setOpenSectionFinishDialog', null),
  withState('openFeatureRequest', 'setOpenFeatureRequest', false),
  withRouter,
  withProps(
    ({ sectionId, lessonId }: { sectionId: string; lessonId: string }) => ({
      sectionRestricted: isUuid(sectionId),
      lessonRestricted: isUuid(lessonId),
      selectedLanguage: getLanguage(),
    }),
  ),
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ permissions }) => ({
    checkTutorialPermission: checkRequiredPermissions(
      'navigationMenu.tutorial',
      permissions,
    ),
  })),
  withHandlers(mapWithHandlers),
)(TutorialLessonDetail);
