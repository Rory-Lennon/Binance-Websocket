// This application starts a websocket to a binance stream for BTC price.  
// The websocket sends data once per second.
// When the data arrives, it is differentiated and rearranged into 
// javascript arrays, which are sent to TradingView charts and displayed in the webapp.    

let ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@miniTicker')
let lastPrice = 0.
let first_pass = true
let temp_val = 0.

const chartProperties_01 = {
    width:600,
    height:200,
    timeScale:{
      timeVisible:true,
      secondsVisible:true,
      minBarSpacing:0.001,
      barSpacing:0.5,
    },
}

const domElement_01 = document.getElementById('tvchart_01');
const tvchart_01 = LightweightCharts.createChart(domElement_01, chartProperties_01);

const domElement_02 = document.getElementById('tvchart_02');
const tvchart_02 = LightweightCharts.createChart(domElement_02, chartProperties_01);

const domElement_03 = document.getElementById('tvchart_03');
const tvchart_03 = LightweightCharts.createChart(domElement_03, chartProperties_01);

const line_series_01 = tvchart_01.addLineSeries({ color: 'blue', lineWidth: 1 });
const line_series_02 = tvchart_02.addLineSeries({ color: 'red', lineWidth: 1 });
const line_series_03 = tvchart_03.addLineSeries({ color: 'green', lineWidth: 1 });

tvchart_01.timeScale().fitContent();
tvchart_02.timeScale().fitContent();
tvchart_03.timeScale().fitContent();

ws.onmessage=(event)=> {

//    var currentTime = new Date()
//    var millisecs = currentTime.getTime()
//    var tm = parseInt(millisecs/1000)

    let jdata = JSON.parse(event.data)
    var tm = jdata.E / 1000 // event time
    var c = jdata.c // close price
    var v = jdata.v // Total traded base asset volume
    var vi = v - temp_val

    if(first_pass == false){

      line_series_01.update({ time:tm, value:c });
      line_series_02.update({ time:tm, value:v });
      line_series_03.update({ time:tm, value:vi });

      var visTimeRange = tvchart_01.timeScale().getVisibleLogicalRange();
      tvchart_02.timeScale().setVisibleLogicalRange(visTimeRange);
      tvchart_03.timeScale().setVisibleLogicalRange(visTimeRange);     
    }
    first_pass = false
    temp_val = v
}

function clickResetRange(){
  tvchart_01.timeScale().fitContent()
}
