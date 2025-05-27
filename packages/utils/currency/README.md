# @bsport/currency

Utility functions for handling currency formatting and storage in web applications.

## Installation

Add the package as a dependency in your `package.json` file:

```json
{
  "dependencies": {
    "@bsport/currency": "workspace:*"
    // other dependencies...
  }
}
```

## Features

- Format prices with currency symbols (supports symbol placement for various currencies)
- Store and retrieve currency code and display symbol in `localStorage` or `sessionStorage`
- Simple API for integration in React or other JavaScript/TypeScript projects

## Usage

### Formatting Prices

```typescript
import {
  formatPriceWithCurrency,
  getCurrencyDisplayWithPrice,
} from "@bsport/currency";

// Format a price with a specific symbol
const formatted = formatPriceWithCurrency(12.5, "€"); // "12.50 €"

// Format a price using the stored display symbol
const formattedWithStored = getCurrencyDisplayWithPrice(12.5); // e.g. "12.50 €"
```

### Managing Currency in Storage

```typescript
import {
  getCurrencyCode,
  getCurrencyDisplay,
  setCurrencyCode,
  setCurrencyDisplay,
} from "@bsport/currency";

// Set currency code and display symbol
setCurrencyCode("usd");
setCurrencyDisplay("$");

// Get currency code and display symbol
const code = getCurrencyCode(); // e.g. "usd"
const symbol = getCurrencyDisplay(); // e.g. "$"
```

## API

### Formatting

- `formatPriceWithCurrency(price: number, symbol: string, isNegative?: boolean): string`  
  Formats a price with the given currency symbol. Handles negative values and symbol placement.

- `getCurrencyDisplayWithPrice(price: number, isNegative?: boolean): string`  
  Formats a price using the stored display symbol.

### Storage

- `getCurrencyCode(): string`  
  Retrieves the stored currency code (`sessionStorage` first, then `localStorage`). Defaults to `"eur"`.

- `setCurrencyCode(value: string, storage?: "local" | "session"): void`  
  Stores the currency code in the specified storage (default: `"local"`).

- `getCurrencyDisplay(): string`  
  Retrieves the stored currency display symbol (`sessionStorage` first, then `localStorage`). Defaults to `"€"`.

- `setCurrencyDisplay(value: string, storage?: "local" | "session"): void`  
  Stores the currency display symbol in the specified storage (default: `"local"`).
