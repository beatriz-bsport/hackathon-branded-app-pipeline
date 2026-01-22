import { useState } from "react";

import type { ControlledFormProps } from "@bsport/form";
import { Divider } from "@bsport/kaizen-primitive-core";

import type { PassTriggerConfigValidationFormData } from "#src/utils/schemas/types";
import type { PassesType } from "#src/utils/types";

import { PassActionField } from "./PassActionField";
import { PassCreditsEventTimingField } from "./PassCreditsEventTimingField";
import { PassEventOccurenceField } from "./PassEventOccurenceField";
import { PassNameField } from "./PassNameField";
import { PassSubscriptionFilteringField } from "./PassSubscriptionFilteringField";
import {
  DEFAULT_PASS_EVENT_OCCURENCE,
  PASS_ACTION_CREDITS_LEFT,
  PASS_ACTION_DAYS_EXPIRED,
  PASS_ACTION_DAYS_LEFT,
  PASS_ACTION_EVENT_TYPE_CREDITS,
  PASS_ACTION_EVENT_TYPE_DAYS,
  PASS_CREDITS_LEFT_BOOKING_COMPLETED,
  PASS_SUBSCRIPTION_FILTERING_IN,
  PASS_SUBSCRIPTION_FILTERING_OUT,
  type PassActionEventType,
  type PassSubscriptionFilteringType,
} from "./types";
import {
  isValidPassAction,
  isValidPassCreditsLeftAction,
  isValidPassSubscriptionFiltering,
} from "./utils";

type PassNotificationTriggerFieldProps = {
  passType: PassesType;
  errors: ControlledFormProps<PassTriggerConfigValidationFormData>["formState"]["errors"];
  setFormValue: ControlledFormProps<PassTriggerConfigValidationFormData>["setValue"];
  watchFormValue: ControlledFormProps<PassTriggerConfigValidationFormData>["watch"];
};

export const PassNotificationTriggerField = ({
  errors,
  setFormValue,
  watchFormValue,
}: PassNotificationTriggerFieldProps) => {
  const creditsEventKind =
    watchFormValue("creditsEventKind") ?? PASS_CREDITS_LEFT_BOOKING_COMPLETED;
  const hours = watchFormValue("hours") ?? DEFAULT_PASS_EVENT_OCCURENCE;
  const creditsLeft =
    watchFormValue("creditsLeft") ?? DEFAULT_PASS_EVENT_OCCURENCE;
  const passEventAction = watchFormValue("passEventAction");
  const daysLeft = watchFormValue("daysLeft") ?? DEFAULT_PASS_EVENT_OCCURENCE;
  const subscriptionFiltering = watchFormValue("disabledInContract") ?? false;
  const [selectedSubscriptionFiltering, setSelectedSubscriptionFiltering] =
    useState<PassSubscriptionFilteringType>(
      subscriptionFiltering
        ? PASS_SUBSCRIPTION_FILTERING_OUT
        : PASS_SUBSCRIPTION_FILTERING_IN,
    );

  const handleNotificationNameUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newAction = event.target.value;
    setFormValue("name", newAction, { shouldValidate: true });
  };

  const handlePassActionUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newAction = event.target.value;
    if (!isValidPassAction(newAction)) {
      console.warn(
        "[Marketing Notification Modal] - Pass Action type do not have a valid type",
      );
      return;
    }

    // Here we want to check this so that we can still keep daysLeft as a positive integer to be rendered in the TextField
    // But then we will be able to know if we have to make it negative on notification creation based on if we want to
    // use it for days left or expiration check in the notification.
    if (newAction === PASS_ACTION_DAYS_LEFT) {
      setFormValue("isPassExpirationCheck", false);
      setFormValue("creditsLeft", DEFAULT_PASS_EVENT_OCCURENCE, {
        shouldValidate: true,
      });
    } else if (newAction === PASS_ACTION_DAYS_EXPIRED) {
      setFormValue("isPassExpirationCheck", true);
      setFormValue("creditsLeft", DEFAULT_PASS_EVENT_OCCURENCE, {
        shouldValidate: true,
      });
    } else if (newAction === PASS_ACTION_CREDITS_LEFT) {
      setFormValue("isPassExpirationCheck", false);
      setFormValue("daysLeft", DEFAULT_PASS_EVENT_OCCURENCE, {
        shouldValidate: true,
      });
    }

    setFormValue("passEventAction", newAction, { shouldValidate: true });
  };

  const handlePassSubscriptionFilteringUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newFilter = event.target.value;
    if (!isValidPassSubscriptionFiltering(newFilter)) {
      console.warn(
        "[Marketing Notification Modal] - Pass Subscription filtering type do not have a valid type",
      );
      return;
    }
    const isSubscriptionExcluded =
      newFilter === PASS_SUBSCRIPTION_FILTERING_OUT;
    setFormValue("disabledInContract", isSubscriptionExcluded);
    setSelectedSubscriptionFiltering(newFilter);
  };

  const handleEventOccurenceUpdate = (amount: number) => {
    if (passEventAction === PASS_ACTION_CREDITS_LEFT) {
      setFormValue("creditsLeft", amount, { shouldValidate: true });
    } else if (
      passEventAction === PASS_ACTION_DAYS_EXPIRED ||
      passEventAction === PASS_ACTION_DAYS_LEFT
    ) {
      setFormValue("daysLeft", amount, { shouldValidate: true });
    }
  };

  const handlePassCreditsLeftEventUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newEventKind = event.target.value;
    if (!isValidPassCreditsLeftAction(newEventKind)) {
      console.warn(
        "[Marketing Notification Modal] - Pass Credits Left event kind type do not have a valid type",
      );
      return;
    }

    setFormValue("creditsEventKind", newEventKind, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handlePassTimingUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const parsed = parseInt(event.target.value, 10);
    const newAmount = Number.isNaN(parsed) ? 0 : parsed;
    setFormValue("hours", newAmount, { shouldValidate: true });
  };

  const eventType: PassActionEventType =
    passEventAction === PASS_ACTION_CREDITS_LEFT
      ? PASS_ACTION_EVENT_TYPE_CREDITS
      : PASS_ACTION_EVENT_TYPE_DAYS;

  const eventOccurenceValue =
    passEventAction === PASS_ACTION_CREDITS_LEFT ? creditsLeft : daysLeft;

  const passEventOccurrenceError =
    passEventAction === PASS_ACTION_CREDITS_LEFT
      ? errors?.creditsLeft?.message
      : errors?.daysLeft?.message;

  return (
    <div className="flex flex-col gap-sm">
      <PassNameField onChange={handleNotificationNameUpdate} />
      <PassActionField
        value={passEventAction}
        onChange={handlePassActionUpdate}
      />
      <PassEventOccurenceField
        eventType={eventType}
        value={eventOccurenceValue}
        fieldError={passEventOccurrenceError}
        onChange={handleEventOccurenceUpdate}
      />
      {passEventAction === PASS_ACTION_CREDITS_LEFT ? (
        <PassCreditsEventTimingField
          selectedKind={creditsEventKind}
          hours={hours}
          onChange={handlePassCreditsLeftEventUpdate}
          onAmountChange={handlePassTimingUpdate}
        />
      ) : null}
      <Divider orientation="horizontal" weight="thin" />
      <PassSubscriptionFilteringField
        value={selectedSubscriptionFiltering}
        onChange={handlePassSubscriptionFilteringUpdate}
      />
    </div>
  );
};
