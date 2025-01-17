import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type CheckboxContextType = {
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleCheckbox = useCallback((valueId: string) => {
    setSelectedValues((prev) => {
      const isSelected = prev.includes(valueId);
      return isSelected
        ? prev.filter((id) => id !== valueId)
        : [...prev, valueId];
    });
  }, []);

  const areAllSelected = valueIds.every((id) => selectedValues.includes(id));

  const areSomeSelected =
    selectedValues.length > 0 && selectedValues.length < valueIds.length;

  const selectAll = () => {
    setSelectedValues(indeterminateState === "unchecked" ? valueIds : []);
  };

  const indeterminateState = (() => {
    if (areAllSelected) return "checked";
    if (areSomeSelected) return "indeterminate";
    return "unchecked";
  })();

  const getCheckboxState = useCallback(
    (id: string) => (selectedValues.includes(id) ? "checked" : "unchecked"),
    [selectedValues],
  );

  return (
    <CheckboxContext.Provider
      value={{
        selectedValues,
        toggleCheckbox,
        setSelectedValues,
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
