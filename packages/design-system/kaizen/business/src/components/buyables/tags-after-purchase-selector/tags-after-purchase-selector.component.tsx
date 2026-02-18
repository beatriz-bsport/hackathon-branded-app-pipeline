import { type ReactElement } from "react";

import { type FieldValues } from "@bsport/form";
import { Body, Title } from "@bsport/kaizen-primitive-core";

import {
  TagSelector,
  type TagSelectorProps,
} from "#src/components/cdp/tag-selector";
import {
  useKaizenI18nInstance,
  useTranslation,
  withKaizenBusinessI18n,
} from "#src/i18n";
import type { NumberListFieldPath } from "#src/utils/form-types";

type TagsAfterPurchaseSelectorProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
> = Omit<
  TagSelectorProps<TFormValues, TFieldName>,
  "placeholder" | "multiSelect"
> & { containerClassName?: string };

const TagsAfterPurchaseSelectorInner = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
>({
  containerClassName,
  ...props
}: TagsAfterPurchaseSelectorProps<TFormValues, TFieldName>): ReactElement => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("buyables", { i18n });
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

export const TagsAfterPurchaseSelector = withKaizenBusinessI18n(
  TagsAfterPurchaseSelectorInner,
) as typeof TagsAfterPurchaseSelectorInner;
