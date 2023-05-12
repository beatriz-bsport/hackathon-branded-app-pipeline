// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import Typography from '@material-ui/core/Typography';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import FormGroup from '@material-ui/core/FormGroup';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import Radio from '@material-ui/core/Radio';
import CheckBox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FilterListIcon from '@material-ui/icons/FilterList';

import useCadenceFormContext from '../hooks';
import useCadenceFormStyles from '../hooks/styles.hook';

import { CheckboxFieldWithAction } from '#components/forms';

import { RuleBetweenEntryEvent } from '../../../../constants';

import MaterialUISelector from '#components/Selector/MaterialUISelector.component';

import type { FormikValues } from './index';
import type { SmartList } from '#libs/smart-list/types';

type Props = {
  smartlists: SmartList[];
  forceAndLogicForTriggerAndSmartList: boolean;
  cadenceEntry?: boolean;
  cadenceExitSuccess?: boolean;
  cadenceExitFail?: boolean;
};

export const TriggerSectionForm: React.FC<Props> = ({
  smartlists,
  forceAndLogicForTriggerAndSmartList,
  cadenceEntry,
  cadenceExitSuccess,
  cadenceExitFail,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useCadenceFormStyles();

  const { values, setFieldValue }: FormikValues = useFormikContext();

  const [displaySmartlistAsTriggerFilter, setDisplaySmartlistAsTriggerFilter] =
    React.useState(false);

  const smartListChoices = React.useMemo(
    () => [...(smartlists || [])],
    [smartlists],
  );

  const {
    setTriggerLogicOperandSelected,
    triggerOperandSelectedOption,
    smartListSelectedOption,
    setTriggerSmartListSelected,
    setTriggerEventKind,
    triggerEventKindSelected,
    CADENCE_EVENT_GROUPED_OPTIONS,
  } = useCadenceFormContext({
    smartlists: smartListChoices,
    forceAndLogicForTriggerAndSmartList: !!forceAndLogicForTriggerAndSmartList,
  });

  const handleEventRadioChange = (
    trigger_has_event: boolean = false,
    trigger_has_smartlist: boolean = false,
  ) => {
    if (values.trigger_has_event !== trigger_has_event) {
      setFieldValue('trigger_has_event', trigger_has_event);
      setTriggerSmartListSelected(null);
    }
    if (values.trigger_has_smartlist !== trigger_has_smartlist) {
      setFieldValue('trigger_has_smartlist', trigger_has_smartlist);
      setTriggerEventKind(null);
    }
  };

  const handleEventsCheckboxClick = useCallback(() => {
    setTriggerEventKind(null);
  }, [setTriggerEventKind]);

  const handleSmartlistsCheckboxClick = useCallback(() => {
    setTriggerSmartListSelected(null);
  }, [setTriggerSmartListSelected]);

  const handleDisplaySmartlistAsTriggerFilter = useCallback(() => {
    setDisplaySmartlistAsTriggerFilter(!displaySmartlistAsTriggerFilter);
    setFieldValue('trigger_has_smartlist', !values.trigger_has_smartlist);
    if (!displaySmartlistAsTriggerFilter) {
      setTriggerSmartListSelected(null);
    }
  }, [
    displaySmartlistAsTriggerFilter,
    setFieldValue,
    setTriggerSmartListSelected,
    values.trigger_has_smartlist,
  ]);

  useEffect(() => {
    // The Smartlist selected on the form will always be used in the filtering configuration
    // but the FrontEnd can 'display it' as an event (EmptyTrigger with Filtering are display like this)
    // so here we make sure that if trigger_has_event and the event if configured then we display the
    // smartlist as a filter of the trigger event.

    const triggerHasEventAndEventKindIsSet =
      values.trigger_has_event && !!values.trigger_event_kind;

    const triggerHasSmartListAndSmartListisSet =
      values.trigger_has_smartlist && !!values.trigger_smartlist_selected;

    if (
      triggerHasEventAndEventKindIsSet &&
      triggerHasSmartListAndSmartListisSet
    ) {
      setDisplaySmartlistAsTriggerFilter(true);
    }
  }, [
    values.trigger_event_kind,
    values.trigger_has_event,
    values.trigger_has_smartlist,
    values.trigger_smartlist_selected,
  ]);

  useEffect(() => {
    // When a smartlist is selected but none event is selected
    // the logic trigger must be set on OR and not on AND as it is by default

    const smartlistWithoutEvent =
      !values.trigger_has_event && values.trigger_has_smartlist;

    if (smartlistWithoutEvent) {
      setFieldValue(
        'trigger_logic_between_event_and_smartlist',
        RuleBetweenEntryEvent.OR_RULE_BETWEEN_ENTRY_EVENT,
      );
    }
  }, [setFieldValue, values.trigger_has_event, values.trigger_has_smartlist]);

  const [prevHasEvent, setPrevHasEvent] = useState(values.trigger_has_event);
  const [prevHasSmartlist, setPrevHasSmartlist] = useState(
    values.trigger_has_smartlist,
  );

  useEffect(() => {
    // If an event there is a change and a smartlist are
    // selected at the same time the logic trigger must be
    // set on AND by default

    const hasEventAndSmartlist =
      values.trigger_has_event && values.trigger_has_smartlist;
    const valuesHaveChanged =
      prevHasEvent !== values.trigger_has_event ||
      prevHasSmartlist !== values.trigger_has_smartlist;

    if (hasEventAndSmartlist && valuesHaveChanged) {
      setFieldValue(
        'trigger_logic_between_event_and_smartlist',
        RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
      );
    }

    setPrevHasEvent(values.trigger_has_event);
    setPrevHasSmartlist(values.trigger_has_smartlist);
  }, [
    prevHasEvent,
    prevHasSmartlist,
    setFieldValue,
    values.trigger_has_event,
    values.trigger_has_smartlist,
  ]);

  const alertInfotext = React.useMemo(() => {
    if (cadenceEntry) {
      return t('cadence.form.trigger.helpers.cadence');
    }
    if (cadenceExitSuccess) {
      return t('cadence.form.trigger.helpers.exitSuccess');
    }
    if (cadenceExitFail) {
      return t('cadence.form.trigger.helpers.exitFail');
    }
    return t('cadence.form.trigger.helpers.step');
  }, [cadenceEntry, cadenceExitSuccess, cadenceExitFail, t]);

  const triggerLabel = React.useMemo(() => {
    if (cadenceEntry) {
      return t('cadence.form.trigger.labels.cadence');
    }
    if (cadenceExitSuccess) {
      return t('cadence.form.trigger.labels.exitSuccess');
    }
    if (cadenceExitFail) {
      return t('cadence.form.trigger.labels.exitFail');
    }
    return t('cadence.form.trigger.labels.step');
  }, [cadenceEntry, cadenceExitSuccess, cadenceExitFail, t]);

  const helperText = React.useMemo(() => {
    if (
      values.trigger_logic_between_event_and_smartlist ===
      RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT
    ) {
      return t('cadence.form.trigger.event_and_smartlist_helper');
    }
    return t('cadence.form.trigger.event_or_smartlist_helper');
  }, [t, values.trigger_logic_between_event_and_smartlist]);

  if (!forceAndLogicForTriggerAndSmartList) {
    return (
      <div>
        <div className={classes.titleWithIcon}>
          <OfflineBoltIcon className={classes.icon} />
          <Typography variant="h6">
            {t('cadence.form.trigger.title')}
          </Typography>
        </div>
        <div className={classes.alertContainer}>
          <Alert severity="info" className={classes.alert}>
            {alertInfotext}
          </Alert>
        </div>
        <FormGroup>
          <Typography variant="body1">{triggerLabel}</Typography>
          <div className={classes.paddingLeft2}>
            <CheckboxFieldWithAction
              id="select_entry_type_event"
              name="trigger_has_event"
              label={t('cadence.form.trigger.trigger_event_kind_label')}
              handleOnChange={handleEventsCheckboxClick}
            />
          </div>
          <Collapse in={values.trigger_has_event}>
            <div
              className={classNames(
                classes.paddingTop2,
                classes.paddingBottom2,
              )}
            >
              <MaterialUISelector
                options={CADENCE_EVENT_GROUPED_OPTIONS}
                isClearable
                onChange={setTriggerEventKind}
                value={triggerEventKindSelected}
              />
            </div>
          </Collapse>
          <div
            className={classNames(classes.paddingLeft2, classes.paddingBottom2)}
          >
            <CheckboxFieldWithAction
              id="select_entry_type_smartlist"
              name="trigger_has_smartlist"
              label={t('cadence.form.trigger.trigger_smartlist_kind_label')}
              handleOnChange={handleSmartlistsCheckboxClick}
            />
          </div>
          <Collapse in={values.trigger_has_smartlist}>
            <div className={classes.paddingBottom2}>
              <MaterialUISelector
                options={(smartListChoices || []).map((sm) => ({
                  label: sm.name,
                  value: sm.id,
                }))}
                isClearable
                onChange={setTriggerSmartListSelected}
                value={smartListSelectedOption}
              />
            </div>
          </Collapse>
          <Collapse
            in={values.trigger_has_event && values.trigger_has_smartlist}
          >
            <div
              className={classNames(
                classes.ruleBetweenEntry,
                classes.paddingBottom2,
                classes.flexDiv,
              )}
            >
              <div className={classes.operatorHelperText}>
                <Typography variant="body1">
                  {t('cadence.form.trigger.rule_between_triggers')}
                </Typography>
              </div>
              <div className={classes.operatorSelector}>
                <MaterialUISelector
                  options={[
                    {
                      label: t(
                        'cadence.form.trigger.and_rule_between_triggers',
                      ),
                      value: RuleBetweenEntryEvent.AND_RULE_BETWEEN_ENTRY_EVENT,
                    },
                    {
                      label: t('cadence.form.trigger.or_rule_between_triggers'),
                      value: RuleBetweenEntryEvent.OR_RULE_BETWEEN_ENTRY_EVENT,
                    },
                  ]}
                  onChange={setTriggerLogicOperandSelected}
                  value={triggerOperandSelectedOption}
                />
              </div>
            </div>
            <Typography variant="caption" color="textSecondary">
              {helperText}
            </Typography>
          </Collapse>
        </FormGroup>
      </div>
    );
  }

  return (
    <div>
      <div className={classes.titleWithIcon}>
        <OfflineBoltIcon className={classes.icon} />
        <Typography variant="h6">{t('cadence.form.trigger.title')}</Typography>
      </div>
      <div className={classes.alertContainer}>
        <Alert severity="info" className={classes.alert}>
          {cadenceEntry
            ? t('cadence.form.trigger.helpers.cadence')
            : t('cadence.form.trigger.helpers.step')}
        </Alert>
      </div>
      <FormGroup>
        <Typography variant="body1">{triggerLabel}</Typography>
        {/* NON FORMIK PART */}
        <div className={classes.paddingLeft2}>
          <FormControlLabel
            id="trigger_has_event_radio"
            control={
              <Radio
                checked={values.trigger_has_event}
                onClick={() => handleEventRadioChange(true, false)}
              />
            }
            label={t('cadence.form.trigger.trigger_event_kind_label')}
          />
        </div>
        <div
          className={classNames(classes.paddingTop2, classes.paddingBottom2)}
        >
          <MaterialUISelector
            options={CADENCE_EVENT_GROUPED_OPTIONS}
            isClearable
            onChange={setTriggerEventKind}
            value={triggerEventKindSelected}
            isDisabled={!values.trigger_has_event}
          />
          <div className={classes.paddingLeft2}>
            <Collapse
              in={values.trigger_has_event && !!values.trigger_event_kind}
            >
              <FormControlLabel
                id="add_filtering_config_to_event_trigger"
                control={
                  <CheckBox
                    checked={displaySmartlistAsTriggerFilter}
                    onClick={handleDisplaySmartlistAsTriggerFilter}
                  />
                }
                label={
                  <Typography variant="caption">
                    {t('cadence.form.trigger.had_filtering_on_selected_event')}
                  </Typography>
                }
              />
            </Collapse>
            <Collapse
              in={
                values.trigger_has_event &&
                !!values.trigger_event_kind &&
                displaySmartlistAsTriggerFilter
              }
            >
              <div className={classes.selectorWithIcon}>
                <FilterListIcon />
                <div style={{ width: '100%' }}>
                  <MaterialUISelector
                    options={(smartListChoices || []).map((sm) => ({
                      label: sm.name,
                      value: sm.id,
                    }))}
                    isClearable
                    onChange={setTriggerSmartListSelected}
                    value={smartListSelectedOption}
                    isDisabled={!values.trigger_has_event}
                  />
                </div>
              </div>
            </Collapse>
          </div>
        </div>
        <div className={classes.paddingLeft2}>
          <FormControlLabel
            id="trigger_has_smartlist_radio"
            control={
              <Radio
                checked={
                  values.trigger_has_smartlist && !values.trigger_has_event
                }
                onClick={() => handleEventRadioChange(false, true)}
              />
            }
            label={t('cadence.form.trigger.trigger_smartlist_kind_label')}
          />
        </div>
        <div className={classes.paddingBottom2}>
          <MaterialUISelector
            options={(smartListChoices || []).map((sm) => ({
              label: sm.name,
              value: sm.id,
            }))}
            isClearable
            onChange={setTriggerSmartListSelected}
            value={values.trigger_has_event ? null : smartListSelectedOption}
            isDisabled={
              !values.trigger_has_smartlist || values.trigger_has_event
            }
          />
        </div>
        {/* NON FORMIK PART */}
      </FormGroup>
    </div>
  );
};

export default TriggerSectionForm;
