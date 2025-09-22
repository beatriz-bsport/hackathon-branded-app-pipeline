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
  addVariantItem: ({
    id,
    variant,
  }: {
    id: number;
    variant: ItemVariant;
  }) => void;
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
};

const SelectedItemsContext = createContext<SelectedItemsContextType | null>(
  null,
);

export const SelectedItemsContextProvider = ({
  children,
  initialPasses,
  initialAppointmentPasses,
  initialWebshopItems,
}: PropsWithChildren<{
  initialPasses?: number[];
  initialAppointmentPasses?: number[];
  initialWebshopItems?: number[];
}>) => {
  const [passes, setPasses] = useState(initialPasses ?? []);

  const [appointmentPasses, setAppointmentPasses] = useState(
    initialAppointmentPasses ?? [],
  );
  const [webshopItems, setWebshopItems] = useState(initialWebshopItems ?? []);

  /** Use string and not number to match checkbox context API */
  const [preselectedItems, setPreselectedItems] = useState<string[]>([]);

  const updateVariantItem = useCallback(
    ({
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
          setPasses(updateState);
          return;

        case "appointmentPass":
          setAppointmentPasses(updateState);
          return;

        case "webshopItem":
          setWebshopItems(updateState);
          return;

        default:
          console.info(`[Packs] Could not recognize variant ${variant}`);
          return;
      }
    },
    [],
  );

  const removeVariantItem = useCallback(
    ({ id, variant }: { id: number; variant: ItemVariant }) => {
      const updateState = (prev: number[]) => {
        return prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : prev;
      };

      updateVariantItem({ variant, updateState });
    },
    [updateVariantItem],
  );

  const addVariantItem = useCallback(
    ({ id, variant }: { id: number; variant: ItemVariant }) => {
      const updateState = (prev: number[]) => {
        return prev.includes(id) ? prev : [...prev, id];
      };

      updateVariantItem({ variant, updateState });
    },
    [updateVariantItem],
  );

  const setVariantItems = useCallback(
    ({ ids, variant }: { ids: number[]; variant: ItemVariant }) => {
      const updateState = () => ids;

      updateVariantItem({ variant, updateState });
    },
    [updateVariantItem],
  );

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
        addVariantItem,
        removePreselectedItem,
        removeVariantItem,
        setPreselectedItems,
        setVariantItems,
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
