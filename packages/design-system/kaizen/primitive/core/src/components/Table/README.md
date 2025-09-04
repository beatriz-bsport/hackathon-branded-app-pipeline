# Table Component

A comprehensive, flexible, and accessible data table component for displaying structured information with various column types, selection capabilities, and state management.

## Overview

The Table component is designed to handle complex data presentation needs while maintaining excellent performance and accessibility. It supports multiple column types, interactive features, and comprehensive state management for modern web applications.

## Features

### 🔧 Column Types

- **String**: Plain text with consistent typography
- **Number**: Locale-aware number formatting
- **Price**: Currency formatting with positive/negative coloring
- **Date/DateTime/Time**: Internationalized date/time formatting
- **Avatar**: User profile images with fallback support
- **Copy**: Copy-to-clipboard with user feedback
- **Custom**: Fully customizable content via render functions

### 🎯 Selection & Interaction

- Checkbox-based row selection
- "Select all" functionality with indeterminate state
- Row-level click handlers
- Link transformation for entire rows
- Active state management

### 🎨 Visual Customization

- Configurable row heights (compact/comfortable)
- Optional vertical borders between columns
- Row-level color indicators
- Hover and selection states
- Responsive design principles

### 📊 State Management

- Loading states with custom messages
- Empty state handling with custom content
- Search result empty states
- Pagination with configurable options
- Error boundary support

## Basic Usage

```tsx
import { Table } from "@bsport/kaizen";

// Define your data structure
interface User extends BaseRow {
  id: string;
  name: string;
  email: string;
  registeredDate: Date;
  isActive: boolean;
}

// Configure columns
const columns: Column<User>[] = [
  {
    id: "name",
    header: "Full Name",
    type: "string",
    keyPath: "name",
  },
  {
    id: "email",
    header: "Email Address",
    type: "copy",
    keyPath: "email",
    tooltip: "Copy email to clipboard",
  },
  {
    id: "registeredDate",
    header: "Registration Date",
    type: "date",
    keyPath: "registeredDate",
  },
  {
    id: "status",
    header: "Status",
    type: "custom",
    render: (user) => (
      <Badge color={user.isActive ? "success" : "default"}>
        {user.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];

// Render the table
<Table columns={columns} rows={users} selectable rowHeight="lg" />;
```

## Advanced Examples

### Table with Pagination

```tsx
<Table
  columns={columns}
  rows={currentPageData}
  paginationProps={{
    currentPage: 1,
    rowsPerPage: 10,
    totalItems: totalCount,
    showRowsPerPageSelector: true,
    onPageSettingsChange: (page, rowsPerPage) => {
      loadData(page, rowsPerPage);
    },
  }}
/>
```

### Table with Empty States

```tsx
<Table
  columns={columns}
  rows={data}
  emptyStateProps={{
    isEmpty: data.length === 0,
    emptyConfig: {
      title: "No users found",
      subtitle: "Start by inviting team members",
      ctaButtonConfig: {
        label: "Invite Users",
        onClick: openInviteModal,
      },
    },
    isEmptySearch: searchTerm && data.length === 0,
    emptySearchConfig: {
      title: "No search results",
      subtitle: "Try adjusting your search criteria",
      secondaryButtonConfig: {
        label: "Clear Search",
        onClick: clearSearch,
      },
    },
  }}
/>
```

### Table with Loading State

```tsx
<Table
  columns={columns}
  rows={data}
  loadingProps={{
    isLoading: isLoadingData,
    message: "Loading user data...",
  }}
/>
```

## Column Configuration

### String Columns

```tsx
{
  id: 'name',
  header: 'Name',
  type: 'string',
  keyPath: 'user.profile.name',
  align: 'start' // 'start' | 'center' | 'end'
}
```

### Number Columns

```tsx
{
  id: 'score',
  header: 'Score',
  type: 'number',
  keyPath: 'metrics.score',
  align: 'center'
}
```

### Price Columns

```tsx
{
  id: 'balance',
  header: 'Account Balance',
  type: 'price',
  keyPath: 'account.balance',
  align: 'end',
  priceColoring: {
    positive: 'positive',
    negative: 'critical'
  }
}
```

### Date/Time Columns

```tsx
// Date only
{
  id: 'birthDate',
  header: 'Birth Date',
  type: 'date',
  keyPath: 'profile.birthDate'
}

// Date and time
{
  id: 'lastLogin',
  header: 'Last Login',
  type: 'datetime',
  keyPath: 'activity.lastLogin'
}

// Time only
{
  id: 'sessionDuration',
  header: 'Session Time',
  type: 'time',
  keyPath: 'session.duration'
}
```

### Avatar Columns

```tsx
{
  id: 'avatar',
  header: 'Photo',
  type: 'avatar',
  keyPath: 'profile.avatar', // string or { src: string, alt: string }
  size: 'md' // 'sm' | 'md' | 'lg'
}
```

### Copy-to-Clipboard Columns

```tsx
{
  id: 'apiKey',
  header: 'API Key',
  type: 'copy',
  keyPath: 'credentials.apiKey',
  tooltip: 'Copy API key',
  toastMessage: 'API key copied successfully!'
}
```

### Custom Columns

```tsx
{
  id: 'actions',
  header: 'Actions',
  type: 'custom',
  align: 'end',
  render: (row) => (
    <div className="flex gap-sm">
      <Button
        size="sm"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row selection
          editItem(row.id);
        }}
      >
        Edit
      </Button>
      <Button
        size="sm"
        color="critical"
        onClick={(e) => {
          e.stopPropagation();
          deleteItem(row.id);
        }}
      >
        Delete
      </Button>
    </div>
  )
}
```

## Row Configuration

### Basic Row Data

```tsx
interface MyRow extends BaseRow {
  id: string; // Required
  name: string;
  email: string;
  // ... other data
}
```

### Row with Link

```tsx
const rowsWithLinks = data.map((item) => ({
  ...item,
  link: `/users/${item.id}`, // Makes entire row clickable
}));
```

### Row with Click Handler

```tsx
const rowsWithHandlers = data.map((item) => ({
  ...item,
  onRowClick: () => navigateToDetail(item.id),
}));
```

### Row with Color Indicator

```tsx
const rowsWithColors = data.map((item) => ({
  ...item,
  color: item.status === "urgent" ? "#ff4444" : undefined,
}));
```

### Row with Active State

```tsx
const rowsWithActiveState = data.map((item) => ({
  ...item,
  isActive: selectedItemId === item.id,
}));
```

## Styling and Theming

### Row Height Options

- `sm`: Compact height for dense data tables
- `lg`: Comfortable height for easier reading

### Border Configuration

- `withVerticalBorders={true}`: Adds vertical lines between columns
- `withVerticalBorders={false}`: Clean, borderless appearance

### Custom Styling

```tsx
<Table className="custom-table-styles" columns={columns} rows={rows} />
```

## Accessibility

The Table component follows WAI-ARIA guidelines and provides:

- **Semantic HTML**: Proper table structure with `role` attributes
- **Keyboard Navigation**: Full keyboard support for interactive elements
- **Screen Reader Support**: ARIA labels and announcements
- **Focus Management**: Logical tab order and visible focus indicators
- **High Contrast**: Support for high contrast themes

### ARIA Attributes

- `role="table"` on the main container
- `role="rowgroup"` for header and body sections
- `aria-labelledby` for table identification
- `aria-selected` for selected rows

## Performance Considerations

### Large Datasets

- Use pagination for datasets over 100 rows
- Consider virtual scrolling for extremely large tables
- Implement server-side filtering and sorting

### Custom Renders

- Use `React.memo` for expensive custom render functions
- Avoid creating new objects/functions in render props
- Consider memoizing complex calculations

### Event Handling

```tsx
// Good: Memoized handler
const handleRowClick = useCallback((rowId: string) => {
  // Handle click
}, []);

// Bad: Inline function
onClick={() => handleClick(row.id)}
```

## TypeScript Support

The Table component is fully typed with TypeScript:

```tsx
// Type your row data
interface Product extends BaseRow {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Columns are automatically typed
const columns: Column<Product>[] = [
  {
    id: "name",
    header: "Product Name",
    type: "string",
    keyPath: "name", // TypeScript validates this path
  },
];

// Table component infers types
<Table<Product> columns={columns} rows={products} />;
```

## Migration Guide

### From Legacy Table Component

If migrating from an older table implementation:

1. **Update column definitions**: Convert to new `Column<T>` format
2. **Add type annotations**: Ensure your row data extends `BaseRow`
3. **Replace custom cells**: Use the new column type system
4. **Update selection logic**: Use the built-in selection system

### Breaking Changes

- Column configuration format has changed
- Selection API is now built-in
- Custom cell rendering uses `render` function instead of children

## Troubleshooting

### Common Issues

**Table not rendering data**

- Ensure each row has a unique `id` property
- Verify column `keyPath` matches your data structure
- Check for TypeScript errors in column definitions

**Selection not working**

- Ensure `selectable={true}` is set
- Verify row data includes valid `id` values
- Check if selection callbacks are properly defined

**Custom renders not displaying**

- Ensure `type: 'custom'` is set
- Verify `render` function returns valid React nodes
- Check for JavaScript errors in render function

**Performance issues**

- Implement pagination for large datasets
- Avoid complex calculations in render functions
- Use `React.memo` for expensive components

### Debugging

Enable development mode logging:

```tsx
<Table
  columns={columns}
  rows={rows}
  // Add to troubleshoot rendering issues
  className="debug-table"
/>
```

## Related Components

- **Pagination**: For handling large datasets
- **Checkbox**: Used in selection functionality
- **Avatar**: Used in avatar column type
- **Button**: Common in custom column renders
- **Badge/Chip**: Popular for status displays

## API Reference

For complete API documentation, see the [Storybook documentation](https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-table--docs).
