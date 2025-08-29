import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { MenuOption } from "#src/components/Menu/types";

import Autocomplete from "./Autocomplete";

/**
 * Autocomplete
 *
 * A comprehensive text input field that provides intelligent autocompletion from a set of items.
 * It filters items based on user input and displays them in an accessible popover interface,
 * supporting both single and multi-selection modes with advanced features like caching and loading states.
 *
 * ## Features
 * - Smart text filtering with fuzzy matching support
 * - Single and multi-selection modes with conditional typing
 * - Local and remote search capabilities
 * - Intelligent caching of selected items
 * - Debounced input for performance optimization
 * - Loading states and async data handling
 * - Grouped and flat item structures
 * - Keyboard navigation and accessibility
 * - Pre-selected default values
 * - Clearable selections and chips display
 *
 * ## Usage
 * ```tsx
 * // Basic single-select autocomplete
 * <Autocomplete
 *   textfieldProps={{
 *     id: "language-select",
 *     label: "Choose a language",
 *     placeholder: "Start typing..."
 *   }}
 *   items={languageOptions}
 *   onSelect={(selectedValue: string) => console.log(selectedValue)}
 * />
 *
 * // Multi-select with grouped items
 * <Autocomplete
 *   textfieldProps={{
 *     id: "skills-select",
 *     label: "Select your skills"
 *   }}
 *   items={groupedSkills}
 *   multiSelect={true}
 *   defaultSelectedIds={["react", "typescript"]}
 *   onSelect={(selectedValues: string[]) => console.log(selectedValues)}
 *   fullWidth
 * />
 *
 * // Remote search with API integration
 * <Autocomplete
 *   textfieldProps={{
 *     id: "city-search",
 *     label: "Search cities worldwide"
 *   }}
 *   items={searchResults}
 *   searchMode="remote"
 *   onValueChange={handleApiSearch}
 *   loadingProps={{
 *     isLoading: isSearching,
 *     message: "Searching cities..."
 *   }}
 * />
 * ```
 *
 * ## Props
 * | Name                  | Type                                    | Default        | Description                                                     |
 * |-----------------------|-----------------------------------------|----------------|-----------------------------------------------------------------|
 * | `textfieldProps`      | `TextFieldProps`                        | —              | Props passed to the underlying TextField component.            |
 * | `items`               | `AutocompleteItems`                     | —              | List of items to provide as autocompletion options.           |
 * | `multiSelect`         | `boolean`                               | `false`        | Enable multi-selection mode with checkboxes.                  |
 * | `onSelect`            | `(value: string \| string[]) => void`   | —              | Callback triggered when item(s) are selected.                 |
 * | `defaultSelectedIds`  | `string[]`                              | `[]`           | Array of item IDs that should be pre-selected.                |
 * | `searchMode`          | `"local" \| "remote"`                   | `"local"`      | Search mode: local filtering or remote API calls.             |
 * | `onValueChange`       | `(value: string) => void`               | —              | Callback triggered when input value changes.                  |
 * | `debounceValue`       | `number`                                | `500`          | Debounce duration in milliseconds for value changes.          |
 * | `fullWidth`           | `boolean`                               | `false`        | Whether the popover should take full width.                   |
 * | `popoverPlacement`    | `Placement`                             | `"bottom-left"`| Placement of the popover relative to input.                   |
 * | `disabled`            | `boolean`                               | `false`        | Disables the autocomplete and prevents interaction.           |
 * | `clearOnSelect`       | `boolean`                               | `false`        | Clears input after selection (useful for search interfaces).  |
 * | `loadingProps`        | `{ isLoading: boolean; message?: string }` | —          | Configuration for loading states.                             |
 * | `className`           | `string`                                | —              | Additional CSS classes for the container.                     |
 * | ...props              | `React.HTMLAttributes<HTMLDivElement>` | —              | Other native div attributes.                                   |
 *
 * ## AutocompleteItems Structure
 * The component supports two item structures:
 *
 * ### Flat Structure
 * ```tsx
 * const flatItems: MenuOption[] = [
 *   { id: "react", label: "React", description: "JavaScript library" },
 *   { id: "vue", label: "Vue.js", description: "Progressive framework" },
 *   { id: "angular", label: "Angular", description: "Platform framework" }
 * ];
 * ```
 *
 * ### Grouped Structure
 * ```tsx
 * const groupedItems = [
 *   {
 *     title: "Frontend",
 *     options: [
 *       { id: "react", label: "React" },
 *       { id: "vue", label: "Vue.js" }
 *     ]
 *   },
 *   {
 *     title: "Backend",
 *     options: [
 *       { id: "node", label: "Node.js" },
 *       { id: "python", label: "Python" }
 *     ]
 *   }
 * ];
 * ```
 *
 * ## Conditional Typing for onSelect
 * The `onSelect` callback is conditionally typed based on the `multiSelect` prop:
 *
 * ```tsx
 * // Single-select: receives string
 * <Autocomplete
 *   multiSelect={false}
 *   onSelect={(selectedValue: string) => {
 *     // selectedValue is typed as string
 *   }}
 * />
 *
 * // Multi-select: receives string[]
 * <Autocomplete
 *   multiSelect={true}
 *   onSelect={(selectedValues: string[]) => {
 *     // selectedValues is typed as string[]
 *   }}
 * />
 * ```
 *
 * ## Search Modes
 *
 * ### Local Search Mode
 * - **Client-side filtering**: Items are filtered locally using fuzzy matching
 * - **Debounced input**: Input changes are debounced to improve performance
 * - **Instant results**: No API calls, immediate filtering response
 * - **Best for**: Static datasets, small to medium item lists
 *
 * ```tsx
 * <Autocomplete
 *   searchMode="local"
 *   items={localItems}
 *   debounceValue={300}
 * />
 * ```
 *
 * ### Remote Search Mode
 * - **API integration**: Relies on external API for filtering results
 * - **Loading states**: Built-in loading indicators during API calls
 * - **Real-time search**: Triggers API calls on input changes
 * - **Best for**: Large datasets, dynamic content, server-side filtering
 *
 * ```tsx
 * <Autocomplete
 *   searchMode="remote"
 *   items={apiResults}
 *   onValueChange={handleApiSearch}
 *   loadingProps={{
 *     isLoading: isSearching,
 *     message: "Searching..."
 *   }}
 * />
 * ```
 *
 * ## Advanced Features
 *
 * ### Selected Items Caching
 * The component automatically manages selected items in a cache:
 * - **Multi-select**: Selected items appear as chips below the input
 * - **Grouped display**: Cached items get their own "Selected Items" section
 * - **Persistence**: Selected items remain available even when not in current search results
 * - **Removal**: Users can remove selections via chip dismiss buttons or re-selecting items
 *
 * ### Loading States
 * ```tsx
 * <Autocomplete
 *   loadingProps={{
 *     isLoading: isApiLoading,
 *     message: "Searching worldwide database..."
 *   }}
 * />
 * ```
 *
 * ### Default Selections
 * ```tsx
 * <Autocomplete
 *   defaultSelectedIds={["react", "typescript", "node"]}
 *   multiSelect={true}
 * />
 * ```
 *
 * ### Clear on Select (Search Interface Pattern)
 * ```tsx
 * <Autocomplete
 *   clearOnSelect={true}
 *   onSelect={(value) => {
 *     // Input clears after selection
 *     addToList(value);
 *   }}
 * />
 * ```
 *
 * ## Accessibility
 * - **ARIA attributes**: Proper labeling and role assignments for screen readers
 * - **Keyboard navigation**: Arrow keys, Enter, Escape support
 * - **Focus management**: Logical focus flow and visual indicators
 * - **Live regions**: Search results announced to screen readers
 * - **High contrast**: Support for high contrast and dark modes
 *
 * ## Performance Considerations
 * - **Debouncing**: Input changes are debounced to prevent excessive API calls
 * - **Virtual scrolling**: Large item lists are efficiently rendered
 * - **Memoization**: Internal components use React.memo for optimization
 * - **Smart filtering**: Efficient string matching algorithms
 * - **Cache management**: Selected items are cached for instant access
 *
 * ## Best Practices
 * 1. **Use appropriate search mode**: Local for small datasets, remote for large ones
 * 2. **Provide meaningful placeholders**: Help users understand what to search for
 * 3. **Handle empty states**: Show helpful messages when no results are found
 * 4. **Optimize debounce timing**: Balance responsiveness with API call frequency
 * 5. **Group related items**: Use grouped structure for better organization
 * 6. **Include descriptions**: Help users differentiate between similar options
 *
 * ## See Also
 * - [TextField](./?path=/docs/components-textfield--docs) - For the underlying input component
 * - [Menu](./?path=/docs/components-menu--docs) - For dropdown menu patterns
 * - [Popover](./?path=/docs/components-popover--docs) - For popover positioning
 * - [Chip](./?path=/docs/components-chip--docs) - For selected item display
 *
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=2474-3186" target="_blank">Figma Design</a><br>
 *
 * @component
 */
const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  argTypes: {
    textfieldProps: {
      control: "object",
      description:
        "Props passed to the underlying TextField component including id, label, placeholder, etc.",
      table: {
        type: { summary: "TextFieldProps" },
        category: "Required",
      },
    },
    items: {
      control: "object",
      description:
        "List of items to provide as autocompletion options. Can be flat array or grouped structure.",
      table: {
        type: { summary: "AutocompleteItems" },
        category: "Required",
      },
    },
    multiSelect: {
      control: "boolean",
      description:
        "Enable multi-selection mode using checkboxes instead of radio buttons. Changes onSelect typing.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "Selection",
      },
    },
    onSelect: {
      description:
        "Callback triggered when items are selected. Type changes based on multiSelect prop.",
      table: {
        type: { summary: "(value: string | string[]) => void" },
        category: "Events",
      },
    },
    defaultSelectedIds: {
      control: "object",
      description:
        "Array of item IDs that should be pre-selected on component mount.",
      table: {
        type: { summary: "string[]" },
        defaultValue: { summary: "[]" },
        category: "Selection",
      },
    },
    searchMode: {
      control: { type: "radio", options: ["local", "remote"] },
      description:
        "Search mode: 'local' filters items client-side, 'remote' relies on external filtering.",
      table: {
        type: { summary: "'local' | 'remote'" },
        defaultValue: { summary: "'local'" },
        category: "Search",
      },
    },
    onValueChange: {
      description:
        "Callback triggered whenever the input value changes. Used for remote search integration.",
      table: {
        type: { summary: "(value: string) => void" },
        category: "Events",
      },
    },
    debounceValue: {
      control: { type: "number", min: 0, max: 2000, step: 100 },
      description:
        "Debounce duration in milliseconds to limit how often value change callbacks are triggered.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "500" },
        category: "Performance",
      },
    },
    fullWidth: {
      control: "boolean",
      description:
        "Whether the popover should take the full width of its container.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "Layout",
      },
    },
    popoverPlacement: {
      control: {
        type: "select",
        options: [
          "top",
          "bottom",
          "left",
          "right",
          "bottom-left",
          "bottom-right",
          "top-left",
          "top-right",
        ],
      },
      description: "Placement of the popover relative to the input field.",
      table: {
        type: { summary: "Placement" },
        defaultValue: { summary: "'bottom-left'" },
        category: "Layout",
      },
    },
    disabled: {
      control: "boolean",
      description:
        "Disables the autocomplete input and prevents user interaction.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "State",
      },
    },
    clearOnSelect: {
      control: "boolean",
      description:
        "Empty the input after selection. Useful for search interfaces where selection adds to a list.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "Behavior",
      },
    },
    loadingProps: {
      control: "object",
      description: "Configuration for loading states during async operations.",
      table: {
        type: { summary: "{ isLoading: boolean; message?: string }" },
        category: "Loading",
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the container element.",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

const items = [
  {
    title: "Europe",
    options: [
      { id: "english", label: "English" },
      { id: "french", label: "French" },
      { id: "german", label: "German" },
      { id: "spanish", label: "Spanish" },
      { id: "portuguese", label: "Portuguese" },
      { id: "russian", label: "Russian" },
    ],
  },
  {
    title: "Asia",
    options: [
      { id: "japanese", label: "Japanese" },
      { id: "korean", label: "Korean" },
      { id: "chinese", label: "Chinese" },
      { id: "hindi", label: "Hindi" },
      { id: "thai", label: "Thai" },
    ],
  },
  {
    title: "Africa",
    options: [
      { id: "swahili", label: "Swahili" },
      { id: "arabic", label: "Arabic" },
      { id: "yoruba", label: "Yoruba" },
      { id: "zulu", label: "Zulu" },
      { id: "amharic", label: "Amharic" },
    ],
  },
  {
    title: "Americas",
    options: [
      { id: "spanish-americas", label: "Spanish" },
      { id: "english-americas", label: "English" },
      { id: "portuguese-brazil", label: "Portuguese (Brazil)" },
      { id: "guarani", label: "Guarani" },
      { id: "quechua", label: "Quechua" },
    ],
  },
  {
    title: "Oceania",
    options: [
      { id: "english-oceania", label: "English" },
      { id: "maori", label: "Maori" },
      { id: "samoan", label: "Samoan" },
      { id: "tongan", label: "Tongan" },
      { id: "fijian", label: "Fijian" },
    ],
  },
];

export const Primary: Story = {
  name: "Default Multi-Select",
  parameters: {
    docs: {
      description: {
        story:
          "Basic multi-select autocomplete with grouped items. Shows chips for selected items and supports local search filtering.",
      },
    },
  },
  args: {
    textfieldProps: {
      id: "autocomplete-primary",
      label: "Select Languages",
      placeholder: "Choose your preferred languages",
      status: "default",
    },
    items,
    multiSelect: true,
    fullWidth: false,
  },
};

export const SingleSelect: Story = {
  name: "Single Selection Mode",
  parameters: {
    docs: {
      description: {
        story:
          "Single-select autocomplete that updates the input field with the selected item label and closes the popover after selection.",
      },
    },
  },
  args: {
    textfieldProps: {
      id: "autocomplete-single",
      label: "Primary Language",
      placeholder: "Select your primary language",
      status: "default",
    },
    items,
    multiSelect: false,
    fullWidth: false,
  },
};

export const DebouncedSearch: Story = {
  name: "Debounced Local Search",
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates debounced input handling with custom onValueChange callback. Useful for tracking search queries or triggering analytics.",
      },
    },
  },
  args: {
    textfieldProps: {
      id: "autocomplete-debounced",
      label: "Search with Debouncing",
      placeholder: "Type to search (debounced)",
      status: "default",
    },
    items,
    multiSelect: false,
    fullWidth: false,
    debounceValue: 300,
    onValueChange: (value: string) => {
      console.log("Debounced search value:", value);
    },
  },
};

export const FlatItemStructure: Story = {
  name: "Flat Item Structure",
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates autocomplete with flat item structure (no grouping) and clearOnSelect behavior for search-like interactions.",
      },
    },
  },
  args: {
    textfieldProps: {
      id: "autocomplete-flat",
      label: "Programming Languages",
      placeholder: "Search programming languages",
      status: "default",
    },
    items: [
      { id: "english", label: "English", description: "English Language" },
      { id: "french", label: "French", description: "French Language" },
      { id: "german", label: "German", description: "German Language" },
      { id: "spanish", label: "Spanish", description: "Spanish Language" },
      {
        id: "portuguese",
        label: "Portuguese",
        description: "Portuguese Language",
      },
      { id: "russian", label: "Russian", description: "Russian Language" },
    ],
    clearOnSelect: true,
    fullWidth: false,
  },
};

export const CustomFilteringLogic: Story = {
  name: "Custom Filtering Logic",
  parameters: {
    docs: {
      description: {
        story:
          "Example of implementing custom filtering logic that works with both grouped and flat item structures. The filtering happens in the render function based on user input.",
      },
    },
  },
  render: (args) => {
    const [filteredItems, setFilteredItems] = useState(args.items);

    const handleChange = (value: string) => {
      // Simulate fetching items from an API
      const fetchedItems = args.items;

      // Filter the items based on the search value
      const filteredCustom =
        Array.isArray(fetchedItems[0]) || "title" in fetchedItems[0]
          ? (fetchedItems as { title: string; options: MenuOption[] }[])
              .map((group) => {
                // Filter options in each group
                const filteredOptions = group.options.filter((option) =>
                  option.label.toLowerCase().includes(value.toLowerCase()),
                );

                // If there are filtered options, include the group
                if (filteredOptions.length > 0) {
                  return { ...group, options: filteredOptions };
                }

                return null;
              })
              .filter((group) => group !== null)
          : (fetchedItems as MenuOption[]).filter((item) =>
              item.label.toLowerCase().includes(value.toLowerCase()),
            );

      setFilteredItems(filteredCustom);
    };

    return (
      <div className="flex flex-col gap-md">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Custom Filtering:</strong> This example shows how to
            implement custom filtering logic that works with both grouped and
            flat item structures. The filtering happens in real-time as you
            type.
          </p>
        </div>
        <Autocomplete
          {...args}
          items={filteredItems}
          onValueChange={handleChange}
        />
      </div>
    );
  },
  args: {
    textfieldProps: {
      id: "autocomplete-custom",
      label: "Custom Filtered Languages",
      placeholder: "Type to filter languages",
      status: "default",
      iconRight: "chevron-down",
    },
    items,
    fullWidth: true,
    searchMode: "local",
  },
};

export const WithDefaultSelection: Story = {
  name: "Single-Select with Default Value",
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates how to set a default selected value in single-select mode. The selected item appears in the input field on mount.",
      },
    },
  },
  render: (args) => {
    return (
      <div className="flex flex-col gap-md">
        <Autocomplete {...args} defaultSelectedIds={["english"]} />
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">
            <strong>Default Selection:</strong> The &quot;English&quot; option
            is pre-selected. In single-select mode, the input shows the selected
            item&apos;s label.
          </p>
        </div>
      </div>
    );
  },
  args: {
    textfieldProps: {
      id: "autocomplete-default-single",
      label: "Primary Language",
      placeholder: "Choose your primary language",
      status: "default",
    },
    items,
    multiSelect: false,
    fullWidth: true,
  },
};

export const MultiSelectWithDefaults: Story = {
  name: "Multi-Select with Default Selections",
  parameters: {
    docs: {
      description: {
        story:
          "Shows multi-select mode with multiple pre-selected items. Selected items appear as chips below the input and also get their own 'Selected Items' section in the dropdown.",
      },
    },
  },
  render: (args) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([
      "english",
      "french",
    ]);

    const handleSelectionChange = (values: string[]) => {
      setSelectedValues(values);
    };

    return (
      <div className="flex flex-col gap-md">
        <Autocomplete
          {...args}
          multiSelect={true}
          defaultSelectedIds={["english", "french"]}
          onSelect={handleSelectionChange}
        />
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">
            <strong>Selected Items:</strong>{" "}
            {selectedValues.length > 0 ? selectedValues.join(", ") : "None"}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Notice how selected items appear as chips and also have their own
            section in the dropdown.
          </p>
        </div>
      </div>
    );
  },
  args: {
    textfieldProps: {
      id: "autocomplete-multi-defaults",
      label: "Programming Languages",
      placeholder: "Choose multiple languages",
      status: "default",
    },
    items,
    fullWidth: true,
  },
};

// Mock API data for different continents
const mockApiData = {
  europe: [
    { id: "london", label: "London", description: "Capital of United Kingdom" },
    { id: "paris", label: "Paris", description: "Capital of France" },
    { id: "berlin", label: "Berlin", description: "Capital of Germany" },
    { id: "madrid", label: "Madrid", description: "Capital of Spain" },
    { id: "rome", label: "Rome", description: "Capital of Italy" },
    {
      id: "amsterdam",
      label: "Amsterdam",
      description: "Capital of Netherlands",
    },
    { id: "vienna", label: "Vienna", description: "Capital of Austria" },
    { id: "prague", label: "Prague", description: "Capital of Czech Republic" },
  ],
  asia: [
    { id: "tokyo", label: "Tokyo", description: "Capital of Japan" },
    { id: "seoul", label: "Seoul", description: "Capital of South Korea" },
    { id: "beijing", label: "Beijing", description: "Capital of China" },
    { id: "bangkok", label: "Bangkok", description: "Capital of Thailand" },
    {
      id: "singapore",
      label: "Singapore",
      description: "City-state in Southeast Asia",
    },
    {
      id: "mumbai",
      label: "Mumbai",
      description: "Financial capital of India",
    },
    { id: "delhi", label: "Delhi", description: "Capital of India" },
    { id: "jakarta", label: "Jakarta", description: "Capital of Indonesia" },
  ],
  africa: [
    { id: "cairo", label: "Cairo", description: "Capital of Egypt" },
    { id: "lagos", label: "Lagos", description: "Largest city in Nigeria" },
    {
      id: "johannesburg",
      label: "Johannesburg",
      description: "Largest city in South Africa",
    },
    {
      id: "casablanca",
      label: "Casablanca",
      description: "Largest city in Morocco",
    },
    { id: "nairobi", label: "Nairobi", description: "Capital of Kenya" },
    {
      id: "addis-ababa",
      label: "Addis Ababa",
      description: "Capital of Ethiopia",
    },
    { id: "accra", label: "Accra", description: "Capital of Ghana" },
    { id: "tunis", label: "Tunis", description: "Capital of Tunisia" },
  ],
  americas: [
    { id: "new-york", label: "New York", description: "Largest city in USA" },
    {
      id: "sao-paulo",
      label: "São Paulo",
      description: "Largest city in Brazil",
    },
    {
      id: "mexico-city",
      label: "Mexico City",
      description: "Capital of Mexico",
    },
    { id: "toronto", label: "Toronto", description: "Largest city in Canada" },
    {
      id: "buenos-aires",
      label: "Buenos Aires",
      description: "Capital of Argentina",
    },
    { id: "lima", label: "Lima", description: "Capital of Peru" },
    { id: "bogota", label: "Bogotá", description: "Capital of Colombia" },
    { id: "santiago", label: "Santiago", description: "Capital of Chile" },
  ],
  oceania: [
    { id: "sydney", label: "Sydney", description: "Largest city in Australia" },
    {
      id: "melbourne",
      label: "Melbourne",
      description: "Second largest city in Australia",
    },
    {
      id: "auckland",
      label: "Auckland",
      description: "Largest city in New Zealand",
    },
    {
      id: "wellington",
      label: "Wellington",
      description: "Capital of New Zealand",
    },
    {
      id: "brisbane",
      label: "Brisbane",
      description: "Third largest city in Australia",
    },
    {
      id: "perth",
      label: "Perth",
      description: "Fourth largest city in Australia",
    },
    { id: "suva", label: "Suva", description: "Capital of Fiji" },
    {
      id: "port-moresby",
      label: "Port Moresby",
      description: "Capital of Papua New Guinea",
    },
  ],
};

// Simulate API delay
const simulateApiCall = (
  query: string,
  delay: number = 800,
): Promise<MenuOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allCities = Object.values(mockApiData).flat();
      const filteredCities = allCities.filter(
        (city) =>
          city.label.toLowerCase().includes(query.toLowerCase()) ||
          city.description.toLowerCase().includes(query.toLowerCase()),
      );
      resolve(filteredCities);
    }, delay);
  });
};

export const ApiMockRemoteSearch: Story = {
  name: "Remote Search with API Mock",
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates remote search mode with simulated API calls. Features debounced input, loading states, and real-time search results from a mock global cities database.",
      },
    },
  },
  render: (args) => {
    const [searchResults, setSearchResults] = useState<MenuOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCities, setSelectedCities] = useState<string[]>([]);

    const handleSearch = async (query: string) => {
      console.log("Searching for:", query);
      setSearchQuery(query);

      // Don't search if query is too short
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const results = await simulateApiCall(query);
        setSearchResults(results);
      } catch (error) {
        console.error("API call failed:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleCitySelect = (selectedValues: string[]) => {
      setSelectedCities(selectedValues);
    };

    const selectedCityNames = selectedCities
      .map((id) => searchResults.find((city) => city.id === id)?.label)
      .filter(Boolean);

    return (
      <div className="flex flex-col gap-md">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            🌍 Global Cities Search
          </h3>
          <p className="text-blue-700 text-sm">
            Search for cities from around the world. Try typing:
            &quot;london&quot;, &quot;tokyo&quot;, &quot;new&quot;,
            &quot;capital&quot;, etc. Minimum 2 characters required.
          </p>
        </div>

        <Autocomplete
          {...args}
          items={searchResults}
          searchMode="remote"
          multiSelect={true}
          onValueChange={handleSearch}
          onSelect={handleCitySelect}
          loadingProps={{
            isLoading,
            message: isLoading ? "Searching cities worldwide..." : undefined,
          }}
        />

        {selectedCities.length > 0 ? (
          <div className="p-xs bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">
              Selected Cities ({selectedCities.length})
            </h4>
            <div className="flex flex-wrap gap-sm">
              {selectedCityNames.map((cityName, index) => (
                <span
                  key={`${cityName}-${index}`}
                  className="px-sm py-xs bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {cityName}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">
            API Simulation Details
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>Search Query:</strong> &quot;{searchQuery}&quot;{" "}
              {searchQuery.length < 2 &&
                searchQuery.length > 0 &&
                "(too short)"}
            </li>
            <li>
              • <strong>Results Found:</strong> {searchResults.length} cities
            </li>
            <li>
              • <strong>Loading State:</strong>{" "}
              {isLoading ? "🔄 Searching..." : "✅ Ready"}
            </li>
            <li>
              • <strong>API Delay:</strong> 800ms (simulated network latency)
            </li>
            <li>
              • <strong>Data Sources:</strong> Europe, Asia, Africa, Americas,
              Oceania
            </li>
          </ul>
        </div>
      </div>
    );
  },
  args: {
    textfieldProps: {
      id: "autocomplete-api-mock",
      label: "Search Global Cities",
      placeholder: "Type city name or description...",
      status: "default",
    },
    fullWidth: true,
    debounceValue: 300, // Faster debounce for better UX
  },
};

export const GroupedApiResults: Story = {
  name: "Remote Search with Grouped Results",
  parameters: {
    docs: {
      description: {
        story:
          "Shows how remote search can return grouped results organized by continent. Demonstrates the autocomplete's ability to handle dynamically grouped API responses.",
      },
    },
  },
  render: (args) => {
    const [searchResults, setSearchResults] = useState<
      { title: string; options: MenuOption[] }[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = async (query: string) => {
      setSearchQuery(query);

      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);

      try {
        // Simulate API call that returns grouped data
        await new Promise((resolve) => setTimeout(resolve, 600));

        const groupedResults = Object.entries(mockApiData)
          .map(([continent, cities]) => {
            const filteredCities = cities.filter(
              (city) =>
                city.label.toLowerCase().includes(query.toLowerCase()) ||
                city.description.toLowerCase().includes(query.toLowerCase()),
            );

            if (filteredCities.length > 0) {
              return {
                title: continent.charAt(0).toUpperCase() + continent.slice(1),
                options: filteredCities,
              };
            }
            return null;
          })
          .filter(Boolean) as { title: string; options: MenuOption[] }[];

        setSearchResults(groupedResults);
      } catch (error) {
        console.error("API call failed:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const totalResults = searchResults.reduce(
      (sum, group) => sum + group.options.length,
      0,
    );

    return (
      <div className="flex flex-col gap-md">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">
            🗺️ Grouped City Search
          </h3>
          <p className="text-purple-700 text-sm">
            Search cities organized by continents. Results are automatically
            grouped by geographical regions.
          </p>
        </div>

        <Autocomplete
          {...args}
          items={searchResults}
          searchMode="remote"
          onValueChange={handleSearch}
          loadingProps={{
            isLoading,
            message: isLoading ? "Searching by continents..." : undefined,
          }}
        />

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">
            Search Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Query:</span>
              <span className="ml-2 font-mono">{searchQuery || "(none)"}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Results:</span>
              <span className="ml-2 font-semibold">{totalResults}</span>
            </div>
            <div>
              <span className="text-gray-600">Continents:</span>
              <span className="ml-2 font-semibold">{searchResults.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2">
                {isLoading ? "🔄 Loading" : "✅ Ready"}
              </span>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-600 text-sm">
                Results by continent:
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {searchResults.map((group) => (
                  <span
                    key={group.title}
                    className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                  >
                    {group.title} ({group.options.length})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
  args: {
    textfieldProps: {
      id: "autocomplete-grouped-api",
      label: "Search Cities by Continent",
      placeholder: "Search cities worldwide...",
      status: "default",
    },
    fullWidth: true,
    debounceValue: 400,
  },
};
