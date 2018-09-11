// @flow
import React, { Component } from 'react';
import Highcharts from 'highcharts';

import { translate } from 'react-i18next';

type Props = {
  t: (x: string) => string,
  graphId: number,
};

export class MemberBookingGraph extends Component<Props> {
  drawChart = (data: *, graphId: number) => {
    const { t } = this.props;
    Highcharts.chart(graphId, {
      chart: {
        zoomType: 'xy',
      },
      title: {
        text: 'Réservations',
      },
      xAxis: [
        {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          crosshair: true,
        },
      ],
      yAxis: [
        {
          // Primary yAxis
          title: {
            text: 'Réservations',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          labels: {
            format: '{value}',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        {
          // Secondary yAxis
          title: {
            text: 'CA',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          labels: {
            format: '{value} €',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor:
          // prettier-ignore
          (Highcharts.theme && Highcharts.theme.legendBackgroundColor)
          || '#FFFFFF',
      },
      series: [
        {
          name: 'CA',
          type: 'column',
          yAxis: 1,
          data: [
            49.9,
            71.5,
            106.4,
            129.2,
            144.0,
            176.0,
            135.6,
            148.5,
            216.4,
            194.1,
            95.6,
            54.4,
          ],
          tooltip: {
            valueSuffix: ' €',
          },
        },
        {
          name: t('common.bookings'),
          type: 'spline',
          data: [
            7.0,
            6.9,
            9.5,
            14.5,
            18.2,
            21.5,
            25.2,
            26.5,
            23.3,
            18.3,
            13.9,
            9.6,
          ],
          tooltip: {
            valueSuffix: '',
          },
        },
      ],
    });
  };

  componentDidMount() {
    this.drawChart(null, this.props.graphId);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.drawChart(null, nextProps.graphId);
  }

  render() {
    return (
      <div
        id={this.props.graphId}
        style={{ minWidth: '230px', height: '350px', margin: '0 auto' }}
      />
    );
  }
}

export default translate()(MemberBookingGraph);
