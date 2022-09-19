import React from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Typography from '@material-ui/core/Typography';
import GenericDialogWithIconHeader from '#components/genericDialog/GenericDialogWithIconHeader.component';
import ErrorIcon from '#components/icons/ErrorIcon.component';
import ValidationIcon from '#components/icons/ValidationIcon.component';
import { PauseSubmitResults } from '#libs/subscription/types';
import { PAUSE_RESULT_SUCCESS } from '#libs/subscription/constants';

const PAUSE_RESULT_FAIL_INVALID_TIMEDELTA = 63100;
const PAUSE_RESULT_FAIL_INCOMING_BILL = 63101;
const PAUSE_RESULT_FAIL_OVERLAP_PAUSE = 63102;
const PAUSE_RESULT_FAIL_CAN_NOT_CANCEL_PAUSE = 63103;
const PAUSE_RESULT_FAIL_SUBSCRIPTION_WILL_END_BEFORE_PAUSE = 63104;
const PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_START_WHEN_HAS_STARTED = 63105;
const PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_END_BEFORE_TODAY = 63106;
const PAUSE_RESULT_FAIL_CAN_NOT_CREATE_A_PAUSE_IN_THE_PAST = 63108;

const getDialogTextContent = (results: PauseSubmitResults, t: TFunction) => {
  const {
    resultIdentifier,
    subscriptionName,
    subscriberName,
    dateStart,
    dateEnd,
  } = results;
  switch (resultIdentifier) {
    case PAUSE_RESULT_SUCCESS:
      return t('pause.dialogs.success.content', {
        subscriptionName,
        subscriberName,
        dateStart,
        dateEnd,
      });
    case PAUSE_RESULT_FAIL_INCOMING_BILL:
      return t('pause.dialogs.fail.contentIncomingBill', {
        subscriptionName,
        subscriberName,
      });
    case PAUSE_RESULT_FAIL_OVERLAP_PAUSE:
      return t('pause.dialogs.fail.contentOverlapPause', {
        subscriptionName,
        subscriberName,
        dateStart,
        dateEnd,
      });
    case PAUSE_RESULT_FAIL_INVALID_TIMEDELTA:
      return t('pause.dialogs.fail.contentInvalidTimedelta');
    case PAUSE_RESULT_FAIL_CAN_NOT_CANCEL_PAUSE:
      return t('pause.dialogs.fail.contentCanNotCancelPause');
    case PAUSE_RESULT_FAIL_SUBSCRIPTION_WILL_END_BEFORE_PAUSE:
      return t('pause.dialogs.fail.contentSubscriptionWillEndBeforePause');
    case PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_START_WHEN_HAS_STARTED:
      return t('pause.dialogs.fail.contentCanNotEditPauseStartWhenHasStarted');
    case PAUSE_RESULT_FAIL_CAN_NOT_UPDATE_PAUSE_END_BEFORE_TODAY:
      return t('pause.dialogs.fail.contentCanNotEditPauseEndBeforeToday');
    case PAUSE_RESULT_FAIL_CAN_NOT_CREATE_A_PAUSE_IN_THE_PAST:
      return t('pause.dialogs.fail.contentCanNotCreateAPauseInThePast');
    default:
      return t('pause.dialogs.fail.contentUnknownError');
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

  if (props.results.resultIdentifier === PAUSE_RESULT_SUCCESS) {
    return (
      <GenericDialogWithIconHeader
        open={props.openDialog}
        headerAlign="center"
        headerIcon={<ValidationIcon color="green" />}
        headerTitle={t('pause.dialogs.success.title')}
        footerAlign="center"
        onConfirmClick={props.closeAllDialogs}
        onConfirmText={t('pause.dialogs.success.continue')}
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
      headerTitle={t('pause.dialogs.fail.title')}
      footerAlign="center"
      onConfirmClick={props.backToPreviousDialog}
      onConfirmText={t('pause.dialogs.fail.comeback')}
      onConfirmVariant="contained"
      onCancelClick={props.closeAllDialogs}
      onCancelText={t('pause.dialogs.common.cancel')}
    >
      <Typography variant="body1" align="center">
        {content}
      </Typography>
    </GenericDialogWithIconHeader>
  );
};

export default React.memo(GenericPauseResultDialog);
