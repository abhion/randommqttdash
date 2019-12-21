
const retCarbVal = document.querySelector('#retCarbVal');
const supCarbVal = document.querySelector('#supCarbVal');
const ampVal = document.querySelector('#ampVal');
const voltVal = document.querySelector('#voltVal');

const avgRetCarb = document.querySelector('#avgRetCarb');
const avgSupCarb = document.querySelector('#avgSupCarb');
const avgAmp = document.querySelector('#avgAmp');
const avgVolt = document.querySelector('#avgVolt');
var ctx = document.getElementById('myChart');
var ctx = document.getElementById('myChart').getContext('2d');

let returnCarbonArray = [], supplyCarbArray = [], ampArray = [], voltArray = [], averageArray = [];



new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Return CO2', 'Supply CO2', 'Amps', 'Volts'],
        datasets: [{
            label: '# values',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var client = new Paho.Client('164.52.193.83', 1884, "clientIdj");

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({ onSuccess: onConnect, useSSL:true });


function onConnect() {
    console.log("onConnect");
    client.subscribe("real/#");

}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}
function onMessageArrived(message) {
    
    let messageArrived = null;
    if (message) {
        messageArrived = JSON.parse(JSON.stringify(message));
        switch (messageArrived["topic"]) {
            case 'real/retcarb':
                returnCarbonArray.push(messageArrived.payloadString);
                break;
            case 'real/supcarb':
                supplyCarbArray.push(messageArrived.payloadString);
                break;
            case 'real/amp':
                ampArray.push(messageArrived.payloadString);
                break;
            case 'real/volt':
                voltArray.push(messageArrived.payloadString);
                break;
            default:
                break;
        }
    }
}

function calculateAverage(array){

    if(!array.length){
        return 0;
    }

    let total = array.reduce((ac, v) => ac+ +v, 0);
    return (total/array.length).toFixed(2);
}

function refreshValues(){
    
    if(returnCarbonArray.length){
        retCarbVal.innerText = (+returnCarbonArray[returnCarbonArray.length - 1]).toFixed(2);
        avgRetCarb.innerText = calculateAverage(returnCarbonArray);
        averageArray[0] =  calculateAverage(returnCarbonArray);
    }
    else{
        retCarbVal.innerText = 0;
        avgRetCarb.innerText = 0;
    }

    if(voltArray.length){
        voltVal.innerText = (+voltArray[voltArray.length - 1]).toFixed(2);
        avgVolt.innerText = calculateAverage(voltArray);
        averageArray[1] =  calculateAverage(voltArray);
    }
    else{
        voltVal.innerText = 0;
        avgVolt.innerText = 0;
    }

    if(supplyCarbArray.length){
        supCarbVal.innerText = (+supplyCarbArray[supplyCarbArray.length - 1]).toFixed(2);
    avgSupCarb.innerText = calculateAverage(supplyCarbArray);
    averageArray[2] =  calculateAverage(supplyCarbArray);
    
    }
    else{
        supCarbVal.innerText = 0;
        avgSupCarb.innerText = 0;
    }

    if(ampArray.length){
        ampVal.innerText = (+ampArray[ampArray.length - 1]).toFixed(2);
        avgAmp.innerText = calculateAverage(ampArray);
        averageArray[3] =  calculateAverage(ampArray);
    }
    else{
        ampVal.innerText = 0;
        avgAmp.innerText = 0;
    }
    
    
   
   
}

function refreshChart(){

}


//setInterval(refreshChart, 1000);
setInterval(refreshValues, 3000);

// {
//     "payloadString": "1.1188553039612654",
//     "payloadBytes":{"0":49,"1":46,"2":49,"3":49,"4":56,"5":56,"6":53,"7":53,"8":51,"9":48,"10":51,"11":57,"12":54,"13":49,"14":50,"15":54,"16":53,"17":52},
//     "destinationName":"real/watt",
//     "qos":0,
//     "retained":true,
//     "topic":"real/watt",
//     "duplicate":false
//     }