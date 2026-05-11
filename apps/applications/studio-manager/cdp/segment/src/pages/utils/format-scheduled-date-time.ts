import { fromIsoString } from "@bsport/datetime-manipulation";

export const formatScheduledDateTime = ({
  scheduledDate,
  scheduledTime,
  companyTimezone,
}: {
  scheduledDate: string;
  scheduledTime: string;
  companyTimezone: string;
}) => {
  const [hour, minute] = scheduledTime.split(":").map(Number);
  const submittedDatetime = fromIsoString(scheduledDate, {
    zone: companyTimezone,
  }).set({
    hour,
    minute,
    second: 0,
    millisecond: 0,
  });

  return `${submittedDatetime.toISODate()}T${submittedDatetime.toFormat("HH:mm")}`;
};
