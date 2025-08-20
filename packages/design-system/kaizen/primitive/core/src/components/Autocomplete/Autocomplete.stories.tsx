import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { MenuOption } from "#src/components/Menu/types";

import Autocomplete from "./Autocomplete";

/**
 * This component is a text input field that offers autocompletion from a set of items.<br>
 * It functions by filtering these items according to the user's input and displaying them in a popover.<br>
 * Debounces the `onChange` callback if supplied, otherwise filters items.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=2474-3186" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  argTypes: {
    textfieldProps: {
      control: "object",
    },
    fullWidth: {
      control: "boolean",
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
  name: "Autocomplete",
  args: {
    textfieldProps: {
      id: "autocomplete-1",
      label: "Autocomplete",
      placeholder: "Select an option",
      status: "default",
    },
    items,
    multiSelect: true,
    fullWidth: false,
  },
};

export const DebouncedSearch: Story = {
  name: "Debounced search",
  args: {
    textfieldProps: {
      id: "autocomplete-1",
      label: "Autocomplete",
      placeholder: "Select an option",
      status: "default",
    },
    items,
    multiSelect: false,
    fullWidth: false,
    onValueChange: (value: string) => {
      console.log("Search value changed:", value);
    },
  },
};

export const AutocompleteItemsWithoutTitle: Story = {
  name: "Autocomplete Items Without Title",
  args: {
    textfieldProps: {
      id: "autocomplete-1",
      label: "Autocomplete",
      placeholder: "Select an option",
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
    fullWidth: false,
  },
};

export const AutocompleteCustomOnChange: Story = {
  name: "Autocomplete Custom OnChange",
  render: (args) => {
    const [filteredItems, setFilteredItems] = useState(args.items);

    const handleChange = (value: string) => {
      // Simulate fetching items from an API ...
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
        <div className="h-[700px] bg-[#777]"></div>
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
      id: "autocomplete-2",
      label: "Custom Autocomplete that filters options only",
      placeholder: "Choose a language",
      status: "default",
      iconRight: "chevron-down",
    },
    items,
    fullWidth: true,
  },
};

export const AutocompleteWithDefaultSelection: Story = {
  name: "With Default Selection",
  render: (args) => {
    return (
      <div className="flex flex-col gap-md">
        <Autocomplete {...args} defaultSelectedIds={["english"]} />
        <div className="p-4 bg-gray-100 rounded">
          <p>
            <em>
              Single-select with &apos;English&apos; pre-selected in the
              textfield and menu
            </em>
          </p>
        </div>
      </div>
    );
  },
  args: {
    textfieldProps: {
      id: "autocomplete-default-single",
      label: "Single-Select with Default",
      placeholder: "Choose a language",
      status: "default",
    },
    items,
    fullWidth: true,
  },
};

export const AutocompleteMultiSelectWithDefaults: Story = {
  name: "Multi-Select with Default Selections",
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
          <p>
            <strong>Selected Values:</strong> {selectedValues.join(", ")}
          </p>
          <p>
            <em>
              Multi-select with &apos;English&apos; and &apos;French&apos;
              pre-selected in the menu
            </em>
          </p>
        </div>
      </div>
    );
  },
  args: {
    textfieldProps: {
      id: "autocomplete-multi-defaults",
      label: "Multi-Select with Defaults",
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

export const AutocompleteWithApiMock: Story = {
  name: "API Mock with Remote Search",
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

export const AutocompleteWithContinentGroups: Story = {
  name: "API Mock with Grouped Results",
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
