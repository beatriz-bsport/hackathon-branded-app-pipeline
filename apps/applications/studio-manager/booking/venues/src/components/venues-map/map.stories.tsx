import type { Meta, StoryObj } from "@storybook/react-vite";
import { Circle, Polygon, Polyline } from "react-leaflet";

import { type LatLng, MapPin, MapView } from "./";

const metaComponentDescription = `
**MapView** is a generic Leaflet-based map. It renders a tile layer and fits its viewport to the \`bounds\` you provide. Markers and any other Leaflet overlays are passed as **children** — typically \`<MapPin>\`, but any \`react-leaflet\` component (\`Circle\`, \`Polyline\`, \`GeoJSON\`, …) works.

### Business Context

Use this component whenever you need to display geographic content on a map. The consumer composes children directly, so each implementation can tailor markers, popups, or overlays without changing the kaizen component.

Viewport (center + zoom) is derived from \`bounds\`. When \`bounds\` is empty (or all coordinates are 0,0), the map falls back to \`fallbackCenter\` (default: Paris).

### How to import

\`\`\`tsx
import { MapView, MapPin } from "#src/components/venues-map";
\`\`\`

### Usage

\`MapView\` is a controlled viewport: pass every pin coordinate you render into \`bounds\` so the map auto-fits. Pins are not registered automatically — they are just \`react-leaflet\` children.

\`\`\`tsx
const venues = [
  { id: "1", coordinates: [48.8566, 2.3522], title: "Studio Marais" },
  { id: "2", coordinates: [48.8738, 2.295], title: "Studio Batignolles" },
];

<MapView bounds={venues.map((v) => v.coordinates)} height={480}>
  {venues.map((v) => (
    <MapPin key={v.id} position={v.coordinates} onClick={() => navigate(v.id)}>
      <strong>{v.title}</strong>
    </MapPin>
  ))}
</MapView>
\`\`\`

**Popup** — pass \`children\` to \`<MapPin>\`. Omit children for a marker with no popup.

**Click** — \`onClick\` fires on the marker. Compatible with \`<Popup>\` children.

### Customising the pin colour

The default pin uses \`fill="currentColor"\`, so its colour comes from any text-colour Tailwind token applied via the \`className\` prop. Default is \`text-onsurface-main-strong\` (brand turquoise).

\`\`\`tsx
// Critical / error pin
<MapPin
  position={[48.8566, 2.3522]}
  className="text-onsurface-status-critical-strong"
/>

// Warning pin
<MapPin
  position={[48.8738, 2.295]}
  className="text-onsurface-status-warning-strong"
/>

// Mixed pins inside a single MapView
<MapView bounds={venues.map((v) => v.coordinates)}>
  {venues.map((v) => (
    <MapPin
      key={v.id}
      position={v.coordinates}
      className={v.isClosed ? "text-onsurface-status-critical-strong" : undefined}
    >
      <strong>{v.title}</strong>
    </MapPin>
  ))}
</MapView>
\`\`\`

For a fully custom marker (different shape, image, etc.) pass a Leaflet \`Icon\` / \`DivIcon\` via the \`icon\` prop instead.

### Composing other react-leaflet overlays

\`MapView\` only renders the tile layer + viewport controller. Anything from \`react-leaflet\` can be passed as a child alongside (or instead of) \`<MapPin>\` — \`Circle\`, \`CircleMarker\`, \`Polyline\`, \`Polygon\`, \`Rectangle\`, \`GeoJSON\`, \`LayerGroup\`, \`Tooltip\`, etc. Each child wires itself into the surrounding \`<MapContainer>\` automatically via the react-leaflet context.

\`\`\`tsx
import { Circle, Polyline, Polygon, GeoJSON } from "react-leaflet";

<MapView bounds={path}>
  {venues.map((v) => (
    <MapPin key={v.id} position={v.coordinates}>
      <strong>{v.title}</strong>
    </MapPin>
  ))}

  {/* Coverage radius */}
  <Circle center={[48.8566, 2.3522]} radius={800} />

  {/* Delivery route */}
  <Polyline positions={path} pathOptions={{ color: "#0E7B5E" }} />

  {/* Service area */}
  <Polygon positions={zone} />

  {/* Arbitrary GeoJSON */}
  <GeoJSON data={districtsFeatureCollection} />
</MapView>
\`\`\`

Coordinates of every overlay you want auto-fitted should be included in \`bounds\`. If you only want pins to drive the fit, pass just pin coordinates and the other overlays will render at whatever zoom the pins dictate.
`;

const metaSourceCode = `
import { MapView, MapPin } from "#src/components/venues-map";

const venues = [
  { id: "1", coordinates: [48.8566, 2.3522], title: "Bsport HQ", address: "1 rue de la Paix, Paris" },
];

<MapView bounds={venues.map((v) => v.coordinates)} height={360}>
  {venues.map((v) => (
    <MapPin key={v.id} position={v.coordinates}>
      <strong>{v.title}</strong>
      <br />
      {v.address}
    </MapPin>
  ))}
</MapView>
`;

type Venue = {
  id: string;
  coordinates: LatLng;
  title: string;
  address?: string;
};

type Args = {
  venues: Venue[];
  height?: number;
  fallbackCenter?: LatLng;
};

const renderMap = ({ venues, height, fallbackCenter }: Args) => (
  <MapView
    bounds={venues.map((v) => v.coordinates)}
    fallbackCenter={fallbackCenter}
    height={height}
  >
    {venues.map((v) => (
      <MapPin key={v.id} position={v.coordinates}>
        <strong>{v.title}</strong>
        {v.address && (
          <>
            <br />
            {v.address}
          </>
        )}
      </MapPin>
    ))}
  </MapView>
);

const meta: Meta<Args> = {
  title: "Venues/MapView",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: { component: metaComponentDescription },
      source: { code: metaSourceCode },
    },
  },
  argTypes: {
    height: {
      control: { type: "number" },
      table: { defaultValue: { summary: "360" } },
    },
  },
  args: {
    venues: [
      {
        id: "1",
        coordinates: [48.8566, 2.3522],
        title: "Studio Marais",
        address: "12 rue de Bretagne, Paris 3e",
      },
      {
        id: "2",
        coordinates: [48.8738, 2.295],
        title: "Studio Batignolles",
        address: "34 avenue de Clichy, Paris 17e",
      },
      {
        id: "3",
        coordinates: [48.845, 2.373],
        title: "Studio Nation",
        address: "5 place de la Nation, Paris 11e",
      },
    ],
    height: 480,
  },
  render: renderMap,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<Args> = {};

export const Empty: StoryObj<Args> = {
  args: { venues: [] },
  parameters: {
    docs: {
      description: {
        story:
          "No children, no `bounds` — map renders centered on `fallbackCenter` (Paris by default).",
      },
    },
  },
};

export const CustomFallback: StoryObj<Args> = {
  args: { venues: [], fallbackCenter: [51.5074, -0.1278] },
  parameters: {
    docs: {
      description: {
        story:
          "Custom `fallbackCenter` (London) shown when no bounds are provided.",
      },
    },
  },
};

export const ColoredPins: StoryObj<Args> = {
  render: ({ venues, height, fallbackCenter }) => {
    const tones = [
      "text-onsurface-main-strong",
      "text-onsurface-status-critical-strong",
      "text-onsurface-status-warning-strong",
    ];
    return (
      <MapView
        bounds={venues.map((v) => v.coordinates)}
        fallbackCenter={fallbackCenter}
        height={height}
      >
        {venues.map((v, index) => (
          <MapPin
            key={v.id}
            position={v.coordinates}
            className={tones[index % tones.length]}
          >
            <strong>{v.title}</strong>
            {v.address && (
              <>
                <br />
                {v.address}
              </>
            )}
          </MapPin>
        ))}
      </MapView>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pin colour is driven by `className` on `<MapPin>`. Any Tailwind text-colour token works because the SVG uses `fill="currentColor"`. Default is `text-onsurface-main-strong`.',
      },
    },
  },
};

export const WithCustomOverlay: StoryObj<Args> = {
  render: ({ venues, height, fallbackCenter }) => {
    const route: LatLng[] = venues.map((v) => v.coordinates);
    const zone: LatLng[] = [
      [48.88, 2.32],
      [48.88, 2.4],
      [48.84, 2.4],
      [48.84, 2.32],
    ];
    return (
      <MapView
        bounds={[...route, ...zone]}
        fallbackCenter={fallbackCenter}
        height={height}
      >
        {venues.map((v) => (
          <MapPin key={v.id} position={v.coordinates}>
            <strong>{v.title}</strong>
          </MapPin>
        ))}
        <Circle
          center={[48.8566, 2.3522]}
          radius={800}
          pathOptions={{ color: "#0F6660" }}
        />
        <Polyline positions={route} pathOptions={{ color: "#0F6660" }} />
        <Polygon
          positions={zone}
          pathOptions={{ color: "#0F6660", fillOpacity: 0.05 }}
        />
      </MapView>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Any `react-leaflet` overlay can be composed alongside `<MapPin>` via children — here a `<Circle>` (coverage radius), a `<Polyline>` (route between venues), and a `<Polygon>` (service area). `GeoJSON`, `Rectangle`, `LayerGroup`, etc. work the same way.",
      },
    },
  },
};

export const Documentation: StoryObj<Args> = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- \`leaflet ^1.9.0\` (peer)
- \`react-leaflet ^5.0.0\` (peer)

---

### \`<MapView>\` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`children\` | \`ReactNode\` | — | Markers / overlays (typically \`<MapPin>\`, but any react-leaflet component works) |
| \`bounds\` | \`LatLng[]\` | \`[]\` | Coordinates used to auto-fit the viewport |
| \`fallbackCenter\` | \`LatLng\` | \`[48.8566, 2.3522]\` | Center when no valid bounds |
| \`height\` | \`number\` | \`360\` | Map height in px |
| \`className\` | \`string\` | — | Extra CSS class on the \`MapContainer\` element |

### \`<MapPin>\` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`position\` | \`LatLng\` | required | Pin coordinates |
| \`icon\` | \`Leaflet.Icon \\| Leaflet.DivIcon\` | kaizen default | Override marker icon |
| \`className\` | \`string\` | \`text-onsurface-main-strong\` | Tailwind class on default pin (controls fill via \`currentColor\`) |
| \`onClick\` | \`() => void\` | — | Click handler |
| \`children\` | \`ReactNode\` | — | Popup contents (omit for marker with no popup) |

---

### Leaflet CSS injection

Leaflet CSS is injected at runtime via a \`<style id="leaflet-css">\` tag. This works around Vite + module-federation CSS ordering issues where PostCSS/Tailwind would otherwise strip or reorder the styles.
        `,
      },
    },
  },
};
