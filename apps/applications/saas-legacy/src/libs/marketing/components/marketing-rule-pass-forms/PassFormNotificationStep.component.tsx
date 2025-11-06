import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import { Checkbox, Grid, MenuItem, Typography } from '@material-ui/core';
import { NotificationsActive } from '@material-ui/icons';
import { useFormikContext } from 'formik';
import { MarketingNotification } from '#src/libs/marketing/types';
import MaterialUISelector, {
  ItemRendererProps,
} from '#src/components/Selector/MaterialUISelector.component';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { PaymentPackFormValues } from '../../../payment-packs/types';
import type { PrivatePassFormValues as FormikValues } from '#src/libs/private-service/components/pass/private-pass-form/PrivatePassForm.component';
import { PassType } from '#src/components/passes/types';
import { splitPassNotificationsByTrigger } from '#src/libs/marketing/utils';
import MarketingRulePassNotificationItem from '#src/libs/marketing/components/MarketingRulePassNotificationItem.component';
import MarketingRulePassNotifications from '#src/libs/marketing/components/marketing-rule-list-item/MarketingRulePassNotifications.component';
import { useStyles } from './styles';
import TooltipInfo from '#src/components/TooltipInfo.component';

type NotificationSelectorProps = {
  notifications: MarketingNotification[];
  selectedNotifications: MarketingNotification[];
  emailSummariesById: { [key: string]: EmailTemplateSummary };
  onConfirm: (selectedNotifications: MarketingNotification[]) => void;
};

type NotificationOption = {
  label: string;
  value: number;
  notification: MarketingNotification;
};

const toNotificationOption = (
  notification: MarketingNotification,
): NotificationOption => ({
  label: notification.event_rules.name,
  value: notification.id,
  notification,
});

const NotificationSelector: React.FC<NotificationSelectorProps> = ({
  notifications,
  selectedNotifications,
  emailSummariesById,
  onConfirm,
}: NotificationSelectorProps) => {
  const { t } = useTranslation('marketing');

  const [stagedSelectedNotifications, setStagedSelectedNotification] =
    React.useState<NotificationOption[]>([]);

  useEffect(() => {
    setStagedSelectedNotification(
      selectedNotifications.map(toNotificationOption),
    );
  }, [selectedNotifications]);

  const {
    remainingCreditNotifications,
    remainingValidityNotifications,
    expiredValidityNotifications,
  } = useMemo(
    () => splitPassNotificationsByTrigger(notifications),
    [notifications],
  );

  const groupedOptions = useMemo(
    () => [
      {
        label: t('notifications.notificationTitle.remainingCredit'),
        options: remainingCreditNotifications.map(toNotificationOption),
      },
      {
        label: t('notifications.notificationTitle.remainingValidity'),
        options: remainingValidityNotifications.map(toNotificationOption),
      },
      {
        label: t('notifications.notificationTitle.expiredValidity'),
        options: expiredValidityNotifications.map(toNotificationOption),
      },
    ],
    [
      t,
      remainingCreditNotifications,
      remainingValidityNotifications,
      expiredValidityNotifications,
    ],
  );

  const notificationOptionRenderer = useCallback(
    ({ data, isSelected }: ItemRendererProps<NotificationOption>) => (
      <MenuItem dense>
        <Checkbox checked={isSelected} />
        <MarketingRulePassNotificationItem
          emailSummariesById={emailSummariesById}
          notification={Immutable(data.notification)}
        />
      </MenuItem>
    ),
    [emailSummariesById],
  );

  const handleConfirm = useCallback(() => {
    setStagedSelectedNotification(stagedSelectedNotifications);
    onConfirm(stagedSelectedNotifications.map((option) => option.notification));
  }, [onConfirm, stagedSelectedNotifications]);

  return (
    <MaterialUISelector
      hideChips
      isMulti
      stopEventPropagationOnClickAway
      closeMenuOnSelect={false}
      itemRenderer={notificationOptionRenderer}
      // @ts-expect-error
      onChange={setStagedSelectedNotification}
      onConfirm={handleConfirm}
      // @ts-expect-error
      options={groupedOptions}
      placeholder={t('notifications.select')}
      value={stagedSelectedNotifications}
    />
  );
};

type Props = {
  notifications: MarketingNotification[];
  emailSummariesById: { [key: string]: EmailTemplateSummary };
  passType: PassType;
  passId?: number;

  // Props for the MarketingRuleListPassNotifications component
  emailDetailLoading: boolean;
  emailDetails: { [key: string]: EmailTemplateDetail };
  getEmailDetail: (id: number) => void;
  resolvedGenericTags: ResolvedGenericTags;
  smartListsById: { [key: string]: SmartList };
  smartListLoading: boolean;
  theme: CompanyTheme;
};

const PassFormNotificationStep: React.FC<Props> = ({
  notifications,
  emailSummariesById,
  passType,
  passId,

  // Props for the MarketingRuleListPassNotifications component
  emailDetailLoading,
  emailDetails,
  getEmailDetail,
  resolvedGenericTags,
  smartListsById,
  smartListLoading,
  theme,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');
  const { setFieldValue } = useFormikContext<
    PaymentPackFormValues | FormikValues
  >();

  const contains_all_key =
    passType === PassType.PAYMENT_PACK
      ? 'contains_all_payment_packs'
      : 'contains_all_private_passes';

  const pass_ids_key =
    passType === PassType.PAYMENT_PACK
      ? 'payment_pack_ids'
      : 'private_pass_ids';

  const selectableNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.event_rules[contains_all_key],
      ),
    [contains_all_key, notifications],
  );
  const imposedNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => notification.event_rules[contains_all_key],
      ),
    [contains_all_key, notifications],
  );

  const initialSelection = useMemo(
    () =>
      passId
        ? notifications.filter((notification) =>
            notification.event_rules[pass_ids_key].includes(passId),
          )
        : [],
    [notifications, passId, pass_ids_key],
  );

  const [selectedNotifications, setSelectedNotifications] =
    useState<MarketingNotification[]>(initialSelection);

  const displayedNotifications = useMemo(
    () => selectedNotifications.concat(imposedNotifications),
    [selectedNotifications, imposedNotifications],
  );

  const updateFieldValues = useCallback(
    (notifs: MarketingNotification[]) => {
      const newlySelectedNotifications = notifs.filter(
        (notification) => !initialSelection.includes(notification),
      );
      const deselectedNotifications = initialSelection.filter(
        (notification) => !notifs.includes(notification),
      );
      setFieldValue('addToNotifications', newlySelectedNotifications);
      setFieldValue('removeFromNotifications', deselectedNotifications);
    },
    [initialSelection, setFieldValue],
  );

  const onConfirm = useCallback(
    (notifs: MarketingNotification[]) => {
      // Set the newly selected notifications
      updateFieldValues(notifs);
      setSelectedNotifications(notifs);
    },
    [updateFieldValues],
  );

  const deselectNotification = useCallback(
    (notification: MarketingNotification) => {
      const notifs = selectedNotifications.filter(
        (n) => n.id !== notification.id,
      );
      onConfirm(notifs);
    },
    [onConfirm, selectedNotifications],
  );

  return (
    <div className={classes.container}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between">
            <div className={classes.titleContainer}>
              <NotificationsActive className={classes.icon} />
              <Typography variant="h6">
                {t('notifications.listTitle')}
              </Typography>
            </div>
            <TooltipInfo
              helpText={t('notifications.optionalStepInfo')}
            ></TooltipInfo>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <NotificationSelector
            emailSummariesById={emailSummariesById}
            notifications={selectableNotifications}
            onConfirm={onConfirm}
            selectedNotifications={selectedNotifications}
          />
        </Grid>
        <Grid item xs={12}>
          <MarketingRulePassNotifications
            emailDetailLoading={emailDetailLoading}
            emailDetails={emailDetails}
            emailSummariesById={emailSummariesById}
            getEmailDetail={getEmailDetail}
            notifications={displayedNotifications}
            notificationsLoading={false}
            removeNotification={deselectNotification}
            resolvedGenericTags={resolvedGenericTags}
            smartListsById={smartListsById}
            smartListsLoading={smartListLoading}
            theme={theme}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default PassFormNotificationStep;
