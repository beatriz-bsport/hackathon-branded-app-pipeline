const defaultDashboardConfiguration = [
  // first tab
  {
    tab_label: 'main',
    graphs: [
      {
        name: 'turnover',
        ressourceIdentifier: 'temporalPayment',
        chart: 'bar',
        baseFilters: {
          date_field: 'date',
          aggregate_function: 'sum',
          aggregate_field: 'price',
          aggregate_period: 'day',
        },
        dateRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
      },
      {
        name: 'booking_timeslot',
        ressourceIdentifier: 'temporalTimeslotBooking',
        chart: 'grid',
        baseFilters: {
          date_field: 'offer__date_start',
        },
        dateRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
        dataFilters: {},
      },
      {
        name: 'booking_qualitative',
        ressourceIdentifier: 'qualitativeBooking',
        chart: 'pie',
        baseFilters: {
          dropdown_field: 'source',
          aggregate_function: 'count',
          aggregate_field: 'pk',
        },
        dateRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
        dataFilters: { booking_status_code__in: [0] },
      },
      {
        name: 'booking_temporal',
        ressourceIdentifier: 'temporalBooking',
        chart: 'area',
        baseFilters: {
          date_field: 'offer__date_start',
          aggregate_field: 'pk',
          aggregate_function: 'count',
          aggregate_period: 'day',
        },
        dateRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
        dataFilters: { booking_status_code__in: [0] },
        title: 'Bookings',
      },
      {
        name: 'invoice_item',
        ressourceIdentifier: 'qualitativeInvoiceItem',
        chart: 'pie',
        baseFilters: {
          dropdown_field: 'buyable_item_identifier',
          aggregate_field: 'total_price',
          aggregate_function: 'sum',
        },
        dateRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
      },
      {
        name: 'billed_subscriptions',
        ressourceIdentifier: 'temporalPlannedInvoice',
        chart: 'bar',
        baseFilters: {
          date_field: 'invoice__date',
          aggregate_function: 'count',
          aggregate_field: 'pk',
        },
        dateRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
      },
      {
        name: 'subscription_turnover',
        ressourceIdentifier: 'temporalPayment',
        chart: 'bar',
        baseFilters: {
          date_field: 'date',
          aggregate_function: 'sum',
          aggregate_field: 'price',
          aggregate_period: 'day',
          invoice__plannedinvoice__isnull: false,
        },
        dateRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
      },
      {
        name: 'new_members',
        ressourceIdentifier: 'temporalMember',
        chart: 'bar',
        baseFilters: {
          date_field: 'date_joined',
          aggregate_period: 'day',
          aggregate_function: 'count',
          aggregate_field: 'pk',
        },
        dateRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
      },
    ],
  },
];

export default defaultDashboardConfiguration;
