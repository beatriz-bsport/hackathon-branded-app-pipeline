import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
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

export type CheckboxProviderProps = {
  /** Initial selected values to provide to the internal state manager */
  initialCheckedIds?: string[];
  /** State values for controlled component */
  checkedIds?: string[];
  /** State setter for controlled component */
  setCheckedIds?: Dispatch<SetStateAction<string[]>>;
};

export const CheckboxProvider = ({
  children,
  valueIds,
  initialCheckedIds,
  checkedIds,
  setCheckedIds,
}: {
  children: ReactNode;
  valueIds: string[];
} & CheckboxProviderProps) => {
  const [internalCheckedIds, setInternalCheckedIds] = useState<string[]>(
    initialCheckedIds ?? [],
  );

  const isControlled = !!checkedIds && !!setCheckedIds;
  const selectedValues = isControlled ? checkedIds : internalCheckedIds;
  const setSelectedValues = isControlled
    ? setCheckedIds
    : setInternalCheckedIds;

  const toggleCheckbox = useCallback(
    (valueId: string) => {
      setSelectedValues((values) => {
        const newValues = new Set(values);
        if (newValues.has(valueId)) {
          newValues.delete(valueId);
        } else {
          newValues.add(valueId);
        }
        return Array.from(newValues);
      });
    },
    [setSelectedValues],
  );

  // Compute using intersection between valueIds and initialCheckedIds
  const selectedCount = selectedValues.filter((id) =>
    valueIds.includes(id),
  ).length;
  const areAllSelected =
    valueIds.length > 0 && selectedCount === valueIds.length;
  const areSomeSelected = selectedCount > 0 && selectedCount < valueIds.length;

  const selectAll = () => {
    setSelectedValues(indeterminateState === "unchecked" ? [...valueIds] : []);
  };

  const indeterminateState = areAllSelected
    ? "checked"
    : areSomeSelected
      ? "indeterminate"
      : "unchecked";

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
