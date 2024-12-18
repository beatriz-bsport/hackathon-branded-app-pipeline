import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core';
import { DateTime } from 'luxon';
import isEqual from 'lodash/isEqual';
import {
  COMMUNICATION_FILTER_IDENTIFIER_KIND,
  COMMUNICATION_FILTER_IDENTIFIER_CHANNEL,
  COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT,
  COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER,
  COMMUNICATION_FILTER_IDENTIFIER_SRC_OR_DST,
} from '#src/libs/communication-v2/constants';
import { getFieldChoicesByIdentifier } from '#src/libs/communication-v2/utils';
import { SelectFieldItem } from '#src/libs/communication-v2/types';
import CommunicationFilterDateField from './CommunicationFilterDateField.component';
import CommunicationFilterGenericField from './CommunicationFilterGenericField.component';

type FilterModalProps = {
  hasKindFilter?: boolean;
  hasRecipientFilter?: boolean;
  hasChannelFilter?: boolean;
  hasSendParameterFilter?: boolean;
  hasSrcOrDstFilter?: boolean;
  hasDatesFilter?: boolean;
  kindFilterValues?: SelectFieldItem[];
  kindFilterSetter?: (args: SelectFieldItem[]) => void;
  kindFilterOptionsOverride?: SelectFieldItem[];
  recipientFilterValues?: SelectFieldItem[];
  recipientFilterSetter?: (args: SelectFieldItem[]) => void;
  recipientFilterOptionsOverride?: SelectFieldItem[];
  channelFilterValues?: SelectFieldItem[];
  channelFilterSetter?: (args: SelectFieldItem[]) => void;
  channelFilterOptionsOverride?: SelectFieldItem[];
  sendParameterFilterValues?: SelectFieldItem[];
  sendParameterFilterSetter?: (args: SelectFieldItem[]) => void;
  sendParameterFilterOptionsOverride?: SelectFieldItem[];
  srcOrDstFilterValues?: SelectFieldItem[];
  srcOrDstFilterSetter?: (args: SelectFieldItem[]) => void;
  srcOrDstFilterOptionsOverride?: SelectFieldItem[];
  dateStartValue?: DateTime;
  dateStartSetter?: (newDate: DateTime) => void;
  dateEndValue?: DateTime;
  dateEndSetter?: (newDate: DateTime) => void;
  handleFiltersSubmit: () => void;
  allPreviousFilter?: {
    filters: number[];
    dateStart: number;
    dateEnd: number;
  };
};

export const CommunicationFilterCollapse = (props: FilterModalProps) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);
  const allFilterNumbers = []
    .concat(props.kindFilterValues?.map((field) => field.value))
    .concat(props.recipientFilterValues?.map((field) => field.value))
    .concat(props.channelFilterValues?.map((field) => field.value))
    .concat(props.sendParameterFilterValues?.map((field) => field.value))
    .concat(props.srcOrDstFilterValues?.map((field) => field.value));
  const enableSubmitButton =
    (props.dateStartValue?.toUnixInteger() || null) !==
      props.allPreviousFilter?.dateStart ||
    (props.dateEndValue?.toUnixInteger() || null) !==
      props.allPreviousFilter?.dateEnd ||
    !isEqual(allFilterNumbers, props.allPreviousFilter.filters);
  return (
    <Paper className={classes.container}>
      <div className={classes.filtersContainer}>
        {props.hasKindFilter && (
          <CommunicationFilterGenericField
            fieldChoices={
              props.kindFilterOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_KIND,
                t,
              )
            }
            fieldName={t(`filter.kind.title`)}
            fieldPlaceholder={t(`filter.kind.placeholder`)}
            fieldValues={props.kindFilterValues}
            fieldValuesSetter={props.kindFilterSetter}
          />
        )}
        {props.hasDatesFilter && (
          <CommunicationFilterDateField
            fieldEndSetter={props.dateEndSetter}
            fieldEndValue={props.dateEndValue}
            fieldStartSetter={props.dateStartSetter}
            fieldStartValue={props.dateStartValue}
          />
        )}
        {props.hasRecipientFilter && (
          <CommunicationFilterGenericField
            fieldChoices={
              props.recipientFilterOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT,
                t,
              )
            }
            fieldName={t(`filter.recipient.title`)}
            fieldPlaceholder={t(`filter.recipient.placeholder`)}
            fieldValues={props.recipientFilterValues}
            fieldValuesSetter={props.recipientFilterSetter}
          />
        )}
        {props.hasChannelFilter && (
          <CommunicationFilterGenericField
            fieldChoices={
              props.channelFilterOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_CHANNEL,
                t,
              )
            }
            fieldName={t(`filter.channel.title`)}
            fieldPlaceholder={t(`filter.channel.placeholder`)}
            fieldValues={props.channelFilterValues}
            fieldValuesSetter={props.channelFilterSetter}
          />
        )}
        {props.hasSendParameterFilter && (
          <CommunicationFilterGenericField
            noMulti
            fieldChoices={
              props.sendParameterFilterOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER,
                t,
              )
            }
            fieldName={t(`filter.sendParameter.title`)}
            fieldPlaceholder={t(`filter.sendParameter.placeholder`)}
            fieldValues={props.sendParameterFilterValues}
            fieldValuesSetter={props.sendParameterFilterSetter}
          />
        )}
        {props.hasSrcOrDstFilter && (
          <CommunicationFilterGenericField
            noMulti
            fieldChoices={
              props.srcOrDstFilterOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_SRC_OR_DST,
                t,
              )
            }
            fieldName={t(`filter.srcOrDst.title`)}
            fieldPlaceholder={t(`filter.srcOrDst.placeholder`)}
            fieldValues={props.srcOrDstFilterValues}
            fieldValuesSetter={props.srcOrDstFilterSetter}
          />
        )}
      </div>
      <Button
        className={classes.submitButton}
        color="secondary"
        disabled={!enableSubmitButton}
        onClick={props.handleFiltersSubmit}
        variant="contained"
      >
        {t('filter.applyFilter')}
      </Button>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
    zIndex: 500,
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  submitButton: {
    borderRadius: theme.spacing(0.5),
    alignSelf: 'flex-end',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default memo(CommunicationFilterCollapse);
