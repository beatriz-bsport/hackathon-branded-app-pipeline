import type { DataSourceDashboardSettings } from './types';
import {
  MEMBER_GRAPH_IDENTIFIER,
  BOOKING_GRAPH_IDENTIFIER,
  PAYMENT_GRAPH_IDENTIFIER,
  SUBSCRIPTION_GRAPH_IDENTIFIER,
  PRIVATE_BOOKING_GRAPH_IDENTIFIER,
} from '#libs/dashboard/constants';

const defaultDataSourceDashboardSettings: DataSourceDashboardSettings = [
  {
    graphs: [
      {
        uuid: 'a8ce1a0f-85a2-43ad-b6aa-a028bd4e01c5',
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
              uuid: '2708042e-4a23-4736-b8d4-f3127a8fc093',
              filters_data: [
                {
                  uuid: '89bc45c4-a0e7-4a84-914e-4dbf24e856c8',
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
        uuid: '4d0605f6-5545-4137-a654-629288e43ca3',
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
              uuid: 'bc132edf-0db8-41b5-9ad2-087a14cf7300',
              filters_data: [
                {
                  uuid: 'e20e8a74-a97a-4ea4-83b7-e8b9fa54e69d',
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
        uuid: '011fa060-1f0f-4111-bf5d-1a405038849b',
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
              uuid: '25d0757a-82a9-4d63-8253-d3207171dbee',
              filters_data: [
                {
                  uuid: '3251e552-9e1f-4cbe-aaf2-1c6b4af505b9',
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
              uuid: '848dd11a-8b6b-4ab8-a19d-7fbc5858a28d',
              filters_data: [
                {
                  uuid: 'f0dddd7a-8a77-4bce-8110-b51d406b27a8',
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
        uuid: 'e8e50081-63cc-4750-b79c-b1ec2495a7bd',
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
              uuid: '9925bfbc-e8b9-4169-a7b5-0804f76cd207',
              filters_data: [
                {
                  uuid: '4e561c64-8cc7-4780-a51c-ed36c560b064',
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
              uuid: '3bdea1c0-b281-46eb-9a7a-acc74437a0d3',
              filters_data: [
                {
                  uuid: '772f51f7-2f48-45ef-b8eb-a38f25db9a84',
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
        uuid: 'f405fc53-369e-4a90-9290-2536dcdb49e1',
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
              uuid: '7788d1de-f78b-4312-8fcc-875d08a2211b',
              filters_data: [
                {
                  uuid: '66a3ce54-e63e-4b8c-8cf1-de578a718adf',
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
        uuid: '5a4b721e-69d1-41ad-9b8c-b6066e81c9d4',
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
              uuid: '5913c8f8-06bd-485d-b541-ae75b87ba42e',
              filters_data: [
                {
                  uuid: '59e36595-83f4-4bcd-b2e1-7b3dcaecf5ac',
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
        uuid: 'ee51a2ee-6b08-4236-bc20-095aa3a2e776',
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
              uuid: '167ebe47-3aa5-4bf2-85a0-755e37cd5cea',
              filters_data: [
                {
                  uuid: '9e69b370-b992-4f08-b63b-d43ad8919a8c',
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
        uuid: 'f3517360-ffcd-4b56-8099-0cb832d81018',
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
              uuid: 'd7ebf624-0bcf-46de-9c70-5be2b857f0f8',
              filters_data: [
                {
                  uuid: '9675f161-55b2-4262-9f29-e000940daab5',
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
              uuid: 'd51962ba-fbf1-4f21-89ed-f27cbc6379d4',
              filters_data: [
                {
                  uuid: 'fc6f3b37-03d0-4f83-9dd1-425c91e94228',
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
    ],
    tab_label: 'main',
  },
];
export default defaultDataSourceDashboardSettings;
