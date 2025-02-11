import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type CheckboxContextType = {
  selectedValues: string[];
  setSelectedValues: (newSelectedValues: string[]) => void;
  toggleCheckbox: (valueId: string) => void;
  areAllSelected: boolean;
  areSomeSelected: boolean;
  selectAll: () => void;
  indeterminateState: "checked" | "unchecked" | "indeterminate";
  getCheckboxState: (id: string) => "checked" | "unchecked";
};

const CheckboxContext = createContext<CheckboxContextType | null>(null);

export const CheckboxProvider = ({
  children,
  valueIds,
}: {
  children: ReactNode;
  valueIds: string[];
}) => {
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

  const toggleCheckbox = useCallback((valueId: string) => {
    setSelectedValues((values) => {
      if (values.has(valueId)) {
        values.delete(valueId);
      } else {
        values.add(valueId);
      }
      return new Set(values);
    });
  }, []);

  const areAllSelected = selectedValues.size === valueIds.length;

  const areSomeSelected =
    selectedValues.size > 0 && selectedValues.size < valueIds.length;

  const selectAll = () => {
    setSelectedValues(
      indeterminateState === "unchecked" ? new Set(valueIds) : new Set(),
    );
  };

  const indeterminateState = areAllSelected
    ? "checked"
    : areSomeSelected
      ? "indeterminate"
      : "unchecked";

  const getCheckboxState = useCallback(
    (id: string) => (selectedValues.has(id) ? "checked" : "unchecked"),
    [selectedValues],
  );

  const setSelectedValuesArray = useCallback((newSelectedValues: string[]) => {
    setSelectedValues(new Set(newSelectedValues));
  }, []);

  return (
    <CheckboxContext.Provider
      value={{
        selectedValues: Array.from(selectedValues),
        toggleCheckbox,
        setSelectedValues: setSelectedValuesArray,
        areAllSelected,
        areSomeSelected,
        selectAll,
        indeterminateState,
        getCheckboxState,
      }}
    >
      {children}
    </CheckboxContext.Provider>
  );
};

export const useCheckboxContext = () => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error("useCheckboxContext must be used within CheckboxProvider.");
  }
  return context;
};
