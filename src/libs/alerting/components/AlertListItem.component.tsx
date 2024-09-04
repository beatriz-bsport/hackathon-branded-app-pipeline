import React from 'react';
import { DateTime } from 'luxon';

import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  COMPANY_ONBOARDING_ALERT,
  NEW_ORDER_ALERT,
  NEW_TUTORIAL_SECTION_OR_LESSON,
  PRIVATE_BOOKING_INCOMPLETE_ALERT,
  REMINDER_NOTE_ALERT_KIND,
  REPLACEMEMENT_REQUEST_LATE_ALERT_KIND,
  UNEVEN_INVOICE_ALERT,
  UNPAID_PRIVATE_BOOKING_ALERT,
  UNREAD_COMMUNICATION,
} from '@bsport/common/lib/master-data/alerting_kind';

import { Trans, useTranslation } from 'react-i18next';
import { PAYMENT_ENGINE_PAYPAL } from '@bsport/common/lib/master-data/payment-group';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { AVAILABLE_LANGUAGES, LANGUAGES } from '#src/i18n/languages';

import { formatAsDatetimeAdapted } from '#src/utils/datetime';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type {
  Alerting,
  CompanyOnboardingAlerting,
  DeleteAlert,
  LateReplacementRequestAlerting,
  NewOrderAlerting,
  NewTutorialSectionOrLessonAlerting,
  PrivateBookingAlerting,
  UnpaidPrivateBookingAlerting,
  TaskAlerting,
  UnevenInvoiceAlerting,
  UnreadCommunicationAlerting,
} from '../types';
// @ts-expect-error
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
  messageContent: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
}));

const UnevenAlertListItem: React.FC<{
  pushRouter: (path: string) => void;
  alerting: UnevenInvoiceAlerting;
}> = React.memo((props) => {
  const { alerting, pushRouter } = props;
  const { t } = useTranslation('alerting');
  const classes = useStyles();
  const { uuid, legal_identifier, price_payed, price_due } = alerting.data;

  const goToInvoiceDetailPage = React.useCallback(
    () => uuid && pushRouter(`/invoice/${uuid}`),
    [pushRouter, uuid],
  );

  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography component="h3" variant="subtitle1">
            {t('unevenInvoice.title')}
          </Typography>
          <IconButton onClick={goToInvoiceDetailPage}>
            <ArrowForwardIcon color="secondary" />
          </IconButton>
        </div>

        <Typography component="p" variant="caption">
          <Trans i18nKey="unevenInvoice.explainUneven" t={t}>
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
});

const PrivateBookingIncompleteListItem: React.FC<{
  pushRouter: (path: string) => void;
  alerting: PrivateBookingAlerting;
}> = React.memo((props) => {
  const { alerting, pushRouter } = props;
  const { t } = useTranslation('alerting');
  const classes = useStyles();
  const { date_start, member_id, name, private_booking, user_name } =
    alerting.data;

  const goToMemberAppointmentsPage = React.useCallback(
    () =>
      member_id &&
      private_booking &&
      pushRouter(`/member/${member_id}/private-booking/${private_booking}`),
    [member_id, private_booking, pushRouter],
  );

  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography component="h3" variant="subtitle1">
            {name}
          </Typography>
          <IconButton onClick={goToMemberAppointmentsPage}>
            <ArrowForwardIcon color="secondary" />
          </IconButton>
        </div>
        <Typography component="p" variant="caption">
          <Trans i18nKey="privateBookingIncomplete.explain" t={t}>
            The booking for <strong>{{ name }}</strong> has no coach
          </Trans>
          <br />
          {t('privateBookingIncomplete.date', {
            date_start: formatAsDatetimeAdapted(date_start, 'DDDD t'),
          })}
          <br />
          {t('privateBookingIncomplete.name', { user_name })}
        </Typography>
      </div>
    </ListItem>
  );
});

const CompanyOnboardingAlertListItem: React.FC<{
  pushRouter: (path: string) => void;
  alerting: CompanyOnboardingAlerting;
}> = React.memo((props) => {
  const { alerting } = props;
  const { t } = useTranslation('alerting');
  const classes = useStyles();

  let title = '';
  let content = null;
  let resolution_url = '/settings/company_onboarding';

  if (alerting.data.type === 'verification') {
    title = t('companyOnboarding.verification.title');

    resolution_url = '/settings/company_onboarding';

    const date = formatAsDatetimeAdapted(alerting.data.date, 'DDD');

    content = (
      <Typography component="div" variant="caption">
        <p>
          <Trans i18nKey="companyOnboarding.verification.content" t={t}>
            You have until <strong>{{ date }}</strong>
            to verify your account
          </Trans>
        </p>
        <p>
          <Trans i18nKey="companyOnboarding.verification.warning" t={t}>
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
      <Typography component="p" variant="caption">
        {t('companyOnboarding.creation.content')}
      </Typography>
    );
  }

  if (alerting.data.type === 'payout') {
    title = t('companyOnboarding.payout.title');
    resolution_url = '/settings/company';
    content = (
      <Typography component="p" variant="caption">
        {t('companyOnboarding.payout.content')}
      </Typography>
    );
  }

  if (alerting.data.payment_engine_identifier === PAYMENT_ENGINE_PAYPAL) {
    title = t('companyOnboarding.paypal.title');
    resolution_url = '/settings/company';
    content = (
      <Typography component="p" variant="caption">
        {t(`companyOnboarding.paypal.${alerting.data.type}`)}
      </Typography>
    );
  }

  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography component="h3" variant="subtitle1">
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
});

const NewOrderAlertListItem: React.FC<{
  pushRouter: (path: string) => void;
  alerting: NewOrderAlerting;
}> = React.memo((props) => {
  const { alerting, pushRouter } = props;
  const classes = useStyles();
  const { order, price, name } = alerting.data;
  const { t } = useTranslation('alerting');

  const goToOrderPage = React.useCallback(
    () => pushRouter(`/order/${order}`),
    [order, pushRouter],
  );

  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography component="h3" variant="subtitle1">
            {t('newOrder.title')}
          </Typography>
          <div className={classes.titleContainer}>
            <IconButton onClick={goToOrderPage}>
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography component="p" variant="caption">
          <Trans i18nKey="newOrder.explain" t={t}>
            New order paid by <strong>{{ name }}</strong>
          </Trans>
          <br />
          {t('newOrder.price', { price: getCurrencyDisplayWithPrice(price) })}
        </Typography>
      </div>
    </ListItem>
  );
});

const TaskAlertListItem: React.FC<{
  pushRouter: (path: string) => void;
  alerting: TaskAlerting;
}> = React.memo((props) => {
  const { alerting, pushRouter } = props;
  const classes = useStyles();
  const { name, description, date_due, member } = alerting.data;

  const goToMemberGeneralPage = React.useCallback(
    () => member?.id && pushRouter(`/member/${member.id}/`),
    [member?.id, pushRouter],
  );

  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <div>
            <Typography component="h3" variant="subtitle1">
              {name}
            </Typography>
            <Typography color="textSecondary" variant="caption">
              {formatAsDatetimeAdapted(date_due, 'DDD')}
            </Typography>
          </div>
          <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
            {(hasMemberProfileAccessPermission: boolean) =>
              hasMemberProfileAccessPermission && (
                <div className={classes.titleContainer}>
                  <IconButton onClick={goToMemberGeneralPage}>
                    <ArrowForwardIcon color="secondary" />
                  </IconButton>
                </div>
              )
            }
          </ObjectLevelPermissionProvider>
        </div>
        <Typography component="p" variant="caption">
          {member ? member.name : null}
          <br />
          {description}
        </Typography>
      </div>
    </ListItem>
  );
});

const UnreadCommunicationListItem: React.FC<{
  pushRouter: (path: string) => void;
  deleteAlert: (alert_kind: number, id: number) => void;
  alerting: UnreadCommunicationAlerting;
}> = React.memo((props) => {
  const { alerting, deleteAlert, pushRouter } = props;
  const classes = useStyles();
  const { name, content, id, photo, member } = alerting.data;

  const goToMemberChat = React.useCallback(() => {
    deleteAlert(UNREAD_COMMUNICATION.alert_kind, id);
    member &&
      pushRouter(
        `/member/${member}/info/${buildUrlParams({
          openChat: true,
        })}`,
      );
  }, [deleteAlert, id, member, pushRouter]);

  return (
    <ListItem divider>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <div className={classes.row}>
            <Avatar className={classes.marginRight} src={photo} />
            <div>
              <Typography component="h3" variant="subtitle1">
                {name}
              </Typography>
              <Typography
                color="textSecondary"
                component="h4"
                variant="caption"
              >
                {formatAsDatetimeAdapted(alerting.data.date_created, 'DD t')}
              </Typography>
            </div>
          </div>
          <div className={classes.titleContainer}>
            <IconButton onClick={goToMemberChat}>
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography
          className={classes.messageContent}
          component="p"
          variant="caption"
        >
          {content}
        </Typography>
      </div>
    </ListItem>
  );
});

const UnpaidPrivateBookingIncompleteListItem: React.FC<{
  pushRouter: (path: string) => void;
  alerting: UnpaidPrivateBookingAlerting;
}> = React.memo((props) => {
  const { alerting, pushRouter } = props;
  const { t } = useTranslation('alerting');
  const classes = useStyles();
  const { user_name, date_start, credits_due, member_id, private_booking } =
    alerting.data;

  const goToMemberAppointmentsPage = React.useCallback(
    () =>
      member_id &&
      private_booking &&
      pushRouter(`/member/${member_id}/private-booking/${private_booking}`),
    [member_id, private_booking, pushRouter],
  );

  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <div>
            <Typography component="h3" variant="subtitle1">
              {alerting.data.name}
            </Typography>
            <Typography color="textSecondary" variant="caption">
              {t('privateBookingIncomplete.date', {
                date_start: formatAsDatetimeAdapted(date_start, 'DDDD t'),
              })}
            </Typography>
          </div>
          <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
            {(hasMemberProfileAccessPermission: boolean) =>
              hasMemberProfileAccessPermission && (
                <div className={classes.titleContainer}>
                  <IconButton onClick={goToMemberAppointmentsPage}>
                    <ArrowForwardIcon color="secondary" />
                  </IconButton>
                </div>
              )
            }
          </ObjectLevelPermissionProvider>
        </div>
        <Typography component="p" variant="caption">
          {t('privateBookingIncomplete.name', { user_name })}
        </Typography>
        <Typography component="p" variant="caption">
          {t('unpaidPrivateBooking.credits_due', { credits: credits_due })}
        </Typography>
      </div>
    </ListItem>
  );
});

const NewTutorialSectionOrLessonListItem: React.FC<{
  pushRouter: (path: string) => void;
  alerting: NewTutorialSectionOrLessonAlerting;
  deleteAlert: DeleteAlert;
}> = React.memo((props) => {
  const { alerting, deleteAlert, pushRouter } = props;
  const { t } = useTranslation('alerting');
  const classes = useStyles();
  const { section_names, lesson_names, section_id, lesson_id, new_section } =
    alerting.data;
  const notificationType = new_section ? 'newSection' : 'newLesson';
  const lang: Exclude<
    (typeof AVAILABLE_LANGUAGES)[number],
    typeof LANGUAGES.ENGLISH_BRITISH | typeof LANGUAGES.ENGLISH_US
  > = [LANGUAGES.ENGLISH_BRITISH, LANGUAGES.ENGLISH_US].includes(i18n?.language)
    ? LANGUAGES.ENGLISH
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
          <Typography component="h3" variant="subtitle1">
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
});

const LateReplacementRequestListItem: React.FC<{
  pushRouter: (path: string) => void;
  alerting: LateReplacementRequestAlerting;
}> = React.memo((props) => {
  const { alerting, pushRouter } = props;
  const classes = useStyles();
  const { activity_name, date_start, coach } = alerting.data;
  const { t } = useTranslation('alerting');

  const goToReplacementPage = React.useCallback(
    () => pushRouter('/replacement/management'),
    [pushRouter],
  );

  return (
    <ListItem divider style={{ paddingTop: 0 }}>
      <div style={{ width: '100%' }}>
        <div className={classes.titleContainer}>
          <Typography component="h3" variant="subtitle1">
            {coach}
          </Typography>
          <div className={classes.titleContainer}>
            <IconButton onClick={goToReplacementPage}>
              <ArrowForwardIcon color="secondary" />
            </IconButton>
          </div>
        </div>
        <Typography component="p" variant="caption">
          {t('lateReplacementRequest.content', {
            activity_name,
            date_start: DateTime.fromISO(date_start).toFormat('D t'),
          })}
        </Typography>
      </div>
    </ListItem>
  );
});

const AlertListItem: React.FC<Props> = (props) => {
  const { alerting, pushRouter, deleteAlert } = props;
  switch (alerting.alert_kind) {
    case UNEVEN_INVOICE_ALERT.alert_kind:
      return (
        <UnevenAlertListItem
          alerting={alerting as UnevenInvoiceAlerting}
          pushRouter={pushRouter}
        />
      );
    case PRIVATE_BOOKING_INCOMPLETE_ALERT.alert_kind:
      return (
        <PrivateBookingIncompleteListItem
          alerting={alerting as PrivateBookingAlerting}
          pushRouter={pushRouter}
        />
      );
    case COMPANY_ONBOARDING_ALERT.alert_kind:
      return (
        <CompanyOnboardingAlertListItem
          alerting={alerting as CompanyOnboardingAlerting}
          pushRouter={pushRouter}
        />
      );
    case NEW_ORDER_ALERT.alert_kind:
      return (
        <NewOrderAlertListItem
          alerting={alerting as NewOrderAlerting}
          pushRouter={pushRouter}
        />
      );
    case REMINDER_NOTE_ALERT_KIND.alert_kind:
      return (
        <TaskAlertListItem
          alerting={alerting as TaskAlerting}
          pushRouter={pushRouter}
        />
      );
    case UNREAD_COMMUNICATION.alert_kind:
      return (
        <UnreadCommunicationListItem
          alerting={alerting as UnreadCommunicationAlerting}
          deleteAlert={deleteAlert}
          pushRouter={pushRouter}
        />
      );
    case UNPAID_PRIVATE_BOOKING_ALERT.alert_kind:
      return (
        <UnpaidPrivateBookingIncompleteListItem
          alerting={alerting as UnpaidPrivateBookingAlerting}
          pushRouter={pushRouter}
        />
      );

    case NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind:
      return (
        <NewTutorialSectionOrLessonListItem
          alerting={alerting as NewTutorialSectionOrLessonAlerting}
          deleteAlert={deleteAlert}
          pushRouter={pushRouter}
        />
      );
    case REPLACEMEMENT_REQUEST_LATE_ALERT_KIND.alert_kind:
      return (
        <LateReplacementRequestListItem
          alerting={alerting as LateReplacementRequestAlerting}
          pushRouter={pushRouter}
        />
      );

    default:
      return null;
  }
};

export default React.memo(AlertListItem);
