import {
  type PropsWithChildren,
  type RefObject,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { useMatchMedia } from "#src/hooks";
import { useElementHeight } from "#src/hooks/use-element-height";

export type LayoutProviderRef = {
  toggleHasUnsavedChanges: (value?: boolean) => void;
  toggleIsPanelOpened: (value?: boolean) => void;
};

type LayoutContextType = {
  hasUnsavedChanges: boolean;
  isPanelOpened: boolean;
  isMobile: boolean;
  confirmationHeight: number;
  confirmationRef: RefObject<HTMLDivElement | null>;
  withPanel: boolean;
} & LayoutProviderRef;

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

type ProviderProps = PropsWithChildren<{ withPanel?: boolean }>;

export const LayoutProvider = forwardRef<LayoutProviderRef, ProviderProps>(
  ({ children, withPanel = false }, ref) => {
    const isMobile = !useMatchMedia("sm");
    const confirmationRef = useRef<HTMLDivElement | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const toggleHasUnsavedChanges = useCallback((value?: boolean) => {
      setHasUnsavedChanges((prev) => (value !== undefined ? value : !prev));
    }, []);

    // Force the panel to be closed on mobile screen
    const [isPanelOpened, setIsPanelOpened] = useState(
      isMobile ? false : withPanel,
    );
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

    const confirmationHeight = useElementHeight({
      ref: confirmationRef,
      enabled: isMobile,
    });

    return (
      <LayoutContext.Provider
        value={{
          hasUnsavedChanges,
          isPanelOpened,
          toggleHasUnsavedChanges,
          toggleIsPanelOpened,
          isMobile,
          confirmationHeight,
          confirmationRef,
          withPanel,
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
