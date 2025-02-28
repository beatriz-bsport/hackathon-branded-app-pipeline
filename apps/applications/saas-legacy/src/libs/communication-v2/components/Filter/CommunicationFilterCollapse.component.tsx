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
import type { CommunicationListFilters } from '#src/libs/communication-v2/components/CommunicationDrawer.component';
import type { SelectFieldItem } from '#src/libs/communication-v2/types';
import CommunicationFilterDateField from '#src/libs/communication-v2/components/Filter/CommunicationFilterDateField.component';
import CommunicationFilterGenericField from '#src/libs/communication-v2/components/Filter/CommunicationFilterGenericField.component';

type FilterModalProps = {
  hasCommunicationKindsFilter?: boolean;
  hasRecipientTypesFilter?: boolean;
  hasMessageChannelsFilter?: boolean;
  hasAutomatedMessagesFilter?: boolean;
  hasMessagesOriginFilter?: boolean;
  hasDatesFilter?: boolean;
  communicationKinds?: SelectFieldItem[];
  setCommunicationKind?: (args: SelectFieldItem[]) => void;
  communicationKindsOptionsOverride?: SelectFieldItem[];
  recipientTypes?: SelectFieldItem[];
  setRecipientTypes?: (args: SelectFieldItem[]) => void;
  recipientTypesOptionsOverride?: SelectFieldItem[];
  messageChannels?: SelectFieldItem[];
  setMessageChannels?: (args: SelectFieldItem[]) => void;
  messageChannelsOptionsOverride?: SelectFieldItem[];
  automatedMessages?: SelectFieldItem[];
  setAutomatedMessages?: (args: SelectFieldItem[]) => void;
  automatedMessagesOptionsOverride?: SelectFieldItem[];
  messagesOrigin?: SelectFieldItem[];
  setMessagesOrigin?: (args: SelectFieldItem[]) => void;
  messagesOriginOptionsOverride?: SelectFieldItem[];
  dateStart?: DateTime | null;
  setDateStart?: (newDate: DateTime) => void;
  dateEnd?: DateTime | null;
  setDateEnd?: (newDate: DateTime) => void;
  handleFiltersSubmit: () => void;
  allPreviousFilter?: CommunicationListFilters;
};

export const CommunicationFilterCollapse = (props: FilterModalProps) => {
  const classes = useStyles();
  const { t } = useTranslation(['communication']);
  const allFilterNumbers = []
    .concat(props.communicationKinds?.map((field) => field.value))
    .concat(props.recipientTypes?.map((field) => field.value))
    .concat(props.messageChannels?.map((field) => field.value))
    .concat(props.automatedMessages?.map((field) => field.value))
    .concat(props.messagesOrigin?.map((field) => field.value));
  const enableSubmitButton =
    (props.dateStart?.toUnixInteger() || null) !==
      props.allPreviousFilter?.dateStart ||
    (props.dateEnd?.toUnixInteger() || null) !==
      props.allPreviousFilter?.dateEnd ||
    !isEqual(allFilterNumbers, props.allPreviousFilter.filters);
  return (
    <Paper className={classes.container}>
      <div className={classes.filtersContainer}>
        {props.hasCommunicationKindsFilter && (
          <CommunicationFilterGenericField
            fieldChoices={
              props.communicationKindsOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_KIND,
                t,
              )
            }
            fieldName={t(`filter.kind.title`)}
            fieldPlaceholder={t(`filter.kind.placeholder`)}
            fieldValues={props.communicationKinds}
            fieldValuesSetter={props.setCommunicationKind}
          />
        )}
        {props.hasDatesFilter && (
          <CommunicationFilterDateField
            fieldEndSetter={props.setDateEnd}
            fieldEndValue={props.dateEnd}
            fieldStartSetter={props.setDateStart}
            fieldStartValue={props.dateStart}
          />
        )}
        {props.hasRecipientTypesFilter && (
          <CommunicationFilterGenericField
            fieldChoices={
              props.recipientTypesOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT,
                t,
              )
            }
            fieldName={t(`filter.recipient.title`)}
            fieldPlaceholder={t(`filter.recipient.placeholder`)}
            fieldValues={props.recipientTypes}
            fieldValuesSetter={props.setRecipientTypes}
          />
        )}
        {props.hasMessageChannelsFilter && (
          <CommunicationFilterGenericField
            fieldChoices={
              props.messageChannelsOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_CHANNEL,
                t,
              )
            }
            fieldName={t(`filter.channel.title`)}
            fieldPlaceholder={t(`filter.channel.placeholder`)}
            fieldValues={props.messageChannels}
            fieldValuesSetter={props.setMessageChannels}
          />
        )}
        {props.hasAutomatedMessagesFilter && (
          <CommunicationFilterGenericField
            noMulti
            fieldChoices={
              props.automatedMessagesOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER,
                t,
              )
            }
            fieldName={t(`filter.sendParameter.title`)}
            fieldPlaceholder={t(`filter.sendParameter.placeholder`)}
            fieldValues={props.automatedMessages}
            fieldValuesSetter={props.setAutomatedMessages}
          />
        )}
        {props.hasMessagesOriginFilter && (
          <CommunicationFilterGenericField
            noMulti
            fieldChoices={
              props.messagesOriginOptionsOverride ??
              getFieldChoicesByIdentifier(
                COMMUNICATION_FILTER_IDENTIFIER_SRC_OR_DST,
                t,
              )
            }
            fieldName={t(`filter.srcOrDst.title`)}
            fieldPlaceholder={t(`filter.srcOrDst.placeholder`)}
            fieldValues={props.messagesOrigin}
            fieldValuesSetter={props.setMessagesOrigin}
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
