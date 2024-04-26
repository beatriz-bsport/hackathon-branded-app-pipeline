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
// @ts-expect-error
import { getLanguage } from '../../i18n';

import { RootState } from '../../reducers';

import {
  getTutorialLesson,
  withLessons,
  getUserTutorialStatistics,
  getUserTutorialCompletion,
  getTutorialSection,
  translateSectionsWithLessons,
  translateLesson,
  getTutorialLessonLoadingState,
} from '#libs/platform-tutorial/selectors';
import { getPermissions } from '#libs/role/selectors';
// @ts-expect-error
import { getUpsellPackageByIdentifier } from '#libs/platform-billing/selectors';

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
import {
  fetchUpsellPackage as fetchUpsellPackageAction,
  requestUpsellPackage as requestUpsellPackageAction,
  subscribeUpsellPackage as subscribeUpsellPackageAction,
} from '#libs/platform-billing/actions';

import { checkRequiredPermissions } from '#libs/role/utils';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';

import TutorialLessonHeader from '#libs/platform-tutorial/components/TutorialLessonHeader.component';
import TutorialLessonContent from '#libs/platform-tutorial/components/TutorialLessonContent.component';
import FeatureRequestDialog from '#libs/platform-billing/components/FeatureRequestDialog.component';
import TutorialGenericDialog from '#libs/platform-tutorial/components/TutorialGenericDialog.component';

import { WithHandlerType } from '../../utils/types';
import { TutorialLesson, TutorialSection } from '#libs/platform-tutorial/types';

import {
  ALL_TUTORIAL_LESSONS_FINISH_DIALOG_OPEN_QUERY_PARAMS,
  TUTORIAL_GENERIC_DIALOG_SECTION_FINISH,
} from '#libs/platform-tutorial/constant';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import UpsellPackageSubscriptionDrawer from '#libs/platform-billing/components/UpsellPackageSubscriptionDrawer.component';

const { trackFormAdd, trackFormSubmitIntent, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.UpsellSubscription,
  );

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

type ComponentState = {
  openSubscribtionForm: boolean;
  openConfirmationDialog: boolean;
  upsellSubscriptionLoading: boolean;
};

class TutorialLessonDetail extends React.Component<Props, ComponentState> {
  state: ComponentState = {
    openSubscribtionForm: false,
    openConfirmationDialog: false,
    upsellSubscriptionLoading: false,
  };

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

  handleOpenSubscribtionForm = () => {
    this.setState({
      openSubscribtionForm: true,
    });
    trackFormAdd(this.props.associatedUpsellPackage?.id);
  };

  handleSubscribeUpsellPackage = () => {
    trackFormSubmitIntent(this.props.associatedUpsellPackage?.id);
    this.setState({ upsellSubscriptionLoading: true });
    this.props.subscribeUpsellPackage(this.props.associatedUpsellPackage?.id, {
      onSuccess: () => {
        trackFormSuccess(this.props.associatedUpsellPackage?.id);
        this.handleCloseSubscriptionForm();
        this.setState({ upsellSubscriptionLoading: false });
        this.setState({ openConfirmationDialog: true });
      },
      onError: () => {
        this.handleCloseSubscriptionForm();
        this.setState({ upsellSubscriptionLoading: false });
      },
    });
  };

  handleCloseSubscriptionForm = () => {
    this.setState({ openSubscribtionForm: false });
  };

  handleCloseConfirmationDialog = () =>
    this.setState({ openConfirmationDialog: false });

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
          associatedUpsellPackage={this.props.associatedUpsellPackage}
          goToLesson={this.props.goToLesson}
          handleSubscribe={this.handleOpenSubscribtionForm}
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
        <UpsellPackageSubscriptionDrawer
          loading={this.state.upsellSubscriptionLoading}
          onClose={this.handleCloseSubscriptionForm}
          onCloseDialog={this.handleCloseConfirmationDialog}
          onKnowMore={this.props.onRequestUpsell}
          onSubscribe={this.handleSubscribeUpsellPackage}
          open={this.state.openSubscribtionForm}
          openDialog={this.state.openConfirmationDialog}
          upsellPackage={this.props.associatedUpsellPackage}
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
    associatedUpsellPackage: getUpsellPackageByIdentifier(
      state,
      // The data structure of the API is ready for a OneToMany relation between Tutorial lessons and upsells.
      // That is why the upsells identifiers are stored in a list.
      // Nevertheless, upsell_identifiers shouldn't be of length greater than 1.
      selectedLesson?.upsell_identifiers?.[0],
      { must_expensive: true },
    ),
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
