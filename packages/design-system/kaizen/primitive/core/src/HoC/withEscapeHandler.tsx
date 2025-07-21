import React, { useEffect } from "react";

// These props will be required by the HoC
interface EscapeHandlerProps {
  isOpen: boolean;
  onClose: () => void;
}

// P is the props of the original component
function withEscapeHandler<P extends EscapeHandlerProps>(
  WrappedComponent: React.ComponentType<P>,
) {
  const ComponentWithEscapeHandler: React.FC<P> = (props) => {
    const { isOpen, onClose } = props;

    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, onClose]);

    return <WrappedComponent {...props} />;
  };

  return ComponentWithEscapeHandler;
}

export default withEscapeHandler;
