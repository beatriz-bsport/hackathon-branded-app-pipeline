import React, { createContext, useContext } from "react";

type SidebarContextType = {
  closeSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarProvider = ({
  children,
  closeSidebar,
}: {
  children: React.ReactNode;
  closeSidebar: () => void;
}) => {
  return (
    <SidebarContext.Provider value={{ closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  return context;
};
