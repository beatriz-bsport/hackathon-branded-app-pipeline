import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import clsx from 'clsx';
import './style.css';

export const CollapseContext = createContext<{
  isCollapseOpen: boolean;
  setIsCollapseOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapse: () => void;
  id?: string;
}>({
  isCollapseOpen: false,
  setIsCollapseOpen: () => {},
  toggleCollapse: () => {},
});

export type CollapseProps = {
  className?: string;
  children: ReactNode;
  id: string;
  initiallyOpen?: boolean;
};

/**
 * A `Collapse` component that provides a context for managing open/closed state
 * and allows content to be dynamically expanded or collapsed.
 * @param props.children - The children elements of the `Collapse` component.
 * @param props.className - Additional CSS classes to style the component.
 * @param props.initiallyOpen - Whether the collapse is initially open.
 * @param props.id - Unique identifier for the collapse element, used for accessibility attributes.
 */
const Collapse: React.FC<CollapseProps> & {
  Controller: typeof Controller;
  Content: typeof Content;
} = ({ children, className, initiallyOpen, id }: CollapseProps) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(initiallyOpen ?? false);
  const toggleCollapse = useCallback(() => {
    setIsCollapseOpen((prev) => !prev);
  }, [setIsCollapseOpen]);
  return (
    <CollapseContext.Provider
      value={{ isCollapseOpen, setIsCollapseOpen, toggleCollapse, id }}
    >
      <div className={clsx('bs-fabrique-collapse__root', className)}>
        {children}
      </div>
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
      'data-collapse-target': string;
      'aria-controls': string;
    };
    isCollapseOpen: boolean;
    setIsCollapseOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleCollapse: () => void;
  }) => ReactNode;
}> = ({ children }) => {
  const { isCollapseOpen, setIsCollapseOpen, toggleCollapse, id } =
    useContext(CollapseContext);

  return (
    <>
      {children({
        isCollapseOpen,
        setIsCollapseOpen,
        toggleCollapse,
        collapseProps: {
          'data-collapse-target': id ?? 'collapse',
          'aria-controls': id ?? 'collapse',
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
  const { isCollapseOpen, setIsCollapseOpen, id } = useContext(CollapseContext);

  const childrenContainerRef = React.useRef<HTMLDivElement | null>(null);

  const maxHeight =
    isCollapseOpen && childrenContainerRef.current
      ? childrenContainerRef.current.scrollHeight
      : 0;

  return (
    <div
      aria-hidden={!isCollapseOpen}
      className="bs-fabrique-collapse__content"
      data-collapse={id ?? 'collapse'}
      id={id ?? 'collapse'}
      role="region"
      style={{ maxHeight }}
    >
      <div ref={childrenContainerRef}>
        {typeof children === 'function'
          ? children({ isCollapseOpen, setIsCollapseOpen })
          : children}
      </div>
    </div>
  );
};

Collapse.Controller = Controller;
Collapse.Content = Content;

export default Collapse;
