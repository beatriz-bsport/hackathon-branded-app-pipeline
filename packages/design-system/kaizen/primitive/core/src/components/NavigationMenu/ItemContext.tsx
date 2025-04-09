import { createContext, useContext } from "react";

type ItemContextType = {
  activeSubItemId: string | null;
  setActiveSubItemId: (id: string | null) => void;
};

const ItemContext = createContext<null | ItemContextType>(null);

export const ItemProvider = ({
  children,
  ...props
}: React.PropsWithChildren<ItemContextType>) => {
  return <ItemContext.Provider value={props}>{children}</ItemContext.Provider>;
};

export const useItemContext = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItemContext must be used within an ItemProvider");
  }
  return context;
};
