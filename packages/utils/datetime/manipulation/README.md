# @bsport/datetime-manipulation

A utility package for date and time manipulation using Luxon, providing common date operations and formatting.

## API Reference

### Core Functions

#### toDateTime(date: Date): DateTime

Converts a native JavaScript Date to a Luxon DateTime.

#### toDate(dateTime: DateTime): Date

Converts a Luxon DateTime to a native JavaScript Date.

#### isSameDay(date1: DateTime, date2: DateTime): boolean

Checks if two DateTime objects represent the same calendar day.

### Calendar Functions

#### getDaysInMonth(date: DateTime): DateTime[]

Returns all days in the month of the provided DateTime.

#### getWeekdays(format?: "long" | "short" | "narrow", weekStartDay?: WeekStartDay, locale?: string): string[]

Retrieves localized weekday names in the desired order.

#### getMonths(format?: "long" | "short", locale?: string): string[]

Retrieves localized month names.

#### generateCalendarDays(displayMonth: DateTime, weekStartDay: WeekStartDay): (DateTime | null)[]

Generates a calendar grid for the given month.

### Date Validation & Formatting

#### getIsoDateString(date: Date): string

Converts a Date to an ISO 8601 date string (YYYY-MM-DD) in UTC.

#### isValidDate(date: Date | string): boolean

Validates Date objects and ISO date strings.

## Types

#### WeekStartDay

Represents the starting day of the week (0 = Sunday, 1 = Monday, etc.)

## Usage Examples

```typescript
import {
  WeekStartDay,
  generateCalendarDays,
  getWeekdays,
  toDateTime,
} from "@bsport/datetime-manipulation";

// Convert Date to DateTime
const dt = toDateTime(new Date());

// Get French weekday names starting with Monday
const weekdays = getWeekdays("short", 1, "fr");

// Generate calendar grid
const calendar = generateCalendarDays(DateTime.now(), 1);
```

## Development

This package is built using:

- [Luxon](https://moment.github.io/luxon/) for date operations
- TypeScript for type safety
