import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import type { ItemVariant } from "#src/utils/constants";

type SelectedItemsContextType = {
  passes: number[];
  appointmentPasses: number[];
  webshopItems: number[];
  preselectedItems: string[];
  addPreselectedItem: ({ id }: { id: string }) => void;
  removePreselectedItem: ({ id }: { id: string }) => void;
  removeVariantItem: ({
    id,
    variant,
  }: {
    id: number;
    variant: ItemVariant;
  }) => void;
  setPreselectedItems: Dispatch<SetStateAction<string[]>>;
  setVariantItems: ({
    ids,
    variant,
  }: {
    ids: number[];
    variant: ItemVariant;
  }) => void;
  isDirtySelection: boolean;
};

const SelectedItemsContext = createContext<SelectedItemsContextType | null>(
  null,
);

type FormSetState = (setState: (prev: number[]) => number[]) => void;

export const SelectedItemsContextProvider = ({
  children,
  passes,
  appointmentPasses,
  webshopItems,
  setPasses,
  setAppointmentPasses,
  setWebshopItems,
  isDirtySelection,
}: PropsWithChildren<{
  passes: number[];
  appointmentPasses: number[];
  webshopItems: number[];
  setPasses: (nextValues: number[]) => void;
  setAppointmentPasses: (nextValues: number[]) => void;
  setWebshopItems: (nextValues: number[]) => void;
  isDirtySelection: boolean;
}>) => {
  /** ----- INTERNAL HELPERS ----- */

  const updatePasses: FormSetState = (setter) => {
    const nextValues = setter(passes);
    setPasses(nextValues);
  };

  const updateAppointmentPasses: FormSetState = (setter) => {
    const nextValues = setter(appointmentPasses);
    setAppointmentPasses(nextValues);
  };

  const updateWebshopItems: FormSetState = (setter) => {
    const nextValues = setter(webshopItems);
    setWebshopItems(nextValues);
  };

  const updateVariantItem = ({
    variant,
    updateState,
  }: {
    // Specify the variant to know which setState to use
    variant: ItemVariant;
    // Method to update the state (add item or remove item)
    updateState: (prev: number[]) => number[];
  }) => {
    switch (variant) {
      case "pass":
        updatePasses(updateState);
        return;

      case "appointmentPass":
        updateAppointmentPasses(updateState);
        return;

      case "webshopItem":
        updateWebshopItems(updateState);
        return;

      default:
        console.info(`[Packs] Could not recognize variant ${variant}`);
        return;
    }
  };

  /** ----- SELECTED ITEMS e.g. FINAL FORM STATE MANAGER */

  const removeVariantItem = ({
    id,
    variant,
  }: {
    id: number;
    variant: ItemVariant;
  }) => {
    const updateState = (prev: number[]) => {
      return prev.includes(id) ? prev.filter((itemId) => itemId !== id) : prev;
    };

    updateVariantItem({ variant, updateState });
  };

  const setVariantItems = ({
    ids,
    variant,
  }: {
    ids: number[];
    variant: ItemVariant;
  }) => {
    const updateState = () => ids;

    updateVariantItem({ variant, updateState });
  };

  /** ---- PRESELECTED ITEMS e.g. MODAL STATE */
  /** Use string and not number to match checkbox context API */
  const [preselectedItems, setPreselectedItems] = useState<string[]>([]);

  const addPreselectedItem = useCallback(({ id }: { id: string }) => {
    const updateState = (prev: string[]) => {
      return prev.includes(id) ? prev : [...prev, id];
    };

    setPreselectedItems(updateState);
  }, []);

  const removePreselectedItem = useCallback(({ id }: { id: string }) => {
    const updateState = (prev: string[]) => {
      return prev.includes(id) ? prev.filter((itemId) => itemId !== id) : prev;
    };

    setPreselectedItems(updateState);
  }, []);

  return (
    <SelectedItemsContext.Provider
      value={{
        passes,
        appointmentPasses,
        webshopItems,
        preselectedItems,
        addPreselectedItem,
        removePreselectedItem,
        removeVariantItem,
        setPreselectedItems,
        setVariantItems,
        isDirtySelection,
      }}
    >
      {children}
    </SelectedItemsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSelectedItemsContext = () => {
  const context = useContext(SelectedItemsContext);
  if (!context) {
    throw new Error(
      "useSelectedItemsContext must be used within SelectedItemsContextProvider.",
    );
  }
  return context;
};
