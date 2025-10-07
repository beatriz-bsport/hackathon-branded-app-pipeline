import { useMemo } from "react";

import { useSelectedItemsContext } from "#src/contexts/selectedItemsContext";
import { ITEM_VARIANTS } from "#src/utils/constants";
import { useItemsById } from "#src/utils/stores-interface";

export const useSelectedItems = () => {
  const { passes, appointmentPasses, webshopItems } = useSelectedItemsContext();

  const itemsById = useItemsById();
  const passesById = itemsById[ITEM_VARIANTS.pass];
  const appointmentPassesById = itemsById[ITEM_VARIANTS.appointmentPass];
  const webshopItemsById = itemsById[ITEM_VARIANTS.webshopItem];

  const selectedPasses = useMemo(() => {
    return passes.map((id) => passesById[id]).filter((item) => !!item);
  }, [passesById, passes]);

  const selectedAppointmentPasses = useMemo(() => {
    return appointmentPasses
      .map((id) => appointmentPassesById[id])
      .filter((item) => !!item);
  }, [appointmentPassesById, appointmentPasses]);

  const selectedWebshopItems = useMemo(() => {
    return webshopItems
      .map((id) => webshopItemsById[id])
      .filter((item) => !!item);
  }, [webshopItemsById, webshopItems]);

  const totalPackValue = useMemo(() => {
    const valuePasses = selectedPasses.reduce((sum, pass) => {
      const passPrice =
        typeof pass.price === "number" ? pass.price : pass.price.parsedValue;
      return passPrice + sum;
    }, 0);

    const valueAppointmentPasses = selectedAppointmentPasses.reduce(
      (sum, appointmentPass) => {
        return parseFloat(appointmentPass.price) + sum;
      },
      0,
    );

    const valueWebshopItems = selectedWebshopItems.reduce(
      (sum, webshopItem) => {
        return parseFloat(webshopItem.price) + sum;
      },
      0,
    );

    return valuePasses + valueAppointmentPasses + valueWebshopItems;
  }, [selectedPasses, selectedAppointmentPasses, selectedWebshopItems]);

  return {
    selectedPasses,
    selectedAppointmentPasses,
    selectedWebshopItems,
    totalPackValue,
  };
};
