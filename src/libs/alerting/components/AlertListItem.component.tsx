import React from 'react';
import moment from 'moment-timezone';

import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  UNEVEN_INVOICE_ALERT,
  NEW_ORDER_ALERT,
  REMINDER_NOTE_ALERT_KIND,
  PRIVATE_BOOKING_INCOMPLETE_ALERT,
  COMPANY_ONBOARDING_ALERT,
  UNPAID_PRIVATE_BOOKING_ALERT,
  NEW_TUTORIAL_SECTION_OR_LESSON,
  REPLACEMEMENT_REQUEST_LATE_ALERT_KIND,
  UNREAD_COMMUNICATION,
} from '@bsport/common/lib/master-data/alerting_kind';

import { Trans, useTranslation } from 'react-i18next';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

import type {
  Alerting,
  UnevenInvoiceAlerting,
  NewTutorialSectionOrLessonAlerting,
  PrivateBookingAlerting,
  CompanyOnboardingAlerting,
  NewOrderAlerting,
  TaskAlerting,
  DeleteAlert,
  LateReplacementRequestAlerting,
} from '../types';
import i18n from '../../../i18n';
import { buildUrlParams } from '../../../http';

type Props = {
  alerting: Alerting;
  pushRouter: (path: string) => void;
  deleteAlert: DeleteAlert;
};

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  withTopMargin: {
    marginTop: theme.spacing(1),
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
}));

const UnevenAlertListItem = (props: {
  pushRouter: (path: string) => void;
  alerting: UnevenInvoiceAlerting;
}) => {
  const { alerting } = props;
  const { t } = useTranslation(['alerting']);
  const classes = useStyles();
  const { uuid, legal_identifier, price_payed, price_due } = alerting.data;
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography variant="subtitle1" component="h3">
            {t('unevenInvoice.title')}
          </Typography>
          <IconButton onClick={() => props.pushRouter(`/invoice/${uuid}`)}>
            <ArrowForwardIcon color="secondary" />
          </IconButton>
        </div>

        <Typography variant="caption" component="p">
          <Trans t={t} i18nKey="unevenInvoice.explainUneven">
            The invoice{' '}
            <strong>
              {{ invoice_identifier: legal_identifier ?? uuid.slice(0, 8) }}
            </strong>{' '}
            is uneven
          </Trans>
          <br />
          {t('unevenInvoice.pricePayed', {
            price_payed: getCurrencyDisplayWithPrice(price_payed),
          })}
          <br />
          {t('unevenInvoice.priceDue', {
            price_due: getCurrencyDisplayWithPrice(price_due),
          })}
        </Typography>
      </div>
    </ListItem>
  );
};

const PrivateBookingIncompleteListItem = (props: {
  pushRouter: (path: string) => void;
  alerting: PrivateBookingAlerting;
}) => {
  const { alerting } = props;
  const { t } = useTranslation(['alerting']);
  const classes = useStyles();
  const { user_name, date_start, name } = alerting.data;
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography variant="subtitle1" component="h3">
            {alerting.data.name}
          </Typography>
          <IconButton
            onClick={() =>
              props.pushRouter(
                `/member/${alerting.data.member.id}/private-booking/${alerting.data.private_booking}`,
              )
            }
          >
            <ArrowForwardIcon color="secondary" />
          </IconButton>
        </div>
        <Typography variant="caption" component="p">
          <Trans t={t} i18nKey="privateBookingIncomplete.explain">
            The booking for <strong>{{ name }}</strong> has no coach
          </Trans>
          <br />
          {t('privateBookingIncomplete.date', {
            date_start: moment(date_start).format('LLLL'),
          })}
          <br />
          {t('privateBookingIncomplete.name', { user_name })}
        </Typography>
      </div>
    </ListItem>
  );
};

const CompanyOnboardingAlertListItem = (props: {
  pushRouter: (path: string) => void;
  alerting: CompanyOnboardingAlerting;
}) => {
  const { alerting } = props;
  const { t } = useTranslation(['alerting']);
  const classes = useStyles();

  let title = '';
  let content = null;
  let resolution_url = '/settings/company_onboarding';
  if (alerting.data.type === 'verification') {
    title = t('companyOnboarding.verification.title');
    resolution_url = '/settings/company_onboarding';
    const date = moment(alerting.data.date).format('LL');
    content = (
      <Typography variant="caption" component="div">
        <p>
          <Trans
            t={t}
            date={date}
            i18nKey="companyOnboarding.verification.content"
          >
            You have until <strong>{{ date }}</strong>
            to verify your account
          </Trans>
        </p>
        <p>
          <Trans t={t} i18nKey="companyOnboarding.verification.warning">
            Payments may be
            <strong style={{ color: 'red' }}>disabled</strong>!
          </Trans>
        </p>
      </Typography>
    );
  }
  if (alerting.data.type === 'creation') {
    title = t('companyOnboarding.creation.title');
    resolution_url = '/settings/company_onboarding';
    content = (
      <Typography variant="caption" component="p">
        {t('companyOnboarding.creation.content')}
      </Typography>
    );
  }
  if (alerting.data.type === 'payout') {
    title = t('companyOnboarding.payout.title');
    resolution_url = '/settings/company';
    content = (
      <Typography variant="caption" component="p">
        {t('companyOnboarding.payout.content')}
      </Typography>
    );
  }
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography variant="subtitle1" component="h3">
            {title}
          </Typography>
          <IconButton onClick={() => props.pushRouter(resolution_url)}>
            <ArrowForwardIcon color="secondary" />
          </IconButton>
        </div>
        {content}
      </div>
    </ListItem>
  );
};

const NewOrderAlertListItem = (props: {
  pushRouter: (path: string) => void;
  alerting: NewOrderAlerting;
}) => {
  const { alerting } = props;
  const classes = useStyles();
  const { order, price, name } = alerting.data;
  const { t } = useTranslation(['alerting']);
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography variant="subtitle1" component="h3">
            {t('newOrder.title')}
          </Typography>
          <div className={classes.titleContainer}>
            <IconButton onClick={() => props.pushRouter(`/order/${order}`)}>
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography variant="caption" component="p">
          <Trans t={t} i18nKey="newOrder.explain" name={name}>
            New order paid by <strong>{{ name }}</strong>
          </Trans>
          <br />
          {t('newOrder.price', { price: getCurrencyDisplayWithPrice(price) })}
        </Typography>
      </div>
    </ListItem>
  );
};

const TaskAlertListItem = (props: {
  pushRouter: (path: string) => void;
  alerting: TaskAlerting;
}) => {
  const { alerting } = props;
  const classes = useStyles();
  const { name, description, date_due, member } = alerting.data;
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <div>
            <Typography variant="subtitle1" component="h3">
              {name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {moment(date_due).format('LL')}
            </Typography>
          </div>
          <div className={classes.titleContainer}>
            <IconButton
              onClick={() => props.pushRouter(`/member/${member.id}/`)}
            >
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography variant="caption" component="p">
          {member ? member.name : null}
          <br />
          {description}
        </Typography>
      </div>
    </ListItem>
  );
};

const UnreadCommunicationListItem = (props: {
  pushRouter: (path: string) => void;
  deleteAlert: (alert_kind: number, id: number) => void;
  alerting: TaskAlerting;
}) => {
  const { alerting } = props;
  const classes = useStyles();
  const { name, content, id, photo, member } = alerting.data;

  return (
    <ListItem divider>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <div className={classes.row}>
            <Avatar className={classes.marginRight} src={photo} />
            <div>
              <Typography variant="subtitle1" component="h3">
                {name}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                component="h4"
              >
                {moment(alerting.data.date_created).format('lll')}
              </Typography>
            </div>
          </div>
          <div className={classes.titleContainer}>
            <IconButton
              onClick={() => {
                props.deleteAlert(UNREAD_COMMUNICATION.alert_kind, id);
                props.pushRouter(
                  `/member/${member}/info/${buildUrlParams({
                    openChat: true,
                  })}`,
                );
              }}
            >
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography variant="caption" component="p">
          {content}
        </Typography>
      </div>
    </ListItem>
  );
};

const UnpaidPrivateBookingIncompleteListItem = (props: {
  pushRouter: (path: string) => void;
  alerting: PrivateBookingAlerting;
}) => {
  const { alerting } = props;
  const { t } = useTranslation(['alerting']);
  const classes = useStyles();
  const { user_name, date_start, credits_due } = alerting.data;
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <div>
            <Typography variant="subtitle1" component="h3">
              {alerting.data.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {t('privateBookingIncomplete.date', {
                date_start: moment(date_start).format('LLLL'),
              })}
            </Typography>
          </div>
          <div className={classes.titleContainer}>
            <IconButton
              onClick={() =>
                props.pushRouter(
                  `/member/${alerting.data.member.id}/private-booking/${alerting.data.private_booking}`,
                )
              }
            >
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography variant="caption" component="p">
          {t('privateBookingIncomplete.name', { user_name })}
        </Typography>
        <Typography variant="caption" component="p">
          {t('unpaidPrivateBooking.credits_due', { credits: credits_due })}
        </Typography>
      </div>
    </ListItem>
  );
};

const NewTutorialSectionOrLessonListItem = (props: {
  pushRouter: (path: string) => void;
  alerting: NewTutorialSectionOrLessonAlerting;
  deleteAlert: DeleteAlert;
}) => {
  const { alerting, deleteAlert, pushRouter } = props;
  const { t } = useTranslation(['alerting']);
  const classes = useStyles();
  const { section_names, lesson_names, section_id, lesson_id, new_section } =
    alerting.data;
  const notificationType = new_section ? 'newSection' : 'newLesson';
  const lang: 'en' | 'fr' | 'es' | 'nl' | 'de' | 'it' = [
    'en-GB',
    'en-US',
  ].includes(i18n?.language)
    ? 'en'
    : i18n?.language;

  const title = t(`newTutorialSectionOrLesson.${notificationType}.title`, {
    name: lesson_names[lang],
  });

  const content = t(`newTutorialSectionOrLesson.${notificationType}.content`, {
    name: section_names[lang],
  });

  const onClick = React.useCallback(() => {
    deleteAlert(NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind, lesson_id);
    pushRouter(`/tutorial/${section_id}/${lesson_id}`);
  }, [deleteAlert, pushRouter, section_id, lesson_id]);

  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography variant="subtitle1" component="h3">
            {title}
          </Typography>
          <IconButton onClick={onClick}>
            <ArrowForwardIcon color="secondary" />
          </IconButton>
        </div>
        {content}
      </div>
    </ListItem>
  );
};

const LateReplacementRequestListItem = (props: {
  pushRouter: (path: string) => void;
  alerting: LateReplacementRequestAlerting;
}) => {
  const { alerting } = props;
  const classes = useStyles();
  const { activity_name, date_start, coach } = alerting.data;
  const { t } = useTranslation(['alerting']);
  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography variant="subtitle1" component="h3">
            {coach}
          </Typography>
          <div className={classes.titleContainer}>
            <IconButton
              onClick={() => props.pushRouter('/replacement/management')}
            >
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography variant="caption" component="p">
          {t('lateReplacementRequest.content', {
            activity_name,
            date_start: moment(date_start).format('L LT'),
          })}
        </Typography>
      </div>
    </ListItem>
  );
};

export default function AlertList(props: Props) {
  const { alerting, pushRouter, deleteAlert } = props;
  switch (alerting.alert_kind) {
    case UNEVEN_INVOICE_ALERT.alert_kind:
      return (
        <UnevenAlertListItem alerting={alerting} pushRouter={pushRouter} />
      );
    case NEW_ORDER_ALERT.alert_kind:
      return (
        <NewOrderAlertListItem alerting={alerting} pushRouter={pushRouter} />
      );
    case REMINDER_NOTE_ALERT_KIND.alert_kind:
      return <TaskAlertListItem alerting={alerting} pushRouter={pushRouter} />;
    case COMPANY_ONBOARDING_ALERT.alert_kind:
      return (
        <CompanyOnboardingAlertListItem
          alerting={alerting}
          pushRouter={pushRouter}
        />
      );
    case PRIVATE_BOOKING_INCOMPLETE_ALERT.alert_kind:
      return (
        <PrivateBookingIncompleteListItem
          alerting={alerting}
          pushRouter={pushRouter}
        />
      );
    case UNPAID_PRIVATE_BOOKING_ALERT.alert_kind:
      return (
        <UnpaidPrivateBookingIncompleteListItem
          alerting={alerting}
          pushRouter={pushRouter}
        />
      );
    case NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind:
      return (
        <NewTutorialSectionOrLessonListItem
          alerting={alerting}
          pushRouter={pushRouter}
          deleteAlert={deleteAlert}
        />
      );
    case REPLACEMEMENT_REQUEST_LATE_ALERT_KIND.alert_kind:
      return (
        <LateReplacementRequestListItem
          alerting={alerting}
          pushRouter={pushRouter}
        />
      );
    case UNREAD_COMMUNICATION.alert_kind:
      return (
        <UnreadCommunicationListItem
          alerting={alerting}
          pushRouter={pushRouter}
          deleteAlert={deleteAlert}
        />
      );
    default:
      return null;
  }
}
