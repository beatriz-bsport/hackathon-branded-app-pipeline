import React from 'react';
import { Button } from '@material-ui/core';
import {
  withStyles,
  WithStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { push } from 'connected-react-router';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withRouter } from 'react-router';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import { getLanguage } from '../../i18n';
import { TutorialLesson, TutorialSection } from '#libs/platform-tutorial/types';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import {
  getTutorialLesson,
  withLessons,
  getUserTutorialStatistics,
  getUserTutorialCompletion,
  getTutorialSection,
  translateSectionsWithLessons,
  translateLesson,
} from '#libs/platform-tutorial/selectors';

import TutorialLessonHeader from '#libs/platform-tutorial/components/TutorialLessonHeader.component';
import TutorialLessonContent from '#libs/platform-tutorial/components/TutorialLessonContent.component';
import {
  updateTutorialLessonViewedStatus as updateTutorialLessonViewedStatusAction,
  updateTutorialLessonCompletedStatus as updateTutorialLessonCompletedStatusAction,
  fetchListTutorialLessons as fetchListTutorialLessonsAction,
  fetchListTutorialSections as fetchListTutorialSectionsAction,
  fetchUserTutorialCompletion as fetchUserTutorialCompletionAction,
  retrieveTutorialSection as retrieveTutorialSectionAction,
  retrieveTutorialLesson as retrieveTutorialLessonAction,
  updateUserAcknowlegdeTutorial,
} from '#libs/platform-tutorial/actions';
import TutorialGenericDialog from '#libs/platform-tutorial/components/TutorialGenericDialog.component';
import {
  ALL_TUTORIAL_LESSONS_FINISH_DIALOG_OPEN_QUERY_PARAMS,
  TUTORIAL_GENERIC_DIALOG_SECTION_FINISH,
} from '#libs/platform-tutorial/constant';
import { getPermissions } from '#libs/role/selectors';
import { checkRequiredPermissions } from '#libs/role/utils';

type OwnProps = {
  id: number;
  section: TutorialSection;
  selectedLesson: TutorialLesson;
  sectionId: string;
  lessonId: string;
  sectionRestricted: boolean;
  lessonRestricted: boolean;
  selectedLanguage: 'en' | 'fr' | 'es' | 'nl' | 'de' | 'it';
  checkTutorialPermission: boolean;
};

type State = {
  openSectionFinishDialog: boolean;
  setOpenSectionFinishDialog: (open: boolean) => void;
};
type OwnAndConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation &
  WithStyles &
  State;

class TutorialLessonDetail extends React.Component<Props> {
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
  }

  componentDidUpdate(prevProps: Props): void {
    if (
      (!prevProps.section && this.props.section) ||
      (!prevProps.selectedLesson && this.props.selectedLesson)
    )
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
            ((this.props.statistics || [])[sectionId] || [])[2] === 100
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
            if (((this.props.statistics || {}).all || [])[2] === 100) {
              this.goToMenuWithAllFinishDialog();
            } else if (
              ((this.props.statistics || {})[sectionId] || [])[2] === 100
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
      selectedLessonId > 0 ? lessonsId[selectedLessonId - 1] : null;
    const nextLessonId =
      selectedLessonId < (lessonsId || []).length - 1
        ? lessonsId[selectedLessonId + 1]
        : null;

    return (
      <div className={classes.container}>
        {this.props.checkTutorialPermission && (
          <Button
            onClick={() => this.goToMenu()}
            startIcon={<ArrowBackIcon />}
            className={classes.button}
          >
            {t('lessonHeader.backToList')}
          </Button>
        )}

        <TutorialLessonHeader
          selectedLesson={this.props.selectedLesson}
          section={this.props.section}
          goToLesson={this.props.goToLesson}
          tutorial_completion={this.props.tutorial_completion}
        />
        <TutorialLessonContent
          selectedLesson={this.props.selectedLesson}
          goToLesson={this.props.goToLesson}
          completeAndGoToMenu={this.completeAndGoToMenu}
          completeAndGoToLesson={this.completeAndGoToLesson}
          previousLessonId={previousLessonId}
          nextLessonId={nextLessonId}
          lesson_restricted={
            this.props.lessonRestricted && !this.props.checkTutorialPermission
          }
          tutorial_completion={this.props.tutorial_completion}
        />
        <TutorialGenericDialog
          open={this.props.openSectionFinishDialog}
          identifier={TUTORIAL_GENERIC_DIALOG_SECTION_FINISH}
          onClose={this.onCloseSectionFinishDialog}
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
}));

const mapStateToProps = (
  state: RootState,
  { sectionId, lessonId, selectedLanguage }: OwnProps,
) => ({
  selectedLesson: translateLesson(
    getTutorialLesson(lessonId)(state),
    selectedLanguage,
  ),
  section: translateSectionsWithLessons(
    withLessons(getTutorialSection(sectionId)),
  )(state, selectedLanguage),
  statistics: getUserTutorialStatistics(state),
  tutorial_completion: getUserTutorialCompletion(state),
  permissions: getPermissions(state),
});

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
};

// Tells if :sectionId and lessonId of url are id or uuid, by checking if it can be converted into number
const isUuid = (objectId: number | string) => Number.isNaN(Number(objectId));

export default compose(
  withStyles(styles),
  withTranslation('tutorial'),
  routerParamsToProps({ sectionId: 'sectionId', lessonId: 'lessonId' }),
  withState('openSectionFinishDialog', 'setOpenSectionFinishDialog', null),
  withRouter,
  withProps(({ sectionId, lessonId }) => ({
    sectionRestricted: isUuid(sectionId),
    lessonRestricted: isUuid(lessonId),
    selectedLanguage: getLanguage(),
  })),
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ permissions }) => ({
    checkTutorialPermission: checkRequiredPermissions(
      'navigationMenu.tutorial',
      permissions,
    ),
  })),
  withHandlers(mapWithHandlers),
)(TutorialLessonDetail);
