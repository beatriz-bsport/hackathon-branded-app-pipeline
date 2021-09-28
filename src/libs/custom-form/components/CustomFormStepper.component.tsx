import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import Step from '@material-ui/core/Step';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SnoozeIcon from '@material-ui/icons/Snooze';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { MaterialStyleType } from '../../../utils/types';
import type { CustomForm, CustomFormDisplayRule } from '../types';
import CustomFormView from './consumer-form/CustomForm.form';

type OwnProps = {
  customFormList: Array<CustomForm>;
  onSubmitCustomFormItem: (customFormId: number, formData: FormData) => void;
  onSubmitDraft: (customFormId: number, customForm: CustomForm) => void;
  customFormListIsSubmitting: boolean;
  onSubmitCustomFormList: () => void;
  currentCustomFormSubmittingId: null | number;
  temporaryCustomFormData: {
    [id: number]: { completed: FormData; draft: CustomForm };
  };
  customFormDisplayRuleList: Array<CustomFormDisplayRule>;
  onSubmitSnoozed: (customFormId: number) => void;
  onDirectSubmit: (
    formData: FormData,
    customFormId: number,
    isDraft?: boolean,
  ) => void;
  onDisconnect: () => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const CustomFormStepper = (props: Props) => {
  const { t, classes, customFormList, customFormDisplayRuleList } = props;
  const [customFormStep, setCustomFormStep] = React.useState(0);
  const [currentCustomFormId, setCurrentCustomFormId] = React.useState(
    customFormList[0]?.id,
  );
  const userCanDisconnect = customFormDisplayRuleList?.find(
    (rule) => !rule?.snoozable,
  );
  React.useEffect(() => {
    if (customFormStep === -1) {
      setCurrentCustomFormId(null);
    } else {
      customFormList &&
        customFormStep &&
        setCurrentCustomFormId(customFormList[customFormStep].id);
    }
  }, [customFormStep]);
  if (!customFormList || customFormList.length === 0) {
    return <div />;
  }
  const handleCustomFormNext = (formData: FormData) => {
    props.onSubmitCustomFormItem(currentCustomFormId, formData);
    if (customFormStep + 1 < customFormList.length) {
      setCustomFormStep(customFormStep + 1);
    } else {
      setCustomFormStep(-1);
    }
  };
  const handleCustomFormPrevious = (customForm: CustomForm) => {
    props.onSubmitDraft(currentCustomFormId, customForm);
    setCustomFormStep(customFormStep - 1);
  };
  const handleSubmitSnoozed = (customFormId: number) => {
    props.onSubmitSnoozed(customFormId);
    if (customFormStep + 1 < customFormList.length) {
      setCustomFormStep(customFormStep + 1);
    } else {
      setCustomFormStep(-1);
    }
  };
  const handleSubmitDraft = (customFormId: number, customForm: CustomForm) => {
    props.onSubmitDraft(customFormId, customForm);
  };

  if (!currentCustomFormId && customFormStep !== -1) {
    return <div />;
  }
  if (!currentCustomFormId && customFormStep !== -1) {
    return <div />;
  }

  const getDraftData = (customFormId: number) => {
    if (!customFormId) {
      return null;
    }
    return props.temporaryCustomFormData[customFormId]?.draft;
  };
  const getCurrentDisplayRule = (customFormId: number) => {
    if (!customFormId) {
      return null;
    }
    return customFormDisplayRuleList?.find(
      (rule: CustomFormDisplayRule) => rule?.custom_form_id === customFormId,
    );
  };
  if (customFormList?.length === 1) {
    const customForm = customFormList[0];
    const handleDirectSubmit = (formData: FormData) => {
      return props.onDirectSubmit(formData, customForm.id, false);
    };
    const handleDirectSubmitSnoozed = () => {
      return props.onDirectSubmit(null, customForm.id, true);
    };
    return (
      <div className={classes.root}>
        {props.customFormListIsSubmitting && <LinearProgress color="primary" />}
        <div className={classes.rootSingleForm}>
          <div className={classes.stepLabel}>
            <Typography variant="subtitle2">{customForm.name}</Typography>

            <Tooltip title={t('customForm.submitLater')}>
              <IconButton
                onClick={() => handleDirectSubmitSnoozed()}
                disabled={
                  !getCurrentDisplayRule(customForm.id)?.snoozable ||
                  props.customFormListIsSubmitting
                }
              >
                <SnoozeIcon
                  color={
                    getCurrentDisplayRule(customForm.id)?.snoozable
                      ? 'primary'
                      : 'disabled'
                  }
                />
              </IconButton>
            </Tooltip>
          </div>
          <CustomFormView
            initial={customForm}
            onSubmit={handleDirectSubmit}
            isSubmitting={props.customFormListIsSubmitting}
            onCancel={() => props.onDisconnect()}
            disconnectOnCancel
          />
        </div>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      {props.customFormListIsSubmitting && <LinearProgress color="primary" />}
      {userCanDisconnect && (
        <div className={classes.disconnectSection}>
          <Tooltip title={t('customForm.disconnect')}>
            <IconButton onClick={() => props.onDisconnect()}>
              <PowerSettingsNewIcon color="primary" />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <Stepper
        activeStep={customFormStep}
        orientation="vertical"
        className={userCanDisconnect ? classes.zeroPadding : null}
      >
        {customFormList.map((customForm: CustomForm, index: number) => (
          <Step key={index}>
            <StepLabel disabled style={{ width: '100%' }}>
              <div className={classes.stepLabel}>
                {customForm?.name}
                <Tooltip title={t('customForm.submitLater')}>
                  <IconButton
                    onClick={() => handleSubmitSnoozed(customForm.id)}
                    disabled={
                      !getCurrentDisplayRule(customForm.id)?.snoozable ||
                      customFormStep !== index
                    }
                  >
                    <SnoozeIcon
                      color={
                        customFormStep === index &&
                        getCurrentDisplayRule(customForm.id)?.snoozable
                          ? 'primary'
                          : 'disabled'
                      }
                    />
                  </IconButton>
                </Tooltip>
              </div>

              {props.currentCustomFormSubmittingId === customForm.id && (
                <LinearProgress color="primary" />
              )}
            </StepLabel>
            <StepContent>
              <CustomFormView
                initial={customForm}
                initialWithAnswer={getDraftData(customForm.id)}
                onSubmit={handleCustomFormNext}
                onCancel={
                  customFormStep !== 0 ? handleCustomFormPrevious : null
                }
                onSubmitDraft={(values: CustomForm) =>
                  handleSubmitDraft(customForm.id, values)
                }
                isMulti
                isSubmitting={props.customFormListIsSubmitting}
              />
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {customFormStep === -1 && (
        <Paper square elevation={0} className={classes.finalStepContainer}>
          <div className={classes.finalStepHelper}>
            <Typography variant="subtitle1">
              {t('customForm.allStepsCompleted')}
            </Typography>
          </div>

          <div className={classes.flexActions}>
            <Button
              variant="text"
              color="primary"
              onClick={() => setCustomFormStep(customFormList.length - 1)}
              disabled={props.customFormListIsSubmitting}
            >
              {t('customForm.resetSubmit')}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => props.onSubmitCustomFormList()}
              disabled={props.customFormListIsSubmitting}
            >
              {t('customForm.send')}
            </Button>
          </div>
        </Paper>
      )}
    </div>
  );
};
const styles = (theme: Theme) => ({
  root: {
    width: '100%',
  },
  zeroPadding: {
    marginTop: 0,
    paddingTop: 0,
  },

  rootSingleForm: {
    width: '100%',
    padding: theme.spacing(4),
  },
  finalStepContainer: {
    paddingBottom: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  finalStepHelper: {
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  flexActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  stepButton: {
    width: '100%',
  },
  stepLabel: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disconnectSection: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(1.5),
    paddingTop: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormStepper);
