import { type ReactNode, createContext, useContext } from "react";

interface NotificationsNavigationContextValue {
  navigateAndClose?: (to: string) => void;
}

const NotificationsNavigationContext =
  createContext<NotificationsNavigationContextValue | null>(null);

interface NotificationsNavigationProviderProps {
  children: ReactNode;
  navigate?: (to: string) => void;
  onClose: () => void;
}

export const NotificationsNavigationProvider = ({
  children,
  navigate,
  onClose,
}: NotificationsNavigationProviderProps) => {
  // we need to preserve the same logic that navigate is only available
  // when is embedded
  const navigateAndClose = navigate
    ? (to: string) => {
        onClose();
        navigate?.(to);
      }
    : navigate;

  return (
    <NotificationsNavigationContext.Provider value={{ navigateAndClose }}>
      {children}
    </NotificationsNavigationContext.Provider>
  );
};

export const useNotificationsNavigation = () => {
  const context = useContext(NotificationsNavigationContext);

  if (!context) {
    throw new Error(
      "useNotificationsNavigationRequired must be used within NotificationsNavigationProvider",
    );
  }

  return context;
};
