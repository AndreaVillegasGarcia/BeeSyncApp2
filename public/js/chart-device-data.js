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
    labels: [],
    datasets: [
      {
        data: [],
        fill: true,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: 'rgba(255, 204, 0, 1)',
        pointBoarderColor: 'rgba(255, 204, 0, 1)',
        backgroundColor: 'rgba(255, 204, 0, 0.4)',
        pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
        pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
        spanGaps: false,
      },
      {
        fill: false,
        label: 'Humidity',
        data: [],
        yAxisID: 'Humidity',
        borderColor: 'rgba(24, 120, 240, 1)',
        pointBoarderColor: 'rgba(24, 120, 240, 1)',
        backgroundColor: 'rgba(24, 120, 240, 0.4)',
        pointHoverBackgroundColor: 'rgba(24, 120, 240, 1)',
        pointHoverBorderColor: 'rgba(24, 120, 240, 1)',
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
      },
      {
        id: 'Humidity',
        type: 'linear',
        scaleLabel: {
          labelString: 'Humidity (%)',
          display: true,
        },
        position: 'right',
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
