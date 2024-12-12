import React, {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { cva } from "class-variance-authority";

const defaultClasses = [
  "flex flex-col",
  "gap-xs",
  "relative",
  "p-xs",
  "border-none outline-none",
  "text-onsurface-default",
];

const collapse = cva(defaultClasses);

export const CollapseContext = createContext<{
  isCollapseOpen: boolean;
  setIsCollapseOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
}>({
  isCollapseOpen: false,
  setIsCollapseOpen: () => {},
});

export type CollapseProps = {
  className?: string;
  children: ReactNode;
  id?: string;
  initiallyOpen?: boolean | undefined;
};
/**
 * A `Collapse` component that provides a context for managing open/closed state
 * and allows content to be dynamically expanded or collapsed.
 * @param props.children - The children elements of the `Collapse` component.
 * @param props.className - Additional CSS classes to style the component.
 * @param props.initiallyOpen - Whether the collapse is initially open.
 * @param props.id - An optional unique identifier for the collapse element, used for accessibility attributes.
 */
const Collapse: React.FC<CollapseProps> & {
  Controller: typeof Controller;
  Content: typeof Content;
} = ({ children, className, initiallyOpen, id }) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(initiallyOpen ?? false);
  return (
    <CollapseContext.Provider value={{ isCollapseOpen, setIsCollapseOpen, id }}>
      <div className={collapse({ className })}>{children}</div>
    </CollapseContext.Provider>
  );
};

/**
 * The `Controller` component provides control for toggling the collapse state.
 * It receives a render function as children that provides the necessary props
 * and methods for managing the collapse behavior.
 *   @param props.children - A render prop that receives an object with the following:
 *   @param props.children.isCollapseOpen - Indicates whether the collapse is open.
 *   @param props.children.setIsCollapseOpen - A function to toggle the collapse state.
 *   @param props.children.collapseProps - Accessibility attributes for the toggle element.
 */
const Controller: React.FC<{
  children: (props: {
    collapseProps: {
      "data-collapse-target": string;
      "aria-controls": string;
    };
    isCollapseOpen: boolean;
    setIsCollapseOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => ReactNode;
}> = ({ children }) => {
  const { isCollapseOpen, setIsCollapseOpen, id } = useContext(CollapseContext);

  return (
    <>
      {children({
        isCollapseOpen,
        setIsCollapseOpen,
        collapseProps: {
          "data-collapse-target": id ?? "collapse",
          "aria-controls": id ?? "collapse",
        },
      })}
    </>
  );
};

/**
 * The `Content` component renders the content that can be expanded or collapsed.
 * It supports both static children and a render function as children for dynamic content.
 *
 * @param  props.children - The content to render inside the collapse.
 *   - If a `ReactNode` is passed, it renders the static content.
 *   - If a function is passed, it receives the following props:
 *     @param props.children.isCollapseOpen - Indicates whether the collapse is open.
 *     @param props.children.setIsCollapseOpen - A function to toggle the collapse state.
 */
const Content: React.FC<{
  children:
    | ReactNode
    | ((props: {
        isCollapseOpen: boolean;
        setIsCollapseOpen: React.Dispatch<React.SetStateAction<boolean>>;
      }) => ReactNode);
}> = ({ children }) => {
  const { setIsCollapseOpen, isCollapseOpen, id } = useContext(CollapseContext);

  const childrenContainerRef = React.useRef<HTMLDivElement | null>(null);

  const [maxHeight, setMaxHeight] = useState<number>(0);

  useEffect(() => {
    if (isCollapseOpen && childrenContainerRef?.current) {
      setMaxHeight(childrenContainerRef.current.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [isCollapseOpen]);

  return (
    <div
      data-collapse={id ?? "collapse"}
      id={id ?? "collapse"}
      role="region"
      aria-hidden={!isCollapseOpen}
      style={{ maxHeight: maxHeight }}
      className="transition-all ease-in-out duration-extra-long overflow-hidden"
    >
      <div ref={childrenContainerRef}>
        {typeof children === "function"
          ? children({ isCollapseOpen, setIsCollapseOpen })
          : children}
      </div>
    </div>
  );
};

Collapse.displayName = "KaizenCollapse";

Collapse.Controller = Controller;

Collapse.Content = Content;

export default Collapse;
