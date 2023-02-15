

const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8080;
const { StationBuilder } = require('./include/StationBuilder');
const nodemailer = require('nodemailer');
const { sendEmail } = require('./src/mail')

const kmToSquareRatio = 10;



//-------------------------------------------------------------------------------------------------------------------------------
//                                                  VARIABLES
//-------------------------------------------------------------------------------------------------------------------------------

const GRIDSIZE = 20;

const cachedData = {
    "device1": {
        deviceId: 1,
        x_pos: 2,
        y_pos: 1,
        status:{
            gas: null,
            temperature: null,
            windSpeed: null
        }
    },
    "device2": {
        deviceId: 2,
        x_pos: 15,
        y_pos: 19,
        status:{
            gas: null,
            temperature: null,
            windSpeed: null
        }
    },
    "device3":{
        deviceId: 3,
        x_pos: 10,
        y_pos: 7,
        status: {}
    }
}


const stationBuilder = new StationBuilder('FWI');

//-------------------------------------------------------------------------------------------------------------------------------
//                                                  VARIABLE INIT
//-------------------------------------------------------------------------------------------------------------------------------

const initGrid = []
for(let i=0; i<GRIDSIZE; i++){
    const tmp = [];
    for(let j=0; j<GRIDSIZE; j++){
        tmp.push({
            deviceId: null,
            x: i,
            y: j,
            visibility: 'hidden',
            color: 'rgba(20,255,0,0.5)',
            probability: 0.00
        });
    }
    initGrid.push(tmp);
}
const HeatMap = []
for(let i=0; i<GRIDSIZE; i++){
    const tmp = [];
    for(let j=0; j<GRIDSIZE; j++){
        tmp.push({
            x: i,
            y: j,
            color: 'rgba(255,20,0,0.5)',
            probability: 0.3
        });
    }
    HeatMap.push(tmp);
}


const initData = {
    gridSize: GRIDSIZE,
    grid: initGrid
}

//-------------------------------------------------------------------------------------------------------------------------------
//                                                  MAILING LIST
//-------------------------------------------------------------------------------------------------------------------------------

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'asthmaticbois@gmail.com',
//       pass: 'LucIsVenom!'
//     }
//   });

//   const mailOptions = {
//     from: 'asthmaticbois@gmail.com',
//     to: 'kilaniabdal@gmail.com',
//     subject: 'Fire Alert',
//     text: 'A fire has been detected in your area. Please take necessary precautions.'
//   };
  

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });

function circleToHeat(radius1, radius2, radius3)
{
    HeatMap.forEach((row) =>{
        row.forEach((element) =>{
            var distance1 = Math.sqrt(Math.pow(cachedData["device1"].x_pos - element.x,2) + Math.pow( cachedData["device1"].y_pos - element.y, 2));
            var distance2 = Math.sqrt(Math.pow(cachedData["device2"].x_pos - element.x,2) + Math.pow( cachedData["device2"].y_pos - element.y, 2));
            var distance3 = Math.sqrt(Math.pow(cachedData["device3"].x_pos - element.x,2) + Math.pow( cachedData["device3"].y_pos - element.y, 2));
            var i = 0;
            let x = new Array(10);
            if(distance1 < radius1*kmToSquareRatio)
                x[0] = 1;
            if(distance2 < radius2*kmToSquareRatio)
            x[0] = 1;
            if(distance3 < radius3*kmToSquareRatio)
                i++;
            
            switch(i){
                case 1:
                    element.color = 'rgba(20,255,0,0.5)';
                    break;
                case 2:
                    element.color = 'rgba(255,255,0,0.5)';
                    break;
                case 3:
                    element.color = 'rgba(255,0,0,0.5)';
                    break;
                default:
                    element.color = 'rgba(0,0,0,0)';
            }
        });
    });
    HeatMap[cachedData["device1"].x_pos][cachedData["device1"].y_pos].color = 'rgba(0,0,255, 0.5)';
    HeatMap[cachedData["device2"].x_pos][cachedData["device2"].y_pos].color = 'rgba(0,0,255, 0.5)';
    HeatMap[cachedData["device3"].x_pos][cachedData["device3"].y_pos].color = 'rgba(0,0,255, 0.5)';
}
//-------------------------------------------------------------------------------------------------------------------------------
//                                                  SERVER DEFINITION
//-------------------------------------------------------------------------------------------------------------------------------
const server = http.createServer((req, res) => {
    const endpoint = req.url.split('?')[0];
    console.log(`${req.socket.remoteAddress.substring(7)}---"${req.method} ${endpoint}"`);
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //                                              GET REQUETS
    //-------------------------------------------------------------------------------------------------------------------------------
    
    if(req.method == 'GET'){
        var fileUrl;
        if(req.url == '/'){
            fileUrl = '/index.html'
        }
        else if(req.url.startsWith('/sensor')){
            const deviceId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('deviceId');
            fileUrl = '/sensor/sensor.html'
        }
        else{
            fileUrl = req.url;
        }
        
        var filePath = path.resolve('.' + fileUrl);
        const fileExt = path.extname(filePath);
        if(fileExt == '.html'){
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if(fileExt == '.ico'){
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'image/x-icon');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.css') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/css');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.js'){
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/javascript');
                fs.createReadStream(filePath).pipe(res);
            });
            
        }
        else{
            if(req.url.startsWith('/api/cachedData')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(cachedData));
                res.end();
            }
            else if(req.url.startsWith('/api/heatMap'))
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(HeatMap));
                res.end();
                circleToHeat(0.5,0.5,0.3);
            }
            else if(req.url.startsWith('/api/initData')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(initData));
                res.end();
            }
            else if(req.url.startswith('/api/allData')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write({'status': 'succ'});
                res.end();
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify({
                    rowSize: 10,
                    columnSize: 10
                }));
                res.end()
            }
        }
    }
    //-------------------------------------------------------------------------------------------------------------------------------
    //                                              POST REQUETS
    //-------------------------------------------------------------------------------------------------------------------------------
    else if(req.method == 'POST'){
        if(req.url.startsWith('/api/change-color-to-red')){
            Object.values(cachedData).forEach((device) => {
                device.color = 'red';
            });
            res.statusCode = 200;
            res.end();
        }
        else if(req.url.startsWith('/api/change-color-to-green')){
            Object.values(cachedData).forEach((device) => {
                device.color = 'green';
            });
            res.statusCode = 200;
            res.end();
        }
        else if(req.url.startsWith('/api/recdata')){
            var recieved = '';
            req.on('data', function(data)
            {
                recieved += data
            });
            req.on('end', function(){
                var data = JSON.parse(recieved);
                cachedData[data['id']].status.gas = data['Co2'];
                cachedData[data['id']].status.temperature = data['temp'];
                cachedData[data['id']].status.humidity = data['humidity'];
                cachedData[data['id']].status.tVOC = data['tVOC'];
                cachedData[data['id']].status.rain = data['rain'];
                cachedData[data['id']].status.windSpeed = data['wind'];
            })
	    res.statusCode = 200;
	    res.end();
            
            
        }
    }
});


server.listen(port, () => {
    console.log(`server listening on port ${port}...`)
    console.log('------------------------------------------------------------------------------------------')
});



// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const Id = {val: 0};
// async function incrId(Id){
//     while(1){
//         await sleep(1000);
//         Id.val += 1;
//         console.log(Id);
//     }
// }
// incrId(Id)
