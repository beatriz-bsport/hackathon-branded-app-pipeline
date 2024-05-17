import React from 'react';
import memoize from 'memoize-one';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AccessTime from '@material-ui/icons/AccessTime';
import {
  CircularProgress,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { DateTime } from 'luxon';
import { OptionCallback } from '../../../../state/types';
import CustomMuiDialog from '#components/genericDialog/CustomMuiDialog.component';
import PauseResultDialog from './PauseResultDialog.component';
import PauseFormDateRange from './PauseFormDateRange.component';
import InfoGenericBox from '#components/box/InfoGenericBox.component';
import {
  PauseSubmitResults,
  PauseRequestData,
  SubscriptionPause,
  Subscription,
} from '../../types';
import { PAUSE_RESULT_SUCCESS, PAUSE_NAME_MAX_LENGTH } from '../../constants';

import { isErrorWithCustomCode } from '#libs/utils';

const PAUSE_RESULT_FAIL_UNKNOWN_ERROR = 63200;

type OwnProps = {
  closeDialog: () => void;
  onSubmit: (data: PauseRequestData, options: OptionCallback<any>) => void;
  openForm: boolean;
  subscription: Subscription;
  pauseBeingEdited?: SubscriptionPause;
  updateEventList: () => void;
};

type Props = OwnProps & WithStyles & WithTranslation;

type State = {
  fromDate: string;
  loadingSubmitResponse: boolean;
  openDialogResult: boolean;
  pauseExplanation: string;
  submitResults: PauseSubmitResults | undefined;
  untilDate: string;
};

class PauseFormDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fromDate:
        DateTime.fromISO(props.pauseBeingEdited?.from_date).toISO() ||
        DateTime.now().toISO(),
      loadingSubmitResponse: false,
      openDialogResult: false,
      pauseExplanation: props.pauseBeingEdited?.name,
      submitResults: null,
      untilDate: props.pauseBeingEdited?.until_date
        ? DateTime.fromISO(props.pauseBeingEdited.until_date).toISO()
        : DateTime.now().toISO(),
    };
  }

  backToFormDialog = () => {
    this.setState({ openDialogResult: false });
  };

  closeFormAndResultDialogs = () => {
    this.setState({ openDialogResult: false });
    this.props.closeDialog();
  };

  getFormButtons = memoize(
    (
      isReasonValid: boolean,
      isDateRangeValid: boolean,
      loadingSubmitResponse: boolean,
    ) => {
      return [
        {
          label: this.props.t('pauseV2.common.actions.cancel'),
          onClick: this.props.closeDialog,
        },
        {
          label:
            !loadingSubmitResponse &&
            this.props.t('pauseV2.common.actions.save'),
          onClick: this.onSubmitClick,
          variant: 'contained',
          color: 'primary',
          disabled:
            !isDateRangeValid || !isReasonValid || loadingSubmitResponse,
          startIcon: loadingSubmitResponse && (
            <CircularProgress color="secondary" size={20} />
          ),
        },
      ];
    },
  );

  handleExplanationChange = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    this.setState({ pauseExplanation: target.value });
  };

  handleFromDateChange = (nextDate: string) => {
    this.setState({ fromDate: nextDate });
  };

  handleUntilDateChange = (nextDate: string) => {
    this.setState({ untilDate: nextDate });
  };

  onSubmitSuccess = (data?: {
    subscription: Subscription;
    pause: { from_date?: string; until_date?: string };
  }) => {
    const { from_date, until_date } = data?.pause;
    this.setState((prevState: State) => ({
      submitResults: {
        resultIdentifier: PAUSE_RESULT_SUCCESS,
        subscriberName: this.props.subscription.memberName,
        subscriptionName: this.props.subscription.name_without_member_name,
        fromDate: DateTime.fromISO(from_date || prevState.fromDate).toFormat(
          'D',
        ),
        untilDate: DateTime.fromISO(until_date || prevState.untilDate).toFormat(
          'D',
        ),
      },
      openDialogResult: true,
      loadingSubmitResponse: false,
    }));
    setTimeout(this.props.updateEventList, 6000);
  };

  onSubmitError = (error: any) => {
    const params = {
      resultIdentifier: PAUSE_RESULT_FAIL_UNKNOWN_ERROR,
      fromDate: '',
      untilDate: '',
    };
    if (isErrorWithCustomCode(error)) {
      params.resultIdentifier =
        error.response.data?.error_code || PAUSE_RESULT_FAIL_UNKNOWN_ERROR;
      if (error.response.data?.error_data) {
        const { pause_overlapped_from_date, days } =
          error.response.data.error_data;
        params.fromDate = DateTime.fromISO(pause_overlapped_from_date).toFormat(
          'D',
        );
        DateTime.fromISO(pause_overlapped_from_date)
          .plus({ days: days - 1 })
          .toFormat('D');
      }
    }
    this.setState({
      submitResults: {
        subscriberName: this.props.subscription.memberName,
        subscriptionName: this.props.subscription.name_without_member_name,
        ...params,
      },
      openDialogResult: true,
      loadingSubmitResponse: false,
    });
  };

  onSubmit = () => {
    let data: PauseRequestData = {
      from_date: this.state.fromDate,
      days:
        Math.round(
          DateTime.fromISO(this.state.untilDate)
            .diff(DateTime.fromISO(this.state.fromDate), 'days')
            .as('days'),
        ) + 1,
      name: this.state.pauseExplanation,
    };
    if (this.props.pauseBeingEdited) {
      data = {
        ...data,
        pause_id: this.props.pauseBeingEdited.id,
      };
    }
    this.props.onSubmit(data, {
      onSuccess: this.onSubmitSuccess,
      onError: this.onSubmitError,
    });
  };

  onSubmitClick = () => {
    this.setState({ loadingSubmitResponse: true }, this.onSubmit);
  };

  render() {
    const { classes, t, pauseBeingEdited } = this.props;
    const deltaDays = Math.round(
      DateTime.fromISO(this.state.untilDate)
        .diff(DateTime.fromISO(this.state.fromDate), 'days')
        .as('days'),
    );
    const isDateRangeValid = deltaDays >= 0;
    const buttons = this.getFormButtons(
      !!this.state.pauseExplanation,
      isDateRangeValid,
      this.state.loadingSubmitResponse,
    );
    const fromDateStartOfDay = DateTime.fromISO(
      pauseBeingEdited?.from_date,
    ).startOf('day');
    const nowStartOfDay = DateTime.now().startOf('day');

    const disableEditOfFromDateValue =
      !!pauseBeingEdited && fromDateStartOfDay < nowStartOfDay;
    return (
      <>
        <CustomMuiDialog
          buttons={buttons}
          open={this.props.openForm && !this.state.openDialogResult}
          title={t(
            `pauseV2.subscriptionPause.form.initStep.${
              pauseBeingEdited ? 'titleUpdate' : 'titleCreation'
            }`,
          )}
        >
          <div className={classes.formContainer}>
            <TextField
              fullWidth
              multiline
              inputProps={{ maxLength: PAUSE_NAME_MAX_LENGTH }}
              onChange={this.handleExplanationChange}
              placeholder={t('pauseV2.common.form.reasonPlaceholder')}
              value={this.state.pauseExplanation}
            />
            <Divider className={classes.divider} variant="fullWidth" />
            <div className={classes.durationContainer}>
              <AccessTime className={classes.durationIcon} fontSize="small" />
              <Typography variant="h6">
                {t('pauseV2.common.form.duration.title')}
              </Typography>
            </div>
            <PauseFormDateRange
              fromDate={this.state.fromDate}
              isDateRangeValid={isDateRangeValid}
              setFromDate={
                disableEditOfFromDateValue
                  ? undefined
                  : this.handleFromDateChange
              }
              setUntilDate={this.handleUntilDateChange}
              untilDate={this.state.untilDate}
            />
            <div className={classes.informationContainer}>
              <InfoGenericBox
                alignItems="center"
                className={classes.informationBox}
                content={t(
                  'pauseV2.subscriptionPause.form.initStep.information1',
                  {
                    fromDate: DateTime.fromISO(this.state.fromDate).toFormat(
                      'D',
                    ),
                    untilDate: DateTime.fromISO(this.state.untilDate).toFormat(
                      'D',
                    ),
                    count: deltaDays + 1,
                  },
                )}
                type="info"
                variant="contained"
                variantIcon="outlined"
              />
              <InfoGenericBox
                alignItems="center"
                className={classes.informationBox}
                content={t(
                  'pauseV2.subscriptionPause.form.initStep.information2',
                )}
                type="info"
                variant="contained"
                variantIcon="outlined"
              />
            </div>
          </div>
        </CustomMuiDialog>
        {this.state.openDialogResult && (
          <PauseResultDialog
            backToPreviousDialog={this.backToFormDialog}
            closeAllDialogs={this.closeFormAndResultDialogs}
            openDialog={this.state.openDialogResult}
            results={this.state.submitResults}
          />
        )}
      </>
    );
  }
}

const styles: any = (theme: Theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
  },
  durationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  durationIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  informationBox: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  informationContainer: {
    marginTop: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withTranslation('subscription'),
  withStyles(styles),
)(PauseFormDialog);
