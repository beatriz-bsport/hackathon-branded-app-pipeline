import React from 'react';
import { AxiosResponse } from 'axios';
import memoize from 'memoize-one';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AccessTime from '@material-ui/icons/AccessTime';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Theme, WithStyles, withStyles } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import PauseIcon from '@material-ui/icons/Pause';
import { SubscriptionPause as SubscriptionPausePacks } from '@bsport/common/lib/master-data/subscription-pause';
import CustomMuiDialog from '#src/components/genericDialog/CustomMuiDialog.component';
import InfoGenericBox from '#src/components/box/InfoGenericBox.component';
import { OptionCallback } from '../../../../state/types';
import PauseResultDialog from '../pause/PauseResultDialog.component';
import PauseFormDateRange from '../pause/PauseFormDateRange.component';
import ContractPauseFormPaginatedSubscriptionList from './ContractPauseFormPaginatedSubscriptionList';
import {
  ContractPauseRequestData,
  ContractPause,
  Subscription,
} from '../../types';
import {
  CONTRACT_PAUSE_RESULT_SUCCESS,
  PAUSE_NAME_MAX_LENGTH,
} from '../../constants';
import { fetchContractPauseInfo as fetchContractPauseInfoAPI } from '../../api';

const STEP_DATE_SELECTION = 0;
const STEP_SUBSCRIPTION_VERIFICATION = 1;
const STEP_RESULTS = 2;

type OwnProps = {
  closeForm: () => void;
  contractId: number;
  contractPauseBeingEdited?: ContractPause;
  fetchMembersBySubscription: (subs: Array<Subscription>) => void;
  fetchSubscriptionBulk: (
    ids: Array<number>,
    options: OptionCallback<Array<Subscription>>,
  ) => void;
  onSubmit: (
    data: ContractPauseRequestData,
    options: OptionCallback<any>,
  ) => void;
  openForm: boolean;
  subscriptionData: { [id: number]: Subscription };
};

type Props = OwnProps & WithStyles & WithTranslation;

type State = {
  fromDate: string;
  loadingSubmitResponse: boolean;
  loadingVerificationResponse: boolean;
  pauseExplanation: string;
  step: number;
  subscriptionInvalid: number[];
  subscriptionValid: number[];
  untilDate: string;
};

class ContractPauseFormDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fromDate: props.contractPauseBeingEdited?.from_date
        ? DateTime.fromISO(props.contractPauseBeingEdited.from_date).toISO()
        : DateTime.now().toISO(),
      loadingSubmitResponse: false,
      loadingVerificationResponse: false,
      pauseExplanation: props.contractPauseBeingEdited?.name || '',
      step: STEP_DATE_SELECTION,
      subscriptionValid: [],
      subscriptionInvalid: [],
      untilDate: props.contractPauseBeingEdited?.until_date
        ? DateTime.fromISO(props.contractPauseBeingEdited.until_date).toISO()
        : DateTime.now().toISO(),
    };
  }

  backToDateSelection = () => {
    this.setState({ step: STEP_DATE_SELECTION });
  };

  closeForm = () => {
    this.setState({ step: STEP_DATE_SELECTION });
    this.props.closeForm();
  };

  getFormStep1Buttons = memoize(
    (
      isReasonValid: boolean,
      isDateRangeValid: boolean,
      loadingSubmitResponse: boolean,
    ) => {
      return [
        {
          label: this.props.t('pauseV2.common.actions.cancel'),
          onClick: this.closeForm,
        },
        {
          label:
            !loadingSubmitResponse &&
            this.props.t('pauseV2.common.actions.verify'),
          onClick: this.onVerifyBillingPlans,
          variant: 'text',
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

  getFormStep2Buttons = memoize(
    (isValidListEmpty: boolean, loadingSubmitResponse: boolean) => {
      return [
        {
          label: this.props.t('pauseV2.common.actions.previous'),
          onClick: this.backToDateSelection,
        },
        {
          label:
            !loadingSubmitResponse &&
            this.props.t('pauseV2.common.actions.pause'),
          onClick: this.onSubmitClick,
          variant: 'text',
          color: 'primary',
          disabled: isValidListEmpty || loadingSubmitResponse,
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

  fetchBillingPlansCompatibility = () => {
    fetchContractPauseInfoAPI({
      // @ts-expect-error
      contract: this.props.contractId,
      from_date: this.state.fromDate,
      until_date: this.state.untilDate,
      contract_pause: this.props.contractPauseBeingEdited?.id,
    }).then((r: AxiosResponse) =>
      this.setState({
        subscriptionInvalid: r.data.invalid_for_pause,
        subscriptionValid: r.data.valid_for_pause,
        loadingVerificationResponse: false,
        step: STEP_SUBSCRIPTION_VERIFICATION,
      }),
    );
  };

  onVerifyBillingPlans = () => {
    this.setState(
      { loadingVerificationResponse: true },
      this.fetchBillingPlansCompatibility,
    );
  };

  createOrUpdateContractPause = () => {
    let data: ContractPauseRequestData = {
      from_date: this.state.fromDate,
      until_date: this.state.untilDate,
      days:
        Math.round(
          DateTime.fromISO(this.state.untilDate)
            .diff(DateTime.fromISO(this.state.fromDate), 'days')
            .as('days'),
        ) + 1,
      name: this.state.pauseExplanation,
      contract: this.props.contractId,
      action_pack_kind: SubscriptionPausePacks.PAUSE_PACK_EXTEND,
    };
    if (this.props.contractPauseBeingEdited) {
      data = {
        ...data,
        contract_pause_id: this.props.contractPauseBeingEdited.id,
      };
    }
    this.props.onSubmit(data, {
      onSuccess: this.onSubmitSuccess,
    });
  };

  onSubmitSuccess = () => {
    this.setState({
      step: STEP_RESULTS,
      loadingSubmitResponse: false,
    });
  };

  onSubmitClick = () => {
    this.setState(
      { loadingSubmitResponse: true },
      this.createOrUpdateContractPause,
    );
  };

  render() {
    const { classes, t, openForm, contractPauseBeingEdited } = this.props;
    const deltaDays = Math.round(
      Math.round(
        DateTime.fromISO(this.state.untilDate)
          .diff(DateTime.fromISO(this.state.fromDate), 'days')
          .as('days'),
      ),
    );
    const isDateRangeValid = deltaDays >= 0;
    const buttonsStep1 = this.getFormStep1Buttons(
      !!this.state.pauseExplanation,
      isDateRangeValid,
      this.state.loadingVerificationResponse,
    );
    const buttonsStep2 = this.getFormStep2Buttons(
      !this.state.subscriptionValid.length,
      this.state.loadingSubmitResponse,
    );
    if (!openForm) return <></>;

    return (
      <>
        <CustomMuiDialog
          buttons={buttonsStep1}
          open={this.state.step === STEP_DATE_SELECTION}
          title={t(
            `pauseV2.contractPause.form.firstStep.${
              contractPauseBeingEdited ? 'titleUpdate' : 'titleCreation'
            }`,
          )}
        >
          <div className={classes.formContainer}>
            <TextField
              fullWidth
              multiline
              disabled={!!contractPauseBeingEdited}
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
              setFromDate={this.handleFromDateChange}
              setUntilDate={this.handleUntilDateChange}
              untilDate={this.state.untilDate}
            />
            <div className={classes.informationContainer}>
              <InfoGenericBox
                alignItems="center"
                className={classes.informationBox}
                content={t(
                  'pauseV2.contractPause.form.firstStep.information1',
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
                content={t('pauseV2.contractPause.form.firstStep.information2')}
                type="info"
                variant="contained"
                variantIcon="outlined"
              />
            </div>
          </div>
        </CustomMuiDialog>
        {/* @ts-expect-error */}
        <CustomMuiDialog
          buttons={buttonsStep2}
          open={this.state.step === STEP_SUBSCRIPTION_VERIFICATION}
          title={t(`pauseV2.contractPause.form.secondStep.title`)}
        >
          <ContractPauseFormPaginatedSubscriptionList
            displayTextInfo={!this.state.subscriptionValid?.length}
            fetchMembersBySubscription={this.props.fetchMembersBySubscription}
            fetchSubscriptionBulk={this.props.fetchSubscriptionBulk}
            icon={<PauseIcon />}
            subscriptionData={this.props.subscriptionData}
            subscriptionIdList={this.state.subscriptionValid}
            textInfo={t(
              'pauseV2.contractPause.form.secondStep.noCompatibleSubscriptions',
            )}
            title={t('pauseV2.contractPause.form.secondStep.sectionSuccess')}
          />
          {this.state.subscriptionInvalid?.length > 0 && (
            <>
              <Divider className={classes.dividerList} variant="fullWidth" />
              <ContractPauseFormPaginatedSubscriptionList
                displayTextInfo
                fetchMembersBySubscription={
                  this.props.fetchMembersBySubscription
                }
                fetchSubscriptionBulk={this.props.fetchSubscriptionBulk}
                icon={<CancelIcon />}
                subscriptionData={this.props.subscriptionData}
                subscriptionIdList={this.state.subscriptionInvalid}
                textInfo={t(
                  'pauseV2.contractPause.form.secondStep.incompatibleSubscriptions',
                )}
                title={t(
                  'pauseV2.contractPause.form.secondStep.sectionFailure',
                )}
              />
            </>
          )}
        </CustomMuiDialog>

        {this.state.step === STEP_RESULTS && (
          <PauseResultDialog
            closeAllDialogs={this.closeForm}
            openDialog={this.state.step === STEP_RESULTS}
            results={{
              fromDate: DateTime.fromISO(this.state.fromDate).toFormat('D'),
              untilDate: DateTime.fromISO(this.state.untilDate).toFormat('D'),
              countSubscription: this.state.subscriptionValid.length,
              resultIdentifier: CONTRACT_PAUSE_RESULT_SUCCESS,
            }}
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
  dividerList: {
    marginBottom: theme.spacing(2),
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

export default compose<Props, OwnProps>(
  withTranslation('subscription'),
  withStyles(styles),
)(ContractPauseFormDialog);
