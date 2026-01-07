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
  isCheckboxDisabled: (id: string) => boolean;
};

const CheckboxContext = createContext<CheckboxContextType | null>(null);

export type CheckboxProviderProps = {
  /** Initial selected values to provide to the internal state manager */
  initialCheckedIds?: string[];
  /** State values for controlled component */
  checkedIds?: string[];
  /** State setter for controlled component */
  setCheckedIds?: Dispatch<SetStateAction<string[]>>;
  /** IDs of checkboxes that should be disabled */
  disabledIds?: string[];
};

export const CheckboxProvider = ({
  children,
  valueIds,
  initialCheckedIds,
  checkedIds,
  setCheckedIds,
  disabledIds = [],
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

  const isCheckboxDisabled = useCallback(
    (id: string) => disabledIds.includes(id),
    [disabledIds],
  );

  const toggleCheckbox = useCallback(
    (valueId: string) => {
      if (disabledIds.includes(valueId)) {
        return;
      }
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
    [setSelectedValues, disabledIds],
  );

  // Compute using intersection between valueIds and initialCheckedIds
  const selectedCount = selectedValues.filter((id) =>
    valueIds.includes(id),
  ).length;
  const areAllSelected =
    valueIds.length > 0 && selectedCount === valueIds.length;

  const enabledValueIds = valueIds.filter((id) => !disabledIds.includes(id));
  const enabledSelectedCount = selectedValues.filter((id) =>
    enabledValueIds.includes(id),
  ).length;
  const areSomeSelected =
    enabledSelectedCount > 0 && selectedCount < valueIds.length;

  const selectAll = () => {
    if (indeterminateState === "unchecked") {
      // Select all enabled checkboxes + keep disabled ones as they are
      const disabledAndChecked = selectedValues.filter((id) =>
        disabledIds.includes(id),
      );
      setSelectedValues([...enabledValueIds, ...disabledAndChecked]);
    } else {
      // Deselect all enabled checkboxes + keep disabled ones as they are
      const disabledAndChecked = selectedValues.filter((id) =>
        disabledIds.includes(id),
      );
      setSelectedValues(disabledAndChecked);
    }
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
        isCheckboxDisabled,
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
