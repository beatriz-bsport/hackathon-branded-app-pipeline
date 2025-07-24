import React, {
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import type { BaseItem } from "./types";

const Context = createContext<{
  onItemClick?: (item: BaseItem) => (e: MouseEvent) => void;
  openMenuId: string;
  setSelectedItemId: Dispatch<SetStateAction<string>>;
  selectedItemId: string;
  setOpenMenuId: Dispatch<SetStateAction<string>>;
}>({
  onItemClick: () => () => {},
  openMenuId: "",
  selectedItemId: "",
  setOpenMenuId: () => {},
  setSelectedItemId: () => {},
});

export const useNavigationMenuContext = () => {
  const {
    onItemClick,
    openMenuId,
    selectedItemId,
    setOpenMenuId,
    setSelectedItemId,
  } = useContext(Context);
  return {
    onItemClick,
    openMenuId,
    selectedItemId,
    setOpenMenuId,
    setSelectedItemId,
  };
};

export type NavigationMenuProviderProps = {
  onItemClick?: (item: BaseItem) => (e: MouseEvent) => void;
};

export const NavigationMenuProvider: React.FC<
  {
    children?: ReactNode | undefined;
  } & NavigationMenuProviderProps
> = ({ children, onItemClick }) => {
  /** @todo Init value based on url pattern */
  const [selectedItemId, setSelectedItemId] = useState("");
  const [openMenuId, setOpenMenuId] = useState("");

  return (
    <Context.Provider
      value={{
        selectedItemId,
        setSelectedItemId,
        openMenuId,
        setOpenMenuId,
        onItemClick,
      }}
    >
      {children}
    </Context.Provider>
  );
};
