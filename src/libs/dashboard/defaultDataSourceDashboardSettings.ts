// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';
import type { DataSourceDashboardSettings } from './types';
import {
  MEMBER_GRAPH_IDENTIFIER,
  BOOKING_GRAPH_IDENTIFIER,
  PAYMENT_GRAPH_IDENTIFIER,
  SUBSCRIPTION_GRAPH_IDENTIFIER,
  BILLING_PLAN_GRAPH_IDENTIFIER,
  PRIVATE_BOOKING_GRAPH_IDENTIFIER,
} from '#libs/dashboard/constants';

export const getDefaultDataSourceDashboardSettings: () => DataSourceDashboardSettings =
  () => [
    {
      graphs: [
        {
          uuid: uuidv4(),
          title: '',
          defaultTitle: 'graphDefaultTitles.paymentTemporal',
          graph_family: 'temporal',
          graph_params: {
            date: 'payment_date',
            date_value: 'payment_price',
            aggregation_function_name: 'sum',
          },
          filter_config: {},
          chart_component: 'bar',
          date_filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [1629241200, 1660863599],
                    datatype: 'datetime',
                    comparator: 4,
                    identifier: 'payment_date',
                    time_period: 'year',
                    sub_datatype: 0,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          dashboard_graph_identifier: PAYMENT_GRAPH_IDENTIFIER,
        },
        {
          uuid: uuidv4(),
          title: '',
          defaultTitle: 'graphDefaultTitles.bookingTimeslots',
          graph_family: 'week_timeslots',
          graph_params: {
            date_for_slots: 'date_start',
            ref_for_frequency: 'offer_pk',
          },
          filter_config: {},
          chart_component: 'timeslots',
          date_filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [1629241200, 1660863599],
                    datatype: 'datetime',
                    comparator: 4,
                    identifier: 'date_start',
                    time_period: 'year',
                    sub_datatype: 0,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          dashboard_graph_identifier: BOOKING_GRAPH_IDENTIFIER,
        },
        {
          uuid: uuidv4(),
          title: '',
          defaultTitle: 'graphDefaultTitles.bookingQualitative',
          graph_family: 'qualitative',
          graph_params: {
            group_by: 'source_device',
            group_by_value: 'booking_pk',
            aggregation_function_name: 'count',
          },
          filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [0],
                    datatype: 'booking_status_code',
                    comparator: 4,
                    identifier: 'booking_status_code',
                    time_period: null,
                    sub_datatype: null,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          chart_component: 'pie',
          date_filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [1629241200, 1660863599],
                    datatype: 'datetime',
                    comparator: 4,
                    identifier: 'date_start',
                    time_period: 'year',
                    sub_datatype: 0,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          dashboard_graph_identifier: BOOKING_GRAPH_IDENTIFIER,
        },
        {
          uuid: uuidv4(),
          title: '',
          defaultTitle: 'graphDefaultTitles.bookingTemporal',
          graph_family: 'temporal',
          graph_params: {
            date: 'date_start',
            date_value: 'booking_pk',
            aggregation_function_name: 'count',
          },
          filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [0],
                    datatype: 'booking_status_code',
                    comparator: 4,
                    identifier: 'booking_status_code',
                    time_period: null,
                    sub_datatype: null,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          chart_component: 'area',
          date_filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [1629241200, 1660863599],
                    datatype: 'datetime',
                    comparator: 4,
                    identifier: 'date_start',
                    time_period: 'year',
                    sub_datatype: 0,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          dashboard_graph_identifier: BOOKING_GRAPH_IDENTIFIER,
        },
        {
          uuid: uuidv4(),
          title: '',
          defaultTitle: 'graphDefaultTitles.subscriptionTemporalCount',
          graph_family: 'temporal',
          graph_params: {
            date: 'date',
            date_value: 'plannedinvoice_pk',
            aggregation_function_name: 'count',
          },
          filter_config: {},
          chart_component: 'bar',
          date_filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [1629241200, 1660863599],
                    datatype: 'datetime',
                    comparator: 4,
                    identifier: 'date',
                    time_period: 'year',
                    sub_datatype: 0,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          dashboard_graph_identifier: SUBSCRIPTION_GRAPH_IDENTIFIER,
        },
        {
          uuid: uuidv4(),
          title: '',
          defaultTitle: 'graphDefaultTitles.subscriptionTemporalSum',
          graph_family: 'temporal',
          graph_params: {
            date: 'date',
            date_value: 'price',
            aggregation_function_name: 'sum',
          },
          filter_config: {},
          chart_component: 'bar',
          date_filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [1629241200, 1660863599],
                    datatype: 'datetime',
                    comparator: 4,
                    identifier: 'date',
                    time_period: 'year',
                    sub_datatype: 0,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          dashboard_graph_identifier: SUBSCRIPTION_GRAPH_IDENTIFIER,
        },
        {
          uuid: uuidv4(),
          title: '',
          defaultTitle: 'graphDefaultTitles.memberTemporal',
          graph_family: 'temporal',
          graph_params: {
            date: 'date_joined',
            date_value: 'member_pk',
            accumulate_total_data: false,
            aggregation_function_name: 'count',
          },
          filter_config: {},
          chart_component: 'bar',
          date_filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [1629241200, 1660863599],
                    datatype: 'datetime',
                    comparator: 4,
                    identifier: 'date_joined',
                    time_period: 'year',
                    sub_datatype: 0,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          dashboard_graph_identifier: MEMBER_GRAPH_IDENTIFIER,
        },
        {
          uuid: uuidv4(),
          title: '',
          defaultTitle: 'graphDefaultTitles.privateBookingTemporal',
          graph_family: 'temporal',
          graph_params: {
            date: 'date_start',
            date_value: 'privatebooking_pk',
            aggregation_function_name: 'count',
          },
          filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [0],
                    datatype: 'booking_status_code',
                    comparator: 4,
                    identifier: 'booking_status_code',
                    time_period: null,
                    sub_datatype: null,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          chart_component: 'area',
          date_filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [1629241200, 1660863599],
                    datatype: 'datetime',
                    comparator: 4,
                    identifier: 'date_start',
                    time_period: 'year',
                    sub_datatype: 0,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          dashboard_graph_identifier: PRIVATE_BOOKING_GRAPH_IDENTIFIER,
        },
        {
          uuid: uuidv4(),
          title: '',
          defaultTitle: 'graphDefaultTitles.billingPlanTemporal',
          graph_family: 'temporal',
          graph_params: {
            date: 'plan_date_start',
            date_value: 'billingplan_pk',
            accumulate_total_data: false,
            aggregation_function_name: 'count',
          },
          filter_config: {},
          chart_component: 'bar',
          date_filter_config: {
            groups: [
              {
                uuid: uuidv4(),
                filters_data: [
                  {
                    uuid: uuidv4(),
                    value: [1629241200, 1660863599],
                    datatype: 'datetime',
                    comparator: 4,
                    identifier: 'plan_date_start',
                    time_period: 'trimester',
                    sub_datatype: 0,
                  },
                ],
                inner_operand: 1,
                display_has_single: true,
              },
            ],
            group_operand: 1,
          },
          dashboard_graph_identifier: BILLING_PLAN_GRAPH_IDENTIFIER,
        },
      ],
      tab_label: 'main',
    },
  ];
