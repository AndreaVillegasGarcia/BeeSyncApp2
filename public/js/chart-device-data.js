$(document).ready(() => {

  const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
  const webSocket = new WebSocket(protocol + location.host);
  
  var maxLen = 50;
  var count = 0;
  
  function addData(device, tempIn, tempOut) {
    chartData.datasets[device].data.push(tempIn)
    chartData2.datasets[device].data.push(tempOut)
    
    if (chartData.datasets[device].data.length > maxLen || chartData2.datasets[device].data.length > maxLen) {
      chartData.datasets[device].data.shift();
      chartData2.datasets[device].data.shift();
    }
  }

  function format(message){
    console.log(message.IotData.avtemperatureIn)
    let tempIn = message.IotData.avtemperatureIn;
    let tempOut = message.IotData.avtemperatureOut;
    let device = -1;
    if (message.DeviceId == "MyDevice1"){
      device = 0
    } else if (message.DeviceId == "MyDevice2"){
      device = 1
    } else if (message.DeviceId == "MyDevice3"){
      device = 2
    }
    addData(device, tempIn, tempOut)
    myLineChart.update();
    myLineChart2.update();
  }

  const chartData = {
    labels: [],
    datasets: [
      {
        data: [],
        fill: true,
        label: 'Temp #D1',
        yAxisID: 'Temperature',
        borderColor: 'rgba(255, 204, 0, 1)',
        pointBoarderColor: 'rgba(255, 204, 0, 1)',
        backgroundColor: 'rgba(255, 204, 0, 0.4)',
        pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
        pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
        spanGaps: false,
      },
      {
        fill: true,
        label: 'Temp #D2',
        data: [],
        yAxisID: 'Temperature',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        spanGaps: true,
      },
      {
        fill: true,
        label: 'Temp #D3',
        data: [],
        yAxisID: 'Temperature',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        spanGaps: true,
      }
    ]
  };

  const chartOptions = {
    scales: {
      xAxes: [{}],
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature (ºC)',
          display: true,
        },
        position: 'left',
      }]
    }
  };

  const ctx = document.getElementById('iotChart').getContext('2d');
  const myLineChart = new Chart(
    ctx,
    {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });

  // -------------------- CHART 2 ----------------------

  const chartData2 = {
    labels: [],
    datasets: [
      {
        data: [],
        fill: true,
        label: 'Temp #D1',
        yAxisID: 'Temperature',
        borderColor: 'rgba(255, 204, 0, 1)',
        pointBoarderColor: 'rgba(255, 204, 0, 1)',
        backgroundColor: 'rgba(255, 204, 0, 0.4)',
        pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
        pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
        spanGaps: false,
      },
      {
        fill: true,
        label: 'Temp #D2',
        data: [],
        yAxisID: 'Temperature',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        spanGaps: true,
      },
      {
        fill: true,
        label: 'Temp #D3',
        data: [],
        yAxisID: 'Temperature',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        spanGaps: true,
      }
    ]
  };

  const chartOptions2 = {
    scales: {
      xAxes: [{}],
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature (ºC)',
          display: true,
        },
        position: 'left',
      }]
    }
  };

  const ctx2 = document.getElementById('iotChart2').getContext('2d');
  const myLineChart2 = new Chart(
    ctx2,
    {
      type: 'line',
      data: chartData2,
      options: chartOptions2,
    });

  // -------------------- FIN CHART 2 -----------------------------------


  webSocket.onmessage = function onMessage(message) {
    try {
      const messageData = JSON.parse(message.data);
      console.log(messageData);
      format(messageData);

      if(count == 0 || count == 1){
        //chartData.labels.push(new Date().getTime("HH:mm:ss"));
        count ++;
      } else if (count == 2) {
        chartData.labels.push(new Date().toLocaleTimeString())
        chartData2.labels.push(new Date().toLocaleTimeString())
        count = 0;
      }
    } catch (err) {
      console.error(err);
    }
  };
});
