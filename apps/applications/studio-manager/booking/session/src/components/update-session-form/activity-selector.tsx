import first from "lodash/first";
import uniqBy from "lodash/uniqBy";
import { FC, useMemo, useState } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Button,
} from "@bsport/kaizen-primitive-core";

import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";
import { useInfiniteGroupActivities } from "#src/hooks/use-infinite-group-activities";
import { useInfiniteScroll } from "#src/hooks/use-infinite-scroll";
import { useUrls } from "#src/urls.js";
import { useTranslation } from "#src/utils/i18n";

import { SessionEditFormData } from "../SessionForm/types";
import { ResponsiveTooltip } from "../common/responsive-tooltip";

type ActivitySelectorProps = {
  fieldIdPrefix: string;
  isGroupSession?: boolean;
};

const ActivitySelector: FC<ActivitySelectorProps> = ({
  fieldIdPrefix,
  isGroupSession = false,
}) => {
  const { watch } = useFormContext<SessionEditFormData>();
  const { t } = useTranslation("sessionEdit");

  const { navigateToClassDetail } = useUrls();

  const [searchQuery, setSearchQuery] = useState("");

  const {
    isLoading,
    groupActivities,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteGroupActivities({
    customerEnabled: true,
    searchParams: {
      searchQuery,
    },
  });

  const activity = watch("meta_activity");

  const { onScroll: handleMenuScroll } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { data: selectedActivity } = useFetchActivitiesByIds(
    [activity],
    !!activity,
    {
      select: (data) => first(data.results),
    },
  );

  const items = useMemo(
    () =>
      uniqBy(
        [...(selectedActivity ? [selectedActivity] : []), ...groupActivities],
        "id",
      ).map((activity) => ({
        label: activity.name,
        id: activity.id.toString(),
      })),
    [selectedActivity, groupActivities],
  );

  return (
    <>
      <Avatar
        shape="squared"
        size="lg"
        src={selectedActivity?.cover_main}
        alt={selectedActivity?.alt_cover_main}
      />
      <div className="flex gap-xs items-end">
        <FormField<SessionEditFormData, "meta_activity", AutocompleteProps>
          name="meta_activity"
          mapProps={({ form: { setValue } }) => ({
            onSelect: (value: string) => {
              if (isGroupSession) return;
              if (!value) return;
              setValue("meta_activity", Number(value), {
                shouldDirty: true,
                shouldValidate: true,
              });
            },
          })}
        >
          <Autocomplete
            fullWidth
            searchMode="remote"
            popoverPlacement="bottom-right"
            defaultSelectedIds={activity ? [activity.toString()] : []}
            items={items}
            textfieldProps={{
              id: `${fieldIdPrefix}-activity-selector-textfield`,
              placeholder: selectedActivity?.name,
              required: true,
              label: t("editSessionForm.content.chooseActivity.label"),
              className: "max-w-component-select",
              disabled: isGroupSession,
            }}
            menuProps={{
              className: "max-h-component-select overflow-y-auto",
              onScroll: handleMenuScroll,
            }}
            loadingProps={{ isLoading }}
            onValueChange={(event: string) => {
              setSearchQuery(event);
            }}
            onClear={() => {
              setSearchQuery("");
            }}
          />
        </FormField>
        <ResponsiveTooltip
          placement="bottom-right"
          label={t("editSessionForm.content.chooseActivity.popover")}
        >
          <Button
            kind="icon-button"
            icon="share-03"
            label={t("editSessionForm.content.chooseActivity.popover")}
            intent="default"
            size="md"
            color="main"
            disabled={!selectedActivity}
            onClick={() => {
              if (!selectedActivity) return;
              navigateToClassDetail(
                selectedActivity.id,
                selectedActivity.is_workshop,
              );
            }}
          />
        </ResponsiveTooltip>
      </div>
    </>
  );
};

export default ActivitySelector;
