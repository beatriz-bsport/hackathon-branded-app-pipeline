import { type ReactElement } from "react";

import { type FieldValues } from "@bsport/form";
import { Body, Title } from "@bsport/kaizen-primitive-core";

import {
  TagSelector,
  type TagSelectorProps,
} from "#src/components/cdp/tag-selector";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { NumberListFieldPath } from "#src/utils/form-types";

type TagsAfterPurchaseSelectorProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
> = Omit<
  TagSelectorProps<TFormValues, TFieldName>,
  "placeholder" | "multiSelect"
> & { containerClassName?: string };

export const TagsAfterPurchaseSelector = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
>({
  containerClassName,
  ...props
}: TagsAfterPurchaseSelectorProps<TFormValues, TFieldName>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });
  return (
    <div className={containerClassName ?? ""}>
      <Title htmlVariant="h5" weight="strong">
        {t("tagsAfterPurchaseSelector.title")}
      </Title>

      <Body weight="weak" size="sm" className="mb-xs">
        {t("tagsAfterPurchaseSelector.description")}
      </Body>

      <TagSelector<TFormValues, TFieldName>
        multiSelect
        placeholder={t("tagsAfterPurchaseSelector.placeholder")}
        {...props}
      />
    </div>
  );
};

TagsAfterPurchaseSelector.displayName = "KaizenTagsAfterPurchaseSelector";
