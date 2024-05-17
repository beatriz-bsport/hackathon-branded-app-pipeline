import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ListItem, Typography, Switch, IconButton } from '@material-ui/core';
import {
  Delete,
  Edit,
  MailOutline,
  NotificationsNone,
} from '@material-ui/icons';
import { DeepPartial } from 'seamless-immutable';
import { TFunction } from 'i18next';
import { MarketingNotification } from '#libs/marketing/types';
import { EmailTemplateSummary } from '#libs/email-editor/types';
// @ts-expect-error
import withConfirm from '#hocs/with-confirm.hoc';

type OwnProps = {
  marketingNotification: MarketingNotification;
  email: EmailTemplateSummary;
  updateNotification: (
    id: number,
    data: DeepPartial<MarketingNotification>,
  ) => void;
  editNotification: (notification: MarketingNotification) => void;
  deleteNotification: (id: number) => void;
};

type Props = OwnProps;

const ButtonWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'establishment:notification.modal.title',
  cancel: 'establishment:notification.modal.cancel',
  confirm: 'establishment:notification.modal.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('establishment:notification.modal.content')}</p>
  ),
});

export const MarketingRuleListEstablishmentGroup: React.FC<Props> = ({
  marketingNotification,
  email,
  updateNotification,
  editNotification,
  deleteNotification,
}) => {
  const { t } = useTranslation(['booking']);
  const classes = useStyles();
  const label = React.useMemo(() => {
    switch (marketingNotification?.event_rules?.notify_booking_nb) {
      case 0:
        return t(`notification.form.bookingNumberAll`);
      case 1:
        return t(`notification.form.bookingNumberFirst`);
      case 2:
        return t(`notification.form.bookingNumberSecond`);
      case 3:
        return t(`notification.form.bookingNumberThird`);
      default:
        return t(`notification.form.bookingNumberN`, {
          notify_booking_nb:
            marketingNotification?.event_rules?.notify_booking_nb,
        });
    }
  }, [t, marketingNotification]);

  const labelForRules = React.useMemo(() => {
    const key =
      marketingNotification?.event_rules?.hours < 0
        ? 'second_before'
        : 'second_after';
    const trad = t(`notification.form.chooseTime.${key}`);
    return `${Math.abs(marketingNotification?.event_rules?.hours)} ${trad}`;
  }, [marketingNotification, t]);

  return (
    <>
      <ListItem divider className={classes.paper}>
        <div className={classes.ListItemLeftPart}>
          <div className={classes.sessionTitle}>
            <Typography className={classes.bold}>{label}</Typography>
            <Typography>
              {`${t('notification.title')} ${labelForRules}`}
            </Typography>
          </div>
          {marketingNotification?.push_notification_title && (
            <div className={classes.row}>
              <NotificationsNone color="primary" />
              <Typography>
                {marketingNotification?.push_notification_title}
              </Typography>
            </div>
          )}

          {email && (
            <div className={classes.row}>
              <MailOutline color="primary" />
              <Typography>{email?.title}</Typography>
            </div>
          )}
        </div>
        <div className={classes.ListItemRightPart}>
          <Switch
            checked={marketingNotification?.active}
            onChange={() =>
              updateNotification(marketingNotification?.id, {
                active: !marketingNotification?.active,
              })
            }
          />
          <IconButton onClick={() => editNotification(marketingNotification)}>
            <Edit color="primary" />
          </IconButton>

          <ButtonWithConfirm
            onClick={() => deleteNotification(marketingNotification.id)}
          >
            <Delete className={classes.greyIcon} />
          </ButtonWithConfirm>
        </div>
      </ListItem>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  bold: {
    fontWeight: 500,
  },
  greyIcon: {
    color: theme.palette.grey[700],
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
  },
  ListItemLeftPart: {
    flex: '1',
  },
  ListItemRightPart: {
    flex: '0',
    display: 'flex',
    alignItems: 'center',
  },
  sessionTitle: {
    gap: theme.spacing(1),
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
}));
export default MarketingRuleListEstablishmentGroup;
