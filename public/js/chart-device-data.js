$(document).ready(() => {

  const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://';
  const webSocket = new WebSocket(protocol + location.host);
  
  var maxLen = 50;
  
  function addData(device, tempIn) {
    console.log("Dev: " + device + " Temp: " + tempIn)
    chartData.datasets[device].data.push(tempIn)
    chartData.labels.push(new Date().getTime("HH:mm:ss"));
    if (chartData.datasets[device].data.length > maxLen) {
      chartData.datasets[device].data.shift();
    }
  }

  function format(message){
    console.log(message.IotData.avtemperatureIn)
    let tempIn = message.IotData.avtemperatureIn;
    let device = -1;
    if (message.DeviceId == "MyDevice1"){
      device = 0
    } else if (message.DeviceId == "MyDevice2"){
      device = 1
    } else if (message.DeviceId == "MyDevice3"){
      device = 2
    }
    addData(device, tempIn)
    myLineChart.update();
  }

  const chartData = {
    labels: [1,2,3,4],
    datasets: [
      {
        data: [23.1,24.1,32.2,32.0],
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
        data: [24.1,32.2,32.0,23.1],
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
        data: [32.2,32.0,23.1,24.1],
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

  webSocket.onmessage = function onMessage(message) {
    try {
      const messageData = JSON.parse(message.data);
      console.log(messageData);
      format(messageData);

    } catch (err) {
      console.error(err);
    }
  };
});
