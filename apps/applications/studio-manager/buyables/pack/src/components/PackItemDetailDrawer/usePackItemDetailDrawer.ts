import { useCallback, useMemo, useState } from "react";

import { ITEM_VARIANTS, ItemVariant } from "#src/utils/constants";
import {
  type FormattedData,
  type VariantAndData,
  formatData,
  useCategoriesById,
  useItemsById,
} from "#src/utils/stores-interface";

type AggregatedList = Array<{ id: number; variant: ItemVariant }>;

const getItemIndex = ({
  aggregatedList,
  selectedItem,
}: {
  aggregatedList: AggregatedList;
  selectedItem: FormattedData;
}) => {
  return aggregatedList.findIndex((value) => {
    return (
      value.id === parseInt(selectedItem.id) &&
      value.variant === selectedItem.variant
    );
  });
};

const FIRST_INDEX = 0;

export const usePackItemDetailDrawer = ({
  passes,
  appointmentPasses,
  webshopItems,
}: {
  passes: number[];
  appointmentPasses: number[];
  webshopItems: number[];
}) => {
  const [selectedItem, setSelectedItem] = useState<FormattedData | null>(null);

  const itemsById = useItemsById();
  const categoriesById = useCategoriesById();

  const aggregatedList: AggregatedList = useMemo(
    () => [
      ...passes.map((id) => ({
        id,
        variant: ITEM_VARIANTS.pass,
      })),
      ...appointmentPasses.map((id) => ({
        id,
        variant: ITEM_VARIANTS.appointmentPass,
      })),
      ...webshopItems.map((id) => ({
        id,
        variant: ITEM_VARIANTS.webshopItem,
      })),
    ],
    [passes, appointmentPasses, webshopItems],
  );

  const handleSetFutureItem = useCallback(
    (nextIndex: number) => {
      const { id: nextId, variant: nextVariant } = aggregatedList[nextIndex];
      const nextData = itemsById[nextVariant][nextId];
      const nextFormattedData = {
        data: [nextData],
        variant: nextVariant,
      } as VariantAndData;

      setSelectedItem(formatData(nextFormattedData)[0]);
    },
    [aggregatedList, itemsById],
  );

  const onSelectPreviousItem = useCallback(() => {
    const currentIndex = selectedItem
      ? getItemIndex({ aggregatedList, selectedItem })
      : FIRST_INDEX;

    const nextIndex =
      (currentIndex - 1 + aggregatedList.length) % aggregatedList.length;

    handleSetFutureItem(nextIndex);
  }, [handleSetFutureItem, aggregatedList, selectedItem]);

  const onSelectNextItem = useCallback(() => {
    const lastIndex = aggregatedList.length - 1;
    const currentIndex = selectedItem
      ? getItemIndex({ aggregatedList, selectedItem })
      : lastIndex;

    const nextIndex = (currentIndex + 1) % aggregatedList.length;

    handleSetFutureItem(nextIndex);
  }, [handleSetFutureItem, aggregatedList, selectedItem]);

  const selectedItemCategory = selectedItem?.category
    ? categoriesById[selectedItem.variant][selectedItem.category]?.name || ""
    : "";

  return {
    isOpen: !!selectedItem,
    onClose: () => setSelectedItem(null),
    selectedItem,
    setSelectedItem,
    selectedItemCategory,
    onSelectPreviousItem,
    onSelectNextItem,
  };
};
