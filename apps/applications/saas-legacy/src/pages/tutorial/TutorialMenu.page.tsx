import React from 'react';

import { connect } from 'react-redux';
import {
  withStyles,
  WithStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { push } from 'connected-react-router';
import { withRouter } from 'react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import Fab from '@material-ui/core/Fab';

import { snackbarInfo } from '#src/libs/snackbar/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import type {
  TutorialLesson,
  TutorialSection,
} from '#src/libs/platform-tutorial/types';

import {
  getAllTutorialSectionList,
  translateSectionsWithLessons,
  withLessons,
  getUserTutorialStatistics,
  getUserTutorialCompletion,
} from '#src/libs/platform-tutorial/selectors';

import {
  updateTutorialLessonViewedStatus as updateTutorialLessonViewedStatusAction,
  fetchListTutorialSections as fetchListTutorialSectionsAction,
  fetchListTutorialLessons as fetchListTutorialLessonsAction,
  fetchUserTutorialCompletion as fetchUserTutorialCompletionAction,
  updateUserAcknowlegdeTutorial,
} from '#src/libs/platform-tutorial/actions';
import TutorialSectionList from '#src/libs/platform-tutorial/components/TutorialSectionList.component';
import {
  ALL_TUTORIAL_LESSONS_FINISH_DIALOG_OPEN_QUERY_PARAMS,
  TUTORIAL_GENERIC_DIALOG_ALL_FINISH,
  TUTORIAL_GENERIC_DIALOG_SHARE_LESSON,
  TUTORIAL_GENERIC_DIALOG_SHARE_SECTION,
} from '#src/libs/platform-tutorial/constant';

import TutorialMenuHeader from '#src/libs/platform-tutorial/components/TutorialMenuHeader.component';
import TutorialGenericDialog from '#src/libs/platform-tutorial/components/TutorialGenericDialog.component';
import { fetchAll as fetchAllAlertings } from '#src/libs/alerting/actions';
import { openIntercomHelp } from '../../intercom';
import { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
// @ts-expect-error
import { getLanguage } from '../../i18n';

type IdentifierType =
  | typeof TUTORIAL_GENERIC_DIALOG_SHARE_SECTION
  | typeof TUTORIAL_GENERIC_DIALOG_SHARE_LESSON
  | typeof TUTORIAL_GENERIC_DIALOG_ALL_FINISH;

type OwnProps = {
  id: number;
  sections: Array<TutorialSection>;
  selectedLesson: TutorialLesson;
  finishAllDialog: boolean;
  defaultSelectedSectionId: string;
  selectedLanguage: 'en' | 'fr' | 'es' | 'nl' | 'de' | 'it' | 'pt' | 'cs';
};

type State = {
  selectedLesson: TutorialLesson;
  setSelectedLesson: (lesson: TutorialLesson) => void;
  openShareDialog: {
    dialogOpen: boolean;
    identifier: IdentifierType;
    object?: TutorialSection | TutorialLesson;
  };
  setOpenShareDialog: ({
    dialogOpen,
    identifier,
    object,
  }: {
    dialogOpen: boolean;
    identifier: IdentifierType;
    object?: TutorialSection | TutorialLesson;
  }) => void;
};

type OwnAndConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation &
  WithStyles &
  State;
export class TutorialMenu extends React.Component<Props> {
  componentDidMount(): void {
    this.props.fetchListTutorialSections();
    this.props.fetchListTutorialLessons();
    this.props.fetchUserTutorialCompletion();
    this.props.updateUserAcknowlegdeTutorial();
    if (this.props.finishAllDialog) {
      this.props.setOpenShareDialog({
        dialogOpen: true,
        identifier: TUTORIAL_GENERIC_DIALOG_ALL_FINISH,
      });
    }
  }

  closeDialog = () => {
    this.props.setOpenShareDialog({
      dialogOpen: false,
      identifier: null,
      object: null,
    });
  };

  copyToClipboard = (str: string) => {
    navigator.clipboard.writeText(str).then(() => {
      this.props.snackbarInfo('snackbar:copied');
    });
  };

  getShareObject = (
    object: TutorialSection | TutorialLesson,
    isSection: boolean,
  ) => {
    this.props.setOpenShareDialog({
      dialogOpen: true,
      identifier: isSection
        ? TUTORIAL_GENERIC_DIALOG_SHARE_SECTION
        : TUTORIAL_GENERIC_DIALOG_SHARE_LESSON,
      object,
    });
  };

  getOnClose = (identifier: IdentifierType) => {
    switch (identifier) {
      case TUTORIAL_GENERIC_DIALOG_SHARE_SECTION:
        return (section: TutorialSection) => {
          this.copyToClipboard(
            `${window.location.origin}/tutorial/${section.uuid}/${section?.lessons[0]?.id}`,
          );
          this.closeDialog();
        };

      case TUTORIAL_GENERIC_DIALOG_SHARE_LESSON:
        return (lesson: TutorialLesson) => {
          this.copyToClipboard(
            `${window.location.origin}/tutorial/${
              this.props.sections.find((s) => s?.lessons.includes(lesson)).uuid
            }/${lesson.uuid}`,
          );
          this.closeDialog();
        };
      case TUTORIAL_GENERIC_DIALOG_ALL_FINISH:
        return () => {
          this.props.fetchAllAlertings();
          this.closeDialog();
        };
      default:
        return this.closeDialog;
    }
  };

  render() {
    return (
      <>
        <div className={this.props.classes.container}>
          <div className={this.props.classes.header}>
            <TutorialMenuHeader
              percentage={(this.props.statistics?.all || [0, 0, 100])[2]}
            />
          </div>

          <TutorialSectionList
            defaultSelectedSectionId={this.props.defaultSelectedSectionId}
            goToLesson={this.props.goToLesson}
            sections={this.props.sections}
            shareObject={this.getShareObject}
            statistics={this.props.statistics}
            // @ts-expect-error
            tutorial_completion={this.props.tutorial_completion}
          />
          <TutorialGenericDialog
            identifier={this.props.openShareDialog.identifier}
            object={this.props.openShareDialog.object}
            onClose={this.getOnClose(this.props.openShareDialog.identifier)}
            open={this.props.openShareDialog.dialogOpen}
          />
        </div>
        {/* @ts-expect-error */}
        <Fab
          className={this.props.classes.helpButton}
          color="primary"
          onClick={openIntercomHelp}
          variant="extended"
        >
          <HelpOutlineOutlinedIcon className={this.props.classes.lefticon} />
          {this.props.t('menu.helpButton')}
        </Fab>
      </>
    );
  }
}

const styles = createStyles((theme: Theme) => ({
  container: {
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(5),
    },
  },
  header: {
    paddingBottom: theme.spacing(2),
  },
  helpButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
    borderRadius: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

const mapStateToProps = (state: RootState, { selectedLanguage }: OwnProps) => ({
  sections: translateSectionsWithLessons(
    withLessons(getAllTutorialSectionList),
  )(state, selectedLanguage),
  statistics: getUserTutorialStatistics(state),
  tutorial_completion: getUserTutorialCompletion(state),
});

const mapDispatchToProps = {
  fetchListTutorialSections: fetchListTutorialSectionsAction,
  fetchListTutorialLessons: fetchListTutorialLessonsAction,
  fetchUserTutorialCompletion: fetchUserTutorialCompletionAction,
  updateTutorialLessonViewedStatus: updateTutorialLessonViewedStatusAction,
  pushToLesson: (sectionId: number | string, lessonId: number | string) =>
    push(`/tutorial/${sectionId}/${lessonId}`),
  snackbarInfo,
  updateUserAcknowlegdeTutorial,
  fetchAllAlertings,
};

const mapWithHandlers = {
  goToLesson:
    (props: OwnAndConnectedProps) =>
    (sectionId: number | string, lessonId: number | string) => {
      props.updateTutorialLessonViewedStatus(
        {
          lesson_id: lessonId,
        },
        {
          onSuccess: () => {
            props.pushToLesson(sectionId, lessonId);
          },
          onError: () => {
            props.pushToLesson(sectionId, lessonId);
          },
        },
      );
    },
};

export default compose(
  withStyles(styles),
  withTranslation('tutorial'),
  withState('openShareDialog', 'setOpenShareDialog', {
    dialogOpen: false,
    identifier: null,
    object: null,
  }),
  routerParamsToProps({
    // @ts-expect-error
    defaultSelectedSectionId: 'defaultSelectedSectionId',
  }),
  withRouter,
  withProps(({ location }) => ({
    finishAllDialog: location.search.includes(
      ALL_TUTORIAL_LESSONS_FINISH_DIALOG_OPEN_QUERY_PARAMS,
    ),
    selectedLanguage: getLanguage(),
  })),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(TutorialMenu);
