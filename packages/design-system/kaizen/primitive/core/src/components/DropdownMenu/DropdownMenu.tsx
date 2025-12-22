import type { ComponentProps, JSX, ReactNode } from "react";

import Menu from "#src/components/Menu";
import Popover from "#src/components/Popover";

import { DropdownMenuComposable } from "./DropdownMenuComposable";
import { DropdownMenuContent } from "./DropdownMenuContent";
import { DropdownMenuDivider } from "./DropdownMenuDivider";
import { DropdownMenuItem } from "./DropdownMenuItem";
import { DropdownMenuManaged } from "./DropdownMenuManaged";
import { DropdownMenuSearch } from "./DropdownMenuSearch";
import { DropdownMenuText } from "./DropdownMenuText";
import { DropdownMenuTitle } from "./DropdownMenuTitle";
import { DropdownMenuTrigger } from "./DropdownMenuTrigger";

export type DropdownMenuItems = ComponentProps<typeof Menu>["items"];

export type DropdownMenuSearchConfig = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export interface DropdownMenuManagedProps {
  className?: string;
  target: ComponentProps<typeof Popover.Anchor>["children"];
  placement?: ComponentProps<typeof Popover.Content>["placement"];
  items: DropdownMenuItems;
  onSelectOption: (params: {
    id: string;
    setIsPopoverOpened: (value: boolean) => void;
  }) => void;
  selectedValues?: ComponentProps<typeof Menu>["selectedValues"];
  multiSelect?: boolean;
  searchConfig?: DropdownMenuSearchConfig;
  maxHeightPx?: number;
  fullWidth?: boolean;
  defaultOpened?: boolean;
  children?: undefined;
}

interface DropdownMenuComposableBaseProps {
  className?: string;
  children: ReactNode;
  multiSelect?: boolean;
  onSelectItem?: (id: string, nextValues?: string[]) => void;
  target?: undefined;
  items?: undefined;
  onSelectOption?: undefined;
  searchConfig?: undefined;
}

interface DropdownMenuComposableControlled
  extends DropdownMenuComposableBaseProps {
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  defaultSelectedValues?: never;
}

interface DropdownMenuComposableUncontrolled
  extends DropdownMenuComposableBaseProps {
  defaultSelectedValues?: string[];
  selectedValues?: undefined;
  onSelectedValuesChange?: (values: string[]) => void;
}

export type DropdownMenuComposableProps =
  | DropdownMenuComposableControlled
  | DropdownMenuComposableUncontrolled;

export type DropdownMenuProps =
  | DropdownMenuManagedProps
  | DropdownMenuComposableProps;

const isComposableProps = (
  props: DropdownMenuProps,
): props is DropdownMenuComposableProps => props.children !== undefined;

/**
 * DropdownMenu - A versatile dropdown menu component supporting both composable and managed APIs
 *
 * **Composable API (Recommended):**
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenu.Trigger>
 *     {({ setIsOpen }) => <Button onClick={() => setIsOpen(true)} />}
 *   </DropdownMenu.Trigger>
 *   <Popover.Content placement="bottom-left">
 *     <DropdownMenu.Content>
 *       <DropdownMenu.Search placeholder="Search..." />
 *       <DropdownMenu.Title>Section</DropdownMenu.Title>
 *       <DropdownMenu.Item id="1" icon="pencil-02">Edit</DropdownMenu.Item>
 *       <DropdownMenu.Divider />
 *       <DropdownMenu.Item id="2" icon="trash-01">Delete</DropdownMenu.Item>
 *     </DropdownMenu.Content>
 *   </Popover.Content>
 * </DropdownMenu>
 * ```
 *
 * **Controlled Multi-Select Pattern (Required when using selectedValues):**
 * When you pass `selectedValues`, you MUST also provide `onSelectedValuesChange`.
 * The parent component owns the state and is responsible for updating it.
 * ```tsx
 * const [values, setValues] = useState<string[]>([]);
 * <DropdownMenu
 *   multiSelect
 *   selectedValues={values}
 *   onSelectedValuesChange={setValues}
 *   onSelectItem={(id, nextValues) => console.log('Selected:', id, nextValues)}
 * >
 *   <DropdownMenu.Trigger>{...}</DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Item id="a">Option A</DropdownMenu.Item>
 *     <DropdownMenu.Item id="b">Option B</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu>
 * ```
 *
 * **Uncontrolled Pattern (Internal state management):**
 * Omit `selectedValues` to let the component manage state internally.
 * You may optionally provide `onSelectedValuesChange` as a callback for side effects or notifications,
 * but the component will still update its internal state automatically.
 * ```tsx
 * <DropdownMenu
 *   multiSelect
 *   defaultSelectedValues={["a"]}
 *   onSelectedValuesChange={(values) => console.log('Selection changed:', values)}
 * >
 *   <DropdownMenu.Trigger>{...}</DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Item id="a">Option A</DropdownMenu.Item>
 *     <DropdownMenu.Item id="b">Option B</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu>
 * ```
 *
 * **Important:**
 * - When using controlled multi-select, ALWAYS provide BOTH `selectedValues` and `onSelectedValuesChange`.
 * - Do NOT mix `defaultSelectedValues` with controlled props (`selectedValues` + `onSelectedValuesChange`).
 * - TypeScript will enforce these constraints at compile time.
 * - The `onSelectItem` callback receives the selected item ID and the complete updated array
 *   for convenience (useful for analytics, side effects).
 *
 * **Managed API (For non-composable use case):**
 * ```tsx
 * <DropdownMenu
 *   target={({ setIsPopoverOpened }) => <Button onClick={() => setIsPopoverOpened(true)} />}
 *   items={[{ id: "1", label: "Edit" }]}
 *   onSelectOption={({ id, setIsPopoverOpened }) => { ... }}
 * />
 * ```
 *
 * @param props.className - Optional CSS class name for the component.
 * @param props.children - (Composable API) Child components
 * @param props.multiSelect - (both) Enable multi-selection
 * @param props.onSelectItem - (Composable API) Callback when item is selected (id, nextValues)
 * @param props.defaultSelectedValues - (Composable API) Initial selected values for uncontrolled mode
 * @param props.selectedValues - (Composable API) Controlled selected values; MUST be paired with onSelectedValuesChange
 * @param props.onSelectedValuesChange - (Composable API) Callback when selection changes (required for controlled mode; optional for uncontrolled mode as notification-only)
 * @param props.target - (Managed API) Render callback for the popover anchor.
 * @param props.placement - (Managed API) Placement of the popover.
 * @param props.items - (Managed API) Items to be rendered inside the menu.
 * @param props.onSelectOption - (Managed API) Callback invoked when an item is selected.
 * @param props.selectedValues - (Managed API) Selected item IDs.
 * @param props.searchConfig - (Managed API) Optional search configuration.
 *   - If `onChange` is provided, the search is external (controlled). The component will NOT filter items internally.
 *   - If `onChange` is omitted, the search is internal (uncontrolled). The component will filter items based on the search query.
 * @param props.defaultOpened - (Managed API) Optional value to decide if the popover is opened by default
 * @param props.maxHeightPx - (Managed API) Optional max height for the popover content
 * @param props.fullWidth - (Managed API) Optional popover anchor taking full width of parent
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-dropdownmenu--docs
 **/
function DropdownMenu(props: DropdownMenuManagedProps): JSX.Element;
function DropdownMenu(props: DropdownMenuComposableProps): JSX.Element;
function DropdownMenu(props: DropdownMenuProps): JSX.Element {
  if (isComposableProps(props)) {
    return <DropdownMenuComposable {...props} />;
  }

  return <DropdownMenuManaged {...props} />;
}

DropdownMenu.displayName = "KaizenDropdownMenu";

const DropdownMenuWithStatics = Object.assign(DropdownMenu, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Title: DropdownMenuTitle,
  Divider: DropdownMenuDivider,
  Search: DropdownMenuSearch,
  Text: DropdownMenuText,
});

export default DropdownMenuWithStatics;
