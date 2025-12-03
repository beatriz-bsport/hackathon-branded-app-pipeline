# DateTime Formatting

A comprehensive, type-safe utility package for formatting dates and times across different locales, timezones, and display formats. This package provides a single endpoint for all datetime formatting needs in the application.

## 🎯 Key Features

- **Single Endpoint**: One function (`formatDateTime`) handles all formatting needs
- **Type Safety**: Predefined format constants prevent runtime errors
- **Rich Result Objects**: Detailed success/error information for better debugging
- **Extensive Format Support**: 20+ predefined formats for different contexts
- **Internationalization**: Full locale and timezone support
- **React Integration**: Hook-based API for React components
- **Error Handling**: Graceful handling of invalid dates with detailed error messages
- **Relative Dates**: Smart relative formatting with fallback options

## 📦 Installation

This package is part of the BSport monorepo and can be imported directly:

```typescript
import {
  DATETIME_FORMATS,
  formatDateTime,
  useFormatDatetime,
} from "@bsport/datetime-formatting";
```

Add it to your `package.json` dependencies:

```json
{
  "dependencies": {
    "@bsport/datetime-formatting": "workspace:*"
  }
}
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

// Simple date formatting
const result = formatDateTime(
  "2024-10-15T14:30:00Z",
  DATETIME_FORMATS.FULL_DATE,
);
console.log(result); // "October 15, 2024"

// Time formatting
const timeResult = formatDateTime(
  "2024-10-15T14:30:00Z",
  DATETIME_FORMATS.TIME_SIMPLE,
);
console.log(timeResult); // "14:30"
```

### React Hook Usage

```tsx
import React from "react";

import {
  DATETIME_FORMATS,
  useFormatDatetime,
} from "@bsport/datetime-formatting";

const MyComponent: React.FC<{ createdAt: string }> = ({ createdAt }) => {
  const { formatDate, formatTime, formatRelative } = useFormatDatetime({
    locale: "en-US",
    timeZone: "America/New_York",
  });

  return (
    <div>
      <p>Created: {formatDate(createdAt)}</p>
      <p>Time: {formatTime(createdAt)}</p>
      <p>Relative: {formatRelative(createdAt)}</p>
    </div>
  );
};
```

## 📝 Available Formats

### Date Formats

| Format           | Example Output     | Use Case                    |
| ---------------- | ------------------ | --------------------------- |
| `ISO_DATE`       | "2024-10-15"       | API responses, data storage |
| `FULL_DATE`      | "October 15, 2024" | User-friendly displays      |
| `MEDIUM_DATE`    | "Oct 15, 2024"     | Compact displays            |
| `SHORT_DATE`     | "10/15/24"         | Very compact displays       |
| `YEAR_MONTH_DAY` | "15 Oct-2024"      | Custom business format      |
| `DAY_MONTH_YEAR` | "15 October 2024"  | European style              |
| `MONTH_DAY`      | "Oct 15"           | Calendar displays           |
| `DAY_MONTH`      | "15 Oct"           | Compact calendar            |

### Time Formats

| Format                      | Example Output | Use Case           |
| --------------------------- | -------------- | ------------------ |
| `TIME_SIMPLE`               | "14:30"        | 24-hour format     |
| `TIME_WITH_SECONDS`         | "14:30:45"     | Precise timing     |
| `TIME_12_HOUR`              | "2:30 PM"      | User-friendly time |
| `TIME_12_HOUR_WITH_SECONDS` | "2:30:45 PM"   | Precise 12-hour    |
| `BUSINESS_TIME`             | "2:30 PM"      | Business hours     |

### Combined DateTime Formats

| Format                   | Example Output                | Use Case               |
| ------------------------ | ----------------------------- | ---------------------- |
| `FULL_DATETIME`          | "October 15, 2024 at 2:30 PM" | Detailed display       |
| `MEDIUM_DATETIME`        | "Oct 15, 2024, 2:30 PM"       | Standard display       |
| `SHORT_DATETIME`         | "10/15/24, 2:30 PM"           | Compact display        |
| `ISO_DATETIME`           | "2024-10-15T14:30:00"         | API format             |
| `ISO_DATETIME_WITH_ZONE` | "2024-10-15T14:30:00+02:00"   | Full ISO with timezone |

### Relative Formats

| Format                   | Example Output                  | Use Case               |
| ------------------------ | ------------------------------- | ---------------------- |
| `RELATIVE`               | "2 hours ago", "in 3 days"      | Activity feeds         |
| `RELATIVE_WITH_FALLBACK` | "2 hours ago" or "Oct 15, 2024" | Smart relative display |

### Business-Specific Formats

| Format       | Example Output        | Use Case          |
| ------------ | --------------------- | ----------------- |
| `EVENT_DATE` | "Monday, October 15"  | Event listings    |
| `SCHEDULE`   | "Mon 15 Oct, 2:30 PM" | Schedule displays |

## 🔧 API Reference

### `formatDateTime(dateTimeString, format, options?)`

The main formatting function that handles all datetime formatting needs.

**Parameters:**

- `dateTimeString` (string): ISO datetime string (e.g., "2024-10-15T14:30:00Z")
- `format` (DateTimeFormat): One of the predefined formats from `DATETIME_FORMATS`
- `options?` (DateTimeFormatOptions): Optional configuration object

**Returns:** `string`

### `DateTimeFormatOptions`

Configuration options for datetime formatting:

```typescript
interface DateTimeFormatOptions {
  locale?: string; // e.g., "en-US", "fr-FR"
  timeZone?: string; // e.g., "Europe/Paris", "America/New_York"
  showTimeZone?: boolean; // Whether to show timezone info
  relativeFallbackFormat?: DateTimeFormat; // Format for relative fallback
  relativeFallbackDays?: number; // Days before using fallback
}
```

### `useFormatDatetime(defaultOptions?)`

React hook that provides pre-configured formatting functions.

**Returns:**

```typescript
{
  formatDate: (dateTimeString, options?) => string;
  formatTime: (dateTimeString, options?) => string;
  formatFullDate: (dateTimeString, options?) => string;
  formatRelative: (dateTimeString, options?) => string;
  formatBusinessTime: (dateTimeString, options?) => string;
  formatDateTime: (dateTimeString, format, options?) => string;
  FORMATS: typeof DATETIME_FORMATS;
}
```

## 🌍 Internationalization Examples

### Different Locales

```typescript
// French
formatDateTime("2024-10-15T14:30:00Z", DATETIME_FORMATS.FULL_DATE, {
  locale: "fr-FR",
  timeZone: "Europe/Paris",
});
// Result: "15 octobre 2024"

// German
formatDateTime("2024-10-15T14:30:00Z", DATETIME_FORMATS.FULL_DATETIME, {
  locale: "de-DE",
  timeZone: "Europe/Berlin",
});
// Result: "15. Oktober 2024 um 16:30"

// Spanish
formatDateTime("2024-10-15T14:30:00Z", DATETIME_FORMATS.MEDIUM_DATE, {
  locale: "es-ES",
  timeZone: "Europe/Madrid",
});
// Result: "15 oct 2024"
```

## 🔍 Error Handling

The package provides comprehensive error handling with simple error information (base return value and console.error the cause of the error):

```typescript
// Invalid date string
const result = formatDateTime("invalid-date", DATETIME_FORMATS.FULL_DATE);
console.log(result); // "N/A"
```

## 🏢 Business Context Examples

### Booking System

```typescript
const bookingDate = "2024-10-15T09:30:00Z";

// Confirmation message
const time = formatDateTime(bookingDate, DATETIME_FORMATS.BUSINESS_TIME);
const date = formatDateTime(bookingDate, DATETIME_FORMATS.FULL_DATE);
console.log(`Booking confirmed for ${date} at ${time}`);
// "Booking confirmed for October 15, 2024 at 9:30 AM"
```

### Schedule Display

```typescript
const classTime = "2024-10-20T18:00:00Z";
const schedule = formatDateTime(classTime, DATETIME_FORMATS.SCHEDULE);
console.log(`Next class: ${schedule}`);
// "Next class: Sun 20 Oct, 6:00 PM"
```

## 🎨 React Component Examples

### Event Card Component

```tsx
import React from "react";

import {
  DATETIME_FORMATS,
  useFormatDatetime,
} from "@bsport/datetime-formatting";

interface EventCardProps {
  title: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  startTime,
  endTime,
  createdAt,
}) => {
  const { formatDateTime, formatRelative } = useFormatDatetime();

  return (
    <div className="event-card">
      <h3>{title}</h3>
      <div className="event-schedule">
        <span className="date">
          {formatDateTime(startTime, DATETIME_FORMATS.EVENT_DATE)}
        </span>
        <span className="time">
          {formatDateTime(startTime, DATETIME_FORMATS.BUSINESS_TIME)}-
          {formatDateTime(endTime, DATETIME_FORMATS.BUSINESS_TIME)}
        </span>
      </div>
      <div className="event-meta">
        <small>Created {formatRelative(createdAt)}</small>
      </div>
    </div>
  );
};
```

## 🛠️ Development

### Building

```bash
cd packages/utils/datetime-formatting
npm run build
```
