import React, {
  createContext,
  MouseEvent,
  ReactNode,
  useState,
  useContext,
} from "react";
import keyBy from "lodash/keyBy";
import type { BaseItem, Item } from "./type";

const Context = createContext<{
  itemsById: { [id: string]: Item };
  onItemClick: (item: BaseItem) => (e: MouseEvent) => void;
  openItemId: string;
  setSelectedItemId: React.Dispatch<React.SetStateAction<string>>;
  selectedItemId: string;
  setOpenItemId: React.Dispatch<React.SetStateAction<string>>;
}>({
  onItemClick: () => () => {},
  openItemId: "",
  selectedItemId: "",
  setOpenItemId: () => {},
  setSelectedItemId: () => {},
  itemsById: {},
});

export const useNavigationMenuContext = () => {
  const {
    onItemClick,
    openItemId,
    selectedItemId,
    setOpenItemId,
    setSelectedItemId,
    itemsById,
  } = useContext(Context);
  return {
    onItemClick,
    openItemId,
    selectedItemId,
    setOpenItemId,
    setSelectedItemId,
    itemsById,
  };
};

export const NavigationMenuProvider: React.FC<{
  children?: ReactNode | undefined;
  onItemClick: (item: BaseItem) => (e: MouseEvent) => void;
  items: Item[];
}> = ({ children, onItemClick, items }) => {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [openItemId, setOpenItemId] = useState("");

  const itemsById = keyBy(items, "id");

  return (
    <Context.Provider
      value={{
        selectedItemId,
        setSelectedItemId,
        openItemId,
        setOpenItemId,
        onItemClick,
        itemsById,
      }}
    >
      {children}
    </Context.Provider>
  );
};
