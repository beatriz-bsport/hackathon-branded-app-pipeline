import { Fragment, useEffect, useState } from "react";

import Button from "#src/components/Button";
import Divider from "#src/components/Divider";
import Indicator from "#src/components/Indicator";
import Modal from "#src/components/Modal";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { FilterElementState, ResponsiveFilterProps } from "../types";
import FilterRow from "./FilterRow";
import { isElementComplete, useFiltersAppliedCount } from "./utils";

export const ResponsiveFilter = (props: ResponsiveFilterProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [localFilterElements, setLocalFilterElements] = useState<
    FilterElementState[]
  >(props.filterElements);

  useEffect(() => {
    setLocalFilterElements(props.filterElements);
  }, [props.filterElements]);

  const [isOpen, setIsOpen] = useState(false);

  const filtersAppliedCount = useFiltersAppliedCount(props.filterElements);

  const handleApply = () => {
    const completeFilters = localFilterElements.filter((el) =>
      isElementComplete(el),
    );

    if (completeFilters.length > 0) {
      props.setFilterElements(completeFilters);
      setIsOpen(false);
    }
  };

  const handleClearAll = () => {
    props.resetFilters();
  };

  const handleFieldChange = (index: number, fieldId: string) => {
    const field = props.fields[fieldId];
    if (!field) {
      return;
    }

    const defaultOperator = field.availableFilters[0];
    const defaultValues = field.multiSelect
      ? []
      : [field.values[0]?.id].filter(Boolean);

    setLocalFilterElements((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        field: fieldId,
        filter: defaultOperator,
        valueIds: defaultValues,
      };
      return updated;
    });
  };

  const handleOperatorChange = (index: number, operatorId: string) => {
    setLocalFilterElements((prev) => {
      const updated = [...prev];

      if (updated[index]) {
        updated[index].filter = operatorId;
      }

      return updated;
    });
  };

  const handleValuesChange = (index: number, valueIds: string[]) => {
    setLocalFilterElements((prev) => {
      const updated = [...prev];

      if (updated[index]) {
        updated[index].valueIds = valueIds;
      }

      return updated;
    });
  };

  const handleAddFilter = () => {
    setLocalFilterElements((prev) => [
      ...prev,
      { id: Date.now(), field: null, filter: null, valueIds: [] },
    ]);
  };

  const handleDeleteFilter = (id: number) => {
    setLocalFilterElements((prev) => {
      const filtered = prev.filter((el) => el.id !== id);

      return filtered.length > 0
        ? filtered
        : [{ id: Date.now(), field: null, filter: null, valueIds: [] }];
    });
  };

  const hasAllCompleteFilter = localFilterElements.every((el) =>
    isElementComplete(el),
  );

  const filterButton = (
    <Button
      color="main"
      size="md"
      intent="default"
      icon="filter-lines"
      kind="icon-button"
      label={t("filter.openAriaLabel")}
      onClick={() => setIsOpen(true)}
    />
  );

  return (
    <>
      {filtersAppliedCount > 0 ? (
        <Indicator
          value={filtersAppliedCount}
          position="top"
          size="sm"
          color="default"
        >
          {filterButton}
        </Indicator>
      ) : (
        filterButton
      )}
      <Modal
        open={isOpen}
        size="md"
        title={t("filter.modalTitle")}
        position="bottom"
        footerDirection="column"
        onClose={() => setIsOpen(false)}
        cancelButton={{
          label: t("filter.clearAction"),
          onClick: handleClearAll,
        }}
        confirmButton={{
          label: t("filter.applyAction"),
          onClick: handleApply,
        }}
      >
        <div className="flex flex-col gap-md min-h-[180px]">
          {localFilterElements.map((element, index) => (
            <Fragment key={element.id}>
              <FilterRow
                element={element}
                index={index}
                fields={props.fields}
                filters={props.filters}
                onFieldChange={handleFieldChange}
                onOperatorChange={handleOperatorChange}
                onValuesChange={handleValuesChange}
                onDelete={() => handleDeleteFilter(element.id)}
              />
              {isElementComplete(element) && !props.singleField && (
                <Divider weight="thin" />
              )}
            </Fragment>
          ))}
          {hasAllCompleteFilter && !props.singleField && (
            <div>
              <Button
                color="main"
                intent="default"
                label={t("filter.addAction")}
                size="md"
                onClick={handleAddFilter}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
