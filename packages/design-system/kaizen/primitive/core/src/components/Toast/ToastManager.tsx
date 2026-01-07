import classNames from "classnames";
import {
  createRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { v4 as uuid } from "uuid";

import Toast, { ToastProps } from "./Toast";
import {
  RENDERED_ITEMS,
  SCALE_DECREASE,
  TRANSFORM_Y_HOVERED,
  TRANSFORM_Y_INITIAL,
  TRANSFORM_Y_NOT_HOVERED,
} from "./animation-constants";

// Ref handle to interact with ToastManager from parent components
export interface ToastManagerHandles {
  addToast: (toastProps: ToastProps & { id?: string }) => void;
  removeToast: (toastId: string) => void;
}

// Define the structure of a toast item, which includes a unique ID and mounted state
interface ToastItem extends ToastProps {
  id: string;
  mounted: boolean;
}

// Reference to manage toasts without needing context
const toastManagerRef = createRef<ToastManagerHandles>();

/**
 * Function to show a toast notification.
 * This function creates a ToastManager if it doesn't exist and adds the toast to the manager.
 * @param toastProps The properties of the toast to show.
 * @returns The ID of the created toast, which can be used to dismiss it later.
 */
export const toast = (toastProps: ToastProps): string => {
  const toastId = uuid();

  if (!toastManagerRef.current) {
    // Create a div to hold the ToastManager
    const toastManagerContainer = document.createElement("div");
    document.body.appendChild(toastManagerContainer);

    // Create a root and render the ToastManager into the div
    const root = createRoot(toastManagerContainer);
    root.render(<ToastManager ref={toastManagerRef} />);

    // Use setTimeout to ensure the ToastManager is initialized before adding the toast
    setTimeout(() => {
      toastManagerRef.current?.addToast({ ...toastProps, id: toastId });
    }, 10);
  } else {
    // Add the toast if ToastManager is already initialized
    toastManagerRef.current.addToast({ ...toastProps, id: toastId });
  }

  return toastId;
};

/**
 * Function to dismiss a toast notification by its ID.
 * @param toastId The ID of the toast to dismiss.
 */
export const dismissToast = (toastId: string) => {
  toastManagerRef.current?.removeToast(toastId);
};

/**
 * The ToastManager component handles showing, hiding, and managing toasts.
 * It is responsible for animating in and out new toasts and removing them when
 * the user clicks the close button or the toast is dismissed after a certain
 * duration. The component also manages the hover state of the toast group,
 * which causes the toasts to scale up and down when the user hovers over the
 * group.
 *
 * The component is a forwardRef, which allows it to be passed as a ref to
 * other components. This allows other components to interact with the
 * ToastManager by calling the `addToast` and `removeToast` functions.
 */
const ToastManager = forwardRef<ToastManagerHandles, object>((_, ref) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Function to add a new toast, and trigger animation after a short delay
  const addToast = useCallback((toastProps: ToastProps & { id?: string }) => {
    const newToast = {
      id: toastProps.id || uuid(),
      mounted: false, // Set to false initially to trigger animation
      ...toastProps,
    };
    setToasts((prevToasts) => [newToast, ...prevToasts]);

    // Set the toast as mounted after a slight delay to trigger animation
    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.id === newToast.id ? { ...toast, mounted: true } : toast,
        ),
      );
    }, 10); // Short delay for animation setup
  }, []);

  // Function to remove a toast and trigger its exit animation
  const removeToast = useCallback(
    (toastId: string) => {
      setToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.id === toastId ? { ...toast, mounted: false } : toast,
        ),
      );

      setTimeout(() => {
        // Adjust hover state based on remaining toasts
        if (toasts.length <= 2 || toasts[toasts.length - 1].id === toastId) {
          setIsHovered(false);
        }

        // Remove the toast from the state
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== toastId),
        );
      }, 300); // Match with exit animation duration
    },
    [toasts],
  );

  // Expose methods to the ToastManager component
  useImperativeHandle(ref, () => ({
    addToast,
    removeToast,
  }));

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Render the toasts as a portal to avoid stacking issues with other elements
  return createPortal(
    <ol
      className="flex flex-col-reverse fixed z-[1000] bottom-xl left-1/2 -translate-x-1/2 transition-all duration-long w-[75%] max-w-[600px]"
      role="alert"
      aria-live="assertive"
      aria-relevant="additions"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {toasts.map((toast, index) => {
        const { id, mounted, ...toastProps } = toast;

        // Define animation properties for each toast
        const translateY = !mounted
          ? TRANSFORM_Y_INITIAL
          : !isHovered
            ? TRANSFORM_Y_NOT_HOVERED * index
            : TRANSFORM_Y_HOVERED * index;
        const scale = !isHovered ? 1 - SCALE_DECREASE * index : 1;
        const zIndex = RENDERED_ITEMS - index;

        return (
          <Toast
            {...toastProps}
            key={id}
            className={classNames(
              "absolute transition-all duration-long",
              "after:absolute after:bottom-full after:left-[0] after:content-[''] after:h-[14px] after:w-full",
              {
                "opacity-transparent": !mounted,
                "opacity-[1]": mounted,
                "opacity-transparent pointer-events-none":
                  index >= RENDERED_ITEMS,
              },
            )}
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              zIndex,
            }}
            onDismiss={() => removeToast(id)}
            aria-labelledby={`toast-title-${id}`}
            aria-describedby={`toast-description-${id}`}
          />
        );
      })}
    </ol>,
    document.body,
  );
});

ToastManager.displayName = "ToastManager";

export default ToastManager;
