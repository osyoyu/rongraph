'use strict';

document.addEventListener('DOMContentLoaded', () => {
  console.log('hi');

  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', '/api/wordcount/all', true);

  xhr.addEventListener('load', () => {
    console.log(xhr.response);

    let chartData = xhr.response.history.map((item, i) => {
      return [new Date(item.timestamp * 1000).getTime(), parseInt(item.wordcount)]
    });
    chartData.push([new Date().getTime(), chartData[chartData.length-1][1]]);

    console.log(chartData);

    Highcharts.chart('chart', {
      title: {
        text: '卒論の文字数',
      },

      xAxis: {
        type: 'datetime',
      },

      yAxis: {
        title: {
          text: null
        },
        min: 0,
      },

      legend: {
        align: 'left',
        verticalAlign: 'top',
        borderWidth: 0
      },


      // plotOptions: {
      //   areaspline: {
      //     fillColor: {
      //       linearGradient: {
      //         x1: 0,
      //         y1: 0,
      //         x2: 0,
      //         y2: 1
      //       },
      //       stops: [
      //         [0, Highcharts.getOptions().colors[5]],
      //         [1, Highcharts.Color(Highcharts.getOptions().colors[5]).setOpacity(0).get('rgba')]
      //       ]
      //     },
      //     marker: {
      //       radius: 2,
      //       fillColor: "#000000"
      //     },
      //     lineWidth: 3,
      //     lineColor: Highcharts.getOptions().colors[5],
      //     states: {
      //       hover: {
      //         lineWidth: 1
      //       }
      //     },
      //     threshold: null
      //   }
      // },
      // tooltip: {
      //   formatter: function () {
      //     return '<b>' + this.series.name + '</b><br/>' +
      //       Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
      //       Highcharts.numberFormat(this.y, 2);
      //   }
      // },
      //
      exporting: {
        enabled: false
      },

      series: [{
        name: '文字数',
        data: chartData,
      }]
    });
  });

  xhr.send();

});
