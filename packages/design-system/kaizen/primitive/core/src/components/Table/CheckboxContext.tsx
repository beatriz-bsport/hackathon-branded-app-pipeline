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
  toggleCheckbox: (rowId: string) => void;
};

const CheckboxContext = createContext<CheckboxContextType | null>(null);

export const CheckboxProvider = ({ children }: { children: ReactNode }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleCheckbox = useCallback((rowId: string) => {
    setSelectedValues((prev) => {
      const isSelected = prev.includes(rowId);
      return isSelected ? prev.filter((id) => id !== rowId) : [...prev, rowId];
    });
  }, []);

  return (
    <CheckboxContext.Provider
      value={{ selectedValues, toggleCheckbox, setSelectedValues }}
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
