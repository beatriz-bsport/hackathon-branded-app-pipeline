import {
  type ListItemProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { PackItemPopoverInfo } from "#src/components/PackItemPopoverInfo";
import { ITEM_VARIANTS } from "#src/utils/constants";
import type { ItemVariant } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import type { FormattedData } from "#src/utils/stores-interface";
import { useCategoriesById } from "#src/utils/stores-interface";

export const useGetListItemConfig = ({
  getExtraConfig,
  variant,
}: {
  getExtraConfig?: (data: FormattedData) => Partial<ListItemProps>;
  variant: ItemVariant;
}) => {
  const { t } = useTranslation("details");
  const categoriesById = useCategoriesById()[variant];
  const isMobile = !useMatchMedia("sm");

  const getConfig = (data: FormattedData) => {
    const columnStart =
      data.variant === ITEM_VARIANTS.webshopItem
        ? ({
            avatar: {
              shape: "squared",
              size: "md",
              src: data.cover ?? undefined,
            },
            description: data.size
              ? t("addItemsModal.items.webshopItem.size", {
                  size: data.size,
                })
              : "",
          } as const)
        : {};

    // Shared config between different views
    const defaultConfig = {
      id: data.id,
      title: data.name,
      ...columnStart,
      // No Popover Info on mobile view
      customNode: isMobile ? null : (
        <PackItemPopoverInfo
          price={data.price}
          credits={data.credits}
          category={
            data.category ? categoriesById[data.category]?.name : undefined
          }
          invisible={data.invisible}
          unavailable={data.unavailable}
        />
      ),
    };

    return {
      ...defaultConfig,
      ...(getExtraConfig ? getExtraConfig(data) : {}),
    };
  };

  return getConfig;
};
