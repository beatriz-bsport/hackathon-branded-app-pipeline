import {
  type PropsWithChildren,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type LayoutProviderRef = {
  toggleHasUnsavedChanges: (value?: boolean) => void;
  toggleIsPanelOpened: (value?: boolean) => void;
};

type LayoutContextType = {
  hasUnsavedChanges: boolean;
  isPanelOpened: boolean;
} & LayoutProviderRef;

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = forwardRef<LayoutProviderRef, PropsWithChildren>(
  ({ children }, ref) => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const toggleHasUnsavedChanges = useCallback((value?: boolean) => {
      setHasUnsavedChanges((prev) => (value !== undefined ? value : !prev));
    }, []);

    const [isPanelOpened, setIsPanelOpened] = useState(false);
    const toggleIsPanelOpened = useCallback((value?: boolean) => {
      setIsPanelOpened((prev) => (value !== undefined ? value : !prev));
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        toggleHasUnsavedChanges,
        toggleIsPanelOpened,
      }),
      [toggleHasUnsavedChanges, toggleIsPanelOpened],
    );

    return (
      <LayoutContext.Provider
        value={{
          hasUnsavedChanges,
          isPanelOpened,
          toggleHasUnsavedChanges,
          toggleIsPanelOpened,
        }}
      >
        {children}
      </LayoutContext.Provider>
    );
  },
);

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};

export const useDetailsLayout = () => {
  const ref = useRef<LayoutProviderRef>(null);
  const [layoutRef, setLayoutRef] = useState<LayoutProviderRef | null>(null);

  useEffect(() => {
    setLayoutRef(ref.current);
  }, []);

  const toggleHasUnsavedChanges = (value?: boolean) => {
    layoutRef?.toggleHasUnsavedChanges(value);
  };

  const toggleIsPanelOpened = (value?: boolean) => {
    layoutRef?.toggleIsPanelOpened(value);
  };

  return {
    detailsLayoutProps: {
      ref,
    },
    toggleHasUnsavedChanges,
    toggleIsPanelOpened,
  };
};
