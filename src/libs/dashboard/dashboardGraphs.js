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
          kind: 'field_value',
          field_value: 'price',
          aggregate_period: 'day',
          aggregate_function: 'sum',
        },
        dateFiltersName: {
          start: 'date__gte',
          end: 'date__lte',
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
        dateFiltersName: {
          start: 'min_date',
          end: 'max_date',
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
          kind: 'count',
        },
        dateFiltersName: {
          start: 'date__gte',
          end: 'date__lte',
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
          kind: 'field_value',
          dropdown_field: 'buyable_item_identifier',
          value_field: 'total_price',
          aggregate_function: 'sum',
        },
        dateFiltersName: {
          start: 'invoice__payments__date__gte',
          end: 'invoce__payments__date__lte',
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
          kind: 'count',
        },
        dateFiltersName: {
          start: 'date_month_inclusive__gte',
          end: 'date_month_inclusive__lte',
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
          kind: 'field_value',
          field_value: 'price',
          aggregate_period: 'day',
          aggregate_function: 'sum',
          invoice__plannedinvoice__isnull: false,
        },
        dateFiltersName: {
          start: 'date__gte',
          end: 'date__lte',
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
          kind: 'count',
          aggregate_period: 'day',
        },
        dateFiltersName: {
          start: 'date_joined__gte',
          end: 'date_joined__lte',
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
