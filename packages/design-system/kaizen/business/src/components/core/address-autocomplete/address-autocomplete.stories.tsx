import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { z } from "zod";

import type { AddressSuggestion } from "@bsport/api-core";
import { getRuntimeGoogleMapsApiKey } from "@bsport/fetch";
import { ControlledForm, useFormController } from "@bsport/form";

import { AddressAutocompleteFormSelector } from "./address-autocomplete-form-selector";
import { AddressAutocompleteRaw } from "./address-autocomplete-raw";

// ---------------------------------------------------------------------------

type AddressAutocompleteRawComponent = typeof AddressAutocompleteRaw;

const metaComponentDescription = `
**AddressAutocompleteRaw** is a business component that wraps a remote-search \`Autocomplete\`
primitive to provide address search powered by the Google Geocoding API.

### Business Context

Use it wherever you need to capture a structured address from the user — for example,
when creating or editing an establishment's location. The user types a partial address,
selects from formatted suggestions, and \`onChange\` emits a fully-parsed \`AddressSuggestion\`
with split fields (\`address_line_1\`, \`city\`, \`zipcode\`, \`country\`, \`geometry\`, …).

It requires an \`apiKey\` (Google Maps Geocoding API key injected by the host app via \`getRuntimeGoogleMapsApiKey()\` from \`@bsport/fetch\`). Results are loaded via React Query.

### How to import?

\`\`\`tsx
import {
  AddressAutocompleteRaw,
  type AddressSuggestion,
} from "@bsport/kaizen-business-components/core/address-autocomplete";
\`\`\`
`;

const metaSourceCode = `
import {
  AddressAutocompleteRaw,
  type AddressSuggestion,
} from "@bsport/kaizen-business-components/core/address-autocomplete";

const [address, setAddress] = useState<AddressSuggestion | null>(null);

<AddressAutocompleteRaw
  apiKey={runtimeConfig.GOOGLE_MAPS_API_KEY}
  textfieldProps={{ label: "Address", required: true }}
  value={address}
  onChange={setAddress}
/>
`;

const meta: Meta<AddressAutocompleteRawComponent> = {
  component: AddressAutocompleteRaw,
  title: "Core/AddressAutocomplete",
  parameters: {
    layout: "centered",
    docs: {
      description: { component: metaComponentDescription },
      source: { code: metaSourceCode },
    },
  },
  args: {
    apiKey: getRuntimeGoogleMapsApiKey(),
    textfieldProps: { label: "Address", required: true },
  },
  tags: ["autodocs"],
};

export default meta;

// ---------------------------------------------------------------------------

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story. Controlled value lets you inspect the full AddressSuggestion output.
export const Default: StoryObj<AddressAutocompleteRawComponent> = {
  render: (args) => {
    const [address, setAddress] = useState<AddressSuggestion | null>(null);
    return (
      <div style={{ width: 400 }}>
        <AddressAutocompleteRaw
          {...args}
          value={address}
          onChange={setAddress}
        />
        {address && (
          <pre style={{ marginTop: 16, fontSize: 12 }}>
            {JSON.stringify(address, null, 2)}
          </pre>
        )}
      </div>
    );
  },
};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<AddressAutocompleteRawComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- \`apiKey\` (use \`getRuntimeGoogleMapsApiKey()\` from \`@bsport/fetch\` in Studio Manager)
- \`@tanstack/react-query\` (\`QueryClientProvider\` must wrap the component)

---

### Required props

| Prop | Description |
|------|-------------|
| \`apiKey\` | Google Maps API key used for Geocoding requests |
| \`onChange\` | Callback receiving a full \`AddressSuggestion\` on select, or \`null\` on clear |

---

### Optional props

| Prop | Description |
|------|-------------|
| \`value\` | Controlled selected address |
| \`textfieldProps\` | Props forwarded to the inner \`Autocomplete\` text field (label, placeholder, required, …) |

---

### AddressSuggestion shape

\`\`\`ts
type AddressSuggestion = {
  place_id: string;
  generated_address: string; // full formatted string shown in the field
  address_line_1: string;
  address_line_2: string;    // always "" from geocoding; editable by consumer
  city: string;
  state: string;
  zipcode: string;
  country: string;
  country_code: string;      // ISO 3166-1 alpha-2, e.g. "ES"
  geometry: { x: number; y: number }; // x = latitude, y = longitude
};
\`\`\`
        `,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// FormSelector story — shows AddressAutocompleteFormSelector inside a form
// ---------------------------------------------------------------------------

type FormValues = { location: AddressSuggestion | null };

export const FormSelectorExample: StoryObj<AddressAutocompleteRawComponent> = {
  name: "FormSelector (with @bsport/form)",
  render: () => {
    const schema = z.object({
      location: z.custom<AddressSuggestion>().nullable(),
    });

    const methods = useFormController<FormValues>({
      schema,
      defaultValues: { location: null },
      mode: "onChange",
    });

    const formValues = methods.watch();

    return (
      <div style={{ width: 400 }}>
        <ControlledForm
          {...methods}
          onSubmit={(data) => console.log("form submit", data)}
        >
          <AddressAutocompleteFormSelector<FormValues, "location">
            fieldName="location"
            apiKey={getRuntimeGoogleMapsApiKey()}
            textfieldProps={{ label: "Address", required: true }}
          />
        </ControlledForm>
        <pre style={{ marginTop: 16, fontSize: 12 }}>
          {JSON.stringify(formValues.location, null, 2)}
        </pre>
      </div>
    );
  },
};
