import { useMemo } from "react";

import { useSelectedItemsContext } from "#src/contexts/selectedItemsContext";
import { useSelectAppointmentPassById } from "#src/utils/temp-store/appointment-pass";
import { useSelectPassById } from "#src/utils/temp-store/pass";
import { useSelectWebshopItemById } from "#src/utils/temp-store/webshop";

export const useSelectedItems = () => {
  const { passes, appointmentPasses, webshopItems } = useSelectedItemsContext();

  const passesById = useSelectPassById();
  const appointmentPassesById = useSelectAppointmentPassById();
  const webshopItemsById = useSelectWebshopItemById();

  const selectedPasses = useMemo(() => {
    return passes.map((id) => passesById.get(id)).filter((item) => !!item);
  }, [passesById, passes]);

  const selectedAppointmentPasses = useMemo(() => {
    return appointmentPasses
      .map((id) => appointmentPassesById.get(id))
      .filter((item) => !!item);
  }, [appointmentPassesById, appointmentPasses]);

  const selectedWebshopItems = useMemo(() => {
    return webshopItems
      .map((id) => webshopItemsById.get(id))
      .filter((item) => !!item);
  }, [webshopItemsById, webshopItems]);

  const totalPackValue = useMemo(() => {
    const valuePasses = selectedPasses.reduce((sum, pass) => {
      return pass.price.parsedValue + sum;
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
