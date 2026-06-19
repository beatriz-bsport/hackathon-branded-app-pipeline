import { useMemo, useRef, useState } from "react";

import {
  Body,
  Button,
  Divider,
  Menu,
  Popover,
  TextField,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  FILTER_SELECTOR_CATEGORY_ORDER,
  type FilterSelectorCategory,
} from "./filter-selector.constants";
import {
  SmartlistFiltersManagerFilterType,
  isSmartlistFiltersManagerFilterType,
} from "./shared/types-guards";

export type FilterSelectorOption = {
  id: string;
  label: string;
  description: string;
  category: FilterSelectorCategory;
};

type FilterSelectorPopoverProps = {
  options: FilterSelectorOption[];
  onSelectOption: (selectedOptionId: SmartlistFiltersManagerFilterType) => void;
};

/**
 * Searchable popover used to add a new filter from available options.
 */
export const FilterSelectorPopover = ({
  options,
  onSelectOption,
}: FilterSelectorPopoverProps) => {
  const { t } = useTranslation("filters");
  const [searchValue, setSearchValue] = useState("");
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();
    if (!normalizedSearchValue) {
      return options;
    }

    return options.filter((option) =>
      [option.label, option.description, option.category].some(
        (searchableField) =>
          searchableField.toLowerCase().includes(normalizedSearchValue),
      ),
    );
  }, [options, searchValue]);

  return (
    <div ref={anchorRef} className="w-full">
      <Popover fullWidth>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <Button
              fullWidth
              label={t("filterSelector.actions.addFilter")}
              iconLeft="plus"
              intent="default"
              color="main"
              size="md"
              onClick={() => setIsPopoverOpened(true)}
            />
          )}
        </Popover.Anchor>
        <Popover.Content
          placement="bottom-left"
          minWidthPx={anchorRef.current?.getBoundingClientRect().width}
          maxWidthPx={anchorRef.current?.getBoundingClientRect().width}
        >
          {({ setIsPopoverOpened }) => (
            <div className="flex flex-col gap-xs p-xs">
              <TextField
                id="smartlist-filter-search"
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onClear={() => setSearchValue("")}
                placeholder={t("filterSelector.fields.searchPlaceholder")}
                fullWidth
              />
              <div className="-mx-xs">
                <Divider />
              </div>
              <div className="flex flex-col gap-xs">
                {filteredOptions.length > 0 ? (
                  <>
                    {FILTER_SELECTOR_CATEGORY_ORDER.map((category) => {
                      const categoryOptions = filteredOptions.filter(
                        (option) => option.category === category,
                      );
                      if (categoryOptions.length === 0) {
                        return null;
                      }

                      return (
                        <div key={category} className="flex flex-col gap-2xs">
                          <Body size="sm" color="weak" weight="stronger">
                            {t(`filterSelector.categories.${category}`)}
                          </Body>
                          <Menu
                            items={categoryOptions}
                            onSelectOption={(selectedOptionId) => {
                              if (
                                !isSmartlistFiltersManagerFilterType(
                                  selectedOptionId,
                                )
                              ) {
                                return;
                              }

                              onSelectOption(selectedOptionId);
                              setSearchValue("");
                              setIsPopoverOpened(false);
                            }}
                          />
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <Body size="sm" color="weak" className="px-xs py-2xs">
                    {t("filterSelector.empty.noResults")}
                  </Body>
                )}
              </div>
            </div>
          )}
        </Popover.Content>
      </Popover>
    </div>
  );
};
