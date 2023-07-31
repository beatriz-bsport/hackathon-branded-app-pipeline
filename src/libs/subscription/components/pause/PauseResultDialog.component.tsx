import React from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Typography from '@material-ui/core/Typography';
import GenericDialogWithIconHeader from '#components/genericDialog/GenericDialogWithIconHeader.component';
import ErrorIcon from '#components/icons/ErrorIcon.component';
import ValidationIcon from '#components/icons/ValidationIcon.component';
import { PauseSubmitResults } from '#libs/subscription/types';
import {
  PAUSE_RESULT_SUCCESS,
  CONTRACT_PAUSE_RESULT_SUCCESS,
} from '#libs/subscription/constants';

const PAUSE_RESULT_FAIL_INCOMING_BILL = 63101;
const PAUSE_RESULT_FAIL_OVERLAP_PAUSE = 63102;
const PAUSE_RESULT_FAIL_CAN_NOT_CANCEL_PAUSE = 63103;
const PAUSE_RESULT_FAIL_SUBSCRIPTION_WILL_END_BEFORE_PAUSE = 63104;
const PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_START_WHEN_HAS_STARTED = 63105;
const PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_END_BEFORE_TODAY = 63106;
const PAUSE_RESULT_FAIL_CAN_NOT_CREATE_A_PAUSE_IN_THE_PAST = 63108;
const PAUSE_RESULT_FAIL_SUBSCRIPTION_HAS_NOT_STARTED_YET = 63110;
const PAUSE_RESULT_FAIL_INVALID_TIMEDELTA = 63111;

const getDialogTextContent = (results: PauseSubmitResults, t: TFunction) => {
  const {
    resultIdentifier,
    subscriptionName,
    subscriberName,
    fromDate,
    untilDate,
    countSubscription,
  } = results;
  switch (resultIdentifier) {
    case PAUSE_RESULT_SUCCESS:
      return t('pauseV2.subscriptionPause.form.successStep.content', {
        subscriptionName,
        subscriberName,
        fromDate,
        untilDate,
      });
    case CONTRACT_PAUSE_RESULT_SUCCESS:
      return t('pauseV2.contractPause.form.thirdStep.successExplanation', {
        fromDate,
        untilDate,
        count: countSubscription,
      });
    case PAUSE_RESULT_FAIL_INCOMING_BILL:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentIncomingBill',
        {
          subscriptionName,
          subscriberName,
        },
      );
    case PAUSE_RESULT_FAIL_OVERLAP_PAUSE:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentOverlapPause',
        {
          subscriptionName,
          subscriberName,
          fromDate,
          untilDate,
        },
      );
    case PAUSE_RESULT_FAIL_INVALID_TIMEDELTA:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentInvalidTimedelta',
      );
    case PAUSE_RESULT_FAIL_CAN_NOT_CANCEL_PAUSE:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentCanNotCancelPause',
      );
    case PAUSE_RESULT_FAIL_SUBSCRIPTION_WILL_END_BEFORE_PAUSE:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentSubscriptionWillEndBeforePause',
      );
    case PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_START_WHEN_HAS_STARTED:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentCanNotEditPauseStartWhenHasStarted',
      );
    case PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_END_BEFORE_TODAY:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentCanNotEditPauseEndBeforeToday',
      );
    case PAUSE_RESULT_FAIL_CAN_NOT_CREATE_A_PAUSE_IN_THE_PAST:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentCanNotCreateAPauseInThePast',
      );
    case PAUSE_RESULT_FAIL_SUBSCRIPTION_HAS_NOT_STARTED_YET:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentSubscriptionHasNotStarted',
      );
    default:
      return t(
        'pauseV2.subscriptionPause.form.failureStep.contentUnknownError',
      );
  }
};

type Props = {
  closeAllDialogs: () => void;
  backToPreviousDialog?: () => void;
  results: PauseSubmitResults;
  openDialog: boolean;
};

export const GenericPauseResultDialog = (props: Props) => {
  const { t } = useTranslation('subscription');
  const content = getDialogTextContent(props.results, t);
  const identifier = props.results.resultIdentifier;

  if (
    identifier === PAUSE_RESULT_SUCCESS ||
    identifier === CONTRACT_PAUSE_RESULT_SUCCESS
  ) {
    return (
      <GenericDialogWithIconHeader
        open={props.openDialog}
        headerAlign="center"
        headerIcon={<ValidationIcon color="#4CAF50" />}
        headerTitle={
          identifier === CONTRACT_PAUSE_RESULT_SUCCESS
            ? t('pauseV2.contractPause.form.thirdStep.title')
            : t('pauseV2.subscriptionPause.form.successStep.title')
        }
        footerAlign="center"
        onConfirmClick={props.closeAllDialogs}
        onConfirmText={t('pauseV2.common.actions.continue')}
      >
        <Typography variant="body1" align="center">
          {content}
        </Typography>
      </GenericDialogWithIconHeader>
    );
  }

  return (
    <GenericDialogWithIconHeader
      open={props.openDialog}
      headerAlign="center"
      headerIcon={<ErrorIcon />}
      headerTitle={t('pauseV2.subscriptionPause.form.failureStep.title')}
      footerAlign="center"
      onConfirmClick={props.backToPreviousDialog}
      onConfirmText={t('pauseV2.common.actions.goBack')}
      onConfirmVariant="contained"
      onCancelClick={props.closeAllDialogs}
      onCancelText={t('pauseV2.common.actions.cancel')}
    >
      <Typography variant="body1" align="center">
        {content}
      </Typography>
    </GenericDialogWithIconHeader>
  );
};

export default React.memo(GenericPauseResultDialog);
