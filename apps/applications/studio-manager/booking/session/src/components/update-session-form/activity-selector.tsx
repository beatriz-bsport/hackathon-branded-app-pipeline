import first from "lodash/first";
import uniqBy from "lodash/uniqBy";
import { FC, useMemo, useState } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Autocomplete,
  AutocompleteProps,
  Avatar,
} from "@bsport/kaizen-primitive-core";

import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";
import { useInfiniteGroupActivities } from "#src/hooks/use-infinite-group-activities";
import { useInfiniteScroll } from "#src/hooks/use-infinite-scroll";
import { useTranslation } from "#src/utils/i18n";

import { SessionEditFormData } from "../SessionForm/types";

type ActivitySelectorProps = {
  fieldIdPrefix: string;
};

const ActivitySelector: FC<ActivitySelectorProps> = ({ fieldIdPrefix }) => {
  const { watch } = useFormContext<SessionEditFormData>();
  const { t } = useTranslation("sessionEdit");

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
      <FormField<SessionEditFormData, "meta_activity", AutocompleteProps>
        name="meta_activity"
        mapProps={({ form: { setValue } }) => ({
          onSelect: (value: string) => {
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
          clearOnSelect
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
    </>
  );
};

export default ActivitySelector;
