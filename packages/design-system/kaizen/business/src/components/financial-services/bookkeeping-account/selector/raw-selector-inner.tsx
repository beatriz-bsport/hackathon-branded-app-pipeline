import type { FC } from "react";

import type { BookkeepingAccount } from "@bsport/api-financial-services";
import {
  Badge,
  Body,
  Button,
  DropdownMenu,
  Label,
  Loader,
  type Placement,
  type TextFieldProps,
  cx,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

const ITEM_CREATE_ACCOUNT = "open-create-account-modal";

export type BookkeepingAccountRawSelectorInnerProps = {
  value?: number | null;
  onClear?: () => void;
  onChange?: (selectedAccountId: number) => void;
  onChangeTax?: (selectedTax: number) => void;
  anchorClassName?: string;
  popoverClassName?: string;
  popoverPlacement?: Placement;
  required?: boolean;
  status?: TextFieldProps["status"];
  statusText?: string;
  withCreationFlow?: boolean;
  // Provided by the wrapper
  bookkeepingAccounts: BookkeepingAccount[];
  isLoading?: boolean;
  openCreationModal?: () => void;
};

export const BookkeepingAccountRawSelectorInner: FC<
  BookkeepingAccountRawSelectorInnerProps
> = ({
  onClear,
  value,
  onChange,
  onChangeTax,
  anchorClassName = "min-w-component-popover-min max-w-full",
  popoverClassName = "w-component-popover-min",
  popoverPlacement = "bottom-right",
  required,
  status = "default",
  statusText,
  withCreationFlow,
  openCreationModal,
  // Provided by the wrapper
  bookkeepingAccounts,
  isLoading,
}) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  const isEmpty = bookkeepingAccounts.length === 0;

  function getSelectedAccount(id?: number | null) {
    if (id == null) {
      return null;
    }
    return bookkeepingAccounts.find((item) => item.id === id);
  }

  const selectedAccount = getSelectedAccount(value);

  const vatRate = selectedAccount?.vat_rate ?? null;

  const helperText = vatRate
    ? t("bookkeepingAccount.selector.tax", {
        value: vatRate,
      })
    : null;

  const isClearable = !!onClear;

  return (
    <div className="flex flex-col gap-2xs">
      <Label
        label={t("bookkeepingAccount.selector.label")}
        required={required}
      />

      <DropdownMenu
        onSelectItem={(stringifiedId) => {
          if (stringifiedId === ITEM_CREATE_ACCOUNT) {
            openCreationModal?.();
            return;
          }

          const parsedId = parseInt(stringifiedId, 10);
          onChange?.(parsedId);

          const account = getSelectedAccount(parsedId);
          if (account && onChangeTax) {
            onChangeTax(parseFloat(account.vat_rate));
          }
        }}
        defaultSelectedValues={
          selectedAccount ? [String(selectedAccount.id)] : []
        }
      >
        <DropdownMenu.Trigger>
          {({ setIsOpen, isOpen }) => (
            <div
              className={cx(
                "flex flex-row items-center gap-xs",
                anchorClassName,
              )}
            >
              <Button
                intent="default"
                color="main"
                label={
                  selectedAccount
                    ? selectedAccount?.account_name
                    : t("bookkeepingAccount.selector.placeholder")
                }
                size="md"
                iconRight="chevron-down"
                className={cx("justify-between w-full", {
                  "italic text-onsurface-weaker": !selectedAccount,
                })}
                onClick={() => setIsOpen(!isOpen)}
              />
              {isClearable && (
                <Button
                  kind="icon-button"
                  label={t("bookkeepingAccount.selector.clearSelection")}
                  icon="x-close"
                  size="sm"
                  intent="flat"
                  color="default"
                  onClick={onClear}
                  className="text-onsurface-weak"
                  disabled={!selectedAccount}
                />
              )}
            </div>
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          placement={popoverPlacement}
          popoverContentClassName={popoverClassName}
        >
          {isLoading && <Loader size="md" className="w-full" />}

          {!isLoading && isEmpty && (
            <Body className="px-xs">
              {t("bookkeepingAccount.selector.noAccounts")}
            </Body>
          )}

          {!isLoading && !isEmpty && (
            <>
              {bookkeepingAccounts.map((config) => {
                return (
                  <DropdownMenu.Item
                    key={`bookkeeping-account-${config.id}`}
                    id={String(config.id)}
                    rightSlot={
                      <Badge
                        text={`${config.vat_rate} %`}
                        color="default"
                        size="sm"
                        className="whitespace-nowrap"
                      />
                    }
                  >
                    {config.account_name}
                  </DropdownMenu.Item>
                );
              })}
            </>
          )}

          {withCreationFlow && (
            <>
              <DropdownMenu.Divider />
              <DropdownMenu.Item id={ITEM_CREATE_ACCOUNT} icon="plus">
                {t("bookkeepingAccount.selector.createAccount")}
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>

      {helperText && (
        <Body size="sm" color="weak">
          {helperText}
        </Body>
      )}

      {statusText && (
        <Body size="sm" color={status === "error" ? "critical" : status}>
          {statusText}
        </Body>
      )}
    </div>
  );
};
