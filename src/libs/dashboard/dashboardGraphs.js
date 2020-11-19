const dashboardGraphsRaw = [
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
        defaultRange: {
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
        defaultRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
        defaultFilters: {},
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
        defaultRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
        defaultFilters: { booking_status_code__in: [0] },
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
        dateFiltersName: {
          start: 'invoice__payments__date__gte',
          end: 'invoice__payments__date__lte',
        },
        defaultRange: {
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
        defaultRange: {
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
        defaultRange: {
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
        defaultRange: {
          start: null,
          end: null,
          kind: 'current_year',
        },
      },
    ],
  },
];

export default dashboardGraphsRaw;
