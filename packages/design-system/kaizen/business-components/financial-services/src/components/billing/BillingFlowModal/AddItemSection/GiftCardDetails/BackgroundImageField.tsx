import React, { useMemo } from "react";

import { FormField } from "@bsport/form";
import {
  Autocomplete,
  type AutocompleteProps,
  Avatar,
  type MenuOption,
} from "@bsport/kaizen-primitive-core";

import { useGiftcardBackgroundList } from "#src/components/billing/BillingFlowModal/hooks/use-giftcard-background-list";
import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

/**
 * Extract filename from URL
 * Example: "https://example.com/path/image_name.jpg" -> "image_name.jpg"
 */
const extractFilename = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split("/").pop() || url;
    return filename;
  } catch {
    // If URL parsing fails, try to extract from path
    const parts = url.split("/");
    return parts[parts.length - 1] || url;
  }
};

export const BackgroundImageField: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const { data: giftcardBackgrounds = [], isLoading } =
    // TODO: Get companyId thanks to the ThemeProvider
    useGiftcardBackgroundList(2);

  // Transform giftcard backgrounds to MenuOption format for Autocomplete
  const autocompleteItems: MenuOption[] = useMemo(() => {
    return giftcardBackgrounds.map((bg) => {
      const filename = extractFilename(bg.image);
      return {
        id: bg.image,
        label: filename,
        leftSlot: (
          <Avatar
            src={bg.image}
            alt={filename}
            shape="squared"
            size="lg"
            initials=""
          />
        ),
      };
    });
  }, [giftcardBackgrounds]);

  return (
    <FormField<
      BillingFlowFormState,
      "addItemGiftcardBackgroundImage",
      AutocompleteProps
    >
      name="addItemGiftcardBackgroundImage"
      mapProps={({ field, form: { setValue } }) => {
        const selectedBackground = giftcardBackgrounds.find(
          (bg) => bg.image === field.value,
        );
        const displayValue = selectedBackground
          ? extractFilename(selectedBackground.image)
          : (field.value ?? "");

        return {
          value: displayValue,
          onSelect: (selectedValue: string) => {
            setValue("addItemGiftcardBackgroundImage", selectedValue || null, {
              shouldDirty: true,
            });
          },
          onClear: () => {
            setValue("addItemGiftcardBackgroundImage", null, {
              shouldDirty: true,
            });
          },
          defaultSelectedIds: field.value ? [field.value] : [],
        } as Partial<AutocompleteProps>;
      }}
    >
      <Autocomplete
        textfieldProps={{
          id: "giftcard-background-image",
          label: t("billingFlowModal.giftCardDetails.backgroundImage"),
          placeholder: t(
            "billingFlowModal.giftCardDetails.backgroundImagePlaceholder",
          ),
        }}
        items={autocompleteItems}
        loadingProps={{
          isLoading,
          message: t("billingFlowModal.giftCardDetails.loadingBackgrounds"),
        }}
        searchMode="local"
        fullWidth
      />
    </FormField>
  );
};
