import { useMemo } from "react";

import {
  type ItemTypeConfig,
  type RawAppointmentPassResponse,
  type RawGiftcardResponse,
  type RawPackResponse,
  type RawPassResponse,
  type RawWebshopItemResponse,
  useAppointmentPassConfig,
  useGiftcardConfig,
  usePackConfig,
  usePassConfig,
  useProductConfig,
} from "./item-type-configs";

export const useItemTypeConfig = () => {
  const passConfig = usePassConfig();
  const appointmentPassConfig = useAppointmentPassConfig();
  const productConfig = useProductConfig();
  const packConfig = usePackConfig();
  const giftcardConfig = useGiftcardConfig();

  return useMemo(
    () =>
      ({
        pass: passConfig,
        appointment_pass: appointmentPassConfig,
        product: productConfig,
        pack: packConfig,
        giftcard: giftcardConfig,
      }) as {
        pass: ItemTypeConfig<RawPassResponse>;
        appointment_pass: ItemTypeConfig<RawAppointmentPassResponse>;
        product: ItemTypeConfig<RawWebshopItemResponse>;
        pack: ItemTypeConfig<RawPackResponse>;
        giftcard: ItemTypeConfig<RawGiftcardResponse>;
      },
    [
      passConfig,
      appointmentPassConfig,
      productConfig,
      packConfig,
      giftcardConfig,
    ],
  );
};
