# Staff Management | Alerting store package

This package provides a Zustand store implementation for managing staff management alerts in the application. It supports all 9 alert types from the Django backend with pagination support and follows the ichizen monorepo patterns.

## Installation

1. Add to your application dependencies in `package.json` the store package name :

   ```jsonc
   {
     "dependencies": {
       "@bsport/store-staff-management-alerting": "workspace:*",
     },
   }
   ```

2. Run `pnpm i` in your application to finalize the link

## Usage

Here's a basic example of how to use the store in your application:

```tsx
import {
  ALERT_KINDS,
  fetchAlertsAction,
  fetchAllAlertsAction,
  selectAlertsByKind,
  selectAllAlerts,
  selectTotalAlertCount,
  useAlertingStore,
} from "@bsport/store-staff-management-alerting";

import fetch from "#src/utils/fetch";

const AlertComponent = () => {
  // Retrieve alerts from the store
  const invoiceAlerts = useAlertingStore(
    selectAlertsByKind(ALERT_KINDS.UNEVEN_INVOICE),
  );
  const allAlerts = useAlertingStore(selectAllAlerts);
  const totalCount = useAlertingStore(selectTotalAlertCount);

  // Fetch actions
  const fetchInvoiceAlerts = useCallback(async () => {
    return fetchAlertsAction(fetch, {
      alert_kind: ALERT_KINDS.UNEVEN_INVOICE,
      page: 1,
      page_size: 10,
    });
  }, []);

  const fetchAllAlerts = useCallback(async () => {
    return fetchAllAlertsAction(fetch, { page: 1, page_size: 20 });
  }, []);

  // ... component logic
};
```

## Files

### types.ts

Defines TypeScript types for all 9 alert types and their data structures, matching the Django backend serializers:

- Alert kind constants (`ALERT_KINDS`)
- Individual alert data interfaces (e.g., `InvoiceAlertData`, `NewOrderAlertData`)
- Typed alert interfaces (e.g., `InvoiceAlert`, `NewOrderAlert`)
- Union type for all alerts (`Alert`)

### store.ts

Implements the Zustand store with:

- Paginated state for alerts organized by kind
- Combined alerts state for cross-type operations
- Store actions for updating alert data
- Unique alert key generation for consistent identification

### actions/index.ts

Exports fetch actions:

- `fetchAlertsAction` - Fetch alerts for a specific alert kind with pagination
- `fetchAllAlertsAction` - Fetch all alerts across types with pagination

### api.ts

Defines API configuration for Django backend endpoints:

- Maps alert kinds to their corresponding ViewSet endpoints
- Supports pagination parameters (`page`, `page_size`)
- Follows monorepo URL building patterns

### selectors.ts

Provides data access functions:

- `selectAlertsByKind` - Get alerts for specific type
- `selectAllAlerts` - Get all alerts combined
- `selectTotalAlertCount` - Get total count for notifications
- `selectAlertsGroupedByKind` - Get alerts organized by type
- Pagination and count selectors for each alert type

## Supported Alert Types

The store supports all 9 alert types from the Django backend:

1. **Uneven Invoice** (`ALERT_KINDS.UNEVEN_INVOICE`) - Unpaid invoices
2. **New Order** (`ALERT_KINDS.NEW_ORDER`) - New customer orders
3. **Reminder Note** (`ALERT_KINDS.REMINDER_NOTE`) - Task reminders
4. **Private Booking Incomplete** (`ALERT_KINDS.PRIVATE_BOOKING_INCOMPLETE`) - Bookings missing coach assignment
5. **Company Onboarding** (`ALERT_KINDS.COMPANY_ONBOARDING`) - Onboarding steps pending
6. **Unpaid Private Booking** (`ALERT_KINDS.UNPAID_PRIVATE_BOOKING`) - Unpaid private sessions
7. **New Tutorial** (`ALERT_KINDS.NEW_TUTORIAL_SECTION_OR_LESSON`) - New tutorial content
8. **Late Replacement Request** (`ALERT_KINDS.REPLACEMENT_REQUEST_LATE`) - Overdue replacement requests
9. **Unread Communication** (`ALERT_KINDS.UNREAD_COMMUNICATION`) - Unread messages from members
